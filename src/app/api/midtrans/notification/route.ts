import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { orders } from '@/db/schema/orders'
import { activateOrderAndTenant, markOrderFailedOrExpired } from '@/lib/midtrans/activation'
import { isSettlementOrAccept, verifyMidtransSignature } from '@/lib/midtrans/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
    } = body

    if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status) {
      return NextResponse.json({ error: 'Missing required notification fields' }, { status: 400 })
    }

    // 1. Verify Midtrans SHA-512 signature
    const isSignatureValid = verifyMidtransSignature({
      grossAmount: String(gross_amount),
      orderId: String(order_id),
      receivedSignature: String(signature_key),
      statusCode: String(status_code),
    })

    if (!isSignatureValid) {
      console.warn('[Midtrans Webhook] Invalid signature rejected:', { order_id })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // 2. Fetch order to verify existence and check idempotency
    const [order] = await db.select().from(orders).where(eq(orders.id, order_id))

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'paid') {
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 })
    }

    // 3. Map Midtrans transaction status
    if (isSettlementOrAccept({ fraud_status, transaction_status })) {
      await activateOrderAndTenant({
        grossAmount: Number(gross_amount),
        orderId: order.id,
        paymentGatewayRef: transaction_id || null,
        paymentMethod: payment_type || null,
      })

      return NextResponse.json(
        { message: 'Payment successfully verified and business published' },
        { status: 200 },
      )
    }

    if (transaction_status === 'cancel' || transaction_status === 'deny') {
      await markOrderFailedOrExpired({
        orderId: order.id,
        status: 'failed',
      })
      return NextResponse.json({ message: 'Notification processed: order failed' }, { status: 200 })
    }

    if (transaction_status === 'expire') {
      await markOrderFailedOrExpired({
        orderId: order.id,
        status: 'expired',
      })
      return NextResponse.json(
        { message: 'Notification processed: order expired' },
        { status: 200 },
      )
    }

    return NextResponse.json(
      { message: `Notification processed: order status ${transaction_status}` },
      { status: 200 },
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal webhook error'
    console.error('[Midtrans Webhook Error]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
