import type { RelationalStorefrontInput } from './mapper'

import { eq, inArray, or } from 'drizzle-orm'
import { cache } from 'react'

import { db } from '@/db'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { tenants } from '@/db/schema/tenants'

/**
 * Loads complete relational tenant data (tenant, categories, products, variants, options) by slug
 * or custom domain from Neon PostgreSQL via Drizzle.
 *
 * Memoized per request using React.cache to deduplicate calls between generateMetadata and Page
 * RSC.
 */
export const getStorefrontDataBySlug = cache(
  async (slugOrDomain: string): Promise<RelationalStorefrontInput | null> => {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(or(eq(tenants.slug, slugOrDomain), eq(tenants.customDomain, slugOrDomain)))
      .limit(1)

    if (!tenant) return null

    const [tenantCategories, tenantProducts] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(eq(categories.tenantId, tenant.id))
        .orderBy(categories.sortOrder),
      db
        .select()
        .from(products)
        .where(eq(products.tenantId, tenant.id))
        .orderBy(products.sortOrder),
    ])

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

    const productsWithVariants = tenantProducts.map(p => ({
      ...p,
      variants: variantsByProductId.get(p.id) || [],
    }))

    return {
      categories: tenantCategories,
      products: productsWithVariants,
      tenant,
    }
  },
)
