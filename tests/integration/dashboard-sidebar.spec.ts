import type * as DropdownMenuModule from '@/components/ui/dropdown-menu'
import type { Tenant } from '@/db/schema/tenants'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import TenantDashboardLayout from '@/app/dashboard/[tenantSlug]/layout'
import { DashboardSidebar, NavMain, NavUser, TenantSwitcher } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth/server'
import * as dashboardMutations from '@/lib/dashboard/mutations'

let currentPathname = '/dashboard/kopi-toko-djawa'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => currentPathname),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

vi.mock('@/components/ui/dropdown-menu', async importOriginal => {
  const actual = await importOriginal<typeof DropdownMenuModule>()
  return {
    ...actual,
    DropdownMenuContent: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => React.createElement('div', { className, 'data-slot': 'dropdown-menu-content' }, children),
  }
})

describe('Dashboard Sidebar & Tenant Switcher Integration Seam', () => {
  const currentTenant = {
    id: 'tenant-1',
    name: 'Kopi Toko Djawa',
    category: 'F&B',
    packageTier: 'Pro',
    slug: 'kopi-toko-djawa',
  }

  const allTenants = [
    currentTenant,
    {
      id: 'tenant-2',
      name: 'Batik Semar',
      category: 'Retail',
      packageTier: 'Free',
      slug: 'batik-semar',
    },
    {
      id: 'tenant-3',
      name: 'Warung Bu Kris',
      category: 'F&B',
      packageTier: 'Starter',
      slug: 'warung-bu-kris',
    },
  ]

  const user = {
    name: 'Barista Utama',
    email: 'barista@kopi.test',
  }

  beforeEach(() => {
    currentPathname = '/dashboard/kopi-toko-djawa'
    vi.clearAllMocks()
  })

  describe('dashboardSidebar component', () => {
    it('renders sidebar container, active tenant display, navigation items, and user profile', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          { defaultOpen: false },
          React.createElement(DashboardSidebar, {
            currentTenant,
            tenants: allTenants,
            user,
          }),
        ),
      )

      expect(html).toContain('data-slot="sidebar"')
      expect(html).toContain('data-collapsible="icon"')
      expect(html).toContain('data-state="collapsed"')
      expect(html).toContain('Kopi Toko Djawa')
      expect(html).toContain('Pro')

      expect(html).toContain('Overview')
      expect(html).toContain('Storefront Editor')
      expect(html).toContain('Catalog')
      expect(html).toContain('Settings')

      expect(html).toContain('href="/dashboard/kopi-toko-djawa"')
      expect(html).toContain('href="/dashboard/kopi-toko-djawa/editor"')
      expect(html).toContain('href="/dashboard/kopi-toko-djawa/products"')
      expect(html).toContain('href="/dashboard/kopi-toko-djawa/settings"')

      expect(html).toContain('Barista Utama')
      expect(html).toContain('barista@kopi.test')
    })
  })

  describe('navMain active section highlighting', () => {
    it('highlights Overview when on root tenant route', () => {
      currentPathname = '/dashboard/kopi-toko-djawa'

      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: 'kopi-toko-djawa' }),
        ),
      )
      expect(html).toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa"[^>]*>/,
      )
      expect(html).not.toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa\/editor"[^>]*>/,
      )
      expect(html).not.toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa\/products"[^>]*>/,
      )
      expect(html).not.toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa\/settings"[^>]*>/,
      )
    })

    it('highlights Storefront Editor when on editor route', () => {
      currentPathname = '/dashboard/kopi-toko-djawa/editor'

      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: 'kopi-toko-djawa' }),
        ),
      )

      expect(html).toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa\/editor"[^>]*>/,
      )
      expect(html).not.toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa"[^>]*>/,
      )
    })

    it('highlights Catalog when on products route', () => {
      currentPathname = '/dashboard/kopi-toko-djawa/products'

      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: 'kopi-toko-djawa' }),
        ),
      )

      expect(html).toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa\/products"[^>]*>/,
      )
      expect(html).not.toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa"[^>]*>/,
      )
    })

    it('highlights Settings when on settings route', () => {
      currentPathname = '/dashboard/kopi-toko-djawa/settings'

      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: 'kopi-toko-djawa' }),
        ),
      )

      expect(html).toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa\/settings"[^>]*>/,
      )
      expect(html).not.toMatch(
        /<a[^>]*aria-current="page"[^>]*href="\/dashboard\/kopi-toko-djawa"[^>]*>/,
      )
    })
  })

  describe('tenantSwitcher component', () => {
    it('displays active tenant and opens menu with links to all merchant stores and new store creation', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(TenantSwitcher, {
            currentTenant,
            tenants: allTenants,
          }),
        ),
      )

      expect(html).toContain('Kopi Toko Djawa')

      expect(html).toContain('href="/dashboard/kopi-toko-djawa"')
      expect(html).toContain('href="/dashboard/batik-semar"')
      expect(html).toContain('href="/dashboard/warung-bu-kris"')

      expect(html).toContain('href="/"')
      expect(html).toContain('Buat Toko Baru')
    })
  })

  describe('navUser component', () => {
    it('displays user initials, name, email, and user action menu', () => {
      const html = renderToStaticMarkup(
        React.createElement(SidebarProvider, null, React.createElement(NavUser, { user })),
      )

      expect(html).toContain('Barista Utama')
      expect(html).toContain('barista@kopi.test')
      expect(html).toContain('BU')
      expect(html).toContain('Account')
      expect(html).toContain('Notifications')
      expect(html).toContain('Log out')
    })
  })

  describe('tenantDashboardLayout integration', () => {
    it('renders complete dashboard shell with sidebar, trigger, separator, and main content', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        error: null,
        data: {
          session: {
            id: 'sess-1',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 86400000),
            token: 'tok-1',
            updatedAt: new Date(),
            userId: 'user-merchant-1',
          },
          user: {
            id: 'user-merchant-1',
            name: 'Barista Utama',
            createdAt: new Date(),
            email: 'barista@kopi.test',
            emailVerified: true,
            role: 'merchant',
            updatedAt: new Date(),
          },
        },
      })

      vi.spyOn(dashboardMutations, 'getTenantBySlug').mockResolvedValueOnce(
        currentTenant as unknown as Tenant,
      )

      vi.spyOn(dashboardMutations, 'getMerchantTenants').mockResolvedValueOnce(
        allTenants as unknown as Tenant[],
      )

      const element = await TenantDashboardLayout({
        params: Promise.resolve({ tenantSlug: 'kopi-toko-djawa' }),
        children: React.createElement(
          'div',
          { id: 'test-dashboard-view' },
          'Content inside tenant dashboard',
        ),
      })

      const html = renderToStaticMarkup(element)

      expect(html).toContain('data-slot="sidebar"')
      expect(html).toContain('data-slot="sidebar-trigger"')
      expect(html).toContain('data-slot="separator"')
      expect(html).toContain('data-slot="sidebar-inset"')

      expect(html).toContain('Kopi Toko Djawa')
      expect(html).toContain('Overview')
      expect(html).toContain('Storefront Editor')
      expect(html).toContain('Catalog')
      expect(html).toContain('Settings')

      expect(html).toContain('<main')
      expect(html).toContain('id="test-dashboard-view"')
      expect(html).toContain('Content inside tenant dashboard')
    })
  })
})
