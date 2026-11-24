import type { Tenant } from '@/db/schema/tenants'

import { describe, expect, it } from 'vitest'

import { env } from '@/lib/env'

import { buildLocalBusinessJsonLd, getLocalBusinessType } from './seo'

const baseMockTenant: Tenant = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Toko Keren',
  address: 'Jl. Sudirman No. 1',
  category: 'Fashion & Retail',
  city: 'Jakarta',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  customDomain: null,
  domainActiveUntil: null,
  googleMapsUrl: 'https://maps.google.com/?q=test',
  logo: null,
  metadata: null,
  packageTier: 'instant',
  phone: '081234567890',
  siteActiveUntil: null,
  slug: 'toko-keren',
  status: 'published',
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  operatingHours: {
    closeTime: '21:00',
    isOpen: true,
    openTime: '09:00',
    raw: '09:00 - 21:00',
  },
}

describe('SEO Domain Module (seo.ts)', () => {
  describe('getLocalBusinessType', () => {
    it('returns Store for retail archetype', () => {
      expect(getLocalBusinessType('Clothing & Apparel', 'retail')).toBe('Store')
      expect(getLocalBusinessType('Cafe & Coffee', 'retail')).toBe('Store')
    })

    it('returns specific business types for fnb archetype', () => {
      expect(getLocalBusinessType('cafe & roastery', 'fnb')).toBe('CafeOrCoffeeShop')
      expect(getLocalBusinessType('kopi susu kekinian', 'fnb')).toBe('CafeOrCoffeeShop')
      expect(getLocalBusinessType('bakery and pastry', 'fnb')).toBe('Bakery')
      expect(getLocalBusinessType('roti bakar premium', 'fnb')).toBe('Bakery')
      expect(getLocalBusinessType('restoran nusantara', 'fnb')).toBe('Restaurant')
    })

    it('defaults archetype to retail when omitted', () => {
      expect(getLocalBusinessType('Cafe')).toBe('Store')
    })
  })

  describe('buildLocalBusinessJsonLd', () => {
    it('generates valid schema.org LocalBusiness JSON-LD with archetype parameter', () => {
      const jsonLd = buildLocalBusinessJsonLd(baseMockTenant, 'retail')

      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Store')
      expect(jsonLd.name).toBe('Toko Keren')
      expect(jsonLd.telephone).toBe('081234567890')
      expect(jsonLd.url).toBe(
        `https://${env.NEXT_PUBLIC_BASE_DOMAIN || 'growfin.my.id'}/toko-keren`,
      )
      expect(jsonLd.address['@type']).toBe('PostalAddress')
      expect(jsonLd.address.addressLocality).toBe('Jakarta')
      expect(jsonLd.hasMap).toBe('https://maps.google.com/?q=test')
    })

    it('uses fnb archetype to resolve restaurant type in JSON-LD', () => {
      const fnbTenant: Tenant = {
        ...baseMockTenant,
        name: 'Kopi Senja',
        category: 'Kopi & Cafe',
      }
      const jsonLd = buildLocalBusinessJsonLd(fnbTenant, 'fnb')

      expect(jsonLd['@type']).toBe('CafeOrCoffeeShop')
    })

    it('defaults archetype to retail if not specified', () => {
      const jsonLd = buildLocalBusinessJsonLd(baseMockTenant)
      expect(jsonLd['@type']).toBe('Store')
    })
  })
})
