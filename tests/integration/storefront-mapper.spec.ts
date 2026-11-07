import type {
  RelationalStorefrontInput,
  RelationalStorefrontProductInput,
  RelationalVariantOptionInput,
  StorefrontArchetype,
} from '@/lib/storefront/mapper'
import type { MenuItemAddon, PackageTier, SpecificationItem } from '@/lib/types'

import { describe, expect, it } from 'vitest'

import {
  formatCurrency,
  mapTenantToBusinessDemo,
  mapVariantOptionsToLegacy,
  normalizeWaNumber,
  parseCurrency,
  resolveArchetype,
} from '@/lib/storefront/mapper'

describe('Storefront Data Adapter - Currency Transformation (Seam 2)', () => {
  describe('formatCurrency', () => {
    it('formats integer prices to Indonesian Rupiah display strings', () => {
      expect(formatCurrency(25000)).toBe('Rp 25.000')
      expect(formatCurrency(1500000)).toBe('Rp 1.500.000')
      expect(formatCurrency(0)).toBe('Rp 0')
    })

    it('handles negative price modifiers cleanly', () => {
      expect(formatCurrency(-5000)).toBe('-Rp 5.000')
    })
  })

  describe('parseCurrency', () => {
    it('parses formatted Indonesian Rupiah strings into integer prices', () => {
      expect(parseCurrency('Rp 25.000')).toBe(25000)
      expect(parseCurrency('Rp 1.500.000')).toBe(1500000)
      expect(parseCurrency('25.000')).toBe(25000)
    })

    it('returns numeric numbers as-is', () => {
      expect(parseCurrency(45000)).toBe(45000)
    })

    it('parses negative currency strings into negative integers', () => {
      expect(parseCurrency('-Rp 5.000')).toBe(-5000)
      expect(parseCurrency('Rp -5.000')).toBe(-5000)
      expect(parseCurrency('(-Rp 5.000)')).toBe(-5000)
      expect(parseCurrency('-5.000')).toBe(-5000)
    })

    it('returns 0 for empty or invalid currency strings', () => {
      expect(parseCurrency('')).toBe(0)
      expect(parseCurrency(null)).toBe(0)
      expect(parseCurrency(undefined)).toBe(0)
      expect(parseCurrency('abc')).toBe(0)
    })
  })
})

describe('Storefront Data Adapter - WhatsApp Number Normalization', () => {
  it('converts Indonesian local 08 prefix to international 628 prefix', () => {
    expect(normalizeWaNumber('081234567890')).toBe('6281234567890')
    expect(normalizeWaNumber('0857-1234-5678')).toBe('6285712345678')
  })

  it('preserves existing 62 prefix and cleans non-digit characters', () => {
    expect(normalizeWaNumber('+62 812-3456-7890')).toBe('6281234567890')
    expect(normalizeWaNumber('6281234567890')).toBe('6281234567890')
  })

  it('returns empty string for missing or invalid inputs', () => {
    expect(normalizeWaNumber('')).toBe('')
    expect(normalizeWaNumber(null)).toBe('')
    expect(normalizeWaNumber(undefined)).toBe('')
  })
})

describe('Storefront Data Adapter - Archetype Resolution', () => {
  it('resolves categories to their respective archetypes', () => {
    const fnbType: StorefrontArchetype = resolveArchetype('Cafe & Coffee Roastery')
    const retailType: StorefrontArchetype = resolveArchetype('Toko Pakaian Pria')
    const groomingType: StorefrontArchetype = resolveArchetype('Barbershop & Spa')
    const serviceType: StorefrontArchetype = resolveArchetype('Bengkel Mobil & Servis AC')
    const fallbackType: StorefrontArchetype = resolveArchetype(null)

    expect(fnbType).toBe('fnb')
    expect(retailType).toBe('retail')
    expect(groomingType).toBe('grooming')
    expect(serviceType).toBe('service')
    expect(fallbackType).toBe('retail')
  })

  it('validates type contracts for addons, specifications, and tiers', () => {
    const addon: MenuItemAddon = { name: 'Extra Cheese', price: 5000 }
    const spec: SpecificationItem = { label: 'Bahan', value: 'Katun Kombed 24s' }
    const tier: PackageTier = 'pro'

    expect(addon.name).toBe('Extra Cheese')
    expect(spec.label).toBe('Bahan')
    expect(tier).toBe('pro')
  })
})

