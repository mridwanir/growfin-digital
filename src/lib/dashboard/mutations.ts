import { and, desc, eq, inArray } from 'drizzle-orm'

import type { BrandingContent, OperatingHours } from '@/db/schema/tenants'

import { db } from '@/db'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { tenants } from '@/db/schema/tenants'

/**
 * Returns all tenants owned by the given merchant user.
 */
export async function getMerchantTenants(userId: string) {
 return db
  .select({
   id: tenants.id,
   name: tenants.name,
   address: tenants.address,
   category: tenants.category,
   city: tenants.city,
   createdAt: tenants.createdAt,
   customDomain: tenants.customDomain,
   packageTier: tenants.packageTier,
   phone: tenants.phone,
   siteActiveUntil: tenants.siteActiveUntil,
   slug: tenants.slug,
   status: tenants.status,
   updatedAt: tenants.updatedAt,
  })
  .from(tenants)
  .where(eq(tenants.userId, userId))
  .orderBy(desc(tenants.createdAt))
}

export interface UpdateTenantSettingsInput {
 phone?: string | null
 address?: string | null
 city?: string | null
 operatingHours?: OperatingHours
 socialLinks?: BrandingContent['socialLinks']
}

/**
 * Returns settings and branding content for a specific tenant owned by the user.
 */
export async function getTenantSettings(tenantId: string, userId: string) {
 const [tenant] = await db
  .select({
   id: tenants.id,
   name: tenants.name,
   address: tenants.address,
   brandingContent: tenants.brandingContent,
   category: tenants.category,
   city: tenants.city,
   customDomain: tenants.customDomain,
   googleMapsUrl: tenants.googleMapsUrl,
   operatingHours: tenants.operatingHours,
   packageTier: tenants.packageTier,
   phone: tenants.phone,
   slug: tenants.slug,
   status: tenants.status,
   themeConfig: tenants.themeConfig,
   updatedAt: tenants.updatedAt,
  })
  .from(tenants)
  .where(and(eq(tenants.id, tenantId), eq(tenants.userId, userId)))
  .limit(1)

 return tenant ?? null
}

/**
 * Executes a targeted row-level update on basic business details without
 * clobbering catalog data or unrelated visual content.
 */
export async function updateTenantSettings(
 tenantId: string,
 userId: string,
 input: UpdateTenantSettingsInput,
) {
 const current = await getTenantSettings(tenantId, userId)
 if (!current) return null

 const updatedOperatingHours: OperatingHours = {
  ...(current.operatingHours || {}),
  ...(input.operatingHours || {}),
 }

 const currentBranding = current.brandingContent || {}
 const updatedSocialLinks = input.socialLinks
  ? {
   ...(currentBranding.socialLinks || {}),
   ...input.socialLinks,
  }
  : currentBranding.socialLinks

 const updatedBranding: BrandingContent = {
  ...currentBranding,
  socialLinks: updatedSocialLinks,
 }

 const [updated] = await db
  .update(tenants)
  .set({
   address: input.address !== undefined ? input.address : current.address,
   brandingContent: updatedBranding,
   city: input.city !== undefined ? input.city : current.city,
   operatingHours: updatedOperatingHours,
   phone: input.phone !== undefined ? input.phone : current.phone,
   updatedAt: new Date(),
  })
  .where(and(eq(tenants.id, tenantId), eq(tenants.userId, userId)))
  .returning()

 return updated ?? null
}

export function slugify(text: string): string {
 return text
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '')
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
  .where(eq(categories.tenantId, tenantId))
  .orderBy(categories.sortOrder, categories.name)
}

/**
 * Creates a category under a tenant.
 */
export async function createCategory(
 tenantId: string,
 userId: string,
 input: { name: string; slug?: string; sortOrder?: number },
) {
 const tenant = await getTenantSettings(tenantId, userId)
 if (!tenant) return null

 const finalSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name)

 const [created] = await db
  .insert(categories)
  .values({
   name: input.name.trim(),
   slug: finalSlug || 'category',
   sortOrder: input.sortOrder ?? 0,
   tenantId,
  })
  .returning()

 return created
}

/**
 * Updates a category under a tenant.
 */
export async function updateCategory(
 tenantId: string,
 userId: string,
 categoryId: string,
 input: { name?: string; slug?: string; sortOrder?: number },
) {
 const tenant = await getTenantSettings(tenantId, userId)
 if (!tenant) return null

 const updateValues: Record<string, unknown> = {}
 if (input.name !== undefined) updateValues.name = input.name.trim()
 if (input.slug !== undefined) updateValues.slug = slugify(input.slug)
 if (input.sortOrder !== undefined) updateValues.sortOrder = input.sortOrder

 const [updated] = await db
  .update(categories)
  .set(updateValues)
  .where(and(eq(categories.id, categoryId), eq(categories.tenantId, tenantId)))
  .returning()

 return updated ?? null
}

/**
 * Deletes a category under a tenant.
 */
export async function deleteCategory(tenantId: string, userId: string, categoryId: string) {
 const tenant = await getTenantSettings(tenantId, userId)
 if (!tenant) return false

 const result = await db
  .delete(categories)
  .where(and(eq(categories.id, categoryId), eq(categories.tenantId, tenantId)))
  .returning({ id: categories.id })

 return result.length > 0
}

export interface VariantOptionInput {
 label: string
 priceModifier?: number
 sortOrder?: number
}

export interface ProductVariantInput {
 name: string
 required?: boolean
 options: VariantOptionInput[]
}

