import type { ReactElement, ReactNode } from 'react'

import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { CartStore } from '@/lib/storefront/cart'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  componentRenderCache,
  MobileCartBar,
  ProductCustomizationDialog,
  StorefrontCartDrawer,
} from '@/components/storefront/cart'
import { createCartStore, formatCurrency, StorefrontCartProvider } from '@/lib/storefront/cart'

// ---------------------------------------------------------------------------
// Test Fixtures
// ---------------------------------------------------------------------------

const mockProductWithVariants: ProductWithVariants = {
  id: 'prod-coffee-1',
  name: 'Kopi Susu Gula Aren',
  basePrice: 20000,
  description: 'Espresso dengan susu segar dan gula aren asli',
  imageUrl: 'https://images.unsplash.com/photo-coffee',
  originalPrice: 25000, // 20% discount
  addons: [
    { id: 'addon-shot', name: 'Ekstra Shot', price: 4000 },
    { id: 'addon-jelly', name: 'Jelly Karamel', price: 3000 },
  ],
  imageGallery: [
    'https://images.unsplash.com/photo-coffee-1',
    'https://images.unsplash.com/photo-coffee-2',
  ],
  variants: [
    {
      id: 'var-size',
      name: 'Ukuran',
      required: true,
      options: [
        { id: 'opt-reg', label: 'Regular', priceModifier: 0 },
        { id: 'opt-lrg', label: 'Large', priceModifier: 5000 },
      ],
    },
    {
      id: 'var-temp',
      name: 'Suhu',
      required: true,
      options: [
        { id: 'opt-cold', label: 'Dingin', priceModifier: 0 },
        { id: 'opt-hot', label: 'Panas', priceModifier: 0 },
      ],
    },
  ],
}

const mockSimpleProduct: ProductWithVariants = {
  id: 'prod-snack-1',
  name: 'Donat Cokelat',
  basePrice: 12000,
  description: 'Donat kentang empuk dengan meses cokelat tebal',
  imageUrl: 'https://images.unsplash.com/photo-donut',
  originalPrice: null,
}

const mockTenant = {
  name: 'Kopi Artisan Senopati',
  fulfillmentModes: ['DINE_IN', 'TAKEAWAY', 'PICKUP', 'DELIVERY'] as const,
  phone: '081234567890',
  waNumber: '081234567890',
}

// ---------------------------------------------------------------------------
// Element traversal helper
// ---------------------------------------------------------------------------

