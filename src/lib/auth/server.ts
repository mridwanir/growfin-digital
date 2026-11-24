import type { NextRequest } from 'next/server'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getSessionCookie } from 'better-auth/cookies'
import { organization } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { cache } from 'react'

import { db } from '@/db'
import * as authSchema from '@/db/schema/auth'
import { resend } from '@/lib/email/resend'
import { env } from '@/lib/env'

/**
 * Computes the cookie domain for session persistence. In production, sets
 * `.${env.NEXT_PUBLIC_BASE_DOMAIN}` (e.g. `.growfin.my.id`) to allow cross-subdomain sharing. In
 * development, returns localhost to support local cross-subdomain sessions.
 */
export function getSessionCookieDomain(
  nodeEnv: string = process.env.NODE_ENV || 'development',
  baseDomain?: string,
): string | undefined {
  const domain = baseDomain ?? env.NEXT_PUBLIC_BASE_DOMAIN
  if (nodeEnv === 'development') return 'localhost'
  if (nodeEnv === 'production' && domain) {
    return domain.startsWith('.') ? domain : `.${domain}`
  }
  return undefined
}

const cookieDomain = getSessionCookieDomain()

const baseAuth = betterAuth({
  baseURL: env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  advanced: {
    crossSubDomainCookies: cookieDomain ? { domain: cookieDomain, enabled: true } : undefined,
    defaultCookieAttributes: cookieDomain ? { domain: cookieDomain } : undefined,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account: authSchema.account,
      invitation: authSchema.invitation,
      member: authSchema.member,
      organization: authSchema.organization,
      session: authSchema.session,
      user: authSchema.user,
      verification: authSchema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: env.EMAIL_FROM,
        subject: 'Reset your password - Growfin Digital',
        to: user.email,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
            <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">Reset your password</h2>
            <p style="font-size: 15px; line-height: 1.5; color: #444; margin-bottom: 24px;">Click the link below to reset your password. This link is valid for 1 hour.</p>
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${url}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 600; display: inline-block;">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #666; word-break: break-all;">Or copy and paste this link into your browser:<br/><a href="${url}" style="color: #2563eb;">${url}</a></p>
            <p style="font-size: 13px; color: #888; margin-top: 24px;">If you did not request this email, you can safely ignore it.</p>
          </div>
        `,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: env.EMAIL_FROM,
        subject: 'Verify your email address - Growfin Digital',
        to: user.email,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
            <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">Verify your email address</h2>
            <p style="font-size: 15px; line-height: 1.5; color: #444; margin-bottom: 24px;">Thank you for registering. Click the link below to verify your email address.</p>
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${url}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 600; display: inline-block;">Verify Email</a>
            </div>
            <p style="font-size: 13px; color: #666; word-break: break-all;">Or copy and paste this link into your browser:<br/><a href="${url}" style="color: #2563eb;">${url}</a></p>
            <p style="font-size: 13px; color: #888; margin-top: 24px;">If you did not request this email, you can safely ignore it.</p>
          </div>
        `,
      })
    },
  },
  plugins: [
    organization({
      schema: {
        organization: {
          additionalFields: {
            address: { type: 'string', required: false },
            category: { type: 'string', required: false },
            city: { type: 'string', required: false },
            customDomain: { type: 'string', required: false },
            domainActiveUntil: { type: 'date', required: false },
            googleMapsUrl: { type: 'string', required: false },
            operatingHours: { type: 'json', required: false },
            packageTier: { type: 'string', defaultValue: 'free', required: false },
            phone: { type: 'string', required: false },
            siteActiveUntil: { type: 'date', required: false },
            status: { type: 'string', defaultValue: 'draft', required: false },
          },
        },
      },
    }),
  ],
  secret:
    env.BETTER_AUTH_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    'test_better_auth_secret_at_least_32_characters_long',
  socialProviders: {
    google: {
      enabled: true,
      clientId:
        env.GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_CLIENT_ID ||
        (process.env.NODE_ENV === 'test' ? 'test_google_client_id' : ''),
      clientSecret:
        env.GOOGLE_CLIENT_SECRET ||
        process.env.GOOGLE_CLIENT_SECRET ||
        (process.env.NODE_ENV === 'test' ? 'test_google_client_secret' : ''),
    },
  },
})

export interface SessionPayload {
  session: {
    id: string
    activeOrganizationId?: string | null
    createdAt: Date
    expiresAt: Date
    ipAddress?: string | null
    token: string
    updatedAt: Date
    userAgent?: string | null
    userId: string
  }
  user: {
    id: string
    name: string
    createdAt: Date
    email: string
    emailVerified: boolean
    image?: string | null
    role?: string | null
    updatedAt: Date
  }
}

export interface SessionResult {
  data: SessionPayload | null
  error: null
}

const getSessionFromHeaders = async (customHeaders?: Headers): Promise<SessionResult> => {
  try {
    const reqHeaders = customHeaders ?? (await headers())
    const session = await baseAuth.api.getSession({ headers: reqHeaders })
    if (!session) {
      return { data: null, error: null }
    }
    return {
      error: null,
      data: {
        session: session.session as unknown as typeof authSchema.session.$inferSelect,
        user: session.user as unknown as typeof authSchema.user.$inferSelect,
      },
    }
  } catch {
    return { data: null, error: null }
  }
}

export interface BetterAuthServer {
  api: typeof baseAuth.api
  handler: typeof baseAuth.handler
  options: typeof baseAuth.options
  getSession: (customHeaders?: Headers) => Promise<SessionResult>
  middleware: (options?: {
    loginUrl?: string
    publicRoutes?: string[]
  }) => (request: NextRequest) => Promise<NextResponse>
}

export const auth: BetterAuthServer = Object.assign(baseAuth, {
  getSession: getSessionFromHeaders,
  middleware: ({
    loginUrl = '/login',
    publicRoutes = [],
  }: {
    loginUrl?: string
    publicRoutes?: string[]
  } = {}) => {
    return async (request: NextRequest) => {
      const { pathname } = request.nextUrl
      const isPublic =
        publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)) ||
        pathname.startsWith('/api/auth')

      if (isPublic) {
        return NextResponse.next()
      }

      const sessionCookie = getSessionCookie(request)
      if (!sessionCookie) {
        const url = new URL(loginUrl, request.url)
        return NextResponse.redirect(url)
      }

      return NextResponse.next()
    }
  },
})

/**
 * Per-request cached helper to retrieve the authenticated session in React Server Components,
 * Server Actions, or Route Handlers.
 */
export const getSession = cache(async (customHeaders?: Headers): Promise<SessionResult> => {
  return auth.getSession(customHeaders)
})
/**
 * Server guard ensuring the request is authenticated. Redirects unauthenticated requests to
 * `/login`.
 */
export const requireAuth = cache(async (customHeaders?: Headers) => {
  const { data: session } = await getSession(customHeaders)
  if (!session?.user) {
    redirect('/login')
  }
  return session
})
