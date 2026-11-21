import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { userInNeonAuth } from '@/db/schema/auth'
import { tenants } from '@/db/schema/tenants'
import { getTenantAnalyticsMetrics } from '@/lib/dashboard/analytics'

describe('Dashboard analytics metrics seam (getTenantAnalyticsMetrics)', () => {
  const merchant1Id = '99999999-9999-4999-8999-999999999991'
  const merchant2Id = '99999999-9999-4999-8999-999999999992'

  let tenant1Id: string
  let tenant2Id: string

  beforeAll(async () => {
    // Clean up test data
    await db.delete(tenants).where(eq(tenants.slug, 'merchant1-analytics-store'))
    await db.delete(tenants).where(eq(tenants.slug, 'merchant2-analytics-store'))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, merchant1Id))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, merchant2Id))

    // Seed test users
    await db.insert(userInNeonAuth).values([
      {
        id: merchant1Id,
        name: 'Merchant One Analytics',
        email: 'merchant1-analytics@example.com',
        emailVerified: true,
      },
      {
        id: merchant2Id,
        name: 'Merchant Two Analytics',
        email: 'merchant2-analytics@example.com',
        emailVerified: true,
      },
    ])

    // Seed test tenants
    const [t1] = await db
      .insert(tenants)
      .values({
        name: 'Merchant 1 Analytics Store',
        category: 'Retail & Fashion',
        slug: 'merchant1-analytics-store',
        status: 'published',
        userId: merchant1Id,
      })
      .returning()

    const [t2] = await db
      .insert(tenants)
      .values({
        name: 'Merchant 2 Analytics Store',
        category: 'Food & Beverage',
        slug: 'merchant2-analytics-store',
        status: 'published',
        userId: merchant2Id,
      })
      .returning()

    tenant1Id = t1.id
    tenant2Id = t2.id
  })

  afterAll(async () => {
    if (tenant1Id) {
      await db.delete(analyticsEvents).where(eq(analyticsEvents.tenantId, tenant1Id))
      await db.delete(tenants).where(eq(tenants.id, tenant1Id))
    }
    if (tenant2Id) {
      await db.delete(analyticsEvents).where(eq(analyticsEvents.tenantId, tenant2Id))
      await db.delete(tenants).where(eq(tenants.id, tenant2Id))
    }
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, merchant1Id))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, merchant2Id))
  })

  it('handles zero-event state gracefully with zeros and empty topSources', async () => {
    const metrics = await getTenantAnalyticsMetrics(tenant1Id, merchant1Id)

    expect(metrics).toEqual({
      checkoutCompletes: 0,
      checkoutStarts: 0,
      conversionRate: 0,
      pageViews: 0,
      topSources: [],
      uniqueVisitors: 0,
    })
  })

  it('computes today total page views, unique visitors, checkout counts, and conversion rate via SQL aggregation', async () => {
    const now = new Date()

    // Seed events for tenant1:
    // 3 page views from 2 distinct visitors:
    // visitor-A: 2 page views
    // visitor-B: 1 page view
    // 2 checkout_starts (visitor-A, visitor-B)
    // 1 checkout_complete (visitor-A)
    // Conversion rate: 1 / 2 = 50%
    await db.insert(analyticsEvents).values([
      {
        acquisition: { referrer: 'https://google.com', source: 'google' },
        createdAt: now,
        event: 'page_view',
        tenantId: tenant1Id,
        visitorHash: 'hash-visitor-a',
      },
      {
        acquisition: { referrer: 'https://google.com', source: 'google' },
        createdAt: now,
        event: 'page_view',
        tenantId: tenant1Id,
        visitorHash: 'hash-visitor-a',
      },
      {
        acquisition: { referrer: 'https://instagram.com', source: 'instagram' },
        createdAt: now,
        event: 'page_view',
        tenantId: tenant1Id,
        visitorHash: 'hash-visitor-b',
      },
      {
        createdAt: now,
        event: 'checkout_start',
        tenantId: tenant1Id,
        visitorHash: 'hash-visitor-a',
      },
      {
        createdAt: now,
        event: 'checkout_start',
        tenantId: tenant1Id,
        visitorHash: 'hash-visitor-b',
      },
      {
        createdAt: now,
        event: 'checkout_complete',
        tenantId: tenant1Id,
        visitorHash: 'hash-visitor-a',
      },
    ])

    const metrics = await getTenantAnalyticsMetrics(tenant1Id, merchant1Id)

    expect(metrics).not.toBeNull()
    expect(metrics?.pageViews).toBe(3)
    expect(metrics?.uniqueVisitors).toBe(2)
    expect(metrics?.checkoutStarts).toBe(2)
    expect(metrics?.checkoutCompletes).toBe(1)
    expect(metrics?.conversionRate).toBe(50)

    // Top sources extracted from acquisition->>'source':
    // google: 2, instagram: 1
    expect(metrics?.topSources).toEqual([
      { count: 2, source: 'google' },
      { count: 1, source: 'instagram' },
    ])
  })

  it('excludes events from yesterday (filters to current day only)', async () => {
    // Add yesterday event
    const yesterday = new Date(Date.now() - 86400000 * 2)
    await db.insert(analyticsEvents).values([
      {
        acquisition: { source: 'tiktok' },
        createdAt: yesterday,
        event: 'page_view',
        tenantId: tenant1Id,
        visitorHash: 'hash-visitor-yesterday',
      },
    ])

    const metrics = await getTenantAnalyticsMetrics(tenant1Id, merchant1Id)
    // Page views should still be 3 (yesterday excluded)
    expect(metrics?.pageViews).toBe(3)
    expect(metrics?.topSources.map(s => s.source)).not.toContain('tiktok')
  })

  it('scopes metrics to authenticated merchant tenants only and rejects unauthorized access', async () => {
    // Merchant 2 tries to access Merchant 1's tenant
    const unauthorized = await getTenantAnalyticsMetrics(tenant1Id, merchant2Id)
    expect(unauthorized).toBeNull()

    // Merchant 2 accesses their own tenant (currently 0 events)
    const ownMetrics = await getTenantAnalyticsMetrics(tenant2Id, merchant2Id)
    expect(ownMetrics).toEqual({
      checkoutCompletes: 0,
      checkoutStarts: 0,
      conversionRate: 0,
      pageViews: 0,
      topSources: [],
      uniqueVisitors: 0,
    })
  })
})
