import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import {
  mockFnbProduct,
  mockRetailProduct,
  mockStorefrontTenant,
} from '@/components/storefront/__fixtures__/storefront-fixtures'
import { StorefrontClientIslands } from '@/components/storefront/client-islands'
import {
  FNB_FULFILLMENT_MODES,
  resolveFulfillmentModes,
  RETAIL_FULFILLMENT_MODES,
} from '@/lib/storefront/fulfillment'

function delay(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>()
  setTimeout(resolve, ms)
  return promise
}

describe('StorefrontClientIslands Browser Mode Tests', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  // =========================================================================
  // 1. Fulfillment Mode Resolution
  // =========================================================================

  describe('resolveFulfillmentModes presentation helper', () => {
    it('resolves F&B default modes [DINE_IN, TAKEAWAY, DELIVERY] for cafe/restaurant categories', () => {
      expect(resolveFulfillmentModes('Cafe & Coffee Shop')).toEqual(FNB_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Restoran Padang')).toEqual(FNB_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Warung Kopi')).toEqual(FNB_FULFILLMENT_MODES)
    })

    it('resolves Retail default modes [PICKUP, DELIVERY] for retail categories', () => {
      expect(resolveFulfillmentModes('Fashion & Retail')).toEqual(RETAIL_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Clothing Store')).toEqual(RETAIL_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Toko Kelontong')).toEqual(RETAIL_FULFILLMENT_MODES)
    })

    it('returns custom fulfillment modes when configured in themeConfig.fulfillmentModes', () => {
      const customModes = ['TAKEAWAY', 'DELIVERY'] as const
      expect(
        resolveFulfillmentModes('Cafe & Coffee Shop', {
          fulfillmentModes: customModes as unknown as string[],
        }),
      ).toEqual(customModes)
    })
  })

  // =========================================================================
  // 2. Client Islands Mounting and Event Coordination
  // =========================================================================

  describe('storefrontClientIslands Mounting & Interactivity', () => {
    it('mounts without crashing and hides islands when cart is empty', async () => {
      render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
      await expect
        .element(page.getByRole('button', { name: /Buka keranjang belanja/i }))
        .not.toBeInTheDocument()
    })

    it('shows MobileCartBar when growfin:add-to-cart event is dispatched', async () => {
      render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

      // Allow React 19 useEffect listeners to attach
      await delay(50)

      window.dispatchEvent(
        new CustomEvent('growfin:add-to-cart', {
          detail: mockRetailProduct,
        }),
      )

      await expect.element(page.getByText('1 produk')).toBeVisible()
      await expect.element(page.getByText('Rp 185.000')).toBeVisible()
      await expect.element(page.getByText('Lihat Keranjang')).toBeVisible()
    })

    it('opens cart drawer when clicking MobileCartBar and displays fulfillment options', async () => {
      render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

      await delay(50)

      window.dispatchEvent(
        new CustomEvent('growfin:add-to-cart', {
          detail: mockRetailProduct,
        }),
      )

      await page.getByRole('button', { name: /Buka keranjang belanja/i }).click()

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByText('Keranjang Belanja')).toBeVisible()
      await expect.element(page.getByText('Overdose Boxy Tee')).toBeVisible()

      // Verifies fulfillment options rendered in DOM
      await expect.element(page.getByRole('button', { name: 'Dine In' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Takeaway' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Pickup' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Delivery' })).toBeVisible()
    })

    it('opens product customization dialog when growfin:select-product is dispatched', async () => {
      render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

      await delay(50)

      window.dispatchEvent(
        new CustomEvent('growfin:select-product', {
          detail: mockFnbProduct,
        }),
      )

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByRole('heading', { name: 'Kopi Susu Gula Aren' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: /Large/i })).toBeVisible()

      // Select variant and add to cart
      await page.getByRole('button', { name: /Large/i }).click()
      await page.getByRole('button', { name: 'Tambahkan ke Keranjang' }).click()

      // Dialog should close
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()

      // MobileCartBar reflects added item
      await expect.element(page.getByText('1 produk')).toBeVisible()
      await expect.element(page.getByText('Rp 25.000')).toBeVisible()
    })

    it('opens cart drawer when growfin:open-cart is dispatched', async () => {
      render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

      await delay(50)

      window.dispatchEvent(new CustomEvent('growfin:open-cart'))

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByText('Keranjang Belanja Kosong')).toBeVisible()
    })

    it('opens cart drawer when clicking an external element with data-open-cart', async () => {
      render(
        <div>
          <button data-open-cart type="button">
            Keranjang
          </button>
          <StorefrontClientIslands tenant={mockStorefrontTenant} />
        </div>,
      )

      await page.getByRole('button', { name: 'Keranjang' }).click()

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByText('Keranjang Belanja')).toBeVisible()
    })

    it('renders retail fulfillment modes [Pickup, Delivery] for retail tenant in DOM', async () => {
      const retailTenant = {
        id: 'retail-tenant-456',
        name: 'Boutique Cantik',
        category: 'Fashion & Retail',
        phone: '081298765432',
        brandingContent: {
          waNumber: '6281298765432',
        },
      }

      render(<StorefrontClientIslands tenant={retailTenant} />)

      await delay(50)

      // Add item to cart and open drawer
      window.dispatchEvent(
        new CustomEvent('growfin:add-to-cart', {
          detail: mockRetailProduct,
        }),
      )

      await page.getByRole('button', { name: /Buka keranjang belanja/i }).click()

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Pickup' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Delivery' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Dine In' })).not.toBeInTheDocument()
    })

    it('handles fallback tenantId cleanly when tenant.id is omitted', async () => {
      const { id: _, ...tenantWithoutId } = mockStorefrontTenant

      render(<StorefrontClientIslands tenant={tenantWithoutId} />)

      await delay(50)

      window.dispatchEvent(
        new CustomEvent('growfin:add-to-cart', {
          detail: mockRetailProduct,
        }),
      )

      await expect.element(page.getByText('1 produk')).toBeVisible()
    })
  })
})
