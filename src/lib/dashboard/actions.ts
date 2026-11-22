'use server'

import type { Category } from '@/db/schema/catalog'
import type { Tenant } from '@/db/schema/tenants'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import {
  createCategory,
  deleteCategory,
  updateCategory,
  updateTenantSettings,
} from '@/lib/dashboard/mutations'

export type ActionResult<T> =
  | { data: T; success: true }
  | { error: string; fieldErrors?: Record<string, string[]>; success: false }

export type TenantSettings = Tenant
export type { Category }

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
