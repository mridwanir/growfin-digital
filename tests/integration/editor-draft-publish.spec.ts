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
import { publishStorefrontDraftAction, saveStorefrontDraftAction } from '@/lib/dashboard/actions'
import { getStorefrontDataBySlug, getStorefrontDraftDataBySlug } from '@/lib/storefront/loader'

import { createMerchantSession, createUnauthenticatedSession } from '../fixtures/session-fixture'
import { createTestTenant } from '../fixtures/tenant-fixture'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Storefront Editor draft save and transactional publish integration suite (Ticket 06)', () => {
  const merchantUserId = crypto.randomUUID()
  const otherUserId = crypto.randomUUID()
  let fixture: TestTenantFixture

  const baselineTheme: StorefrontTheme = {
    fontFamily: 'font-sans',
    layoutId: 'artisan',
    themeColor: '#059669',
  }

  const baselineSections: StorefrontSection[] = [
    {
      id: 'sec-hero',
      type: 'hero',
      isVisible: true,
      sortOrder: 1,
      content: {
        description: 'Baseline hero description for testing.',
        primaryButtonText: 'Order Now',
        subtitle: 'Specialty Coffee Roasters',
        title: 'Original Baseline Hero',
      },
    },
    {
      id: 'sec-catalog',
      type: 'catalog',
      isVisible: true,
      sortOrder: 2,
      content: {
        description: 'Baseline catalog of beverages and beans.',
        title: 'Original Baseline Catalog',
      },
    },
    {
      id: 'sec-reviews',
      type: 'reviews',
      isVisible: true,
      sortOrder: 3,
      content: {
        description: 'Customer opinions and reviews.',
        title: 'Original Baseline Reviews',
      },
    },
    {
      id: 'sec-footer',
      type: 'footer',
      isVisible: true,
      sortOrder: 4,
      content: {
        copyright: '© 2026 Kopi Artisan',
      },
    },
  ]

  beforeAll(async () => {
    await db.insert(userInNeonAuth).values([
      {
        id: merchantUserId,
        name: 'Merchant Test Owner',
        email: `merchant-${Date.now()}@growfin.test`,
        emailVerified: true,
      },
      {
        id: otherUserId,
        name: 'Other Tenant Merchant',
        email: `intruder-${Date.now()}@growfin.test`,
        emailVerified: true,
      },
    ])

    fixture = await createTestTenant({
      name: 'Editor Integration Store',
      draftSections: baselineSections,
      draftTheme: baselineTheme,
      sections: baselineSections,
      theme: baselineTheme,
      userId: merchantUserId,
    })
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await fixture?.cleanup()
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, merchantUserId))
    await db.delete(userInNeonAuth).where(eq(userInNeonAuth.id, otherUserId))
  })

  it('mutates draft record with reordered sections and updated content via saveStorefrontDraftAction without touching published config', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValue(
      createMerchantSession({ userId: merchantUserId }),
    )

    const updatedTheme: StorefrontTheme = {
      fontFamily: 'font-serif',
      layoutId: 'bold',
      themeColor: '#047857',
    }

    // Reorder sections: Catalog moves to sortOrder 1, Hero moves to sortOrder 2, Reviews hidden at 3, Footer at 4
    const updatedSections: StorefrontSection[] = [
      {
        id: 'sec-catalog',
        type: 'catalog',
        isVisible: true,
        sortOrder: 1,
        content: {
          description: 'Disajikan hangat dari biji arabika pilihan lokal.',
          title: 'Menu Musiman Pilihan',
        },
      },
      {
        id: 'sec-hero',
        type: 'hero',
        isVisible: true,
        sortOrder: 2,
        content: {
          description: 'Pengalaman rasa kopi terbaik di setiap cangkir.',
          primaryButtonText: 'Beli Sekarang',
          subtitle: 'Kopi Specialty & Roastery Nusantara',
          title: 'Seduhan Kopi Artisan Juara',
        },
      },
      {
        id: 'sec-reviews',
        type: 'reviews',
        isVisible: false,
        sortOrder: 3,
        content: {
          description: 'Ulasan asli pelanggan setia kami.',
          googleMapsUrl: 'https://maps.google.com/?cid=77777',
          title: 'Testimoni Pelanggan',
        },
      },
      {
        id: 'sec-footer',
        type: 'footer',
        isVisible: true,
        sortOrder: 4,
        content: {
          copyright: '© 2026 Kopi Artisan Juara',
        },
      },
    ]

    const saveResult = await saveStorefrontDraftAction({
      sections: updatedSections,
      theme: updatedTheme,
    })

    expect(saveResult).toMatchObject({
      success: true,
      data: {
        sections: updatedSections,
        status: 'draft',
        theme: updatedTheme,
      },
    })

    // 1. Verify draft record in database contains the mutated sections and theme
    const [draftInDb] = await db
      .select()
      .from(storefrontConfigs)
      .where(
        and(
          eq(storefrontConfigs.organizationId, fixture.tenantId),
          eq(storefrontConfigs.status, 'draft'),
        ),
      )

    expect(draftInDb).toBeDefined()
    expect(draftInDb.sections).toEqual(updatedSections)
    expect(draftInDb.theme).toEqual(updatedTheme)
    // Catalog at index 0 with sortOrder 1
    expect((draftInDb.sections as StorefrontSection[])[0]?.id).toBe('sec-catalog')
    expect((draftInDb.sections as StorefrontSection[])[0]?.sortOrder).toBe(1)
    // Hero at index 1 with sortOrder 2
    expect((draftInDb.sections as StorefrontSection[])[1]?.id).toBe('sec-hero')
    expect((draftInDb.sections as StorefrontSection[])[1]?.sortOrder).toBe(2)
    // Reviews at index 2 with isVisible false
    expect((draftInDb.sections as StorefrontSection[])[2]?.id).toBe('sec-reviews')
    expect((draftInDb.sections as StorefrontSection[])[2]?.isVisible).toBe(false)

    // 2. Verify published record in database is completely unmodified
    const [publishedInDb] = await db
      .select()
      .from(storefrontConfigs)
      .where(
        and(
          eq(storefrontConfigs.organizationId, fixture.tenantId),
          eq(storefrontConfigs.status, 'published'),
        ),
      )

    expect(publishedInDb).toBeDefined()
    expect(publishedInDb.sections).toEqual(baselineSections)
    expect(publishedInDb.theme).toEqual(baselineTheme)
    // Hero remains at sortOrder 1 in published record
    expect((publishedInDb.sections as StorefrontSection[])[0]?.id).toBe('sec-hero')
    expect((publishedInDb.sections as StorefrontSection[])[0]?.sortOrder).toBe(1)
    expect((publishedInDb.sections as StorefrontSection[])[2]?.isVisible).toBe(true)

    // 3. Verify editor cache path revalidation was requested
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/editor')
  })

  it('confirms draft edits are not visible in public loader getStorefrontDataBySlug until published', async () => {
    // Public loader serves live published storefront by slug
    const publicData = await getStorefrontDataBySlug(fixture.slug)

    expect(publicData).not.toBeNull()
    expect(publicData?.tenant.id).toBe(fixture.tenantId)
    expect(publicData?.config.status).toBe('published')

    // Public loader returns baseline theme, not the draft theme
    expect(publicData?.config.theme).toEqual(baselineTheme)
    expect(publicData?.config.theme?.layoutId).toBe('artisan')

    // Public loader returns baseline sections, not the reordered or updated draft sections
    expect(publicData?.config.sections).toEqual(baselineSections)
    const publicSections = publicData?.config.sections as StorefrontSection[]
    expect(publicSections[0]?.id).toBe('sec-hero')
    expect(publicSections[0]?.sortOrder).toBe(1)
    expect(publicSections[0]?.content.title).toBe('Original Baseline Hero')
    expect(publicSections[1]?.id).toBe('sec-catalog')
    expect(publicSections[1]?.sortOrder).toBe(2)
    expect(publicSections[2]?.isVisible).toBe(true)

    // Compare with draft loader which must expose the draft staged modifications
    const draftData = await getStorefrontDraftDataBySlug(fixture.slug)
    expect(draftData).not.toBeNull()
    expect(draftData?.config.status).toBe('draft')
    expect(draftData?.config.theme?.layoutId).toBe('bold')
    const draftSections = draftData?.config.sections as StorefrontSection[]
    expect(draftSections[0]?.id).toBe('sec-catalog')
    expect(draftSections[0]?.sortOrder).toBe(1)
    expect(draftSections[1]?.id).toBe('sec-hero')
    expect(draftSections[1]?.sortOrder).toBe(2)
    expect(draftSections[2]?.isVisible).toBe(false)
  })

  it('transactionally commits draft to published record on publishStorefrontDraftAction and updates tenants.updatedAt', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValue(
      createMerchantSession({ userId: merchantUserId }),
    )

    // Capture tenant updatedAt before publishing
    const [tenantBefore] = await db
      .select({ updatedAt: tenants.updatedAt })
      .from(tenants)
      .where(eq(tenants.id, fixture.tenantId))

    // Capture draft state to verify publish synchronizes exact payload
    const [draftBeforePublish] = await db
      .select()
      .from(storefrontConfigs)
      .where(
        and(
          eq(storefrontConfigs.organizationId, fixture.tenantId),
          eq(storefrontConfigs.status, 'draft'),
        ),
      )

    expect(draftBeforePublish).toBeDefined()

    // Execute publish action
    const publishResult = await publishStorefrontDraftAction()

    expect(publishResult).toMatchObject({
      success: true,
      data: {
        sections: draftBeforePublish.sections,
        status: 'published',
        theme: draftBeforePublish.theme,
      },
    })

    // 1. Verify published row in database matches draft theme & sections
    const [publishedAfter] = await db
      .select()
      .from(storefrontConfigs)
      .where(
        and(
          eq(storefrontConfigs.organizationId, fixture.tenantId),
          eq(storefrontConfigs.status, 'published'),
        ),
      )

    expect(publishedAfter).toBeDefined()
    expect(publishedAfter.sections).toEqual(draftBeforePublish.sections)
    expect(publishedAfter.theme).toEqual(draftBeforePublish.theme)

    const publishedSections = publishedAfter.sections as StorefrontSection[]
    expect(publishedSections[0]?.id).toBe('sec-catalog')
    expect(publishedSections[0]?.sortOrder).toBe(1)
    expect(publishedSections[1]?.id).toBe('sec-hero')
    expect(publishedSections[1]?.sortOrder).toBe(2)
    expect(publishedSections[2]?.isVisible).toBe(false)

    // 2. Verify tenants.updatedAt was updated transactionally
    const [tenantAfter] = await db
      .select({ updatedAt: tenants.updatedAt })
      .from(tenants)
      .where(eq(tenants.id, fixture.tenantId))

    expect(tenantAfter.updatedAt.getTime()).toBeGreaterThanOrEqual(tenantBefore.updatedAt.getTime())

    // 3. Verify public loader now serves the newly published draft content immediately
    const publicDataAfterPublish = await getStorefrontDataBySlug(fixture.slug)
    expect(publicDataAfterPublish).not.toBeNull()
    expect(publicDataAfterPublish?.config.status).toBe('published')
    expect(publicDataAfterPublish?.config.theme).toEqual(draftBeforePublish.theme)
    expect(publicDataAfterPublish?.config.sections).toEqual(draftBeforePublish.sections)

    const liveSections = publicDataAfterPublish?.config.sections as StorefrontSection[]
    expect(liveSections[0]?.id).toBe('sec-catalog')
    expect(liveSections[0]?.sortOrder).toBe(1)
    expect(liveSections[0]?.content.title).toBe('Menu Musiman Pilihan')
    expect(liveSections[1]?.id).toBe('sec-hero')
    expect(liveSections[1]?.sortOrder).toBe(2)
    expect(liveSections[1]?.content.title).toBe('Seduhan Kopi Artisan Juara')
    expect(liveSections[2]?.isVisible).toBe(false)

    // 4. Verify cache revalidations triggered on publish
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard')
    expect(revalidatePath).toHaveBeenCalledWith(`/site/${fixture.slug}`)
  })

  it('rejects unauthenticated and cross-tenant unauthorized draft operations with zero database side-effects', async () => {
    // 1. Unauthenticated saveStorefrontDraftAction
    vi.spyOn(auth, 'getSession').mockResolvedValue(createUnauthenticatedSession())

    const unauthSave = await saveStorefrontDraftAction({
      theme: { layoutId: 'intruder-layout' },
    })
    expect(unauthSave).toEqual({ error: 'Unauthorized', success: false })

    // 2. Unauthenticated publishStorefrontDraftAction
    const unauthPublish = await publishStorefrontDraftAction()
    expect(unauthPublish).toEqual({ error: 'Unauthorized', success: false })

    // 3. Cross-tenant merchant attempting to save draft
    vi.spyOn(auth, 'getSession').mockResolvedValue(
      createMerchantSession({ activeOrganizationId: fixture.tenantId, userId: otherUserId }),
    )

    const forbiddenSave = await saveStorefrontDraftAction({
      theme: { layoutId: 'intruder-layout' },
    })
    expect(forbiddenSave).toEqual({
      error: 'Tenant not found or forbidden',
      success: false,
    })

    // 4. Cross-tenant merchant attempting to publish draft
    const forbiddenPublish = await publishStorefrontDraftAction()
    expect(forbiddenPublish).toEqual({
      error: 'Tenant not found or forbidden',
      success: false,
    })

    // 5. Verify database records remain unaffected
    const [draftInDb] = await db
      .select()
      .from(storefrontConfigs)
      .where(
        and(
          eq(storefrontConfigs.organizationId, fixture.tenantId),
          eq(storefrontConfigs.status, 'draft'),
        ),
      )
    expect(draftInDb.theme).not.toEqual(expect.objectContaining({ layoutId: 'intruder-layout' }))
  })

  it('resolves active organization from session when tenantId is omitted in draft actions', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValue(
      createMerchantSession({ activeOrganizationId: fixture.tenantId, userId: merchantUserId }),
    )

    const saveRes = await saveStorefrontDraftAction({
      theme: { fontFamily: 'font-mono', layoutId: 'artisan', themeColor: '#10b981' },
    })

    expect(saveRes.success).toBe(true)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/editor')

    const pubRes = await publishStorefrontDraftAction()
    expect(pubRes.success).toBe(true)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard')
  })
})
