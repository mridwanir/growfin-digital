import type { StorefrontConfig, StorefrontSection, Tenant } from '@/db/schema/tenants'

import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { StorefrontEditor, useStorefrontEditor } from '@/components/dashboard/editor'
import { MERACIK_PREVIEW_UPDATE } from '@/components/storefront/preview-protocol'

import '@/styles/globals.css'

const mockTenant: Tenant = {
  id: 'tenant-test-123',
  name: 'Kopi Artisan Senopati',
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
}

const mockSections: StorefrontSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    isVisible: true,
    sortOrder: 1,
    content: {
      subtitle: 'Belanja mudah dan cepat',
      title: 'Kopi Artisan Terbaik',
    },
  },
  {
    id: 'sec-catalog',
    type: 'catalog',
    isVisible: true,
    sortOrder: 2,
    content: {
      title: 'Katalog Menu Kami',
    },
  },
  {
    id: 'sec-reviews',
    type: 'reviews',
    isVisible: true,
    sortOrder: 3,
    content: {
      title: 'Ulasan Pelanggan',
    },
  },
]

const mockInitialConfig: StorefrontConfig = {
  id: 'cfg-editor-1',
  sections: mockSections,
  status: 'draft',
  tenantId: mockTenant.id,
  updatedAt: new Date(),
  theme: {
    fontFamily: 'font-sans',
    layoutId: 'modern',
    themeColor: '#000000',
  },
}

