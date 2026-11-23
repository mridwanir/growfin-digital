import type { TestTenantFixture } from '../fixtures/tenant-fixture'
import type * as DropdownMenuModule from '@/components/ui/dropdown-menu'

import { inArray } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import crypto from 'node:crypto'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import TenantDashboardLayout from '@/app/dashboard/[tenantSlug]/layout'
import TenantOverviewPage from '@/app/dashboard/[tenantSlug]/page'
import TenantProductsPage from '@/app/dashboard/[tenantSlug]/products/page'
import TenantSettingsPage from '@/app/dashboard/[tenantSlug]/settings/page'
import DashboardPage from '@/app/dashboard/page'
import LegacyProductsPage from '@/app/dashboard/products/page'
import LegacySettingsPage from '@/app/dashboard/settings/page'
import { NavMain, TenantSwitcher } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { userInNeonAuth } from '@/db/schema/auth'
import { auth } from '@/lib/auth/server'
import { createCategory, createProduct } from '@/lib/dashboard/mutations'
import { env } from '@/lib/env'

import { createMerchantSession, createUnauthenticatedSession } from '../fixtures/session-fixture'
import { createTestTenant } from '../fixtures/tenant-fixture'

let currentPathname = ''

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => currentPathname),
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
        tenantId: singleTenantFixture.tenantId,
        visitorHash: 'hash-single-1',
      },
      {
        acquisition: { source: 'instagram' },
        createdAt: new Date(),
        event: 'checkout_complete',
        tenantId: singleTenantFixture.tenantId,
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
    it('redirects unauthenticated caller from /dashboard to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard/[tenantSlug]/layout to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(
        TenantDashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard/[tenantSlug] overview to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(
        TenantOverviewPage({
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard/[tenantSlug]/settings to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(
        TenantSettingsPage({
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from /dashboard/[tenantSlug]/products to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(
        TenantProductsPage({
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from legacy /dashboard/settings to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(LegacySettingsPage({})).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects unauthenticated caller from legacy /dashboard/products to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(LegacyProductsPage({})).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects session with empty userId to /login across dashboard views', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(
        createMerchantSession({
          userId: '',
        }),
      )

      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(
        TenantDashboardLayout({
          children: React.createElement('div', null, 'Content'),
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(
        TenantOverviewPage({
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(
        TenantSettingsPage({
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(
        TenantProductsPage({
          params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(LegacySettingsPage({})).rejects.toThrow('NEXT_REDIRECT:/login')
      await expect(LegacyProductsPage({})).rejects.toThrow('NEXT_REDIRECT:/login')
    })
  })

  describe('single-tenant merchant navigation and auto-redirect', () => {
    it('redirects single-tenant caller directly from /dashboard to /dashboard/[tenantSlug]', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      await expect(DashboardPage()).rejects.toThrow(
        `NEXT_REDIRECT:/dashboard/${singleTenantFixture.slug}`,
      )
      expect(redirect).toHaveBeenCalledWith(`/dashboard/${singleTenantFixture.slug}`)
    })

    it('renders single-tenant overview page with analytics and quick action links', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      const element = await TenantOverviewPage({
        params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
      })
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
      expect(html).toContain(`/dashboard/${singleTenantFixture.slug}/products`)
      expect(html).toContain(`/dashboard/${singleTenantFixture.slug}/settings`)
      expect(html).toContain(`/dashboard/${singleTenantFixture.slug}/editor`)
      expect(html).toContain(`https://${singleTenantFixture.slug}.${env.NEXT_PUBLIC_BASE_DOMAIN}`)
    })

    it('redirects single-tenant caller from legacy /dashboard/settings to path-scoped settings', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      await expect(LegacySettingsPage({})).rejects.toThrow(
        `NEXT_REDIRECT:/dashboard/${singleTenantFixture.slug}/settings`,
      )
      expect(redirect).toHaveBeenCalledWith(`/dashboard/${singleTenantFixture.slug}/settings`)
    })

    it('redirects single-tenant caller from legacy /dashboard/products to path-scoped products', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      await expect(LegacyProductsPage({})).rejects.toThrow(
        `NEXT_REDIRECT:/dashboard/${singleTenantFixture.slug}/products`,
      )
      expect(redirect).toHaveBeenCalledWith(`/dashboard/${singleTenantFixture.slug}/products`)
    })
  })

  describe('multi-tenant merchant matrix rendering at /dashboard', () => {
    it('renders portfolio matrix with all merchant stores and metrics without redirecting', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: multiUserId }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)

      expect(html).toContain('Merchant Dashboard')
      expect(html).toContain('Toko &amp; Website Anda (2)')
      expect(html).toContain('Buat Website Baru')

      expect(html).toContain(multiTenantFixture1.tenant.name)
      expect(html).toContain(multiTenantFixture1.slug)
      expect(html).toContain('Surakarta')
      expect(html).toContain('082198765432')
      expect(html).toContain('batiksemar.id')
      expect(html).toContain('Aktif (Live)')
      expect(html).toContain('INSTANT')
      expect(html).toContain(`href="/dashboard/${multiTenantFixture1.slug}"`)
      expect(html).toContain(`href="/dashboard/${multiTenantFixture1.slug}/products"`)
      expect(html).toContain(`href="/dashboard/${multiTenantFixture1.slug}/settings"`)
      expect(html).toContain(`https://${multiTenantFixture1.slug}.${env.NEXT_PUBLIC_BASE_DOMAIN}`)

      expect(html).toContain(multiTenantFixture2.tenant.name)
      expect(html).toContain(multiTenantFixture2.slug)
      expect(html).toContain('Surabaya')
      expect(html).toContain('081345678901')
      expect(html).toContain('Draft')
      expect(html).toContain('FREE DEMO')
      expect(html).toContain(`href="/dashboard/${multiTenantFixture2.slug}"`)
      expect(html).toContain(`href="/dashboard/${multiTenantFixture2.slug}/products"`)
      expect(html).toContain(`href="/dashboard/${multiTenantFixture2.slug}/settings"`)
      expect(html).toContain(`/demo/${multiTenantFixture2.slug}`)
    })
  })

  describe('zero-tenant merchant empty state rendering at /dashboard', () => {
    it('renders empty state card with CTA when merchant has zero stores without redirecting', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain('Merchant Dashboard')
      expect(html).toContain('Toko &amp; Website Anda (0)')
      expect(html).toContain('Belum Ada Website')
      expect(html).toContain('Anda belum memiliki website toko aktif')
      expect(html).toContain('Mulai Buat Website')
      expect(html).toContain('href="/"')
    })

    it('redirects zero-tenant caller from legacy /dashboard/settings to /dashboard', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      await expect(LegacySettingsPage({})).rejects.toThrow('NEXT_REDIRECT:/dashboard')
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('redirects zero-tenant caller from legacy /dashboard/products to /dashboard', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroUserId }),
      )

      await expect(LegacyProductsPage({})).rejects.toThrow('NEXT_REDIRECT:/dashboard')
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('unauthorized and non-existent tenant slug access redirects to /dashboard', () => {
    const nonExistentSlug = 'toko-fiktif-tidak-pernah-ada'

    describe('tenant overview route (/dashboard/[tenantSlug])', () => {
      it('redirects caller to /dashboard when accessing non-existent slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: singleUserId }),
        )

        await expect(
          TenantOverviewPage({
            params: Promise.resolve({ tenantSlug: nonExistentSlug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })

      it('redirects caller to /dashboard when accessing another merchant store slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: unauthorizedUserId }),
        )

        await expect(
          TenantOverviewPage({
            params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })
    })

    describe('tenant settings route (/dashboard/[tenantSlug]/settings)', () => {
      it('redirects caller to /dashboard when accessing non-existent slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: singleUserId }),
        )

        await expect(
          TenantSettingsPage({
            params: Promise.resolve({ tenantSlug: nonExistentSlug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })

      it('redirects caller to /dashboard when accessing another merchant store slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: unauthorizedUserId }),
        )

        await expect(
          TenantSettingsPage({
            params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })
    })

    describe('tenant products route (/dashboard/[tenantSlug]/products)', () => {
      it('redirects caller to /dashboard when accessing non-existent slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: singleUserId }),
        )

        await expect(
          TenantProductsPage({
            params: Promise.resolve({ tenantSlug: nonExistentSlug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })

      it('redirects caller to /dashboard when accessing another merchant store slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: unauthorizedUserId }),
        )

        await expect(
          TenantProductsPage({
            params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })
    })

    describe('tenant dashboard layout shell (/dashboard/[tenantSlug]/layout.tsx)', () => {
      it('redirects caller to /dashboard when accessing non-existent slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: singleUserId }),
        )

        await expect(
          TenantDashboardLayout({
            children: React.createElement('div', null, 'Content'),
            params: Promise.resolve({ tenantSlug: nonExistentSlug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })

      it('redirects caller to /dashboard when accessing another merchant store slug', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: unauthorizedUserId }),
        )

        await expect(
          TenantDashboardLayout({
            children: React.createElement('div', null, 'Content'),
            params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('path-scoped settings and products load the correct tenant data', () => {
    it('loads operational settings for requested path-scoped tenant', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      const element = await TenantSettingsPage({
        params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
      })
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(`Pengaturan Toko: ${singleTenantFixture.tenant.name}`)
      expect(html).toContain('Jl. Riau No. 45')
      expect(html).toContain('Bandung')
      expect(html).toContain('081234567890')
      expect(html).not.toContain('?tenant=')
    })

    it('loads settings for multi-tenant merchant store without leaking other stores', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: multiUserId }),
      )

      const element = await TenantSettingsPage({
        params: Promise.resolve({ tenantSlug: multiTenantFixture1.slug }),
      })
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(`Pengaturan Toko: ${multiTenantFixture1.tenant.name}`)
      expect(html).toContain('Surakarta')
      expect(html).toContain('082198765432')
      expect(html).not.toContain('Surabaya')
      expect(html).not.toContain('?tenant=')
    })

    it('loads categories and products for requested path-scoped tenant', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      const element = await TenantProductsPage({
        params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
      })
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(`Katalog Produk: ${singleTenantFixture.tenant.name}`)
      expect(html).toContain('Minuman Kopi')
      expect(html).toContain('Es Kopi Awan')
      expect(html).not.toContain('Batik Pria')
      expect(html).not.toContain('Kemeja Batik Tulis')
      expect(html).not.toContain('?tenant=')
    })

    it('isolates product catalog data between different stores of the same merchant', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: multiUserId }),
      )

      const element = await TenantProductsPage({
        params: Promise.resolve({ tenantSlug: multiTenantFixture1.slug }),
      })
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(`Katalog Produk: ${multiTenantFixture1.tenant.name}`)
      expect(html).toContain('Batik Pria')
      expect(html).toContain('Kemeja Batik Tulis')
      expect(html).not.toContain('Es Kopi Awan')
      expect(html).not.toContain('?tenant=')
    })
  })

  describe('legacy query-param routes redirect to canonical path-scoped routes', () => {
    describe('legacy settings route (/dashboard/settings)', () => {
      it('redirects matching tenant id query param to path-scoped settings route', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(
          LegacySettingsPage({
            searchParams: Promise.resolve({ tenant: multiTenantFixture1.tenantId }),
          }),
        ).rejects.toThrow(`NEXT_REDIRECT:/dashboard/${multiTenantFixture1.slug}/settings`)
        expect(redirect).toHaveBeenCalledWith(`/dashboard/${multiTenantFixture1.slug}/settings`)
      })

      it('redirects matching tenant slug query param to path-scoped settings route', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(
          LegacySettingsPage({
            searchParams: Promise.resolve({ tenant: multiTenantFixture2.slug }),
          }),
        ).rejects.toThrow(`NEXT_REDIRECT:/dashboard/${multiTenantFixture2.slug}/settings`)
        expect(redirect).toHaveBeenCalledWith(`/dashboard/${multiTenantFixture2.slug}/settings`)
      })

      it('redirects multi-tenant caller without query param to /dashboard', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(LegacySettingsPage({})).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })

      it('redirects multi-tenant caller with unknown query param to /dashboard', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(
          LegacySettingsPage({
            searchParams: Promise.resolve({ tenant: 'unknown-tenant-id' }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })
    })

    describe('legacy products route (/dashboard/products)', () => {
      it('redirects matching tenant id query param to path-scoped products route', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(
          LegacyProductsPage({
            searchParams: Promise.resolve({ tenant: multiTenantFixture1.tenantId }),
          }),
        ).rejects.toThrow(`NEXT_REDIRECT:/dashboard/${multiTenantFixture1.slug}/products`)
        expect(redirect).toHaveBeenCalledWith(`/dashboard/${multiTenantFixture1.slug}/products`)
      })

      it('redirects matching tenant slug query param to path-scoped products route', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(
          LegacyProductsPage({
            searchParams: Promise.resolve({ tenant: multiTenantFixture2.slug }),
          }),
        ).rejects.toThrow(`NEXT_REDIRECT:/dashboard/${multiTenantFixture2.slug}/products`)
        expect(redirect).toHaveBeenCalledWith(`/dashboard/${multiTenantFixture2.slug}/products`)
      })

      it('redirects multi-tenant caller without query param to /dashboard', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(LegacyProductsPage({})).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })

      it('redirects multi-tenant caller with unknown query param to /dashboard', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({ userId: multiUserId }),
        )

        await expect(
          LegacyProductsPage({
            searchParams: Promise.resolve({ tenant: 'unknown-tenant-id' }),
          }),
        ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
        expect(redirect).toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('tenant switcher and dashboard sidebar shell integration', () => {
    it('renders layout shell with persistent sidebar, store header, and view content', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: singleUserId }),
      )

      currentPathname = `/dashboard/${singleTenantFixture.slug}`

      const element = await TenantDashboardLayout({
        params: Promise.resolve({ tenantSlug: singleTenantFixture.slug }),
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
      expect(html).toContain('id="custom-view-content"')
      expect(html).toContain('Custom Tenant Dashboard View')
    })

    it('renders tenant switcher with active store and switching options for all merchant stores', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(TenantSwitcher, {
            currentTenant: multiTenantFixture1.tenant,
            tenants: [multiTenantFixture1.tenant, multiTenantFixture2.tenant],
          }),
        ),
      )

      expect(html).toContain(multiTenantFixture1.tenant.name)
      expect(html).toContain(`href="/dashboard/${multiTenantFixture1.slug}"`)
      expect(html).toContain(multiTenantFixture2.tenant.name)
      expect(html).toContain(`href="/dashboard/${multiTenantFixture2.slug}"`)
      expect(html).toContain('href="/"')
      expect(html).toContain('Buat Toko Baru')
    })

    it('highlights active navigation items according to current route path', () => {
      currentPathname = `/dashboard/${singleTenantFixture.slug}`
      const overviewMarkup = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: singleTenantFixture.slug }),
        ),
      )
      expect(overviewMarkup).toContain('aria-current="page"')

      currentPathname = `/dashboard/${singleTenantFixture.slug}/products`
      const productsMarkup = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: singleTenantFixture.slug }),
        ),
      )
      expect(productsMarkup).toContain('aria-current="page"')

      currentPathname = `/dashboard/${singleTenantFixture.slug}/settings`
      const settingsMarkup = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: singleTenantFixture.slug }),
        ),
      )
      expect(settingsMarkup).toContain('aria-current="page"')

      currentPathname = `/dashboard/${singleTenantFixture.slug}/editor`
      const editorMarkup = renderToStaticMarkup(
        React.createElement(
          SidebarProvider,
          null,
          React.createElement(NavMain, { tenantSlug: singleTenantFixture.slug }),
        ),
      )
      expect(editorMarkup).toContain('aria-current="page"')
    })
  })
})
