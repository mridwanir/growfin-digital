'use client'

import type { CartLineItem } from './domain'
import type { CartState, CartStore } from './store'

import { createContext, useContext, useMemo } from 'react'
import { useStore } from 'zustand'

export const CartStoreContext = createContext<CartStore | null>(null)

export function useCartStore(): CartState
export function useCartStore<T>(selector: (state: CartState) => T): T
export function useCartStore<T>(selector?: (state: CartState) => T): T | CartState {
  const store = useContext(CartStoreContext)
  if (!store) {
    throw new Error('useCartStore must be used within StorefrontCartProvider')
  }

  return useStore(store, selector ?? (state => state as unknown as T))
}

export function useCartItems(): CartLineItem[] {
  return useCartStore(state => state.items)
}

export function useCartItemCount(): number {
  return useCartStore(state =>
    state.items.reduce((totalCount, item) => totalCount + item.quantity, 0),
  )
}

export function useCartTotal(): number {
  return useCartStore(state =>
    state.items.reduce((totalPrice, item) => totalPrice + item.subtotal, 0),
  )
}

export function useCartActions() {
  const store = useContext(CartStoreContext)
  if (!store) {
    throw new Error('useCartActions must be used within StorefrontCartProvider')
  }

  return useMemo(() => {
    const { addItem, clearCart, removeItem, updateQuantity } = store.getState()
    return {
      addItem,
      clearCart,
      removeItem,
      updateQuantity,
    }
  }, [store])
}

export function useOptionalCartActions() {
  const store = useContext(CartStoreContext)
  return useMemo(() => {
    if (!store) return null
    const { addItem, clearCart, removeItem, updateQuantity } = store.getState()
    return {
      addItem,
      clearCart,
      removeItem,
      updateQuantity,
    }
  }, [store])
}

export function useCartStoreApi(): CartStore {
  const store = useContext(CartStoreContext)
  if (!store) {
    throw new Error('useCartStoreApi must be used within StorefrontCartProvider')
  }
  return store
}
