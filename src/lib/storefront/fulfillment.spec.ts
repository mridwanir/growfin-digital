import { describe, expect, it } from 'vitest'

import {
  FNB_FULFILLMENT_MODES,
  resolveFulfillmentModes,
  RETAIL_FULFILLMENT_MODES,
} from './fulfillment'

describe('resolveFulfillmentModes pure domain helper', () => {
  it('resolves F&B default modes [DINE_IN, TAKEAWAY, DELIVERY] for cafe/restaurant categories', () => {
    expect(resolveFulfillmentModes('Cafe & Coffee Shop')).toEqual(FNB_FULFILLMENT_MODES)
    expect(resolveFulfillmentModes('Restoran Padang')).toEqual(FNB_FULFILLMENT_MODES)
    expect(resolveFulfillmentModes('Warung Kopi')).toEqual(FNB_FULFILLMENT_MODES)
  })

  it('resolves Retail default modes [PICKUP, DELIVERY] for retail categories', () => {
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
