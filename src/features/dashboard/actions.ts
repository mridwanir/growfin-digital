'use server'

import type {
  ActionResult,
  Category,
  CreateProductInput,
  ProductVariantInput,
  ProductWithVariants,
  TenantSettings,
  UpdateProductInput,
  UpdateTenantSettingsInput,
} from './types'
import type { OperatingHours } from '@/db/schema/storefront'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { db } from '@/db'
import { organization } from '@/db/schema/auth'
import { categories, products, productVariants, variantOptions } from '@/db/schema/catalog'
import { resolveActiveTenantContext } from '@/features/auth/server'

import { getProductById, getTenantSettings } from './queries'

import 'server-only'

export type { ActionResult, Category, ProductWithVariants, TenantSettings }

interface AuthenticatedUser {
  id: string
  name?: string | null
  email?: string | null
  [key: string]: unknown
}

interface AuthenticatedMerchant {
  tenantId: string
  user: AuthenticatedUser
  userId: string
}

async function resolveActiveStore(): Promise<
  { data: AuthenticatedMerchant; success: true } | { error: string; success: false }
> {
  const tenantContext = await resolveActiveTenantContext()
  if (tenantContext.status === 'unauthenticated') {
    return { error: 'Unauthorized', success: false }
  }
  if (tenantContext.status === 'no_tenant') {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  let requestedOrgId: string | null = tenantContext.session.session?.activeOrganizationId ?? null

  if (!requestedOrgId) {
    try {
      const cookieStore = await cookies()
      requestedOrgId =
        cookieStore.get('better-auth.active_organization_id')?.value ??
        cookieStore.get('__Secure-better-auth.active_organization_id')?.value ??
        null
    } catch {
      // Ignored outside request context
    }
  }

  if (requestedOrgId && tenantContext.currentTenant.id !== requestedOrgId) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  return {
    success: true,
    data: {
      tenantId: tenantContext.currentTenant.id,
      user: tenantContext.session.user,
      userId: tenantContext.session.user.id,
    },
  }
}

function validateInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
):
  | { data: T; success: true }
  | { error: string; fieldErrors: Record<string, string[]>; success: false } {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      success: false,
    }
  }
  return { data: parsed.data, success: true }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Executes a targeted row-level update on basic business details without clobbering catalog data or
 * unrelated visual content.
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

  const [updated] = await db
    .update(organization)
    .set({
      address: input.address !== undefined ? input.address : current.address,
      city: input.city !== undefined ? input.city : current.city,
      operatingHours: updatedOperatingHours,
      phone: input.phone !== undefined ? input.phone : current.phone,
      updatedAt: new Date(),
    })
    .where(eq(organization.id, tenantId))
    .returning()
  return updated ?? null
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
      organizationId: tenantId,
      slug: finalSlug || 'category',
      sortOrder: input.sortOrder ?? 0,
    })
    .returning()

  return {
    ...created,
    tenantId: created.organizationId,
  }
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
    .where(and(eq(categories.id, categoryId), eq(categories.organizationId, tenantId)))
    .returning()
  return updated ? { ...updated, tenantId: updated.organizationId } : null
}

/**
 * Deletes a category under a tenant.
 */
export async function deleteCategory(tenantId: string, userId: string, categoryId: string) {
  const tenant = await getTenantSettings(tenantId, userId)
  if (!tenant) return false

  const result = await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.organizationId, tenantId)))
    .returning({ id: categories.id })
  return result.length > 0
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
        organizationId: tenantId,
        originalPrice: input.originalPrice,
        sortOrder: input.sortOrder ?? 0,
        stock: input.stock,
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
      .where(and(eq(products.id, productId), eq(products.organizationId, tenantId)))
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
    .where(and(eq(products.id, productId), eq(products.organizationId, tenantId)))
    .returning({ id: products.id })
  return result.length > 0
}

const updateSettingsSchema = z.object({
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  operatingHours: z
    .object({
      closeTime: z.string().optional(),
      isOpen: z.boolean().optional(),
      openTime: z.string().optional(),
      raw: z.string().optional(),
      schedules: z
        .array(
          z.object({
            close: z.string(),
            closed: z.boolean().optional(),
            day: z.string(),
            open: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
      instagram: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
      tiktok: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
      whatsapp: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
    })
    .optional(),
})

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().optional(),
  sortOrder: z.number().int().optional(),
})
const createProductCategorySchema = createCategorySchema

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  sortOrder: z.number().int().optional(),
})
const updateProductCategorySchema = updateCategorySchema

