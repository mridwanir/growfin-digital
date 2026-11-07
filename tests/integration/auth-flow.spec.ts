import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

import { GET as getAdminApi } from '@/app/api/admin/route'
import { POST as authWebhook } from '@/app/api/auth/webhook/route'
import { GET as getDashboardApi } from '@/app/api/dashboard/route'
import { auth } from '@/lib/auth/server'
import { resend } from '@/lib/email/resend'
import { env } from '@/lib/env'

describe('End-to-End Passwordless Auth Integration Flow', () => {
  it('executes full passwordless lifecycle: request OTP -> webhook delivery -> receive session -> access protected routes', async () => {
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

    // 2. Verified session allows merchant into dashboard
    const merchantSession = {
      session: {
        id: 'sess_flow_merchant',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000),
        token: 'token_merchant_abc',
        updatedAt: new Date(),
        userId: 'user_flow_merchant',
      },
      user: {
        id: 'user_flow_merchant',
        name: 'Merchant Flow User',
        createdAt: new Date(),
        email: 'merchant.flow@growfin.my.id',
        emailVerified: true,
        updatedAt: new Date(),
      },
    }

    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: merchantSession,
      error: null,
    })

    const dashboardReq = new NextRequest('http://localhost:3000/api/dashboard')
    const dashboardRes = await getDashboardApi(dashboardReq)
    expect(dashboardRes.status).toBe(200)
    const dashboardData = await dashboardRes.json()
    expect(dashboardData.user.email).toBe('merchant.flow@growfin.my.id')

    // 3. Merchant is rejected from /api/admin with 403 Forbidden
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: merchantSession,
      error: null,
    })

    const adminReq = new NextRequest('http://localhost:3000/api/admin')
    const adminForbiddenRes = await getAdminApi(adminReq)
    expect(adminForbiddenRes.status).toBe(403)
    const adminForbiddenData = await adminForbiddenRes.json()
    expect(adminForbiddenData.error).toContain('Admin access required')

    // 4. Super admin is admitted to /api/admin with 200 OK
    const adminEmail = env.ADMIN_EMAILS.split(',')[0].trim()
    const adminSession = {
      session: {
        id: 'sess_flow_admin',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000),
        token: 'token_admin_xyz',
        updatedAt: new Date(),
        userId: 'user_flow_admin',
      },
      user: {
        id: 'user_flow_admin',
        name: 'Platform Administrator',
        createdAt: new Date(),
        email: adminEmail,
        emailVerified: true,
        updatedAt: new Date(),
      },
    }

    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: adminSession,
      error: null,
    })

    const adminAllowedRes = await getAdminApi(adminReq)
    expect(adminAllowedRes.status).toBe(200)
    const adminAllowedData = await adminAllowedRes.json()
    expect(adminAllowedData.admin).toBe(true)
    expect(adminAllowedData.user.email).toBe(adminEmail)
  })
})
