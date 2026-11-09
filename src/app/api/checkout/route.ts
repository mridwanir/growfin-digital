import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { orders } from '@/db/schema/orders'
import { tenants } from '@/db/schema/tenants'
import { auth } from '@/lib/auth/server'
import { normalizePackageTier } from '@/lib/midtrans/activation'
import { createSnapTransaction } from '@/lib/midtrans/client'
import { siteConfig } from '@/lib/site-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, amount, package_tier, packageTier, user_id, userId } = body

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Tenant slug is required' }, { status: 400 })
    }

    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug))

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const rawTier = (packageTier || package_tier) as string | undefined
    const matchedPricing = siteConfig.pricing.find(p => p.id === rawTier)
    const targetTier = normalizePackageTier(rawTier)
    const finalAmount =
      typeof amount === 'number' && amount > 0
        ? Math.round(amount)
        : (matchedPricing?.priceNumeric ?? 299000)

    // Optional user association
    let effectiveUserId = (userId || user_id) as string | undefined
    if (!effectiveUserId && request.headers.get('cookie')) {
      try {
        const session = await auth.getSession()
        if (session.data?.user?.id) {
          effectiveUserId = session.data.user.id
        }
      } catch {
        // Unauthenticated checkouts are permitted; user can be linked later
      }
    }

    const [newOrder] = await db
      .insert(orders)
      .values({
        amount: finalAmount,
        snapshotTier: targetTier,
        status: 'pending',
        tenantId: tenant.id,
        userId: effectiveUserId ?? null,
      })
      .returning()

    const snapResult = await createSnapTransaction({
      grossAmount: finalAmount,
      orderId: newOrder.id,
      customerDetails: {
        firstName: tenant.name,
      },
    })

    return NextResponse.json({
      orderId: newOrder.id,
      redirectUrl: snapResult.redirectUrl,
      token: snapResult.token,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout transaction'
    console.error('[Checkout Route Error]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
