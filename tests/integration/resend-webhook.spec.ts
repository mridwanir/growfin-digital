import { describe, expect, it, vi } from 'vitest'

import { resend, sendMagicLinkEmail, sendOtpEmail } from '@/lib/email/resend'

describe('Resend Email Delivery', () => {
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
})
