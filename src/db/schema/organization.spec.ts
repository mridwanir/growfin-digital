import { getTableColumns } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'

import { analyticsEvents } from './analytics'
import { invitation, member, organization, session } from './auth'
import { categories, products } from './catalog'
import * as schemaIndex from './index'
import { orders } from './orders'
import { relations } from './relations'
import { storefrontConfigs } from './storefront'

describe('Organization schema definition (Issue 12)', () => {
  it('defines organization table in public schema with Better Auth and custom store columns', () => {
    const tableConfig = getTableConfig(organization)
    expect(tableConfig.name).toBe('organization')
    expect(tableConfig.schema).toBeUndefined() // public schema

    const columns = getTableColumns(organization)

    // Core Better Auth columns
    expect(columns).toHaveProperty('id')
    expect(columns.id.dataType).toBe('string')
    expect(columns.id.primary).toBe(true)

    expect(columns).toHaveProperty('name')
    expect(columns.name.notNull).toBe(true)

    expect(columns).toHaveProperty('slug')
    expect(columns.slug.notNull).toBe(true)
    expect(columns.slug.isUnique).toBe(true)

    expect(columns).toHaveProperty('logo')
    expect(columns).toHaveProperty('metadata')
    expect(columns).toHaveProperty('createdAt')

    // Custom store fields
    expect(columns).toHaveProperty('category')
    expect(columns.category.dataType).toBe('string')

    expect(columns).toHaveProperty('packageTier')
    expect(columns.packageTier.dataType).toBe('string')
    expect(columns.packageTier.default).toBe('free')

    expect(columns).toHaveProperty('customDomain')
    expect(columns.customDomain.isUnique).toBe(true)

    expect(columns).toHaveProperty('domainActiveUntil')
    expect(columns).toHaveProperty('siteActiveUntil')

    expect(columns).toHaveProperty('operatingHours')
    expect(columns.operatingHours.dataType).toBe('object json')

    expect(columns).toHaveProperty('phone')
    expect(columns).toHaveProperty('city')
    expect(columns).toHaveProperty('address')
    expect(columns).toHaveProperty('googleMapsUrl')

    expect(columns).toHaveProperty('status')
    expect(columns.status.dataType).toBe('string')
    expect(columns.status.default).toBe('draft')

    expect(columns).toHaveProperty('updatedAt')
  })

  it('defines member table in public schema referencing organization and user with cascade delete', () => {
    const tableConfig = getTableConfig(member)
    expect(tableConfig.name).toBe('member')
    expect(tableConfig.schema).toBeUndefined()

    const columns = getTableColumns(member)
    expect(columns).toHaveProperty('id')
    expect(columns).toHaveProperty('organizationId')
    expect(columns).toHaveProperty('userId')
    expect(columns).toHaveProperty('role')
    expect(columns).toHaveProperty('createdAt')

    expect(columns.organizationId.dataType).toBe('string')
    expect(columns.userId.dataType).toBe('string')

    const orgFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'organization' && fk.onDelete === 'cascade'
    })
    expect(orgFk).toBeDefined()

    const userFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'user' && fk.onDelete === 'cascade'
    })
    expect(userFk).toBeDefined()
  })

  it('defines invitation table in public schema referencing organization and user', () => {
    const tableConfig = getTableConfig(invitation)
    expect(tableConfig.name).toBe('invitation')
    expect(tableConfig.schema).toBeUndefined()

    const columns = getTableColumns(invitation)
    expect(columns).toHaveProperty('id')
    expect(columns).toHaveProperty('organizationId')
    expect(columns).toHaveProperty('email')
    expect(columns).toHaveProperty('role')
    expect(columns).toHaveProperty('status')
    expect(columns).toHaveProperty('expiresAt')
    expect(columns).toHaveProperty('inviterId')
    expect(columns).toHaveProperty('createdAt')

    const orgFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'organization' && fk.onDelete === 'cascade'
    })
    expect(orgFk).toBeDefined()

    const userFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'user' && fk.onDelete === 'cascade'
    })
    expect(userFk).toBeDefined()
  })

  it('extends session table with activeOrganizationId', () => {
    const columns = getTableColumns(session)
    expect(columns).toHaveProperty('activeOrganizationId')
  })
})

