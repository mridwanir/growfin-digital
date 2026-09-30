import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all files with an extension (e.g. .jpg, .png, .css, .ico)
     */
    '/((?!api|_next|.*\\..*).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  let hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'growfin.my.id'}`);

  // Strip port for local testing (e.g., growfin.my.id:3000 -> growfin.my.id)
  hostname = hostname.split(':')[0];

  const path = url.pathname;

  // Define reserved paths for the main domain
  const reservedPaths = ['/dashboard', '/login', '/register', '/demo', '/checkout'];
  const isReserved = reservedPaths.some(reserved => path.startsWith(reserved)) || path === '/';

  // 1. Handle Subdomains & Custom Domains (e.g. kopisenja.growfin.my.id or www.kopisenja.com)
  if (
    hostname !== 'localhost' &&
    hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN &&
    hostname !== `www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  ) {
    let currentHost = hostname;
    if (process.env.NEXT_PUBLIC_ROOT_DOMAIN && hostname.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)) {
      currentHost = hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '');
    }
    
    // We rewrite to /site/[currentHost] to render the tenant's page
    return NextResponse.rewrite(new URL(`/site/${currentHost}${path === '/' ? '' : path}`, req.url));
  }

  // 2. Handle Root Slugs (e.g. growfin.my.id/kopisenja)
  if (!isReserved) {
    // Rewrite to /site/[slug]
    return NextResponse.rewrite(new URL(`/site${path}`, req.url));
  }

  return NextResponse.next();
}
