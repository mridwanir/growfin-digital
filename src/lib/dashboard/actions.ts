'use server'

import type { Category } from '@/db/schema/catalog'
import type { StorefrontConfig, Tenant } from '@/db/schema/tenants'
import type { ProductWithVariants } from '@/lib/dashboard/mutations'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { db } from '@/db'
import { storefrontConfigs, tenants } from '@/db/schema/tenants'
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
import {
  DEFAULT_STOREFRONT_SECTIONS,
  DEFAULT_STOREFRONT_THEME,
} from '@/lib/storefront/compatibility'

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
  tenantId: string,
  input: unknown,
): Promise<ActionResult<TenantSettings>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const validation = validateInput(updateSettingsSchema, input)
  if (!validation.success) {
    return validation
  }

  const updated = await updateTenantSettings(tenantId, authResult.userId, validation.data)
  if (!updated) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard/[tenantSlug]/settings')
  if (updated.slug) {
    revalidatePath(`/dashboard/${updated.slug}/settings`)
  }

  return { data: updated, success: true }
}

export async function createProductCategoryAction(
  tenantId: string,
  input: unknown,
): Promise<ActionResult<Category>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const validation = validateInput(createProductCategorySchema, input)
  if (!validation.success) {
    return validation
  }

  const created = await createCategory(tenantId, authResult.userId, validation.data)
  if (!created) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/[tenantSlug]/products')

  return { data: created, success: true }
}

export async function updateProductCategoryAction(
  tenantId: string,
  categoryId: string,
  input: unknown,
): Promise<ActionResult<Category>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const validation = validateInput(updateProductCategorySchema, input)
  if (!validation.success) {
    return validation
  }

  const updated = await updateCategory(tenantId, authResult.userId, categoryId, validation.data)
  if (!updated) {
    return { error: 'Category or tenant not found', success: false }
  }

  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/[tenantSlug]/products')

  return { data: updated, success: true }
}

export async function deleteProductCategoryAction(
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
  revalidatePath('/dashboard/[tenantSlug]/products')

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

  const validation = validateInput(createProductSchema, input)
  if (!validation.success) {
    return validation
  }

  const created = await createProduct(tenantId, authResult.userId, validation.data)
  if (!created) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/[tenantSlug]/products')

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
  revalidatePath('/dashboard/[tenantSlug]/products')

  return { data: { success: true }, success: true }
}

export async function updateProductAction(
  tenantId: string,
  productId: string,
  input: unknown,
): Promise<ActionResult<ProductWithVariants>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const validation = validateInput(updateProductSchema, input)
  if (!validation.success) {
    return validation
  }

  const updated = await updateProduct(tenantId, authResult.userId, productId, validation.data)
  if (!updated) {
    return { error: 'Product or tenant not found', success: false }
  }

  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/[tenantSlug]/products')

  return { data: updated, success: true }
}

const sectionTypeSchema = z.enum([
  'hero',
  'catalog',
  'reviews',
  'gallery',
  'operating_hours',
  'footer',
])

const storefrontSectionSchema = z.object({
  id: z.string().min(1),
  type: sectionTypeSchema,
  content: z.record(z.string(), z.unknown()).default({}),
  isVisible: z.boolean(),
  sortOrder: z.number().int(),
})

const storefrontThemeSchema = z
  .object({
    colorPalette: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
    fbType: z.enum(['DINE_IN', 'QUICK_SERVICE', 'PRE_ORDER']).optional(),
    fontFamily: z.string().optional(),
    fulfillmentModes: z.array(z.string()).optional(),
    heroSecondaryAction: z.enum(['whatsapp', 'cart', 'gallery']).optional(),
    layoutId: z.string().optional(),
    themeColor: z.string().optional(),
  })
  .passthrough()

const saveDraftSchema = z.object({
  sections: z.array(storefrontSectionSchema).optional(),
  theme: storefrontThemeSchema.optional(),
})

