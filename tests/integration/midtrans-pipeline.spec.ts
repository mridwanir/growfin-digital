import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST as checkoutHandler } from '@/app/api/checkout/route'
import { GET as verifyGetHandler, POST as verifyPostHandler } from '@/app/api/checkout/verify/route'
import { POST as notificationHandler } from '@/app/api/midtrans/notification/route'
import SitePage from '@/app/site/[slug]/page'
import { DynamicThemeProvider } from '@/components/demo/DynamicThemeProvider'
import { ExpiredSiteScreen } from '@/components/demo/ExpiredSiteScreen'
import { db } from '@/db'
import { orders } from '@/db/schema/orders'
import { tenants } from '@/db/schema/tenants'
import { env } from '@/lib/env'
import * as midtransClient from '@/lib/midtrans/client'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

describe('Midtrans Payment Pipeline and Tenant Activation (Issue 09)', () => {
  const createdTenantIds: string[] = []
  const serverKey = env.MIDTRANS_SERVER_KEY

  const generateSignature = (orderId: string, statusCode: string, grossAmount: string) => {
    return crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex')
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(async () => {
    for (const id of createdTenantIds) {
      await db.delete(orders).where(eq(orders.tenantId, id))
      await db.delete(tenants).where(eq(tenants.id, id))
    }
    createdTenantIds.length = 0
  })

  describe('1. Checkout Token Generation (/api/checkout)', () => {
    it('returns 400 when slug is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/checkout', {
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const res = await checkoutHandler(req)
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBeDefined()
    })

    it('returns 404 when tenant slug does not exist', async () => {
      const req = new NextRequest('http://localhost:3000/api/checkout', {
        body: JSON.stringify({ slug: 'non-existent-tenant-xyz' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const res = await checkoutHandler(req)
      expect(res.status).toBe(404)
      const data = await res.json()
      expect(data.error).toBeDefined()
    })

    it('inserts a pending order and returns Midtrans Snap token on valid request', async () => {
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Toko Kopi Test',
          category: 'Cafe & Coffee Shop',
          packageTier: 'free',
          slug: `toko-kopi-test-${Date.now()}`,
          status: 'draft',
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      vi.spyOn(midtransClient, 'createSnapTransaction').mockResolvedValueOnce({
        redirectUrl: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-mock-12345',
        token: 'snap-token-mock-12345',
      })

      const req = new NextRequest('http://localhost:3000/api/checkout', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          amount: 299000,
          package_tier: 'instan',
          slug: testTenant.slug,
        }),
      })

      const res = await checkoutHandler(req)
      expect(res.status).toBe(200)
      const data = await res.json()

      expect(data.token).toBe('snap-token-mock-12345')
      expect(data.orderId).toBeDefined()

      // Verify pending order exists in database
      const [savedOrder] = await db.select().from(orders).where(eq(orders.id, data.orderId))

      expect(savedOrder).toBeDefined()
      expect(savedOrder.status).toBe('pending')
      expect(savedOrder.tenantId).toBe(testTenant.id)
      expect(savedOrder.amount).toBe(299000)
      expect(savedOrder.snapshotTier).toBe('instant')
    })
  })

  describe('2. Midtrans Webhook Notification (/api/midtrans/notification)', () => {
    it('returns 400 when required fields are missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/midtrans/notification', {
        body: JSON.stringify({ order_id: 'some-id' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const res = await notificationHandler(req)
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBeDefined()
    })

    it('returns 401 when signature is invalid or tampered', async () => {
      const req = new NextRequest('http://localhost:3000/api/midtrans/notification', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          gross_amount: '299000.00',
          order_id: 'any-order-id',
          signature_key: 'invalid-tampered-sha512-signature',
          status_code: '200',
          transaction_status: 'settlement',
        }),
      })

      const res = await notificationHandler(req)
      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.error).toBe('Invalid signature')
    })

    it('returns 404 when order does not exist in database', async () => {
      const orderId = '00000000-0000-4000-8000-000000000000'
      const statusCode = '200'
      const grossAmount = '299000.00'
      const signature = generateSignature(orderId, statusCode, grossAmount)

      const req = new NextRequest('http://localhost:3000/api/midtrans/notification', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          gross_amount: grossAmount,
          order_id: orderId,
          payment_type: 'qris',
          signature_key: signature,
          status_code: statusCode,
          transaction_id: 'midtrans-trx-123',
          transaction_status: 'settlement',
        }),
      })

      const res = await notificationHandler(req)
      expect(res.status).toBe(404)
    })

    it('activates tenant and marks order paid on valid signed settlement notification', async () => {
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Warung Barokah',
          category: 'Cafe & Coffee Shop',
          packageTier: 'free',
          slug: `warung-barokah-${Date.now()}`,
          status: 'draft',
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      const [testOrder] = await db
        .insert(orders)
        .values({
          amount: 299000,
          snapshotTier: 'instan',
          status: 'pending',
          tenantId: testTenant.id,
        })
        .returning()

      const statusCode = '200'
      const grossAmount = '299000.00'
      const signature = generateSignature(testOrder.id, statusCode, grossAmount)

      const req = new NextRequest('http://localhost:3000/api/midtrans/notification', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          gross_amount: grossAmount,
          order_id: testOrder.id,
          payment_type: 'qris',
          signature_key: signature,
          status_code: statusCode,
          transaction_id: 'midtrans-gateway-ref-999',
          transaction_status: 'settlement',
        }),
      })

      const res = await notificationHandler(req)
      expect(res.status).toBe(200)

      // Verify order is updated to paid with audit trail
      const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, testOrder.id))

      expect(updatedOrder.status).toBe('paid')
      expect(updatedOrder.paidAt).not.toBeNull()
      expect(updatedOrder.paymentMethod).toBe('qris')
      expect(updatedOrder.paymentGatewayRef).toBe('midtrans-gateway-ref-999')

      // Verify tenant is activated to published with siteActiveUntil calculated
      const [updatedTenant] = await db.select().from(tenants).where(eq(tenants.id, testTenant.id))

      expect(updatedTenant.status).toBe('published')
      expect(updatedTenant.packageTier).toBe('instant')
      expect(updatedTenant.siteActiveUntil).not.toBeNull()
      const diffDays =
        (new Date(updatedTenant.siteActiveUntil!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      expect(diffDays).toBeGreaterThan(360)
      expect(diffDays).toBeLessThanOrEqual(366)
    })

    it('is idempotent: duplicate settlement notifications do not error or corrupt state', async () => {
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Warung Idempotent',
          category: 'Cafe & Coffee Shop',
          packageTier: 'free',
          slug: `warung-idempotent-${Date.now()}`,
          status: 'draft',
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      const [testOrder] = await db
        .insert(orders)
        .values({
          amount: 299000,
          snapshotTier: 'instan',
          status: 'pending',
          tenantId: testTenant.id,
        })
        .returning()

      const statusCode = '200'
      const grossAmount = '299000.00'
      const signature = generateSignature(testOrder.id, statusCode, grossAmount)

      const createPayload = () =>
        new NextRequest('http://localhost:3000/api/midtrans/notification', {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({
            gross_amount: grossAmount,
            order_id: testOrder.id,
            payment_type: 'bank_transfer',
            signature_key: signature,
            status_code: statusCode,
            transaction_id: 'midtrans-dup-ref',
            transaction_status: 'settlement',
          }),
        })

      // First webhook call
      const res1 = await notificationHandler(createPayload())
      expect(res1.status).toBe(200)

      const [orderAfterFirst] = await db.select().from(orders).where(eq(orders.id, testOrder.id))
      const [tenantAfterFirst] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, testTenant.id))

      // Second webhook call (duplicate)
      const res2 = await notificationHandler(createPayload())
      expect(res2.status).toBe(200)

      const [orderAfterSecond] = await db.select().from(orders).where(eq(orders.id, testOrder.id))
      const [tenantAfterSecond] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, testTenant.id))

      expect(orderAfterSecond.status).toBe('paid')
      expect(tenantAfterSecond.status).toBe('published')
      expect(orderAfterSecond.paidAt?.toISOString()).toBe(orderAfterFirst.paidAt?.toISOString())
      expect(tenantAfterSecond.siteActiveUntil?.toISOString()).toBe(
        tenantAfterFirst.siteActiveUntil?.toISOString(),
      )
    })

    it('marks order expired or failed without publishing tenant on failure status', async () => {
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Warung Expired',
          category: 'Cafe & Coffee Shop',
          slug: `warung-expired-${Date.now()}`,
          status: 'draft',
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      const [testOrder] = await db
        .insert(orders)
        .values({
          amount: 299000,
          snapshotTier: 'instan',
          status: 'pending',
          tenantId: testTenant.id,
        })
        .returning()

      const statusCode = '200'
      const grossAmount = '299000.00'
      const signature = generateSignature(testOrder.id, statusCode, grossAmount)

      const req = new NextRequest('http://localhost:3000/api/midtrans/notification', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          gross_amount: grossAmount,
          order_id: testOrder.id,
          signature_key: signature,
          status_code: statusCode,
          transaction_id: 'midtrans-expire-ref',
          transaction_status: 'expire',
        }),
      })

      const res = await notificationHandler(req)
      expect(res.status).toBe(200)

      const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, testOrder.id))
      const [updatedTenant] = await db.select().from(tenants).where(eq(tenants.id, testTenant.id))

      expect(updatedOrder.status).toBe('expired')
      expect(updatedTenant.status).toBe('draft')
    })
  })

  describe('3. Checkout Settlement Polling and Verification (/api/checkout/verify)', () => {
    it('returns 404 when polled order does not exist', async () => {
      const req = new NextRequest(
        'http://localhost:3000/api/checkout/verify?order_id=00000000-0000-4000-8000-000000000000',
      )
      const res = await verifyGetHandler(req)
      expect(res.status).toBe(404)
    })

    it('returns paid status via GET polling when order is already paid', async () => {
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Toko Polling Test',
          category: 'Cafe & Coffee Shop',
          slug: `toko-polling-${Date.now()}`,
          status: 'published',
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      const [testOrder] = await db
        .insert(orders)
        .values({
          amount: 299000,
          paidAt: new Date(),
          status: 'paid',
          tenantId: testTenant.id,
        })
        .returning()

      const req = new NextRequest(
        `http://localhost:3000/api/checkout/verify?order_id=${testOrder.id}`,
      )
      const res = await verifyGetHandler(req)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.status).toBe('paid')
      expect(data.orderId).toBe(testOrder.id)
    })

    it('verifies pending order via POST, querying Midtrans status and activating tenant', async () => {
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Toko Post Verify',
          category: 'Cafe & Coffee Shop',
          slug: `toko-post-verify-${Date.now()}`,
          status: 'draft',
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      const [testOrder] = await db
        .insert(orders)
        .values({
          amount: 299000,
          snapshotTier: 'instan',
          status: 'pending',
          tenantId: testTenant.id,
        })
        .returning()

      vi.spyOn(midtransClient, 'fetchMidtransStatus').mockResolvedValueOnce({
        fraud_status: 'accept',
        gross_amount: '299000.00',
        order_id: testOrder.id,
        payment_type: 'gopay',
        status_code: '200',
        status_message: 'Success',
        transaction_id: 'midtrans-post-verify-123',
        transaction_status: 'settlement',
      })

      const req = new NextRequest('http://localhost:3000/api/checkout/verify', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          order_id: testOrder.id,
          slug: testTenant.slug,
        }),
      })

      const res = await verifyPostHandler(req)
      expect(res.status).toBe(200)

      const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, testOrder.id))
      const [updatedTenant] = await db.select().from(tenants).where(eq(tenants.id, testTenant.id))

      expect(updatedOrder.status).toBe('paid')
      expect(updatedOrder.paymentMethod).toBe('gopay')
      expect(updatedTenant.status).toBe('published')
    })
  })

  describe('4. Storefront Rendering for Paid, Published Websites', () => {
    it('renders published paid tenant without trial lockouts or expired demo banners', async () => {
      const oneYearFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Resto Sukses Berbayar',
          category: 'Cafe & Coffee Shop',
          packageTier: 'instant',
          siteActiveUntil: oneYearFuture,
          slug: `resto-sukses-${Date.now()}`,
          status: 'published',
          brandingContent: {
            heroTitle: 'Selamat Datang',
            tagline: 'Kelezatan Asli Nusantara',
          },
          themeConfig: {
            fbType: 'DINE_IN',
            layoutId: 'fnb-theme-classic',
          },
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      const renderedPage = await SitePage({
        params: Promise.resolve({ slug: testTenant.slug }),
      })

      expect(renderedPage).toBeDefined()
      // Assert it is not ExpiredSiteScreen (DynamicThemeProvider is the root wrapper for active storefronts)
      expect(renderedPage.type).toBe(DynamicThemeProvider)
    })

    it('renders ExpiredSiteScreen on SitePage when paid website siteActiveUntil has passed', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const [testTenant] = await db
        .insert(tenants)
        .values({
          name: 'Resto Kadaluarsa',
          category: 'Cafe & Coffee Shop',
          packageTier: 'instant',
          siteActiveUntil: pastDate,
          slug: `resto-kadaluarsa-${Date.now()}`,
          status: 'published',
        })
        .returning()
      createdTenantIds.push(testTenant.id)

      const renderedPage = await SitePage({
        params: Promise.resolve({ slug: testTenant.slug }),
      })

      expect(renderedPage).toBeDefined()
      expect(renderedPage.type).toBe(ExpiredSiteScreen)
    })
  })
})
