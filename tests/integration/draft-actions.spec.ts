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

import { createMerchantSession, createUnauthenticatedSession } from '../fixtures/session-fixture'
import { createTestTenant } from '../fixtures/tenant-fixture'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Storefront draft and publish Server Actions', () => {
  const mockUserId = crypto.randomUUID()
  const otherUserId = crypto.randomUUID()
  let tenantFixture: TestTenantFixture
  let otherTenantFixture: TestTenantFixture

  beforeAll(async () => {
    await db.insert(userInNeonAuth).values([
      {
        id: mockUserId,
        name: 'Merchant Test',
        email: `merchant-draft-${Date.now()}@example.com`,
        emailVerified: true,
      },
      {
        id: otherUserId,
        name: 'Other Merchant',
        email: `other-merchant-${Date.now()}@example.com`,
        emailVerified: true,
      },
    ])

    tenantFixture = await createTestTenant({
      name: 'Draft Test Store',
      userId: mockUserId,
      draftTheme: {
        fontFamily: 'font-sans',
        layoutId: 'modern',
        themeColor: '#111111',
      },
      theme: {
        fontFamily: 'font-sans',
        layoutId: 'modern',
        themeColor: '#111111',
      },
    })

    otherTenantFixture = await createTestTenant({
      name: 'Other Store',
      userId: otherUserId,
    })
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await tenantFixture?.cleanup()
    await otherTenantFixture?.cleanup()
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, mockUserId))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, otherUserId))
  })

  describe('saveStorefrontDraftAction seam', () => {
    it('rejects unauthenticated requests with Unauthorized error', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      const result = await saveStorefrontDraftAction(tenantFixture.tenantId, {
        theme: { themeColor: '#ff0000' },
      })

      expect(result).toEqual({
        error: 'Unauthorized',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects unauthenticated requests when session user id is missing', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ userId: '' }))

      const result = await saveStorefrontDraftAction(tenantFixture.tenantId, {
        theme: { themeColor: '#ff0000' },
      })

      expect(result).toEqual({
        error: 'Unauthorized',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects modification when tenant is owned by another user or non-existent', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: mockUserId }),
      )

      const result = await saveStorefrontDraftAction(otherTenantFixture.tenantId, {
        theme: { themeColor: '#ff0000' },
      })

      expect(result).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects invalid schema inputs with field error details', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: mockUserId }),
      )

      const invalidPayload = {
        sections: [
          {
            id: '',
            type: 'invalid_type',
            content: {},
            isVisible: true,
            sortOrder: 'not-a-number',
          },
        ],
      }

      const result = await saveStorefrontDraftAction(tenantFixture.tenantId, invalidPayload)

      expect(result).toMatchObject({
        error: expect.any(String),
        fieldErrors: expect.any(Object),
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('updates storefront draft config without touching published config', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: mockUserId }),
      )

      const updatedTheme: StorefrontTheme = {
        fontFamily: 'font-serif',
        layoutId: 'warm-editorial',
        themeColor: '#4f46e5',
      }

      const updatedSections: StorefrontSection[] = [
        {
          id: 'hero-1',
          type: 'hero',
          content: { headline: 'New Draft Headline' },
          isVisible: true,
          sortOrder: 0,
        },
        {
          id: 'catalog-1',
          type: 'catalog',
          content: { showFilters: true },
          isVisible: true,
          sortOrder: 1,
        },
      ]

      const result = await saveStorefrontDraftAction(tenantFixture.tenantId, {
        sections: updatedSections,
        theme: updatedTheme,
      })

      expect(result).toMatchObject({
        success: true,
        data: {
          sections: updatedSections,
          status: 'draft',
          tenantId: tenantFixture.tenantId,
          theme: updatedTheme,
        },
      })

      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/[tenantSlug]/editor')

      // Verify draft in database
      const [draftInDb] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantFixture.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )

      expect(draftInDb.theme).toMatchObject(updatedTheme)
      expect(draftInDb.sections).toEqual(updatedSections)

      // Verify published config remains unchanged
      const [publishedInDb] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantFixture.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      expect(publishedInDb.theme).not.toMatchObject(updatedTheme)
    })

    it('preserves existing sections when only theme is updated', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: mockUserId }))

      // Get current draft
      const [currentDraft] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantFixture.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )

      const newTheme: StorefrontTheme = {
        fontFamily: 'font-serif',
        layoutId: 'warm-editorial',
        themeColor: '#123456',
      }

      const result = await saveStorefrontDraftAction(tenantFixture.tenantId, {
        theme: newTheme,
      })

      expect(result).toMatchObject({
        success: true,
        data: {
          sections: currentDraft.sections,
          theme: newTheme,
        },
      })
    })
  })

  describe('publishStorefrontDraftAction seam', () => {
    it('rejects unauthenticated requests with Unauthorized error', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      const result = await publishStorefrontDraftAction(tenantFixture.tenantId)

      expect(result).toEqual({
        error: 'Unauthorized',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects publish when tenant is owned by another user or non-existent', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: mockUserId }),
      )

      const result = await publishStorefrontDraftAction(otherTenantFixture.tenantId)

      expect(result).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('transactionally copies draft theme and sections to published record and updates timestamps', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: mockUserId }))

      const publishedSections: StorefrontSection[] = [
        {
          id: 'hero-published',
          type: 'hero',
          content: { headline: 'Ready to Publish' },
          isVisible: true,
          sortOrder: 0,
        },
      ]
      const publishedTheme: StorefrontTheme = {
        fontFamily: 'font-mono',
        layoutId: 'minimal',
        themeColor: '#059669',
      }

      // First save to draft
      await saveStorefrontDraftAction(tenantFixture.tenantId, {
        sections: publishedSections,
        theme: publishedTheme,
      })

      vi.clearAllMocks()
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: mockUserId }),
      )

      const beforePublishTenant = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantFixture.tenantId))
        .limit(1)

      const result = await publishStorefrontDraftAction(tenantFixture.tenantId)

      expect(result).toMatchObject({
        success: true,
        data: {
          sections: publishedSections,
          status: 'published',
          tenantId: tenantFixture.tenantId,
          theme: publishedTheme,
        },
      })

      // Check revalidatePath was called for public and dashboard paths
      expect(revalidatePath).toHaveBeenCalledWith('/site/[slug]')
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/[tenantSlug]')

      // Verify published record in DB
      const [publishedInDb] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantFixture.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      expect(publishedInDb.theme).toMatchObject(publishedTheme)
      expect(publishedInDb.sections).toEqual(publishedSections)

      // Verify tenants.updatedAt was updated
      const [afterPublishTenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantFixture.tenantId))
        .limit(1)

      expect(afterPublishTenant.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforePublishTenant[0].updatedAt.getTime(),
      )
    })

    it('returns error when draft config does not exist', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: otherUserId }),
      )

      // Delete the draft record for other tenant temporarily
      await db
        .delete(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, otherTenantFixture.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )

      const result = await publishStorefrontDraftAction(otherTenantFixture.tenantId)

      expect(result).toEqual({
        error: 'Draft configuration not found',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })
  })

  describe('discardStorefrontDraftAction seam', () => {
    it('rejects unauthenticated requests with Unauthorized error', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())

      const result = await discardStorefrontDraftAction(tenantFixture.tenantId)

      expect(result).toEqual({
        error: 'Unauthorized',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('rejects discard when tenant is owned by another user or non-existent', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: mockUserId }),
      )

      const result = await discardStorefrontDraftAction(otherTenantFixture.tenantId)

      expect(result).toEqual({
        error: 'Tenant not found or forbidden',
        success: false,
      })
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('resets draft record to match active published record', async () => {
      // First modify the draft with uncommitted changes
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: mockUserId }))

      await saveStorefrontDraftAction(tenantFixture.tenantId, {
        theme: { themeColor: '#999999' },
        sections: [
          {
            id: 'unwanted-draft',
            type: 'hero',
            content: { headline: 'This should be discarded' },
            isVisible: true,
            sortOrder: 0,
          },
        ],
      })

      // Fetch the currently active published config to compare against
      const [publishedConfig] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantFixture.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      vi.clearAllMocks()
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: mockUserId }),
      )

      const result = await discardStorefrontDraftAction(tenantFixture.tenantId)

      expect(result).toMatchObject({
        success: true,
        data: {
          sections: publishedConfig.sections,
          status: 'draft',
          tenantId: tenantFixture.tenantId,
          theme: publishedConfig.theme,
        },
      })

      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/[tenantSlug]/editor')

      // Verify draft in DB matches published
      const [draftInDb] = await db
        .select()
        .from(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, tenantFixture.tenantId),
            eq(storefrontConfigs.status, 'draft'),
          ),
        )

      expect(draftInDb.theme).toEqual(publishedConfig.theme)
      expect(draftInDb.sections).toEqual(publishedConfig.sections)
    })

    it('resets draft to empty defaults if no published record exists', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue(createMerchantSession({ userId: otherUserId }))

      // Delete published record for other tenant
      await db
        .delete(storefrontConfigs)
        .where(
          and(
            eq(storefrontConfigs.tenantId, otherTenantFixture.tenantId),
            eq(storefrontConfigs.status, 'published'),
          ),
        )

      // Ensure a draft exists with some data
      await saveStorefrontDraftAction(otherTenantFixture.tenantId, {
        theme: { themeColor: '#333333' },
        sections: [
          {
            id: 'temp-hero',
            type: 'hero',
            content: {},
            isVisible: true,
            sortOrder: 0,
          },
        ],
      })

      vi.clearAllMocks()
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce(
        createMerchantSession({ userId: otherUserId }),
      )

      const result = await discardStorefrontDraftAction(otherTenantFixture.tenantId)

      expect(result).toMatchObject({
        success: true,
        data: {
          sections: [],
          theme: {},
        },
      })
    })
  })
})
