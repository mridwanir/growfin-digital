import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST as authRouteHandler } from '@/app/api/auth/[...all]/route'
import { DashboardGuard } from '@/app/dashboard/layout'
import { db } from '@/db'
import { member, organization, session as sessionTable, user } from '@/db/schema/auth'
import { storefrontConfigs } from '@/db/schema/storefront'
import { createStoreOnboardingAction } from '@/features/auth/actions'
import { auth } from '@/lib/auth/server'
import {
  DEFAULT_STOREFRONT_SECTIONS,
  DEFAULT_STOREFRONT_THEME,
} from '@/lib/storefront/compatibility'

import { createMerchantSession, createUnauthenticatedSession } from '../../fixtures/session-fixture'
import { createTestTenant } from '../../fixtures/tenant-fixture'

const mockCookieStore = {
  delete: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(() => []),
  has: vi.fn(() => false),
  set: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => mockCookieStore),
  headers: vi.fn(async () => new Headers()),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => ''),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

describe('Two-Step Registration Wizard and Onboarding Guard (Issue 13)', () => {
  const testEmail = `wizard-${Date.now()}@growfin.test`
  const testPassword = 'SecurePassword123!'
  const testName = 'Wizard Merchant'
  let createdUserId: string | null = null
  let createdOrgId: string | null = null

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    try {
      if (createdOrgId) {
        await db.delete(storefrontConfigs).where(eq(storefrontConfigs.organizationId, createdOrgId))
        await db.delete(member).where(eq(member.organizationId, createdOrgId))
        await db.delete(organization).where(eq(organization.id, createdOrgId))
      }
      if (createdUserId) {
        await db.delete(user).where(eq(user.id, createdUserId))
      }
    } catch {}
  })

  describe('step 1: account registration via Better Auth', () => {
    it('creates a user account when submitting credentials', async () => {
      const request = new Request('http://localhost:3000/api/auth/sign-up/email', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          name: testName,
          email: testEmail,
          password: testPassword,
        }),
      })

      const response = await authRouteHandler(request)
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body.user).toBeDefined()
      expect(body.user.email).toBe(testEmail)
      expect(body.user.name).toBe(testName)
      createdUserId = body.user.id

      const [dbUser] = await db.select().from(user).where(eq(user.id, createdUserId!))
      expect(dbUser).toBeDefined()
      expect(dbUser.email).toBe(testEmail)
    })
  })

  describe('step 2: store onboarding action (createStoreOnboardingAction)', () => {
    it('rejects unauthenticated requests with Unauthorized error', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      const result = await createStoreOnboardingAction({
        name: 'Toko Kopi Kenangan',
        category: 'Makanan & Minuman',
        phone: '081234567890',
        slug: 'toko-kopi-kenangan',
      })

      expect(result).toEqual({ error: 'Unauthorized', success: false })
    })

    it('validates required store inputs and returns fieldErrors', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: createdUserId || 'test-user-id' }),
      )

      const result = await createStoreOnboardingAction({
        name: '',
        category: '',
        phone: '',
        slug: 'INVALID SLUG WITH SPACES',
      })

      expect(result.success).toBe(false)
      const failure = result as { fieldErrors?: Record<string, string[]>; success: false }
      expect(failure.fieldErrors).toBeDefined()
      expect(failure.fieldErrors?.name).toBeDefined()
      expect(failure.fieldErrors?.slug).toBeDefined()
      expect(failure.fieldErrors?.category).toBeDefined()
      expect(failure.fieldErrors?.phone).toBeDefined()
    })

    it('validates slug uniqueness when slug is already taken', async () => {
      const existingSlug = `unique-test-${Date.now()}`
      const existingFixture = await createTestTenant({
        name: 'Existing Store',
        slug: existingSlug,
      })

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: createdUserId || 'test-user-id' }),
      )

      const result = await createStoreOnboardingAction({
        name: 'Duplicate Store',
        category: 'Retail',
        phone: '081234567890',
        slug: existingSlug,
      })

      expect(result.success).toBe(false)
      const failure = result as { fieldErrors?: Record<string, string[]>; success: false }
      expect(failure.fieldErrors?.slug).toBeDefined()
      expect(failure.fieldErrors?.slug?.[0]).toContain('sudah digunakan')

      await existingFixture.cleanup()
    })

    it('provisions organization, owner membership, storefront configs, active org session, and returns success redirect', async () => {
      const slug = `toko-wizard-${Date.now()}`
      const storeName = 'Toko Kopi Mantap'
      const category = 'Makanan & Minuman'
      const phone = '081298765432'

      const sessionFixture = createMerchantSession({
        userId: createdUserId || 'test-user-id',
      })

      // Insert dummy session into DB so activeOrganizationId can be updated
      await db
        .insert(sessionTable)
        .values({
          id: sessionFixture.data!.session.id,
          expiresAt: sessionFixture.data!.session.expiresAt,
          token: sessionFixture.data!.session.token,
          userId: sessionFixture.data!.user.id,
        })
        .onConflictDoNothing()

      vi.spyOn(auth, 'getSession').mockResolvedValue(sessionFixture)

      const result = await createStoreOnboardingAction({
        name: storeName,
        category,
        phone,
        slug,
      })

      expect(result.success).toBe(true)
      const successResult = result as {
        data: { organizationId: string; redirectUrl: string }
        success: true
      }
      expect(successResult.data.redirectUrl).toBe('/dashboard')
      expect(successResult.data.organizationId).toBeDefined()
      createdOrgId = successResult.data.organizationId

      // Assert organization entity created with custom store attributes
      const [org] = await db.select().from(organization).where(eq(organization.id, createdOrgId!))
      expect(org).toBeDefined()
      expect(org.name).toBe(storeName)
      expect(org.slug).toBe(slug)
      expect(org.category).toBe(category)
      expect(org.phone).toBe(phone)
      expect(org.packageTier).toBe('free')
      expect(org.status).toBe('published')

      // Assert merchant added to member table as 'owner'
      const [ownerMember] = await db
        .select()
        .from(member)
        .where(eq(member.organizationId, createdOrgId!))
      expect(ownerMember).toBeDefined()
      expect(ownerMember.userId).toBe(sessionFixture.data!.user.id)
      expect(ownerMember.role).toBe('owner')

      // Assert draft and published storefront_configs provisioned with default sections and theme
      const configs = await db
        .select()
        .from(storefrontConfigs)
        .where(eq(storefrontConfigs.organizationId, createdOrgId!))
      expect(configs).toHaveLength(2)

      const draftConfig = configs.find(c => c.status === 'draft')
      const publishedConfig = configs.find(c => c.status === 'published')
      expect(draftConfig).toBeDefined()
      expect(publishedConfig).toBeDefined()
      expect(draftConfig!.sections).toEqual(DEFAULT_STOREFRONT_SECTIONS)
      expect(draftConfig!.theme).toEqual(DEFAULT_STOREFRONT_THEME)
      expect(publishedConfig!.sections).toEqual(DEFAULT_STOREFRONT_SECTIONS)
      expect(publishedConfig!.theme).toEqual(DEFAULT_STOREFRONT_THEME)

      // Assert active organization session updated in DB
      const [updatedSession] = await db
        .select()
        .from(sessionTable)
        .where(eq(sessionTable.id, sessionFixture.data!.session.id))
      expect(updatedSession?.activeOrganizationId).toBe(createdOrgId)

      // Assert active organization cookie set
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'better-auth.active_organization_id',
        createdOrgId,
        expect.any(Object),
      )
    })

    it('sanitizes unexpected server errors and logs them to console.error', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: createdUserId || 'test-user-id' }),
      )
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(db, 'transaction').mockRejectedValueOnce(new Error('Fatal DB crash'))

      const result = await createStoreOnboardingAction({
        name: 'Toko Error Test',
        category: 'Retail',
        phone: '081234567890',
        slug: `error-slug-${Date.now()}`,
      })

      expect(result).toEqual({
        error: 'Gagal membuat toko. Silakan coba beberapa saat lagi.',
        success: false,
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to create store onboarding:',
        expect.any(Error),
      )
      consoleErrorSpy.mockRestore()
    })
  })

  describe('onboarding route guard (DashboardGuard)', () => {
    it('redirects unauthenticated merchant to /login', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      await expect(
        DashboardGuard({
          children: React.createElement('div', null, 'Protected Dashboard Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/login')

      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects authenticated merchant with zero organizations to /onboarding', async () => {
      const zeroOrgUserId = `zero-user-${Date.now()}`
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: zeroOrgUserId }),
      )

      await expect(
        DashboardGuard({
          children: React.createElement('div', null, 'Protected Dashboard Content'),
        }),
      ).rejects.toThrow('NEXT_REDIRECT:/onboarding')

      expect(redirect).toHaveBeenCalledWith('/onboarding')
    })

    it('grants access to authenticated merchant with an organization', async () => {
      const orgUserId = `org-user-${Date.now()}`
      const fixture = await createTestTenant({
        name: 'Merchant With Store',
        userId: orgUserId,
      })

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: orgUserId }),
      )

      const element = await DashboardGuard({
        children: React.createElement('div', null, 'Protected Dashboard Content'),
      })

      expect(element).toBeDefined()
      expect(redirect).not.toHaveBeenCalled()

      await fixture.cleanup()
    })
  })
})
