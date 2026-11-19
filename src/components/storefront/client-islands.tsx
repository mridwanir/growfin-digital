'use client'

import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { Tenant, ThemeConfig } from '@/db/schema/tenants'

import { useEffect, useState } from 'react'

import {
  MobileCartBar,
  ProductCustomizationDialog,
  StorefrontCartDrawer,
} from '@/components/storefront/cart'
import { resolveArchetype } from '@/lib/storefront/archetype'
import { StorefrontCartProvider, useCartActions } from '@/lib/storefront/cart'

export type FulfillmentMode = 'DELIVERY' | 'DINE_IN' | 'PICKUP' | 'TAKEAWAY'

export const FNB_FULFILLMENT_MODES: ReadonlyArray<FulfillmentMode> = [
  'DINE_IN',
  'TAKEAWAY',
  'DELIVERY',
]
export const RETAIL_FULFILLMENT_MODES: ReadonlyArray<FulfillmentMode> = ['PICKUP', 'DELIVERY']

export function resolveFulfillmentModes(
  category?: string | null,
  themeConfig?: ThemeConfig | Record<string, unknown> | null,
): ReadonlyArray<FulfillmentMode> {
  const rawModes = themeConfig?.fulfillmentModes
  if (Array.isArray(rawModes) && rawModes.length > 0) {
    return rawModes as FulfillmentMode[]
  }
  const archetype = resolveArchetype(category)
  return archetype === 'fnb' ? FNB_FULFILLMENT_MODES : RETAIL_FULFILLMENT_MODES
}
export interface StorefrontClientIslandsProps {
  tenant:
    | Tenant
    | {
        id?: string
        name: string
        [key: string]: unknown
        brandingContent?: Record<string, unknown> | null
        category?: string | null
        phone?: string | null
        themeConfig?: ThemeConfig | Record<string, unknown> | null
      }
}

function StorefrontClientIslandsContent({ tenant }: StorefrontClientIslandsProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [customizingProduct, setCustomizingProduct] = useState<ProductWithVariants | null>(null)
  const { addItem } = useCartActions()

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true)
    const handleSelectProduct = (e: Event) => {
      const customEvent = e as CustomEvent<ProductWithVariants>
      if (customEvent.detail) {
        setCustomizingProduct(customEvent.detail)
      }
    }

    const handleAddToCart = (e: Event) => {
      const customEvent = e as CustomEvent<ProductWithVariants>
      if (customEvent.detail) {
        addItem({
          name: customEvent.detail.name,
          basePrice: customEvent.detail.basePrice,
          productId: customEvent.detail.id,
          quantity: 1,
        })
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
    window.addEventListener('growfin:add-to-cart', handleAddToCart)
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('growfin:open-cart', handleOpenCart)
      window.removeEventListener('growfin:select-product', handleSelectProduct)
      window.removeEventListener('growfin:add-to-cart', handleAddToCart)
      document.removeEventListener('click', handleClick)
    }
  }, [addItem])

  const branding = (tenant.brandingContent as Record<string, unknown> | null) || {}
  const rawWa =
    (branding.socialLinks as Record<string, { url?: string }> | undefined)?.whatsapp?.url ||
    (branding.waNumber as string | undefined) ||
    tenant.phone ||
    ''

  const fulfillmentModes = resolveFulfillmentModes(tenant.category, tenant.themeConfig)
  return (
    <>
      <MobileCartBar onOpenCart={() => setIsCartOpen(true)} />
      <StorefrontCartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        tenant={{
          name: tenant.name,
          fulfillmentModes,
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

export function StorefrontClientIslands({ tenant }: StorefrontClientIslandsProps) {
  const tenantId = tenant.id || 'default'

  return (
    <StorefrontCartProvider tenantId={tenantId}>
      <StorefrontClientIslandsContent tenant={tenant} />
    </StorefrontCartProvider>
  )
}