export interface CreateProductInput {
 name: string
 description?: string | null
 basePrice: number
 originalPrice?: number | null
 stock?: number | null
 categoryId?: string | null
 imageUrl?: string | null
 imageStorageKey?: string | null
 imageGallery?: string[]
 isActive?: boolean
 sortOrder?: number
 duration?: number | null
 variants?: ProductVariantInput[]
}

export interface UpdateProductInput {
 name?: string
 description?: string | null
 basePrice?: number
 originalPrice?: number | null
 stock?: number | null
 categoryId?: string | null
 imageUrl?: string | null
 imageStorageKey?: string | null
 imageGallery?: string[]
 isActive?: boolean
 sortOrder?: number
 duration?: number | null
 variants?: ProductVariantInput[]
}

export interface ProductWithVariants {
 id: string
 name: string
 description: string | null
 basePrice: number
 originalPrice: number | null
 stock: number | null
 categoryId: string | null
 imageUrl: string | null
 imageStorageKey: string | null
 imageGallery: string[] | null
 isActive: boolean
 sortOrder: number
 duration: number | null
 tenantId: string
 createdAt: Date
 updatedAt: Date
 variants: Array<{
  id: string
  name: string
  productId: string
  required: boolean
  options: Array<{
   id: string
   label: string
   priceModifier: number
   sortOrder: number
   variantId: string
  }>
 }>
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
  .where(eq(products.tenantId, tenantId))
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
  .where(and(eq(products.id, productId), eq(products.tenantId, tenantId)))
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
  variants,
 }
}

type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0]

async function insertVariants(tx: DbTx, productId: string, variants: ProductVariantInput[]) {
 for (const v of variants) {
  const [createdVariant] = await tx
   .insert(productVariants)
   .values({
    name: v.name.trim(),
    productId,
    required: v.required ?? false,
   })
   .returning({ id: productVariants.id })

  if (v.options && v.options.length > 0) {
   const optionValues = v.options.map((opt, idx) => ({
    label: opt.label.trim(),
    priceModifier: opt.priceModifier ?? 0,
    sortOrder: opt.sortOrder ?? idx,
    variantId: createdVariant.id,
   }))
   await tx.insert(variantOptions).values(optionValues)
  }
 }
}

function buildProductUpdateValues(input: UpdateProductInput): Record<string, unknown> {
 const updateValues: Record<string, unknown> = {
  updatedAt: new Date(),
 }
 if (input.name !== undefined) updateValues.name = input.name.trim()
 if (input.description !== undefined) updateValues.description = input.description
 if (input.basePrice !== undefined) updateValues.basePrice = input.basePrice
 if (input.originalPrice !== undefined) updateValues.originalPrice = input.originalPrice
 if (input.stock !== undefined) updateValues.stock = input.stock
 if (input.categoryId !== undefined) updateValues.categoryId = input.categoryId
 if (input.imageUrl !== undefined) updateValues.imageUrl = input.imageUrl
 if (input.imageStorageKey !== undefined) updateValues.imageStorageKey = input.imageStorageKey
 if (input.imageGallery !== undefined) updateValues.imageGallery = input.imageGallery
 if (input.isActive !== undefined) updateValues.isActive = input.isActive
 if (input.sortOrder !== undefined) updateValues.sortOrder = input.sortOrder
 if (input.duration !== undefined) updateValues.duration = input.duration
 return updateValues
}

/**
 * Creates a product and its variants/options in an atomic transaction.
 */
export async function createProduct(
 tenantId: string,
 userId: string,
 input: CreateProductInput,
): Promise<ProductWithVariants | null> {
 const tenant = await getTenantSettings(tenantId, userId)
 if (!tenant) return null

 const createdProductId = await db.transaction(async tx => {
  const [createdProduct] = await tx
   .insert(products)
   .values({
    name: input.name.trim(),
    basePrice: input.basePrice,
    categoryId: input.categoryId,
    description: input.description,
    duration: input.duration,
    imageGallery: input.imageGallery ?? [],
    imageStorageKey: input.imageStorageKey,
    imageUrl: input.imageUrl,
    isActive: input.isActive ?? true,
    originalPrice: input.originalPrice,
    sortOrder: input.sortOrder ?? 0,
    stock: input.stock,
    tenantId,
   })
   .returning({ id: products.id })

  if (input.variants && input.variants.length > 0) {
   await insertVariants(tx, createdProduct.id, input.variants)
  }

  return createdProduct.id
 })

 return getProductById(tenantId, userId, createdProductId)
}

/**
 * Updates a product and atomically synchronizes variants/options if provided.
 */
export async function updateProduct(
 tenantId: string,
 userId: string,
 productId: string,
 input: UpdateProductInput,
): Promise<ProductWithVariants | null> {
 const tenant = await getTenantSettings(tenantId, userId)
 if (!tenant) return null

 const existingProduct = await getProductById(tenantId, userId, productId)
 if (!existingProduct) return null

 await db.transaction(async tx => {
  const updateValues = buildProductUpdateValues(input)

  await tx
   .update(products)
   .set(updateValues)
   .where(and(eq(products.id, productId), eq(products.tenantId, tenantId)))

  if (input.variants !== undefined) {
   await tx.delete(productVariants).where(eq(productVariants.productId, productId))
   await insertVariants(tx, productId, input.variants)
  }
 })

 return getProductById(tenantId, userId, productId)
}

/**
 * Deletes a product under a tenant.
 */
export async function deleteProduct(tenantId: string, userId: string, productId: string) {
 const tenant = await getTenantSettings(tenantId, userId)
 if (!tenant) return false

 const result = await db
  .delete(products)
  .where(and(eq(products.id, productId), eq(products.tenantId, tenantId)))
  .returning({ id: products.id })

 return result.length > 0
}
