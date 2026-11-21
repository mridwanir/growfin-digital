import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { POST as trackHandler } from '@/app/api/analytics/track/route'
import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { tenants } from '@/db/schema/tenants'

describe('Checkout funnel analytics integration', () => {
  const storeSlug = 'funnel-test-store'
  let tenantId: string

  beforeAll(async () => {
    await db.delete(tenants).where(eq(tenants.slug, storeSlug))

    const [tenant] = await db
      .insert(tenants)
      .values({
        name: 'Funnel Test Store',
        category: 'Food & Beverage',
        slug: storeSlug,
        status: 'published',
      })
      .returning()
    tenantId = tenant.id
  })

  afterAll(async () => {
    if (tenantId) {
      await db.delete(analyticsEvents).where(eq(analyticsEvents.tenantId, tenantId))
      await db.delete(tenants).where(eq(tenants.id, tenantId))
    }
  })

  it('tracks checkout_start event when cart drawer opens', async () => {
    const startRequest = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'checkout_start',
        slug: storeSlug,
      }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.10',
      },
    })

    const response = await trackHandler(startRequest)
    expect(response.status).toBe(204)

    const events = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    const startEvent = events.find(e => e.event === 'checkout_start')
    expect(startEvent).toBeDefined()
    expect(startEvent?.tenantId).toBe(tenantId)
  })

  it('tracks checkout_complete event with contextual metadata when checkout CTA is clicked', async () => {
    const metadata = {
      fulfillmentMode: 'DINE_IN',
      itemCount: 2,
      total: 45000,
    }

    const completeRequest = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'checkout_complete',
        metadata,
        slug: storeSlug,
      }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.10',
      },
    })

    const response = await trackHandler(completeRequest)
    expect(response.status).toBe(204)

    const events = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    const completeEvent = events.find(e => e.event === 'checkout_complete')
    expect(completeEvent).toBeDefined()
    expect(completeEvent?.tenantId).toBe(tenantId)
    expect(completeEvent?.eventData).toEqual(metadata)
  })

  it('complete user journey produces page_view, checkout_start, and checkout_complete rows', async () => {
    // Clear previous events for a fresh journey test
    await db.delete(analyticsEvents).where(eq(analyticsEvents.tenantId, tenantId))

    const visitorIp = '203.0.113.99'
    const userAgent = 'Mozilla/5.0 MobileJourney/1.0'

    // Step 1: Visitor lands on storefront -> page_view
    const pageViewReq = new NextRequest(
      'http://localhost:3000/api/analytics/track?utm_source=tiktok&utm_medium=video',
      {
        method: 'POST',
        body: JSON.stringify({
          event: 'page_view',
          slug: storeSlug,
        }),
        headers: {
          'content-type': 'application/json',
          referer: 'https://tiktok.com/',
          'user-agent': userAgent,
          'x-forwarded-for': visitorIp,
        },
      },
    )
    const pageViewRes = await trackHandler(pageViewReq)
    expect(pageViewRes.status).toBe(204)

    // Step 2: Visitor opens cart drawer -> checkout_start
    const checkoutStartReq = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'checkout_start',
        slug: storeSlug,
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': userAgent,
        'x-forwarded-for': visitorIp,
      },
    })
    const checkoutStartRes = await trackHandler(checkoutStartReq)
    expect(checkoutStartRes.status).toBe(204)

    // Step 3: Visitor completes order via WhatsApp -> checkout_complete
    const checkoutCompleteReq = new NextRequest('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'checkout_complete',
        slug: storeSlug,
        metadata: {
          fulfillmentMode: 'TAKEAWAY',
          itemCount: 3,
          total: 75000,
        },
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': userAgent,
        'x-forwarded-for': visitorIp,
      },
    })
    const checkoutCompleteRes = await trackHandler(checkoutCompleteReq)
    expect(checkoutCompleteRes.status).toBe(204)

    // Verify all 3 events are stored with same tenantId and same visitorHash
    const rows = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.tenantId, tenantId))

    expect(rows).toHaveLength(3)

    const eventsRecorded = rows.map(r => r.event)
    expect(eventsRecorded).toContain('page_view')
    expect(eventsRecorded).toContain('checkout_start')
    expect(eventsRecorded).toContain('checkout_complete')

    // All events in the same session share the same visitor hash
    const visitorHashes = new Set(rows.map(r => r.visitorHash))
    expect(visitorHashes.size).toBe(1)
  })
})
