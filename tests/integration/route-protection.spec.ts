import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { POST as storageDeleteRoute } from '@/app/api/storage/delete/route'
import { POST as storageUploadRoute } from '@/app/api/storage/upload/route'
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

import { createMerchantSession, createUnauthenticatedSession } from '../fixtures/session-fixture'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
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
})
