import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import proxy from '@/proxy'

describe('Next.js Proxy Authentication Route Protection', () => {
  it('redirects unauthenticated requests to /dashboard to /login', async () => {
    const request = new NextRequest('http://localhost:3000/dashboard')
    const response = await proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    const location = response.headers.get('location')
    expect(location).toContain('/login')
  })

  it('rewrites unreserved /admin to /site/admin instead of redirecting to /login', async () => {
    const request = new NextRequest('http://localhost:3000/admin')
    const response = await proxy(request)

    expect(response.headers.get('x-middleware-rewrite')).toContain('/site/admin')
  })

  it('allows access to public routes like /, /login, /register, /onboarding, and /api/generate', async () => {
    const loginRequest = new NextRequest('http://localhost:3000/login')
    const loginResponse = await proxy(loginRequest)
    expect(loginResponse.status).toBe(200)

    const registerRequest = new NextRequest('http://localhost:3000/register')
    const registerResponse = await proxy(registerRequest)
    expect(registerResponse.status).toBe(200)

    const onboardingRequest = new NextRequest('http://localhost:3000/onboarding')
    const onboardingResponse = await proxy(onboardingRequest)
    expect(onboardingResponse.status).toBe(200)

    const homeRequest = new NextRequest('http://localhost:3000/')
    const homeResponse = await proxy(homeRequest)
    expect(homeResponse.status).toBe(200)

    const generateRequest = new NextRequest('http://localhost:3000/api/generate')
    const generateResponse = await proxy(generateRequest)
    expect(generateResponse.status).toBe(200)
  })
})
