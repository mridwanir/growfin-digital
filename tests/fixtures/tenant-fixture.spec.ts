import type { TestTenantFixture } from './tenant-fixture'

import { eq } from 'drizzle-orm'
import { afterEach, describe, expect, it } from 'vitest'

import { db } from '@/db'
import { storefrontConfigs, tenants } from '@/db/schema/tenants'

import { createTestTenant, DEFAULT_TEST_SECTIONS, DEFAULT_TEST_THEME } from './tenant-fixture'

describe('createTestTenant fixture', () => {
  let fixture: TestTenantFixture | null = null

  afterEach(async () => {
    if (fixture) {
      await fixture.cleanup()
      fixture = null
    }
  })

  it('seeds baseline published and draft storefront configurations for a tenant', async () => {
    fixture = await createTestTenant()

    expect(fixture.tenant).toBeDefined()
    expect(fixture.tenantId).toBe(fixture.tenant.id)
    expect(fixture.publishedConfig).toBeDefined()
    expect(fixture.publishedConfig.status).toBe('published')
    expect(fixture.publishedConfig.tenantId).toBe(fixture.tenantId)
    expect(fixture.publishedConfig.theme).toEqual(DEFAULT_TEST_THEME)
    expect(fixture.publishedConfig.sections).toEqual(DEFAULT_TEST_SECTIONS)

    expect(fixture.draftConfig).toBeDefined()
    expect(fixture.draftConfig.status).toBe('draft')
    expect(fixture.draftConfig.tenantId).toBe(fixture.tenantId)
    expect(fixture.draftConfig.theme).toEqual(DEFAULT_TEST_THEME)
    expect(fixture.draftConfig.sections).toEqual(DEFAULT_TEST_SECTIONS)

    // Verify records exist in DB
    const configsInDb = await db
      .select()
      .from(storefrontConfigs)
      .where(eq(storefrontConfigs.tenantId, fixture.tenantId))

    expect(configsInDb).toHaveLength(2)
    const publishedInDb = configsInDb.find(c => c.status === 'published')
    const draftInDb = configsInDb.find(c => c.status === 'draft')
    expect(publishedInDb).toBeDefined()
    expect(draftInDb).toBeDefined()
  })

  it('accepts storefront config overrides for theme and sections', async () => {
    const customTheme = {
      fontFamily: 'font-serif',
      layoutId: 'compact',
      themeColor: '#123456',
    }
    const customSections = [
      {
        id: 'sec-custom-hero',
        type: 'hero' as const,
        content: { title: 'Custom Store' },
        isVisible: true,
        sortOrder: 1,
      },
    ]
    const customDraftTheme = {
      fontFamily: 'font-mono',
      layoutId: 'modern',
      themeColor: '#654321',
    }
    const customDraftSections = [
      {
        id: 'sec-draft-hero',
        type: 'hero' as const,
        content: { title: 'Draft Custom Store' },
        isVisible: false,
        sortOrder: 1,
      },
    ]

    fixture = await createTestTenant({
      draftSections: customDraftSections,
      draftTheme: customDraftTheme,
      sections: customSections,
      theme: customTheme,
    })

    expect(fixture.publishedConfig.theme).toEqual(customTheme)
    expect(fixture.publishedConfig.sections).toEqual(customSections)
    expect(fixture.draftConfig.theme).toEqual(customDraftTheme)
    expect(fixture.draftConfig.sections).toEqual(customDraftSections)
  })

  it('cleanup removes storefront configs and tenant', async () => {
    fixture = await createTestTenant()
    const tenantId = fixture.tenantId

    await fixture.cleanup()
    fixture = null

    const tenantRows = await db.select().from(tenants).where(eq(tenants.id, tenantId))
    expect(tenantRows).toHaveLength(0)

    const configRows = await db
      .select()
      .from(storefrontConfigs)
      .where(eq(storefrontConfigs.tenantId, tenantId))
    expect(configRows).toHaveLength(0)
  })
})
