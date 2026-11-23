import type {
  BrandingContent,
  OperatingHours,
  PackageTier,
  StorefrontConfig,
  StorefrontSection,
  StorefrontTheme,
  Tenant,
  TenantStatus,
  ThemeConfig,
} from '@/db/schema/tenants'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { orders } from '@/db/schema/orders'
import { storefrontConfigs, tenants } from '@/db/schema/tenants'
import {
  DEFAULT_STOREFRONT_SECTIONS,
  DEFAULT_STOREFRONT_THEME,
} from '@/lib/storefront/compatibility'

export const DEFAULT_TEST_THEME: StorefrontTheme = DEFAULT_STOREFRONT_THEME
export const DEFAULT_TEST_SECTIONS: StorefrontSection[] = DEFAULT_STOREFRONT_SECTIONS

export interface CreateTestTenantOptions {
  id?: string
  name?: string
  address?: string | null
  brandingContent?: BrandingContent
  category?: string
  city?: string | null
  customDomain?: string | null
  domainActiveUntil?: Date | null
  fomoExpiresAt?: Date | null
  googleMapsUrl?: string | null
  operatingHours?: OperatingHours
  organizationId?: string | null
  packageTier?: PackageTier
  phone?: string | null
  siteActiveUntil?: Date | null
  slug?: string
  status?: TenantStatus
  themeConfig?: ThemeConfig
  userId?: string | null
  // Storefront config overrides
  theme?: StorefrontTheme
  sections?: StorefrontSection[]
  draftTheme?: StorefrontTheme
  draftSections?: StorefrontSection[]
}

export interface TestTenantFixture {
  cleanup: () => Promise<void>
  slug: string
  tenant: Tenant
  tenantId: string
  publishedConfig: StorefrontConfig
  draftConfig: StorefrontConfig
}

export async function createTestTenant(
  options: CreateTestTenantOptions = {},
): Promise<TestTenantFixture> {
  const uniqueId = crypto.randomUUID()
  const slug = options.slug ?? `test-${uniqueId.slice(0, 8)}`

  const [tenant] = await db
    .insert(tenants)
    .values({
      ...(options.id ? { id: options.id } : {}),
      name: options.name ?? `Store ${uniqueId.slice(0, 8)}`,
      address: options.address ?? null,
      category: options.category ?? 'Food & Beverage',
      city: options.city ?? null,
      customDomain: options.customDomain ?? null,
      domainActiveUntil: options.domainActiveUntil ?? null,
      googleMapsUrl: options.googleMapsUrl ?? null,
      operatingHours: options.operatingHours ?? {},
      organizationId: options.organizationId ?? null,
      packageTier: options.packageTier ?? 'instant',
      phone: options.phone ?? null,
      siteActiveUntil: options.siteActiveUntil ?? null,
      slug,
      status: options.status ?? 'published',
      userId: options.userId ?? null,
    })
    .returning()

  const insertedConfigs = await db
    .insert(storefrontConfigs)
    .values([
      {
        sections: options.sections ?? DEFAULT_TEST_SECTIONS,
        status: 'published',
        tenantId: tenant.id,
        theme: options.theme ?? DEFAULT_TEST_THEME,
      },
      {
        sections: options.draftSections ?? options.sections ?? DEFAULT_TEST_SECTIONS,
        status: 'draft',
        tenantId: tenant.id,
        theme: options.draftTheme ?? options.theme ?? DEFAULT_TEST_THEME,
      },
    ])
    .returning()

  const publishedConfig = insertedConfigs.find(c => c.status === 'published')!
  const draftConfig = insertedConfigs.find(c => c.status === 'draft')!

  const cleanup = async () => {
    // Delete in reverse foreign-key dependency order
    await db.delete(storefrontConfigs).where(eq(storefrontConfigs.tenantId, tenant.id))
    await db.delete(analyticsEvents).where(eq(analyticsEvents.tenantId, tenant.id))
    await db.delete(orders).where(eq(orders.tenantId, tenant.id))

    const tenantProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.tenantId, tenant.id))

    for (const p of tenantProducts) {
      const variants = await db
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.productId, p.id))

      for (const v of variants) {
        await db.delete(variantOptions).where(eq(variantOptions.variantId, v.id))
      }
      await db.delete(productVariants).where(eq(productVariants.productId, p.id))
    }

    await db.delete(products).where(eq(products.tenantId, tenant.id))
    await db.delete(categories).where(eq(categories.tenantId, tenant.id))
    await db.delete(tenants).where(eq(tenants.id, tenant.id))
  }

  return {
    cleanup,
    draftConfig,
    publishedConfig,
    slug,
    tenant,
    tenantId: tenant.id,
  }
}
