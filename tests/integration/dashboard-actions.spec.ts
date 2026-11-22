import { revalidatePath } from 'next/cache'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { auth } from '@/lib/auth/server'
import { updateTenantSettingsAction } from '@/lib/dashboard/actions'
import * as dashboardMutations from '@/lib/dashboard/mutations'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('updateTenantSettingsAction seam', () => {
  const mockTenantId = 'tenant-456'
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests with Unauthorized error', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      data: null,
      error: null,
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateTenantSettings')

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Merdeka No. 1',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests when session user id is missing', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: '',
        },
        user: {
          id: '',
          name: 'Anonymous',
          createdAt: new Date(),
          email: 'anon@example.com',
          emailVerified: false,
          updatedAt: new Date(),
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateTenantSettings')

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Merdeka No. 1',
    })

    expect(result).toEqual({
      error: 'Unauthorized',
      success: false,
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects invalid schema inputs with field error details', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
    const mutationSpy = vi.spyOn(dashboardMutations, 'updateTenantSettings')

    const invalidInput = {
      address: 99999,
      operatingHours: {
        isOpen: 'not-a-boolean',
      },
    }

    const result = await updateTenantSettingsAction(mockTenantId, invalidInput)

    expect(result).toMatchObject({
      error: expect.any(String),
      success: false,
      fieldErrors: expect.objectContaining({
        address: expect.any(Array),
      }),
    })
    expect(mutationSpy).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects modification of tenant owned by another user or non-existent tenant', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })
    vi.spyOn(dashboardMutations, 'updateTenantSettings').mockResolvedValueOnce(null)

    const result = await updateTenantSettingsAction(mockTenantId, {
      address: 'Jl. Sudirman No. 10',
      city: 'Jakarta Selatan',
      phone: '08123456789',
    })

    expect(result).toEqual({
      error: 'Tenant not found or forbidden',
      success: false,
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('updates tenant settings, calls revalidatePath, and returns success result object', async () => {
    vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
      error: null,
      data: {
        session: {
          id: 'sess-1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok-1',
          updatedAt: new Date(),
          userId: mockUserId,
        },
        user: {
          id: mockUserId,
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@example.com',
          emailVerified: true,
          updatedAt: new Date(),
        },
      },
    })

    const mockUpdatedTenant = {
      id: mockTenantId,
      name: 'Test Store',
      address: 'Jl. Senopati No. 42',
      category: 'Retail & Fashion',
      city: 'Jakarta Selatan',
      createdAt: new Date(),
      customDomain: null,
      domainActiveUntil: null,
      fomoExpiresAt: null,
      googleMapsUrl: null,
      organizationId: null,
      packageTier: 'free' as const,
      phone: '08123456789',
      siteActiveUntil: null,
      slug: 'test-store',
      status: 'published' as const,
      themeConfig: {},
      updatedAt: new Date(),
      userId: mockUserId,
      brandingContent: {
        socialLinks: {
          instagram: { active: true, url: 'https://instagram.com/test' },
        },
      },
      operatingHours: {
        closeTime: '21:00',
        isOpen: true,
        openTime: '08:00',
        raw: '08:00 - 21:00',
      },
    }

    const mutationSpy = vi
      .spyOn(dashboardMutations, 'updateTenantSettings')
      .mockResolvedValueOnce(mockUpdatedTenant)

    const payload = {
      address: 'Jl. Senopati No. 42',
      city: 'Jakarta Selatan',
      phone: '08123456789',
      operatingHours: {
        closeTime: '21:00',
        isOpen: true,
        openTime: '08:00',
        raw: '08:00 - 21:00',
      },
      socialLinks: {
        instagram: { active: true, url: 'https://instagram.com/test' },
      },
    }

    const result = await updateTenantSettingsAction(mockTenantId, payload)

    expect(mutationSpy).toHaveBeenCalledWith(mockTenantId, mockUserId, payload)
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/settings')
    expect(result).toEqual({
      data: mockUpdatedTenant,
      success: true,
    })
  })
})
