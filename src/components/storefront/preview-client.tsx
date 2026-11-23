'use client'

import type { MeracikPreviewUpdateMessage } from './preview-protocol'
import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { Category } from '@/db/schema/catalog'
import type { StorefrontConfig, Tenant } from '@/db/schema/tenants'

import { createElement, useEffect, useState } from 'react'

import { StorefrontClientIslands } from '@/components/storefront/client-islands'
import { getStorefrontLayout } from '@/components/storefront/layouts'
import { MeracikWatermark } from '@/components/storefront/watermark'
import { resolveArchetype } from '@/lib/storefront/archetype'
import { StorefrontCartProvider } from '@/lib/storefront/cart'

import { MERACIK_PREVIEW_UPDATE } from './preview-protocol'

export interface StorefrontPreviewClientProps {
  categories?: Category[]
  config: StorefrontConfig
  products?: ProductWithVariants[]
  tenant: Tenant
}

export function StorefrontPreviewClient({
  categories = [],
  config: initialConfig,
  products = [],
  tenant,
}: StorefrontPreviewClientProps) {
  const [config, setConfig] = useState<StorefrontConfig>(initialConfig)

  useEffect(() => {
    function handleMessage(event: MessageEvent<unknown>) {
      if (!event.data || typeof event.data !== 'object') return
      const message = event.data as Partial<MeracikPreviewUpdateMessage>
      if (message.type !== MERACIK_PREVIEW_UPDATE) return

      const payload = message.payload
      if (!payload || typeof payload !== 'object') return

      setConfig(prev => ({
        ...prev,
        ...(payload.theme !== undefined
          ? {
              theme:
                typeof payload.theme === 'object' && payload.theme !== null
                  ? { ...prev.theme, ...payload.theme }
                  : payload.theme,
            }
          : {}),
        ...(payload.sections !== undefined ? { sections: payload.sections } : {}),
      }))
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const archetype = resolveArchetype(tenant.category)
  const layoutId =
    config?.theme?.layoutId ||
    ('themeConfig' in tenant
      ? (tenant.themeConfig as { layoutId?: string } | undefined)?.layoutId
      : undefined)
  const LayoutComponent = getStorefrontLayout(layoutId, archetype)

  return (
    <StorefrontCartProvider tenantId={tenant.id}>
      {createElement(
        LayoutComponent,
        { categories, config, products, tenant },
        <StorefrontClientIslands tenant={tenant} />,
        <MeracikWatermark />,
      )}
    </StorefrontCartProvider>
  )
}
