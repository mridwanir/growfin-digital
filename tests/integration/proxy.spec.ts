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

  it('redirects unauthenticated requests to /admin to /login', async () => {
    const request = new NextRequest('http://localhost:3000/admin')
    const response = await proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    const location = response.headers.get('location')
    expect(location).toContain('/login')
  })

  it('allows access to public routes like / and /login', async () => {
    const loginRequest = new NextRequest('http://localhost:3000/login')
    const loginResponse = await proxy(loginRequest)
    expect(loginResponse.status).toBe(200)

    const homeRequest = new NextRequest('http://localhost:3000/')
    const homeResponse = await proxy(homeRequest)
    expect(homeResponse.status).toBe(200)
  })
})
