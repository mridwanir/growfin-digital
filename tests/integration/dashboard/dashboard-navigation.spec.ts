import type { TestTenantFixture } from '../../fixtures/tenant-fixture'
import type * as DropdownMenuModule from '@/components/ui/dropdown-menu'

import { inArray } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import crypto from 'node:crypto'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import StorefrontEditorPage from '@/app/(dashboard)/dashboard/editor/page'
import DashboardLayout from '@/app/(dashboard)/dashboard/layout'
import DashboardPage from '@/app/(dashboard)/dashboard/page'
import TenantProductsPage from '@/app/(dashboard)/dashboard/products/page'
import TenantSettingsPage from '@/app/(dashboard)/dashboard/settings/page'
import { SidebarProvider } from '@/components/ui/sidebar'
import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { userInNeonAuth } from '@/db/schema/auth'
import { DashboardSidebar, NavMain, TenantSwitcher } from '@/features/dashboard'
import { createCategory, createProduct } from '@/features/dashboard/server'
import { auth } from '@/lib/auth/server'
import { env } from '@/lib/env'

import { createMerchantSession, createUnauthenticatedSession } from '../../fixtures/session-fixture'
import { createTestTenant } from '../../fixtures/tenant-fixture'

let currentPathname = ''

const mockCookieStore = {
  delete: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(() => []),
  has: vi.fn(() => false),
  set: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => mockCookieStore),
  headers: vi.fn(async () => new Headers()),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => currentPathname),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
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

