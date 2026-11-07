import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

import { sendMagicLinkEmail, sendOtpEmail } from '@/lib/email/resend'
import { env } from '@/lib/env'

interface NeonAuthWebhookPayload {
  context?: {
    project_name?: string
  }
  event_data?: {
    link_type?: string
    link_url?: string
    otp_code?: string
    otp_type?: string
    token?: string
  }
  event_id?: string
  event_type: string
  timestamp?: string
  user?: {
    name?: string
    email?: string
  }
}

export async function verifyNeonWebhook(rawBody: string, headers: Headers): Promise<boolean> {
  const signature = headers.get('x-neon-signature')
  const kid = headers.get('x-neon-signature-kid')
  const timestamp = headers.get('x-neon-timestamp')

  if (process.env.NODE_ENV === 'production' && (!signature || !kid || !timestamp)) {
    return false
  }

  if (signature && kid && timestamp) {
    try {
      const res = await fetch(`${env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`)
      if (!res.ok) return false
      const jwks = (await res.json()) as { keys?: Array<{ kid: string }> }
      const jwk = jwks.keys?.find(k => k.kid === kid)
      if (!jwk) return false

      const publicKey = crypto.createPublicKey({ key: jwk as JsonWebKey, format: 'jwk' })
      const [headerB64, emptyPayload, signatureB64] = signature.split('.')
      if (emptyPayload !== '' || !headerB64 || !signatureB64) return false

      const payloadB64 = Buffer.from(rawBody, 'utf8').toString('base64url')
      const signaturePayload = `${timestamp}.${payloadB64}`
      const signaturePayloadB64 = Buffer.from(signaturePayload, 'utf8').toString('base64url')
      const signingInput = `${headerB64}.${signaturePayloadB64}`

      return crypto.verify(
        null,
        Buffer.from(signingInput),
        publicKey,
        Buffer.from(signatureB64, 'base64url'),
      )
    } catch {
      return false
    }
  }

  return true
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const isValid = await verifyNeonWebhook(rawBody, request.headers)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid webhook signature' },
        { status: 401 },
      )
    }

    const payload = JSON.parse(rawBody) as NeonAuthWebhookPayload
    const { context, event_data, event_type, user } = payload

    const appName = context?.project_name || 'Growfin Digital'

    if (event_type === 'send.otp') {
      const email = user?.email
      const code = event_data?.otp_code

      if (!email || !code) {
        return NextResponse.json(
          { error: 'Missing required user email or OTP code in send.otp payload' },
          { status: 400 },
        )
      }

      await sendOtpEmail({
        appName,
        code,
        email,
      })

      return NextResponse.json({ success: true })
    }

    if (event_type === 'send.magic_link') {
      const email = user?.email
      const linkUrl = event_data?.link_url

      if (!email || !linkUrl) {
        return NextResponse.json(
          { error: 'Missing required user email or link_url in send.magic_link payload' },
          { status: 400 },
        )
      }

      await sendMagicLinkEmail({
        appName,
        email,
        linkUrl,
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: `Unsupported or invalid event type: ${event_type}` },
      { status: 400 },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
