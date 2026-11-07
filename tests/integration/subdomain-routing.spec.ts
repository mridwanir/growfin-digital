import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import proxy from '@/proxy'

describe('stateless subdomain & custom domain routing (edge seam)', () => {
  const baseDomain = 'growfin.my.id'

  describe('subdomain rewrites', () => {
    it('rewrites tenant subdomain to /site/[slug]', async () => {
      const request = new NextRequest('http://kopisenja.growfin.my.id/', {
        headers: { host: 'kopisenja.growfin.my.id' },
      })
      const response = await proxy(request)

      expect(response.headers.get('x-middleware-rewrite')).toContain('/site/kopisenja')
    })

    it('rewrites tenant subdomain with local port to /site/[slug]', async () => {
      const request = new NextRequest('http://kopisenja.localhost:3000/', {
        headers: { host: 'kopisenja.localhost:3000' },
      })
      const response = await proxy(request)

      expect(response.headers.get('x-middleware-rewrite')).toContain('/site/kopisenja')
    })

    it('preserves nested paths when rewriting tenant subdomain', async () => {
      const request = new NextRequest('http://kopisenja.growfin.my.id/menu', {
        headers: { host: 'kopisenja.growfin.my.id' },
      })
      const response = await proxy(request)

      expect(response.headers.get('x-middleware-rewrite')).toContain('/site/kopisenja/menu')
    })
  })

  describe('custom domain rewrites', () => {
    it('rewrites custom apex domain to /site/[domain]', async () => {
      const request = new NextRequest('https://kopisenja.com/', {
        headers: { host: 'kopisenja.com' },
      })
      const response = await proxy(request)

      expect(response.headers.get('x-middleware-rewrite')).toContain('/site/kopisenja.com')
    })

    it('strips www prefix from custom domain before rewriting', async () => {
      const request = new NextRequest('https://www.kopisenja.com/', {
        headers: { host: 'www.kopisenja.com' },
      })
      const response = await proxy(request)

      expect(response.headers.get('x-middleware-rewrite')).toContain('/site/kopisenja.com')
    })
  })

  describe('root domain path slug rewrites', () => {
    it('rewrites unreserved path slug to /site/[slug]', async () => {
      const request = new NextRequest(`https://${baseDomain}/kopisenja`, {
        headers: { host: baseDomain },
      })
      const response = await proxy(request)

      expect(response.headers.get('x-middleware-rewrite')).toContain('/site/kopisenja')
    })

    it('does not rewrite reserved paths like /dashboard and enforces auth redirect', async () => {
      const request = new NextRequest(`https://${baseDomain}/dashboard`, {
        headers: { host: baseDomain },
      })
      const response = await proxy(request)

      expect(response.status).toBeGreaterThanOrEqual(300)
      expect(response.status).toBeLessThan(400)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('does not rewrite reserved paths like /demo/[slug]', async () => {
      const request = new NextRequest(`https://${baseDomain}/demo/kopisenja`, {
        headers: { host: baseDomain },
      })
      const response = await proxy(request)

      // Unauthenticated access to /demo/[slug] is permitted without rewrite to /site/
      expect(response.status).toBe(200)
      const rewrite = response.headers.get('x-middleware-rewrite')
      expect(rewrite).toBeNull()
    })

    it('does not rewrite public root homepage', async () => {
      const request = new NextRequest(`https://${baseDomain}/`, {
        headers: { host: baseDomain },
      })
      const response = await proxy(request)

      expect(response.status).toBe(200)
      const rewrite = response.headers.get('x-middleware-rewrite')
      expect(rewrite).toBeNull()
    })
  })
})
