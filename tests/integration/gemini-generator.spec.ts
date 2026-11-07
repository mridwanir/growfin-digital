import { describe, expect, it, vi } from 'vitest'

import { buildGeminiPrompt, generateWithGemini } from '@/lib/generator/gemini'
import { generateInputSchema, generateTenantSlug } from '@/lib/generator/schema'

describe('Gemini Generator & Schema Unit / Integration Seam', () => {
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
    it('constructs prompt with business name and Maps URL', () => {
      const prompt = buildGeminiPrompt({
        name: 'Bengkel Mandiri Motor',
        mapsUrl: 'https://maps.google.com/bengkel',
      })
      expect(prompt).toContain('Bengkel Mandiri Motor')
      expect(prompt).toContain('https://maps.google.com/bengkel')
    })
  })

  describe('generateWithGemini', () => {
    it('parses valid Gemini API candidate JSON and returns validated schema data', async () => {
      const mockGeminiJson = {
        categories: [{ name: 'Smartphone', sortOrder: 0 }],
        business: {
          name: 'Toko Elektronik Makmur',
          address: 'Jl. Malioboro No. 10',
          category: 'Retail',
          city: 'Yogyakarta',
          phone: '08198765432',
          tagline: 'Solusi Elektronik Terbaik',
          brandingContent: {
            heroTitle: 'Pusat Elektronik Terlengkap',
          },
          themeConfig: {
            themeColor: '#1d4ed8',
          },
        },
        products: [
          {
            name: 'Smartphone Pro Max',
            basePrice: 'Rp 15.000.000',
            categoryName: 'Smartphone',
            description: 'Smartphone canggih generasi terbaru',
            originalPrice: 16000000,
            variants: [
              {
                name: 'Storage',
                options: [
                  { label: '128 GB', priceModifier: 0 },
                  { label: '256 GB', priceModifier: 'Rp 2.000.000' },
                ],
              },
            ],
          },
        ],
      }

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify(mockGeminiJson),
                  },
                ],
              },
            },
          ],
        }),
      } as Response)

      const result = await generateWithGemini({ name: 'Toko Elektronik Makmur' })
      expect(result.business.name).toBe('Toko Elektronik Makmur')
      expect(result.products[0].basePrice).toBe(15000000)
      expect(result.products[0].variants[0].options[1].priceModifier).toBe(2000000)
    })

    it('throws error when Gemini API returns non-ok status', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Resource has been exhausted (e.g. check quota)',
      } as Response)

      await expect(generateWithGemini({ name: 'Toko Test' })).rejects.toThrow(
        'Google Gemini API error (429)',
      )
    })

    it('throws error when Gemini returns empty or non-JSON candidate content', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'NOT VALID JSON' }],
              },
            },
          ],
        }),
      } as Response)

      await expect(generateWithGemini({ name: 'Toko Test' })).rejects.toThrow(
        'Failed to parse Gemini JSON output',
      )
    })
  })
})
