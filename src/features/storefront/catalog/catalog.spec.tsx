import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import {
  mockFnbCategories,
  mockFnbProduct,
  mockRetailProduct,
  mockSimpleProduct,
} from '../__fixtures__/storefront-fixtures'
import { ProductCatalog } from './index'

describe('ProductCatalog Compound Components Browser Mode Tests', () => {
  const fnbProducts = [mockFnbProduct, mockSimpleProduct]

  // =========================================================================
  // 1. Root, Category Bar, and Grid Filtering
  // =========================================================================

  describe('category tab filtering', () => {
    it('renders all products when "Semua" tab is active by default', async () => {
      render(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.CategoryBar />
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      await expect.element(page.getByRole('tab', { name: 'Semua' })).toBeVisible()
      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
    })

    it('filters products when clicking category tabs', async () => {
      render(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.CategoryBar />
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      // Click "Makanan & Snack" tab
      await page.getByRole('tab', { name: 'Makanan & Snack' }).click()

      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
      await expect.element(page.getByText('Kopi Susu Gula Aren')).not.toBeInTheDocument()

      // Click "Kopi & Minuman" tab
      await page.getByRole('tab', { name: 'Kopi & Minuman' }).click()

      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Donat Cokelat')).not.toBeInTheDocument()

      // Click "Semua" tab
      await page.getByRole('tab', { name: 'Semua' }).click()

      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
    })
  })

  // =========================================================================
  // 2. Search Input with Real Typing & Clear Events
  // =========================================================================

  describe('search input filtering', () => {
    it('filters products by name typing into searchbox', async () => {
      render(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.SearchInput />
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      const searchInput = page.getByRole('searchbox')
      await searchInput.fill('Donat')

      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
      await expect.element(page.getByText('Kopi Susu Gula Aren')).not.toBeInTheDocument()
    })

    it('filters products by description substring', async () => {
      render(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.SearchInput />
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      const searchInput = page.getByRole('searchbox')
      await searchInput.fill('susu segar')

      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Donat Cokelat')).not.toBeInTheDocument()
    })

    it('clears search query and restores all products when clicking clear button', async () => {
      render(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.SearchInput />
          <ProductCatalog.Grid />
        </ProductCatalog.Root>,
      )

      const searchInput = page.getByRole('searchbox')
      await searchInput.fill('Donat')

      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
      await expect.element(page.getByText('Kopi Susu Gula Aren')).not.toBeInTheDocument()

      await page.getByRole('button', { name: 'Hapus pencarian' }).click()

      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
    })
  })

  // =========================================================================
  // 3. Empty State & Reset Filter
  // =========================================================================

  describe('empty state and reset', () => {
    it('displays empty state when search query matches no products and resets on button click', async () => {
      render(
        <ProductCatalog.Root categories={mockFnbCategories} products={fnbProducts}>
          <ProductCatalog.SearchInput />
          <ProductCatalog.Grid />
          <ProductCatalog.Empty />
        </ProductCatalog.Root>,
      )

      const searchInput = page.getByRole('searchbox')
      await searchInput.fill('ProdukGaib123')

      await expect.element(page.getByText('Produk Tidak Ditemukan')).toBeVisible()
      await expect
        .element(
          page.getByText(
            'Tidak ada produk yang sesuai dengan filter atau kata kunci pencarian Anda.',
          ),
        )
        .toBeVisible()
      await expect.element(page.getByText('Kopi Susu Gula Aren')).not.toBeInTheDocument()
      await expect.element(page.getByText('Donat Cokelat')).not.toBeInTheDocument()

      await page.getByRole('button', { name: 'Reset Filter' }).click()

      await expect.element(page.getByText('Produk Tidak Ditemukan')).not.toBeInTheDocument()
      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
    })
  })

  // =========================================================================
  // 4. Product Card Presentation Logic: Pricing & Badges
  // =========================================================================

  describe('product card presentation', () => {
    it('displays formatted IDR price, strikethrough original price, and discount badge', async () => {
      render(<ProductCatalog.Card product={mockFnbProduct} />)

      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Rp 20.000')).toBeVisible()
      await expect.element(page.getByText('Rp 25.000')).toBeVisible()
      await expect.element(page.getByText('-20%')).toBeVisible()
    })

    it('does not display discount badge when product has no original price', async () => {
      render(<ProductCatalog.Card product={mockSimpleProduct} />)

      await expect.element(page.getByText('Donat Cokelat')).toBeVisible()
      await expect.element(page.getByText('Rp 12.000')).toBeVisible()
      await expect.element(page.getByText(/%/)).not.toBeInTheDocument()
    })
  })

  // =========================================================================
  // 5. Card Action Button Seams: Direct Add vs Customization Dialog
  // =========================================================================

  describe('card action button seams', () => {
    it('dispatches onAddToCart callback for simple products without variants', async () => {
      const onAddToCart = vi.fn()
      const onSelect = vi.fn()

      render(
        <ProductCatalog.Card
          product={mockSimpleProduct}
          onAddToCart={onAddToCart}
          onSelect={onSelect}
        />,
      )

      await page.getByRole('button', { name: /Tambah: Donat Cokelat/i }).click()

      expect(onAddToCart).toHaveBeenCalledTimes(1)
      expect(onAddToCart).toHaveBeenCalledWith(mockSimpleProduct)
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('dispatches onSelect callback for customizable products with variants', async () => {
      const onAddToCart = vi.fn()
      const onSelect = vi.fn()

      render(
        <ProductCatalog.Card
          product={mockFnbProduct}
          onAddToCart={onAddToCart}
          onSelect={onSelect}
        />,
      )

      await page.getByRole('button', { name: /Pilih Opsi: Kopi Susu Gula Aren/i }).click()

      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith(mockFnbProduct)
      expect(onAddToCart).not.toHaveBeenCalled()
    })
  })

  // =========================================================================
  // 6. Retail Archetype Preset
  // =========================================================================

  describe('retail archetype preset', () => {
    it('renders retail product with discount badge and triggers add to cart', async () => {
      const onAddToCart = vi.fn()

      render(<ProductCatalog.Card product={mockRetailProduct} onAddToCart={onAddToCart} />)

      await expect.element(page.getByText('Overdose Boxy Tee')).toBeVisible()
      await expect.element(page.getByText('Rp 185.000')).toBeVisible()
      await expect.element(page.getByText('Rp 220.000')).toBeVisible()
      await expect.element(page.getByText('-16%')).toBeVisible()

      await page.getByRole('button', { name: /Tambah: Overdose Boxy Tee/i }).click()
      expect(onAddToCart).toHaveBeenCalledWith(mockRetailProduct)
    })
  })
})
