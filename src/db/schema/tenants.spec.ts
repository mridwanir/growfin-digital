import type {
  CatalogSectionContent,
  FooterSectionContent,
  GallerySectionContent,
  HeroSectionContent,
  OperatingHoursSectionContent,
  ReviewsSectionContent,
  SectionType,
  StorefrontConfig,
  StorefrontConfigStatus,
  StorefrontSection,
  StorefrontTheme,
  Tenant,
} from './tenants'

import { getTableColumns } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import { describe, expect, expectTypeOf, it } from 'vitest'

import * as schemaIndex from './index'
import { relations } from './relations'
import { storefrontConfigs, tenants } from './tenants'

describe('Tenants schema decomposition', () => {
  it('removes fomoExpiresAt, themeConfig, and brandingContent from tenants table columns', () => {
    const columns = getTableColumns(tenants)
    const columnNames = Object.keys(columns)
    const sqlColumnNames = Object.values(columns).map(col => col.name)

    expect(columnNames).not.toContain('brandingContent')
    expect(columnNames).not.toContain('themeConfig')
    expect(columnNames).not.toContain('fomoExpiresAt')

    expect(sqlColumnNames).not.toContain('branding_content')
    expect(sqlColumnNames).not.toContain('theme_config')
    expect(sqlColumnNames).not.toContain('fomo_expires_at')
  })

  it('retains core business columns on tenants table', () => {
    const columns = getTableColumns(tenants)
    const columnNames = Object.keys(columns)

    expect(columnNames).toContain('id')
    expect(columnNames).toContain('slug')
    expect(columnNames).toContain('name')
    expect(columnNames).toContain('category')
    expect(columnNames).toContain('phone')
    expect(columnNames).toContain('city')
    expect(columnNames).toContain('address')
    expect(columnNames).toContain('googleMapsUrl')
    expect(columnNames).toContain('customDomain')
    expect(columnNames).toContain('operatingHours')
    expect(columnNames).toContain('packageTier')
    expect(columnNames).toContain('userId')
    expect(columnNames).toContain('organizationId')
    expect(columnNames).toContain('createdAt')
    expect(columnNames).toContain('updatedAt')
    expect(columnNames).toContain('status')
  })
})

describe('StorefrontConfigs schema declaration', () => {
  it('declares storefront_configs table with required columns and defaults', () => {
    const columns = getTableColumns(storefrontConfigs)

    expect(columns).toHaveProperty('id')
    expect(columns).toHaveProperty('tenantId')
    expect(columns).toHaveProperty('status')
    expect(columns).toHaveProperty('theme')
    expect(columns).toHaveProperty('sections')
    expect(columns).toHaveProperty('updatedAt')

    expect(columns.id.dataType).toBe('string uuid')
    expect(columns.id.primary).toBe(true)

    expect(columns.tenantId.dataType).toBe('string uuid')
    expect(columns.tenantId.notNull).toBe(true)

    expect(columns.status.dataType).toBe('string')
    expect(columns.status.default).toBe('draft')

    expect(columns.theme.dataType).toBe('object json')
    expect(columns.sections.dataType).toBe('object json')
  })

  it('configures foreign key cascade deletion on tenantId', () => {
    const config = getTableConfig(storefrontConfigs)
    const matchingFk = config.foreignKeys.find(fk => {
      const referencedTable = fk.reference().foreignTable
      return getTableConfig(referencedTable).name === 'tenants' && fk.onDelete === 'cascade'
    })

    expect(matchingFk).toBeDefined()
    expect(matchingFk?.onDelete).toBe('cascade')
  })

  it('configures indexes on tenantId and unique (tenantId, status)', () => {
    const config = getTableConfig(storefrontConfigs)

    const tenantIdIndex = config.indexes.find(
      idx => idx.config.name === 'storefront_configs_tenant_id_idx',
    )
    expect(tenantIdIndex).toBeDefined()
    expect(tenantIdIndex?.config.unique).toBe(false)

    const tenantIdStatusUniqueIndex = config.indexes.find(
      idx => idx.config.name === 'storefront_configs_tenant_id_status_idx',
    )
    expect(tenantIdStatusUniqueIndex).toBeDefined()
    expect(tenantIdStatusUniqueIndex?.config.unique).toBe(true)
  })
})

