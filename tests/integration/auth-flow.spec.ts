import type { TestTenantFixture } from '../fixtures/tenant-fixture'

import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { POST as authWebhook } from '@/app/api/auth/webhook/route'
import { db } from '@/db'
import { userInNeonAuth } from '@/db/schema/auth'
import { tenants } from '@/db/schema/tenants'
import { auth } from '@/lib/auth/server'
import { updateTenantSettingsAction } from '@/lib/dashboard/actions'
import { resend } from '@/lib/email/resend'

import { createMerchantSession } from '../fixtures/session-fixture'
import { createTestTenant } from '../fixtures/tenant-fixture'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('End-to-End Passwordless Auth Integration Flow', () => {
  const userId = crypto.randomUUID()
  let tenantFixture: TestTenantFixture
  let tenantId: string

  beforeAll(async () => {
    await db.insert(userInNeonAuth).values({
      id: userId,
      name: 'Merchant Flow User',
      email: 'merchant.flow@growfin.my.id',
      emailVerified: true,
    })

    tenantFixture = await createTestTenant({
      name: 'Flow Merchant Store',
      address: 'Jl. Merdeka No. 10',
      category: 'F&B',
      city: 'Jakarta Pusat',
      phone: '081234567890',
      status: 'published',
      userId,
    })
    tenantId = tenantFixture.tenantId
  })

  afterAll(async () => {
    await tenantFixture?.cleanup()
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, userId))
  })

  it('executes passwordless auth webhook delivery and allows merchant settings mutation', async () => {
    // 1. Webhook delivers OTP email via Resend
    const resendSpy = vi.spyOn(resend.emails, 'send').mockResolvedValueOnce({
      data: { id: 'email_msg_999' },
      error: null,
      headers: null,
    })

    const otpPayload = {
      event_id: 'evt_flow_1',
      event_type: 'send.otp',
      timestamp: new Date().toISOString(),
      context: {
        project_name: 'Growfin Digital',
      },
      event_data: {
        expires_at: new Date(Date.now() + 300000).toISOString(),
        otp_code: '456789',
        otp_type: 'sign-in',
      },
      user: {
        name: 'Merchant Flow User',
        email: 'merchant.flow@growfin.my.id',
      },
    }

    const webhookReq = new NextRequest('http://localhost:3000/api/auth/webhook', {
      body: JSON.stringify(otpPayload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const webhookRes = await authWebhook(webhookReq)
    expect(webhookRes.status).toBe(200)
    expect(resendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('456789'),
        subject: expect.stringContaining('456789'),
        to: 'merchant.flow@growfin.my.id',
      }),
    )

    // 2. Verified merchant session allows mutating settings via updateTenantSettingsAction
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({
        name: 'Merchant Flow User',
        email: 'merchant.flow@growfin.my.id',
        userId,
      }),
    )

    const actionResult = await updateTenantSettingsAction(tenantId, {
      address: 'Jl. Merdeka No. 45',
      city: 'Jakarta Pusat',
      phone: '081234567890',
    })

    expect(actionResult).toMatchObject({
      success: true,
      data: {
        id: tenantId,
        address: 'Jl. Merdeka No. 45',
        city: 'Jakarta Pusat',
        phone: '081234567890',
      },
    })

    const [updatedTenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId))
    expect(updatedTenant.address).toBe('Jl. Merdeka No. 45')
    expect(updatedTenant.city).toBe('Jakarta Pusat')
    expect(updatedTenant.phone).toBe('081234567890')
  })
})
