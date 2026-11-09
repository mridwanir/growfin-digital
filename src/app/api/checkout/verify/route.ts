import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { orders } from '@/db/schema/orders'
import { activateOrderAndTenant } from '@/lib/midtrans/activation'
import { fetchMidtransStatus, isSettlementOrAccept } from '@/lib/midtrans/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order_id') || searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'paid') {
      return NextResponse.json({
        orderId: order.id,
        paidAt: order.paidAt,
        status: 'paid',
        success: true,
      })
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      success: false,
    })
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

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'paid') {
      return NextResponse.json({
        message: 'Transaction already paid',
        status: 'paid',
        success: true,
      })
    }

    // Query Midtrans status API directly server-to-server
    const midtransStatus = await fetchMidtransStatus(order.id)

    if (isSettlementOrAccept(midtransStatus)) {
      const result = await activateOrderAndTenant({
        orderId: order.id,
        paymentGatewayRef: midtransStatus.transaction_id || paymentGatewayRef,
        paymentMethod: midtransStatus.payment_type || paymentMethod,
      })

      return NextResponse.json({
        message: 'Payment successfully verified and business published',
        orderId: result.order.id,
        status: 'paid',
        success: true,
      })
    }

    return NextResponse.json(
      {
        error: `Payment status not accepted: ${midtransStatus.transaction_status}`,
        status: midtransStatus.transaction_status,
        success: false,
      },
      { status: 400 },
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to verify checkout order'
    console.error('[Checkout Verify POST Error]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
