import type { OperatingHours, PackageTier, Tenant, TenantStatus } from '@/db/schema/auth'
import type {
  BrandingContent,
  StorefrontConfig,
  StorefrontSection,
  StorefrontTheme,
  ThemeConfig,
} from '@/db/schema/storefront'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { member, organization, user } from '@/db/schema/auth'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { orders } from '@/db/schema/orders'
import { storefrontConfigs } from '@/db/schema/storefront'
import { DEFAULT_STOREFRONT_SECTIONS, DEFAULT_STOREFRONT_THEME } from '@/features/storefront'

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
  organizationId: string
  publishedConfig: StorefrontConfig
  draftConfig: StorefrontConfig
}

export async function createTestTenant(
  options: CreateTestTenantOptions = {},
): Promise<TestTenantFixture> {
  const uniqueId = crypto.randomUUID()
  const slug = options.slug ?? `test-${uniqueId.slice(0, 8)}`

  const [tenant] = await db
    .insert(organization)
    .values({
      id: options.id ?? uniqueId,
      name: options.name ?? `Store ${uniqueId.slice(0, 8)}`,
      address: options.address ?? null,
      category: options.category ?? 'Food & Beverage',
      city: options.city ?? null,
      customDomain: options.customDomain ?? null,
      domainActiveUntil: options.domainActiveUntil ?? null,
      googleMapsUrl: options.googleMapsUrl ?? null,
      operatingHours: options.operatingHours ?? {},
      packageTier: options.packageTier ?? 'instant',
      phone: options.phone ?? null,
      siteActiveUntil: options.siteActiveUntil ?? null,
      slug,
      status: options.status ?? 'published',
    })
    .returning()

  if (options.userId) {
    const [existingUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, options.userId))
      .limit(1)
    if (!existingUser) {
      await db.insert(user).values({
        id: options.userId,
        name: 'Test Merchant',
        email: `${options.userId}@growfin.test`,
        emailVerified: true,
      })
    }
    await db.insert(member).values({
      id: crypto.randomUUID(),
      organizationId: tenant.id,
      role: 'owner',
      userId: options.userId,
    })
  }

  const insertedConfigs = await db
    .insert(storefrontConfigs)
    .values([
      {
        organizationId: tenant.id,
        sections: options.sections ?? DEFAULT_TEST_SECTIONS,
        status: 'published',
        theme: options.theme ?? DEFAULT_TEST_THEME,
      },
      {
        organizationId: tenant.id,
        sections: options.draftSections ?? options.sections ?? DEFAULT_TEST_SECTIONS,
        status: 'draft',
        theme: options.draftTheme ?? options.theme ?? DEFAULT_TEST_THEME,
      },
    ])
    .returning()

  const publishedConfig = insertedConfigs.find(c => c.status === 'published')!
  const draftConfig = insertedConfigs.find(c => c.status === 'draft')!

  const cleanup = async () => {
    // Delete in reverse foreign-key dependency order
    await db.delete(storefrontConfigs).where(eq(storefrontConfigs.organizationId, tenant.id))
    await db.delete(analyticsEvents).where(eq(analyticsEvents.organizationId, tenant.id))
    await db.delete(orders).where(eq(orders.organizationId, tenant.id))

    const tenantProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.organizationId, tenant.id))

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

    await db.delete(products).where(eq(products.organizationId, tenant.id))
    await db.delete(categories).where(eq(categories.organizationId, tenant.id))
    await db.delete(member).where(eq(member.organizationId, tenant.id))
    await db.delete(organization).where(eq(organization.id, tenant.id))
  }

  return {
    cleanup,
    draftConfig,
    organizationId: tenant.id,
    publishedConfig,
    slug,
    tenant,
    tenantId: tenant.id,
  }
}
