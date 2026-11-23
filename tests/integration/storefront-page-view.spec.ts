import type { TestTenantFixture } from '../fixtures/tenant-fixture'

import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { POST as trackHandler } from '@/app/api/analytics/track/route'
import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'

import { createTestTenant } from '../fixtures/tenant-fixture'

describe('Storefront Page View tracking integration', () => {
  let fixture: TestTenantFixture
  let storeSlug: string
  let tenantId: string

  beforeAll(async () => {
    fixture = await createTestTenant({
      name: 'Page View Test Store',
      category: 'Food & Beverage',
    })
    storeSlug = fixture.slug
    tenantId = fixture.tenantId
  })

  afterAll(async () => {
    await fixture?.cleanup()
  })

  it('visiting a storefront page produces a page_view row in analytics_events with the correct tenant_id', async () => {
    const trackRequest = new NextRequest(
      `http://localhost:3000/api/analytics/track?utm_source=instagram&utm_medium=bio`,
      {
        method: 'POST',
        body: JSON.stringify({
          event: 'page_view',
          slug: storeSlug,
        }),
        headers: {
          'content-type': 'application/json',
          referer: 'https://l.instagram.com/',
          'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
          'x-forwarded-for': '203.0.113.195',
        },
      },
    )

    const response = await trackHandler(trackRequest)
    expect(response.status).toBe(204)

    const events = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(events.length).toBeGreaterThanOrEqual(1)
    const pageViewEvent = events.find(e => e.event === 'page_view')
    expect(pageViewEvent).toBeDefined()
    expect(pageViewEvent?.tenantId).toBe(tenantId)
    expect(pageViewEvent?.acquisition).toEqual({
      medium: 'bio',
      referrer: 'https://l.instagram.com/',
      source: 'instagram',
    })
    expect(typeof pageViewEvent?.visitorHash).toBe('string')
    expect(pageViewEvent?.visitorHash.length).toBe(64)
  })
})
