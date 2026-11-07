import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

import { POST } from '@/app/api/auth/webhook/route'
import { resend, sendMagicLinkEmail, sendOtpEmail } from '@/lib/email/resend'

describe('Resend Email & Webhook Delivery', () => {
  describe('sendOtpEmail', () => {
    it('sends an email with the OTP code using Resend', async () => {
      const sendSpy = vi.spyOn(resend.emails, 'send').mockResolvedValueOnce({
        data: { id: 'email_123' },
        error: null,
        headers: null,
      })

      const result = await sendOtpEmail({
        appName: 'Growfin Digital',
        code: '123456',
        email: 'merchant@growfin.my.id',
      })

      expect(result).toEqual({ id: 'email_123' })
      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('123456'),
          subject: expect.stringContaining('123456'),
          to: 'merchant@growfin.my.id',
        }),
      )
    })
  })

  describe('sendMagicLinkEmail', () => {
    it('sends an email with the sign-in magic link using Resend', async () => {
      const sendSpy = vi.spyOn(resend.emails, 'send').mockResolvedValueOnce({
        data: { id: 'email_456' },
        error: null,
        headers: null,
      })

      const result = await sendMagicLinkEmail({
        appName: 'Growfin Digital',
        email: 'merchant@growfin.my.id',
        linkUrl: 'https://growfin.my.id/api/auth/verify?token=xyz123',
      })

      expect(result).toEqual({ id: 'email_456' })
      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('https://growfin.my.id/api/auth/verify?token=xyz123'),
          subject: expect.stringContaining('Sign-in link'),
          to: 'merchant@growfin.my.id',
        }),
      )
    })
  })

  describe('POST /api/auth/webhook', () => {
    it('handles send.otp event and dispatches OTP email', async () => {
      vi.spyOn(resend.emails, 'send').mockResolvedValueOnce({
        data: { id: 'email_otp_webhook' },
        error: null,
        headers: null,
      })

      const payload = {
        event_id: 'evt_1',
        event_type: 'send.otp',
        timestamp: new Date().toISOString(),
        context: {
          project_name: 'Growfin Digital',
        },
        event_data: {
          expires_at: new Date(Date.now() + 300000).toISOString(),
          otp_code: '654321',
          otp_type: 'sign-in',
        },
        user: {
          name: 'Merchant Test',
          email: 'merchant@growfin.my.id',
        },
      }

      const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual({ success: true })
    })

    it('handles send.magic_link event and dispatches magic link email', async () => {
      vi.spyOn(resend.emails, 'send').mockResolvedValueOnce({
        data: { id: 'email_link_webhook' },
        error: null,
        headers: null,
      })

      const payload = {
        event_id: 'evt_2',
        event_type: 'send.magic_link',
        timestamp: new Date().toISOString(),
        context: {
          project_name: 'Growfin Digital',
        },
        event_data: {
          expires_at: new Date(Date.now() + 300000).toISOString(),
          link_type: 'sign-in',
          link_url: 'https://growfin.my.id/api/auth/verify?token=abc789',
          token: 'abc789',
        },
        user: {
          email: 'merchant@growfin.my.id',
        },
      }

      const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual({ success: true })
    })

    it('returns 400 for unknown or invalid event types', async () => {
      const payload = {
        event_type: 'unknown.event',
      }

      const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })
})
