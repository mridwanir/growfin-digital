import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { handleMidtransNotification } from '@/features/billing/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await handleMidtransNotification(body)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ message: result.message }, { status: result.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal webhook error'
    console.error('[Midtrans Webhook Error]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