interface SlotElementProps {
  'data-slot'?: string
  children?: ReactNode
  onClick?: (event: unknown) => void
  onChange?: (event: unknown) => void
  onSubmit?: (event: unknown) => void
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
  const cached = componentRenderCache.get(element.props)
  if (cached) {
    const found = findElementBySlot(cached, slot)
    if (found) return found
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Storefront Client Islands (Ticket 05)', () => {
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
    it('returns null when open is false or product is null', () => {
      const markupClosed = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={false}
            product={mockProductWithVariants}
            onOpenChange={vi.fn()}
          />
        </StorefrontCartProvider>,
      )
      expect(markupClosed).toBe('')

      const markupNoProduct = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog open={true} product={null} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )
      expect(markupNoProduct).toBe('')
    })

    it('renders product imagery, title, description, base price in IDR, and discount badge', () => {
      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={true}
            product={mockProductWithVariants}
            onOpenChange={vi.fn()}
          />
        </StorefrontCartProvider>,
      )

      expect(markup).toContain('Kopi Susu Gula Aren')
      expect(markup).toContain('Espresso dengan susu segar dan gula aren asli')
      expect(markup).toContain('Rp 20.000') // base price
      expect(markup).toContain('Rp 25.000') // strikethrough original price
      expect(markup).toContain('-20%') // discount badge
      expect(markup).toContain('https://images.unsplash.com/photo-coffee')
    })

    it('renders variant groups, option choices, and optional addons', () => {
      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            open={true}
            product={mockProductWithVariants}
            onOpenChange={vi.fn()}
          />
        </StorefrontCartProvider>,
      )

      expect(markup).toContain('Ukuran')
      expect(markup).toContain('Regular')
      expect(markup).toContain('Large')
      expect(markup).toContain('+Rp 5.000')

      expect(markup).toContain('Suhu')
      expect(markup).toContain('Dingin')
      expect(markup).toContain('Panas')

      expect(markup).toContain('Ekstra Shot')
      expect(markup).toContain('+Rp 4.000')
      expect(markup).toContain('Jelly Karamel')
      expect(markup).toContain('+Rp 3.000')
    })

    it('calculates live subtotal accurately with variant modifiers, addons, and quantity', () => {
      // Base: 20000 + Large (5000) + Ekstra Shot (4000) = 29000 * 2 = 58000
      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ProductCustomizationDialog
            initialAddons={['Ekstra Shot']}
            initialQuantity={2}
            initialVariants={{ Suhu: 'Dingin', Ukuran: 'Large' }}
            open={true}
            product={mockProductWithVariants}
            onOpenChange={vi.fn()}
          />
        </StorefrontCartProvider>,
      )

      expect(markup).toContain(formatCurrency(58000))
    })

    it('customizes simple product without variants or addons', () => {
      const onOpenChange = vi.fn()
      let rendered: ReactElement | null = null
      function SimpleDialogCapture() {
        rendered = (
          <ProductCustomizationDialog
            initialQuantity={3}
            open={true}
            product={mockSimpleProduct}
            onOpenChange={onOpenChange}
          />
        )
        return rendered
      }

      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <SimpleDialogCapture />
        </StorefrontCartProvider>,
      )

      expect(markup).toContain('Donat Cokelat')
      expect(markup).toContain(formatCurrency(36000)) // 12000 * 3

      const submitBtn = findElementBySlot(rendered, 'customization-submit-button')
      submitBtn?.props?.onClick?.({ preventDefault: vi.fn() })

      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(cartStore.getState().items[0]).toMatchObject({
        name: 'Donat Cokelat',
        basePrice: 12000,
        productId: 'prod-snack-1',
        quantity: 3,
        subtotal: 36000,
      })
    })

    it('dispatches addItem to store and closes dialog on submission', () => {
      const onOpenChange = vi.fn()

      let rendered: ReactElement | null = null
      function DialogCapture() {
        rendered = (
          <ProductCustomizationDialog
            initialAddons={['Ekstra Shot']}
            initialNotes="Kurangi es batu"
            initialQuantity={2}
            initialVariants={{ Suhu: 'Dingin', Ukuran: 'Large' }}
            open={true}
            product={mockProductWithVariants}
            onOpenChange={onOpenChange}
          />
        )
        return rendered
      }

      renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <DialogCapture />
        </StorefrontCartProvider>,
      )

      const submitBtn = findElementBySlot(rendered, 'customization-submit-button')
      expect(submitBtn).toBeDefined()
      submitBtn?.props?.onClick?.({ preventDefault: vi.fn() })

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
        subtotal: 58000, // (20000 + 5000 + 4000) * 2
        unitPrice: 29000,
        selectedVariants: {
          Suhu: 'Dingin',
          Ukuran: 'Large',
        },
      })
    })

    it('stacks identical configurations in store while separating distinct configurations', () => {
      // First add: Regular, Dingin, no addons, qty 1
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

      // Add identical configuration: qty 2 -> should stack to 3
      let renderedIdentical: ReactElement | null = null
      function IdenticalCapture() {
        renderedIdentical = (
          <ProductCustomizationDialog
            initialAddons={[]}
            initialQuantity={2}
            initialVariants={{ Suhu: 'Dingin', Ukuran: 'Regular' }}
            open={true}
            product={mockProductWithVariants}
            onOpenChange={vi.fn()}
          />
        )
        return renderedIdentical
      }

      renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <IdenticalCapture />
        </StorefrontCartProvider>,
      )

      const submitIdentical = findElementBySlot(renderedIdentical, 'customization-submit-button')
      submitIdentical?.props?.onClick?.({ preventDefault: vi.fn() })

      const itemsAfterStack = cartStore.getState().items
      expect(itemsAfterStack).toHaveLength(1)
      expect(itemsAfterStack[0].quantity).toBe(3)
      expect(itemsAfterStack[0].subtotal).toBe(60000)

      // Add distinct configuration: Large, Dingin, Ekstra Shot -> should create separate line item
      let renderedDistinct: ReactElement | null = null
      function DistinctCapture() {
        renderedDistinct = (
          <ProductCustomizationDialog
            initialAddons={['Ekstra Shot']}
            initialQuantity={1}
            initialVariants={{ Suhu: 'Dingin', Ukuran: 'Large' }}
            open={true}
            product={mockProductWithVariants}
            onOpenChange={vi.fn()}
          />
        )
        return renderedDistinct
      }

      renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <DistinctCapture />
        </StorefrontCartProvider>,
      )

      const submitDistinct = findElementBySlot(renderedDistinct, 'customization-submit-button')
      submitDistinct?.props?.onClick?.({ preventDefault: vi.fn() })

      const itemsAfterDistinct = cartStore.getState().items
      expect(itemsAfterDistinct).toHaveLength(2)
      expect(itemsAfterDistinct[0].quantity).toBe(3)
      expect(itemsAfterDistinct[1].quantity).toBe(1)
      expect(itemsAfterDistinct[1].subtotal).toBe(29000)
    })
  })

  // =========================================================================
  // 2. StorefrontCartDrawer
  // =========================================================================

  describe('storefrontCartDrawer', () => {
    it('returns null when open is false', () => {
      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={false} tenant={mockTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )
      expect(markup).toBe('')
    })

    it('renders clean empty cart state when cart contains zero items', () => {
      const onOpenChange = vi.fn()
      let rendered: ReactElement | null = null
      function DrawerCapture() {
        rendered = (
          <StorefrontCartDrawer open={true} tenant={mockTenant} onOpenChange={onOpenChange} />
        )
        return rendered
      }

      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <DrawerCapture />
        </StorefrontCartProvider>,
      )

      expect(markup).toContain('Keranjang Belanja Kosong')
      expect(markup).toContain('Belum ada produk')

      const closeEmptyBtn = findElementBySlot(rendered, 'cart-empty-close')
      expect(closeEmptyBtn).toBeDefined()
      closeEmptyBtn?.props?.onClick?.({ preventDefault: vi.fn() })
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('renders line items with variants, addons, notes, quantity, and total amount', () => {
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

      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer open={true} tenant={mockTenant} onOpenChange={vi.fn()} />
        </StorefrontCartProvider>,
      )

      expect(markup).toContain('Kopi Susu Gula Aren')
      expect(markup).toContain('Ukuran: Large')
      expect(markup).toContain('Suhu: Dingin')
      expect(markup).toContain('Ekstra Shot')
      expect(markup).toContain('Less sugar')
      expect(markup).toContain('Rp 58.000') // item subtotal
      expect(markup).toContain('2') // item quantity
    })

    it('line item steppers call updateQuantity and remove button calls removeItem', () => {
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

      let rendered: ReactElement | null = null
      function DrawerCapture() {
        rendered = <StorefrontCartDrawer open={true} tenant={mockTenant} onOpenChange={vi.fn()} />
        return rendered
      }

      renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <DrawerCapture />
        </StorefrontCartProvider>,
      )

      const incBtn = findElementBySlot(rendered, 'cart-item-increment')
      expect(incBtn).toBeDefined()
      incBtn?.props?.onClick?.({ preventDefault: vi.fn() })
      expect(cartStore.getState().items[0].quantity).toBe(3)

      const decBtn = findElementBySlot(rendered, 'cart-item-decrement')
      expect(decBtn).toBeDefined()
      decBtn?.props?.onClick?.({ preventDefault: vi.fn() })
      expect(cartStore.getState().items[0].quantity).toBe(2)

      const removeBtn = findElementBySlot(rendered, 'cart-item-remove')
      expect(removeBtn).toBeDefined()
      removeBtn?.props?.onClick?.({ preventDefault: vi.fn() })
      expect(cartStore.getState().items).toHaveLength(0)
    })

    it('displays validation errors on incomplete fields according to fulfillment mode', () => {
      cartStore.getState().addItem({
        name: 'Kopi Susu Gula Aren',
        basePrice: 20000,
        productId: 'prod-coffee-1',
        quantity: 1,
        subtotal: 20000,
      })

      // Test DINE_IN with missing fields
      let renderedDineIn: ReactElement | null = null
      function DineInCapture() {
        renderedDineIn = (
          <StorefrontCartDrawer
            initialCustomerName=""
            initialFulfillmentMode="DINE_IN"
            initialTableNumber=""
            open={true}
            tenant={mockTenant}
            onOpenChange={vi.fn()}
          />
        )
        return renderedDineIn
      }

      renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <DineInCapture />
        </StorefrontCartProvider>,
      )

      const checkoutBtn = findElementBySlot(renderedDineIn, 'cart-checkout-button')
      expect(checkoutBtn).toBeDefined()
      checkoutBtn?.props?.onClick?.({ preventDefault: vi.fn() })

      // Static markup rendered with initial validation error state
      const markupDineInErrors = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer
            initialCustomerName=""
            initialFulfillmentMode="DINE_IN"
            initialTableNumber=""
            open={true}
            tenant={mockTenant}
            onOpenChange={vi.fn()}
            initialErrors={{
              customerName: 'Nama pemesan wajib diisi',
              tableNumber: 'Nomor meja wajib diisi',
            }}
          />
        </StorefrontCartProvider>,
      )

      expect(markupDineInErrors).toContain('Nomor meja wajib diisi')
      expect(markupDineInErrors).toContain('Nama pemesan wajib diisi')

      // Test DELIVERY with missing address
      const markupDeliveryErrors = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <StorefrontCartDrawer
            initialAddress=""
            initialCustomerName="Budi"
            initialFulfillmentMode="DELIVERY"
            open={true}
            tenant={mockTenant}
            onOpenChange={vi.fn()}
            initialErrors={{
              address: 'Alamat pengiriman lengkap wajib diisi',
            }}
          />
        </StorefrontCartProvider>,
      )

      expect(markupDeliveryErrors).toContain('Alamat pengiriman lengkap wajib diisi')
    })

    it('compiles order and dispatches WhatsApp URL on valid checkout submission', () => {
      const windowOpenSpy = vi.fn()
      globalThis.window = {
        open: windowOpenSpy,
      } as unknown as Window & typeof globalThis

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

      let rendered: ReactElement | null = null
      function ValidCheckoutCapture() {
        rendered = (
          <StorefrontCartDrawer
            initialCustomerName="Ahmad Reza"
            initialFulfillmentMode="DINE_IN"
            initialTableNumber="Meja 12"
            open={true}
            tenant={mockTenant}
            onOpenChange={vi.fn()}
          />
        )
        return rendered
      }

      renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <ValidCheckoutCapture />
        </StorefrontCartProvider>,
      )

      const checkoutBtn = findElementBySlot(rendered, 'cart-checkout-button')
      expect(checkoutBtn).toBeDefined()
      checkoutBtn?.props?.onClick?.({ preventDefault: vi.fn() })

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
  })

  // =========================================================================
  // 3. MobileCartBar
  // =========================================================================

  describe('mobileCartBar', () => {
    it('returns null when cart item count is zero', () => {
      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <MobileCartBar onOpenCart={vi.fn()} />
        </StorefrontCartProvider>,
      )

      expect(markup).toBe('')
    })

    it('renders sticky dock with item count and formatted subtotal when cart has items', () => {
      cartStore.getState().addItem({
        name: 'Donat Cokelat',
        basePrice: 15000,
        productId: 'prod-1',
        quantity: 3,
        subtotal: 45000,
      })

      const markup = renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <MobileCartBar onOpenCart={vi.fn()} />
        </StorefrontCartProvider>,
      )

      expect(markup).toContain('3') // count
      expect(markup).toContain('Rp 45.000') // total
      expect(markup).toContain('fixed')
      expect(markup).toContain('bottom-0')
    })

    it('triggers onOpenCart callback when user clicks the bar or button', () => {
      const onOpenCart = vi.fn()

      cartStore.getState().addItem({
        name: 'Item Test',
        basePrice: 20000,
        productId: 'prod-1',
        quantity: 1,
        subtotal: 20000,
      })

      let rendered: ReactElement | null = null
      function MobileBarCapture() {
        rendered = <MobileCartBar onOpenCart={onOpenCart} />
        return rendered
      }

      renderToStaticMarkup(
        <StorefrontCartProvider initialStore={cartStore} tenantId="tenant-test">
          <MobileBarCapture />
        </StorefrontCartProvider>,
      )

      const openButton = findElementBySlot(rendered, 'mobile-cart-open')
      expect(openButton).toBeDefined()
      openButton?.props?.onClick?.({ preventDefault: vi.fn() })

      expect(onOpenCart).toHaveBeenCalledTimes(1)
    })
  })
})
