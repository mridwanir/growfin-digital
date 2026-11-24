import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import {
  mockFnbProduct,
  mockRetailProduct,
  mockStorefrontTenant,
} from '../__fixtures__/storefront-fixtures'
import { StorefrontClientIslands } from './client-islands'

describe('StorefrontClientIslands Browser Mode Tests', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  // =========================================================================
  // 1. Fulfillment Mode DOM Presentation
  // =========================================================================

  describe('fulfillment modes presentation in cart drawer DOM', () => {
    it('renders F&B default modes [Dine In, Takeaway, Delivery] for cafe/restaurant categories in DOM', async () => {
      const fnbTenant = {
        ...mockStorefrontTenant,
        category: 'Cafe & Coffee Shop',
        fulfillmentModes: undefined,
        themeConfig: undefined,
      }

      await render(<StorefrontClientIslands tenant={fnbTenant} />)

      window.dispatchEvent(
        new CustomEvent('growfin:add-to-cart', {
          detail: mockRetailProduct,
        }),
      )

      await page.getByRole('button', { name: /Buka keranjang belanja/i }).click()

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Dine In' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Takeaway' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Delivery' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Pickup' })).not.toBeInTheDocument()
    })

    it('renders Retail default modes [Pickup, Delivery] for retail categories in DOM', async () => {
      const retailTenant = {
        ...mockStorefrontTenant,
        category: 'Fashion & Retail',
        fulfillmentModes: undefined,
        themeConfig: undefined,
      }

      await render(<StorefrontClientIslands tenant={retailTenant} />)

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
      await expect.element(page.getByRole('button', { name: 'Takeaway' })).not.toBeInTheDocument()
    })

    it('renders custom fulfillment modes when configured in themeConfig.fulfillmentModes', async () => {
      const customTenant = {
        ...mockStorefrontTenant,
        category: 'Cafe & Coffee Shop',
        fulfillmentModes: undefined,
        themeConfig: {
          fulfillmentModes: ['TAKEAWAY', 'DELIVERY'],
        },
      }

      await render(<StorefrontClientIslands tenant={customTenant} />)

      window.dispatchEvent(
        new CustomEvent('growfin:add-to-cart', {
          detail: mockRetailProduct,
        }),
      )

      await page.getByRole('button', { name: /Buka keranjang belanja/i }).click()

      await expect.element(page.getByRole('dialog')).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Takeaway' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Delivery' })).toBeVisible()
      await expect.element(page.getByRole('button', { name: 'Dine In' })).not.toBeInTheDocument()
      await expect.element(page.getByRole('button', { name: 'Pickup' })).not.toBeInTheDocument()
    })
  })

  // =========================================================================
  // 2. Client Islands Mounting and Event Coordination
  // =========================================================================

  describe('storefrontClientIslands Mounting & Interactivity', () => {
    it('mounts without crashing and hides islands when cart is empty', async () => {
      await render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
      await expect
        .element(page.getByRole('button', { name: /Buka keranjang belanja/i }))
        .not.toBeInTheDocument()
    })

    it('shows MobileCartBar when growfin:add-to-cart event is dispatched', async () => {
      await render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

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
      await render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

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
      await render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

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
      await render(<StorefrontClientIslands tenant={mockStorefrontTenant} />)

      await vi.waitFor(async () => {
        window.dispatchEvent(new CustomEvent('growfin:open-cart'))
        await expect.element(page.getByRole('dialog')).toBeVisible()
      })

      await expect.element(page.getByText('Keranjang Belanja Kosong')).toBeVisible()
    })

    it('opens cart drawer when clicking an external element with data-open-cart', async () => {
      await render(
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

      await render(<StorefrontClientIslands tenant={retailTenant} />)

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

      await render(<StorefrontClientIslands tenant={tenantWithoutId} />)

      window.dispatchEvent(
        new CustomEvent('growfin:add-to-cart', {
          detail: mockRetailProduct,
        }),
      )

      await expect.element(page.getByText('1 produk')).toBeVisible()
    })
  })
})
