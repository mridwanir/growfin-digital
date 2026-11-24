'use server'

import type { Category } from '@/db/schema/catalog'
import type { Tenant } from '@/db/schema/tenants'
import type { ProductWithVariants } from '@/lib/dashboard/mutations'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { db } from '@/db'
import { member } from '@/db/schema/auth'
import { auth } from '@/lib/auth/server'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  updateCategory,
  updateProduct,
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
  | { activeOrganizationId: string | null; success: true; user: AuthenticatedUser; userId: string }
  | { error: string; success: false }

async function requireMerchantSession(): Promise<AuthCheckResult> {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return { error: 'Unauthorized', success: false }
  }

  let activeOrgId: string | null = session.session?.activeOrganizationId ?? null

  if (!activeOrgId) {
    try {
      const cookieStore = await cookies()
      activeOrgId =
        cookieStore.get('better-auth.active_organization_id')?.value ??
        cookieStore.get('__Secure-better-auth.active_organization_id')?.value ??
        null
    } catch {
      // Ignored outside request context
    }
  }

  if (!activeOrgId) {
    const [firstOrg] = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, session.user.id))
      .limit(1)

    activeOrgId = firstOrg?.organizationId ?? null
  }

  return {
    activeOrganizationId: activeOrgId,
    success: true,
    user: session.user,
    userId: session.user.id,
  }
}

interface AuthenticatedMerchant {
  tenantId: string
  user: AuthenticatedUser
  userId: string
}

async function resolveActiveStore(): Promise<
  { data: AuthenticatedMerchant; success: true } | { error: string; success: false }
> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return authResult
  }

  const tenantId = authResult.activeOrganizationId
  if (!tenantId) {
    return { error: 'No active store found', success: false }
  }

  return {
    success: true,
    data: {
      tenantId,
      user: authResult.user,
      userId: authResult.userId,
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