describe('Storefront type contracts', () => {
  it('satisfies StorefrontSection and section content type definitions', () => {
    expectTypeOf<SectionType>().toEqualTypeOf<
      'hero' | 'catalog' | 'reviews' | 'gallery' | 'operating_hours' | 'footer'
    >()

    expectTypeOf<StorefrontConfigStatus>().toEqualTypeOf<'draft' | 'published'>()
    expectTypeOf<Tenant>().toEqualTypeOf<typeof tenants.$inferSelect>()

    const mockSection: StorefrontSection<HeroSectionContent> = {
      id: 'hero-1',
      type: 'hero',
      isVisible: true,
      sortOrder: 0,
      content: {
        showOperationalBadge: true,
        subtitle: 'Great food',
        title: 'Welcome',
      },
    }

    expect(mockSection.id).toBe('hero-1')
    expect(mockSection.type).toBe('hero')
    expect(mockSection.isVisible).toBe(true)

    expectTypeOf<StorefrontConfig['status']>().toEqualTypeOf<StorefrontConfigStatus>()
    expectTypeOf<StorefrontConfig['theme']>().toEqualTypeOf<StorefrontTheme>()
    expectTypeOf<StorefrontConfig['sections']>().toEqualTypeOf<StorefrontSection[]>()

    const catalogContent: CatalogSectionContent = {
      cardVariant: 'elevated',
      categoryVariant: 'pills',
      title: 'Our Menu',
    }
    expect(catalogContent.title).toBe('Our Menu')

    const reviewsContent: ReviewsSectionContent = {
      reviews: [{ authorName: 'Alice', rating: 5, text: 'Amazing service!' }],
      title: 'Customer Reviews',
    }
    expect(reviewsContent.reviews?.[0]?.rating).toBe(5)

    const galleryContent: GallerySectionContent = {
      title: 'Photo Gallery',
      images: [
        'https://example.com/img1.jpg',
        { caption: 'Interior', imageUrl: 'https://example.com/img2.jpg' },
      ],
    }
    expect(galleryContent.images?.length).toBe(2)

    const hoursContent: OperatingHoursSectionContent = {
      closeTime: '22:00',
      isOpen: true,
      openTime: '08:00',
      title: 'Hours',
    }
    expect(hoursContent.isOpen).toBe(true)

    const footerContent: FooterSectionContent = {
      socialLinks: { instagram: 'https://instagram.com/best' },
      tagline: 'Best in town',
    }
    expect(footerContent.tagline).toBe('Best in town')
  })
})

describe('Relations schema mapping', () => {
  it('links tenants to storefrontConfigs and storefrontConfigs to tenant', () => {
    expect(relations).toHaveProperty('storefrontConfigs')
    expect(relations).toHaveProperty('tenants')
    const tenantRelationKeys = Object.keys(relations.tenants.relations)
    expect(tenantRelationKeys).toContain('storefrontConfigs')

    const storefrontConfigRelationKeys = Object.keys(relations.storefrontConfigs.relations)
    expect(storefrontConfigRelationKeys).toContain('tenant')
  })
})

describe('Schema barrel export', () => {
  it('exports storefrontConfigs and related types from index.ts', () => {
    expect(schemaIndex).toHaveProperty('storefrontConfigs')
    expect(schemaIndex).toHaveProperty('tenants')
    expect(schemaIndex.storefrontConfigs).toBe(storefrontConfigs)
    expect(schemaIndex.tenants).toBe(tenants)
  })
})
