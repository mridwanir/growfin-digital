import { describe, expect, it } from 'vitest'

import { getSessionCookieDomain } from '@/lib/auth/server'

describe('Session Cookie Domain Configuration', () => {
  it('returns .growfin.my.id in production to support cross-subdomain sessions', () => {
    expect(getSessionCookieDomain('production', 'growfin.my.id')).toBe('.growfin.my.id')
    expect(getSessionCookieDomain('production', '.growfin.my.id')).toBe('.growfin.my.id')
  })

  it('returns localhost in development to support local cross-subdomain sessions', () => {
    expect(getSessionCookieDomain('development', 'growfin.my.id')).toBe('localhost')
  })

  it('returns undefined in test environment', () => {
    expect(getSessionCookieDomain('test', 'growfin.my.id')).toBeUndefined()
  })
})
