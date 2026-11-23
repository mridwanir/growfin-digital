'use client'

import { Check, ChevronsUpDown, Plus, Store } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

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
  tenants: TenantSwitcherTenant[]
}

export function TenantSwitcher({ currentTenant, tenants }: TenantSwitcherProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
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
            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--anchor-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">Toko</DropdownMenuLabel>
            </DropdownMenuGroup>
            {tenants.map(tenant => {
              const isActive = tenant.id === currentTenant.id || tenant.slug === currentTenant.slug
              return (
                <DropdownMenuItem
                  key={tenant.id}
                  render={<Link className="flex items-center gap-2 p-2" href="/dashboard" />}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Store className="size-4 shrink-0" />
                  </div>
                  <span className="flex-1 truncate">{tenant.name}</span>
                  {isActive && <Check className="text-primary ml-auto size-4" />}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link className="flex items-center gap-2 p-2" href="/" />}>
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Buat Toko Baru</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
