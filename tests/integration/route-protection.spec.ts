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
import TenantDashboardLayout from '@/app/dashboard/[tenantSlug]/layout'
import { db } from '@/db'
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
import { getTenantBySlug } from '@/lib/dashboard/mutations'

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
  const mockTenantId = 'tenant-test-123'
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
        const result = await updateTenantSettingsAction(mockTenantId, { address: 'Jl. Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductCategoryAction with Unauthorized error', async () => {
        const result = await createProductCategoryAction(mockTenantId, { name: 'Kategori Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductCategoryAction with Unauthorized error', async () => {
        const result = await updateProductCategoryAction(mockTenantId, mockCategoryId, {
          name: 'Kategori Baru',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductCategoryAction with Unauthorized error', async () => {
        const result = await deleteProductCategoryAction(mockTenantId, mockCategoryId)
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductAction with Unauthorized error', async () => {
        const result = await createProductAction(mockTenantId, {
          name: 'Produk Test',
          basePrice: 10000,
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductAction with Unauthorized error', async () => {
        const result = await updateProductAction(mockTenantId, mockProductId, {
          name: 'Produk Edit',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductAction with Unauthorized error', async () => {
        const result = await deleteProductAction(mockTenantId, mockProductId)
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
        const result = await updateTenantSettingsAction(mockTenantId, { address: 'Jl. Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductCategoryAction when user id is empty', async () => {
        const result = await createProductCategoryAction(mockTenantId, { name: 'Kategori Test' })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductCategoryAction when user id is empty', async () => {
        const result = await updateProductCategoryAction(mockTenantId, mockCategoryId, {
          name: 'Kategori Baru',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductCategoryAction when user id is empty', async () => {
        const result = await deleteProductCategoryAction(mockTenantId, mockCategoryId)
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects createProductAction when user id is empty', async () => {
        const result = await createProductAction(mockTenantId, {
          name: 'Produk Test',
          basePrice: 10000,
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects updateProductAction when user id is empty', async () => {
        const result = await updateProductAction(mockTenantId, mockProductId, {
          name: 'Produk Edit',
        })
        expect(result).toEqual({ error: 'Unauthorized', success: false })
      })

      it('rejects deleteProductAction when user id is empty', async () => {
        const result = await deleteProductAction(mockTenantId, mockProductId)
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
        const result = await updateTenantSettingsAction(mockTenantId, {
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
        TenantDashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
          params: Promise.resolve({ tenantSlug: ownerFixture.slug }),
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
        TenantDashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
          params: Promise.resolve({ tenantSlug: ownerFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects caller accessing non-existent tenant slug to /dashboard', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: ownerUserId,
        }),
      )

      await expect(
        TenantDashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
          params: Promise.resolve({ tenantSlug: 'non-existent-tenant-slug' }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('redirects caller accessing unowned tenant slug to /dashboard', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: otherUserId,
        }),
      )

      await expect(
        TenantDashboardLayout({
          children: React.createElement('div', null, 'Child Content'),
          params: Promise.resolve({ tenantSlug: ownerFixture.slug }),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/dashboard')
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('renders layout shell wrapping children for authorized merchant accessing owned tenant slug', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({
          userId: ownerUserId,
        }),
      )

      const element = await TenantDashboardLayout({
        children: React.createElement('div', { id: 'dashboard-child' }, 'Welcome Merchant Store'),
        params: Promise.resolve({ tenantSlug: ownerFixture.slug }),
      })

      expect(element).toBeDefined()
      const html = renderToStaticMarkup(element)
      expect(html).toContain('Welcome Merchant Store')
      expect(html).toContain('id="dashboard-child"')
    })
  })
})
