import type { MerchantTenantSummary, ProductWithVariants } from './types'

import { and, desc, eq, inArray } from 'drizzle-orm'

import { db } from '@/db'
import { member, organization } from '@/db/schema/auth'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { getTenantAnalyticsMetrics } from '@/features/analytics/server'
import { requireActiveTenantContext } from '@/features/auth/server'

import 'server-only'

/**
 * Returns all tenants owned by the given merchant user.
 */
export async function getMerchantTenants(userId: string): Promise<MerchantTenantSummary[]> {
  return db
    .select({
      id: organization.id,
      name: organization.name,
      address: organization.address,
      category: organization.category,
      city: organization.city,
      createdAt: organization.createdAt,
      customDomain: organization.customDomain,
      packageTier: organization.packageTier,
      phone: organization.phone,
      siteActiveUntil: organization.siteActiveUntil,
      slug: organization.slug,
      status: organization.status,
      updatedAt: organization.updatedAt,
    })
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId))
    .orderBy(desc(organization.createdAt))
}

/**
 * Returns a tenant matching both slug and userId, or null if not found.
 */
export async function getTenantBySlug(slug: string, userId: string) {
  if (!slug || !userId) {
    return null
  }

  const [tenant] = await db
    .select({
      id: organization.id,
      name: organization.name,
      address: organization.address,
      category: organization.category,
      city: organization.city,
      createdAt: organization.createdAt,
      customDomain: organization.customDomain,
      domainActiveUntil: organization.domainActiveUntil,
      googleMapsUrl: organization.googleMapsUrl,
      logo: organization.logo,
      metadata: organization.metadata,
      operatingHours: organization.operatingHours,
      packageTier: organization.packageTier,
      phone: organization.phone,
      siteActiveUntil: organization.siteActiveUntil,
      slug: organization.slug,
      status: organization.status,
      updatedAt: organization.updatedAt,
      userId: member.userId,
    })
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(and(eq(organization.slug, slug), eq(member.userId, userId)))
    .limit(1)

  return tenant ?? null
}

/**
 * Returns settings and branding content for a specific tenant owned by the user.
 */
export async function getTenantSettings(tenantId: string, userId: string) {
  const [tenant] = await db
    .select({
      id: organization.id,
      name: organization.name,
      address: organization.address,
      category: organization.category,
      city: organization.city,
      customDomain: organization.customDomain,
      domainActiveUntil: organization.domainActiveUntil,
      googleMapsUrl: organization.googleMapsUrl,
      operatingHours: organization.operatingHours,
      packageTier: organization.packageTier,
      phone: organization.phone,
      siteActiveUntil: organization.siteActiveUntil,
      slug: organization.slug,
      status: organization.status,
      updatedAt: organization.updatedAt,
      userId: member.userId,
    })
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(and(eq(organization.id, tenantId), eq(member.userId, userId)))
    .limit(1)

  return tenant ?? null
}

/**
 * Lists all categories for a given tenant.
 */
export async function getTenantCategories(tenantId: string, userId: string) {
  const tenant = await getTenantSettings(tenantId, userId)
  if (!tenant) return null

  return db
    .select()
    .from(categories)
    .where(eq(categories.organizationId, tenantId))
    .orderBy(categories.sortOrder, categories.name)
}

/**
 * Returns all products for a tenant with their variants and variant options.
 */
export async function getTenantProducts(
  tenantId: string,
  userId: string,
): Promise<ProductWithVariants[] | null> {
  const tenant = await getTenantSettings(tenantId, userId)
  if (!tenant) return null

  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.organizationId, tenantId))
    .orderBy(products.sortOrder, desc(products.createdAt))
  if (productRows.length === 0) return []

  const productIds = productRows.map(p => p.id)
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, productIds))

  let optionRows: (typeof variantOptions.$inferSelect)[] = []
  if (variantRows.length > 0) {
    const variantIds = variantRows.map(v => v.id)
    optionRows = await db
      .select()
      .from(variantOptions)
      .where(inArray(variantOptions.variantId, variantIds))
      .orderBy(variantOptions.sortOrder)
  }

  const optionsByVariantId = new Map<string, (typeof variantOptions.$inferSelect)[]>()
  for (const opt of optionRows) {
    const list = optionsByVariantId.get(opt.variantId) || []
    list.push(opt)
    optionsByVariantId.set(opt.variantId, list)
  }

  const variantsByProductId = new Map<
    string,
    Array<
      typeof productVariants.$inferSelect & {
        options: (typeof variantOptions.$inferSelect)[]
      }
    >
  >()
  for (const v of variantRows) {
    const list = variantsByProductId.get(v.productId) || []
    list.push({
      ...v,
      options: optionsByVariantId.get(v.id) || [],
    })
    variantsByProductId.set(v.productId, list)
  }

  return productRows.map(p => ({
    ...p,
    tenantId: p.organizationId,
    variants: variantsByProductId.get(p.id) || [],
  }))
}

/**
 * Returns a single product by ID with variants and options.
 */
export async function getProductById(
  tenantId: string,
  userId: string,
  productId: string,
): Promise<ProductWithVariants | null> {
  const tenant = await getTenantSettings(tenantId, userId)
  if (!tenant) return null

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.organizationId, tenantId)))
    .limit(1)

  if (!product) return null

  const variantRows = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))

  let optionRows: (typeof variantOptions.$inferSelect)[] = []
  if (variantRows.length > 0) {
    const variantIds = variantRows.map(v => v.id)
    optionRows = await db
      .select()
      .from(variantOptions)
      .where(inArray(variantOptions.variantId, variantIds))
      .orderBy(variantOptions.sortOrder)
  }

  const optionsByVariantId = new Map<string, (typeof variantOptions.$inferSelect)[]>()
  for (const opt of optionRows) {
    const list = optionsByVariantId.get(opt.variantId) || []
    list.push(opt)
    optionsByVariantId.set(opt.variantId, list)
  }

  const variants = variantRows.map(v => ({
    ...v,
    options: optionsByVariantId.get(v.id) || [],
  }))

  return {
    ...product,
    tenantId: product.organizationId,
    variants,
  }
}

/**
 * Retrieves dashboard overview data including active tenant context and analytics metrics.
 */
export async function getDashboardOverviewData() {
  const context = await requireActiveTenantContext()
  const metrics = await getTenantAnalyticsMetrics(context.currentTenant.id, context.session.user.id)

  return {
    ...context,
    metrics: metrics ?? {
      checkoutCompletes: 0,
      checkoutStarts: 0,
      conversionRate: 0,
      pageViews: 0,
      topSources: [],
      uniqueVisitors: 0,
    },
  }
}
