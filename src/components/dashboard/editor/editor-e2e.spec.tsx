import type { StorefrontConfig, StorefrontSection, Tenant } from '@/db/schema/tenants'
import type { MeracikPreviewUpdateMessage } from '@/features/storefront'

import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { StorefrontEditor } from '@/components/dashboard/editor'
import { MERACIK_PREVIEW_UPDATE, StorefrontPreviewClient } from '@/features/storefront'
import {
  mockFnbCategories,
  mockFnbProduct,
  mockStorefrontTenant,
} from '@/features/storefront/__fixtures__/storefront-fixtures'

import '@/styles/globals.css'

vi.mock('@/lib/dashboard/actions', () => ({
  publishStorefrontDraftAction: vi.fn(),
  saveStorefrontDraftAction: vi.fn(),
}))

const mockTenant: Tenant = {
  ...mockStorefrontTenant,
  address: 'Jl. Senopati No. 12',
  category: 'Cafe & Coffee Shop',
  city: 'Jakarta Selatan',
  createdAt: new Date(),
  customDomain: null,
  domainActiveUntil: null,
  googleMapsUrl: null,
  operatingHours: {},
  organizationId: null,
  packageTier: 'free',
  phone: '081234567890',
  siteActiveUntil: null,
  slug: 'kopi-artisan-senopati',
  status: 'draft',
  updatedAt: new Date(),
  userId: null,
} as unknown as Tenant

const initialSections: StorefrontSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    isVisible: true,
    sortOrder: 1,
    content: {
      description: 'Nikmati seduhan kopi terbaik setiap hari.',
      primaryButtonText: 'Pesan Sekarang',
      showOperationalBadge: true,
      subtitle: 'Kopi Specialty & Artisan Roastery',
      title: 'Kopi Artisan Terbaik',
      whatsappButtonText: 'Chat WhatsApp',
    },
  },
  {
    id: 'sec-catalog',
    type: 'catalog',
    isVisible: true,
    sortOrder: 2,
    content: {
      description: 'Pilihan biji kopi dan minuman segar.',
      searchPlaceholder: 'Cari menu favorit...',
      title: 'Katalog Menu',
    },
  },
  {
    id: 'sec-reviews',
    type: 'reviews',
    isVisible: true,
    sortOrder: 3,
    content: {
      description: 'Pendapat pelanggan setia kami.',
      googleMapsUrl: 'https://maps.google.com/?cid=12345',
      title: 'Ulasan Pelanggan',
    },
  },
]

const initialConfig: StorefrontConfig = {
  id: 'cfg-e2e-test',
  sections: initialSections,
  status: 'draft',
  tenantId: mockTenant.id,
  updatedAt: new Date(),
  theme: {
    fontFamily: 'font-sans',
    layoutId: 'artisan',
    themeColor: '#059669',
  },
}

