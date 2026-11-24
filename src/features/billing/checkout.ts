import type {
  CreateCheckoutSessionParams,
  CreateCheckoutSessionResult,
  MidtransNotificationPayload,
  MidtransNotificationResult,
  VerifyCheckoutResult,
} from './types'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { organization } from '@/db/schema/auth'
import { orders } from '@/db/schema/orders'
import { auth } from '@/lib/auth/server'
import { siteConfig } from '@/lib/site-config'

import { activateOrderAndTenant, markOrderFailedOrExpired } from './activation'
import {
  createSnapTransaction,
  fetchMidtransStatus,
  isSettlementOrAccept,
  verifyMidtransSignature,
} from './midtrans-client'
import { normalizePackageTier } from './tier'

import 'server-only'

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<CreateCheckoutSessionResult> {
  const { slug, amount, packageTier, userId, cookieHeader } = params

  if (!slug || typeof slug !== 'string') {
    return {
      error: 'Tenant slug is required',
      status: 400,
      success: false,
    }
  }

  const [tenant] = await db.select().from(organization).where(eq(organization.slug, slug))

  if (!tenant) {
    return {
      error: 'Tenant not found',
      status: 404,
      success: false,
    }
  }

  const matchedPricing = siteConfig.pricing.find(p => p.id === packageTier)
  const targetTier = normalizePackageTier(packageTier)
  const finalAmount =
    typeof amount === 'number' && amount > 0
      ? Math.round(amount)
      : (matchedPricing?.priceNumeric ?? 299000)

  let effectiveUserId = userId
  if (!effectiveUserId && cookieHeader) {
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
      organizationId: tenant.id,
      snapshotTier: targetTier,
      status: 'pending',
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

  return {
    orderId: newOrder.id,
    redirectUrl: snapResult.redirectUrl,
    success: true,

    token: snapResult.token,
  }
}
export async function getCheckoutOrderStatus(orderId: string) {
  if (!orderId) {
    return {
      error: 'Order ID is required',
      status: 400,
      success: false as const,
    }
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

  if (!order) {
    return {
      error: 'Order not found',
      status: 404,
      success: false as const,
    }
  }

  if (order.status === 'paid') {
    const [tenant] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, order.organizationId))

    return {
      alreadyPaid: true,
      orderId: order.id,
      paymentGatewayRef: order.paymentGatewayRef,
      paymentMethod: order.paymentMethod,
      status: 'paid',
      success: true as const,
      tenantId: tenant?.id,
      tenantSlug: tenant?.slug,
    }
  }

  return {
    orderId: order.id,
    paymentGatewayRef: order.paymentGatewayRef,
    paymentMethod: order.paymentMethod,
    status: order.status,
    success: false as const,
  }
}

export async function verifyCheckoutOrder({
  orderId,
  paymentGatewayRef,
  paymentMethod,
}: {
  orderId: string
  paymentGatewayRef?: string | null
  paymentMethod?: string | null
}): Promise<VerifyCheckoutResult> {
  if (!orderId) {
    return {
      error: 'Order ID is required',
      status: 400,
      success: false,
    }
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

  if (!order) {
    return {
      error: 'Order not found',
      status: 404,
      success: false,
    }
  }

  const [tenant] = await db
    .select()
    .from(organization)
    .where(eq(organization.id, order.organizationId))

  if (!tenant) {
    return {
      error: 'Tenant not found for order',
      status: 404,
      success: false,
    }
  }

  if (order.status === 'paid') {
    return {
      alreadyPaid: true,
      orderId: order.id,
      paymentGatewayRef: order.paymentGatewayRef,
      paymentMethod: order.paymentMethod,
      status: 'paid',
      success: true,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
    }
  }

  const midtransStatus = await fetchMidtransStatus(order.id)

  if (isSettlementOrAccept(midtransStatus)) {
    const activation = await activateOrderAndTenant({
      grossAmount: midtransStatus.gross_amount ? Number(midtransStatus.gross_amount) : order.amount,
      orderId: order.id,
      paymentGatewayRef: midtransStatus.transaction_id || paymentGatewayRef,
      paymentMethod: midtransStatus.payment_type || paymentMethod,
    })

    return {
      alreadyPaid: activation.alreadyPaid,
      orderId: activation.order.id,
      paymentGatewayRef: activation.order.paymentGatewayRef,
      paymentMethod: activation.order.paymentMethod,
      status: activation.order.status,
      success: true,
      tenantId: activation.tenant.id,
      tenantSlug: activation.tenant.slug,
    }
  }

  return {
    error: `Payment status not accepted: ${midtransStatus.transaction_status}`,
    orderId: order.id,
    paymentGatewayRef: midtransStatus.transaction_id || paymentGatewayRef,
    paymentMethod: midtransStatus.payment_type || paymentMethod,
    status: midtransStatus.transaction_status,
    success: false,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
  }
}

export async function handleMidtransNotification(
  payload: MidtransNotificationPayload,
): Promise<MidtransNotificationResult> {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    payment_type,
    transaction_id,
  } = payload

  if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status) {
    return {
      error: 'Missing required notification fields',
      status: 400,
    }
  }

  const isSignatureValid = verifyMidtransSignature({
    grossAmount: String(gross_amount),
    orderId: String(order_id),
    receivedSignature: String(signature_key),
    statusCode: String(status_code),
  })

  if (!isSignatureValid) {
    console.warn('[Midtrans Webhook] Invalid signature rejected:', { order_id })
    return {
      error: 'Invalid signature',
      status: 401,
    }
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, String(order_id)))

  if (!order) {
    return {
      error: 'Order not found',
      status: 404,
    }
  }

  if (order.status === 'paid') {
    return {
      message: 'Order already processed',
      status: 200,
    }
  }

  if (isSettlementOrAccept({ fraud_status, transaction_status })) {
    await activateOrderAndTenant({
      grossAmount: Number(gross_amount),
      orderId: order.id,
      paymentGatewayRef: transaction_id || null,
      paymentMethod: payment_type || null,
    })

    return {
      message: 'Payment successfully verified and business published',
      status: 200,
    }
  }

  if (transaction_status === 'cancel' || transaction_status === 'deny') {
    await markOrderFailedOrExpired({
      orderId: order.id,
      status: 'failed',
    })
    return {
      message: 'Notification processed: order failed',
      status: 200,
    }
  }

  if (transaction_status === 'expire') {
    await markOrderFailedOrExpired({
      orderId: order.id,
      status: 'expired',
    })
    return {
      message: 'Notification processed: order expired',
      status: 200,
    }
  }

  return {
    message: `Notification processed: order status ${transaction_status}`,
    status: 200,
  }
}
