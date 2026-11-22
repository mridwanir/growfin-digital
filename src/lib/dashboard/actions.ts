'use server'

import type { Category } from '@/db/schema/catalog'
import type { Tenant } from '@/db/schema/tenants'
import type { ProductWithVariants } from '@/lib/dashboard/mutations'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  updateCategory,
  updateTenantSettings,
} from '@/lib/dashboard/mutations'

export type ActionResult<T> =
  | { data: T; success: true }
  | { error: string; fieldErrors?: Record<string, string[]>; success: false }

export type TenantSettings = Tenant
export type { Category, ProductWithVariants }

interface AuthenticatedUser {
  id: string
  name?: string | null
  email?: string | null
  [key: string]: unknown
}

type AuthCheckResult =
  | { success: true; user: AuthenticatedUser; userId: string }
  | { error: string; success: false }

async function requireMerchantSession(): Promise<AuthCheckResult> {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return { error: 'Unauthorized', success: false }
  }
  return { success: true, user: session.user, userId: session.user.id }
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

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

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

export async function updateTenantSettingsAction(
  tenantId: string,
  input: unknown,
): Promise<ActionResult<TenantSettings>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const parsed = updateSettingsSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Validation failed'
    const fieldErrors = parsed.error.flatten().fieldErrors
    return {
      error: firstError,
      fieldErrors,
      success: false,
    }
  }

  const updated = await updateTenantSettings(tenantId, authResult.userId, parsed.data)
  if (!updated) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  revalidatePath('/dashboard/settings')

  return { data: updated, success: true }
}

export async function createCategoryAction(
  tenantId: string,
  input: unknown,
): Promise<ActionResult<Category>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const parsed = createCategorySchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Validation failed'
    const fieldErrors = parsed.error.flatten().fieldErrors
    return {
      error: firstError,
      fieldErrors,
      success: false,
    }
  }

  const created = await createCategory(tenantId, authResult.userId, parsed.data)
  if (!created) {
    return { error: 'Category or tenant not found', success: false }
  }

  revalidatePath('/dashboard/products')

  return { data: created, success: true }
}

export async function updateCategoryAction(
  tenantId: string,
  categoryId: string,
  input: unknown,
): Promise<ActionResult<Category>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const parsed = updateCategorySchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Validation failed'
    const fieldErrors = parsed.error.flatten().fieldErrors
    return {
      error: firstError,
      fieldErrors,
      success: false,
    }
  }

  const updated = await updateCategory(tenantId, authResult.userId, categoryId, parsed.data)
  if (!updated) {
    return { error: 'Category or tenant not found', success: false }
  }

  revalidatePath('/dashboard/products')

  return { data: updated, success: true }
}

export async function deleteCategoryAction(
  tenantId: string,
  categoryId: string,
): Promise<ActionResult<{ success: true }>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const deleted = await deleteCategory(tenantId, authResult.userId, categoryId)
  if (!deleted) {
    return { error: 'Category or tenant not found', success: false }
  }

  revalidatePath('/dashboard/products')

  return { data: { success: true }, success: true }
}

export async function createProductAction(
  tenantId: string,
  input: unknown,
): Promise<ActionResult<ProductWithVariants>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const parsed = createProductSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Validation failed'
    const fieldErrors = parsed.error.flatten().fieldErrors
    return {
      error: firstError,
      fieldErrors,
      success: false,
    }
  }

  const created = await createProduct(tenantId, authResult.userId, parsed.data)
  if (!created) {
    return { error: 'Product or tenant not found', success: false }
  }

  revalidatePath('/dashboard/products')

  return { data: created, success: true }
}

export async function deleteProductAction(
  tenantId: string,
  productId: string,
): Promise<ActionResult<{ success: true }>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const deleted = await deleteProduct(tenantId, authResult.userId, productId)
  if (!deleted) {
    return { error: 'Product or tenant not found', success: false }
  }

  revalidatePath('/dashboard/products')

  return { data: { success: true }, success: true }
}
