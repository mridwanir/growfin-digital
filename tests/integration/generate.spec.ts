import type { GeneratedWebsiteData } from '@/lib/generator/schema'

import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { POST as generateHandler } from '@/app/api/generate/route'
import { db } from '@/db'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { tenants } from '@/db/schema/tenants'
import * as geminiModule from '@/lib/generator/gemini'
import { generatedWebsiteSchema } from '@/lib/generator/schema'

const mockGeminiOutput: GeneratedWebsiteData = generatedWebsiteSchema.parse({
  business: {
    name: 'Kopi Senja Utama',
    address: 'Jl. Senopati No. 42, Kebayoran Baru',
    category: 'Cafe & Coffee Shop',
    city: 'Jakarta Selatan',
    googleMapsUrl: 'https://maps.google.com/?cid=123456789',
    phone: '6281234567890',
    tagline: 'Secangkir Kopi Terbaik di Jakarta',
    brandingContent: {
      heroSubtitle: 'Diseduh dengan biji kopi pilihan nusantara',
      heroTitle: 'Nikmati Kopi Senja Autentik',
      tagline: 'Secangkir Kopi Terbaik di Jakarta',
    },
    operatingHours: {
      closeTime: '22:00',
      openTime: '08:00',
      raw: 'Senin - Minggu: 08:00 - 22:00',
    },
    themeConfig: {
      fbType: 'DINE_IN',
      layoutId: 'fnb-theme-classic',
      themeColor: '#78350f',
    },
  },
  categories: [
    { name: 'Signature Coffee', sortOrder: 0 },
    { name: 'Non-Coffee', sortOrder: 1 },
  ],
  products: [
    {
      name: 'Es Kopi Susu Senja',
      basePrice: 22000,
      categoryName: 'Signature Coffee',
      description: 'Espresso dengan susu segar dan gula aren asli',
      originalPrice: 25000,
      sortOrder: 0,
      variants: [
        {
          name: 'Ukuran',
          required: false,
          options: [
            { label: 'Regular', priceModifier: 0, sortOrder: 0 },
            { label: 'Large', priceModifier: 5000, sortOrder: 1 },
          ],
        },
      ],
    },
    {
      name: 'Matcha Latte',
      basePrice: 28000,
      categoryName: 'Non-Coffee',
      description: 'Matcha murni dari Uji dengan fresh milk',
      originalPrice: null,
      sortOrder: 1,
      variants: [],
    },
  ],
})

