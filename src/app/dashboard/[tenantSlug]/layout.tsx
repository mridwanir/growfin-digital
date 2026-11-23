import type { ReactNode } from 'react'

import { redirect } from 'next/navigation'

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getSession } from '@/lib/auth/server'
import { getMerchantTenants, getTenantBySlug } from '@/lib/dashboard/mutations'

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
  const currentTenant = await getTenantBySlug(tenantSlug, session.user.id)

  if (!currentTenant) {
    redirect('/dashboard')
  }

  const tenants = await getMerchantTenants(session.user.id)

  return (
    <SidebarProvider>
      <DashboardSidebar currentTenant={currentTenant} tenants={tenants} user={session.user} />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <div className="flex items-center gap-2 font-medium">
            <span>{currentTenant.name}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
