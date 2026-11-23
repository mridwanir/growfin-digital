import type {
  HeroSectionContent,
  SectionType,
  StorefrontConfigStatus,
  StorefrontSection,
  Tenant,
  tenants,
} from './tenants'

import { getTableColumns } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import { describe, expect, expectTypeOf, it } from 'vitest'

import * as schemaIndex from './index'
import { storefrontConfigs } from './tenants'

describe('StorefrontConfigs schema declaration', () => {
  it('declares storefront_configs table with required columns and defaults', () => {
    const columns = getTableColumns(storefrontConfigs)

    expect(columns).toHaveProperty('id')
    expect(columns).toHaveProperty('organizationId')
    expect(columns).toHaveProperty('status')
    expect(columns).toHaveProperty('theme')
    expect(columns).toHaveProperty('sections')
    expect(columns).toHaveProperty('updatedAt')

    expect(columns.id.dataType).toBe('string uuid')
    expect(columns.id.primary).toBe(true)

    expect(columns.organizationId.dataType).toBe('string')
    expect(columns.organizationId.notNull).toBe(true)

    expect(columns.status.dataType).toBe('string')
    expect(columns.status.default).toBe('draft')

    expect(columns.theme.dataType).toBe('object json')
    expect(columns.sections.dataType).toBe('object json')
  })

  it('configures foreign key cascade deletion on organizationId', () => {
    const config = getTableConfig(storefrontConfigs)
    const matchingFk = config.foreignKeys.find(fk => {
      const referencedTable = fk.reference().foreignTable
      return getTableConfig(referencedTable).name === 'organization' && fk.onDelete === 'cascade'
    })

    expect(matchingFk).toBeDefined()
    expect(matchingFk?.onDelete).toBe('cascade')
  })

  it('configures indexes on organizationId and unique (organizationId, status)', () => {
    const config = getTableConfig(storefrontConfigs)

    const orgIdIndex = config.indexes.find(
      idx => idx.config.name === 'storefront_configs_organization_id_idx',
    )
    expect(orgIdIndex).toBeDefined()
    expect(orgIdIndex?.config.unique).toBe(false)

    const orgIdStatusUniqueIndex = config.indexes.find(
      idx => idx.config.name === 'storefront_configs_organization_id_status_idx',
    )
    expect(orgIdStatusUniqueIndex).toBeDefined()
    expect(orgIdStatusUniqueIndex?.config.unique).toBe(true)
  })
})

describe('Storefront type contracts', () => {
  it('satisfies StorefrontSection and section content type definitions', () => {
    expectTypeOf<SectionType>().toEqualTypeOf<
      'hero' | 'catalog' | 'reviews' | 'gallery' | 'operating_hours' | 'footer'
    >()

    expectTypeOf<StorefrontConfigStatus>().toEqualTypeOf<'draft' | 'published'>()
    expectTypeOf<typeof tenants.$inferSelect>().toMatchTypeOf<Tenant>()

    const mockSection: StorefrontSection<HeroSectionContent> = {
      id: 'sec-1',
      type: 'hero',
      isVisible: true,
      sortOrder: 1,
      content: {
        title: 'Title',
      },
    }
    expect(mockSection.type).toBe('hero')
  })
})

describe('Schema barrel export', () => {
  it('exports storefrontConfigs and related types from index.ts', () => {
    expect(schemaIndex).toHaveProperty('storefrontConfigs')
    expect(schemaIndex).toHaveProperty('organization')
    expect(schemaIndex.storefrontConfigs).toBe(storefrontConfigs)
  })
})
