import type { GeneratedWebsiteData } from './schema'
import type { Database } from '@/db'
import type { Organization } from '@/db/schema/auth'
import type { StorefrontSection, StorefrontTheme } from '@/db/schema/storefront'

import crypto from 'node:crypto'

import { db } from '@/db'
import { organization } from '@/db/schema/auth'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { storefrontConfigs } from '@/db/schema/storefront'

import { generateCategorySlug, generateTenantSlug } from './slug'

import 'server-only'

export interface PersistResult {
  categories: (typeof categories.$inferSelect)[]
  products: (typeof products.$inferSelect)[]
  tenant: Organization
}

/**
 * Persists the generated website draft atomically using a Drizzle database transaction. If any
 * insert fails, the transaction rolls back automatically.
 */
export async function persistGeneratedWebsite(
  data: GeneratedWebsiteData,
  database: Database = db,
): Promise<PersistResult> {
  const slug = generateTenantSlug(data.business.name)
  const fomoExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

  return database.transaction(async tx => {
    // 1. Insert tenant record
    const [insertedTenant] = await tx
      .insert(organization)
      .values({
        name: data.business.name,
        address: data.business.address || null,
        category: data.business.category,
        city: data.business.city || null,
        googleMapsUrl: data.business.googleMapsUrl || null,
        operatingHours: data.business.operatingHours,
        packageTier: 'free',
        phone: data.business.phone || null,
        siteActiveUntil: fomoExpiresAt,
        slug,
        status: 'draft',
      })
      .returning()

    if (!insertedTenant) {
      throw new Error('Failed to insert tenant record')
    }
    // 1b. Batch insert draft and published storefront configs
    const branding = data.business.brandingContent || {}
    const themeConfig = data.business.themeConfig || {}

    const sections: StorefrontSection[] = [
      {
        id: 'sec-hero',
        type: 'hero',
        isVisible: true,
        sortOrder: 1,
        content: {
          heroImageUrl: branding.heroImageUrl,
          iconEmoji: branding.iconEmoji,
          logoUrl: branding.logoUrl,
          subtitle: branding.tagline || branding.heroSubtitle || '',
          title: branding.heroTitle || data.business.name,
        },
      },
      {
        id: 'sec-catalog',
        type: 'catalog',
        isVisible: true,
        sortOrder: 2,
        content: {
          description: branding.menuDescription,
          title: branding.menuTitle || 'Katalog Produk',
        },
      },
      {
        id: 'sec-reviews',
        type: 'reviews',
        isVisible: true,
        sortOrder: 3,
        content: {
          description: branding.reviewsDescription,
          reviews: branding.reviews,
          title: branding.reviewsTitle || 'Ulasan Pelanggan',
        },
      },
      {
        id: 'sec-gallery',
        type: 'gallery',
        isVisible: true,
        sortOrder: 4,
        content: {
          description: branding.galleryDescription,
          images: branding.lookbook || branding.imageGallery || branding.images,
          title: branding.galleryTitle || 'Galeri Foto',
        },
      },
      {
        id: 'sec-hours',
        type: 'operating_hours',
        isVisible: true,
        sortOrder: 5,
        content: {
          title: 'Jam Operasional',
        },
      },
      {
        id: 'sec-footer',
        type: 'footer',
        isVisible: true,
        sortOrder: 6,
        content: {
          tagline: branding.tagline,
          socialLinks: branding.socialLinks
            ? {
                facebook: branding.socialLinks.facebook?.url,
                instagram: branding.socialLinks.instagram?.url,
                tiktok: branding.socialLinks.tiktok?.url,
                whatsapp: branding.socialLinks.whatsapp?.url,
              }
            : undefined,
        },
      },
    ]

    const theme: StorefrontTheme = {
      fontFamily: themeConfig.fontFamily || 'font-sans',
      layoutId: themeConfig.layoutId || 'modern',
      themeColor: themeConfig.themeColor || '#000000',
    }

    await tx.insert(storefrontConfigs).values([
      {
        organizationId: insertedTenant.id,
        sections,
        status: 'draft',
        theme,
      },
      {
        organizationId: insertedTenant.id,
        sections,
        status: 'published',
        theme,
      },
    ])

    // 2. Batch insert categories
    const categoryValues = data.categories.map((cat, idx) => ({
      name: cat.name,
      organizationId: insertedTenant.id,
      slug: cat.slug || generateCategorySlug(cat.name, idx),
      sortOrder: cat.sortOrder ?? idx,
    }))

    const insertedCategories = await tx.insert(categories).values(categoryValues).returning()

    const categoryMap = new Map<string, string>()
    for (const cat of insertedCategories) {
      categoryMap.set(cat.name.toLowerCase().trim(), cat.id)
    }

    const defaultCategoryId = insertedCategories[0]?.id ?? null

    // 3. Batch insert products with explicit IDs
    const productsToInsert = data.products.map((prod, idx) => {
      const matchedCategoryId = prod.categoryName
        ? (categoryMap.get(prod.categoryName.toLowerCase().trim()) ?? defaultCategoryId)
        : defaultCategoryId

      return {
        id: crypto.randomUUID(),
        name: prod.name,
        basePrice: prod.basePrice,
        categoryId: matchedCategoryId,
        description: prod.description || null,
        duration: prod.duration ?? null,
        imageGallery: prod.imageGallery ?? [],
        imageUrl: prod.imageUrl ?? null,
        isActive: true,
        organizationId: insertedTenant.id,
        originalPrice: prod.originalPrice ?? null,
        sortOrder: prod.sortOrder ?? idx,
        specifications: prod.specifications ?? [],
        stock: prod.stock ?? null,
      }
    })

    const insertedProducts = await tx.insert(products).values(productsToInsert).returning()

    // 4. Batch insert product variants and variant options
    const variantsToInsert: Array<{
      id: string
      name: string
      productId: string
      required: boolean
      sourceOptions?: (typeof data.products)[number]['variants'][number]['options']
    }> = []

    for (let i = 0; i < data.products.length; i++) {
      const sourceProduct = data.products[i]
      const insertedProduct = productsToInsert[i]

      if (!sourceProduct?.variants?.length || !insertedProduct) {
        continue
      }

      for (const variant of sourceProduct.variants) {
        const variantId = crypto.randomUUID()
        variantsToInsert.push({
          id: variantId,
          name: variant.name,
          productId: insertedProduct.id,
          required: variant.required ?? false,
          sourceOptions: variant.options,
        })
      }
    }

    if (variantsToInsert.length > 0) {
      await tx.insert(productVariants).values(
        variantsToInsert.map(v => ({
          id: v.id,
          name: v.name,
          productId: v.productId,
          required: v.required,
        })),
      )

      const optionsToInsert = variantsToInsert.flatMap(v =>
        (v.sourceOptions ?? []).map((opt, optIdx) => ({
          label: opt.label,
          priceModifier: opt.priceModifier ?? 0,
          sortOrder: opt.sortOrder ?? optIdx,
          variantId: v.id,
        })),
      )

      if (optionsToInsert.length > 0) {
        await tx.insert(variantOptions).values(optionsToInsert)
      }
    }

    return {
      categories: insertedCategories,
      products: insertedProducts,
      tenant: insertedTenant,
    }
  })
}
