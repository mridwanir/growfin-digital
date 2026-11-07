import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/server'
import { env } from '@/lib/env'

const authMiddleware = auth.middleware({
  loginUrl: '/login',
  publicRoutes: ['/', '/login', '/api/auth/webhook', '/api/generate', '/demo', '/site'],
})

const RESERVED_PATHS = [
  '/dashboard',
  '/login',
  '/register',
  '/demo',
  '/checkout',
  '/admin',
  '/api',
  '/site',
]

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname

  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN || 'growfin.my.id'
  const rawHost = request.headers.get('host') || url.host || ''

  // Normalize host: strip port and normalize local testing aliases (*.localhost)
  let hostname = rawHost.split(':')[0].toLowerCase()
  if (hostname.endsWith('.localhost')) {
    const subdomain = hostname.slice(0, -'.localhost'.length)
    hostname = `${subdomain}.${baseDomain}`
  }

  const isRootDomain =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === baseDomain ||
    hostname === `www.${baseDomain}`

  // 1. Subdomains & Custom Domains (e.g. kopisenja.growfin.my.id or kopisenja.com)
  if (!isRootDomain) {
    let currentHost = hostname.replace(/^www\./, '')
    if (currentHost.endsWith(`.${baseDomain}`)) {
      currentHost = currentHost.slice(0, -(baseDomain.length + 1))
    }

    const rewritePath = pathname === '/' ? '' : pathname
    return NextResponse.rewrite(new URL(`/site/${currentHost}${rewritePath}`, request.url))
  }

  // 2. Root domain top-level slugs (e.g. growfin.my.id/kopisenja)
  const isReserved =
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    RESERVED_PATHS.some(reserved => pathname === reserved || pathname.startsWith(`${reserved}/`))

  if (!isReserved) {
    return NextResponse.rewrite(new URL(`/site${pathname}`, request.url))
  }

  // 3. Fall through to authentication middleware for protected routes and static/public handlers
  return authMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
