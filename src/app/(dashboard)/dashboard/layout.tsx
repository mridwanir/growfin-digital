/* oxlint-disable react/only-export-components -- Next.js route config */
import type { ReactNode } from 'react'

import { requireActiveTenantContext } from '@/features/auth/server'
import { DashboardShell } from '@/features/dashboard'

export const instant = false

export async function DashboardGuard({ children }: { children: ReactNode }) {
  await requireActiveTenantContext()
  return children
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentTenant, session, tenants } = await requireActiveTenantContext()

  const currentTenantDto = {
    id: currentTenant.id,
    name: currentTenant.name,
    category: currentTenant.category,
    packageTier: currentTenant.packageTier,
    slug: currentTenant.slug,
  }

  const tenantsDto = tenants.map(tenant => ({
    id: tenant.id,
    name: tenant.name,
    category: tenant.category,
    packageTier: tenant.packageTier,
    slug: tenant.slug,
  }))

  const userDto = {
    name: session.user.name,
    avatar: session.user.image,
    email: session.user.email,
    role: session.user.role ?? null,
  }

  return (
    <DashboardShell currentTenant={currentTenantDto} tenants={tenantsDto} user={userDto}>
      {children}
    </DashboardShell>
  )
}
