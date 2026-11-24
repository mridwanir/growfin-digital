import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getCheckoutOrderStatus, verifyCheckoutOrder } from '@/features/billing/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order_id') || searchParams.get('orderId')

    const result = await getCheckoutOrderStatus(orderId ?? '')

    if ('error' in result && typeof result.status === 'number') {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to verify checkout order'
    console.error('[Checkout Verify GET Error]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderId = (body.order_id || body.orderId) as string | undefined
    const paymentMethod = (body.payment_method || body.paymentMethod) as string | undefined
    const paymentGatewayRef = (body.payment_gateway_ref || body.paymentGatewayRef) as
      | string
      | undefined

    const result = await verifyCheckoutOrder({
      orderId: orderId ?? '',
      paymentGatewayRef,
      paymentMethod,
    })

    if (!result.success) {
      if ('status' in result && typeof result.status === 'number') {
        return NextResponse.json({ error: result.error }, { status: result.status })
      }
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to verify checkout order'
    console.error('[Checkout Verify POST Error]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
