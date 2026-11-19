'use client'

import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { Tenant } from '@/db/schema/tenants'

import { useEffect, useState } from 'react'

import {
  MobileCartBar,
  ProductCustomizationDialog,
  StorefrontCartDrawer,
} from '@/components/storefront/cart'

export interface StorefrontClientIslandsProps {
  tenant:
  | Tenant
  | {
    brandingContent?: Record<string, unknown> | null
    id?: string
    name: string
    phone?: string | null
    [key: string]: unknown
  }
}

export function StorefrontClientIslands({ tenant }: StorefrontClientIslandsProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [customizingProduct, setCustomizingProduct] = useState<ProductWithVariants | null>(null)

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true)
    const handleSelectProduct = (e: Event) => {
      const customEvent = e as CustomEvent<ProductWithVariants>
      if (customEvent.detail) {
        setCustomizingProduct(customEvent.detail)
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      if (target.closest('[data-action="open-cart"], [data-open-cart]')) {
        setIsCartOpen(true)
      }
    }

    window.addEventListener('growfin:open-cart', handleOpenCart)
    window.addEventListener('growfin:select-product', handleSelectProduct)
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('growfin:open-cart', handleOpenCart)
      window.removeEventListener('growfin:select-product', handleSelectProduct)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const branding = (tenant.brandingContent as Record<string, unknown> | null) || {}
  const rawWa =
    ((branding.socialLinks as Record<string, { url?: string }> | undefined)?.whatsapp?.url) ||
    (branding.waNumber as string | undefined) ||
    tenant.phone ||
    ''

  return (
    <>
      <MobileCartBar onOpenCart={() => setIsCartOpen(true)} />
      <StorefrontCartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        tenant={{
          name: tenant.name,
          phone: tenant.phone,
          waNumber: rawWa,
        }}
      />
      <ProductCustomizationDialog
        open={Boolean(customizingProduct)}
        product={customizingProduct}
        onOpenChange={open => {
          if (!open) {
            setCustomizingProduct(null)
          }
        }}
      />
    </>
  )
}
