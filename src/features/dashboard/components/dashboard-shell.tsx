/* oxlint-disable tailwindcss/no-conflicting-classes -- accessible skip link */
import type { ReactNode } from 'react'

import type { SidebarUser } from './sidebar/nav-user'
import type { TenantSwitcherTenant } from './sidebar/tenant-switcher'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { DashboardSidebar } from './sidebar'

export interface DashboardShellProps {
  children: ReactNode
  currentTenant: TenantSwitcherTenant
  tenants: TenantSwitcherTenant[]
  user: SidebarUser
}

export function DashboardShell({ children, currentTenant, tenants, user }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <a
        className="bg-primary text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-md focus:ring-2 focus:outline-hidden"
        href="#main-content"
      >
        Skip to main content
      </a>
      <DashboardSidebar currentTenant={currentTenant} tenants={tenants} user={user} />
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
