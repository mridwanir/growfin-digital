import { describe, expect, it, vi } from 'vitest'

import * as clientIndex from './index'
import {
  buildGeminiPrompt,
  generateCategorySlug,
  generateInputSchema,
  generateTenantSlug,
} from './server'

vi.mock('server-only', () => ({}))

describe('Generator feature slice - domain unit logic', () => {
  describe('generateTenantSlug', () => {
    it('creates URL-friendly slugs from business names with random suffixes', () => {
      const slug = generateTenantSlug('Kopi & Roti Bakar 88!')
      expect(slug).toMatch(/^kopi-roti-bakar-88-[a-z0-9]{5}$/)
    })

    it('falls back to store if name contains no alphanumeric characters', () => {
      const slug = generateTenantSlug('!!!')
      expect(slug).toMatch(/^store-[a-z0-9]{5}$/)
    })
  })

  describe('generateCategorySlug', () => {
    it('creates slug from category name or fallback to index', () => {
      expect(generateCategorySlug('Makanan Ringan', 0)).toBe('makanan-ringan')
      expect(generateCategorySlug('!!!', 2)).toBe('category-3')
    })
  })

  describe('generateInputSchema', () => {
    it('validates required business name and optional Maps URL', () => {
      const data = generateInputSchema.parse({
        name: 'Warung Bu Sri',
        mapsUrl: 'https://maps.google.com/test',
      })
      expect(data.name).toBe('Warung Bu Sri')
      expect(data.mapsUrl).toBe('https://maps.google.com/test')
    })

    it('rejects whitespace-only name', () => {
      const invalid = generateInputSchema.safeParse({
        name: '   ',
      })
      expect(invalid.success).toBe(false)
    })
  })

  describe('buildGeminiPrompt', () => {
    it('constructs prompt containing business name and maps url', () => {
      const prompt = buildGeminiPrompt({
        name: 'Toko Bunga Mawar',
        mapsUrl: 'https://maps.google.com/?cid=999',
      })
      expect(prompt).toContain('Toko Bunga Mawar')
      expect(prompt).toContain('https://maps.google.com/?cid=999')
    })
  })

  describe('generator index public barrel', () => {
    it('does not export node:crypto or slug generator from client index', () => {
      expect('generateTenantSlug' in clientIndex).toBe(false)
      expect('generateCategorySlug' in clientIndex).toBe(false)
    })
  })
})
