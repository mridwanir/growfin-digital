import type { TestTenantFixture } from '../fixtures/tenant-fixture'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import crypto from 'node:crypto'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/db'
import { userInNeonAuth } from '@/db/schema/auth'
import { categories, products } from '@/db/schema/catalog'
import { tenants } from '@/db/schema/tenants'
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
import { createTestTenant } from '../fixtures/tenant-fixture'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const mockUserId = crypto.randomUUID()
const mockTenantId = crypto.randomUUID()
let seededCategoryId: string
let tenantFixture: TestTenantFixture

beforeAll(async () => {
  await db.insert(userInNeonAuth).values({
    id: mockUserId,
    name: 'Merchant Test',
    email: `merchant-actions-${Date.now()}@example.com`,
    emailVerified: true,
  })

  tenantFixture = await createTestTenant({
    id: mockTenantId,
    name: 'Test Store',
    address: 'Jl. Senopati No. 10',
    category: 'Retail & Fashion',
    city: 'Jakarta Selatan',
    phone: '08123456789',
    status: 'published',
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
  })

  const [cat] = await db
    .insert(categories)
    .values({
      name: 'Kategori Default',
      slug: `cat-default-${Date.now()}`,
      sortOrder: 0,
      tenantId: mockTenantId,
    })
    .returning()
  seededCategoryId = cat.id
})

afterAll(async () => {
  await tenantFixture?.cleanup()
  await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, mockUserId))
})

describe('updateTenantSettingsAction seam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Merdeka No. 1',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ userId: '' }))

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Merdeka No. 1',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

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
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects modification of tenant owned by another user or non-existent tenant', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await updateTenantSettingsAction(crypto.randomUUID(), {
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

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

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/settings')
    expect(result).toMatchObject({
      success: true,
      data: {
        id: mockTenantId,
        address: 'Jl. Senopati No. 42',
        city: 'Jakarta Selatan',
        phone: '08123456789',
      },
    })

    const [updated] = await db.select().from(tenants).where(eq(tenants.id, mockTenantId))
    expect(updated.address).toBe('Jl. Senopati No. 42')
    expect(updated.city).toBe('Jakarta Selatan')
    expect(updated.phone).toBe('08123456789')
  })
})

describe('createProductCategoryAction seam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

    const result = await createProductCategoryAction(mockTenantId, { name: 'Makanan' })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

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
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects creation when tenant is not found or forbidden', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await createProductCategoryAction(crypto.randomUUID(), { name: 'Minuman' })

    expect(result).toEqual({
      error: 'Tenant not found or forbidden',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('creates category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const payload = {
      name: 'Minuman Segar',
      slug: `minuman-segar-${Date.now()}`,
      sortOrder: 0,
    }

    const result = await createProductCategoryAction(mockTenantId, payload)

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toMatchObject({
      success: true,
      data: {
        name: 'Minuman Segar',
        tenantId: mockTenantId,
      },
    })
  })
})

describe('updateProductCategoryAction seam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

    const result = await updateProductCategoryAction(mockTenantId, crypto.randomUUID(), {
      name: 'Makanan Baru',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await updateProductCategoryAction(mockTenantId, crypto.randomUUID(), {
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
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects update when category or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await updateProductCategoryAction(mockTenantId, crypto.randomUUID(), {
      name: 'Makanan Edit',
    })

    expect(result).toEqual({
      error: 'Category or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const [testCat] = await db
      .insert(categories)
      .values({
        name: 'Makanan Lama',
        slug: `makanan-lama-${Date.now()}`,
        sortOrder: 0,
        tenantId: mockTenantId,
      })
      .returning()

    const payload = {
      name: 'Makanan Hangat',
      slug: `makanan-hangat-${Date.now()}`,
      sortOrder: 1,
    }

    const result = await updateProductCategoryAction(mockTenantId, testCat.id, payload)

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toMatchObject({
      success: true,
      data: {
        id: testCat.id,
        name: 'Makanan Hangat',
        sortOrder: 1,
      },
    })
  })
})

describe('deleteProductCategoryAction seam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

    const result = await deleteProductCategoryAction(mockTenantId, crypto.randomUUID())

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects deletion when category or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await deleteProductCategoryAction(mockTenantId, crypto.randomUUID())

    expect(result).toEqual({
      error: 'Category or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deletes category, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const [cat] = await db
      .insert(categories)
      .values({
        name: 'Makanan Hapus',
        slug: `makanan-hapus-${Date.now()}`,
        sortOrder: 0,
        tenantId: mockTenantId,
      })
      .returning()

    const result = await deleteProductCategoryAction(mockTenantId, cat.id)

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: { success: true },
      success: true,
    })

    const rows = await db.select().from(categories).where(eq(categories.id, cat.id))
    expect(rows).toHaveLength(0)
  })
})

