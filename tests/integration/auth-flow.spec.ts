import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

import { POST as authWebhook } from '@/app/api/auth/webhook/route'
import { resend } from '@/lib/email/resend'

describe('End-to-End Passwordless Auth Integration Flow', () => {
  it('executes passwordless auth webhook delivery', async () => {
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
  })
})
