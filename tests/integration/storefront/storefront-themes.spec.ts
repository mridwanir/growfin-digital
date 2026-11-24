import type { Category } from '@/db/schema/catalog'
import type { Tenant } from '@/db/schema/tenants'
import type { ProductWithVariants } from '@/features/storefront'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import {
  buildCartItemHash,
  buildOrderSummary,
  calculateItemSubtotal,
  createCartStore,
  formatCurrency,
  FulfillmentSchema,
  getStorefrontLayout,
  normalizeWaNumber,
  StorefrontCartProvider,
} from '@/features/storefront'

// ---------------------------------------------------------------------------
// Relational Drizzle Fixtures
// ---------------------------------------------------------------------------

const mockFnbTenant: Tenant = {
  id: 'tenant-fnb-1',
  name: 'Kopi Artisan Nusantara',
  address: 'Jl. Riau No. 55',
  category: 'Coffee Shop & Cafe',
  city: 'Bandung',
  createdAt: new Date(),
  customDomain: null,
  domainActiveUntil: null,
  googleMapsUrl: 'https://maps.google.com/?cid=123',
  logo: null,
  metadata: null,
  packageTier: 'instant',
  phone: '081234567890',
  siteActiveUntil: null,
  slug: 'kopi-artisan-nusantara',
  status: 'published',
  updatedAt: new Date(),
  operatingHours: {
    closeTime: '22:00',
    isOpen: true,
    openTime: '08:00',
    raw: '08:00 - 22:00',
  },
}

const mockFnbCategories: Category[] = [
  {
    id: 'cat-fnb-1',
    name: 'Coffee',
    slug: 'coffee',
    sortOrder: 0,
    tenantId: mockFnbTenant.id,
  },
  {
    id: 'cat-fnb-2',
    name: 'Snacks',
    slug: 'snacks',
    sortOrder: 1,
    tenantId: mockFnbTenant.id,
  },
]

const mockFnbProducts: ProductWithVariants[] = [
  {
    id: 'prod-fnb-1',
    name: 'Kopi Susu Aren',
    basePrice: 20000,
    categoryId: 'cat-fnb-1',
    originalPrice: 25000,
    sortOrder: 0,
    tenantId: mockFnbTenant.id,
    variants: [
      {
        id: 'var-fnb-1',
        name: 'Ukuran',
        required: true,
        options: [
          { id: 'opt-fnb-reg', label: 'Regular', priceModifier: 0, sortOrder: 0 },
          { id: 'opt-fnb-lrg', label: 'Large', priceModifier: 5000, sortOrder: 1 },
        ],
      },
    ],
  },
]

const mockRetailTenant: Tenant = {
  ...mockFnbTenant,
  id: 'tenant-retail-1',
  name: 'Urban Streetwear Bandung',
  category: 'Clothing & Fashion',
  slug: 'urban-streetwear-bandung',
}

const mockRetailCategories: Category[] = [
  {
    id: 'cat-ret-1',
    name: 'Apparel',
    slug: 'apparel',
    sortOrder: 0,
    tenantId: mockRetailTenant.id,
  },
]

