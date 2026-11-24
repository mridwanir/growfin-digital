'use client'

import type { SidebarUser } from './nav-user'
import type { TenantSwitcherTenant } from './tenant-switcher'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { TenantSwitcher } from './tenant-switcher'

export interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentTenant: TenantSwitcherTenant
  user: SidebarUser
}

export function DashboardSidebar({ currentTenant, user, ...props }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher currentTenant={currentTenant} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain tenantSlug={currentTenant.slug} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
