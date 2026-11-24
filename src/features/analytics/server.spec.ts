import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

import { computeVisitorHash, parseAcquisition } from './server'

vi.mock('server-only', () => ({}))

describe('Analytics feature slice - server unit logic', () => {
  describe('computeVisitorHash', () => {
    it('generates deterministic SHA-256 hash for identical visitor inputs', () => {
      const hash1 = computeVisitorHash('192.168.1.1', 'Mozilla/5.0', 'tenant-123')
      const hash2 = computeVisitorHash('192.168.1.1', 'Mozilla/5.0', 'tenant-123')
      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64)
    })

    it('generates distinct hashes for different IPs, user agents, or tenants', () => {
      const baseHash = computeVisitorHash('192.168.1.1', 'Mozilla/5.0', 'tenant-123')
      const differentIp = computeVisitorHash('192.168.1.2', 'Mozilla/5.0', 'tenant-123')
      const differentUa = computeVisitorHash('192.168.1.1', 'Chrome/120.0', 'tenant-123')
      const differentTenant = computeVisitorHash('192.168.1.1', 'Mozilla/5.0', 'tenant-456')

      expect(baseHash).not.toBe(differentIp)
      expect(baseHash).not.toBe(differentUa)
      expect(baseHash).not.toBe(differentTenant)
    })
  })

  describe('parseAcquisition', () => {
    it('returns null for non-page_view events', () => {
      const req = new NextRequest('http://localhost:3000/api/analytics/track?utm_source=google', {
        headers: { referer: 'https://google.com' },
      })
      expect(parseAcquisition(req, 'checkout_start')).toBeNull()
      expect(parseAcquisition(req, 'checkout_complete')).toBeNull()
    })

    it('extracts UTM parameters for page_view events', () => {
      const req = new NextRequest(
        'http://localhost:3000/api/analytics/track?utm_source=instagram&utm_medium=bio&utm_campaign=summer_sale',
      )
      const acquisition = parseAcquisition(req, 'page_view')
      expect(acquisition).toEqual({
        campaign: 'summer_sale',
        medium: 'bio',
        source: 'instagram',
      })
    })

    it('extracts external referrer and infers source when UTM source is absent', () => {
      const req = new NextRequest('http://localhost:3000/api/analytics/track', {
        headers: { referer: 'https://twitter.com/post/123' },
      })
      const acquisition = parseAcquisition(req, 'page_view')
      expect(acquisition).toEqual({
        referrer: 'https://twitter.com/post/123',
        source: 'twitter.com',
      })
    })

    it('returns null if there are no UTM params and no external referrer', () => {
      const req = new NextRequest('http://localhost:3000/api/analytics/track')
      expect(parseAcquisition(req, 'page_view')).toBeNull()
    })
  })
})
