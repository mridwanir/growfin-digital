import { revalidatePath } from 'next/cache'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { auth } from '@/lib/auth/server'
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  updateTenantSettingsAction,
} from '@/lib/dashboard/actions'
import * as dashboardMutations from '@/lib/dashboard/mutations'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('updateTenantSettingsAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockUserId = 'user-123'

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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })

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

describe('createCategoryAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'createCategory')

    const result = await createCategoryAction(mockTenantId, { name: 'Makanan' })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'createCategory')

    const result = await createCategoryAction(mockTenantId, {
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
    vi.spyOn(dashboardMutations, 'createCategory').mockResolvedValueOnce(null)

    const result = await createCategoryAction(mockTenantId, { name: 'Minuman' })

    expect(result).toEqual({
      error: 'Category or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('creates category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })

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

    const result = await createCategoryAction(mockTenantId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, payload)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: mockCreatedCategory,
      success: true,
    })
  })
})

describe('updateCategoryAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockCategoryId = 'cat-123'
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateCategory')

    const result = await updateCategoryAction(mockTenantId, mockCategoryId, {
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateCategory')

    const result = await updateCategoryAction(mockTenantId, mockCategoryId, {
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
    vi.spyOn(dashboardMutations, 'updateCategory').mockResolvedValueOnce(null)

    const result = await updateCategoryAction(mockTenantId, mockCategoryId, {
      name: 'Makanan Edit',
    })

    expect(result).toEqual({
      error: 'Category or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })

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

    const result = await updateCategoryAction(mockTenantId, mockCategoryId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, mockCategoryId, payload)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: mockUpdatedCategory,
      success: true,
    })
  })
})

describe('deleteCategoryAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockCategoryId = 'cat-123'
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'deleteCategory')

    const result = await deleteCategoryAction(mockTenantId, mockCategoryId)

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects deletion when category or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
    vi.spyOn(dashboardMutations, 'deleteCategory').mockResolvedValueOnce(false)

    const result = await deleteCategoryAction(mockTenantId, mockCategoryId)

    expect(result).toEqual({
      error: 'Category or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deletes category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })

    const mutationSpy = vi.spyOn(dashboardMutations, 'deleteCategory').mockResolvedValueOnce(true)

    const result = await deleteCategoryAction(mockTenantId, mockCategoryId)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, mockCategoryId)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: { success: true },
      success: true,
    })
  })
})
