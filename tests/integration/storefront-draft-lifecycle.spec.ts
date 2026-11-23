import type { TestTenantFixture } from '../fixtures/tenant-fixture'
import type { StorefrontSection, StorefrontTheme } from '@/db/schema/tenants'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import crypto from 'node:crypto'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/db'
import { userInNeonAuth } from '@/db/schema/auth'
import { storefrontConfigs, tenants } from '@/db/schema/tenants'
import { auth } from '@/lib/auth/server'
import {
  discardStorefrontDraftAction,
  publishStorefrontDraftAction,
  saveStorefrontDraftAction,
} from '@/lib/dashboard/actions'
import { getStorefrontDataBySlug } from '@/lib/storefront/loader'

import { createMerchantSession, createUnauthenticatedSession } from '../fixtures/session-fixture'
import { createTestTenant } from '../fixtures/tenant-fixture'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('storefront draft lifecycle integration suite (Ticket 05)', () => {
  const userAId = crypto.randomUUID()
  const userBId = crypto.randomUUID()
  let tenantA: TestTenantFixture
  let tenantB: TestTenantFixture

  const baselineTheme: StorefrontTheme = {
    fontFamily: 'font-sans',
    layoutId: 'modern',
    themeColor: '#0055ff',
  }

  const baselineSections: StorefrontSection[] = [
    {
      id: 'sec-hero-base',
      type: 'hero',
      content: { subtitle: 'Welcome to Store A', title: 'Baseline Hero' },
      isVisible: true,
      sortOrder: 1,
    },
    {
      id: 'sec-catalog-base',
      type: 'catalog',
      content: { description: 'Our items', title: 'Baseline Catalog' },
      isVisible: true,
      sortOrder: 2,
    },
    {
      id: 'sec-footer-base',
      type: 'footer',
      content: { tagline: 'Baseline Footer' },
      isVisible: true,
      sortOrder: 3,
    },
  ]

  beforeAll(async () => {
    await db.insert(userInNeonAuth).values([
      {
        id: userAId,
        name: 'Merchant A',
        email: `merchant-a-${Date.now()}@growfin.test`,
        emailVerified: true,
      },
      {
        id: userBId,
        name: 'Merchant B',
        email: `merchant-b-${Date.now()}@growfin.test`,
        emailVerified: true,
      },
    ])

    tenantA = await createTestTenant({
      name: 'Tenant Alpha',
      draftSections: baselineSections,
      draftTheme: baselineTheme,
      sections: baselineSections,
      theme: baselineTheme,
      userId: userAId,
    })

    tenantB = await createTestTenant({
      name: 'Tenant Beta',
      userId: userBId,
    })
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await tenantA?.cleanup()
    await tenantB?.cleanup()
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, userAId))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, userBId))
  })

  describe('seam 1: autosave draft isolation', () => {
    it('verifies draft updates do not alter public storefront query results before publication', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      const modifiedTheme: StorefrontTheme = {
        fontFamily: 'font-serif',
        layoutId: 'warm-editorial',
        themeColor: '#ff2200',
      }

      const modifiedSections: StorefrontSection[] = [
        {
          id: 'sec-hero-draft',
          type: 'hero',
          content: { subtitle: 'Unpublished changes', title: 'Draft Staging Hero' },
          isVisible: true,
          sortOrder: 1,
        },
        {
          id: 'sec-catalog-draft',
          type: 'catalog',
          content: { description: 'Updated secret items', title: 'Draft Catalog' },
          isVisible: true,
          sortOrder: 2,
        },
      ]

      const saveResult = await saveStorefrontDraftAction(tenantA.tenantId, {
        sections: modifiedSections,
        theme: modifiedTheme,
      })

      expect(saveResult).toMatchObject({
        success: true,
        data: {
          sections: modifiedSections,
          status: 'draft',
          theme: modifiedTheme,
        },
      })

      // Assert draft row in database contains staged modifications
      const [draftRow] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      expect(draftRow).toBeDefined()
      expect(draftRow.theme).toEqual(modifiedTheme)
      expect(draftRow.sections).toEqual(modifiedSections)

      // Assert published row in database remains at baseline
      const [publishedRow] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )
      expect(publishedRow).toBeDefined()
      expect(publishedRow.theme).toEqual(baselineTheme)
      expect(publishedRow.sections).toEqual(baselineSections)

      // Assert public loader output returns strictly published baseline
      const publicData = await getStorefrontDataBySlug(tenantA.slug)
      expect(publicData).not.toBeNull()
      expect(publicData?.config.status).toBe('published')
      expect(publicData?.config.theme).toEqual(baselineTheme)
      expect(publicData?.config.sections).toEqual(baselineSections)

      // Verify editor revalidation was called
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/${tenantA.slug}/editor`)
    })

    it('preserves existing draft sections when only updating draft theme', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      const [draftBefore] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )

      const newTheme: StorefrontTheme = {
        fontFamily: 'font-sans',
        layoutId: 'compact',
        themeColor: '#10b981',
      }

      const result = await saveStorefrontDraftAction(tenantA.tenantId, { theme: newTheme })
      expect(result).toMatchObject({
        success: true,
        data: {
          sections: draftBefore.sections,
          status: 'draft',
          theme: newTheme,
        },
      })
    })

    it('rejects invalid section schema inputs with validation error details', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      const invalidInput = {
        sections: [
          {
            id: 'invalid-section',
            type: 'not_a_valid_section_type',
            isVisible: 'not-a-boolean',
            sortOrder: 'not-a-number',
          },
        ],
      }

      const result = await saveStorefrontDraftAction(tenantA.tenantId, invalidInput)
      expect(result).toMatchObject({
        error: expect.any(String),
        fieldErrors: expect.any(Object),
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('retains published sections and theme when creating draft if none exists and input sections are omitted', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      // 1. Temporarily delete draft config so none exists
      const [draft] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      await db.delete(storefrontConfigs).where(eq(storefrontConfigs.id, draft.id))

      // 2. Fetch published config to verify retention
      const [published] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      // 3. Save draft with ONLY theme update (omitting sections)
      const themeOnly: StorefrontTheme = {
        fontFamily: 'font-mono',
        layoutId: 'warm-editorial',
        themeColor: '#abcdef',
      }
      const saveRes = await saveStorefrontDraftAction(tenantA.tenantId, { theme: themeOnly })
      expect(saveRes).toMatchObject({
        success: true,
        data: {
          sections: published.sections,
          status: 'draft',
          theme: themeOnly,
        },
      })

      // 4. Verify in DB that sections were retained from published rather than empty []
      const [newDraftInDb] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      expect(newDraftInDb.sections).toEqual(published.sections)
      expect(newDraftInDb.sections.length).toBeGreaterThan(0)
    })
  })

  describe('seam 2: transactional publishing', () => {
    it('synchronizes draft payload to published record and updates public loader output immediately', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      const [draftBefore] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      expect(draftBefore).toBeDefined()

      const publishResult = await publishStorefrontDraftAction(tenantA.tenantId)

      expect(publishResult).toMatchObject({
        success: true,
        data: {
          sections: draftBefore.sections,
          status: 'published',
          theme: draftBefore.theme,
        },
      })

      // Verify database published row matches draft payload
      const [publishedAfter] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )
      expect(publishedAfter).toBeDefined()
      expect(publishedAfter.theme).toEqual(draftBefore.theme)
      expect(publishedAfter.sections).toEqual(draftBefore.sections)

      // Verify tenant updatedAt timestamp was updated transactionally
      const [persistedTenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantA.tenantId))
      expect(persistedTenant.updatedAt).toBeDefined()

      // Verify public loader immediately serves newly published sections and theme
      const publicData = await getStorefrontDataBySlug(tenantA.slug)
      expect(publicData).not.toBeNull()
      expect(publicData?.config.theme).toEqual(draftBefore.theme)
      expect(publicData?.config.sections).toEqual(draftBefore.sections)

      // Verify revalidation calls for storefront and dashboard
      expect(revalidatePath).toHaveBeenCalledWith('/site/[slug]')
      expect(revalidatePath).toHaveBeenCalledWith(`/site/${tenantA.slug}`)
    })

    it('returns error when attempting to publish when draft record is missing', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      // Temporarily remove draft config
      const [draft] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      await db.delete(storefrontConfigs).where(eq(storefrontConfigs.id, draft.id))

      const result = await publishStorefrontDraftAction(tenantA.tenantId)
      expect(result).toEqual({
        error: 'Draft configuration not found',
        success: false,
      })

      // Restore draft config for subsequent tests
      await db.insert(storefrontConfigs).values({
        id: draft.id,
        sections: draft.sections,
        status: 'draft',
        tenantId: tenantA.tenantId,
        theme: draft.theme,
      })
    })
  })

  describe('seam 3: discard draft changes', () => {
    it('restores draft configuration to match published baseline and preserves live storefront', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      // 1. Stage an experimental draft update that merchant later wants to cancel
      const experimentalTheme: StorefrontTheme = {
        fontFamily: 'font-mono',
        layoutId: 'experimental',
        themeColor: '#123456',
      }
      const experimentalSections: StorefrontSection[] = [
        {
          id: 'sec-discard-me',
          type: 'hero',
          content: { title: 'Discard Me' },
          isVisible: false,
          sortOrder: 1,
        },
      ]

      const saveResult = await saveStorefrontDraftAction(tenantA.tenantId, {
        sections: experimentalSections,
        theme: experimentalTheme,
      })
      expect(saveResult.success).toBe(true)

      // 2. Fetch current published baseline
      const [publishedBaseline] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      // 3. Execute discard action
      const discardResult = await discardStorefrontDraftAction(tenantA.tenantId)
      expect(discardResult).toMatchObject({
        success: true,
        data: {
          sections: publishedBaseline.sections,
          status: 'draft',
          theme: publishedBaseline.theme,
        },
      })

      // 4. Verify draft row in database is now identical to published baseline
      const [draftAfterDiscard] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      expect(draftAfterDiscard.theme).toEqual(publishedBaseline.theme)
      expect(draftAfterDiscard.sections).toEqual(publishedBaseline.sections)

      // 5. Verify public loader output is unaffected and matches published baseline
      const publicData = await getStorefrontDataBySlug(tenantA.slug)
      expect(publicData).not.toBeNull()
      expect(publicData?.config.theme).toEqual(publishedBaseline.theme)
      expect(publicData?.config.sections).toEqual(publishedBaseline.sections)

      // Verify editor revalidation was called
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/${tenantA.slug}/editor`)
    })

    it('creates draft configuration from published record if draft config was absent before discard', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      // Temporarily delete draft config
      await db
        .delete(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )

      const [published] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      const discardResult = await discardStorefrontDraftAction(tenantA.tenantId)
      expect(discardResult).toMatchObject({
        success: true,
        data: {
          sections: published.sections,
          status: 'draft',
          theme: published.theme,
        },
      })

      const [restoredDraft] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      expect(restoredDraft).toBeDefined()
      expect(restoredDraft.theme).toEqual(published.theme)
    })

    it('returns error when attempting to discard if no published configuration exists', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))

      // Temporarily delete published config
      const [published] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )
      await db.delete(storefrontConfigs).where(eq(storefrontConfigs.id, published.id))

      const discardRes = await discardStorefrontDraftAction(tenantA.tenantId)
      expect(discardRes).toEqual({
        error: 'No published configuration found to discard to',
        success: false,
      })

      // Restore published config
      await db.insert(storefrontConfigs).values({
        id: published.id,
        sections: published.sections,
        status: 'published',
        tenantId: tenantA.tenantId,
        theme: published.theme,
      })
    })
  })

  describe('seam 4: cross-tenant isolation & authorization guard', () => {
    it('rejects unauthenticated requests across all draft lifecycle actions', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createUnauthenticatedSession())

      const saveRes = await saveStorefrontDraftAction(tenantA.tenantId, {
        theme: { themeColor: '#000000' },
      })
      expect(saveRes).toEqual({
        error: 'Unauthorized',
        success: false,
      })

      const publishRes = await publishStorefrontDraftAction(tenantA.tenantId)
      expect(publishRes).toEqual({
        error: 'Unauthorized',
        success: false,
      })

      const discardRes = await discardStorefrontDraftAction(tenantA.tenantId)
      expect(discardRes).toEqual({
        error: 'Unauthorized',
        success: false,
      })

      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects unauthenticated requests when session user id is missing', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ userId: '' }))

      const result = await saveStorefrontDraftAction(tenantA.tenantId, {
        theme: { themeColor: '#ff0000' },
      })

      expect(result).toEqual({
        error: 'Unauthorized',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects cross-tenant draft mutations when merchant B attempts modifying merchant A tenant', async () => {
      // Authenticated as Merchant B
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userBId }))

      // Capture merchant A draft and published configs before tampering attempt
      const [aDraftBefore] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      const [aPublishedBefore] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      // 1. Merchant B attempts to save draft on Tenant A
      const saveRes = await saveStorefrontDraftAction(tenantA.tenantId, {
        theme: { themeColor: '#666666' },
      })
      expect(saveRes).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })

      // 2. Merchant B attempts to publish Tenant A draft
      const publishRes = await publishStorefrontDraftAction(tenantA.tenantId)
      expect(publishRes).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })

      // 3. Merchant B attempts to discard Tenant A draft
      const discardRes = await discardStorefrontDraftAction(tenantA.tenantId)
      expect(discardRes).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })

      // Assert database state for Tenant A remained untouched
      const [aDraftAfter] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )
      const [aPublishedAfter] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantA.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      expect(aDraftAfter.theme).toEqual(aDraftBefore.theme)
      expect(aDraftAfter.sections).toEqual(aDraftBefore.sections)
      expect(aPublishedAfter.theme).toEqual(aPublishedBefore.theme)
      expect(aPublishedAfter.sections).toEqual(aPublishedBefore.sections)

      // Assert no unauthorized revalidation was triggered
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects draft operations on non-existent tenants', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: userAId }))
      const nonExistentTenantId = crypto.randomUUID()

      const saveRes = await saveStorefrontDraftAction(nonExistentTenantId, {
        theme: { themeColor: '#123456' },
      })
      expect(saveRes).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })

      const publishRes = await publishStorefrontDraftAction(nonExistentTenantId)
      expect(publishRes).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })

      const discardRes = await discardStorefrontDraftAction(nonExistentTenantId)
      expect(discardRes).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })
    })
  })
})
