import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { createCheckoutSession } from '@/features/billing/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, amount, package_tier, packageTier, user_id, userId } = body

    const result = await createCheckoutSession({
      amount,
      cookieHeader: request.headers.get('cookie'),
      packageTier: (packageTier || package_tier) as string | undefined,
      slug,
      userId: (userId || user_id) as string | undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({
      orderId: result.orderId,
      redirectUrl: result.redirectUrl,
      token: result.token,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout transaction'
    console.error('[Checkout Route Error]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
