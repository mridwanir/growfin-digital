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
  tenantSlug?: string
}

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
}

export function NavMain({ tenantSlug: _tenantSlug }: NavMainProps = {}) {
  const pathname = usePathname() || ''

  const items: NavItem[] = [
    {
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard' || pathname === '/dashboard/',
      title: 'Overview',
      url: '/dashboard',
    },
    {
      icon: Palette,
      isActive: pathname === '/dashboard/editor' || pathname.startsWith('/dashboard/editor/'),
      title: 'Storefront Editor',
      url: '/dashboard/editor',
    },
    {
      icon: Package,
      isActive: pathname === '/dashboard/products' || pathname.startsWith('/dashboard/products/'),
      title: 'Catalog',
      url: '/dashboard/products',
    },
    {
      icon: Settings,
      isActive: pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings/'),
      title: 'Settings',
      url: '/dashboard/settings',
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