describe('Storefront Data Adapter - Relational Variant Adapter (Seam 3)', () => {
  it('maps relational variant and options with price modifiers into legacy MenuItemVariant format', () => {
    const relationalVariants = [
      {
        id: 'var-1',
        name: 'Size',
        productId: 'prod-1',
        required: true,
        options: [
          {
            id: 'opt-1',
            label: 'Regular',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-1',
          } satisfies RelationalVariantOptionInput,
          {
            id: 'opt-2',
            label: 'Large',
            priceModifier: 5000,
            sortOrder: 1,
            variantId: 'var-1',
          },
        ],
      },
      {
        id: 'var-2',
        name: 'Sugar Level',
        productId: 'prod-1',
        required: false,
        options: [
          {
            id: 'opt-3',
            label: 'Normal Sugar',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-2',
          },
          {
            id: 'opt-4',
            label: 'Less Sugar',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-2',
          },
        ],
      },
    ]

    const mapped = mapVariantOptionsToLegacy(relationalVariants)

    expect(mapped).toEqual([
      {
        name: 'Size',
        options: [
          { label: 'Regular', priceModifier: 0 },
          { label: 'Large', priceModifier: 5000 },
        ],
      },
      {
        name: 'Sugar Level',
        options: [
          { label: 'Normal Sugar', priceModifier: 0 },
          { label: 'Less Sugar', priceModifier: 0 },
        ],
      },
    ])
  })

  it('sorts variant options by sortOrder ascending', () => {
    const unsorted = [
      {
        id: 'var-1',
        name: 'Size',
        productId: 'prod-1',
        required: true,
        options: [
          {
            id: 'opt-2',
            label: 'Large',
            priceModifier: 5000,
            sortOrder: 2,
            variantId: 'var-1',
          },
          {
            id: 'opt-1',
            label: 'Small',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-1',
          },
        ],
      },
    ]

    const mapped = mapVariantOptionsToLegacy(unsorted)
    expect(mapped[0]?.options).toEqual([
      { label: 'Small', priceModifier: 0 },
      { label: 'Large', priceModifier: 5000 },
    ])
  })

  it('safely handles empty or missing variants and options', () => {
    expect(mapVariantOptionsToLegacy(undefined)).toEqual([])
    expect(mapVariantOptionsToLegacy([])).toEqual([])
    expect(
      mapVariantOptionsToLegacy([
        {
          id: 'var-empty',
          name: 'Empty Option Group',
          options: [],
          productId: 'prod-1',
          required: false,
        },
      ]),
    ).toEqual([
      {
        name: 'Empty Option Group',
        options: [],
      },
    ])
  })
})

