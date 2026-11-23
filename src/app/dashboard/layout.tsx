/* oxlint-disable tailwindcss/no-conflicting-classes -- accessible skip link uses focus:not-sr-only with focus:absolute */
import type { ReactNode } from 'react'

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { requireActiveTenantContext } from '@/lib/dashboard/tenant-context'

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
    <SidebarProvider>
      <a
        className="bg-primary text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-md focus:ring-2 focus:outline-hidden"
        href="#main-content"
      >
        Skip to main content
      </a>
      <DashboardSidebar currentTenant={currentTenantDto} tenants={tenantsDto} user={userDto} />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <div className="flex items-center gap-2 font-medium">
            <span>{currentTenant.name}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6" id="main-content">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
