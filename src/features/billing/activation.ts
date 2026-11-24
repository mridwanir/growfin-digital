import type { ActivateOrderAndTenantParams, ActivationResult } from './types'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/db'
import { member } from '@/db/schema/auth'
import { orders } from '@/db/schema/orders'
import { tenants } from '@/db/schema/tenants'

import { sendInvoiceEmail } from './invoice'
import { normalizePackageTier } from './tier'

import 'server-only'

export async function activateOrderAndTenant({
  orderId,
  paymentGatewayRef,
  paymentMethod,
}: ActivateOrderAndTenantParams): Promise<ActivationResult> {
  const result = await db.transaction(async tx => {
    const [existingOrder] = await tx.select().from(orders).where(eq(orders.id, orderId))

    if (!existingOrder) {
      throw new Error(`Order ${orderId} not found`)
    }

    const [existingTenant] = await tx
      .select()
      .from(tenants)
      .where(eq(tenants.id, existingOrder.organizationId))

    if (!existingTenant) {
      throw new Error(`Tenant ${existingOrder.organizationId} not found`)
    }

    // Idempotency: if already paid, return without mutating
    if (existingOrder.status === 'paid') {
      return {
        alreadyPaid: true,
        order: existingOrder,
        tenant: existingTenant,
      }
    }

    const now = new Date()
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

    let siteActiveUntil: Date
    if (existingTenant.siteActiveUntil && new Date(existingTenant.siteActiveUntil) > now) {
      siteActiveUntil = new Date(
        new Date(existingTenant.siteActiveUntil).getTime() + 365 * 24 * 60 * 60 * 1000,
      )
    } else {
      siteActiveUntil = oneYearFromNow
    }

    const tier = normalizePackageTier(existingOrder.snapshotTier || existingTenant.packageTier)
    let domainActiveUntil: Date | null = null
    if (tier === 'pro') {
      if (existingTenant.domainActiveUntil && new Date(existingTenant.domainActiveUntil) > now) {
        domainActiveUntil = new Date(
          new Date(existingTenant.domainActiveUntil).getTime() + 365 * 24 * 60 * 60 * 1000,
        )
      } else {
        domainActiveUntil = oneYearFromNow
      }
    }

    const [updatedOrder] = await tx
      .update(orders)
      .set({
        paidAt: now,
        paymentGatewayRef: paymentGatewayRef ?? existingOrder.paymentGatewayRef,
        paymentMethod: paymentMethod ?? existingOrder.paymentMethod,
        status: 'paid',
        updatedAt: now,
      })
      .where(eq(orders.id, orderId))
      .returning()

    if (existingOrder.userId) {
      const [existingMember] = await tx
        .select()
        .from(member)
        .where(
          and(
            eq(member.organizationId, existingTenant.id),
            eq(member.userId, existingOrder.userId),
          ),
        )
        .limit(1)

      if (!existingMember) {
        await tx.insert(member).values({
          id: crypto.randomUUID(),
          organizationId: existingTenant.id,
          role: 'owner',
          userId: existingOrder.userId,
        })
      }
    }

    const [updatedTenant] = await tx
      .update(tenants)
      .set({
        domainActiveUntil,
        packageTier: tier,
        siteActiveUntil,
        status: 'published',
        updatedAt: now,
      })
      .where(eq(tenants.id, existingTenant.id))
      .returning()

    return {
      alreadyPaid: false,
      order: updatedOrder,
      tenant: updatedTenant,
    }
  })

  if (!result.alreadyPaid) {
    try {
      revalidatePath(`/${result.tenant.slug}`)
      revalidatePath(`/site/${result.tenant.slug}`)
    } catch {
      // Revalidation errors are non-critical outside server request context
    }

    try {
      await sendInvoiceEmail({
        amount: result.order.amount,
        businessName: result.tenant.name,
        orderId: result.order.id,
        packageTier: result.order.snapshotTier || result.tenant.packageTier,
        paidAt: result.order.paidAt ?? new Date(),
        paymentMethod: result.order.paymentMethod,
        slug: result.tenant.slug,
        userId: result.order.userId,
      })
    } catch (err) {
      console.error('[Invoice Email] Failed to send invoice email:', err)
    }
  }

  return result
}

export async function markOrderFailedOrExpired({
  orderId,
  status,
}: {
  orderId: string
  status: 'failed' | 'expired'
}) {
  const [updatedOrder] = await db
    .update(orders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  return updatedOrder
}