const mockRetailProducts: ProductWithVariants[] = [
  {
    id: 'prod-ret-1',
    name: 'Overdose Boxy Tee',
    basePrice: 150000,
    categoryId: 'cat-ret-1',
    originalPrice: 180000,
    sortOrder: 0,
    tenantId: mockRetailTenant.id,
    variants: [
      {
        id: 'var-ret-1',
        name: 'Size',
        required: true,
        options: [
          { id: 'opt-ret-m', label: 'M', priceModifier: 0, sortOrder: 0 },
          { id: 'opt-ret-xl', label: 'XL', priceModifier: 10000, sortOrder: 1 },
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('storefront theme rendering, compound catalog & cart domain (seam 3)', () => {
  describe('cart math, variant stacking & pure domain logic', () => {
    it('calculates item subtotal accurately with variant price modifiers in integer IDR', () => {
      const basePrice = 20000
      expect(calculateItemSubtotal(basePrice, [0], [], 1)).toBe(20000)
      expect(calculateItemSubtotal(basePrice, [5000], [], 1)).toBe(25000)
      expect(calculateItemSubtotal(basePrice, [-3000], [], 1)).toBe(17000)
      expect(calculateItemSubtotal(basePrice, [5000], [{ price: 3000 }], 2)).toBe(56000)
    })

    it('generates deterministic composite hash for cart item stacking', () => {
      const hash1 = buildCartItemHash('prod-1', { Color: 'Black', Size: 'L' }, ['Box'])
      const hash2 = buildCartItemHash('prod-1', { Color: 'Black', Size: 'L' }, ['Box'])
      const hash3 = buildCartItemHash('prod-1', { Color: 'Black', Size: 'M' }, ['Box'])

      expect(hash1).toBe(hash2)
      expect(hash1).not.toBe(hash3)
    })

    it('stacks identical items and separates distinct variants in tenant cart store', () => {
      const store = createCartStore('test-tenant')

      // Add 1 Regular Kopi Susu
      store.getState().addItem({
        name: 'Kopi Susu Aren',
        basePrice: 20000,
        productId: 'prod-fnb-1',
        quantity: 1,
        selectedVariants: { Ukuran: 'Regular' },
        unitPrice: 20000,
      })
      expect(store.getState().items).toHaveLength(1)
      expect(store.getState().items[0]?.quantity).toBe(1)

      // Add identical item -> stacks to quantity 2
      store.getState().addItem({
        name: 'Kopi Susu Aren',
        basePrice: 20000,
        productId: 'prod-fnb-1',
        quantity: 1,
        selectedVariants: { Ukuran: 'Regular' },
        unitPrice: 20000,
      })
      expect(store.getState().items).toHaveLength(1)
      expect(store.getState().items[0]?.quantity).toBe(2)

      // Add Large Kopi Susu -> separate line item
      store.getState().addItem({
        name: 'Kopi Susu Aren',
        basePrice: 20000,
        productId: 'prod-fnb-1',
        quantity: 1,
        selectedVariants: { Ukuran: 'Large' },
        unitPrice: 25000,
      })
      expect(store.getState().items).toHaveLength(2)
      expect(store.getState().items[1]?.quantity).toBe(1)
    })

    it('formats integer IDR prices accurately without floating-point artifacts', () => {
      expect(formatCurrency(25000)).toBe('Rp 25.000')
      expect(formatCurrency(1500000)).toBe('Rp 1.500.000')
      expect(formatCurrency(0)).toBe('Rp 0')
      expect(formatCurrency(-5000)).toBe('-Rp 5.000')
    })
  })

  describe('fnb visual themes rendering with compound catalog', () => {
    const fnbThemes = [
      'fnb-theme-classic',
      'fnb-theme-modern',
      'fnb-theme-premium',
      'fnb-theme-artisan',
      'fnb-theme-elegant',
      'fnb-theme-bold',
      'fnb-theme-vibrant',
    ]

    for (const theme of fnbThemes) {
      it(`renders FnB theme variant "${theme}" without crashing`, () => {
        const LayoutComponent = getStorefrontLayout(theme, 'fnb')
        const markup = renderToStaticMarkup(
          React.createElement(
            StorefrontCartProvider,
            { tenantId: mockFnbTenant.id },
            React.createElement(LayoutComponent, {
              categories: mockFnbCategories,
              products: mockFnbProducts,
              tenant: mockFnbTenant,
            }),
          ),
        )

        expect(markup).toContain('Kopi Artisan Nusantara')
        expect(markup).toContain('Kopi Susu Aren')
        expect(markup).toContain('data-slot="storefront-layout-shell"')
      })
    }
  })

  describe('retail visual themes rendering with compound catalog', () => {
    const retailThemes = [
      'retail-theme-urban',
      'retail-theme-editorial',
      'retail-theme-tech',
      'retail-theme-dark',
      'retail-theme-fresh',
      'retail-theme-artisan',
    ]

    for (const theme of retailThemes) {
      it(`renders Retail theme variant "${theme}" without crashing`, () => {
        const LayoutComponent = getStorefrontLayout(theme, 'retail')
        const markup = renderToStaticMarkup(
          React.createElement(
            StorefrontCartProvider,
            { tenantId: mockRetailTenant.id },
            React.createElement(LayoutComponent, {
              categories: mockRetailCategories,
              products: mockRetailProducts,
              tenant: mockRetailTenant,
            }),
          ),
        )

        expect(markup).toContain('Urban Streetwear Bandung')
        expect(markup).toContain('Overdose Boxy Tee')
        expect(markup).toContain('data-slot="storefront-layout-shell"')
      })
    }
  })

  describe('headless WhatsApp order generation & fulfillment validation', () => {
    it('normalizes local Indonesian phone numbers to clean international format', () => {
      expect(normalizeWaNumber('081234567890')).toBe('6281234567890')
      expect(normalizeWaNumber('+6281234567890')).toBe('6281234567890')
      expect(normalizeWaNumber('6281234567890')).toBe('6281234567890')
      expect(normalizeWaNumber('+62 0812-3456-7890')).toBe('6281234567890')
    })

    it('validates fulfillment payloads using discriminated union schema', () => {
      const validDineIn = FulfillmentSchema.safeParse({
        customerName: 'Budi',
        mode: 'DINE_IN',
        tableNumber: 'Meja 05',
      })
      expect(validDineIn.success).toBe(true)

      const invalidDineIn = FulfillmentSchema.safeParse({
        customerName: 'Budi',
        mode: 'DINE_IN',
        tableNumber: '',
      })
      expect(invalidDineIn.success).toBe(false)

      const validDelivery = FulfillmentSchema.safeParse({
        address: 'Jl. Riau No. 12, Bandung',
        customerName: 'Siti',
        mode: 'DELIVERY',
      })
      expect(validDelivery.success).toBe(true)
    })

    it('generates properly formatted WhatsApp ordering link with catalog items and fulfillment', () => {
      const result = buildOrderSummary({
        cartItems: [
          {
            id: 'item-1',
            name: 'Kopi Susu Aren',
            basePrice: 20000,
            productId: 'prod-1',
            quantity: 2,
            selectedVariants: { Ukuran: 'Large' },
            subtotal: 50000,
            unitPrice: 25000,
          },
        ],
        fulfillment: {
          customerName: 'Budi Santoso',
          mode: 'DINE_IN',
          tableNumber: 'Meja 07',
        },
        tenant: {
          name: mockFnbTenant.name,
          phone: mockFnbTenant.phone,
        },
      })

      expect(result.waUrl).toContain('https://wa.me/6281234567890?text=')
      expect(result.message).toContain('Kopi Artisan Nusantara')
      expect(result.message).toContain('Kopi Susu Aren')
      expect(result.message).toContain('Dine In')
      expect(result.message).toContain('Meja 07')
      expect(result.message).toContain('Rp 50.000')
    })
  })
})
