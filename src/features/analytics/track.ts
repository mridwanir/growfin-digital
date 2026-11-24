import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { tenants } from '@/features/auth/server'

import { parseAcquisition } from './acquisition'
import { computeVisitorHash } from './visitor-hash'

import 'server-only'

const ALLOWED_EVENTS = ['page_view', 'checkout_start', 'checkout_complete'] as const

interface RateLimitRecord {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

export async function handleAnalyticsTrack(request: NextRequest): Promise<Response> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const now = Date.now()
  const rateLimitRecord = rateLimitMap.get(ip)
  if (!rateLimitRecord || now > rateLimitRecord.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
  } else {
    if (rateLimitRecord.count >= 60) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
    rateLimitRecord.count++
  }

  let body: {
    event?: unknown
    metadata?: unknown
    slug?: unknown
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { event, metadata, slug } = body

  if (!slug || typeof slug !== 'string' || !event || typeof event !== 'string') {
    return NextResponse.json({ error: 'Missing required fields: slug and event' }, { status: 400 })
  }

  if (!ALLOWED_EVENTS.includes(event as (typeof ALLOWED_EVENTS)[number])) {
    return NextResponse.json({ error: `Invalid event: ${event}` }, { status: 400 })
  }

  const [tenant] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1)

  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
  }

  const userAgent = request.headers.get('user-agent') || ''
  const visitorHash = computeVisitorHash(ip, userAgent, tenant.id)
  const acquisition = parseAcquisition(request, event)

  await db.insert(analyticsEvents).values({
    acquisition,
    event,
    eventData: (metadata as Record<string, unknown>) || null,
    organizationId: tenant.id,
    visitorHash,
  })

  return new Response(null, { status: 204 })
}
