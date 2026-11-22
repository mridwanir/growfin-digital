import type { ReactElement, ReactNode } from 'react'

import type {
  ProductCatalogCardProps,
  ProductCatalogContextValue,
  ProductWithVariants,
} from '@/components/storefront/catalog'
import type { Category } from '@/db/schema/catalog'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import {
  formatCurrency,
  getDiscountPercentage,
  hasValidDiscount,
  ProductCatalog,
  useProductCatalog,
} from '@/components/storefront/catalog'

// ---------------------------------------------------------------------------
// Test Fixtures
// ---------------------------------------------------------------------------

const mockFnbCategories: Category[] = [
  {
    id: 'cat-fnb-1',
    name: 'Kopi & Minuman',
    slug: 'kopi-minuman',
    sortOrder: 1,
    tenantId: 'tenant-fnb-1',
  },
  {
    id: 'cat-fnb-2',
    name: 'Makanan & Snack',
    slug: 'makanan-snack',
    sortOrder: 2,
    tenantId: 'tenant-fnb-1',
  },
]

const simpleFnbProduct: ProductWithVariants = {
  id: 'prod-1',
  name: 'Espresso Single',
  basePrice: 18000, // IDR 18.000
  categoryId: 'cat-fnb-1',
  createdAt: new Date('2026-01-01'),
  description: 'Single shot espresso dari 100% biji Arabika Gayo',
  duration: null,
  imageGallery: [],
  imageStorageKey: null,
  imageUrl: 'https://images.unsplash.com/photo-espresso',
  isActive: true,
  originalPrice: null,
  sortOrder: 1,
  stock: 50,
  tenantId: 'tenant-fnb-1',
  updatedAt: new Date('2026-01-01'),
  variants: [],
}

const variantFnbProduct: ProductWithVariants = {
  id: 'prod-2',
  name: 'Kopi Susu Gula Aren',
  basePrice: 25000, // IDR 25.000
  categoryId: 'cat-fnb-1',
  createdAt: new Date('2026-01-01'),
  description: 'Espresso susu segar dengan gula aren asli',
  duration: null,
  imageGallery: [],
  imageStorageKey: null,
  imageUrl: 'https://images.unsplash.com/photo-kopisusu',
  isActive: true,
  originalPrice: 30000, // IDR 30.000 (valid discount: ~17%)
  sortOrder: 2,
  stock: 100,
  tenantId: 'tenant-fnb-1',
  updatedAt: new Date('2026-01-01'),
  variants: [
    {
      id: 'var-1',
      name: 'Ukuran',
      productId: 'prod-2',
      required: true,
      options: [
        { id: 'opt-1', label: 'Regular', priceModifier: 0, sortOrder: 1, variantId: 'var-1' },
        { id: 'opt-2', label: 'Large', priceModifier: 5000, sortOrder: 2, variantId: 'var-1' },
      ],
    },
  ],
}

const snackFnbProduct: ProductWithVariants = {
  id: 'prod-3',
  name: 'Croissant Cokelat',
  basePrice: 28000,
  categoryId: 'cat-fnb-2',
  createdAt: new Date('2026-01-01'),
  description: 'Pastry renyah dengan isian dark chocolate premium',
  duration: null,
  imageGallery: [],
  imageStorageKey: null,
  imageUrl: 'https://images.unsplash.com/photo-croissant',
  isActive: true,
  originalPrice: 35000, // 20% discount
  sortOrder: 3,
  stock: 20,
  tenantId: 'tenant-fnb-1',
  updatedAt: new Date('2026-01-01'),
  variants: [],
}

const fnbProducts: ProductWithVariants[] = [simpleFnbProduct, variantFnbProduct, snackFnbProduct]

const mockRetailCategories: Category[] = [
  { id: 'cat-ret-1', name: 'Apparel', slug: 'apparel', sortOrder: 1, tenantId: 'tenant-ret-1' },
  {
    id: 'cat-ret-2',
    name: 'Accessories',
    slug: 'accessories',
    sortOrder: 2,
    tenantId: 'tenant-ret-1',
  },
]