describe('Foreign key migration to organizationId (Issue 12)', () => {
  it('updates storefront_configs to reference organizationId with cascade deletion', () => {
    const columns = getTableColumns(storefrontConfigs)
    expect(columns).toHaveProperty('organizationId')
    expect(columns).not.toHaveProperty('tenantId')
    expect(columns.organizationId.dataType).toBe('string')
    expect(columns.organizationId.notNull).toBe(true)

    const tableConfig = getTableConfig(storefrontConfigs)
    const orgFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'organization' && fk.onDelete === 'cascade'
    })
    expect(orgFk).toBeDefined()

    const orgIdIndex = tableConfig.indexes.find(
      idx => idx.config.name === 'storefront_configs_organization_id_idx',
    )
    expect(orgIdIndex).toBeDefined()

    const orgIdStatusUnique = tableConfig.indexes.find(
      idx => idx.config.name === 'storefront_configs_organization_id_status_idx',
    )
    expect(orgIdStatusUnique).toBeDefined()
    expect(orgIdStatusUnique?.config.unique).toBe(true)
  })

  it('updates categories to reference organizationId with cascade deletion', () => {
    const columns = getTableColumns(categories)
    expect(columns).toHaveProperty('organizationId')
    expect(columns).not.toHaveProperty('tenantId')
    expect(columns.organizationId.dataType).toBe('string')
    expect(columns.organizationId.notNull).toBe(true)

    const tableConfig = getTableConfig(categories)
    const orgFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'organization' && fk.onDelete === 'cascade'
    })
    expect(orgFk).toBeDefined()
  })

  it('updates products to reference organizationId with cascade deletion', () => {
    const columns = getTableColumns(products)
    expect(columns).toHaveProperty('organizationId')
    expect(columns).not.toHaveProperty('tenantId')
    expect(columns.organizationId.dataType).toBe('string')
    expect(columns.organizationId.notNull).toBe(true)

    const tableConfig = getTableConfig(products)
    const orgFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'organization' && fk.onDelete === 'cascade'
    })
    expect(orgFk).toBeDefined()
  })

  it('updates orders to reference organizationId and user table in public schema', () => {
    const columns = getTableColumns(orders)
    expect(columns).toHaveProperty('organizationId')
    expect(columns).not.toHaveProperty('tenantId')
    expect(columns.organizationId.dataType).toBe('string')
    expect(columns.organizationId.notNull).toBe(true)

    expect(columns).toHaveProperty('userId')
    expect(columns.userId.dataType).toBe('string')

    const tableConfig = getTableConfig(orders)
    const orgFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'organization' && fk.onDelete === 'cascade'
    })
    expect(orgFk).toBeDefined()

    const userFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'user' && fk.onDelete === 'set null'
    })
    expect(userFk).toBeDefined()
  })

  it('updates analytics_events to reference organizationId with cascade deletion', () => {
    const columns = getTableColumns(analyticsEvents)
    expect(columns).toHaveProperty('organizationId')
    expect(columns).not.toHaveProperty('tenantId')
    expect(columns.organizationId.dataType).toBe('string')
    expect(columns.organizationId.notNull).toBe(true)

    const tableConfig = getTableConfig(analyticsEvents)
    const orgFk = tableConfig.foreignKeys.find(fk => {
      const target = getTableConfig(fk.reference().foreignTable).name
      return target === 'organization' && fk.onDelete === 'cascade'
    })
    expect(orgFk).toBeDefined()
  })
})

describe('Standalone tenants table retirement', () => {
  it('does not export a standalone pgTable tenants table', () => {
    const exportedKeys = Object.keys(schemaIndex)
    // schemaIndex must export organization, member, invitation, storefrontConfigs
    expect(exportedKeys).toContain('organization')
    expect(exportedKeys).toContain('member')
    expect(exportedKeys).toContain('invitation')
    expect(exportedKeys).toContain('storefrontConfigs')

    expect(exportedKeys).not.toContain('tenants')
  })
})

describe('Relations schema mapping (Issue 12)', () => {
  it('maps organization relations to children and members', () => {
    expect(relations).toHaveProperty('organization')
    const relationsRecord = relations as unknown as Record<
      string,
      { relations: Record<string, unknown> }
    >
    const orgRelations = Object.keys(relationsRecord.organization.relations)
    expect(orgRelations).toContain('products')
    expect(orgRelations).toContain('orders')
    expect(orgRelations).toContain('storefrontConfigs')
    expect(orgRelations).toContain('analyticsEvents')
    expect(orgRelations).toContain('members')
  })

  it('maps storefrontConfigs relation to organization', () => {
    expect(relations).toHaveProperty('storefrontConfigs')
    const relationsRecord = relations as unknown as Record<
      string,
      { relations: Record<string, unknown> }
    >
    const configRelations = Object.keys(relationsRecord.storefrontConfigs.relations)
    expect(configRelations).toContain('organization')
  })
})
