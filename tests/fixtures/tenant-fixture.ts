import type {
  BrandingContent,
  OperatingHours,
  PackageTier,
  Tenant,
  TenantStatus,
  ThemeConfig,
} from '@/db/schema/tenants'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { orders } from '@/db/schema/orders'
import { tenants } from '@/db/schema/tenants'

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
}

export interface TestTenantFixture {
  cleanup: () => Promise<void>
  slug: string
  tenant: Tenant
  tenantId: string
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
      brandingContent: options.brandingContent ?? {},
      category: options.category ?? 'Food & Beverage',
      city: options.city ?? null,
      customDomain: options.customDomain ?? null,
      domainActiveUntil: options.domainActiveUntil ?? null,
      fomoExpiresAt: options.fomoExpiresAt ?? null,
      googleMapsUrl: options.googleMapsUrl ?? null,
      operatingHours: options.operatingHours ?? {},
      organizationId: options.organizationId ?? null,
      packageTier: options.packageTier ?? 'instant',
      phone: options.phone ?? null,
      siteActiveUntil: options.siteActiveUntil ?? null,
      slug,
      status: options.status ?? 'published',
      themeConfig: options.themeConfig ?? {},
      userId: options.userId ?? null,
    })
    .returning()

  const cleanup = async () => {
    // Delete in reverse foreign-key dependency order
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
    slug,
    tenant,
    tenantId: tenant.id,
  }
}
