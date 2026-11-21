import type { NextRequest } from 'next/server'

import crypto from 'node:crypto'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { tenants } from '@/db/schema/tenants'
import { env } from '@/lib/env'

const ALLOWED_EVENTS = ['page_view', 'checkout_start', 'checkout_complete'] as const
type AllowedEvent = (typeof ALLOWED_EVENTS)[number]

export interface Acquisition {
  campaign?: string
  medium?: string
  referrer?: string
  source?: string
}

interface RateLimitRecord {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

function computeVisitorHash(
  ip: string,
  userAgent: string,
  tenantId: string,
): string {
  const dateStr = new Date().toISOString().slice(0, 10)
  const dailySalt = crypto
    .createHmac('sha256', env.ANALYTICS_HASH_SECRET)
    .update(dateStr)
    .digest('hex')
  return crypto
    .createHash('sha256')
    .update(`${ip}${userAgent}${tenantId}${dailySalt}`)
    .digest('hex')
}

function parseAcquisition(
  request: NextRequest,
  event: string,
): Acquisition | null {
  if (event !== 'page_view') {
    return null
  }

  const referer = request.headers.get('referer') || request.headers.get('referrer')
  const url = request.nextUrl || new URL(request.url)
  const utmSource = url.searchParams.get('utm_source')
  const utmMedium = url.searchParams.get('utm_medium')
  const utmCampaign = url.searchParams.get('utm_campaign')

  let externalReferrer: string | null = null
  let referrerSource: string | null = null

  if (referer) {
    try {
      const parsedReferer = new URL(referer)
      const currentHost = url.host || request.headers.get('host') || ''
      if (parsedReferer.host !== currentHost) {
        externalReferrer = referer
        referrerSource = parsedReferer.hostname.replace(/^www\./, '')
      }
    } catch {
      externalReferrer = referer
      referrerSource = referer
    }
  }

  if (!externalReferrer && !utmSource && !utmMedium && !utmCampaign) {
    return null
  }

  const acquisition: Acquisition = {}

  if (utmSource) {
    acquisition.source = utmSource
  } else if (referrerSource) {
    acquisition.source = referrerSource
  }

  if (utmMedium) {
    acquisition.medium = utmMedium
  }
  if (utmCampaign) {
    acquisition.campaign = utmCampaign
  }
  if (externalReferrer) {
    acquisition.referrer = externalReferrer
  }

  return Object.keys(acquisition).length > 0 ? acquisition : null
}

export async function POST(request: NextRequest): Promise<Response> {
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

  if (!ALLOWED_EVENTS.includes(event as AllowedEvent)) {
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
    tenantId: tenant.id,
    visitorHash,
  })

  return new Response(null, { status: 204 })
}
