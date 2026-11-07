import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/auth/admin'
import { auth } from '@/lib/auth/server'

export async function GET(_request: NextRequest) {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  return NextResponse.json({
    admin: true,
    user: session.user,
  })
}
