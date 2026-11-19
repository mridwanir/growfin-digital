'use client'

import type { ReactNode } from 'react'

import type { CartStore } from './store'

import { useRef } from 'react'

import { CartStoreContext } from './context'
import { createCartStore } from './store'

export interface StorefrontCartProviderProps {
  children?: ReactNode
  initialStore?: CartStore
  tenantId: string
}

export function StorefrontCartProvider({
  children,
  initialStore,
  tenantId,
}: StorefrontCartProviderProps) {
  const storeRef = useRef<CartStore | null>(initialStore ?? null)
  const tenantRef = useRef<string>(tenantId)

  if (!storeRef.current || tenantRef.current !== tenantId) {
    storeRef.current = initialStore ?? createCartStore(tenantId)
    tenantRef.current = tenantId
  }

  return <CartStoreContext.Provider value={storeRef.current}>{children}</CartStoreContext.Provider>
}
