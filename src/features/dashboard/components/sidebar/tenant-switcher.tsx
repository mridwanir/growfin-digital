'use client'

import { Store } from 'lucide-react'
import * as React from 'react'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export interface TenantSwitcherTenant {
  id: string
  name: string
  slug: string
  packageTier?: string | null
  category?: string | null
  [key: string]: unknown
}

export interface TenantSwitcherProps {
  currentTenant: TenantSwitcherTenant
}

export function TenantSwitcher({ currentTenant }: TenantSwitcherProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Store className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">{currentTenant.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {(currentTenant.packageTier
                ? currentTenant.packageTier.toUpperCase()
                : currentTenant.category) || 'Store'}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
