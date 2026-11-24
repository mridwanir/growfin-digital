'use client'

import type { ProductWithVariants } from '../catalog'
import type { Serializable } from '../utils/serialization'
import type { MeracikPreviewUpdateMessage } from './preview-protocol'
import type { Tenant } from '@/db/schema/auth'
import type { Category } from '@/db/schema/catalog'
import type { StorefrontConfig } from '@/db/schema/storefront'

import { createElement, useEffect, useState } from 'react'

import { StorefrontCartProvider, StorefrontClientIslands } from '../cart'
import { getStorefrontLayout } from '../layouts'
import { MeracikWatermark } from '../sections/watermark'
import { resolveArchetype } from '../utils/archetype'
import { MERACIK_PREVIEW_UPDATE } from './preview-protocol'

export interface StorefrontPreviewClientProps {
  categories?: (Category | Serializable<Category>)[]
  config: StorefrontConfig | Serializable<StorefrontConfig>
  products?: (ProductWithVariants | Serializable<ProductWithVariants>)[]
  tenant: Tenant | Serializable<Tenant>
}

export function StorefrontPreviewClient({
  categories = [],
  config: initialConfig,
  products = [],
  tenant,
}: StorefrontPreviewClientProps) {
  const [config, setConfig] = useState<StorefrontConfig>(() => ({
    ...initialConfig,
    updatedAt:
      initialConfig.updatedAt instanceof Date
        ? initialConfig.updatedAt
        : new Date(initialConfig.updatedAt ?? 0),
  }))
  const [isInIframe, setIsInIframe] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return window.self !== window.top
    } catch {
      return true
    }
  })
  void setIsInIframe

  useEffect(() => {
    function handleMessage(event: MessageEvent<unknown>) {
      if (
        event.origin &&
        typeof window !== 'undefined' &&
        window.location?.origin &&
        event.origin !== window.location.origin &&
        event.origin !== '*'
      ) {
        return
      }

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

  const normalizedTenant = {
    ...tenant,
    createdAt:
      tenant.createdAt instanceof Date ? tenant.createdAt : new Date(tenant.createdAt ?? 0),
    domainActiveUntil:
      tenant.domainActiveUntil instanceof Date
        ? tenant.domainActiveUntil
        : tenant.domainActiveUntil
          ? new Date(tenant.domainActiveUntil)
          : null,
    siteActiveUntil:
      tenant.siteActiveUntil instanceof Date
        ? tenant.siteActiveUntil
        : tenant.siteActiveUntil
          ? new Date(tenant.siteActiveUntil)
          : null,
    updatedAt:
      tenant.updatedAt instanceof Date ? tenant.updatedAt : new Date(tenant.updatedAt ?? 0),
  } as Tenant

  return (
    <StorefrontCartProvider tenantId={tenant.id}>
      {!isInIframe && (
        <aside
          aria-label="Editor canvas preview notice"
          className="bg-muted text-muted-foreground border-b px-4 py-2 text-center text-xs font-medium"
          data-slot="preview-frame-isolation-notice"
        >
          Storefront preview is intended to be viewed within the editor canvas.
        </aside>
      )}
      {createElement(
        LayoutComponent,
        {
          categories: categories as Category[],
          config,
          products: products as ProductWithVariants[],
          tenant: normalizedTenant,
        },
        <StorefrontClientIslands tenant={normalizedTenant} />,
        <MeracikWatermark />,
      )}
    </StorefrontCartProvider>
  )
}