describe('Storefront Editor and Preview end-to-end browser integration', () => {
  it('emits MERACIK_PREVIEW_UPDATE postMessage to iframe when editing inspector form inputs', async () => {
    render(
      <StorefrontEditor.Root initialConfig={initialConfig} tenant={mockTenant}>
        <StorefrontEditor.Toolbar />
        <div className="flex">
          <StorefrontEditor.Sidebar />
          <StorefrontEditor.Canvas />
          <StorefrontEditor.Inspector />
        </div>
      </StorefrontEditor.Root>,
    )

    const iframeLocator = page.getByTitle('Storefront Preview')
    await expect.element(iframeLocator).toBeInTheDocument()
    const iframe = iframeLocator.element() as HTMLIFrameElement

    const postMessageSpy = vi.fn()
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage = postMessageSpy
    }

    // 1. Edit Hero Title
    const heroTitleInput = page.getByLabelText(/title/i).first()
    await heroTitleInput.fill('Kopi Specialty Nusantara')

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({
              id: 'sec-hero',
              content: expect.objectContaining({ title: 'Kopi Specialty Nusantara' }),
            }),
          ]),
        }),
      }),
      window.location.origin,
    )

    // 2. Edit Hero Subtitle
    const heroSubtitleInput = page.getByLabelText(/subtitle/i)
    await heroSubtitleInput.fill('Roastery Asli Bandung')

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({
              id: 'sec-hero',
              content: expect.objectContaining({
                subtitle: 'Roastery Asli Bandung',
                title: 'Kopi Specialty Nusantara',
              }),
            }),
          ]),
        }),
      }),
      window.location.origin,
    )

    // 3. Edit Hero Primary Button Text
    const primaryButtonInput = page.getByLabelText(/primary button text/i)
    await primaryButtonInput.fill('Order Online Sekarang')

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({
              id: 'sec-hero',
              content: expect.objectContaining({ primaryButtonText: 'Order Online Sekarang' }),
            }),
          ]),
        }),
      }),
      window.location.origin,
    )

    // 4. Switch to Catalog section in Sidebar and edit Catalog Title
    const catalogSidebarBtn = page.getByRole('button', { name: /^catalog$/i })
    await catalogSidebarBtn.click()

    const catalogTitleInput = page.getByLabelText(/title/i).first()
    await catalogTitleInput.fill('Daftar Kopi & Minuman')

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({
              id: 'sec-catalog',
              content: expect.objectContaining({ title: 'Daftar Kopi & Minuman' }),
            }),
          ]),
        }),
      }),
      window.location.origin,
    )

    // 5. Switch to Reviews section in Sidebar and edit Google Maps Link
    const reviewsSidebarBtn = page.getByRole('button', { name: /^reviews$/i })
    await reviewsSidebarBtn.click()

    const reviewsGmapsInput = page.getByLabelText(/google maps/i)
    await reviewsGmapsInput.fill('https://maps.google.com/?cid=99999')

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({
              id: 'sec-reviews',
              content: expect.objectContaining({
                googleMapsUrl: 'https://maps.google.com/?cid=99999',
              }),
            }),
          ]),
        }),
      }),
      window.location.origin,
    )
  })

  it('executes full roundtrip across inspector inputs, section reordering, visibility toggling, and draft state updates', async () => {
    let latestDraft: StorefrontConfig | null = null
    const getDraft = (): StorefrontConfig => {
      expect(latestDraft).not.toBeNull()
      return latestDraft as unknown as StorefrontConfig
    }
    render(
      <StorefrontEditor.Root
        initialConfig={initialConfig}
        tenant={mockTenant}
        onDraftChange={draft => {
          latestDraft = draft
        }}
      >
        <StorefrontEditor.Toolbar />
        <div className="flex">
          <StorefrontEditor.Sidebar />
          <StorefrontEditor.Canvas />
          <StorefrontEditor.Inspector />
        </div>
      </StorefrontEditor.Root>,
    )

    const iframeLocator = page.getByTitle('Storefront Preview')
    await expect.element(iframeLocator).toBeInTheDocument()
    const iframe = iframeLocator.element() as HTMLIFrameElement

    const postMessageSpy = vi.fn()
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage = postMessageSpy
    }

    // Step 1: Edit Hero content via Inspector
    const heroTitleInput = page.getByLabelText(/title/i).first()
    await heroTitleInput.fill('Seduhan Kopi Istimewa')

    const heroSection1 = getDraft().sections.find(s => s.id === 'sec-hero')
    expect(heroSection1?.content.title).toBe('Seduhan Kopi Istimewa')

    // Step 2: Reorder sections in Sidebar - Move Hero down
    const moveHeroDownBtn = page.getByRole('button', { name: /move hero down/i })
    await moveHeroDownBtn.click()

    const reorderedSections = getDraft().sections
    expect(reorderedSections[0]?.id).toBe('sec-catalog')
    expect(reorderedSections[0]?.sortOrder).toBe(1)
    expect(reorderedSections[1]?.id).toBe('sec-hero')
    expect(reorderedSections[1]?.sortOrder).toBe(2)
    expect(reorderedSections[2]?.id).toBe('sec-reviews')
    expect(reorderedSections[2]?.sortOrder).toBe(3)

    expect(postMessageSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: [
            expect.objectContaining({ id: 'sec-catalog', sortOrder: 1 }),
            expect.objectContaining({
              id: 'sec-hero',
              content: expect.objectContaining({ title: 'Seduhan Kopi Istimewa' }),
              sortOrder: 2,
            }),
            expect.objectContaining({ id: 'sec-reviews', sortOrder: 3 }),
          ],
        }),
      }),
      window.location.origin,
    )

    // Step 3: Toggle section visibility in Sidebar - Hide Reviews
    const toggleReviewsSwitch = page.getByRole('switch', { name: /toggle reviews visibility/i })
    await toggleReviewsSwitch.click()

    const reviewsSection = getDraft().sections.find(s => s.id === 'sec-reviews')
    expect(reviewsSection?.isVisible).toBe(false)

    expect(postMessageSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({ id: 'sec-reviews', isVisible: false }),
          ]),
        }),
      }),
      window.location.origin,
    )

    // Step 4: Select Catalog in Sidebar, Inspector switches and updates description
    const catalogSidebarBtn = page.getByRole('button', { name: /^catalog$/i })
    await catalogSidebarBtn.click()

    const catalogDescTextarea = page.getByLabelText(/description/i)
    await catalogDescTextarea.fill('Pilihan biji kopi arabika pilihan dari petani lokal')

    const catalogSection = getDraft().sections.find(s => s.id === 'sec-catalog')
    expect(catalogSection?.content.description).toBe(
      'Pilihan biji kopi arabika pilihan dari petani lokal',
    )
    expect(catalogSection?.sortOrder).toBe(1)

    // Verify earlier modifications are preserved in latestDraft
    const preservedHero = getDraft().sections.find(s => s.id === 'sec-hero')
    expect(preservedHero?.content.title).toBe('Seduhan Kopi Istimewa')
    expect(preservedHero?.sortOrder).toBe(2)

    const preservedReviews = getDraft().sections.find(s => s.id === 'sec-reviews')
    expect(preservedReviews?.isVisible).toBe(false)
    expect(preservedReviews?.sortOrder).toBe(3)

    // Step 5: Toggle Reviews visibility back to true
    await toggleReviewsSwitch.click()

    const restoredReviews = getDraft().sections.find(s => s.id === 'sec-reviews')
    expect(restoredReviews?.isVisible).toBe(true)

    expect(postMessageSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({ id: 'sec-reviews', isVisible: true }),
          ]),
        }),
      }),
      window.location.origin,
    )
  })

  it('synchronizes real-time preview DOM when editor dispatches postMessage updates', async () => {
    function IntegratedEditorAndPreview() {
      return (
        <div className="flex flex-col gap-4">
          <StorefrontEditor.Root initialConfig={initialConfig} tenant={mockTenant}>
            <StorefrontEditor.Toolbar />
            <div className="flex">
              <StorefrontEditor.Sidebar />
              <StorefrontEditor.Canvas />
              <StorefrontEditor.Inspector />
            </div>
          </StorefrontEditor.Root>
          <div data-testid="live-preview-container">
            <StorefrontPreviewClient
              categories={mockFnbCategories}
              config={initialConfig}
              products={[mockFnbProduct]}
              tenant={mockTenant}
            />
          </div>
        </div>
      )
    }

    render(<IntegratedEditorAndPreview />)
    const iframeLocator = page.getByTitle('Storefront Preview')
    await expect.element(iframeLocator).toBeInTheDocument()
    const iframe = iframeLocator.element() as HTMLIFrameElement
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage = (message: unknown) => {
        window.postMessage(message as MeracikPreviewUpdateMessage, '*')
      }
    }

    // Initial preview DOM renders initial Hero title
    await expect.element(page.getByText('Kopi Artisan Terbaik')).toBeVisible()

    // 1. Edit Hero Title in Inspector -> Preview updates live
    const heroTitleInput = page.getByLabelText(/title/i).first()
    await heroTitleInput.fill('Live Synchronized Artisan Coffee')

    await expect.element(page.getByText('Live Synchronized Artisan Coffee')).toBeVisible()
    await expect.element(page.getByText('Kopi Artisan Terbaik')).not.toBeInTheDocument()

    // 2. Toggle Hero visibility in Sidebar -> Preview hides Hero section
    const toggleHeroSwitch = page.getByRole('switch', { name: /toggle hero visibility/i })
    await toggleHeroSwitch.click()

    await expect.element(page.getByText('Live Synchronized Artisan Coffee')).not.toBeInTheDocument()

    // 3. Toggle Hero visibility back on -> Preview restores Hero section
    await toggleHeroSwitch.click()
    await expect.element(page.getByText('Live Synchronized Artisan Coffee')).toBeVisible()
  })
})
