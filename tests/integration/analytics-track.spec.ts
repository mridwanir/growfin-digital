import type { TestTenantFixture } from '../fixtures/tenant-fixture'

import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { POST as trackHandler } from '@/app/api/analytics/track/route'
import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'

import { createTestTenant } from '../fixtures/tenant-fixture'

describe('Analytics tracking API seam: POST /api/analytics/track', () => {
  let fixture: TestTenantFixture
  let testSlug: string
  let tenantId: string

  beforeAll(async () => {
    fixture = await createTestTenant({
      name: 'Analytics Test Store',
      category: 'Retail & Fashion',
    })
    testSlug = fixture.slug
    tenantId = fixture.tenantId
  })

  beforeEach(async () => {
    await db.delete(analyticsEvents).where(eq(analyticsEvents.tenantId, tenantId))
  })

  afterAll(async () => {
    await fixture?.cleanup()
  })

  it('returns 400 when the request body is missing required fields (slug, event)', async () => {
    const req1 = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ event: 'page_view' }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    const res1 = await trackHandler(req1)
    expect(res1.status).toBe(400)

    const req2 = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ slug: testSlug }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    const res2 = await trackHandler(req2)
    expect(res2.status).toBe(400)
  })

  it('returns 400 when event is not in the allowed union', async () => {
    const req = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ event: 'unknown_event', slug: testSlug }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    const res = await trackHandler(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid event')
  })

  it('returns 400 when slug does not match any tenant', async () => {
    const req = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ event: 'page_view', slug: 'non-existent-tenant-slug' }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    const res = await trackHandler(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Tenant not found')
  })

  it('returns 204 and inserts one row with correct tenant_id, event, visitor_hash, and created_at', async () => {
    const req = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'page_view',
        slug: testSlug,
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 TestBrowser',
        'x-forwarded-for': '192.168.1.100',
      },
    })

    const res = await trackHandler(req)
    expect(res.status).toBe(204)

    const rows = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(rows).toHaveLength(1)
    const row = rows[0]
    expect(row.tenantId).toBe(tenantId)
    expect(row.event).toBe('page_view')
    expect(typeof row.visitorHash).toBe('string')
    expect(row.visitorHash.length).toBe(64)
    expect(row.createdAt).toBeInstanceOf(Date)
  })

  it('inserts acquisition data when UTM params and Referer are present on a page_view event', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/analytics/track?utm_source=google&utm_medium=cpc&utm_campaign=summer-sale',
      {
        method: 'POST',
        body: JSON.stringify({
          event: 'page_view',
          slug: testSlug,
        }),
        headers: {
          'content-type': 'application/json',
          referer: 'https://google.com/search?q=growfin',
          'user-agent': 'TestAgent',
          'x-forwarded-for': '10.0.0.1',
        },
      },
    )

    const res = await trackHandler(req)
    expect(res.status).toBe(204)

    const [row] = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(row.acquisition).toEqual({
      campaign: 'summer-sale',
      medium: 'cpc',
      referrer: 'https://google.com/search?q=growfin',
      source: 'google',
    })
  })

  it('inserts acquisition: null when no UTM params or Referer are present', async () => {
    const req = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'page_view',
        slug: testSlug,
      }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '10.0.0.2',
      },
    })

    const res = await trackHandler(req)
    expect(res.status).toBe(204)

    const [row] = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(row.acquisition).toBeNull()
  })

  it('stores event_data from the client metadata field', async () => {
    const metadata = { cartTotal: 150000, itemsCount: 3 }
    const req = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'checkout_start',
        metadata,
        slug: testSlug,
      }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '10.0.0.3',
      },
    })

    const res = await trackHandler(req)
    expect(res.status).toBe(204)

    const [row] = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(row.event).toBe('checkout_start')
    expect(row.eventData).toEqual(metadata)
    expect(row.acquisition).toBeNull()
  })

  it('produces different visitor_hash values for different IPs with the same user agent and tenant', async () => {
    const ua = 'Mozilla/5.0 IdenticalAgent'

    const req1 = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ event: 'page_view', slug: testSlug }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': ua,
        'x-forwarded-for': '1.1.1.1',
      },
    })
    await trackHandler(req1)

    const req2 = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ event: 'page_view', slug: testSlug }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': ua,
        'x-forwarded-for': '2.2.2.2',
      },
    })
    await trackHandler(req2)

    const rows = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(rows).toHaveLength(2)
    expect(rows[0].visitorHash).not.toBe(rows[1].visitorHash)
  })

  it('produces the same visitor_hash for the same IP, user agent, and tenant within the same day', async () => {
    const ip = '192.168.1.50'
    const ua = 'Mozilla/5.0 Consistent'

    const req1 = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ event: 'page_view', slug: testSlug }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': ua,
        'x-forwarded-for': ip,
      },
    })
    await trackHandler(req1)

    const req2 = new NextRequest('http://localhost:3000/api/analytics/track', {
      body: JSON.stringify({ event: 'page_view', slug: testSlug }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': ua,
        'x-forwarded-for': ip,
      },
    })
    await trackHandler(req2)

    const rows = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(rows).toHaveLength(2)
    expect(rows[0].visitorHash).toBe(rows[1].visitorHash)
  })

  it('returns 429 after 60 requests from the same IP within one minute', async () => {
    const ip = '172.16.0.99'

    for (let i = 0; i < 60; i++) {
      const req = new NextRequest('http://localhost:3000/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          event: 'page_view',
          slug: testSlug,
        }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': ip,
        },
      })
      const res = await trackHandler(req)
      expect(res.status).toBe(204)
    }

    const blockedReq = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'page_view',
        slug: testSlug,
      }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
    })
    const blockedRes = await trackHandler(blockedReq)
    expect(blockedRes.status).toBe(429)
  })
})
