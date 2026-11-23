'use client'

import type { LucideIcon } from 'lucide-react'

import { LayoutDashboard, Package, Palette, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export interface NavMainProps {
  tenantSlug: string
}

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
}

export function NavMain({ tenantSlug }: NavMainProps) {
  const pathname = usePathname() || ''

  const items: NavItem[] = [
    {
      icon: LayoutDashboard,
      isActive: pathname === `/dashboard/${tenantSlug}` || pathname === `/dashboard/${tenantSlug}/`,
      title: 'Overview',
      url: `/dashboard/${tenantSlug}`,
    },
    {
      icon: Palette,
      title: 'Storefront Editor',
      url: `/dashboard/${tenantSlug}/editor`,
      isActive:
        pathname === `/dashboard/${tenantSlug}/editor` ||
        pathname.startsWith(`/dashboard/${tenantSlug}/editor/`),
    },
    {
      icon: Package,
      title: 'Catalog',
      url: `/dashboard/${tenantSlug}/products`,
      isActive:
        pathname === `/dashboard/${tenantSlug}/products` ||
        pathname.startsWith(`/dashboard/${tenantSlug}/products/`),
    },
    {
      icon: Settings,
      title: 'Settings',
      url: `/dashboard/${tenantSlug}/settings`,
      isActive:
        pathname === `/dashboard/${tenantSlug}/settings` ||
        pathname.startsWith(`/dashboard/${tenantSlug}/settings/`),
    },
  ]
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              aria-current={item.isActive ? 'page' : undefined}
              isActive={item.isActive}
              render={<Link href={item.url} />}
              tooltip={item.title}
            >
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