describe('Storefront Data Adapter - Contract Mapper (Seam 1)', () => {
  const archetypes = [
    {
      name: 'Kopi Senja Senopati',
      archetype: 'F&B',
      category: 'Cafe & Coffee Shop',
      productName: 'Es Kopi Susu Aren',
      productPrice: 24000,
    },
    {
      name: 'Urban Streetwear Jakarta',
      archetype: 'Retail',
      category: 'Toko Pakaian & Fashion',
      productName: 'Oversized Heavyweight Tee',
      productPrice: 175000,
    },
    {
      name: 'Gentlemen Barber Lounge',
      archetype: 'Grooming',
      category: 'Barbershop & Grooming Studio',
      productName: 'Signature Haircut & Hot Towel',
      productPrice: 85000,
    },
    {
      name: 'AutoPro Service Center',
      archetype: 'Service',
      category: 'Bengkel Mobil & Servis AC',
      productName: 'Tune Up & Ganti Oli Mesin',
      productPrice: 350000,
    },
  ] as const

  for (const { archetype, category, name, productName, productPrice } of archetypes) {
    it(`maps relational data into canonical BusinessDemo for ${archetype} archetype without missing keys`, () => {
      const tenantId = `tenant-${archetype.toLowerCase()}`
      const categoryId = `cat-${archetype.toLowerCase()}`
      const productId = `prod-${archetype.toLowerCase()}`

      const tenant = {
        id: tenantId,
        name,
        address: 'Jl. Senopati Raya No. 10',
        category,
        city: 'Jakarta Selatan',
        createdAt: new Date(),
        customDomain: null,
        domainActiveUntil: null,
        fomoExpiresAt: null,
        googleMapsUrl: 'https://maps.google.com/?cid=12345',
        organizationId: null,
        packageTier: 'pro' as const,
        phone: '+6281234567890',
        siteActiveUntil: null,
        slug: `slug-${archetype.toLowerCase()}`,
        status: 'published' as const,
        updatedAt: new Date(),
        userId: null,
        brandingContent: {
          heroSubtitle: `Solusi terbaik untuk kebutuhan ${archetype}`,
          heroTitle: `Selamat Datang di ${name}`,
          iconEmoji: '✨',
          tagline: `Pilihan Utama di Jakarta`,
          marketing: {
            discountPercentage: 20,
            flashSaleEnd: '2026-12-31T23:59:59Z',
            promoLabel: 'Flash Promo',
            usps: [{ desc: '100% Bergaransi', title: 'Jaminan Kualitas' }],
          },
          socialLinks: {
            instagram: { active: true, url: 'https://instagram.com/demobusiness' },
            whatsapp: { active: true, url: 'https://wa.me/6281234567890' },
          },
        },
        operatingHours: {
          closeTime: '22:00',
          isOpen: true,
          openTime: '09:00',
          raw: 'Senin - Minggu: 09:00 - 22:00',
        },
        themeConfig: {
          fbType: 'DINE_IN' as const,
          heroSecondaryAction: 'whatsapp' as const,
          hiddenSections: [],
          sectionOrder: ['hero', 'katalog', 'testimoni'],
          themeColor: '#059669',
        },
      }

      const categories = [
        {
          id: categoryId,
          name: 'Main Catalog',
          slug: 'main-catalog',
          sortOrder: 0,
          tenantId,
        },
      ]

      const products: RelationalStorefrontProductInput[] = [
        {
          id: productId,
          name: productName,
          basePrice: productPrice,
          categoryId,
          createdAt: new Date(),
          description: `Deskripsi produk untuk ${productName}`,
          duration: 45,
          imageGallery: ['https://example.com/gallery1.jpg'],
          imageStorageKey: 'key1',
          imageUrl: 'https://example.com/thumb.jpg',
          isActive: true,
          originalPrice: productPrice + 15000,
          sortOrder: 0,
          specifications: [{ label: 'Garansi', value: '1 Tahun' }],
          stock: 50,
          tenantId,
          updatedAt: new Date(),
          variants: [
            {
              id: 'var-1',
              name: 'Opsi',
              productId,
              required: true,
              options: [
                {
                  id: 'opt-1',
                  label: 'Standar',
                  priceModifier: 0,
                  sortOrder: 0,
                  variantId: 'var-1',
                },
              ],
            },
          ],
        },
      ]

      const input: RelationalStorefrontInput = { categories, products, tenant }
      const demo = mapTenantToBusinessDemo(input)

      // Structural assertions
      expect(demo.name).toBe(name)
      expect(demo.category).toBe(category)
      expect(demo.city).toBe('Jakarta Selatan')
      expect(demo.address).toBe('Jl. Senopati Raya No. 10')
      expect(demo.phone).toBe('+6281234567890')
      expect(demo.waNumber).toBe('6281234567890')
      expect(demo.rating).toBeGreaterThanOrEqual(1)
      expect(demo.reviewCount).toBeGreaterThanOrEqual(1)
      expect(demo.hours).toBe('Senin - Minggu: 09:00 - 22:00')
      expect(demo.openTime).toBe('09:00')
      expect(demo.closeTime).toBe('22:00')
      expect(demo.isOpen).toBe(true)
      expect(demo.tagline).toBe('Pilihan Utama di Jakarta')
      expect(demo.iconEmoji).toBe('✨')
      expect(demo.categories).toEqual(['Main Catalog'])

      // Menu assertions
      expect(demo.menu).toHaveLength(1)
      expect(demo.menu[0]?.name).toBe(productName)
      expect(demo.menu[0]?.price).toBe(formatCurrency(productPrice))
      expect(demo.menu[0]?.originalPrice).toBe(productPrice + 15000)
      expect(demo.menu[0]?.variants).toEqual([
        {
          name: 'Opsi',
          options: [{ label: 'Standar', priceModifier: 0 }],
        },
      ])

      // Marketing & branding assertions
      expect(demo.marketing?.promoLabel).toBe('Flash Promo')
      expect(demo.marketing?.discountPercentage).toBe(20)
      expect(demo.socialMedia?.instagram?.url).toBe('https://instagram.com/demobusiness')
      expect(demo.socialMedia?.instagram?.active).toBe(true)

      // Safe fallbacks present
      expect(Array.isArray(demo.lookbook)).toBe(true)
      expect(Array.isArray(demo.reviews)).toBe(true)
      expect(demo.reviews?.length).toBeGreaterThanOrEqual(1)
      expect(Array.isArray(demo.practitioners)).toBe(true)
      expect(demo.practitioners?.length).toBeGreaterThanOrEqual(1)

      // Zero missing keys contract verification
      const requiredKeys = [
        'address',
        'categories',
        'category',
        'city',
        'closeTime',
        'faqs',
        'googleMapsUrl',
        'heroImage',
        'heroSecondaryAction',
        'hiddenSections',
        'hours',
        'iconEmoji',
        'isOpen',
        'logoUrl',
        'lookbook',
        'marketing',
        'menu',
        'name',
        'openTime',
        'package_tier',
        'phone',
        'practitioners',
        'rating',
        'reviewCount',
        'reviews',
        'sectionOrder',
        'socialMedia',
        'status',
        'tagline',
        'themeColor',
        'uiLabels',
        'waNumber',
      ] as const

      for (const key of requiredKeys) {
        expect(demo[key]).toBeDefined()
      }
    })
  }

  it('supplies safe fallbacks when optional JSONB fields are completely empty', () => {
    const barebonesTenant = {
      id: 'tenant-empty',
      name: 'Warung Kopi Sederhana',
      address: null,
      brandingContent: {},
      category: 'Cafe',
      city: null,
      createdAt: new Date(),
      customDomain: null,
      domainActiveUntil: null,
      fomoExpiresAt: null,
      googleMapsUrl: null,
      operatingHours: {},
      organizationId: null,
      packageTier: 'free' as const,
      phone: null,
      siteActiveUntil: null,
      slug: 'warung-kopi-sederhana',
      status: 'draft' as const,
      themeConfig: {},
      updatedAt: new Date(),
      userId: null,
    }

    const demo = mapTenantToBusinessDemo({
      categories: [],
      products: [],
      tenant: barebonesTenant,
    })

    // Assert fallback values
    expect(demo.rating).toBe(4.9)
    expect(demo.reviewCount).toBe(128)
    expect(demo.city).toBe('')
    expect(demo.address).toBe('')
    expect(demo.waNumber).toBe('')
    expect(demo.hours).toBe('08:00 - 21:00')
    expect(demo.openTime).toBe('08:00')
    expect(demo.closeTime).toBe('21:00')
    expect(demo.isOpen).toBe(true)
    expect(demo.categories).toEqual([])
    expect(demo.menu).toEqual([])
    expect(Array.isArray(demo.lookbook)).toBe(true)
    expect(demo.lookbook?.length).toBeGreaterThanOrEqual(1)
    expect(Array.isArray(demo.reviews)).toBe(true)
    expect(demo.reviews?.length).toBeGreaterThanOrEqual(1)
    expect(Array.isArray(demo.practitioners)).toBe(true)
    expect(demo.practitioners?.length).toBeGreaterThanOrEqual(1)
    expect(demo.socialMedia).toEqual({
      facebook: { active: false, url: '' },
      instagram: { active: false, url: '' },
      tiktok: { active: false, url: '' },
    })
  })

  it('accepts a tenant record with pre-joined categories and products', () => {
    const tenantWithJoins = {
      id: 'tenant-joined',
      name: 'Joined Tenant Store',
      address: 'Jl. Riau No. 5',
      brandingContent: {},
      category: 'Retail',
      city: 'Bandung',
      createdAt: new Date(),
      customDomain: null,
      domainActiveUntil: null,
      fomoExpiresAt: null,
      googleMapsUrl: null,
      operatingHours: {},
      organizationId: null,
      packageTier: 'pro' as const,
      phone: '081987654321',
      siteActiveUntil: null,
      slug: 'joined-tenant-store',
      status: 'published' as const,
      themeConfig: {},
      updatedAt: new Date(),
      userId: null,
      categories: [
        {
          id: 'cat-1',
          name: 'Apparel',
          slug: 'apparel',
          sortOrder: 0,
          tenantId: 'tenant-joined',
        },
      ],
      products: [
        {
          id: 'prod-1',
          name: 'Denim Jacket',
          basePrice: 250000,
          categoryId: 'cat-1',
          createdAt: new Date(),
          description: 'Classic jacket',
          duration: null,
          imageGallery: [],
          imageStorageKey: null,
          imageUrl: null,
          isActive: true,
          originalPrice: null,
          sortOrder: 0,
          specifications: [],
          stock: 10,
          tenantId: 'tenant-joined',
          updatedAt: new Date(),
        },
      ],
    }

    const demo = mapTenantToBusinessDemo(tenantWithJoins)
    expect(demo.name).toBe('Joined Tenant Store')
    expect(demo.categories).toEqual(['Apparel'])
    expect(demo.menu[0]?.price).toBe('Rp 250.000')

    const wrappedDemo = mapTenantToBusinessDemo({
      categories: [],
      products: [],
      tenant: tenantWithJoins,
    })
    expect(wrappedDemo.name).toBe('Joined Tenant Store')
    expect(wrappedDemo.categories).toEqual(['Apparel'])
    expect(wrappedDemo.menu[0]?.price).toBe('Rp 250.000')
  })

  it('preserves custom lookbook and reviews when provided in brandingContent', () => {
    const customLookbook = [
      {
        id: 'lb-1',
        name: 'Summer Look 2026',
        desc: 'Casual summer vibes',
        imageUrl: 'https://example.com/look1.jpg',
      },
    ]

    const customReviews = [
      {
        authorName: 'Dewi Lestari',
        rating: 5,
        text: 'Luar biasa bagus!',
        time: 'Baru saja',
      },
    ]

    const tenant = {
      id: 'tenant-custom',
      name: 'Custom Boutique',
      address: 'Jl. Kemang Raya',
      category: 'Fashion',
      city: 'Jakarta',
      createdAt: new Date(),
      customDomain: null,
      domainActiveUntil: null,
      fomoExpiresAt: null,
      googleMapsUrl: null,
      operatingHours: {},
      organizationId: null,
      packageTier: 'pro' as const,
      phone: '+62 (812) 9999-8888',
      siteActiveUntil: null,
      slug: 'custom-boutique',
      status: 'published' as const,
      themeConfig: {},
      updatedAt: new Date(),
      userId: null,
      brandingContent: {
        lookbook: customLookbook,
        rating: 4.8,
        reviewCount: 340,
        reviews: customReviews,
      },
    }

    const demo = mapTenantToBusinessDemo({
      categories: [],
      products: [],
      tenant,
    })

    expect(demo.lookbook).toEqual(customLookbook)
    expect(demo.reviews).toEqual(customReviews)
    expect(demo.rating).toBe(4.8)
    expect(demo.reviewCount).toBe(340)
    expect(demo.waNumber).toBe('6281299998888')
  })

  it('gracefully handles missing product category references', () => {
    const tenant = {
      id: 'tenant-orphan-cat',
      name: 'Uncategorized Store',
      address: null,
      brandingContent: {},
      category: 'Retail',
      city: null,
      createdAt: new Date(),
      customDomain: null,
      domainActiveUntil: null,
      fomoExpiresAt: null,
      googleMapsUrl: null,
      operatingHours: {},
      organizationId: null,
      packageTier: 'free' as const,
      phone: null,
      siteActiveUntil: null,
      slug: 'uncategorized-store',
      status: 'published' as const,
      themeConfig: {},
      updatedAt: new Date(),
      userId: null,
    }

    const products = [
      {
        id: 'prod-orphan',
        name: 'Mystery Item',
        basePrice: 50000,
        category: null,
        categoryId: 'non-existent-cat-id',
        createdAt: new Date(),
        description: null,
        duration: null,
        imageGallery: null,
        imageStorageKey: null,
        imageUrl: null,
        isActive: true,
        originalPrice: null,
        sortOrder: 0,
        specifications: null,
        stock: null,
        tenantId: 'tenant-orphan-cat',
        updatedAt: new Date(),
        variants: [],
      },
    ]

    const demo = mapTenantToBusinessDemo({
      categories: [],
      products,
      tenant,
    })

    expect(demo.menu[0]?.category).toBe('')
    expect(demo.menu[0]?.imageGallery).toEqual([])
    expect(demo.menu[0]?.specifications).toEqual([])
    expect(demo.menu[0]?.desc).toBe('')
  })
})
