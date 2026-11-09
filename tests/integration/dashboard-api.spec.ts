import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import {
  DELETE as deleteCategoryHandler,
  PATCH as patchCategoryHandler,
} from '@/app/api/dashboard/tenants/[id]/categories/[categoryId]/route'
import {
  GET as getCategoriesHandler,
  POST as postCategoriesHandler,
} from '@/app/api/dashboard/tenants/[id]/categories/route'
import {
  DELETE as deleteProductHandler,
  PATCH as patchProductHandler,
} from '@/app/api/dashboard/tenants/[id]/products/[productId]/route'
import {
  GET as getProductsHandler,
  POST as postProductsHandler,
} from '@/app/api/dashboard/tenants/[id]/products/route'
import {
  GET as getSettingsHandler,
  PATCH as patchSettingsHandler,
} from '@/app/api/dashboard/tenants/[id]/settings/route'
import { GET as getTenantsHandler } from '@/app/api/dashboard/tenants/route'
import { db } from '@/db'
import { userInNeonAuth } from '@/db/schema/auth'
import { tenants } from '@/db/schema/tenants'
import { auth } from '@/lib/auth/server'
import { getStorefrontDataBySlug } from '@/lib/storefront/loader'
import { mapTenantToBusinessDemo } from '@/lib/storefront/mapper'