describe('Transactional AI Website Generator Pipeline (/api/generate)', () => {
  const createdTenantIds: string[] = []

  afterEach(async () => {
    vi.restoreAllMocks()
    for (const id of createdTenantIds) {
      await db.delete(tenants).where(eq(tenants.id, id))
    }
    createdTenantIds.length = 0
  })

  it('generates a complete website and persists complete relational rows in an atomic transaction', async () => {
    vi.spyOn(geminiModule, 'generateWithGemini').mockResolvedValueOnce(mockGeminiOutput)

    const request = new NextRequest('http://localhost:3000/api/generate', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: 'Kopi Senja Utama',
        mapsUrl: 'https://maps.google.com/?cid=123456789',
      }),
    })

    const response = await generateHandler(request)
    expect(response.status).toBe(200)

    const result = await response.json()
    expect(result.success).toBe(true)
    expect(result.slug).toMatch(/^kopi-senja-utama-/)
    expect(result.previewUrl).toContain(result.slug)

    // Assert Tenant record created with status 'draft' and packageTier 'free'
    const [persistedTenant] = await db.select().from(tenants).where(eq(tenants.slug, result.slug))
    expect(persistedTenant).toBeDefined()
    expect(persistedTenant.name).toBe('Kopi Senja Utama')
    expect(persistedTenant.category).toBe('Cafe & Coffee Shop')
    expect(persistedTenant.status).toBe('draft')
    expect(persistedTenant.packageTier).toBe('free')
    expect(persistedTenant.googleMapsUrl).toBe('https://maps.google.com/?cid=123456789')
    expect(persistedTenant.fomoExpiresAt).toBeDefined()

    createdTenantIds.push(persistedTenant.id)

    // Assert Categories batch inserted with matching tenantId
    const persistedCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.tenantId, persistedTenant.id))
    expect(persistedCategories).toHaveLength(2)
    const categoryNames = persistedCategories.map(c => c.name)
    expect(categoryNames).toContain('Signature Coffee')
    expect(categoryNames).toContain('Non-Coffee')

    const sigCategory = persistedCategories.find(c => c.name === 'Signature Coffee')!
    const nonCoffeeCategory = persistedCategories.find(c => c.name === 'Non-Coffee')!

    // Assert Products batch inserted with matching foreign keys
    const persistedProducts = await db
      .select()
      .from(products)
      .where(eq(products.tenantId, persistedTenant.id))
    expect(persistedProducts).toHaveLength(2)

    const coffeeProduct = persistedProducts.find(p => p.name === 'Es Kopi Susu Senja')!
    expect(coffeeProduct.basePrice).toBe(22000)
    expect(coffeeProduct.originalPrice).toBe(25000)
    expect(coffeeProduct.categoryId).toBe(sigCategory.id)

    const matchaProduct = persistedProducts.find(p => p.name === 'Matcha Latte')!
    expect(matchaProduct.basePrice).toBe(28000)
    expect(matchaProduct.categoryId).toBe(nonCoffeeCategory.id)

    // Assert Product Variants inserted with matching productId
    const persistedVariants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, coffeeProduct.id))
    expect(persistedVariants).toHaveLength(1)
    expect(persistedVariants[0].name).toBe('Ukuran')

    // Assert Variant Options inserted with matching variantId
    const persistedOptions = await db
      .select()
      .from(variantOptions)
      .where(eq(variantOptions.variantId, persistedVariants[0].id))
    expect(persistedOptions).toHaveLength(2)
    const regularOpt = persistedOptions.find(o => o.label === 'Regular')!
    expect(regularOpt.priceModifier).toBe(0)
    const largeOpt = persistedOptions.find(o => o.label === 'Large')!
    expect(largeOpt.priceModifier).toBe(5000)
  })

  it('rejects invalid or missing business name with 400 Bad Request', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: '',
        mapsUrl: 'https://maps.google.com/?cid=123',
      }),
    })

    const response = await generateHandler(request)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBeDefined()

    // Verify nothing persisted
    const matchingTenants = await db
      .select()
      .from(tenants)
      .where(eq(tenants.googleMapsUrl, 'https://maps.google.com/?cid=123'))
    expect(matchingTenants).toHaveLength(0)
  })

  it('rolls back database transaction and creates zero orphaned records when persistence fails mid-transaction', async () => {
    vi.spyOn(geminiModule, 'generateWithGemini').mockResolvedValueOnce(mockGeminiOutput)

    // Simulate database failure during transaction execution by inserting duplicate or throwing
    vi.spyOn(db, 'transaction').mockImplementationOnce(async () => {
      throw new Error('Database connection terminated unexpectedly')
    })

    const request = new NextRequest('http://localhost:3000/api/generate', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: 'Kopi Rollback Test',
        mapsUrl: 'https://maps.google.com/?cid=rollback-1',
      }),
    })

    const response = await generateHandler(request)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data.error).toContain('Failed to generate website')

    // Verify zero orphaned tenants
    const orphaned = await db.select().from(tenants).where(eq(tenants.name, 'Kopi Rollback Test'))
    expect(orphaned).toHaveLength(0)
  })

  it('returns 500 when Gemini generation fails', async () => {
    vi.spyOn(geminiModule, 'generateWithGemini').mockRejectedValueOnce(
      new Error('Google Gemini API quota exceeded'),
    )

    const request = new NextRequest('http://localhost:3000/api/generate', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: 'Kopi Quota Test',
      }),
    })

    const response = await generateHandler(request)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data.error).toContain('Google Gemini API quota exceeded')
  })

  it('verifies actual Postgres transaction rollback in persistGeneratedWebsite when products insert fails', async () => {
    const rollbackData = generatedWebsiteSchema.parse({
      ...mockGeminiOutput,
      business: {
        ...mockGeminiOutput.business,
        name: 'Atomic Rollback Verification Store',
      },
    })

    const { persistGeneratedWebsite } = await import('@/lib/generator/persistence')

    // Intercept tx inside db.transaction to make the products insert fail after tenant was inserted
    const realTransaction = db.transaction.bind(db)
    vi.spyOn(db, 'transaction').mockImplementationOnce(async callback => {
      return realTransaction(async tx => {
        const realInsert = tx.insert.bind(tx)
        let tenantInserted = false

        vi.spyOn(tx, 'insert').mockImplementation((table: any) => {
          if (table === products && tenantInserted) {
            throw new Error('Database disk full or constraint failure during products insert')
          }
          const builder = realInsert(table)
          if (table === tenants) {
            tenantInserted = true
          }
          return builder
        })

        return callback(tx)
      })
    })

    await expect(persistGeneratedWebsite(rollbackData, db)).rejects.toThrow(
      'Database disk full or constraint failure during products insert',
    )

    // Assert the tenant record was rolled back from Postgres and does NOT exist
    const persisted = await db
      .select()
      .from(tenants)
      .where(eq(tenants.name, 'Atomic Rollback Verification Store'))
    expect(persisted).toHaveLength(0)
  })
})
