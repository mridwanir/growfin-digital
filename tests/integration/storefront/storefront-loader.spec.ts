import type { StorefrontSection, StorefrontTheme } from '@/db/schema/tenants'

import { and, eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { afterAll, describe, expect, it } from 'vitest'

import { db } from '@/db'
import { storefrontConfigs, tenants } from '@/db/schema/tenants'
import { getStorefrontDataBySlug, getStorefrontDraftDataBySlug } from '@/features/storefront/server'

import { createTestTenant } from '../../fixtures/tenant-fixture'

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
    expect(data?.config.organizationId).toBe(bareTenant.id)
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

  describe('getStorefrontDraftDataBySlug (Ticket 01)', () => {
    it('fetches draft storefront configuration when draft config is present', async () => {
      const publishedTheme: StorefrontTheme = {
        fontFamily: 'font-sans',
        layoutId: 'classic',
        themeColor: '#3b82f6',
      }
      const draftTheme: StorefrontTheme = {
        fontFamily: 'font-serif',
        layoutId: 'modern',
        themeColor: '#10b981',
      }
      const draftSections: StorefrontSection[] = [
        {
          id: 'sec-hero-draft',
          type: 'hero',
          isVisible: true,
          sortOrder: 1,
          content: {
            subtitle: 'Draft Subtitle',
            title: 'Draft Hero Title',
          },
        },
      ]

      const fixture = await createTestTenant({
        name: 'Draft Storefront Test',
        draftSections,
        draftTheme,
        theme: publishedTheme,
      })
      createdTenantIds.push(fixture.tenantId)

      const data = await getStorefrontDraftDataBySlug(fixture.slug)

      expect(data).not.toBeNull()
      expect(data?.tenant.id).toBe(fixture.tenantId)
      expect(data?.config).toBeDefined()
      expect(data?.config.status).toBe('draft')
      expect(data?.config.theme).toEqual(draftTheme)
      expect(data?.config.sections).toEqual(draftSections)
    })

    it('falls back to published configuration when no draft config exists', async () => {
      const publishedTheme: StorefrontTheme = {
        fontFamily: 'font-sans',
        layoutId: 'vibrant',
        themeColor: '#8b5cf6',
      }
      const publishedSections: StorefrontSection[] = [
        {
          id: 'sec-hero-published',
          type: 'hero',
          isVisible: true,
          sortOrder: 1,
          content: {
            title: 'Only Published Title',
          },
        },
      ]

      const fixture = await createTestTenant({
        name: 'Published Only Storefront',
        sections: publishedSections,
        theme: publishedTheme,
      })
      createdTenantIds.push(fixture.tenantId)
      // Delete the draft config so only the published config remains
      await db
        .delete(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.organizationId, fixture.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )

      const data = await getStorefrontDraftDataBySlug(fixture.slug)

      expect(data).not.toBeNull()
      expect(data?.tenant.id).toBe(fixture.tenantId)
      expect(data?.config).toBeDefined()
      expect(data?.config.status).toBe('published')
      expect(data?.config.theme).toEqual(publishedTheme)
      expect(data?.config.sections).toEqual(publishedSections)
    })

    it('falls back to default configuration when neither draft nor published config exists', async () => {
      const bareSlug = `bare-draft-tenant-${crypto.randomUUID().slice(0, 8)}`
      const [bareTenant] = await db
        .insert(tenants)
        .values({
          name: 'Bare Store Without Any Config',
          category: 'Retail & Fashion',
          packageTier: 'free',
          slug: bareSlug,
          status: 'draft',
        })
        .returning()
      createdTenantIds.push(bareTenant.id)

      const data = await getStorefrontDraftDataBySlug(bareSlug)

      expect(data).not.toBeNull()
      expect(data?.tenant.id).toBe(bareTenant.id)
      expect(data?.config).toBeDefined()
      expect(data?.config.organizationId).toBe(bareTenant.id)
      expect(data?.config.theme).toBeDefined()
      expect(Array.isArray(data?.config.sections)).toBe(true)
      expect(data?.config.sections.length).toBeGreaterThan(0)
    })

    it('resolves draft config by custom domain', async () => {
      const customDomain = `draft-store-${crypto.randomUUID().slice(0, 8)}.example.com`
      const draftTheme: StorefrontTheme = {
        layoutId: 'urban',
        themeColor: '#06b6d4',
      }
      const fixture = await createTestTenant({
        name: 'Custom Domain Draft Store',
        customDomain,
        draftTheme,
      })
      createdTenantIds.push(fixture.tenantId)

      const data = await getStorefrontDraftDataBySlug(customDomain)

      expect(data).not.toBeNull()
      expect(data?.tenant.id).toBe(fixture.tenantId)
      expect(data?.config.status).toBe('draft')
      expect(data?.config.theme).toEqual(draftTheme)
    })

    it('returns null when tenant is not found', async () => {
      const data = await getStorefrontDraftDataBySlug('non-existent-tenant-slug-12345')
      expect(data).toBeNull()
    })
  })
})
