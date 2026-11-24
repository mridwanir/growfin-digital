'use client'

import type { ProductWithVariants } from '../catalog'
import type { Tenant } from '@/db/schema/auth'
import type { ThemeConfig } from '@/db/schema/storefront'

import { useEffect, useState } from 'react'

import { resolveFulfillmentModes } from '../utils/fulfillment'
import { resolveTenantWhatsAppNumber } from '../utils/whatsapp'
import {
  MobileCartBar,
  ProductCustomizationDialog,
  StorefrontCartDrawer,
  StorefrontCartProvider,
  useCartActions,
} from './index'

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

  const waNumber = resolveTenantWhatsAppNumber(tenant)
  const themeConfig =
    tenant && typeof tenant === 'object' && 'themeConfig' in tenant
      ? (tenant.themeConfig as ThemeConfig | Record<string, unknown> | null | undefined)
      : undefined
  const fulfillmentModes = resolveFulfillmentModes(tenant.category, themeConfig)
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
          waNumber,
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