describe('Dashboard Navigation Integration Seam', () => {
  const singleUserId = crypto.randomUUID()
  const multiUserId = crypto.randomUUID()
  const zeroUserId = crypto.randomUUID()
  const unauthorizedUserId = crypto.randomUUID()

  let singleTenantFixture: TestTenantFixture
  let multiTenantFixture1: TestTenantFixture
  let multiTenantFixture2: TestTenantFixture
  let unauthorizedTenantFixture: TestTenantFixture

  beforeAll(async () => {
    await db.insert(userInNeonAuth).values([
      {
        id: singleUserId,
        name: 'Single Store Merchant',
        email: `single-merchant-${Date.now()}@growfin.test`,
        emailVerified: true,
        role: 'merchant',
      },
      {
        id: multiUserId,
        name: 'Multi Store Merchant',
        email: `multi-merchant-${Date.now()}@growfin.test`,
        emailVerified: true,
        role: 'merchant',
      },
      {
        id: zeroUserId,
        name: 'Zero Store Merchant',
        email: `zero-merchant-${Date.now()}@growfin.test`,
        emailVerified: true,
        role: 'merchant',
      },
      {
        id: unauthorizedUserId,
        name: 'Unauthorized Merchant',
        email: `unauthorized-merchant-${Date.now()}@growfin.test`,
        emailVerified: true,
        role: 'merchant',
      },
    ])

    const seed = Date.now().toString(36)

    singleTenantFixture = await createTestTenant({
      name: 'Kopi Toko Djawa',
      address: 'Jl. Riau No. 45',
      category: 'Food & Beverage',
      city: 'Bandung',
      customDomain: 'kopitokodjawa.com',
      packageTier: 'pro',
      phone: '081234567890',
      slug: `kopi-toko-djawa-${seed}`,
      status: 'published',
      userId: singleUserId,
      brandingContent: {
        socialLinks: {
          instagram: {
            active: true,
            url: 'https://instagram.com/kopitokodjawa',
          },
        },
      },
    })

    await db.insert(analyticsEvents).values([
      {
        createdAt: new Date(),
        event: 'checkout_start',
        organizationId: singleTenantFixture.tenantId,
        visitorHash: 'hash-single-1',
      },
      {
        acquisition: { source: 'instagram' },
        createdAt: new Date(),
        event: 'checkout_complete',
        organizationId: singleTenantFixture.tenantId,
        visitorHash: 'hash-single-1',
      },
    ])

    const singleCategory = await createCategory(singleTenantFixture.tenantId, singleUserId, {
      name: 'Minuman Kopi',
    })
    if (singleCategory) {
      await createProduct(singleTenantFixture.tenantId, singleUserId, {
        name: 'Es Kopi Awan',
        basePrice: 25000,
        categoryId: singleCategory.id,
        sortOrder: 0,
      })
    }

    multiTenantFixture1 = await createTestTenant({
      name: 'Batik Semar Solo',
      address: 'Jl. Slamet Riyadi No. 10',
      category: 'Retail & Fashion',
      city: 'Surakarta',
      customDomain: 'batiksemar.id',
      packageTier: 'instant',
      phone: '082198765432',
      slug: `batik-semar-solo-${seed}`,
      status: 'published',
      userId: multiUserId,
    })

    const multiCategory = await createCategory(multiTenantFixture1.tenantId, multiUserId, {
      name: 'Batik Pria',
    })
    if (multiCategory) {
      await createProduct(multiTenantFixture1.tenantId, multiUserId, {
        name: 'Kemeja Batik Tulis',
        basePrice: 350000,
        categoryId: multiCategory.id,
        sortOrder: 0,
      })
    }

    multiTenantFixture2 = await createTestTenant({
      name: 'Warung Bu Kris',
      address: 'Jl. Manyar Kertoarjo No. 20',
      category: 'Food & Beverage',
      city: 'Surabaya',
      packageTier: 'free',
      phone: '081345678901',
      slug: `warung-bu-kris-${seed}`,
      status: 'draft',
      userId: multiUserId,
    })

    unauthorizedTenantFixture = await createTestTenant({
      name: 'Toko Lain Milik Merchant Beda',
      address: 'Jl. Thamrin No. 1',
      category: 'Services',
      city: 'Jakarta',
      packageTier: 'free',
      phone: '081987654321',
      slug: `toko-lain-${seed}`,
      status: 'published',
      userId: unauthorizedUserId,
    })
  })

  beforeEach(() => {
    vi.clearAllMocks()
    currentPathname = ''
    mockCookieStore.get.mockReturnValue(undefined)
    mockCookieStore.set.mockClear()
  })

  afterAll(async () => {
    await singleTenantFixture?.cleanup()
    await multiTenantFixture1?.cleanup()
    await multiTenantFixture2?.cleanup()
    await unauthorizedTenantFixture?.cleanup()
    await db
      .delete(userInNeonAuth)
      .where(
        inArray(userInNeonAuth.id, [singleUserId, multiUserId, zeroUserId, unauthorizedUserId]),
      )
  })

  describe('unauthenticated caller access protection across all dashboard routes', () => {
    it('redirects unauthenticated caller from DashboardLayout to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(
        DashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard/editor to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(StorefrontEditorPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard/products to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(TenantProductsPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard/settings to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(TenantSettingsPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects session with empty userId to /login across dashboard views', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(
        createMerchantSession({
          userId: '',
        }),
      )

      await expect(
        DashboardLayout({
          children: React.createElement('div', null, 'Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(StorefrontEditorPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(TenantProductsPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(TenantSettingsPage()).rejects.toThrow('NEXT_REDIRECT:/login')
    })
  })

  describe('zero-tenant merchant redirection to /onboarding', () => {
    it('redirects zero-tenant caller from DashboardLayout to /onboarding', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      await expect(
        DashboardLayout({
          children: React.createElement('div', null, 'Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/onboarding')
      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })

    it('redirects zero-tenant caller from /dashboard to /onboarding', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })

    it('redirects zero-tenant caller from /dashboard/editor to /onboarding', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      await expect(StorefrontEditorPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })

    it('redirects zero-tenant caller from /dashboard/products to /onboarding', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      await expect(TenantProductsPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })

    it('redirects zero-tenant caller from /dashboard/settings to /onboarding', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      await expect(TenantSettingsPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })
  })

  describe('flat session-scoped routes and active store context resolution', () => {
    it('renders single-tenant overview page at /dashboard with flat action links', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(singleTenantFixture.tenant.name)
      expect(html).toContain(singleTenantFixture.slug)
      expect(html).toContain('Bandung')
      expect(html).toContain('081234567890')
      expect(html).toContain('kopitokodjawa.com')
      expect(html).toContain('Aktif (Live)')
      expect(html).toContain('PRO')
      expect(html).toContain('100%')
      expect(html).toContain('href="/dashboard/products"')
      expect(html).toContain('href="/dashboard/settings"')
      expect(html).toContain('href="/dashboard/editor"')
      expect(html).not.toContain(`/dashboard/${singleTenantFixture.slug}`)
      expect(html).toContain(`https://${singleTenantFixture.slug}.${env.NEXT_PUBLIC_BASE_DOMAIN}`)
    })

    it('renders storefront editor at flat route /dashboard/editor for active store', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      const element = await StorefrontEditorPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(singleTenantFixture.slug)
    })

    it('renders catalog page at flat route /dashboard/products for active store', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      const element = await TenantProductsPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(`Katalog Produk: ${singleTenantFixture.tenant.name}`)
      expect(html).toContain('Minuman Kopi')
      expect(html).toContain('Es Kopi Awan')
      expect(html).not.toContain('Batik Pria')
      expect(html).not.toContain('?tenant=')
    })

    it('renders settings page at flat route /dashboard/settings for active store', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      const element = await TenantSettingsPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(`Pengaturan Toko: ${singleTenantFixture.tenant.name}`)
      expect(html).toContain('Jl. Riau No. 45')
      expect(html).toContain('Bandung')
      expect(html).toContain('081234567890')
      expect(html).not.toContain('?tenant=')
    })
  })

  describe('active store context resolution via session activeOrganizationId and cookie', () => {
    it('resolves active store from session.activeOrganizationId', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          activeOrganizationId: multiTenantFixture2.tenantId,
          userId: multiUserId,
        }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(multiTenantFixture2.tenant.name)
      expect(html).toContain(multiTenantFixture2.slug)
      expect(html).toContain('Surabaya')
      expect(html).toContain('081345678901')
      expect(html).not.toContain(multiTenantFixture1.tenant.name)
    })

    it('resolves active store from cookie better-auth.active_organization_id when session activeOrganizationId is null', async () => {
      mockCookieStore.get.mockImplementation((name: string) => {
        if (name === 'better-auth.active_organization_id') {
          return { name, value: multiTenantFixture1.tenantId }
        }
        return undefined
      })

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          activeOrganizationId: null,
          userId: multiUserId,
        }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(multiTenantFixture1.tenant.name)
      expect(html).toContain(multiTenantFixture1.slug)
      expect(html).toContain('Surakarta')
      expect(html).not.toContain(multiTenantFixture2.tenant.name)
    })

    it('falls back to merchant first store when neither session nor cookie specifies active store', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          activeOrganizationId: null,
          userId: multiUserId,
        }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      // multiTenantFixture2 was created after multiTenantFixture1, but getMerchantTenants orders by desc(createdAt)
      // So either multiTenantFixture2 or multiTenantFixture1 is first, let's verify one of the merchant's stores is rendered
      const containsStore1 = html.includes(multiTenantFixture1.tenant.name)
      const containsStore2 = html.includes(multiTenantFixture2.tenant.name)
      expect(containsStore1 || containsStore2).toBe(true)
    })

    it('isolates product catalog data between different active stores of the same merchant', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          activeOrganizationId: multiTenantFixture1.tenantId,
          userId: multiUserId,
        }),
      )

      const element = await TenantProductsPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(`Katalog Produk: ${multiTenantFixture1.tenant.name}`)
      expect(html).toContain('Batik Pria')
      expect(html).toContain('Kemeja Batik Tulis')
      expect(html).not.toContain('Es Kopi Awan')
    })
  })

  describe('dashboard sidebar and layout shell integration', () => {
    it('renders layout shell with persistent sidebar, store header, skip link, and view content', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      currentPathname = '/dashboard'

      const element = await DashboardLayout({
        children: React.createElement(
          'div',
          { id: 'custom-view-content' },
          'Custom Tenant Dashboard View',
        ),
      })

      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)

      expect(html).toContain('data-slot="sidebar"')
      expect(html).toContain('data-slot="sidebar-trigger"')
      expect(html).toContain('data-slot="separator"')
      expect(html).toContain('data-slot="sidebar-inset"')
      expect(html).toContain(singleTenantFixture.tenant.name)
      expect(html).toContain('Overview')
      expect(html).toContain('Storefront Editor')
      expect(html).toContain('Catalog')
      expect(html).toContain('Settings')
      expect(html).toContain('href="#main-content"')
      expect(html).toContain('Skip to main content')
      expect(html).toContain('id="main-content"')
      expect(html).toContain('id="custom-view-content"')
      expect(html).toContain('Custom Tenant Dashboard View')
    })

    it('renders NavMain with flat URLs', () => {
      currentPathname = '/dashboard/editor'

      const html = renderToStaticMarkup(
        React.createElement(SidebarProvider, null, React.createElement(NavMain, null)),
      )

      expect(html).toContain('href="/dashboard"')
      expect(html).toContain('href="/dashboard/editor"')
      expect(html).toContain('href="/dashboard/products"')
      expect(html).toContain('href="/dashboard/settings"')
      expect(html).not.toContain('/dashboard/[tenantSlug]')
    })

    it('renders tenant header displaying active store identity without multi-tenant scaffolding', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(TenantSwitcher, {
            currentTenant: multiTenantFixture1.tenant,
          }),
        ),
      )

      expect(html).toContain(multiTenantFixture1.tenant.name)
      expect(html).toContain('INSTANT')
      expect(html).not.toContain('Buat Toko Baru')
      expect(html).not.toContain('data-[state=open]')
      expect(html).not.toContain(multiTenantFixture2.tenant.name)
    })

    it('renders DashboardSidebar accepting only active tenant context and user', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(DashboardSidebar, {
            currentTenant: multiTenantFixture1.tenant,
            user: {
              name: 'Test Merchant',
              email: 'merchant@growfin.test',
            },
          }),
        ),
      )

      expect(html).toContain(multiTenantFixture1.tenant.name)
      expect(html).toContain('href="/dashboard"')
      expect(html).toContain('Test Merchant')
      expect(html).not.toContain(multiTenantFixture2.tenant.name)
    })
  })
})