const retailVariantProduct: ProductWithVariants = {
  id: 'ret-1',
  name: 'Overdose Boxy Tee',
  basePrice: 185000,
  categoryId: 'cat-ret-1',
  createdAt: new Date('2026-01-01'),
  description: 'Heavyweight cotton t-shirt with screenprinted graphics',
  duration: null,
  imageGallery: [],
  imageStorageKey: null,
  imageUrl: 'https://images.unsplash.com/photo-tee',
  isActive: true,
  originalPrice: 220000, // ~16% discount
  sortOrder: 1,
  stock: 30,
  tenantId: 'tenant-ret-1',
  updatedAt: new Date('2026-01-01'),
  variants: [
    {
      id: 'var-ret-1',
      name: 'Size',
      productId: 'ret-1',
      required: true,
      options: [
        { id: 'opt-s', label: 'S', priceModifier: 0, sortOrder: 1, variantId: 'var-ret-1' },
        { id: 'opt-m', label: 'M', priceModifier: 0, sortOrder: 2, variantId: 'var-ret-1' },
        { id: 'opt-l', label: 'L', priceModifier: 0, sortOrder: 3, variantId: 'var-ret-1' },
      ],
    },
  ],
}

const retailSimpleProduct: ProductWithVariants = {
  id: 'ret-2',
  name: 'Canvas Tote Bag',
  basePrice: 95000,
  categoryId: 'cat-ret-2',
  createdAt: new Date('2026-01-01'),
  description: 'Durable 16oz cotton canvas daily tote bag',
  duration: null,
  imageGallery: [],
  imageStorageKey: null,
  imageUrl: 'https://images.unsplash.com/photo-tote',
  isActive: true,
  originalPrice: null,
  sortOrder: 2,
  stock: 15,
  tenantId: 'tenant-ret-1',
  updatedAt: new Date('2026-01-01'),
  variants: [],
}

const retailProducts: ProductWithVariants[] = [retailVariantProduct, retailSimpleProduct]

// ---------------------------------------------------------------------------
// Unit & Integration Test Suite
// ---------------------------------------------------------------------------

