import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/server'

export async function GET(_request: NextRequest) {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    session: session.session,
    user: session.user,
  })
}