describe('StorefrontEditor compound components and context', () => {
  it('renders compound component tree and provides context via React 19 use()', async () => {
    function ContextProbe() {
      const { activeViewport, draft, saveStatus, selectedSectionId, tenant } = useStorefrontEditor()
      return (
        <div data-testid="context-probe">
          <span data-testid="probe-slug">{tenant.slug}</span>
          <span data-testid="probe-viewport">{activeViewport}</span>
          <span data-testid="probe-status">{saveStatus}</span>
          <span data-testid="probe-selected">{selectedSectionId}</span>
          <span data-testid="probe-sections-count">{draft.sections.length}</span>
        </div>
      )
    }

    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <ContextProbe />
        <StorefrontEditor.Toolbar />
        <div className="flex">
          <StorefrontEditor.Sidebar />
          <StorefrontEditor.Canvas />
          <StorefrontEditor.Inspector />
        </div>
      </StorefrontEditor.Root>,
    )

    await expect.element(page.getByTestId('probe-slug')).toHaveTextContent('kopi-artisan-senopati')
    await expect.element(page.getByTestId('probe-viewport')).toHaveTextContent('mobile')
    await expect.element(page.getByTestId('probe-status')).toHaveTextContent('saved')
    await expect.element(page.getByTestId('probe-selected')).toHaveTextContent('sec-hero')
    await expect.element(page.getByTestId('probe-sections-count')).toHaveTextContent('3')

    // Toolbar elements
    await expect.element(page.getByRole('button', { name: /mobile/i })).toBeInTheDocument()
    await expect.element(page.getByRole('button', { name: /publish/i })).toBeInTheDocument()

    // Sidebar section items
    await expect.element(page.getByText('Hero')).toBeInTheDocument()
    await expect.element(page.getByText('Catalog')).toBeInTheDocument()
    await expect.element(page.getByText('Reviews')).toBeInTheDocument()

    // Canvas iframe
    const iframe = page.getByTitle('Storefront Preview').element() as HTMLIFrameElement
    expect(iframe).toBeInTheDocument()
    expect(iframe.src).toContain('/preview/kopi-artisan-senopati')
  })

  it('reorders sections in Sidebar updating sortOrder sequentially', async () => {
    let capturedDraft: StorefrontConfig | null = null

    render(
      <StorefrontEditor.Root
        initialConfig={mockInitialConfig}
        tenant={mockTenant}
        onDraftChange={draft => {
          capturedDraft = draft
        }}
      >
        <StorefrontEditor.Sidebar />
      </StorefrontEditor.Root>,
    )

    // Move first section (Hero) down
    const moveHeroDownBtn = page.getByRole('button', { name: /move hero down/i })
    await moveHeroDownBtn.click()

    expect(capturedDraft).not.toBeNull()
    const updatedSections = (capturedDraft as unknown as StorefrontConfig).sections
    expect(updatedSections[0]?.id).toBe('sec-catalog')
    expect(updatedSections[0]?.sortOrder).toBe(1)
    expect(updatedSections[1]?.id).toBe('sec-hero')
    expect(updatedSections[1]?.sortOrder).toBe(2)
    expect(updatedSections[2]?.id).toBe('sec-reviews')
    expect(updatedSections[2]?.sortOrder).toBe(3)
  })

  it('toggles section visibility in Sidebar', async () => {
    let capturedDraft: StorefrontConfig | null = null

    render(
      <StorefrontEditor.Root
        initialConfig={mockInitialConfig}
        tenant={mockTenant}
        onDraftChange={draft => {
          capturedDraft = draft
        }}
      >
        <StorefrontEditor.Sidebar />
      </StorefrontEditor.Root>,
    )

    const toggleHeroSwitch = page.getByRole('switch', { name: /toggle hero visibility/i })
    await expect.element(toggleHeroSwitch).toBeInTheDocument()
    await toggleHeroSwitch.click()
    expect(capturedDraft).not.toBeNull()
    const heroSection = (capturedDraft as unknown as StorefrontConfig).sections.find(
      s => s.id === 'sec-hero',
    )
    expect(heroSection?.isVisible).toBe(false)
  })

  it('selects a section and renders contextual form inputs in Inspector', async () => {
    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <StorefrontEditor.Sidebar />
        <StorefrontEditor.Inspector />
      </StorefrontEditor.Root>,
    )

    // Initially sec-hero is selected, so Hero inputs appear
    await expect.element(page.getByLabelText(/title/i).first()).toHaveValue('Kopi Artisan Terbaik')

    // Click on Reviews in sidebar
    const reviewsBtn = page.getByRole('button', { name: /^reviews$/i })
    await reviewsBtn.click()

    // Inspector now shows reviews fields
    await expect.element(page.getByLabelText(/title/i).first()).toHaveValue('Ulasan Pelanggan')
    await expect.element(page.getByLabelText(/google maps/i)).toBeInTheDocument()
  })

  it('updates section content when editing inspector inputs', async () => {
    let capturedDraft: StorefrontConfig | null = null

    render(
      <StorefrontEditor.Root
        initialConfig={mockInitialConfig}
        tenant={mockTenant}
        onDraftChange={draft => {
          capturedDraft = draft
        }}
      >
        <StorefrontEditor.Inspector />
      </StorefrontEditor.Root>,
    )

    const titleInput = page.getByLabelText(/title/i).first()
    await titleInput.fill('Kopi Susu Premium')

    expect(capturedDraft).not.toBeNull()
    const heroSection = (capturedDraft as unknown as StorefrontConfig).sections.find(
      s => s.id === 'sec-hero',
    )
    expect(heroSection?.content.title).toBe('Kopi Susu Premium')
  })

  it('renders canvas preview iframe and dispatches MERACIK_PREVIEW_UPDATE postMessage on draft changes', async () => {
    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <StorefrontEditor.Canvas />
        <StorefrontEditor.Inspector />
      </StorefrontEditor.Root>,
    )

    const iframeLocator = page.getByTitle('Storefront Preview')
    await expect.element(iframeLocator).toBeInTheDocument()
    const iframe = iframeLocator.element() as HTMLIFrameElement
    expect(iframe.src).toContain(`/preview/${mockTenant.slug}`)

    // Spy on iframe contentWindow postMessage
    const postMessageSpy = vi.fn()
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage = postMessageSpy
    }

    const titleInput = page.getByLabelText(/title/i).first()
    await titleInput.fill('Updated via Inspector')

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MERACIK_PREVIEW_UPDATE,
        payload: expect.objectContaining({
          sections: expect.arrayContaining([
            expect.objectContaining({
              id: 'sec-hero',
              content: expect.objectContaining({ title: 'Updated via Inspector' }),
            }),
          ]),
        }),
      }),
      '*',
    )
  })

  it('switches viewports in Toolbar and applies dimensions to Canvas device container', async () => {
    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <StorefrontEditor.Toolbar />
        <StorefrontEditor.Canvas />
      </StorefrontEditor.Root>,
    )

    const canvasContainer = page.getByTestId('canvas-device-frame')
    // Default mobile viewport is 375px
    await expect.element(canvasContainer).toHaveClass(/max-w-\[375px\]/)

    // Switch to Tablet
    const tabletBtn = page.getByRole('button', { name: /tablet/i })
    await tabletBtn.click()
    await expect.element(canvasContainer).toHaveClass(/max-w-\[768px\]/)

    // Switch to Desktop
    const desktopBtn = page.getByRole('button', { name: /desktop/i })
    await desktopBtn.click()
    await expect.element(canvasContainer).toHaveClass(/max-w-full/)
  })
})
