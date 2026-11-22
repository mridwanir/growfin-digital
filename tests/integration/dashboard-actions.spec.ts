import { revalidatePath } from 'next/cache'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { auth } from '@/lib/auth/server'
import {
  createCategoryAction,
  createProductAction,
  createProductCategoryAction,
  deleteCategoryAction,
  deleteProductAction,
  deleteProductCategoryAction,
  updateCategoryAction,
  updateProductAction,
  updateProductCategoryAction,
  updateTenantSettingsAction,
} from '@/lib/dashboard/actions'
import * as dashboardMutations from '@/lib/dashboard/mutations'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const mockUserId = 'user-123'

function createMockSession(userId: string = mockUserId, email: string = 'merchant@example.com') {
  return {
    error: null,
    data: {
      session: {
        id: 'sess-1',
        createdAt: new Date(),
        expiresAt: new Date(),
        token: 'tok-1',
        updatedAt: new Date(),
        userId,
      },
      user: {
        id: userId,
        name: 'Merchant Test',
        createdAt: new Date(),
        email,
        emailVerified: true,
        updatedAt: new Date(),
      },
    },
  }
}

describe('updateTenantSettingsAction seam', () => {
  const mockTenantId = 'tenant-456'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateTenantSettings')

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Merdeka No. 1',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: '',
        },
        user: {
          id: '',
          name: 'Anonymous',
          createdAt: new Date(),
          email: 'anon@example.com',
          emailVerified: false,
          updatedAt: new Date(),
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateTenantSettings')

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Merdeka No. 1',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateTenantSettings')

    const invalidInput = {
      address: 99999,
      operatingHours: {
        isOpen: 'not-a-boolean',
      },
    }

    const result = await updateTenantSettingsAction(mockTenantId, invalidInput)

    expect(result).toMatchObject({
      error: expect.any(String),
      success: false,
      fieldErrors: expect.objectContaining({
        address: expect.any(Array),
      }),
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects modification of tenant owned by another user or non-existent tenant', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    vi.spyOn(dashboardMutations, 'updateTenantSettings').mockResolvedValueOnce(null)

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Sudirman No. 10',
      city: 'Jakarta Selatan',
      phone: '08123456789',
    })

    expect(result).toEqual({
      error: 'Tenant not found or forbidden',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates tenant settings, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))

    const mockUpdatedTenant = {
      id: mockTenantId,
      name: 'Test Store',
      address: 'Jl. Senopati No. 42',
      category: 'Retail & Fashion',
      city: 'Jakarta Selatan',
      createdAt: new Date(),
      customDomain: null,
      domainActiveUntil: null,
      fomoExpiresAt: null,
      googleMapsUrl: null,
      organizationId: null,
      packageTier: 'free' as const,
      phone: '08123456789',
      siteActiveUntil: null,
      slug: 'test-store',
      status: 'published' as const,
      themeConfig: {},
      updatedAt: new Date(),
      userId: mockUserId,
      brandingContent: {
        socialLinks: {
          instagram: { active: true, url: 'https://instagram.com/test' },
        },
      },
      operatingHours: {
        closeTime: '21:00',
        isOpen: true,
        openTime: '08:00',
        raw: '08:00 - 21:00',
      },
    }

    const mutationSpy = vi
      .spyOn(dashboardMutations, 'updateTenantSettings')
      .mockResolvedValueOnce(mockUpdatedTenant)

    const payload = {
      address: 'Jl. Senopati No. 42',
      city: 'Jakarta Selatan',
      phone: '08123456789',
      operatingHours: {
        closeTime: '21:00',
        isOpen: true,
        openTime: '08:00',
        raw: '08:00 - 21:00',
      },
      socialLinks: {
        instagram: { active: true, url: 'https://instagram.com/test' },
      },
    }

    const result = await updateTenantSettingsAction(mockTenantId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, payload)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/settings')
    expect(result).toEqual({
      data: mockUpdatedTenant,
      success: true,
    })
  })
})

