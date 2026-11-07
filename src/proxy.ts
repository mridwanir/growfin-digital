import { auth } from '@/lib/auth/server'

export default auth.middleware({
  loginUrl: '/login',
  publicRoutes: ['/', '/login', '/api/auth/webhook', '/api/generate'],
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