export async function saveStorefrontDraftAction(
  tenantId: string,
  input: unknown,
): Promise<ActionResult<StorefrontConfig>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const validation = validateInput(saveDraftSchema, input)
  if (!validation.success) {
    return validation
  }

  const [tenant] = await db
    .select({ id: tenants.id, slug: tenants.slug })
    .from(tenants)
    .where(and(eq(tenants.id, tenantId), eq(tenants.userId, authResult.userId)))
    .limit(1)

  if (!tenant) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  const [existingDraft] = await db
    .select()
    .from(storefrontConfigs)
    .where(and(eq(storefrontConfigs.tenantId, tenantId), eq(storefrontConfigs.status, 'draft')))
    .limit(1)

  const now = new Date()
  let draftRecord: StorefrontConfig

  if (existingDraft) {
    const updateValues: Partial<typeof storefrontConfigs.$inferInsert> = {
      updatedAt: now,
    }
    if (validation.data.theme !== undefined) {
      updateValues.theme = validation.data.theme
    }
    if (validation.data.sections !== undefined) {
      updateValues.sections = validation.data.sections
    }

    const [updated] = await db
      .update(storefrontConfigs)
      .set(updateValues)
      .where(eq(storefrontConfigs.id, existingDraft.id))
      .returning()
    draftRecord = updated
  } else {
    const [published] = await db
      .select()
      .from(storefrontConfigs)
      .where(
        and(eq(storefrontConfigs.tenantId, tenantId), eq(storefrontConfigs.status, 'published')),
      )
      .limit(1)

    const initialSections =
      validation.data.sections ?? published?.sections ?? DEFAULT_STOREFRONT_SECTIONS
    const initialTheme = validation.data.theme ?? published?.theme ?? DEFAULT_STOREFRONT_THEME

    const [inserted] = await db
      .insert(storefrontConfigs)
      .values({
        sections: initialSections,
        status: 'draft',
        tenantId,
        theme: initialTheme,
        updatedAt: now,
      })
      .returning()
    draftRecord = inserted
  }

  revalidatePath('/dashboard/[tenantSlug]/editor')
  revalidatePath(`/dashboard/${tenant.slug}/editor`)

  return { data: draftRecord, success: true }
}

export async function publishStorefrontDraftAction(
  tenantId: string,
): Promise<ActionResult<StorefrontConfig>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const [tenant] = await db
    .select({ id: tenants.id, slug: tenants.slug })
    .from(tenants)
    .where(and(eq(tenants.id, tenantId), eq(tenants.userId, authResult.userId)))
    .limit(1)

  if (!tenant) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  const publishedRecord = await db.transaction(async tx => {
    const [draft] = await tx
      .select()
      .from(storefrontConfigs)
      .where(and(eq(storefrontConfigs.tenantId, tenantId), eq(storefrontConfigs.status, 'draft')))
      .limit(1)

    if (!draft) {
      return null
    }

    const now = new Date()

    const [existingPublished] = await tx
      .select()
      .from(storefrontConfigs)
      .where(
        and(eq(storefrontConfigs.tenantId, tenantId), eq(storefrontConfigs.status, 'published')),
      )
      .limit(1)

    let published: StorefrontConfig

    if (existingPublished) {
      const [updated] = await tx
        .update(storefrontConfigs)
        .set({
          sections: draft.sections,
          theme: draft.theme,
          updatedAt: now,
        })
        .where(eq(storefrontConfigs.id, existingPublished.id))
        .returning()
      published = updated
    } else {
      const [inserted] = await tx
        .insert(storefrontConfigs)
        .values({
          sections: draft.sections,
          status: 'published',
          tenantId,
          theme: draft.theme,
          updatedAt: now,
        })
        .returning()
      published = inserted
    }

    await tx.update(tenants).set({ updatedAt: now }).where(eq(tenants.id, tenantId))

    return published
  })

  if (!publishedRecord) {
    return { error: 'Draft configuration not found', success: false }
  }

  revalidatePath('/site/[slug]')
  revalidatePath('/dashboard/[tenantSlug]')
  revalidatePath(`/site/${tenant.slug}`)
  revalidatePath(`/dashboard/${tenant.slug}`)

  return { data: publishedRecord, success: true }
}

export async function discardStorefrontDraftAction(
  tenantId: string,
): Promise<ActionResult<StorefrontConfig>> {
  const authResult = await requireMerchantSession()
  if (!authResult.success) {
    return { error: authResult.error, success: false }
  }

  const [tenant] = await db
    .select({ id: tenants.id, slug: tenants.slug })
    .from(tenants)
    .where(and(eq(tenants.id, tenantId), eq(tenants.userId, authResult.userId)))
    .limit(1)

  if (!tenant) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  const [published] = await db
    .select()
    .from(storefrontConfigs)
    .where(and(eq(storefrontConfigs.tenantId, tenantId), eq(storefrontConfigs.status, 'published')))
    .limit(1)

  if (!published) {
    return { error: 'No published configuration found to discard to', success: false }
  }

  const [existingDraft] = await db
    .select()
    .from(storefrontConfigs)
    .where(and(eq(storefrontConfigs.tenantId, tenantId), eq(storefrontConfigs.status, 'draft')))
    .limit(1)

  const now = new Date()
  let draftRecord: StorefrontConfig

  if (existingDraft) {
    const [updated] = await db
      .update(storefrontConfigs)
      .set({
        sections: published.sections,
        theme: published.theme,
        updatedAt: now,
      })
      .where(eq(storefrontConfigs.id, existingDraft.id))
      .returning()
    draftRecord = updated
  } else {
    const [inserted] = await db
      .insert(storefrontConfigs)
      .values({
        sections: published.sections,
        status: 'draft',
        tenantId,
        theme: published.theme,
        updatedAt: now,
      })
      .returning()
    draftRecord = inserted
  }

  revalidatePath('/dashboard/[tenantSlug]/editor')
  revalidatePath(`/dashboard/${tenant.slug}/editor`)

  return { data: draftRecord, success: true }
}