const variantOptionSchema = z.object({
  label: z.string().min(1, 'Option label is required'),
  priceModifier: z.number().int().default(0),
  sortOrder: z.number().int().optional(),
})

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  options: z.array(variantOptionSchema).min(1, 'Variant must have at least one option'),
  required: z.boolean().default(false),
})

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  basePrice: z.number().int().min(0, 'Base price must be a non-negative integer'),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  duration: z.number().int().nullable().optional(),
  imageGallery: z.array(z.string()).optional(),
  imageStorageKey: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  originalPrice: z.number().int().nullable().optional(),
  sortOrder: z.number().int().optional(),
  stock: z.number().int().nullable().optional(),
  variants: z.array(variantSchema).optional(),
})

const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  basePrice: z.number().int().min(0, 'Base price must be a non-negative integer').optional(),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  duration: z.number().int().nullable().optional(),
  imageGallery: z.array(z.string()).optional(),
  imageStorageKey: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  originalPrice: z.number().int().nullable().optional(),
  sortOrder: z.number().int().optional(),
  stock: z.number().int().nullable().optional(),
  variants: z.array(variantSchema).optional(),
})

export async function updateTenantSettingsAction(
  input: unknown,
): Promise<ActionResult<TenantSettings>> {
  const auth = await resolveActiveStore()
  if (!auth.success) {
    return auth
  }

  const validation = validateInput(updateSettingsSchema, input)
  if (!validation.success) {
    return validation
  }

  const updated = await updateTenantSettings(auth.data.tenantId, auth.data.userId, validation.data)
  if (!updated) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')

  return { data: updated, success: true }
}

export async function createProductCategoryAction(input: unknown): Promise<ActionResult<Category>> {
  const auth = await resolveActiveStore()
  if (!auth.success) {
    return auth
  }

  const validation = validateInput(createProductCategorySchema, input)
  if (!validation.success) {
    return validation
  }

  const created = await createCategory(auth.data.tenantId, auth.data.userId, validation.data)
  if (!created) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')

  return { data: created, success: true }
}

export async function updateProductCategoryAction(
  categoryId: string,
  input: unknown,
): Promise<ActionResult<Category>> {
  const auth = await resolveActiveStore()
  if (!auth.success) {
    return auth
  }

  const validation = validateInput(updateProductCategorySchema, input)
  if (!validation.success) {
    return validation
  }

  const updated = await updateCategory(
    auth.data.tenantId,
    auth.data.userId,
    categoryId,
    validation.data,
  )
  if (!updated) {
    return { error: 'Category or tenant not found', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')

  return { data: updated, success: true }
}

export async function deleteProductCategoryAction(
  categoryId: string,
): Promise<ActionResult<{ success: true }>> {
  const auth = await resolveActiveStore()
  if (!auth.success) {
    return auth
  }

  const deleted = await deleteCategory(auth.data.tenantId, auth.data.userId, categoryId)
  if (!deleted) {
    return { error: 'Category or tenant not found', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')

  return { data: { success: true }, success: true }
}

export async function createProductAction(
  input: unknown,
): Promise<ActionResult<ProductWithVariants>> {
  const auth = await resolveActiveStore()
  if (!auth.success) {
    return auth
  }

  const validation = validateInput(createProductSchema, input)
  if (!validation.success) {
    return validation
  }

  const created = await createProduct(auth.data.tenantId, auth.data.userId, validation.data)
  if (!created) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')

  return { data: created, success: true }
}

export async function deleteProductAction(
  productId: string,
): Promise<ActionResult<{ success: true }>> {
  const auth = await resolveActiveStore()
  if (!auth.success) {
    return auth
  }

  const deleted = await deleteProduct(auth.data.tenantId, auth.data.userId, productId)
  if (!deleted) {
    return { error: 'Product or tenant not found', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')

  return { data: { success: true }, success: true }
}

export async function updateProductAction(
  productId: string,
  input: unknown,
): Promise<ActionResult<ProductWithVariants>> {
  const auth = await resolveActiveStore()
  if (!auth.success) {
    return auth
  }

  const validation = validateInput(updateProductSchema, input)
  if (!validation.success) {
    return validation
  }

  const updated = await updateProduct(
    auth.data.tenantId,
    auth.data.userId,
    productId,
    validation.data,
  )
  if (!updated) {
    return { error: 'Product or tenant not found', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')

  return { data: updated, success: true }
}