describe('createProductAction seam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

    const result = await createProductAction(mockTenantId, {
      name: 'Test Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ userId: '' }))

    const result = await createProductAction(mockTenantId, {
      name: 'Test Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

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
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects creation when tenant is not found or forbidden', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await createProductAction(crypto.randomUUID(), {
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const payload = {
      name: 'Nasi Goreng Spesial',
      basePrice: 30000,
      categoryId: seededCategoryId,
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

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toMatchObject({
      success: true,
      data: {
        name: 'Nasi Goreng Spesial',
        basePrice: 30000,
        variants: [
          expect.objectContaining({
            name: 'Pedas',
            options: [expect.objectContaining({ label: 'Sedang', priceModifier: 0 })],
          }),
        ],
      },
    })
  })
})

describe('deleteProductAction seam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

    const result = await deleteProductAction(mockTenantId, crypto.randomUUID())

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ userId: '' }))

    const result = await deleteProductAction(mockTenantId, crypto.randomUUID())

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects deletion when product or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await deleteProductAction(mockTenantId, crypto.randomUUID())

    expect(result).toEqual({
      error: 'Product or tenant not found',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deletes product, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const [prod] = await db
      .insert(products)
      .values({
        name: 'Prod To Delete',
        basePrice: 20000,
        tenantId: mockTenantId,
      })
      .returning()

    const result = await deleteProductAction(mockTenantId, prod.id)

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toEqual({
      data: { success: true },
      success: true,
    })

    const rows = await db.select().from(products).where(eq(products.id, prod.id))
    expect(rows).toHaveLength(0)
  })
})

describe('updateProductAction seam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

    const result = await updateProductAction(mockTenantId, crypto.randomUUID(), {
      name: 'Updated Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ userId: '' }))

    const result = await updateProductAction(mockTenantId, crypto.randomUUID(), {
      name: 'Updated Product',
      basePrice: 50000,
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await updateProductAction(mockTenantId, crypto.randomUUID(), {
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
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid variant option labels and non-integer price modifiers', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await updateProductAction(mockTenantId, crypto.randomUUID(), {
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
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects modification when product or tenant is not found', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const result = await updateProductAction(mockTenantId, crypto.randomUUID(), {
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
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
      createMerchantSession({ userId: mockUserId }),
    )

    const [prod] = await db
      .insert(products)
      .values({
        name: 'Nasi Goreng Lama',
        basePrice: 25000,
        categoryId: seededCategoryId,
        tenantId: mockTenantId,
      })
      .returning()

    const payload = {
      name: 'Nasi Goreng Spesial Pedas',
      basePrice: 32000,
      categoryId: seededCategoryId,
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

    const result = await updateProductAction(mockTenantId, prod.id, payload)

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
    expect(result).toMatchObject({
      success: true,
      data: {
        id: prod.id,
        name: 'Nasi Goreng Spesial Pedas',
        basePrice: 32000,
        variants: [
          expect.objectContaining({
            name: 'Level Pedas',
            options: [expect.objectContaining({ label: 'Level 5', priceModifier: 3000 })],
          }),
        ],
      },
    })

    const [updated] = await db.select().from(products).where(eq(products.id, prod.id))
    expect(updated.name).toBe('Nasi Goreng Spesial Pedas')
    expect(updated.basePrice).toBe(32000)
  })
})