describe('Shadcn-Style Compound Catalog Components (Ticket 04)', () => {
  describe('iDR Currency Formatting & Discount Math', () => {
    it('formats positive integers into standard IDR format', () => {
      expect(formatCurrency(18000)).toBe('Rp 18.000')
      expect(formatCurrency(25000)).toBe('Rp 25.000')
      expect(formatCurrency(1500000)).toBe('Rp 1.500.000')
      expect(formatCurrency(0)).toBe('Rp 0')
    })

    it('formats negative integers gracefully', () => {
      expect(formatCurrency(-5000)).toBe('-Rp 5.000')
    })

    it('handles invalid numbers by returning Rp 0', () => {
      expect(formatCurrency(Number.NaN)).toBe('Rp 0')
      expect(formatCurrency(Infinity)).toBe('Rp 0')
    })

    it('validates strikethrough discount existence strictly', () => {
      expect(hasValidDiscount(25000, 30000)).toBe(true)
      expect(hasValidDiscount(25000, 25000)).toBe(false)
      expect(hasValidDiscount(25000, 20000)).toBe(false)
      expect(hasValidDiscount(25000, null)).toBe(false)
      expect(hasValidDiscount(25000, undefined)).toBe(false)
    })

    it('calculates integer discount percentage correctly', () => {
      expect(getDiscountPercentage(25000, 30000)).toBe(17) // (30000 - 25000) / 30000 = 16.66% -> 17%
      expect(getDiscountPercentage(28000, 35000)).toBe(20) // (35000 - 28000) / 35000 = 20%
      expect(getDiscountPercentage(185000, 220000)).toBe(16) // (220000 - 185000) / 220000 = 15.9% -> 16%
      expect(getDiscountPercentage(25000, null)).toBe(0)
    })
  })

  describe('productCatalog.Root and Context Filtering', () => {
    it('renders all products when activeCategory is "all" or default', () => {
      const markup = renderToStaticMarkup(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.CategoryBar />
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      expect(markup).toContain('Espresso Single')
      expect(markup).toContain('Kopi Susu Gula Aren')
      expect(markup).toContain('Croissant Cokelat')
    })

    it('category switching updates filtered product list', () => {
      // Filter by category 1 (Kopi & Minuman)
      const markupKopi = renderToStaticMarkup(
        <ProductCatalog.Root
          activeCategory="cat-fnb-1"
          categories={mockFnbCategories}
          products={fnbProducts}
        >
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      expect(markupKopi).toContain('Espresso Single')
      expect(markupKopi).toContain('Kopi Susu Gula Aren')
      expect(markupKopi).not.toContain('Croissant Cokelat')

      // Filter by category 2 (Makanan & Snack)
      const markupSnack = renderToStaticMarkup(
        <ProductCatalog.Root
          activeCategory="cat-fnb-2"
          categories={mockFnbCategories}
          products={fnbProducts}
        >
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      expect(markupSnack).not.toContain('Espresso Single')
      expect(markupSnack).not.toContain('Kopi Susu Gula Aren')
      expect(markupSnack).toContain('Croissant Cokelat')
    })

    it('search input filters products by name or description', () => {
      // Search by name substring
      const markupByName = renderToStaticMarkup(
        <ProductCatalog.Root products={fnbProducts} searchQuery="Espresso">
          <ProductCatalog.SearchInput />
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      expect(markupByName).toContain('Espresso Single')
      // Kopi Susu has 'Espresso' in description
      expect(markupByName).toContain('Kopi Susu Gula Aren')
      expect(markupByName).not.toContain('Croissant Cokelat')

      // Search by specific description substring
      const markupByDesc = renderToStaticMarkup(
        <ProductCatalog.Root products={fnbProducts} searchQuery="dark chocolate">
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      expect(markupByDesc).not.toContain('Espresso Single')
      expect(markupByDesc).not.toContain('Kopi Susu Gula Aren')
      expect(markupByDesc).toContain('Croissant Cokelat')
    })

    it('provides context values and state to consumer hook', () => {
      let capturedContext: ProductCatalogContextValue | null = null

      function ConsumerProbe() {
        capturedContext = useProductCatalog()
        return null
      }

      renderToStaticMarkup(
        <ProductCatalog.Root
          activeCategory="cat-fnb-2"
          categories={mockFnbCategories}
          products={fnbProducts}
          searchQuery="Croissant"
        >
          <ConsumerProbe />
        </ProductCatalog.Root>,
      )

      const context: ProductCatalogContextValue = capturedContext!
      expect(context).toBeDefined()
      expect(context.activeCategory).toBe('cat-fnb-2')
      expect(context.searchQuery).toBe('Croissant')
      expect(context.filteredProducts).toHaveLength(1)
      expect(context.filteredProducts[0]?.name).toBe('Croissant Cokelat')
      expect(context.isEmpty).toBe(false)
      expect(context.hasItems).toBe(true)
    })
  })

  describe('productCatalog.Card Rendering & IDR Pricing', () => {
    it('card displays formatted currency and strikethrough original price with discount badges', () => {
      const markup = renderToStaticMarkup(<ProductCatalog.Card product={variantFnbProduct} />)

      expect(markup).toContain('Kopi Susu Gula Aren')
      expect(markup).toContain('Rp 25.000') // base price
      expect(markup).toContain('Rp 30.000') // strikethrough original price
      expect(markup).toContain('-17%') // discount badge
    })

    it('card does not show discount badge when originalPrice is null or smaller', () => {
      const markup = renderToStaticMarkup(<ProductCatalog.Card product={simpleFnbProduct} />)

      expect(markup).toContain('Espresso Single')
      expect(markup).toContain('Rp 18.000')
      expect(markup).not.toContain('data-slot="catalog-card-discount"')
    })

    it('applies CVA variant props for border radius, density, and card style', () => {
      const markup = renderToStaticMarkup(
        <ProductCatalog.Card
          density="spacious"
          product={simpleFnbProduct}
          radius="lg"
          variant="elevated"
        />,
      )

      expect(markup).toContain('rounded-2xl') // lg radius
      expect(markup).toContain('shadow-') // elevated variant
    })
  })

  describe('action Dispatch Seam: Direct Add vs Customization Dialog', () => {
    it('direct add-to-cart callback is called for simple products without variants', () => {
      const onAddToCart = vi.fn()
      const onSelect = vi.fn()

      const rendered = renderCardElement({
        product: simpleFnbProduct,
        onAddToCart,
        onSelect,
      })

      expect(rendered).toBeDefined()
      const actionButton = findElementBySlot(rendered, 'catalog-card-action')
      expect(actionButton).toBeDefined()
      const onClick = actionButton?.props?.onClick as ((event: unknown) => void) | undefined
      expect(typeof onClick).toBe('function')
      onClick?.({ preventDefault: vi.fn(), stopPropagation: vi.fn() })

      expect(onAddToCart).toHaveBeenCalledTimes(1)
      expect(onAddToCart).toHaveBeenCalledWith(simpleFnbProduct)
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('customization callback is called for products with variants', () => {
      const onAddToCart = vi.fn()
      const onSelect = vi.fn()

      const rendered = renderCardElement({
        product: variantFnbProduct,
        onAddToCart,
        onSelect,
      })

      expect(rendered).toBeDefined()
      const actionButton = findElementBySlot(rendered, 'catalog-card-action')
      expect(actionButton).toBeDefined()
      const onClick = actionButton?.props?.onClick as ((event: unknown) => void) | undefined
      expect(typeof onClick).toBe('function')
      onClick?.({ preventDefault: vi.fn(), stopPropagation: vi.fn() })

      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith(variantFnbProduct)
      expect(onAddToCart).not.toHaveBeenCalled()
    })
  })

  describe('productCatalog.Empty State', () => {
    it('empty state displays when no items match the selected category or search', () => {
      const markup = renderToStaticMarkup(
        <ProductCatalog.Root
          categories={mockFnbCategories}
          products={fnbProducts}
          searchQuery="NonExistentItemXYZ"
        >
          <ProductCatalog.Grid />
          <ProductCatalog.Empty />
        </ProductCatalog.Root>,
      )

      expect(markup).toContain('Produk Tidak Ditemukan')
      expect(markup).not.toContain('Espresso Single')
      expect(markup).not.toContain('Croissant Cokelat')
    })

    it('empty state is hidden when items are present', () => {
      const markup = renderToStaticMarkup(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.Grid />
          <ProductCatalog.Empty />
        </ProductCatalog.Root>,
      )

      expect(markup).not.toContain('Produk Tidak Ditemukan')
      expect(markup).toContain('Espresso Single')
    })
  })

  describe('retail Archetype Preset Verification', () => {
    it('renders retail products and variant customizations cleanly', () => {
      const onAddToCart = vi.fn()
      const onSelect = vi.fn()

      const markup = renderToStaticMarkup(
        <ProductCatalog.Root
          activeCategory="cat-ret-1"
          categories={mockRetailCategories}
          products={retailProducts}
        >
          <ProductCatalog.CategoryBar variant="pills" />
          <ProductCatalog.Grid cols={3} gap="lg" />
        </ProductCatalog.Root>,
      )

      expect(markup).toContain('Overdose Boxy Tee')
      expect(markup).toContain('Rp 185.000')
      expect(markup).toContain('Rp 220.000')
      expect(markup).toContain('-16%')
      expect(markup).not.toContain('Canvas Tote Bag')

      // Simple retail product action
      const renderedTote = renderCardElement({
        product: retailSimpleProduct,
        onAddToCart,
        onSelect,
      })
      const toteButton = findElementBySlot(renderedTote, 'catalog-card-action')
      const onToteClick = toteButton?.props?.onClick as ((event: unknown) => void) | undefined
      onToteClick?.({ preventDefault: vi.fn(), stopPropagation: vi.fn() })
      expect(onAddToCart).toHaveBeenCalledWith(retailSimpleProduct)

      // Variant retail product action
      const renderedTee = renderCardElement({
        product: retailVariantProduct,
        onAddToCart,
        onSelect,
      })
      const teeButton = findElementBySlot(renderedTee, 'catalog-card-action')
      const onTeeClick = teeButton?.props?.onClick as ((event: unknown) => void) | undefined
      onTeeClick?.({ preventDefault: vi.fn(), stopPropagation: vi.fn() })
      expect(onSelect).toHaveBeenCalledWith(retailVariantProduct)
    })
  })
})

// ---------------------------------------------------------------------------
// Test Helper: Find nested React element by data-slot
// ---------------------------------------------------------------------------
interface SlotElementProps {
  'data-slot'?: string
  children?: ReactNode
  onClick?: (event: unknown) => void
  [key: string]: unknown
}

function findElementBySlot(
  element: ReactNode,
  slot: string,
): ReactElement<SlotElementProps> | null {
  if (!React.isValidElement<SlotElementProps>(element)) {
    return null
  }
  if (element.props['data-slot'] === slot) {
    return element
  }
  const children = element.props.children
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findElementBySlot(child, slot)
      if (found) return found
    }
  } else if (children) {
    return findElementBySlot(children, slot)
  }
  return null
}
function renderCardElement(props: ProductCatalogCardProps): ReactElement {
  let captured: ReactElement | null = null
  function CardCapture() {
    captured = ProductCatalog.Card(props) as ReactElement
    return captured
  }
  renderToStaticMarkup(<CardCapture />)
  return captured!
}
