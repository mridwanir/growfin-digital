import type { GeneratedWebsiteData } from '@/features/generator/server'

import { eq } from 'drizzle-orm'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import SitePage, {
  generateMetadata as generateSiteMetadata,
} from '@/app/(storefront)/site/[slug]/page'
import { db } from '@/db'
import { tenants } from '@/db/schema/tenants'
import { persistGeneratedWebsite } from '@/features/generator/server'
import { ExpiredSiteScreen } from '@/features/storefront'
import { getStorefrontDataBySlug } from '@/features/storefront/server'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

const mockWebsiteData: GeneratedWebsiteData = {
  categories: [{ name: 'Espresso Based', sortOrder: 0 }],
  business: {
    name: 'Kopi Senja Nusantara',
    address: 'Jl. Merdeka No. 10',
    category: 'Coffee Shop & Cafe',
    city: 'Bandung',
    googleMapsUrl: 'https://maps.google.com/?cid=storefront-rsc-test',
    phone: '081234567890',
    brandingContent: {
      heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      iconEmoji: '☕',
      marketingUsps: [{ desc: '100% Arabika', title: 'Biji Pilihan' }],
      tagline: 'Kopi Terbaik Sejak 2020',
      themeColor: '#00b894',
    },
    operatingHours: {
      closeTime: '22:00',
      openTime: '08:00',
      text: 'Setiap Hari 08:00 - 22:00',
    },
    themeConfig: {
      fbType: 'DINE_IN',
      layoutId: 'fnb-theme-classic',
      themeColor: '#00b894',
    },
  },
  products: [
    {
      name: 'Kopi Susu Gula Aren',
      basePrice: 22000,
      categoryName: 'Espresso Based',
      description: 'Espresso shot dengan susu segar dan gula aren asli.',
      imageGallery: [],
      originalPrice: 25000,
      sortOrder: 0,
      specifications: [],
      variants: [
        {
          name: 'Ukuran',
          required: false,
          options: [
            { label: 'Regular', priceModifier: 0, sortOrder: 0 },
            { label: 'Large', priceModifier: 5000, sortOrder: 1 },
          ],
        },
      ],
    },
  ],
}

describe('storefront RSC Loader & Page Rendering (Seam 2)', () => {
  const createdTenantIds: string[] = []

  beforeAll(async () => {
    await db.delete(tenants).where(eq(tenants.googleMapsUrl, 'https://maps.google.com/?cid=123'))
  })

  afterEach(async () => {
    for (const id of createdTenantIds) {
      await db.delete(tenants).where(eq(tenants.id, id))
    }
    createdTenantIds.length = 0
  })

  describe('data Loader Seam', () => {
    it('returns null for non-existent slug in getStorefrontDataBySlug', async () => {
      const data = await getStorefrontDataBySlug('non-existent-tenant-xyz')
      expect(data).toBeNull()
    })

    it('queries tenant, categories, and products with variants by slug', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)
      const slug = persisted.tenant.slug

      const data = await getStorefrontDataBySlug(slug)
      expect(data).not.toBeNull()
      expect(data?.tenant.name).toBe('Kopi Senja Nusantara')
      expect(data?.categories.length).toBeGreaterThan(0)
      const product = data?.products[0]
      expect(product).toBeDefined()
      expect(product?.variants?.length).toBeGreaterThan(0)
    })

    it('queries tenant by customDomain', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)
      const customDomain = `custom-${persisted.tenant.slug}.com`

      await db.update(tenants).set({ customDomain }).where(eq(tenants.id, persisted.tenant.id))

      const data = await getStorefrontDataBySlug(customDomain)
      expect(data).not.toBeNull()
      expect(data?.tenant.id).toBe(persisted.tenant.id)
    })
  })

  describe('metadata Generation Seam', () => {
    it('generates site metadata with canonical URL and OpenGraph for published tenant', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)
      await db
        .update(tenants)
        .set({ status: 'published' })
        .where(eq(tenants.id, persisted.tenant.id))

      const meta = await generateSiteMetadata({
        params: Promise.resolve({ slug: persisted.tenant.slug }),
      })
      expect(meta.description).toContain('Kopi Terbaik Sejak 2020')
      expect(meta.openGraph).toBeDefined()
      expect(meta.title).toEqual({
        default: 'Kopi Senja Nusantara | Website Resmi',
        template: '%s | Kopi Senja Nusantara',
      })
    })

    it('returns Site Not Found metadata for draft tenant on site route', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)

      const meta = await generateSiteMetadata({
        params: Promise.resolve({ slug: persisted.tenant.slug }),
      })
      expect(meta.title).toBe('Site Not Found')
    })

    it('returns maintenance robots noindex for locked tenant', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)
      await db.update(tenants).set({ status: 'locked' }).where(eq(tenants.id, persisted.tenant.id))

      const meta = await generateSiteMetadata({
        params: Promise.resolve({ slug: persisted.tenant.slug }),
      })
      expect(meta.robots).toEqual({ follow: false, index: false })
      expect(meta.title).toContain('Masa Pembaruan Layanan')
    })
  })

  describe('publication Status & RSC Route Enforcement', () => {
    it('triggers notFound() when SitePage encounters non-existent tenant', async () => {
      await expect(
        SitePage({ params: Promise.resolve({ slug: 'ghost-tenant-404' }) }),
      ).rejects.toThrow('NEXT_NOT_FOUND')
    })

    it('triggers notFound() on SitePage when tenant is still draft status', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)

      await expect(
        SitePage({ params: Promise.resolve({ slug: persisted.tenant.slug }) }),
      ).rejects.toThrow('NEXT_NOT_FOUND')
    })

    it('renders ExpiredSiteScreen on SitePage when tenant is locked', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)
      await db.update(tenants).set({ status: 'locked' }).where(eq(tenants.id, persisted.tenant.id))

      const element = await SitePage({ params: Promise.resolve({ slug: persisted.tenant.slug }) })
      expect(element).toBeDefined()
      expect(element.type).toBe(ExpiredSiteScreen)
    })

    it('renders ExpiredSiteScreen on SitePage when siteActiveUntil is in the past', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      await db
        .update(tenants)
        .set({ siteActiveUntil: pastDate, status: 'published' })
        .where(eq(tenants.id, persisted.tenant.id))

      const element = await SitePage({ params: Promise.resolve({ slug: persisted.tenant.slug }) })
      expect(element).toBeDefined()
      expect(element.type).toBe(ExpiredSiteScreen)
    })

    it('renders storefront successfully on SitePage for published tenant with RSC islands', async () => {
      const persisted = await persistGeneratedWebsite(mockWebsiteData)
      createdTenantIds.push(persisted.tenant.id)
      await db
        .update(tenants)
        .set({ status: 'published' })
        .where(eq(tenants.id, persisted.tenant.id))

      const element = await SitePage({ params: Promise.resolve({ slug: persisted.tenant.slug }) })
      expect(element).toBeDefined()
      expect(element.type).not.toBe(ExpiredSiteScreen)

      const markup = renderToStaticMarkup(element)
      expect(markup).toContain('Kopi Senja Nusantara')
      expect(markup).toContain('Kopi Susu Gula Aren')
      expect(markup).toContain('application/ld+json')
      expect(markup).toContain('CafeOrCoffeeShop')
    })
  })
})
