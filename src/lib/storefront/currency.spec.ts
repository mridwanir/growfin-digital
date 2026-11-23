import { describe, expect, it } from 'vitest'

import { formatCurrency, getDiscountPercentage, hasValidDiscount } from './currency'

describe('Canonical Storefront Currency & Discount Formatting', () => {
  describe('formatCurrency', () => {
    it('formats positive integers into Indonesian Rupiah format with thousand separators', () => {
      expect(formatCurrency(18000)).toBe('Rp 18.000')
      expect(formatCurrency(25000)).toBe('Rp 25.000')
      expect(formatCurrency(1500000)).toBe('Rp 1.500.000')
      expect(formatCurrency(0)).toBe('Rp 0')
    })

    it('formats negative integers gracefully with leading minus', () => {
      expect(formatCurrency(-5000)).toBe('-Rp 5.000')
      expect(formatCurrency(-125000)).toBe('-Rp 125.000')
    })

    it('handles decimal amounts by rounding to nearest integer', () => {
      expect(formatCurrency(25000.4)).toBe('Rp 25.000')
      expect(formatCurrency(25000.6)).toBe('Rp 25.001')
      expect(formatCurrency(-5000.6)).toBe('-Rp 5.001')
    })

    it('handles non-finite and invalid numbers by returning Rp 0', () => {
      expect(formatCurrency(Number.NaN)).toBe('Rp 0')
      expect(formatCurrency(Infinity)).toBe('Rp 0')
      expect(formatCurrency(-Infinity)).toBe('Rp 0')
    })
  })

  describe('hasValidDiscount', () => {
    it('returns true when originalPrice is strictly greater than price', () => {
      expect(hasValidDiscount(25000, 30000)).toBe(true)
      expect(hasValidDiscount(185000, 220000)).toBe(true)
    })

    it('returns false when originalPrice is less than or equal to price', () => {
      expect(hasValidDiscount(25000, 25000)).toBe(false)
      expect(hasValidDiscount(25000, 20000)).toBe(false)
    })

    it('returns false when price or originalPrice is null or undefined', () => {
      expect(hasValidDiscount(25000, null)).toBe(false)
      expect(hasValidDiscount(25000, undefined)).toBe(false)
      expect(hasValidDiscount(null, 30000)).toBe(false)
      expect(hasValidDiscount(undefined, 30000)).toBe(false)
      expect(hasValidDiscount(null, null)).toBe(false)
      expect(hasValidDiscount(undefined, undefined)).toBe(false)
    })

    it('returns false when either value is non-finite', () => {
      expect(hasValidDiscount(Number.NaN, 30000)).toBe(false)
      expect(hasValidDiscount(25000, Number.NaN)).toBe(false)
      expect(hasValidDiscount(Infinity, 30000)).toBe(false)
      expect(hasValidDiscount(25000, Infinity)).toBe(false)
      expect(hasValidDiscount(-Infinity, 30000)).toBe(false)
    })
  })

  describe('getDiscountPercentage', () => {
    it('calculates integer discount percentage rounded correctly', () => {
      expect(getDiscountPercentage(25000, 30000)).toBe(17)
      expect(getDiscountPercentage(28000, 35000)).toBe(20)
      expect(getDiscountPercentage(185000, 220000)).toBe(16)
    })

    it('returns 0 when discount is invalid or missing', () => {
      expect(getDiscountPercentage(25000, null)).toBe(0)
      expect(getDiscountPercentage(null, 30000)).toBe(0)
      expect(getDiscountPercentage(undefined, 30000)).toBe(0)
      expect(getDiscountPercentage(25000, undefined)).toBe(0)
      expect(getDiscountPercentage(30000, 25000)).toBe(0)
      expect(getDiscountPercentage(25000, 25000)).toBe(0)
    })

    it('returns 0 when originalPrice is non-positive or non-finite', () => {
      expect(getDiscountPercentage(-5000, 0)).toBe(0)
      expect(getDiscountPercentage(-5000, -1000)).toBe(0)
      expect(getDiscountPercentage(25000, Number.NaN)).toBe(0)
      expect(getDiscountPercentage(Number.NaN, 30000)).toBe(0)
    })
  })
})