describe('createProductCategoryAction seam', () => {
  const mockTenantId = 'tenant-456'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('aliases createCategoryAction for backward compatibility', () => {
    expect(createCategoryAction).toBe(createProductCategoryAction)
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'createCategory')

    const result = await createProductCategoryAction(mockTenantId, { name: 'Makanan' })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    const mutationSpy = vi.spyOn(dashboardMutations, 'createCategory')

    const result = await createProductCategoryAction(mockTenantId, {
      name: '',
      sortOrder: 1.5,
    })

    expect(result).toMatchObject({
      error: 'Category name is required',
      success: false,
      fieldErrors: expect.objectContaining({
        name: expect.arrayContaining(['Category name is required']),
        sortOrder: expect.any(Array),
      }),
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects creation when tenant is not found or forbidden', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    vi.spyOn(dashboardMutations, 'createCategory').mockResolvedValueOnce(null)

    const result = await createProductCategoryAction(mockTenantId, { name: 'Minuman' })

    expect(result).toEqual({
      error: 'Tenant not found or forbidden',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('creates category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))

    const mockCreatedCategory = {
      id: 'cat-123',
      name: 'Minuman Segar',
      slug: 'minuman-segar',
      sortOrder: 0,
      tenantId: mockTenantId,
    }

    const mutationSpy = vi
      .spyOn(dashboardMutations, 'createCategory')
      .mockResolvedValueOnce(mockCreatedCategory)

    const payload = {
      name: 'Minuman Segar',
      slug: 'minuman-segar',
      sortOrder: 0,
    }

    const result = await createProductCategoryAction(mockTenantId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, payload)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: mockCreatedCategory,
      success: true,
    })
  })
})

describe('updateProductCategoryAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockCategoryId = 'cat-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('aliases updateCategoryAction for backward compatibility', () => {
    expect(updateCategoryAction).toBe(updateProductCategoryAction)
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateCategory')

    const result = await updateProductCategoryAction(mockTenantId, mockCategoryId, {
      name: 'Makanan Baru',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateCategory')

    const result = await updateProductCategoryAction(mockTenantId, mockCategoryId, {
      name: '',
      sortOrder: 'invalid' as unknown as number,
    })

    expect(result).toMatchObject({
      error: expect.any(String),
      success: false,
      fieldErrors: expect.objectContaining({
        name: expect.any(Array),
        sortOrder: expect.any(Array),
      }),
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects update when category or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    vi.spyOn(dashboardMutations, 'updateCategory').mockResolvedValueOnce(null)

    const result = await updateProductCategoryAction(mockTenantId, mockCategoryId, {
      name: 'Makanan Edit',
    })

    expect(result).toEqual({
      error: 'Category or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))

    const mockUpdatedCategory = {
      id: mockCategoryId,
      name: 'Makanan Hangat',
      slug: 'makanan-hangat',
      sortOrder: 1,
      tenantId: mockTenantId,
    }

    const mutationSpy = vi
      .spyOn(dashboardMutations, 'updateCategory')
      .mockResolvedValueOnce(mockUpdatedCategory)

    const payload = {
      name: 'Makanan Hangat',
      slug: 'makanan-hangat',
      sortOrder: 1,
    }

    const result = await updateProductCategoryAction(mockTenantId, mockCategoryId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, mockCategoryId, payload)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: mockUpdatedCategory,
      success: true,
    })
  })
})

describe('deleteProductCategoryAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockCategoryId = 'cat-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('aliases deleteCategoryAction for backward compatibility', () => {
    expect(deleteCategoryAction).toBe(deleteProductCategoryAction)
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'deleteCategory')

    const result = await deleteProductCategoryAction(mockTenantId, mockCategoryId)

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects deletion when category or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    vi.spyOn(dashboardMutations, 'deleteCategory').mockResolvedValueOnce(false)

    const result = await deleteProductCategoryAction(mockTenantId, mockCategoryId)

    expect(result).toEqual({
      error: 'Category or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deletes category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))

    const mutationSpy = vi.spyOn(dashboardMutations, 'deleteCategory').mockResolvedValueOnce(true)

    const result = await deleteProductCategoryAction(mockTenantId, mockCategoryId)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, mockCategoryId)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: { success: true },
      success: true,
    })
  })
})

describe('createProductAction seam', () => {
  const mockTenantId = 'tenant-456'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'createProduct')

    const result = await createProductAction(mockTenantId, {
      name: 'Test Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        user: null as unknown as { id: string },
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: '',
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'createProduct')

    const result = await createProductAction(mockTenantId, {
      name: 'Test Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    const mutationSpy = vi.spyOn(dashboardMutations, 'createProduct')

    const result = await createProductAction(mockTenantId, {
      name: '',
      basePrice: -10,
      variants: [
        {
          name: '',
          options: [],
        },
      ],
    })

    expect(result).toMatchObject({
      error: expect.any(String),
      success: false,
      fieldErrors: expect.objectContaining({
        name: expect.arrayContaining(['Product name is required']),
        basePrice: expect.arrayContaining(['Base price must be a non-negative integer']),
      }),
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects creation when tenant is not found or forbidden', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    vi.spyOn(dashboardMutations, 'createProduct').mockResolvedValueOnce(null)

    const result = await createProductAction(mockTenantId, {
      name: 'Nasi Goreng',
      basePrice: 25000,
    })

    expect(result).toEqual({
      error: 'Tenant not found or forbidden',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('creates product, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))

    const mockCreatedProduct = {
      id: 'prod-123',
      name: 'Nasi Goreng Spesial',
      basePrice: 30000,
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date(),
      description: 'Enak dan lezat',
      duration: null,
      imageGallery: [],
      imageStorageKey: 'products/img.jpg',
      imageUrl: 'https://example.com/img.jpg',
      isActive: true,
      originalPrice: 35000,
      sortOrder: 0,
      stock: 50,
      tenantId: mockTenantId,
      updatedAt: new Date(),
      variants: [
        {
          id: 'var-1',
          name: 'Pedas',
          productId: 'prod-123',
          required: false,
          options: [
            {
              id: 'opt-1',
              label: 'Sedang',
              priceModifier: 0,
              sortOrder: 0,
              variantId: 'var-1',
            },
          ],
        },
      ],
    }

    const mutationSpy = vi
      .spyOn(dashboardMutations, 'createProduct')
      .mockResolvedValueOnce(mockCreatedProduct)

    const payload = {
      name: 'Nasi Goreng Spesial',
      basePrice: 30000,
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Enak dan lezat',
      imageStorageKey: 'products/img.jpg',
      imageUrl: 'https://example.com/img.jpg',
      isActive: true,
      originalPrice: 35000,
      stock: 50,
      variants: [
        {
          name: 'Pedas',
          required: false,
          options: [
            {
              label: 'Sedang',
              priceModifier: 0,
              sortOrder: 0,
            },
          ],
        },
      ],
    }

    const result = await createProductAction(mockTenantId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(
      mockTenantId,
      mockUserId,
      expect.objectContaining({
        name: 'Nasi Goreng Spesial',
        basePrice: 30000,
      }),
    )
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: mockCreatedProduct,
      success: true,
    })
  })
})

describe('deleteProductAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockProductId = 'prod-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'deleteProduct')

    const result = await deleteProductAction(mockTenantId, mockProductId)

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        user: null as unknown as { id: string },
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: '',
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'deleteProduct')

    const result = await deleteProductAction(mockTenantId, mockProductId)

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects deletion when product or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    vi.spyOn(dashboardMutations, 'deleteProduct').mockResolvedValueOnce(false)

    const result = await deleteProductAction(mockTenantId, mockProductId)

    expect(result).toEqual({
      error: 'Product or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deletes product, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))

    const mutationSpy = vi.spyOn(dashboardMutations, 'deleteProduct').mockResolvedValueOnce(true)

    const result = await deleteProductAction(mockTenantId, mockProductId)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, mockProductId)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: { success: true },
      success: true,
    })
  })
})

