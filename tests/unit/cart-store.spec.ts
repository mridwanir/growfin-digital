import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  createCartStore,
  StorefrontCartProvider,
  useCartActions,
  useCartItemCount,
  useCartItems,
  useCartStore,
  useCartTotal,
} from '@/lib/storefront/cart'

// In-memory mock storage implementation for localStorage testing in Node
class MockLocalStorage {
  private store: Map<string, string> = new Map()

  get length(): number {
    return this.store.size
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }
}

describe('Tenant-Scoped Zustand Cart Store & Island Provider (Ticket 03)', () => {
  let mockStorage: MockLocalStorage

  beforeEach(() => {
    mockStorage = new MockLocalStorage()
    // Polyfill global localStorage for the test run
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: mockStorage,
      writable: true,
    })
  })

  afterEach(() => {
    mockStorage.clear()
  })

  describe('createCartStore - State & Line Item Operations', () => {
    it('initializes with empty items and assigned tenantId', () => {
      const store = createCartStore('tenant-kopi-01')
      const state = store.getState()

      expect(state.tenantId).toBe('tenant-kopi-01')
      expect(state.items).toEqual([])
    })

    it('adds a simple item without variants or addons', () => {
      const store = createCartStore('tenant-kopi-01')

      store.getState().addItem({
        name: 'Single Espresso',
        basePrice: 18000,
        productId: 'prod-espresso',
        quantity: 1,
      })

      const items = store.getState().items
      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        name: 'Single Espresso',
        basePrice: 18000,
        hash: 'prod-espresso::variants=[]::addons=[]',
        productId: 'prod-espresso',
        quantity: 1,
        subtotal: 18000,
      })
    })

    it('adds an item with variants, addons, and notes with accurate subtotal', () => {
      const store = createCartStore('tenant-kopi-01')

      store.getState().addItem({
        name: 'Caffe Latte',
        basePrice: 24000,
        notes: 'Less sweet please',
        productId: 'prod-latte',
        quantity: 2,
        selectedAddons: ['Extra Shot'],
        selectedVariants: { Milk: 'Oat', Size: 'Large' },
        subtotal: 68000, // (24000 + 5000 + 5000) * 2
      })

      const item = store.getState().items[0]
      expect(item.quantity).toBe(2)
      expect(item.subtotal).toBe(68000)
      expect(item.notes).toBe('Less sweet please')
      expect(item.hash).toBe('prod-latte::variants=[Milk:Oat,Size:Large]::addons=[Extra Shot]')
    })

    it('stacks quantity and recalculates subtotal when item hash matches', () => {
      const store = createCartStore('tenant-kopi-01')

      // First add
      store.getState().addItem({
        name: 'Iced Americano',
        basePrice: 20000,
        productId: 'prod-americano',
        quantity: 1,
        selectedVariants: { Ice: 'Normal' },
      })

      expect(store.getState().items).toHaveLength(1)
      expect(store.getState().items[0].quantity).toBe(1)
      expect(store.getState().items[0].subtotal).toBe(20000)

      // Add identical item with same variants
      store.getState().addItem({
        name: 'Iced Americano',
        basePrice: 20000,
        productId: 'prod-americano',
        quantity: 2,
        selectedVariants: { Ice: 'Normal' },
      })

      const items = store.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(3)
      expect(items[0].subtotal).toBe(60000)
    })

    it('creates distinct line items when item variants or addons differ', () => {
      const store = createCartStore('tenant-kopi-01')

      // Item 1: Regular size
      store.getState().addItem({
        name: 'Cappuccino',
        basePrice: 22000,
        productId: 'prod-cappuccino',
        quantity: 1,
        selectedVariants: { Size: 'Regular' },
      })

      // Item 2: Large size
      store.getState().addItem({
        name: 'Cappuccino',
        basePrice: 22000,
        productId: 'prod-cappuccino',
        quantity: 1,
        selectedVariants: { Size: 'Large' },
        subtotal: 27000,
      })

      const items = store.getState().items
      expect(items).toHaveLength(2)
      expect(items[0].hash).not.toBe(items[1].hash)
      expect(items[0].quantity).toBe(1)
      expect(items[1].quantity).toBe(1)
    })

    it('updates quantity and recalculates subtotal for existing item', () => {
      const store = createCartStore('tenant-kopi-01')

      store.getState().addItem({
        name: 'Almond Croissant',
        basePrice: 25000,
        productId: 'prod-croissant',
        quantity: 1,
      })

      const hash = store.getState().items[0].hash!

      // Increment to 4
      store.getState().updateQuantity(hash, 4)
      expect(store.getState().items[0].quantity).toBe(4)
      expect(store.getState().items[0].subtotal).toBe(100000)

      // Decrement to 2
      store.getState().updateQuantity(hash, 2)
      expect(store.getState().items[0].quantity).toBe(2)
      expect(store.getState().items[0].subtotal).toBe(50000)
    })

    it('removes item when quantity is updated to zero or negative', () => {
      const store = createCartStore('tenant-kopi-01')

      store.getState().addItem({
        name: 'Earl Grey Tea',
        basePrice: 15000,
        productId: 'prod-tea',
        quantity: 1,
      })

      const hash = store.getState().items[0].hash!

      store.getState().updateQuantity(hash, 0)
      expect(store.getState().items).toHaveLength(0)

      // Re-add and test negative quantity
      store.getState().addItem({
        name: 'Earl Grey Tea',
        basePrice: 15000,
        productId: 'prod-tea',
        quantity: 1,
      })

      store.getState().updateQuantity(hash, -1)
      expect(store.getState().items).toHaveLength(0)
    })

    it('explicitly removes item by hash using removeItem', () => {
      const store = createCartStore('tenant-kopi-01')

      store.getState().addItem({
        name: 'Chocolate Chip Cookie',
        basePrice: 12000,
        productId: 'prod-cookie',
        quantity: 2,
      })

      const hash = store.getState().items[0].hash!
      store.getState().removeItem(hash)

      expect(store.getState().items).toHaveLength(0)
    })

    it('clears all items using clearCart', () => {
      const store = createCartStore('tenant-kopi-01')

      store.getState().addItem({
        name: 'Item 1',
        basePrice: 10000,
        productId: 'prod-1',
        quantity: 1,
      })
      store.getState().addItem({
        name: 'Item 2',
        basePrice: 20000,
        productId: 'prod-2',
        quantity: 2,
      })

      expect(store.getState().items).toHaveLength(2)

      store.getState().clearCart()
      expect(store.getState().items).toHaveLength(0)
    })
  })

  describe('storage Persistence & Multi-Tenant Isolation', () => {
    it('persists cart state to localStorage under growfin_cart_<tenantId>', () => {
      const store = createCartStore('tenant-resto-42')

      store.getState().addItem({
        name: 'Nasi Goreng Spesial',
        basePrice: 35000,
        productId: 'prod-nasi-goreng',
        quantity: 2,
      })

      const storedRaw = mockStorage.getItem('growfin_cart_tenant-resto-42')
      expect(storedRaw).not.toBeNull()

      const parsed = JSON.parse(storedRaw!)
      expect(parsed.version).toBe(1)
      expect(parsed.state.tenantId).toBe('tenant-resto-42')
      expect(parsed.state.items).toHaveLength(1)
      expect(parsed.state.items[0].name).toBe('Nasi Goreng Spesial')
      expect(parsed.state.items[0].quantity).toBe(2)
    })

    it('rehydrates persisted state when new store instance is created with same tenantId', () => {
      // First instance adds items
      const store1 = createCartStore('tenant-isolated')
      store1.getState().addItem({
        name: 'Sate Ayam',
        basePrice: 30000,
        productId: 'prod-sate',
        quantity: 3,
      })

      // Second instance for same tenant should hydrate from localStorage
      const store2 = createCartStore('tenant-isolated')
      expect(store2.getState().items).toHaveLength(1)
      expect(store2.getState().items[0].name).toBe('Sate Ayam')
      expect(store2.getState().items[0].quantity).toBe(3)
      expect(store2.getState().items[0].subtotal).toBe(90000)
    })

    it('guarantees complete isolation between different tenant stores', () => {
      const storeA = createCartStore('merchant-alpha')
      const storeB = createCartStore('merchant-beta')

      storeA.getState().addItem({
        name: 'Alpha Product',
        basePrice: 10000,
        productId: 'prod-a',
        quantity: 2,
      })

      storeB.getState().addItem({
        name: 'Beta Product',
        basePrice: 50000,
        productId: 'prod-b',
        quantity: 1,
      })

      // In-memory state isolation
      expect(storeA.getState().items).toHaveLength(1)
      expect(storeA.getState().items[0].name).toBe('Alpha Product')

      expect(storeB.getState().items).toHaveLength(1)
      expect(storeB.getState().items[0].name).toBe('Beta Product')

      // Key isolation in localStorage
      expect(mockStorage.getItem('growfin_cart_merchant-alpha')).toContain('Alpha Product')
      expect(mockStorage.getItem('growfin_cart_merchant-alpha')).not.toContain('Beta Product')

      expect(mockStorage.getItem('growfin_cart_merchant-beta')).toContain('Beta Product')
      expect(mockStorage.getItem('growfin_cart_merchant-beta')).not.toContain('Alpha Product')
    })
  })

  describe('hydration Validation & Corrupted Storage Recovery', () => {
    it('gracefully recovers to empty items when storage has malformed JSON', () => {
      mockStorage.setItem('growfin_cart_tenant-corrupt-1', 'not valid json {{{')

      expect(() => {
        const store = createCartStore('tenant-corrupt-1')
        expect(store.getState().items).toEqual([])
      }).not.toThrow()
    })

    it('gracefully recovers to empty items when state in storage is invalid schema', () => {
      mockStorage.setItem(
        'growfin_cart_tenant-corrupt-2',
        JSON.stringify({
          version: 1,
          state: {
            items: 'corrupted-non-array-string',
            tenantId: 'tenant-corrupt-2',
          },
        }),
      )

      const store = createCartStore('tenant-corrupt-2')
      expect(store.getState().items).toEqual([])
    })

    it('gracefully recovers to empty items when line items are missing required fields', () => {
      mockStorage.setItem(
        'growfin_cart_tenant-corrupt-3',
        JSON.stringify({
          version: 1,
          state: {
            items: [{ invalidField: 12345 }],
            tenantId: 'tenant-corrupt-3',
          },
        }),
      )

      const store = createCartStore('tenant-corrupt-3')
      expect(store.getState().items).toEqual([])
    })

    it('gracefully recovers to empty items when schema version is incompatible', () => {
      mockStorage.setItem(
        'growfin_cart_tenant-outdated',
        JSON.stringify({
          version: 99,
          state: {
            tenantId: 'tenant-outdated',
            items: [
              {
                id: 'item-1',
                name: 'Old Item',
                productId: 'p-1',
                quantity: 1,
                subtotal: 10000,
              },
            ],
          },
        }),
      )

      const store = createCartStore('tenant-outdated')
      expect(store.getState().items).toEqual([])
    })

    it('gracefully recovers when tenantId in stored state mismatches requested store', () => {
      mockStorage.setItem(
        'growfin_cart_target-tenant',
        JSON.stringify({
          version: 1,
          state: {
            tenantId: 'foreign-tenant-id',
            items: [
              {
                id: 'item-1',
                name: 'Foreign Item',
                productId: 'p-1',
                quantity: 1,
                subtotal: 10000,
              },
            ],
          },
        }),
      )

      const store = createCartStore('target-tenant')
      expect(store.getState().items).toEqual([])
    })
  })

  describe('react Context Provider & Granular Selector Hooks', () => {
    function TestConsumer() {
      const items = useCartItems()
      const itemCount = useCartItemCount()
      const cartTotal = useCartTotal()
      const actions = useCartActions()

      return React.createElement(
        'div',
        { 'data-testid': 'cart-consumer' },
        React.createElement('span', { 'data-testid': 'item-count' }, String(itemCount)),
        React.createElement('span', { 'data-testid': 'cart-total' }, String(cartTotal)),
        React.createElement(
          'span',
          { 'data-testid': 'item-names' },
          items.map((i: { name: string }) => i.name).join(','),
        ),
        React.createElement('button', {
          onClick: () =>
            actions.addItem({
              name: 'Button Item',
              basePrice: 15000,
              productId: 'btn-prod',
              quantity: 1,
            }),
        }),
      )
    }

    it('renders and consumes cart store within StorefrontCartProvider', () => {
      const store = createCartStore('tenant-provider-test')
      store.getState().addItem({
        name: 'Item One',
        basePrice: 10000,
        productId: 'item-1',
        quantity: 2,
      })
      store.getState().addItem({
        name: 'Item Two',
        basePrice: 15000,
        productId: 'item-2',
        quantity: 1,
      })

      const html = renderToStaticMarkup(
        React.createElement(
          StorefrontCartProvider,
          { initialStore: store, tenantId: 'tenant-provider-test' },
          React.createElement(TestConsumer),
        ),
      )

      expect(html).toContain('3') // total item count (2 + 1)
      expect(html).toContain('35000') // total IDR (20000 + 15000)
      expect(html).toContain('Item One,Item Two')
    })

    it('throws when useCartStore is used outside StorefrontCartProvider', () => {
      function NakedConsumer() {
        useCartStore((state: { items: unknown[] }) => state.items)
        return null
      }

      expect(() => {
        renderToStaticMarkup(React.createElement(NakedConsumer))
      }).toThrow('useCartStore must be used within StorefrontCartProvider')
    })

    it('throws when useCartActions is used outside StorefrontCartProvider', () => {
      function NakedConsumer() {
        useCartActions()
        return null
      }

      expect(() => {
        renderToStaticMarkup(React.createElement(NakedConsumer))
      }).toThrow('useCartActions must be used within StorefrontCartProvider')
    })
  })
})
