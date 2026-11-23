import { eq } from 'drizzle-orm'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from '@/app/api/auth/[...all]/route'
import { db } from '@/db'
import { user } from '@/db/schema/auth'
import { auth } from '@/lib/auth/server'
import { resend } from '@/lib/email/resend'

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
})
