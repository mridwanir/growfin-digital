import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/server'
import { getMerchantTenants } from '@/lib/dashboard/mutations'

export async function GET(_request: NextRequest) {
  const { data: session } = await auth.getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenants = await getMerchantTenants(session.user.id)
  return NextResponse.json({ tenants })
}
