import type { ProductWithVariants } from './catalog'
import type { Category } from '@/db/schema/catalog'
import type { StorefrontConfig } from '@/db/schema/storefront'
import type { Tenant } from '@/db/schema/tenants'

import { and, eq, inArray, or } from 'drizzle-orm'
import crypto from 'node:crypto'
import { cache } from 'react'

import { db } from '@/db'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { storefrontConfigs } from '@/db/schema/storefront'
import { tenants } from '@/db/schema/tenants'

import { DEFAULT_STOREFRONT_SECTIONS, DEFAULT_STOREFRONT_THEME } from './utils/compatibility'

import 'server-only'

export interface StorefrontData {
  categories: Category[]
  config: StorefrontConfig
  products: ProductWithVariants[]
  tenant: Tenant
}

/**
 * Loads complete relational tenant data (tenant, categories, products, variants, options) by slug
 * or custom domain from Neon PostgreSQL via Drizzle.
 *
 * Memoized per request using React.cache to deduplicate calls between generateMetadata and Page
 * RSC.
 */
export const getStorefrontDataBySlug = cache(
  async (slugOrDomain: string): Promise<StorefrontData | null> => {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(or(eq(tenants.slug, slugOrDomain), eq(tenants.customDomain, slugOrDomain)))
      .limit(1)

    if (!tenant) return null

    const [tenantCategories, tenantProducts, [publishedConfig]] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(eq(categories.organizationId, tenant.id))
        .orderBy(categories.sortOrder),
      db
        .select()
        .from(products)
        .where(eq(products.organizationId, tenant.id))
        .orderBy(products.sortOrder),
      db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.organizationId, tenant.id),
            eq(storefrontConfigs.status, 'published'),
          ),
        )
        .limit(1),
    ])

    const config: StorefrontConfig = publishedConfig ?? {
      id: crypto.randomUUID(),
      organizationId: tenant.id,
      sections: DEFAULT_STOREFRONT_SECTIONS,
      status: 'published',
      theme: DEFAULT_STOREFRONT_THEME,
      updatedAt: new Date(),
    }

    const productsWithVariants = await loadProductsWithVariants(tenantProducts)

    return {
      categories: tenantCategories,
      config,
      products: productsWithVariants,
      tenant,
    }
  },
)

async function loadProductsWithVariants(
  tenantProducts: (typeof products.$inferSelect)[],
): Promise<ProductWithVariants[]> {
  const productIds = tenantProducts.map(p => p.id)
  let variantsList: (typeof productVariants.$inferSelect)[] = []
  let optionsList: (typeof variantOptions.$inferSelect)[] = []

  if (productIds.length > 0) {
    variantsList = await db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds))

    const variantIds = variantsList.map(v => v.id)
    if (variantIds.length > 0) {
      optionsList = await db
        .select()
        .from(variantOptions)
        .where(inArray(variantOptions.variantId, variantIds))
        .orderBy(variantOptions.sortOrder)
    }
  }

  const optionsByVariantId = new Map<string, (typeof variantOptions.$inferSelect)[]>()
  for (const opt of optionsList) {
    const list = optionsByVariantId.get(opt.variantId) || []
    list.push(opt)
    optionsByVariantId.set(opt.variantId, list)
  }

  const variantsByProductId = new Map<
    string,
    (typeof productVariants.$inferSelect & {
      options: (typeof variantOptions.$inferSelect)[]
    })[]
  >()
  for (const v of variantsList) {
    const list = variantsByProductId.get(v.productId) || []
    list.push({
      ...v,
      options: optionsByVariantId.get(v.id) || [],
    })
    variantsByProductId.set(v.productId, list)
  }

  return tenantProducts.map(p => ({
    ...p,
    variants: variantsByProductId.get(p.id) || [],
  }))
}

/**
 * Loads relational tenant data with draft storefront configuration (falling back to published
 * config or default fallback) by slug or custom domain.
 *
 * Memoized per request using React.cache for deduplication.
 */
export const getStorefrontDraftDataBySlug = cache(
  async (slugOrDomain: string): Promise<StorefrontData | null> => {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(or(eq(tenants.slug, slugOrDomain), eq(tenants.customDomain, slugOrDomain)))
      .limit(1)

    if (!tenant) return null

    const [tenantCategories, tenantProducts, configs] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(eq(categories.organizationId, tenant.id))
        .orderBy(categories.sortOrder),
      db
        .select()
        .from(products)
        .where(eq(products.organizationId, tenant.id))
        .orderBy(products.sortOrder),
      db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.organizationId, tenant.id),
            inArray(storefrontConfigs.status, ['draft', 'published']),
          ),
        ),
    ])

    const draftConfig = configs.find(c => c.status === 'draft')
    const publishedConfig = configs.find(c => c.status === 'published')

    const config: StorefrontConfig = draftConfig ??
      publishedConfig ?? {
        id: crypto.randomUUID(),
        organizationId: tenant.id,
        sections: DEFAULT_STOREFRONT_SECTIONS,
        status: 'draft',
        theme: DEFAULT_STOREFRONT_THEME,
        updatedAt: new Date(),
      }

    const productsWithVariants = await loadProductsWithVariants(tenantProducts)

    return {
      categories: tenantCategories,
      config,
      products: productsWithVariants,
      tenant,
    }
  },
)
