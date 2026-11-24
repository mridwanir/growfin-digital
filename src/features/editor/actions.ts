'use server'

import type { StorefrontConfig, Tenant } from '@/db/schema/tenants'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { db } from '@/db'
import { organization } from '@/db/schema/auth'
import { storefrontConfigs } from '@/db/schema/storefront'
import { resolveActiveTenantContext } from '@/features/auth/server'
import { DEFAULT_STOREFRONT_SECTIONS, DEFAULT_STOREFRONT_THEME } from '@/features/storefront'

import 'server-only'

export type ActionResult<T> =
  | { data: T; success: true }
  | { error: string; fieldErrors?: Record<string, string[]>; success: false }

async function resolveActiveEditorTenant(): Promise<
  { success: true; tenant: Tenant } | { error: string; success: false }
> {
  const tenantContext = await resolveActiveTenantContext()
  if (tenantContext.status === 'unauthenticated') {
    return { error: 'Unauthorized', success: false }
  }
  if (tenantContext.status === 'no_tenant') {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  const requestedOrgId = tenantContext.session.session?.activeOrganizationId
  if (requestedOrgId && tenantContext.currentTenant.id !== requestedOrgId) {
    return { error: 'Tenant not found or forbidden', success: false }
  }

  return {
    success: true,
    tenant: tenantContext.currentTenant,
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
  input?: unknown,
): Promise<ActionResult<StorefrontConfig>> {
  const auth = await resolveActiveEditorTenant()
  if (!auth.success) {
    return auth
  }

  const validation = validateInput(saveDraftSchema, input ?? {})
  if (!validation.success) {
    return validation
  }

  const [existingDraft] = await db
    .select()
    .from(storefrontConfigs)
    .where(
      and(
        eq(storefrontConfigs.organizationId, auth.tenant.id),
        eq(storefrontConfigs.status, 'draft'),
      ),
    )
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
        and(
          eq(storefrontConfigs.organizationId, auth.tenant.id),
          eq(storefrontConfigs.status, 'published'),
        ),
      )
      .limit(1)

    const initialSections =
      validation.data.sections ?? published?.sections ?? DEFAULT_STOREFRONT_SECTIONS
    const initialTheme = validation.data.theme ?? published?.theme ?? DEFAULT_STOREFRONT_THEME

    const [inserted] = await db
      .insert(storefrontConfigs)
      .values({
        organizationId: auth.tenant.id,
        sections: initialSections,
        status: 'draft',
        theme: initialTheme,
        updatedAt: now,
      })
      .returning()
    draftRecord = inserted
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/editor')

  return { data: draftRecord, success: true }
}

export async function publishStorefrontDraftAction(): Promise<ActionResult<StorefrontConfig>> {
  const auth = await resolveActiveEditorTenant()
  if (!auth.success) {
    return auth
  }

  const publishedRecord = await db.transaction(async tx => {
    const [draft] = await tx
      .select()
      .from(storefrontConfigs)
      .where(
        and(
          eq(storefrontConfigs.organizationId, auth.tenant.id),
          eq(storefrontConfigs.status, 'draft'),
        ),
      )
      .limit(1)

    if (!draft) {
      return null
    }

    const now = new Date()

    const [existingPublished] = await tx
      .select()
      .from(storefrontConfigs)
      .where(
        and(
          eq(storefrontConfigs.organizationId, auth.tenant.id),
          eq(storefrontConfigs.status, 'published'),
        ),
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
          organizationId: auth.tenant.id,
          sections: draft.sections,
          status: 'published',
          theme: draft.theme,
          updatedAt: now,
        })
        .returning()
      published = inserted
    }

    await tx.update(organization).set({ updatedAt: now }).where(eq(organization.id, auth.tenant.id))

    return published
  })

  if (!publishedRecord) {
    return { error: 'Draft configuration not found', success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/editor')
  revalidatePath('/site/[slug]')
  if (auth.tenant.slug) {
    revalidatePath(`/site/${auth.tenant.slug}`)
  }
  return { data: publishedRecord, success: true }
}

export async function discardStorefrontDraftAction(): Promise<ActionResult<StorefrontConfig>> {
  const auth = await resolveActiveEditorTenant()
  if (!auth.success) {
    return auth
  }

  const [published] = await db
    .select()
    .from(storefrontConfigs)
    .where(
      and(
        eq(storefrontConfigs.organizationId, auth.tenant.id),
        eq(storefrontConfigs.status, 'published'),
      ),
    )
    .limit(1)

  if (!published) {
    return { error: 'No published configuration found to discard to', success: false }
  }

  const [existingDraft] = await db
    .select()
    .from(storefrontConfigs)
    .where(
      and(
        eq(storefrontConfigs.organizationId, auth.tenant.id),
        eq(storefrontConfigs.status, 'draft'),
      ),
    )
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
        organizationId: auth.tenant.id,
        sections: published.sections,
        status: 'draft',
        theme: published.theme,
        updatedAt: now,
      })
      .returning()
    draftRecord = inserted
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/editor')
  return { data: draftRecord, success: true }
}
