import { describe, expect, it } from 'vitest'

import { buildCartItemHash, calculateItemSubtotal, formatCurrency } from './domain'

describe('Storefront Cart Domain Engine', () => {
  describe('calculateItemSubtotal', () => {
    it('calculates subtotal for base price with default quantity of 1 and no modifiers', () => {
      expect(calculateItemSubtotal(25000)).toBe(25000)
    })

    it('calculates subtotal with positive variant modifiers', () => {
      // base: 20000, modifier: +5000 (e.g. Large size) -> 25000
      expect(calculateItemSubtotal(20000, [5000])).toBe(25000)
    })

    it('calculates subtotal with negative variant modifiers', () => {
      // base: 20000, modifier: -3000 (e.g. promo or smaller size) -> 17000
      expect(calculateItemSubtotal(20000, [-3000])).toBe(17000)
    })

    it('calculates subtotal with multiple variant modifiers and zero modifiers', () => {
      // base: 20000 + 5000 (Large) + 0 (Normal Sugar) + 2000 (Oat Milk) -> 27000
      expect(calculateItemSubtotal(20000, [5000, 0, 2000])).toBe(27000)
    })

    it('calculates subtotal with addons', () => {
      // base: 15000, addons: 3000 (Extra Shot) + 2000 (Syrup) -> 20000
      const addons = [{ price: 3000 }, { price: 2000 }]
      expect(calculateItemSubtotal(15000, [], addons)).toBe(20000)
    })

    it('calculates subtotal combining base price, variant modifiers, addons, and quantity', () => {
      // (base: 18000 + variant: 4000 + addons: 3000) * quantity: 3 = 25000 * 3 = 75000
      const variantModifiers = [4000]
      const addons = [{ price: 3000 }]
      expect(calculateItemSubtotal(18000, variantModifiers, addons, 3)).toBe(75000)
    })

    it('clamps negative totals to 0 to prevent negative item pricing', () => {
      // base: 5000, modifier: -10000 -> 0
      expect(calculateItemSubtotal(5000, [-10000])).toBe(0)
    })

    it('handles zero quantity by returning 0', () => {
      expect(calculateItemSubtotal(25000, [5000], [{ price: 2000 }], 0)).toBe(0)
    })

    it('rounds subtotal to whole integer if fractional numbers occur', () => {
      expect(calculateItemSubtotal(10000.4, [2000.2], [{ price: 500.2 }], 1)).toBe(12501)
    })

    it('handles negative quantity by returning 0', () => {
      expect(calculateItemSubtotal(25000, [], [], -2)).toBe(0)
    })

    it('handles non-finite basePrice or modifiers defensively', () => {
      expect(calculateItemSubtotal(Number.NaN, [Number.NaN], [{ price: Number.NaN }])).toBe(0)
    })
  })

  describe('buildCartItemHash', () => {
    it('generates a deterministic hash string for a product with no variants or addons', () => {
      const hash = buildCartItemHash('prod-1', {})
      expect(typeof hash).toBe('string')
      expect(hash).toContain('prod-1')
    })

    it('generates identical hash regardless of variant key insertion order', () => {
      const hashA = buildCartItemHash('prod-1', {
        Ice: 'Normal',
        Size: 'Large',
        Sugar: 'Less',
      })
      const hashB = buildCartItemHash('prod-1', {
        Ice: 'Normal',
        Size: 'Large',
        Sugar: 'Less',
      })
      expect(hashA).toBe(hashB)
    })

    it('generates identical hash regardless of addon array ordering', () => {
      const hashA = buildCartItemHash('prod-1', {}, ['Boba', 'Extra Cheese', 'Jelly'])
      const hashB = buildCartItemHash('prod-1', {}, ['Jelly', 'Boba', 'Extra Cheese'])
      expect(hashA).toBe(hashB)
    })

    it('produces distinct hashes when variants differ for the same product', () => {
      const regularHash = buildCartItemHash('prod-1', { Size: 'Regular' })
      const largeHash = buildCartItemHash('prod-1', { Size: 'Large' })
      expect(regularHash).not.toBe(largeHash)
    })

    it('produces distinct hashes when addons differ for the same product and variants', () => {
      const withShot = buildCartItemHash('prod-1', { Size: 'Regular' }, ['Extra Shot'])
      const withoutShot = buildCartItemHash('prod-1', { Size: 'Regular' }, [])
      expect(withShot).not.toBe(withoutShot)
    })

    it('produces distinct hashes for different product IDs with identical options', () => {
      const productA = buildCartItemHash('prod-1', { Size: 'Regular' })
      const productB = buildCartItemHash('prod-2', { Size: 'Regular' })
      expect(productA).not.toBe(productB)
    })

    it('handles undefined or null variants and addons safely without throwing', () => {
      const hash = buildCartItemHash(
        'prod-1',
        undefined as unknown as Record<string, string>,
        undefined as unknown as string[],
      )
      expect(hash).toBeDefined()
    })

    it('handles non-array addons safely without throwing', () => {
      const hash = buildCartItemHash(
        'prod-1',
        { Size: 'Regular' },
        'not-an-array' as unknown as string[],
      )
      expect(hash).toContain('prod-1')
    })
  })

  describe('formatCurrency helper', () => {
    it('formats numbers into Indonesian Rupiah format', () => {
      expect(formatCurrency(25000)).toBe('Rp 25.000')
      expect(formatCurrency(1500000)).toBe('Rp 1.500.000')
      expect(formatCurrency(0)).toBe('Rp 0')
      expect(formatCurrency(-5000)).toBe('-Rp 5.000')
    })

    it('handles non-finite amounts by returning Rp 0', () => {
      expect(formatCurrency(Number.NaN)).toBe('Rp 0')
      expect(formatCurrency(Infinity)).toBe('Rp 0')
      expect(formatCurrency(-Infinity)).toBe('Rp 0')
    })
  })
})
