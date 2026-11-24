import type { TestTenantFixture } from '../fixtures/tenant-fixture'

import { inArray } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST as storageDeleteRoute } from '@/app/api/storage/delete/route'
import { POST as storageUploadRoute } from '@/app/api/storage/upload/route'
import DashboardLayout from '@/app/dashboard/layout'
import DashboardPage from '@/app/dashboard/page'
import TenantProductsPage from '@/app/dashboard/products/page'
import TenantSettingsPage from '@/app/dashboard/settings/page'
import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { userInNeonAuth } from '@/db/schema/auth'
import { auth } from '@/lib/auth/server'
import {
  createProductAction,
  createProductCategoryAction,
  deleteProductAction,
  deleteProductCategoryAction,
  updateProductAction,
  updateProductCategoryAction,
  updateTenantSettingsAction,
} from '@/lib/dashboard/actions'
import { createCategory, createProduct, getTenantBySlug } from '@/lib/dashboard/mutations'

import {
  createCustomerSession,
  createMerchantSession,
  createUnauthenticatedSession,
} from '../fixtures/session-fixture'
import { createTestTenant } from '../fixtures/tenant-fixture'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => ''),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

describe('Route Protection & Authorization Seam', () => {
  const mockCategoryId = 'cat-test-123'
  const mockProductId = 'prod-test-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('server Actions Authorization Seam', () => {
    describe('unauthenticated requests (null session)', () => {
      beforeEach(() => {
        vi.spyOn(auth, 'getSession').mockResolvedValue(createUnauthenticatedSession())
      })

      it('rejects updateTenantSettingsAction with Unauthorized error', async () => {
        const result = await updateTenantSettingsAction({ address: 'Jl. Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductCategoryAction with Unauthorized error', async () => {
        const result = await createProductCategoryAction({ name: 'Kategori Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductCategoryAction with Unauthorized error', async () => {
        const result = await updateProductCategoryAction(mockCategoryId, {
          name: 'Kategori Baru',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductCategoryAction with Unauthorized error', async () => {
        const result = await deleteProductCategoryAction(mockCategoryId)
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductAction with Unauthorized error', async () => {
        const result = await createProductAction({
          name: 'Produk Test',
          basePrice: 10000,
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductAction with Unauthorized error', async () => {
        const result = await updateProductAction(mockProductId, {
          name: 'Produk Edit',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductAction with Unauthorized error', async () => {
        const result = await deleteProductAction(mockProductId)
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })
    })

    describe('requests with missing session user or user id', () => {
      beforeEach(() => {
        vi.spyOn(auth, 'getSession').mockResolvedValue(
          createMerchantSession({
            name: 'Missing User',
            email: 'missing@example.com',
            emailVerified: false,
            userId: '',
          }),
        )
      })

      it('rejects updateTenantSettingsAction when user id is empty', async () => {
        const result = await updateTenantSettingsAction({ address: 'Jl. Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductCategoryAction when user id is empty', async () => {
        const result = await createProductCategoryAction({ name: 'Kategori Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductCategoryAction when user id is empty', async () => {
        const result = await updateProductCategoryAction(mockCategoryId, {
          name: 'Kategori Baru',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductCategoryAction when user id is empty', async () => {
        const result = await deleteProductCategoryAction(mockCategoryId)
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductAction when user id is empty', async () => {
        const result = await createProductAction({
          name: 'Produk Test',
          basePrice: 10000,
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductAction when user id is empty', async () => {
        const result = await updateProductAction(mockProductId, {
          name: 'Produk Edit',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductAction when user id is empty', async () => {
        const result = await deleteProductAction(mockProductId)
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })
    })

    describe('requests with customer session without user id', () => {
      beforeEach(() => {
        vi.spyOn(auth, 'getSession').mockResolvedValue(
          createCustomerSession({
            name: 'Customer User',
            email: 'customer@example.com',
            userId: '',
          }),
        )
      })

      it('rejects updateTenantSettingsAction when user id is empty', async () => {
        const result = await updateTenantSettingsAction({
          name: 'Toko Baru',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })
    })
  })

  describe('remaining Protected Route Handlers', () => {
    describe('POST /api/storage/upload', () => {
      it('returns 401 Unauthorized for unauthenticated requests', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

        const req = new NextRequest('http://localhost:3000/api/storage/upload', {
          method: 'POST',
        })
        const res = await storageUploadRoute(req)

        expect(res.status).toBe(401)
        const data = await res.json()
        expect(data).toEqual({ error: 'Unauthorized' })
      })

      it('returns 401 Unauthorized when session user is missing', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ user: null }))
        const req = new NextRequest('http://localhost:3000/api/storage/upload', {
          method: 'POST',
        })
        const res = await storageUploadRoute(req)

        expect(res.status).toBe(401)
        const data = await res.json()
        expect(data).toEqual({ error: 'Unauthorized' })
      })
    })

    describe('POST /api/storage/delete', () => {
      it('returns 401 Unauthorized for unauthenticated requests', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

        const req = new NextRequest('http://localhost:3000/api/storage/delete', {
          body: JSON.stringify({ key: 'test.jpg' }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
        const res = await storageDeleteRoute(req)

        expect(res.status).toBe(401)
        const data = await res.json()
        expect(data).toEqual({ error: 'Unauthorized' })
      })

      it('returns 401 Unauthorized when session user is missing', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ user: null }))
        const req = new NextRequest('http://localhost:3000/api/storage/delete', {
          body: JSON.stringify({ key: 'test.jpg' }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
        const res = await storageDeleteRoute(req)

        expect(res.status).toBe(401)
        const data = await res.json()
        expect(data).toEqual({ error: 'Unauthorized' })
      })
    })
  })
  describe('getTenantBySlug Query Seam', () => {
    const userId1 = crypto.randomUUID()
    const userId2 = crypto.randomUUID()
    let fixtureUser1: TestTenantFixture
    let fixtureUser2: TestTenantFixture

    beforeAll(async () => {
      await db.insert(userInNeonAuth).values([
        {
          id: userId1,
          name: 'Merchant One',
          email: `merchant-one-${Date.now()}@example.com`,
          emailVerified: true,
        },
        {
          id: userId2,
          name: 'Merchant Two',
          email: `merchant-two-${Date.now()}@example.com`,
          emailVerified: true,
        },
      ])

      fixtureUser1 = await createTestTenant({
        slug: `tenant-one-${Date.now()}`,
        userId: userId1,
      })

      fixtureUser2 = await createTestTenant({
        slug: `tenant-two-${Date.now()}`,
        userId: userId2,
      })
    })

    afterAll(async () => {
      await fixtureUser1?.cleanup()
      await fixtureUser2?.cleanup()
      await db.delete(userInNeonAuth).where(inArray(userInNeonAuth.id, [userId1, userId2]))
    })

    it('returns the tenant when matching both slug and userId', async () => {
      const result = await getTenantBySlug(fixtureUser1.slug, userId1)
      expect(result).not.toBeNull()
      expect(result?.id).toBe(fixtureUser1.tenantId)
      expect(result?.slug).toBe(fixtureUser1.slug)
      expect(result?.userId).toBe(userId1)
    })

    it('returns null when slug exists but belongs to a different user', async () => {
      const result = await getTenantBySlug(fixtureUser1.slug, userId2)
      expect(result).toBeNull()
    })

    it('returns null when slug does not exist', async () => {
      const result = await getTenantBySlug('non-existent-slug-xyz', userId1)
      expect(result).toBeNull()
    })
  })
  describe('path-scoped dashboard route layout guard seam', () => {
    const ownerUserId = crypto.randomUUID()
    const otherUserId = crypto.randomUUID()
    let ownerFixture: TestTenantFixture

    beforeAll(async () => {
      await db.insert(userInNeonAuth).values([
        {
          id: ownerUserId,
          name: 'Owner Merchant',
          email: `owner-merchant-${Date.now()}@example.com`,
          emailVerified: true,
        },
        {
          id: otherUserId,
          name: 'Other Merchant',
          email: `other-merchant-${Date.now()}@example.com`,
          emailVerified: true,
        },
      ])

      ownerFixture = await createTestTenant({
        slug: `owner-store-${Date.now()}`,
        userId: ownerUserId,
      })
    })

    afterAll(async () => {
      await ownerFixture?.cleanup()
      await db.delete(userInNeonAuth).where(inArray(userInNeonAuth.id, [ownerUserId, otherUserId]))
    })

    it('redirects unauthenticated caller to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(
        DashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects caller with missing session user id to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: '',
        }),
      )

      await expect(
        DashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects caller accessing unowned or zero tenant to /onboarding', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: otherUserId,
        }),
      )

      await expect(
        DashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/onboarding')
      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })

    it('renders layout shell wrapping children for authorized merchant', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: ownerUserId,
        }),
      )

      const element = await DashboardLayout({
        children: React.createElement('div', { id: 'dashboard-child' }, 'Welcome Merchant Store'),
      })

      expect(element).toBeDefined()
      const html = renderToStaticMarkup(element)
      expect(html).toContain('Welcome Merchant Store')
      expect(html).toContain('id="dashboard-child"')
      expect(html).toContain('href="#main-content"')
      expect(html).toContain('Skip to main content')
      expect(html).toContain('id="main-content"')
    })
  })

  describe('root dashboard route overview and redirect seam', () => {
    const singleTenantUserId = crypto.randomUUID()
    const multiTenantUserId = crypto.randomUUID()
    const zeroTenantUserId = crypto.randomUUID()
    let singleTenantFixture: TestTenantFixture
    let multiTenantFixtureA: TestTenantFixture
    let multiTenantFixtureB: TestTenantFixture

    beforeAll(async () => {
      const now = Date.now()
      await db.insert(userInNeonAuth).values([
        {
          id: singleTenantUserId,
          name: 'Single Store Merchant',
          email: `single-merchant-${now}@example.com`,
          emailVerified: true,
        },
        {
          id: multiTenantUserId,
          name: 'Multi Store Merchant',
          email: `multi-merchant-${now}@example.com`,
          emailVerified: true,
        },
        {
          id: zeroTenantUserId,
          name: 'Zero Store Merchant',
          email: `zero-merchant-${now}@example.com`,
          emailVerified: true,
        },
      ])

      singleTenantFixture = await createTestTenant({
        slug: `single-store-${now}`,
        userId: singleTenantUserId,
      })

      multiTenantFixtureA = await createTestTenant({
        slug: `multi-store-a-${now}`,
        userId: multiTenantUserId,
      })

      multiTenantFixtureB = await createTestTenant({
        slug: `multi-store-b-${now}`,
        userId: multiTenantUserId,
      })
    })

    afterAll(async () => {
      await singleTenantFixture?.cleanup()
      await multiTenantFixtureA?.cleanup()
      await multiTenantFixtureB?.cleanup()
      await db
        .delete(userInNeonAuth)
        .where(
          inArray(userInNeonAuth.id, [singleTenantUserId, multiTenantUserId, zeroTenantUserId]),
        )
    })

    it('redirects unauthenticated caller to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects caller with missing session user id to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: '',
        }),
      )

      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('renders store overview without redirecting to slug for single-tenant merchant', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: singleTenantUserId,
        }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(singleTenantFixture.slug)
      expect(html).toContain('href="/dashboard/products"')
      expect(html).toContain('href="/dashboard/settings"')
      expect(html).toContain('href="/dashboard/editor"')
    })

    it('renders active store overview for multi-tenant merchant', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          activeOrganizationId: multiTenantFixtureA.tenantId,
          userId: multiTenantUserId,
        }),
      )

      const element = await DashboardPage()
      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      const html = renderToStaticMarkup(element)
      expect(html).toContain(multiTenantFixtureA.slug)
      expect(html).toContain('href="/dashboard/products"')
      expect(html).toContain('href="/dashboard/settings"')
      expect(html).toContain('href="/dashboard/editor"')
    })

    it('redirects zero-tenant merchant to /onboarding', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: zeroTenantUserId,
        }),
      )

      await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })
  })

  describe('path-scoped tenant overview, settings, and products routes seam', () => {
    const singleUserId = crypto.randomUUID()
    const multiUserId = crypto.randomUUID()
    const unownedUserId = crypto.randomUUID()
    let singleTenantFixture: TestTenantFixture
    let multiTenantFixture1: TestTenantFixture
    let multiTenantFixture2: TestTenantFixture

    beforeAll(async () => {
      await db.insert(userInNeonAuth).values([
        {
          id: singleUserId,
          name: 'Single Owner',
          email: `single-owner-${Date.now()}@example.com`,
          emailVerified: true,
        },
        {
          id: multiUserId,
          name: 'Multi Owner',
          email: `multi-owner-${Date.now()}@example.com`,
          emailVerified: true,
        },
        {
          id: unownedUserId,
          name: 'Unowned Merchant',
          email: `unowned-merchant-${Date.now()}@example.com`,
          emailVerified: true,
        },
      ])

      singleTenantFixture = await createTestTenant({
        city: 'Bandung',
        phone: '081234567890',
        slug: `store-single-${Date.now()}`,
        userId: singleUserId,
      })

      multiTenantFixture1 = await createTestTenant({
        slug: `store-multi-1-${Date.now()}`,
        userId: multiUserId,
      })

      multiTenantFixture2 = await createTestTenant({
        slug: `store-multi-2-${Date.now()}`,
        userId: multiUserId,
      })

      await db.insert(analyticsEvents).values([
        {
          acquisition: { source: 'instagram' },
          createdAt: new Date(),
          event: 'page_view',
          organizationId: singleTenantFixture.tenantId,
          visitorHash: 'hash-visitor-test-1',
        },
        {
          acquisition: { source: 'instagram' },
          createdAt: new Date(),
          event: 'checkout_start',
          organizationId: singleTenantFixture.tenantId,
          visitorHash: 'hash-visitor-test-1',
        },
        {
          acquisition: { source: 'instagram' },
          createdAt: new Date(),
          event: 'checkout_complete',
          organizationId: singleTenantFixture.tenantId,
          visitorHash: 'hash-visitor-test-1',
        },
      ])

      const cat = await createCategory(singleTenantFixture.tenantId, singleUserId, {
        name: 'Kopi Susu Spesial',
      })
      if (cat) {
        await createProduct(singleTenantFixture.tenantId, singleUserId, {
          name: 'Kopi Susu Gula Aren Enak',
          basePrice: 22000,
          categoryId: cat.id,
          sortOrder: 0,
        })
      }
    })

    afterAll(async () => {
      await singleTenantFixture?.cleanup()
      await multiTenantFixture1?.cleanup()
      await multiTenantFixture2?.cleanup()
      await db
        .delete(userInNeonAuth)
        .where(inArray(userInNeonAuth.id, [singleUserId, multiUserId, unownedUserId]))
    })

    describe('tenant overview page (/dashboard)', () => {
      it('redirects unauthenticated caller to /login', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

        await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/login')
        expect(redirect).toHaveBeenCalledWith('/login')
      })

      it('redirects caller with no store to /onboarding', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({
            userId: unownedUserId,
          }),
        )

        await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
        expect(redirect).toHaveBeenCalledWith('/onboarding')
      })

      it('renders tenant overview with analytics metrics and quick store links', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({
            userId: singleUserId,
          }),
        )

        const element = await DashboardPage()
        expect(element).toBeDefined()
        expect(redirect).not.toHaveBeenCalled()

        const html = renderToStaticMarkup(element)
        expect(html).toContain(singleTenantFixture.tenant.name)
        expect(html).toContain(singleTenantFixture.slug)
        expect(html).toContain('Bandung')
        expect(html).toContain('081234567890')
        expect(html).toContain('instagram')
        expect(html).toContain('href="/dashboard/products"')
        expect(html).toContain('href="/dashboard/settings"')
        expect(html).toContain('href="/dashboard/editor"')
      })
    })

    describe('tenant settings page (/dashboard/settings)', () => {
      it('redirects unauthenticated caller to /login', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

        await expect(TenantSettingsPage()).rejects.toThrow('NEXT_REDIRECT:/login')
        expect(redirect).toHaveBeenCalledWith('/login')
      })

      it('redirects caller with no store to /onboarding', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({
            userId: unownedUserId,
          }),
        )

        await expect(TenantSettingsPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
        expect(redirect).toHaveBeenCalledWith('/onboarding')
      })

      it('loads settings for active tenant', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({
            userId: singleUserId,
          }),
        )

        const element = await TenantSettingsPage()
        expect(element).toBeDefined()
        expect(redirect).not.toHaveBeenCalled()

        const html = renderToStaticMarkup(element)
        expect(html).toContain(`Pengaturan Toko: ${singleTenantFixture.tenant.name}`)
        expect(html).toContain('Bandung')
        expect(html).toContain('081234567890')
        expect(html).not.toContain('?tenant=')
      })
    })

    describe('tenant products page (/dashboard/products)', () => {
      it('redirects unauthenticated caller to /login', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

        await expect(TenantProductsPage()).rejects.toThrow('NEXT_REDIRECT:/login')
        expect(redirect).toHaveBeenCalledWith('/login')
      })

      it('redirects caller with no store to /onboarding', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({
            userId: unownedUserId,
          }),
        )

        await expect(TenantProductsPage()).rejects.toThrow('NEXT_REDIRECT:/onboarding')
        expect(redirect).toHaveBeenCalledWith('/onboarding')
      })

      it('loads categories and products for active tenant', async () => {
        vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
          createMerchantSession({
            userId: singleUserId,
          }),
        )

        const element = await TenantProductsPage()
        expect(element).toBeDefined()
        expect(redirect).not.toHaveBeenCalled()

        const html = renderToStaticMarkup(element)
        expect(html).toContain(`Katalog Produk: ${singleTenantFixture.tenant.name}`)
        expect(html).toContain('Kopi Susu Spesial')
        expect(html).toContain('Kopi Susu Gula Aren Enak')
        expect(html).not.toContain('?tenant=')
      })
    })
  })
})
