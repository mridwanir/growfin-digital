import type { ThemeConfig } from '@/db/schema/tenants'

import { resolveArchetype } from '@/lib/storefront/archetype'

export type FulfillmentMode = 'DELIVERY' | 'DINE_IN' | 'PICKUP' | 'TAKEAWAY'

export const FNB_FULFILLMENT_MODES: ReadonlyArray<FulfillmentMode> = [
  'DINE_IN',
  'TAKEAWAY',
  'DELIVERY',
]
export const RETAIL_FULFILLMENT_MODES: ReadonlyArray<FulfillmentMode> = ['PICKUP', 'DELIVERY']

export function resolveFulfillmentModes(
  category?: string | null,
  themeConfig?: Record<string, unknown> | ThemeConfig | null,
): ReadonlyArray<FulfillmentMode> {
  const rawModes = themeConfig?.fulfillmentModes
  if (Array.isArray(rawModes) && rawModes.length > 0) {
    return rawModes as FulfillmentMode[]
  }
  const archetype = resolveArchetype(category)
  return archetype === 'fnb' ? FNB_FULFILLMENT_MODES : RETAIL_FULFILLMENT_MODES
}
