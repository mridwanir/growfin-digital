import { createNeonAuth } from '@neon/auth/next/server'
import { cache } from 'react'

import { env } from '@/lib/env'

/**
 * Computes the cookie domain for session persistence. In production, sets
 * `.${env.NEXT_PUBLIC_BASE_DOMAIN}` (e.g. `.growfin.my.id`) to allow cross-subdomain sharing. In
 * development, returns undefined so cookies bind to localhost/current host.
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

export const auth = createNeonAuth({
  baseUrl: env.NEON_AUTH_BASE_URL || 'https://mock.neonauth.tech/neondb/auth',
  cookies: {
    domain: getSessionCookieDomain(),
    secret: env.NEON_AUTH_COOKIE_SECRET || 'test-neon-auth-cookie-secret-at-least-32-chars',
  },
})

/**
 * Per-request cached helper to retrieve the authenticated session in React Server Components,
 * Server Actions, or Route Handlers.
 */
export const getSession = cache(async () => {
  return auth.getSession()
})
