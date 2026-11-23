import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from '@/app/api/auth/[...all]/route'
import { DashboardGuard } from '@/app/dashboard/layout'
import { db } from '@/db'
import { user } from '@/db/schema/auth'
import { authClient } from '@/lib/auth/client'
import { auth } from '@/lib/auth/server'
import { resend } from '@/lib/email/resend'

import { createMerchantSession } from '../fixtures/session-fixture'
import { createTestTenant } from '../fixtures/tenant-fixture'

const mockCookieStore = {
  delete: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(() => []),
  has: vi.fn(() => false),
  set: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => mockCookieStore),
  headers: vi.fn(async () => new Headers()),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => ''),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}))
describe('Self-Managed Better Auth Core Flow', () => {
  const testEmail = `merchant-${Date.now()}@growfin.test`
  const testPassword = 'SecurePassword123!'
  const testName = 'Test Merchant'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    try {
      await db.delete(user).where(eq(user.email, testEmail))
    } catch {}
  })

  it('registers a new merchant with email and password and dispatches verification email via Resend', async () => {
    const resendSpy = vi.spyOn(resend.emails, 'send').mockResolvedValueOnce({
      data: { id: 'email_test_123' },
      error: null,
      headers: null,
    })

    const request = new Request('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    const responseBody = await response.json()
    expect(responseBody.user).toBeDefined()
    expect(responseBody.user.email).toBe(testEmail)
    expect(responseBody.user.name).toBe(testName)

    expect(resendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: testEmail,
      }),
    )

    const [dbUser] = await db.select().from(user).where(eq(user.email, testEmail))
    expect(dbUser).toBeDefined()
    expect(dbUser.email).toBe(testEmail)
  })

  it('signs in an existing merchant with email and password and returns session cookie', async () => {
    const request = new Request('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    const setCookie = response.headers.get('set-cookie')
    expect(setCookie).toBeDefined()
    expect(setCookie).toContain('session_token')
  })

  it('dispatches password reset email directly via Resend', async () => {
    const resendSpy = vi.spyOn(resend.emails, 'send').mockResolvedValueOnce({
      data: { id: 'reset_email_123' },
      error: null,
      headers: null,
    })

    const request = new Request('http://localhost:3000/api/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    expect(resendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: testEmail,
      }),
    )
  })

  it('retrieves valid session via auth.api.getSession and server getSession helper', async () => {
    const signInReq = new Request('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const signInRes = await POST(signInReq)
    const cookieHeader = signInRes.headers.get('set-cookie') || ''
    const cookie = cookieHeader.split(';')[0]

    const headers = new Headers({
      cookie,
    })

    const apiSession = await auth.api.getSession({ headers })
    expect(apiSession).toBeDefined()
    expect(apiSession?.user.email).toBe(testEmail)

    const sessionResult = await auth.getSession(headers)
    expect(sessionResult.data).toBeDefined()
    expect(sessionResult.data?.user.email).toBe(testEmail)
  })

  describe('google OAuth integration and onboarding flow (Issue 15)', () => {
    it('configures Google OAuth provider with required client credentials and enabled flag', () => {
      expect(auth.options.socialProviders?.google).toBeDefined()
      expect(auth.options.socialProviders?.google?.enabled).toBe(true)
      expect(auth.options.socialProviders?.google?.clientId).toBeDefined()
      expect(auth.options.socialProviders?.google?.clientSecret).toBeDefined()
    })

    it('exposes signIn.social method on authClient for social provider authentication', () => {
      expect(authClient.signIn).toBeDefined()
      expect(authClient.signIn.social).toBeDefined()
      expect(typeof authClient.signIn.social).toBe('function')
    })

    it('processes server-side sign-in social request for Google provider and returns OAuth URL', async () => {
      const request = new Request('http://localhost:3000/api/auth/sign-in/social', {
        method: 'POST',
        body: JSON.stringify({
          callbackURL: '/dashboard',
          provider: 'google',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
      const responseBody = await response.json()
      expect(responseBody.url).toBeDefined()
      expect(responseBody.url).toContain('accounts.google.com')
    })

    it('redirects first-time Google OAuth merchants lacking an organization to /onboarding', async () => {
      const zeroOrgUserId = `google-user-zero-${Date.now()}`
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          email: 'first-time-google@growfin.test',
          userId: zeroOrgUserId,
        }),
      )

      await expect(
        DashboardGuard({
          children: React.createElement('div', null, 'Protected Dashboard Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/onboarding')

      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })

    it('allows returning Google OAuth merchants with an organization to enter /dashboard with active store context', async () => {
      const orgUserId = `google-user-org-${Date.now()}`
      const fixture = await createTestTenant({
        name: 'Google Merchant Store',
        userId: orgUserId,
      })

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          email: 'returning-google@growfin.test',
          userId: orgUserId,
        }),
      )

      const element = await DashboardGuard({
        children: React.createElement('div', null, 'Protected Dashboard Content'),
      })

      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      await fixture.cleanup()
    })
  })
})
