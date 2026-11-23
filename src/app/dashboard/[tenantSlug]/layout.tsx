import type { ReactNode } from 'react'

import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/server'
import { getTenantBySlug } from '@/lib/dashboard/mutations'

interface TenantDashboardLayoutProps {
  children: ReactNode
  params: Promise<{ tenantSlug: string }>
}

export default async function TenantDashboardLayout({
  children,
  params,
}: TenantDashboardLayoutProps) {
  const { data: session } = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { tenantSlug } = await params
  const tenant = await getTenantBySlug(tenantSlug, session.user.id)

  if (!tenant) {
    redirect('/dashboard')
  }

  return <div className="flex min-h-screen flex-col">{children}</div>
}
