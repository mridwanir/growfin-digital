'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { db } from '@/db'
import { member, organization, session as sessionTable } from '@/db/schema/auth'
import { storefrontConfigs } from '@/db/schema/storefront'
import { auth, getSessionCookieDomain } from '@/lib/auth/server'
import {
  DEFAULT_STOREFRONT_SECTIONS,
  DEFAULT_STOREFRONT_THEME,
} from '@/lib/storefront/compatibility'

export type ActionResult<T> =
  | { data: T; redirect?: string; success: true }
  | { error: string; fieldErrors?: Record<string, string[]>; success: false }

export interface CreateStoreOnboardingInput {
  name: string
  slug: string
  category: string
  phone: string
}

export interface CreateStoreOnboardingData {
  organization: typeof organization.$inferSelect
  organizationId: string
  redirectUrl: string
  slug: string
}

const createStoreOnboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama toko wajib diisi')
    .max(100, 'Nama toko maksimal 100 karakter'),
  category: z.string().trim().min(1, 'Kategori usaha wajib diisi'),
  phone: z
    .string()
    .trim()
    .min(1, 'Nomor telepon wajib diisi')
    .max(32, 'Nomor telepon maksimal 32 karakter'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug toko wajib diisi')
    .max(50, 'Slug toko maksimal 50 karakter')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Format slug tidak valid (gunakan huruf kecil, angka, dan tanda hubung)',
    ),
})

export async function createStoreOnboardingAction(
  input: unknown,
  customHeaders?: Headers,
): Promise<ActionResult<CreateStoreOnboardingData>> {
  // 1. Verify merchant authentication
  const { data: session } = await auth.getSession(customHeaders)
  if (!session?.user?.id) {
    return { error: 'Unauthorized', success: false }
  }

  // 2. Validate input fields with Zod
  const parsed = createStoreOnboardingSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>
    return {
      error: parsed.error.issues[0]?.message ?? 'Validasi input toko gagal',
      fieldErrors,
      success: false,
    }
  }

  const { name, slug, category, phone } = parsed.data
  const normalizedSlug = slug.toLowerCase()

  // 3. Validate slug uniqueness
  const [existingOrg] = await db
    .select({ id: organization.id })
    .from(organization)
    .where(eq(organization.slug, normalizedSlug))
    .limit(1)

  if (existingOrg) {
    return {
      error: 'Slug toko sudah digunakan. Silakan pilih slug lain.',
      success: false,
      fieldErrors: {
        slug: ['Slug toko sudah digunakan. Silakan pilih slug lain.'],
      },
    }
  }

  try {
    // 4. Create organization, owner member, and default storefront configs in transaction
    const createdOrg = await db.transaction(async tx => {
      const [newOrg] = await tx
        .insert(organization)
        .values({
          name,
          category,
          packageTier: 'free',
          phone,
          slug: normalizedSlug,
          status: 'published',
        })
        .returning()

      await tx.insert(member).values({
        organizationId: newOrg.id,
        role: 'owner',
        userId: session.user.id,
      })

      await tx.insert(storefrontConfigs).values([
        {
          organizationId: newOrg.id,
          sections: DEFAULT_STOREFRONT_SECTIONS,
          status: 'draft',
          theme: DEFAULT_STOREFRONT_THEME,
        },
        {
          organizationId: newOrg.id,
          sections: DEFAULT_STOREFRONT_SECTIONS,
          status: 'published',
          theme: DEFAULT_STOREFRONT_THEME,
        },
      ])

      return newOrg
    })

    // 5. Update session record's activeOrganizationId in database
    if (session.session?.token) {
      await db
        .update(sessionTable)
        .set({
          activeOrganizationId: createdOrg.id,
          updatedAt: new Date(),
        })
        .where(eq(sessionTable.token, session.session.token))
    } else if (session.session?.id) {
      await db
        .update(sessionTable)
        .set({
          activeOrganizationId: createdOrg.id,
          updatedAt: new Date(),
        })
        .where(eq(sessionTable.id, session.session.id))
    }

    // 6. Set active organization cookie
    try {
      const cookieStore = await cookies()
      const cookieDomain = getSessionCookieDomain()
      const isProd = process.env.NODE_ENV === 'production'

      cookieStore.set('better-auth.active_organization_id', createdOrg.id, {
        domain: cookieDomain,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
        secure: isProd,
      })
    } catch {
      // Ignored outside Next.js request context
    }

    try {
      revalidatePath('/dashboard')
    } catch {
      // Ignored outside Next.js request context
    }

    return {
      redirect: '/dashboard',
      success: true,
      data: {
        organization: createdOrg,
        organizationId: createdOrg.id,
        redirectUrl: '/dashboard',
        slug: createdOrg.slug,
      },
    }
  } catch (err) {
    console.error('Failed to create store onboarding:', err)
    return {
      error: 'Gagal membuat toko. Silakan coba beberapa saat lagi.',
      success: false,
    }
  }
}
