import type { ReactElement } from 'react'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { StorefrontClientIslands } from '@/components/storefront/client-islands'
import { StorefrontCartProvider } from '@/lib/storefront/cart'
import {
  FNB_FULFILLMENT_MODES,
  resolveFulfillmentModes,
  RETAIL_FULFILLMENT_MODES,
} from '@/lib/storefront/fulfillment'

describe('StorefrontClientIslands Component', () => {
  const fnbTenant = {
    id: 'fnb-tenant-123',
    name: 'Kopi Senja',
    category: 'Cafe & Coffee Shop',
    phone: '081234567890',
    themeConfig: {},
    brandingContent: {
      waNumber: '6281234567890',
    },
  }

  const retailTenant = {
    id: 'retail-tenant-456',
    name: 'Boutique Cantik',
    category: 'Fashion & Retail',
    phone: '081298765432',
    themeConfig: {},
    brandingContent: {
      waNumber: '6281298765432',
    },
  }

  describe('resolveFulfillmentModes', () => {
    it('returns F&B default modes [DINE_IN, TAKEAWAY, DELIVERY] for cafe/restaurant categories', () => {
      expect(resolveFulfillmentModes('Cafe & Coffee Shop')).toEqual(FNB_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Restoran Padang')).toEqual(FNB_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Warung Kopi')).toEqual(FNB_FULFILLMENT_MODES)
    })

    it('returns Retail default modes [PICKUP, DELIVERY] for retail categories', () => {
      expect(resolveFulfillmentModes('Fashion & Retail')).toEqual(RETAIL_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Clothing Store')).toEqual(RETAIL_FULFILLMENT_MODES)
      expect(resolveFulfillmentModes('Toko Kelontong')).toEqual(RETAIL_FULFILLMENT_MODES)
    })

    it('returns custom fulfillment modes when configured in themeConfig.fulfillmentModes', () => {
      const customModes = ['TAKEAWAY', 'DELIVERY'] as const
      expect(
        resolveFulfillmentModes('Cafe & Coffee Shop', {
          fulfillmentModes: customModes as unknown as string[],
        }),
      ).toEqual(customModes)
    })
  })

  describe('storefrontClientIslands rendering', () => {
    it('wraps islands inside StorefrontCartProvider with tenantId', () => {
      const providerElement = StorefrontClientIslands({ tenant: fnbTenant }) as ReactElement<{
        children: ReactElement
        tenantId: string
      }>

      expect(providerElement.type).toBe(StorefrontCartProvider)
      expect(providerElement.props.tenantId).toBe('fnb-tenant-123')
    })
    it('wraps retail tenant with its retail tenantId', () => {
      const providerElement = StorefrontClientIslands({ tenant: retailTenant }) as ReactElement<{
        children: ReactElement
        tenantId: string
      }>

      expect(providerElement.type).toBe(StorefrontCartProvider)
      expect(providerElement.props.tenantId).toBe('retail-tenant-456')
    })

    it('falls back to default tenantId when tenant.id is omitted', () => {
      const { id: _, ...tenantWithoutId } = fnbTenant
      const providerElement = StorefrontClientIslands({
        tenant: tenantWithoutId,
      }) as ReactElement<{
        children: ReactElement
        tenantId: string
      }>

      expect(providerElement.type).toBe(StorefrontCartProvider)
      expect(providerElement.props.tenantId).toBe('default')
    })

    it('renders client islands markup cleanly via renderToStaticMarkup', () => {
      const markup = renderToStaticMarkup(<StorefrontClientIslands tenant={fnbTenant} />)
      expect(markup).toBeDefined()
    })
  })
})
