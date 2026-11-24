import type { CartStore } from './index'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import {
  mockFnbProduct,
  mockSimpleProduct,
  mockStorefrontTenant,
} from '../__fixtures__/storefront-fixtures'
import {
  createCartStore,
  MobileCartBar,
  ProductCustomizationDialog,
  StorefrontCartDrawer,
  StorefrontCartProvider,
} from './index'

describe('Storefront Client Islands Browser Mode Tests', () => {
  let cartStore: CartStore

  beforeEach(() => {
    cartStore = createCartStore('tenant-test')
    cartStore.getState().clearCart()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // =========================================================================
  // 1. ProductCustomizationDialog
  // =========================================================================

  describe('productCustomizationDialog', () => {
    it('does not render dialog when open is false or product is null', async () => {
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={false}
            product={mockFnbProduct}
            onOpenChange={vi.fn()}
          />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog open={true} product={null} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders product imagery, title, description, base price in IDR, and discount badge', async () => {
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog open={true} product={mockFnbProduct} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByRole('heading', { name: 'Kopi Susu Gula Aren' })).toBeVisible()
      await expect
        .element(page.getByText('Espresso dengan susu segar dan gula aren asli'))
        .toBeVisible()
      await expect.element(page.getByText('Rp 20.000').first()).toBeVisible()
      await expect.element(page.getByText('Rp 25.000')).toBeVisible()
      await expect.element(page.getByText('-20%')).toBeVisible()
    })

    it('renders variant groups, option choices, and optional addons', async () => {
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog open={true} product={mockFnbProduct} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByText(/Ukuran/)).toBeVisible()
      await expect.element(page.getByRole('button', { name: /^Regular/i })).toBeVisible()
      await expect.element(page.getByRole('button', { name: /Large/i })).toBeVisible()

      await expect.element(page.getByText(/Suhu/)).toBeVisible()
      await expect.element(page.getByRole('button', { name: /^Dingin/i })).toBeVisible()
      await expect.element(page.getByRole('button', { name: /^Panas/i })).toBeVisible()

      await expect.element(page.getByRole('button', { name: /Ekstra Shot/i })).toBeVisible()
      await expect.element(page.getByRole('button', { name: /Jelly Karamel/i })).toBeVisible()
    })

    it('calculates live subtotal accurately with variant modifiers, addons, and quantity changes', async () => {
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog open={true} product={mockFnbProduct} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByText('Rp 20.000').last()).toBeVisible()

      // Select Large variant (+5000 -> 25000)
      await page.getByRole('button', { name: /Large/i }).click()
      await expect.element(page.getByText('Rp 25.000').last()).toBeVisible()

      // Toggle Ekstra Shot addon (+4000 -> 29000)
      await page.getByRole('button', { name: /Ekstra Shot/i }).click()
      await expect.element(page.getByText('Rp 29.000')).toBeVisible()

      // Increment quantity to 2 (29000 * 2 = 58000)
      await page.getByRole('button', { name: 'Tambah jumlah' }).click()
      await expect.element(page.getByText('Rp 58.000')).toBeVisible()

      // Decrement quantity back to 1 (58000 / 2 = 29000)
      await page.getByRole('button', { name: 'Kurangi jumlah' }).click()
      await expect.element(page.getByText('Rp 29.000')).toBeVisible()
    })

    it('customizes simple product without variants or addons', async () => {
      const onOpenChange = vi.fn()

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={true}
            product={mockSimpleProduct}
            onOpenChange={onOpenChange}
          />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByRole('heading', { name: 'Donat Cokelat' })).toBeVisible()
      await expect.element(page.getByText('Rp 12.000').last()).toBeVisible()

      // Increment to quantity 3 (12000 * 3 = 36000)
      await page.getByRole('button', { name: 'Tambah jumlah' }).click()
      await page.getByRole('button', { name: 'Tambah jumlah' }).click()
      await expect.element(page.getByText('Rp 36.000')).toBeVisible()

      // Submit
      await page.getByRole('button', { name: 'Tambahkan ke Keranjang' }).click()

      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(cartStore.getState().items[0]).toMatchObject({
        name: 'Donat Cokelat',
        basePrice: 12000,
        productId: 'prod-snack-1',
        quantity: 3,
        subtotal: 36000,
      })
    })

    it('dispatches addItem to store and closes dialog on submission with notes and variants', async () => {
      const onOpenChange = vi.fn()

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={true}
            product={mockFnbProduct}
            onOpenChange={onOpenChange}
          />
        </StorefrontCartProvider>,
      )

      await page.getByRole('button', { name: /Large/i }).click()
      await page.getByRole('button', { name: /Ekstra Shot/i }).click()
      await page.getByRole('button', { name: 'Tambah jumlah' }).click()

      const notesInput = page.getByPlaceholder('Contoh: Kurangi gula, sedikit es batu...')
      await notesInput.fill('Kurangi es batu')

      await page.getByRole('button', { name: 'Tambahkan ke Keranjang' }).click()

      expect(onOpenChange).toHaveBeenCalledWith(false)

      const items = cartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        notes: 'Kurangi es batu',
        productId: 'prod-coffee-1',
        quantity: 2,
        selectedAddons: ['Ekstra Shot'],
        subtotal: 58000,
        unitPrice: 29000,
        selectedVariants: {
          Suhu: 'Dingin',
          Ukuran: 'Large',
        },
      })
    })

    it('stacks identical configurations in store when submitting matching variants', async () => {
      // First item in store: Regular, Dingin, qty 1
      cartStore.getState().addItem({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        productId: 'prod-coffee-1',
        quantity: 1,
        selectedAddons: [],
        selectedVariants: { Suhu: 'Dingin', Ukuran: 'Regular' },
        subtotal: 20000,
        unitPrice: 20000,
      })

      expect(cartStore.getState().items).toHaveLength(1)
      expect(cartStore.getState().items[0].quantity).toBe(1)

      const onOpenChange = vi.fn()
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={true}
            product={mockFnbProduct}
            onOpenChange={onOpenChange}
          />
        </StorefrontCartProvider>,
      )

      // Add identical config (Regular, Dingin, no addons) with quantity 2
      await page.getByRole('button', { name: 'Tambah jumlah' }).click()
      await page.getByRole('button', { name: 'Tambahkan ke Keranjang' }).click()

      const itemsAfterStack = cartStore.getState().items
      expect(itemsAfterStack).toHaveLength(1)
      expect(itemsAfterStack[0].quantity).toBe(3)
      expect(itemsAfterStack[0].subtotal).toBe(60000)
    })

    it('creates distinct line item in store when submitting different variants', async () => {
      // Existing item: Regular, Dingin, qty 1
      cartStore.getState().addItem({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        productId: 'prod-coffee-1',
        quantity: 1,
        selectedAddons: [],
        selectedVariants: { Suhu: 'Dingin', Ukuran: 'Regular' },
        subtotal: 20000,
        unitPrice: 20000,
      })

      const onOpenChange = vi.fn()
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={true}
            product={mockFnbProduct}
            onOpenChange={onOpenChange}
          />
        </StorefrontCartProvider>,
      )

      // Select distinct config: Large, Dingin, Ekstra Shot
      await page.getByRole('button', { name: /Large/i }).click()
      await page.getByRole('button', { name: /Ekstra Shot/i }).click()
      await page.getByRole('button', { name: 'Tambahkan ke Keranjang' }).click()

      const itemsAfterDistinct = cartStore.getState().items
      expect(itemsAfterDistinct).toHaveLength(2)
      expect(itemsAfterDistinct[0].quantity).toBe(1)
      expect(itemsAfterDistinct[1].quantity).toBe(1)
      expect(itemsAfterDistinct[1].subtotal).toBe(29000)
    })

    it('closes dialog when clicking the close button', async () => {
      const onOpenChange = vi.fn()

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={true}
            product={mockFnbProduct}
            onOpenChange={onOpenChange}
          />
        </StorefrontCartProvider>,
      )

      await page.getByRole('button', { name: 'Tutup dialog kustomisasi' }).click()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  // =========================================================================
  // 2. StorefrontCartDrawer
  // =========================================================================

  describe('storefrontCartDrawer', () => {
    it('does not render drawer when open is false', async () => {
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={false} tenant={mockStorefrontTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders clean empty cart state when cart contains zero items', async () => {
      const onOpenChange = vi.fn()

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer
            open={true}
            tenant={mockStorefrontTenant}
            onOpenChange={onOpenChange}
          />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByText('Keranjang Belanja Kosong')).toBeVisible()
      await expect.element(page.getByText(/Belum ada produk di keranjang Anda/)).toBeVisible()

      await page.getByRole('button', { name: 'Mulai Belanja' }).click()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('renders line items with variants, addons, notes, quantity, and total amount', async () => {
      cartStore.getState().addItem({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        notes: 'Less sugar',
        productId: 'prod-coffee-1',
        quantity: 2,
        selectedAddons: ['Ekstra Shot'],
        selectedVariants: { Suhu: 'Dingin', Ukuran: 'Large' },
        subtotal: 58000,
        unitPrice: 29000,
      })

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={true} tenant={mockStorefrontTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
      await expect.element(page.getByText('Ukuran: Large')).toBeVisible()
      await expect.element(page.getByText('Suhu: Dingin')).toBeVisible()
      await expect.element(page.getByText('Ekstra Shot')).toBeVisible()
      await expect.element(page.getByText('Less sugar')).toBeVisible()
      await expect.element(page.getByText('Rp 58.000').first()).toBeVisible()
      await expect.element(page.getByText('Rp 58.000').last()).toBeVisible()
      await expect.element(page.getByText('Total Pesanan')).toBeVisible()
    })

    it('line item steppers call updateQuantity and remove button calls removeItem', async () => {
      cartStore.getState().addItem({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        productId: 'prod-coffee-1',
        quantity: 2,
        selectedAddons: [],
        selectedVariants: { Ukuran: 'Regular' },
        subtotal: 40000,
        unitPrice: 20000,
      })

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={true} tenant={mockStorefrontTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      // Increment
      await page.getByRole('button', { name: 'Tambah kuantitas' }).click()
      expect(cartStore.getState().items[0].quantity).toBe(3)
      await expect.element(page.getByText('Rp 60.000').last()).toBeVisible()

      // Decrement
      await page.getByRole('button', { name: 'Kurangi kuantitas' }).click()
      expect(cartStore.getState().items[0].quantity).toBe(2)
      await expect.element(page.getByText('Rp 40.000').last()).toBeVisible()

      // Remove item
      await page.getByRole('button', { name: 'Hapus item' }).click()
      expect(cartStore.getState().items).toHaveLength(0)
      await expect.element(page.getByText('Keranjang Belanja Kosong')).toBeVisible()
    })

    it('displays validation errors on incomplete fields according to fulfillment mode', async () => {
      cartStore.getState().addItem({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        productId: 'prod-coffee-1',
        quantity: 1,
        subtotal: 20000,
      })

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={true} tenant={mockStorefrontTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      // In default DINE_IN mode with empty name and table number, submit checkout
      await page.getByRole('button', { name: 'Pesan via WhatsApp' }).click()

      await expect.element(page.getByText('Nama pemesan wajib diisi')).toBeVisible()
      await expect.element(page.getByText('Nomor meja wajib diisi')).toBeVisible()

      // Switch to DELIVERY mode
      await page.getByRole('button', { name: 'Delivery' }).click()
      await page.getByRole('button', { name: 'Pesan via WhatsApp' }).click()

      await expect.element(page.getByText('Nama pemesan wajib diisi')).toBeVisible()
      await expect.element(page.getByText('Alamat pengiriman lengkap wajib diisi')).toBeVisible()
    })

    it('compiles order and dispatches WhatsApp URL on valid checkout submission', async () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

      cartStore.getState().addItem({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        notes: 'Dingin tanpa es',
        productId: 'prod-coffee-1',
        quantity: 2,
        selectedAddons: ['Ekstra Shot'],
        selectedVariants: { Ukuran: 'Large' },
        subtotal: 58000,
        unitPrice: 29000,
      })

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={true} tenant={mockStorefrontTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await page.getByLabelText(/Nama Pemesan/i).fill('Ahmad Reza')
      await page.getByLabelText(/Nomor Meja/i).fill('Meja 12')

      await page.getByRole('button', { name: 'Pesan via WhatsApp' }).click()

      expect(windowOpenSpy).toHaveBeenCalledTimes(1)
      const calledUrl = windowOpenSpy.mock.calls[0][0] as string
      const calledTarget = windowOpenSpy.mock.calls[0][1] as string

      expect(calledTarget).toBe('_blank')
      expect(calledUrl).toContain('https://wa.me/6281234567890?text=')

      const decodedText = decodeURIComponent(calledUrl.split('?text=')[1])
      expect(decodedText).toContain('Halo Kopi Artisan Senopati, saya ingin memesan:')
      expect(decodedText).toContain('*Kopi Susu Gula Aren* (x2)')
      expect(decodedText).toContain('Ukuran: Large')
      expect(decodedText).toContain('Ekstra Shot')
      expect(decodedText).toContain('Dingin tanpa es')
      expect(decodedText).toContain('Total: Rp 58.000')
      expect(decodedText).toContain('Nama: Ahmad Reza')
      expect(decodedText).toContain('No. Meja: Meja 12')
    })

    it('includes pickup preferences in WhatsApp order summary when mode is TAKEAWAY', async () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

      cartStore.getState().addItem({
        name: 'Donat Cokelat',
        basePrice: 12000,
        productId: 'prod-snack-1',
        quantity: 2,
        subtotal: 24000,
        unitPrice: 12000,
      })

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={true} tenant={mockStorefrontTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await page.getByRole('button', { name: 'Takeaway' }).click()
      await page.getByLabelText(/Nama Pemesan/i).fill('Siti Nurhaliza')
      await page.getByLabelText(/Preferensi Pengambilan/i).fill('Ambil jam 15.00 sore')

      await page.getByRole('button', { name: 'Pesan via WhatsApp' }).click()

      expect(windowOpenSpy).toHaveBeenCalledTimes(1)
      const calledUrl = windowOpenSpy.mock.calls[0][0] as string
      const decodedText = decodeURIComponent(calledUrl.split('?text=')[1])
      expect(decodedText).toContain('- Metode: Takeaway (Bungkus)')
      expect(decodedText).toContain('- Preferensi: Ambil jam 15.00 sore')
    })
  })

  // =========================================================================
  // 3. MobileCartBar
  // =========================================================================

  describe('mobileCartBar', () => {
    it('does not render when cart item count is zero', async () => {
      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <MobileCartBar onOpenCart={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect
        .element(page.getByRole('button', { name: /Buka keranjang belanja/i }))
        .not.toBeInTheDocument()
    })

    it('renders sticky bar with item count and formatted subtotal when cart has items', async () => {
      cartStore.getState().addItem({
        name: 'Donat Cokelat',
        basePrice: 15000,
        productId: 'prod-1',
        quantity: 3,
        subtotal: 45000,
      })

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <MobileCartBar onOpenCart={vi.fn()} />
        </StorefrontCartProvider>,
      )

      await expect.element(page.getByText('3 produk')).toBeVisible()
      await expect.element(page.getByText('Rp 45.000')).toBeVisible()
      await expect.element(page.getByText('Lihat Keranjang')).toBeVisible()
    })

    it('triggers onOpenCart callback when user clicks the bar button', async () => {
      const onOpenCart = vi.fn()

      cartStore.getState().addItem({
        name: 'Item Test',
        basePrice: 20000,
        productId: 'prod-1',
        quantity: 1,
        subtotal: 20000,
      })

      render(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <MobileCartBar onOpenCart={onOpenCart} />
        </StorefrontCartProvider>,
      )

      await page.getByRole('button', { name: /Buka keranjang belanja/i }).click()
      expect(onOpenCart).toHaveBeenCalledTimes(1)
    })
  })
})
