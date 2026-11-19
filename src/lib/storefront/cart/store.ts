import type { StateStorage } from 'zustand/middleware'
import type { StoreApi } from 'zustand/vanilla'

import type { AddCartItemInput, CartLineItem } from './domain'

import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { buildCartItemHash, calculateItemSubtotal } from './domain'
import { CART_STORAGE_VERSION, PersistedCartStateSchema } from './schema'

export interface CartState {
  tenantId: string
  items: CartLineItem[]
  addItem: (item: AddCartItemInput) => void
  updateQuantity: (hash: string, quantity: number) => void
  removeItem: (hash: string) => void
  clearCart: () => void
}

export type CartStore = StoreApi<CartState>

const fallbackStorageMap = new Map<string, string>()

const fallbackStorage: StateStorage = {
  getItem: (key: string): string | null => fallbackStorageMap.get(key) ?? null,
  removeItem: (key: string): void => {
    fallbackStorageMap.delete(key)
  },
  setItem: (key: string, value: string): void => {
    fallbackStorageMap.set(key, value)
  },
}

function getBrowserStorage(): StateStorage {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (
    typeof globalThis !== 'undefined' &&
    'localStorage' in globalThis &&
    globalThis.localStorage
  ) {
    const storageCandidate = globalThis.localStorage as StateStorage
    return storageCandidate
  }
  return fallbackStorage
}

export function createCartStore(tenantId: string, initialItems: CartLineItem[] = []): CartStore {
  const store = createStore<CartState>()(
    persist(
      (set, get) => ({
        items: initialItems,
        tenantId,
        addItem: item => {
          const hash =
            item.hash ||
            buildCartItemHash(item.productId, item.selectedVariants, item.selectedAddons)
          const quantityToAdd =
            typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1

          let unitPrice = item.unitPrice
          let incomingSubtotal = item.subtotal

          if (typeof incomingSubtotal === 'number' && incomingSubtotal >= 0) {
            if (typeof unitPrice !== 'number') {
              unitPrice = Math.round(incomingSubtotal / quantityToAdd)
            }
          } else {
            if (typeof unitPrice !== 'number') {
              unitPrice = calculateItemSubtotal(item.basePrice ?? 0, [], [], 1)
            }
            incomingSubtotal = calculateItemSubtotal(unitPrice, [], [], quantityToAdd)
          }

          const safeUnitPrice = typeof unitPrice === 'number' && unitPrice >= 0 ? unitPrice : 0

          const currentItems = get().items
          const existingIndex = currentItems.findIndex(
            i => (i.hash && i.hash === hash) || i.id === hash,
          )

          if (existingIndex >= 0) {
            const existing = currentItems[existingIndex]
            const newQuantity = existing.quantity + quantityToAdd
            const effectiveUnitPrice = existing.unitPrice ?? safeUnitPrice
            const newSubtotal = calculateItemSubtotal(effectiveUnitPrice, [], [], newQuantity)

            const updatedItems = [...currentItems]
            updatedItems[existingIndex] = {
              ...existing,
              hash: existing.hash || hash,
              notes: item.notes || existing.notes,
              quantity: newQuantity,
              subtotal: newSubtotal,
              unitPrice: effectiveUnitPrice,
            }

            set({ items: updatedItems })
          } else {
            const newItem: CartLineItem = {
              ...item,
              id: item.id || hash,
              hash,
              quantity: quantityToAdd,
              subtotal: incomingSubtotal,
              unitPrice: safeUnitPrice,
            }

            set({ items: [...currentItems, newItem] })
          }
        },

        updateQuantity: (hash, quantity) => {
          if (quantity <= 0) {
            set({
              items: get().items.filter(i => i.hash !== hash && i.id !== hash),
            })
            return
          }

          set({
            items: get().items.map(i => {
              if (i.hash === hash || i.id === hash) {
                const unitPrice =
                  i.unitPrice ??
                  (i.quantity > 0 ? Math.round(i.subtotal / i.quantity) : (i.basePrice ?? 0))
                const newSubtotal = calculateItemSubtotal(unitPrice, [], [], quantity)
                return {
                  ...i,
                  quantity,
                  subtotal: newSubtotal,
                  unitPrice,
                }
              }
              return i
            }),
          })
        },

        removeItem: hash => {
          set({
            items: get().items.filter(i => i.hash !== hash && i.id !== hash),
          })
        },

        clearCart: () => {
          set({ items: [] })
        },
      }),
      {
        name: `growfin_cart_${tenantId}`,
        storage: createJSONStorage(() => getBrowserStorage()),
        version: CART_STORAGE_VERSION,
        merge: (persistedState, currentState) => {
          const parseResult = PersistedCartStateSchema.safeParse(persistedState)
          if (!parseResult.success) {
            return currentState
          }
          if (parseResult.data.tenantId !== currentState.tenantId) {
            return currentState
          }
          return {
            ...currentState,
            items: parseResult.data.items,
          }
        },
        migrate: (persistedState, version) => {
          if (version !== CART_STORAGE_VERSION) {
            return { items: [], tenantId }
          }
          return persistedState as Pick<CartState, 'items' | 'tenantId'>
        },
        partialize: state => ({
          items: state.items,
          tenantId: state.tenantId,
        }),
      },
    ),
  )
  store.getInitialState = () => store.getState()
  return store
}
