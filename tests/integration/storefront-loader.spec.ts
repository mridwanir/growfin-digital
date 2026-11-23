import type { StorefrontSection, StorefrontTheme } from '@/db/schema/tenants'

import { eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { afterAll, describe, expect, it } from 'vitest'

import { db } from '@/db'
import { storefrontConfigs, tenants } from '@/db/schema/tenants'
import { getStorefrontDataBySlug } from '@/lib/storefront/loader'

import { createTestTenant } from '../fixtures/tenant-fixture'

describe('Storefront Loader & Config Integration (Ticket 04)', () => {
  const createdTenantIds: string[] = []

  afterAll(async () => {
    for (const id of createdTenantIds) {
      await db.delete(tenants).where(eq(tenants.id, id))
    }
  })

  it('fetches the published storefront configuration for the resolved tenant', async () => {
    const publishedTheme: StorefrontTheme = {
      fontFamily: 'font-serif',
      layoutId: 'classic',
      themeColor: '#7c3aed',
    }
    const publishedSections: StorefrontSection[] = [
      {
        id: 'sec-hero-1',
        type: 'hero',
        isVisible: true,
        sortOrder: 1,
        content: {
          subtitle: 'Koleksi busana terbaik',
          title: 'Butik Cantik Published',
        },
      },
      {
        id: 'sec-catalog-1',
        type: 'catalog',
        isVisible: true,
        sortOrder: 2,
        content: {
          title: 'Katalog Pilihan',
        },
      },
    ]

    const fixture = await createTestTenant({
      name: 'Published Config Store',
      sections: publishedSections,
      theme: publishedTheme,
    })
    createdTenantIds.push(fixture.tenantId)

    const data = await getStorefrontDataBySlug(fixture.slug)

    expect(data).not.toBeNull()
    expect(data?.tenant.id).toBe(fixture.tenantId)
    expect(data?.config).toBeDefined()
    expect(data?.config.status).toBe('published')
    expect(data?.config.theme).toEqual(publishedTheme)
    expect(data?.config.sections).toEqual(publishedSections)
  })

  it('does not alter returned config or sections in public loader when draft records are updated', async () => {
    const publishedTheme: StorefrontTheme = {
      fontFamily: 'font-sans',
      layoutId: 'modern',
      themeColor: '#10b981',
    }
    const publishedSections: StorefrontSection[] = [
      {
        id: 'sec-hero-pub',
        type: 'hero',
        isVisible: true,
        sortOrder: 1,
        content: {
          subtitle: 'Published Subtitle',
          title: 'Published Hero Title',
        },
      },
    ]

    const draftTheme: StorefrontTheme = {
      fontFamily: 'font-mono',
      layoutId: 'tech',
      themeColor: '#ef4444',
    }
    const draftSections: StorefrontSection[] = [
      {
        id: 'sec-hero-draft',
        type: 'hero',
        isVisible: true,
        sortOrder: 1,
        content: {
          subtitle: 'Unpublished Draft Subtitle',
          title: 'DRAFT IN PROGRESS - DO NOT SHOW PUBLIC',
        },
      },
    ]

    const fixture = await createTestTenant({
      name: 'Draft Isolation Store',
      draftSections,
      draftTheme,
      sections: publishedSections,
      theme: publishedTheme,
    })
    createdTenantIds.push(fixture.tenantId)

    // Update the draft config in the database
    await db
      .update(storefrontConfigs)
      .set({
        updatedAt: new Date(),
        sections: [
          {
            id: 'sec-hero-draft-mutated',
            type: 'hero',
            isVisible: false,
            sortOrder: 1,
            content: {
              subtitle: 'Mutated Draft Subtitle',
              title: 'MUTATED DRAFT TITLE',
            },
          },
        ],
        theme: {
          ...draftTheme,
          themeColor: '#eab308',
        },
      })
      .where(eq(storefrontConfigs.id, fixture.draftConfig.id))

    // Public loader must only return published data
    const data = await getStorefrontDataBySlug(fixture.slug)

    expect(data).not.toBeNull()
    expect(data?.config).toBeDefined()
    expect(data?.config.status).toBe('published')
    expect(data?.config.theme).toEqual(publishedTheme)
    expect(data?.config.sections).toEqual(publishedSections)

    // Verify draft content is not present
    const heroSection = data?.config.sections.find(s => s.type === 'hero')
    const heroContent = heroSection?.content
    const heroTitle =
      heroContent && typeof heroContent === 'object' && 'title' in heroContent
        ? heroContent.title
        : undefined
    expect(heroTitle).toBe('Published Hero Title')
    expect(heroTitle).not.toBe('MUTATED DRAFT TITLE')
  })

  it('returns default fallback config when no published config exists in database', async () => {
    // Insert a bare tenant without any storefront_configs
    const bareSlug = `bare-tenant-${crypto.randomUUID().slice(0, 8)}`
    const [bareTenant] = await db
      .insert(tenants)
      .values({
        name: 'Bare Store Without Config',
        category: 'Food & Beverage',
        packageTier: 'free',
        slug: bareSlug,
        status: 'published',
      })
      .returning()
    createdTenantIds.push(bareTenant.id)

    const data = await getStorefrontDataBySlug(bareSlug)

    expect(data).not.toBeNull()
    expect(data?.tenant.id).toBe(bareTenant.id)
    expect(data?.config).toBeDefined()
    expect(data?.config.status).toBe('published')
    expect(data?.config.tenantId).toBe(bareTenant.id)
    expect(data?.config.theme).toBeDefined()
    expect(Array.isArray(data?.config.sections)).toBe(true)
    expect(data?.config.sections.length).toBeGreaterThan(0)

    // Ensure hero section is present in fallback sections
    const heroSection = data?.config.sections.find(s => s.type === 'hero')
    expect(heroSection).toBeDefined()
  })

  it('resolves published config by custom domain', async () => {
    const customDomain = `store-${crypto.randomUUID().slice(0, 8)}.example.com`
    const fixture = await createTestTenant({
      name: 'Custom Domain Store',
      customDomain,
    })
    createdTenantIds.push(fixture.tenantId)

    const data = await getStorefrontDataBySlug(customDomain)

    expect(data).not.toBeNull()
    expect(data?.tenant.id).toBe(fixture.tenantId)
    expect(data?.config.status).toBe('published')
  })
})