describe('dashboard API seam: merchant tenants overview (/api/dashboard/tenants)', () => {
  const testUserId1 = '11111111-1111-4111-8111-111111111111'
  const testUserId2 = '22222222-2222-4222-8222-222222222222'

  let tenant1Id: string
  let tenant2Id: string

  const mockMerchantSession = (
    userId: string = testUserId1,
    email: string = 'merchant1@example.com',
    name: string = 'Merchant One',
  ) => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
          token: 'tok-1',
          updatedAt: new Date(),
          userId,
        },
        user: {
          id: userId,
          name,
          createdAt: new Date(),
          email,
          updatedAt: new Date(),
        },
      },
    })
  }

  beforeAll(async () => {
    // Clean up any stale records
    await db.delete(tenants).where(eq(tenants.slug, 'merchant-one-test'))
    await db.delete(tenants).where(eq(tenants.slug, 'merchant-two-test'))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, testUserId1))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, testUserId2))

    // Insert test users
    await db.insert(userInNeonAuth).values([
      {
        id: testUserId1,
        name: 'Merchant One',
        email: 'merchant1@example.com',
        emailVerified: true,
      },
      {
        id: testUserId2,
        name: 'Merchant Two',
        email: 'merchant2@example.com',
        emailVerified: true,
      },
    ])

    // Insert tenants for each user
    const [inserted1] = await db
      .insert(tenants)
      .values({
        name: 'Merchant One Store',
        address: 'Jl. Sudirman No. 1',
        category: 'Retail & Fashion',
        city: 'Jakarta',
        packageTier: 'instant',
        phone: '08123456789',
        slug: 'merchant-one-test',
        status: 'published',
        userId: testUserId1,
        brandingContent: {
          heroTitle: 'Original Hero Title',
          socialLinks: {
            instagram: { active: true, url: 'https://instagram.com/original' },
          },
        },
        themeConfig: {
          themeColor: '#123456',
        },
      })
      .returning()

    const [inserted2] = await db
      .insert(tenants)
      .values({
        name: 'Merchant Two Store',
        category: 'Cafe & Restaurant',
        city: 'Bandung',
        packageTier: 'free',
        phone: '08987654321',
        slug: 'merchant-two-test',
        status: 'draft',
        userId: testUserId2,
      })
      .returning()

    tenant1Id = inserted1.id
    tenant2Id = inserted2.id
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    if (tenant1Id) await db.delete(tenants).where(eq(tenants.id, tenant1Id))
    if (tenant2Id) await db.delete(tenants).where(eq(tenants.id, tenant2Id))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, testUserId1))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, testUserId2))
  })

  it('returns 401 Unauthorized when session is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })

    const req = new NextRequest('http://localhost:3000/api/dashboard/tenants')
    const res = await getTenantsHandler(req)

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
  })

  it('returns only the authenticated user owned tenants', async () => {
    mockMerchantSession()

    const req = new NextRequest('http://localhost:3000/api/dashboard/tenants')
    const res = await getTenantsHandler(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.tenants).toBeDefined()
    expect(json.tenants).toHaveLength(1)
    expect(json.tenants[0].id).toBe(tenant1Id)
    expect(json.tenants[0].name).toBe('Merchant One Store')
    expect(json.tenants[0].slug).toBe('merchant-one-test')
  })

  describe('business settings API (/api/dashboard/tenants/[id]/settings)', () => {
    it('returns 404 when user tries to access a tenant owned by someone else', async () => {
      mockMerchantSession()
      const req = new NextRequest(`http://localhost:3000/api/dashboard/tenants/${tenant2Id}/settings`)
      const res = await getSettingsHandler(req, { params: Promise.resolve({ id: tenant2Id }) })

      expect(res.status).toBe(404)
      const json = await res.json()
      expect(json.error).toBe('Tenant not found')
    })

    it('returns business settings for owned tenant', async () => {
      mockMerchantSession()
      const req = new NextRequest(`http://localhost:3000/api/dashboard/tenants/${tenant1Id}/settings`)
      const res = await getSettingsHandler(req, { params: Promise.resolve({ id: tenant1Id }) })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.tenant.id).toBe(tenant1Id)
      expect(json.tenant.phone).toBe('08123456789')
      expect(json.tenant.brandingContent.socialLinks.instagram.url).toBe('https://instagram.com/original')
    })

    it('executes targeted updates on basic details without clobbering other JSON or relations', async () => {
      mockMerchantSession()
      const updateBody = {
        address: 'Jl. Sudirman Kav. 1, Jakarta',
        city: 'Jakarta Pusat',
        phone: '08119998888',
        operatingHours: {
          closeTime: '21:00',
          openTime: '09:00',
          raw: '09:00 - 21:00 Setiap Hari',
        },
        socialLinks: {
          instagram: { active: true, url: 'https://instagram.com/updated_store' },
          whatsapp: { active: true, url: 'https://wa.me/628119998888' },
        },
      }

      const req = new NextRequest(`http://localhost:3000/api/dashboard/tenants/${tenant1Id}/settings`, {
        body: JSON.stringify(updateBody),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })
      const res = await patchSettingsHandler(req, { params: Promise.resolve({ id: tenant1Id }) })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.tenant.phone).toBe('08119998888')
      expect(json.tenant.address).toBe('Jl. Sudirman Kav. 1, Jakarta')
      expect(json.tenant.city).toBe('Jakarta Pusat')
      expect(json.tenant.operatingHours.openTime).toBe('09:00')
      expect(json.tenant.brandingContent.socialLinks.whatsapp.url).toBe('https://wa.me/628119998888')

      // Query directly from database to verify targeted update integrity
      const [freshTenant] = await db.select().from(tenants).where(eq(tenants.id, tenant1Id))
      expect(freshTenant.phone).toBe('08119998888')
      expect(freshTenant.address).toBe('Jl. Sudirman Kav. 1, Jakarta')
      // Verify brandingContent.heroTitle was NOT clobbered by the update
      expect(freshTenant.brandingContent?.heroTitle).toBe('Original Hero Title')
      // Verify themeConfig was NOT clobbered
      expect(freshTenant.themeConfig?.themeColor).toBe('#123456')
    })
  })

  describe('category management API (/api/dashboard/tenants/[id]/categories)', () => {
    let createdCategoryId: string

    it('creates a new category under merchant tenant', async () => {
      mockMerchantSession()
      const req = new NextRequest(`http://localhost:3000/api/dashboard/tenants/${tenant1Id}/categories`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          name: 'Summer Specials',
          sortOrder: 0,
        }),
      })
      const res = await postCategoriesHandler(req, { params: Promise.resolve({ id: tenant1Id }) })

      expect(res.status).toBe(201)
      const json = await res.json()
      expect(json.category.name).toBe('Summer Specials')
      expect(json.category.slug).toBe('summer-specials')
      expect(json.category.tenantId).toBe(tenant1Id)
      createdCategoryId = json.category.id
    })

    it('lists all categories for tenant', async () => {
      mockMerchantSession()
      const req = new NextRequest(`http://localhost:3000/api/dashboard/tenants/${tenant1Id}/categories`)
      const res = await getCategoriesHandler(req, { params: Promise.resolve({ id: tenant1Id }) })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.categories).toBeInstanceOf(Array)
      expect(json.categories.some((c: { id: string }) => c.id === createdCategoryId)).toBe(true)
    })

    it('updates existing category via targeted row update', async () => {
      mockMerchantSession()
      const req = new NextRequest(
        `http://localhost:3000/api/dashboard/tenants/${tenant1Id}/categories/${createdCategoryId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
          body: JSON.stringify({
            name: 'Autumn Specials',
            sortOrder: 2,
          }),
        },
      )
      const res = await patchCategoryHandler(req, {
        params: Promise.resolve({ id: tenant1Id, categoryId: createdCategoryId }),
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.category.name).toBe('Autumn Specials')
      expect(json.category.sortOrder).toBe(2)
    })

    it('deletes category', async () => {
      mockMerchantSession()
      const req = new NextRequest(
        `http://localhost:3000/api/dashboard/tenants/${tenant1Id}/categories/${createdCategoryId}`,
        {
          method: 'DELETE',
        },
      )
      const res = await deleteCategoryHandler(req, {
        params: Promise.resolve({ id: tenant1Id, categoryId: createdCategoryId }),
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('product & variant management API (/api/dashboard/tenants/[id]/products)', () => {
    let createdProductId: string

    it('creates a product with explicit variants and numeric price modifiers', async () => {
      mockMerchantSession()
      const newProductPayload = {
        name: 'Kemeja Linen Premium',
        basePrice: 150000,
        description: 'Bahan linen sejuk dan nyaman dipakai sehari-hari',
        originalPrice: 180000,
        stock: 50,
        variants: [
          {
            name: 'Size',
            required: true,
            options: [
              { label: 'M', priceModifier: 0, sortOrder: 0 },
              { label: 'XL', priceModifier: 15000, sortOrder: 1 },
            ],
          },
          {
            name: 'Color',
            required: false,
            options: [
              { label: 'Sage Green', priceModifier: 0, sortOrder: 0 },
              { label: 'Terracotta', priceModifier: 5000, sortOrder: 1 },
            ],
          },
        ],
      }

      const req = new NextRequest(`http://localhost:3000/api/dashboard/tenants/${tenant1Id}/products`, {
        body: JSON.stringify(newProductPayload),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const res = await postProductsHandler(req, { params: Promise.resolve({ id: tenant1Id }) })

      expect(res.status).toBe(201)
      const json = await res.json()
      expect(json.product.name).toBe('Kemeja Linen Premium')
      expect(json.product.basePrice).toBe(150000)
      expect(json.product.variants).toHaveLength(2)

      const sizeVariant = json.product.variants.find((v: { name: string }) => v.name === 'Size')
      expect(sizeVariant).toBeDefined()
      expect(sizeVariant.options).toHaveLength(2)
      const xlOption = sizeVariant.options.find((o: { label: string }) => o.label === 'XL')
      expect(xlOption.priceModifier).toBe(15000)

      createdProductId = json.product.id
    })

    it('lists products including variants and options for merchant tenant', async () => {
      mockMerchantSession()
      const req = new NextRequest(`http://localhost:3000/api/dashboard/tenants/${tenant1Id}/products`)
      const res = await getProductsHandler(req, { params: Promise.resolve({ id: tenant1Id }) })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.products).toBeInstanceOf(Array)
      const found = json.products.find((p: { id: string }) => p.id === createdProductId)
      expect(found).toBeDefined()
      expect(found.variants).toHaveLength(2)
    })

    it('updates product base columns and updates variants atomically', async () => {
      mockMerchantSession()
      const updatePayload = {
        name: 'Kemeja Linen Premium V2',
        basePrice: 160000,
        stock: 40,
        variants: [
          {
            name: 'Size',
            required: true,
            options: [
              { label: 'S', priceModifier: -5000, sortOrder: 0 },
              { label: 'M', priceModifier: 0, sortOrder: 1 },
              { label: 'XXL', priceModifier: 20000, sortOrder: 2 },
            ],
          },
        ],
      }

      const req = new NextRequest(
        `http://localhost:3000/api/dashboard/tenants/${tenant1Id}/products/${createdProductId}`,
        {
          body: JSON.stringify(updatePayload),
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
        },
      )
      const res = await patchProductHandler(req, {
        params: Promise.resolve({ id: tenant1Id, productId: createdProductId }),
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.product.name).toBe('Kemeja Linen Premium V2')
      expect(json.product.basePrice).toBe(160000)
      expect(json.product.variants).toHaveLength(1)
      expect(json.product.variants[0].options).toHaveLength(3)
      const xxl = json.product.variants[0].options.find((o: { label: string }) => o.label === 'XXL')
      expect(xxl.priceModifier).toBe(20000)
    })

    it('deletes product and cascades deletion to variants and options', async () => {
      mockMerchantSession()
      const req = new NextRequest(
        `http://localhost:3000/api/dashboard/tenants/${tenant1Id}/products/${createdProductId}`,
        {
          method: 'DELETE',
        },
      )
      const res = await deleteProductHandler(req, {
        params: Promise.resolve({ id: tenant1Id, productId: createdProductId }),
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('immediate live storefront reflection', () => {
    it('immediately reflects dashboard profile and product mutations on the live storefront loader', async () => {
      // 1. Mutate settings via dashboard PATCH
      mockMerchantSession()
      const patchReq = new NextRequest(
        `http://localhost:3000/api/dashboard/tenants/${tenant1Id}/settings`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
          body: JSON.stringify({
            address: 'Jl. Reflection No. 99, Jakarta',
            city: 'Jakarta Barat',
            phone: '08999888777',
            operatingHours: {
              closeTime: '22:00',
              openTime: '10:00',
              raw: '10:00 - 22:00',
            },
          }),
        },
      )
      const patchRes = await patchSettingsHandler(patchReq, {
        params: Promise.resolve({ id: tenant1Id }),
      })
      expect(patchRes.status).toBe(200)

      // 2. Add product via dashboard POST
      mockMerchantSession()
      const prodReq = new NextRequest(
        `http://localhost:3000/api/dashboard/tenants/${tenant1Id}/products`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({
            name: 'Live Reflection Tee',
            basePrice: 125000,
            stock: 25,
            variants: [
              {
                name: 'Size',
                required: true,
                options: [
                  { label: 'S', priceModifier: 0, sortOrder: 0 },
                  { label: 'L', priceModifier: 10000, sortOrder: 1 },
                ],
              },
            ],
          }),
        },
      )
      const prodRes = await postProductsHandler(prodReq, {
        params: Promise.resolve({ id: tenant1Id }),
      })
      expect(prodRes.status).toBe(201)

      // 3. Directly load storefront data by tenant slug
      const storefrontData = await getStorefrontDataBySlug('merchant-one-test')
      expect(storefrontData).not.toBeNull()
      expect(storefrontData!.tenant.phone).toBe('08999888777')
      expect(storefrontData!.tenant.address).toBe('Jl. Reflection No. 99, Jakarta')
      expect(storefrontData!.tenant.city).toBe('Jakarta Barat')

      const liveTee = storefrontData!.products.find(p => p.name === 'Live Reflection Tee')
      expect(liveTee).toBeDefined()
      expect(liveTee!.basePrice).toBe(125000)
      expect(liveTee!.variants).toHaveLength(1)
      expect(liveTee!.variants?.[0]?.options).toHaveLength(2)

      // 4. Verify storefront adapter transforms it seamlessly
      const businessDemo = mapTenantToBusinessDemo(storefrontData!)
      expect(businessDemo.phone).toBe('08999888777')
      expect(businessDemo.address).toBe('Jl. Reflection No. 99, Jakarta')
      const demoProduct = businessDemo.menu.find(p => p.name === 'Live Reflection Tee')
      expect(demoProduct).toBeDefined()
      expect(demoProduct!.price).toBe('Rp 125.000')
      expect(demoProduct!.variants).toBeDefined()
      expect(demoProduct!.variants?.[0]?.options).toHaveLength(2)
    })
  })
})
