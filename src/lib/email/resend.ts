import { Resend } from 'resend'

import { env } from '@/lib/env'

export const resend = new Resend(env.RESEND_API_KEY)

const DEFAULT_FROM = env.EMAIL_FROM

export interface SendOtpEmailParams {
  email: string
  code: string
  appName?: string
}

export interface SendMagicLinkEmailParams {
  email: string
  linkUrl: string
  appName?: string
}

export async function sendOtpEmail({
  email,
  code,
  appName = 'Growfin Digital',
}: SendOtpEmailParams) {
  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    subject: `Your verification code: ${code} - ${appName}`,
    to: email,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">Sign in to ${appName}</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #444; margin-bottom: 24px;">Use the verification code below to complete your sign-in request. This code is valid for 5 minutes.</p>
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #000;">${code}</span>
        </div>
        <p style="font-size: 13px; color: #888;">If you did not request this email, you can safely ignore it.</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`)
  }

  return data
}

export async function sendMagicLinkEmail({
  email,
  linkUrl,
  appName = 'Growfin Digital',
}: SendMagicLinkEmailParams) {
  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    subject: `Sign-in link for ${appName}`,
    to: email,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">Sign in to ${appName}</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #444; margin-bottom: 24px;">Click the button below to securely sign in to your merchant dashboard without a password.</p>
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${linkUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 600; display: inline-block;">Sign In to ${appName}</a>
        </div>
        <p style="font-size: 13px; color: #666; word-break: break-all;">Or copy and paste this link into your browser:<br/><a href="${linkUrl}" style="color: #2563eb;">${linkUrl}</a></p>
        <p style="font-size: 13px; color: #888; margin-top: 24px;">If you did not request this email, you can safely ignore it.</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(`Failed to send magic link email: ${error.message}`)
  }

  return data
}