describe('updateProductAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockProductId = 'prod-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateProduct')

    const result = await updateProductAction(mockTenantId, mockProductId, {
      name: 'Updated Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        user: null as unknown as { id: string },
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: '',
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateProduct')

    const result = await updateProductAction(mockTenantId, mockProductId, {
      name: 'Updated Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateProduct')

    const result = await updateProductAction(mockTenantId, mockProductId, {
      name: '',
      basePrice: -5000,
      variants: [
        {
          name: '',
          options: [],
        },
      ],
    })

    expect(result).toMatchObject({
      error: expect.any(String),
      success: false,
      fieldErrors: expect.objectContaining({
        name: expect.arrayContaining(['Product name is required']),
        basePrice: expect.arrayContaining(['Base price must be a non-negative integer']),
      }),
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid variant option labels and non-integer price modifiers', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateProduct')

    const result = await updateProductAction(mockTenantId, mockProductId, {
      variants: [
        {
          name: 'Ukuran',
          options: [
            {
              label: '',
              priceModifier: 2500.5,
            },
          ],
        },
      ],
    })

    expect(result).toMatchObject({
      error: expect.any(String),
      fieldErrors: expect.any(Object),
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects modification when product or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))
    vi.spyOn(dashboardMutations, 'updateProduct').mockResolvedValueOnce(null)

    const result = await updateProductAction(mockTenantId, mockProductId, {
      name: 'Nasi Goreng Mercon',
      basePrice: 28000,
    })

    expect(result).toEqual({
      error: 'Product or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates product and variants atomically, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMockSession(mockUserId))

    const mockUpdatedProduct = {
      id: mockProductId,
      name: 'Nasi Goreng Spesial Pedas',
      basePrice: 32000,
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date(),
      description: 'Pedas nikmat',
      duration: null,
      imageGallery: [],
      imageStorageKey: 'products/img-2.jpg',
      imageUrl: 'https://example.com/img-2.jpg',
      isActive: true,
      originalPrice: 40000,
      sortOrder: 0,
      stock: 30,
      tenantId: mockTenantId,
      updatedAt: new Date(),
      variants: [
        {
          id: 'var-1',
          name: 'Level Pedas',
          productId: mockProductId,
          required: true,
          options: [
            {
              id: 'opt-1',
              label: 'Level 5',
              priceModifier: 3000,
              sortOrder: 0,
              variantId: 'var-1',
            },
          ],
        },
      ],
    }

    const mutationSpy = vi
      .spyOn(dashboardMutations, 'updateProduct')
      .mockResolvedValueOnce(mockUpdatedProduct)

    const payload = {
      name: 'Nasi Goreng Spesial Pedas',
      basePrice: 32000,
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Pedas nikmat',
      imageStorageKey: 'products/img-2.jpg',
      imageUrl: 'https://example.com/img-2.jpg',
      isActive: true,
      originalPrice: 40000,
      stock: 30,
      variants: [
        {
          name: 'Level Pedas',
          required: true,
          options: [
            {
              label: 'Level 5',
              priceModifier: 3000,
              sortOrder: 0,
            },
          ],
        },
      ],
    }

    const result = await updateProductAction(mockTenantId, mockProductId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(
      mockTenantId,
      mockUserId,
      mockProductId,
      expect.objectContaining({
        name: 'Nasi Goreng Spesial Pedas',
        basePrice: 32000,
      }),
    )
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: mockUpdatedProduct,
      success: true,
    })
  })
})
