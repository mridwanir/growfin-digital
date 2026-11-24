import type { StorefrontConfig, StorefrontSection, Tenant } from '@/db/schema/tenants'

import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { StorefrontEditor } from './index'

import '@/styles/globals.css'

vi.mock('../actions', () => ({
  publishStorefrontDraftAction: vi.fn(),
  saveStorefrontDraftAction: vi.fn(),
}))

const mockTenant: Tenant = {
  id: 'tenant-canvas-test',
  name: 'Kopi Artisan Senopati',
  address: 'Jl. Senopati No. 12',
  category: 'Cafe & Coffee Shop',
  city: 'Jakarta Selatan',
  createdAt: new Date(),
  customDomain: null,
  domainActiveUntil: null,
  googleMapsUrl: null,
  logo: null,
  metadata: null,
  operatingHours: {},
  packageTier: 'free',
  phone: '081234567890',
  siteActiveUntil: null,
  slug: 'kopi-artisan-senopati',
  status: 'draft',
  updatedAt: new Date(),
}

const mockSections: StorefrontSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    isVisible: true,
    sortOrder: 1,
    content: {
      headline: 'Secangkir Cerita di Setiap Seduhan',
      title: 'Kopi Artisan Terbaik',
    },
  },
]

const mockInitialConfig: StorefrontConfig = {
  id: 'cfg-canvas-1',
  sections: mockSections,
  status: 'draft',
  tenantId: mockTenant.id,
  updatedAt: new Date(),
  theme: {
    colorPalette: 'warm-amber',
    fontFamily: 'plus-jakarta',
    layoutId: 'warm-artisan',
  },
}

describe('Responsive viewport canvas toolbar (Ticket 04)', () => {
  it('defaults to 375px mobile view on initial load', async () => {
    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <StorefrontEditor.Toolbar />
        <StorefrontEditor.Canvas />
      </StorefrontEditor.Root>,
    )

    const deviceFrame = page.getByTestId('canvas-device-frame')
    await expect.element(deviceFrame).toBeInTheDocument()
    await expect.element(deviceFrame).toHaveAttribute('data-viewport', 'mobile')
    await expect.element(deviceFrame).toHaveClass(/max-w-\[375px\]/)

    // Mobile button in toolbar is marked as pressed
    const mobileBtn = page.getByRole('button', { name: 'Mobile (375px)' })
    await expect.element(mobileBtn).toBeInTheDocument()
    await expect.element(mobileBtn).toHaveAttribute('aria-pressed', 'true')

    const tabletBtn = page.getByRole('button', { name: 'Tablet (768px)' })
    await expect.element(tabletBtn).toHaveAttribute('aria-pressed', 'false')

    const desktopBtn = page.getByRole('button', { name: 'Desktop (100%)' })
    await expect.element(desktopBtn).toHaveAttribute('aria-pressed', 'false')

    // Canvas frame header shows mobile label
    const viewportLabel = page.getByTestId('canvas-viewport-label')
    await expect.element(viewportLabel).toHaveTextContent('Mobile (375px)')
  })

  it('allows selecting Mobile (375px), Tablet (768px), and Desktop (100%) via viewport switcher', async () => {
    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <StorefrontEditor.Toolbar />
        <StorefrontEditor.Canvas />
      </StorefrontEditor.Root>,
    )

    const deviceFrame = page.getByTestId('canvas-device-frame')
    const mobileBtn = page.getByRole('button', { name: 'Mobile (375px)' })
    const tabletBtn = page.getByRole('button', { name: 'Tablet (768px)' })
    const desktopBtn = page.getByRole('button', { name: 'Desktop (100%)' })
    const viewportLabel = page.getByTestId('canvas-viewport-label')

    // 1. Switch to Tablet (768px)
    await tabletBtn.click()
    await expect.element(tabletBtn).toHaveAttribute('aria-pressed', 'true')
    await expect.element(mobileBtn).toHaveAttribute('aria-pressed', 'false')
    await expect.element(desktopBtn).toHaveAttribute('aria-pressed', 'false')
    await expect.element(deviceFrame).toHaveAttribute('data-viewport', 'tablet')
    await expect.element(deviceFrame).toHaveClass(/max-w-\[768px\]/)
    await expect.element(viewportLabel).toHaveTextContent('Tablet (768px)')

    // 2. Switch to Desktop (100%)
    await desktopBtn.click()
    await expect.element(desktopBtn).toHaveAttribute('aria-pressed', 'true')
    await expect.element(tabletBtn).toHaveAttribute('aria-pressed', 'false')
    await expect.element(mobileBtn).toHaveAttribute('aria-pressed', 'false')
    await expect.element(deviceFrame).toHaveAttribute('data-viewport', 'desktop')
    await expect.element(deviceFrame).toHaveClass(/max-w-full/)
    await expect.element(viewportLabel).toHaveTextContent('Desktop (100%)')

    // 3. Switch back to Mobile (375px)
    await mobileBtn.click()
    await expect.element(mobileBtn).toHaveAttribute('aria-pressed', 'true')
    await expect.element(desktopBtn).toHaveAttribute('aria-pressed', 'false')
    await expect.element(deviceFrame).toHaveAttribute('data-viewport', 'mobile')
    await expect.element(deviceFrame).toHaveClass(/max-w-\[375px\]/)
    await expect.element(viewportLabel).toHaveTextContent('Mobile (375px)')
  })

  it('scales and centers preview iframe container properly without layout overflow', async () => {
    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <StorefrontEditor.Canvas />
      </StorefrontEditor.Root>,
    )

    const canvasMain = page.getByRole('main', { name: /preview canvas/i })
    await expect.element(canvasMain).toBeInTheDocument()
    await expect.element(canvasMain).toHaveClass(/items-center/)
    await expect.element(canvasMain).toHaveClass(/justify-center/)
    await expect.element(canvasMain).toHaveClass(/overflow-auto/)

    const deviceFrame = page.getByTestId('canvas-device-frame')
    await expect.element(deviceFrame).toHaveClass(/m-auto/)
    await expect.element(deviceFrame).toHaveClass(/rounded-xl/)
    await expect.element(deviceFrame).toHaveClass(/border/)
    await expect.element(deviceFrame).toHaveClass(/shadow-sm/)

    // Preview iframe
    const iframeLocator = page.getByTitle('Storefront Preview')
    await expect.element(iframeLocator).toBeInTheDocument()
    const iframe = iframeLocator.element() as HTMLIFrameElement
    expect(iframe).toBeInTheDocument()
    expect(iframe.src).toContain(`/preview/${mockTenant.slug}`)
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin allow-forms')
  })

  it('supports keyboard navigation with arrow keys between viewport switcher buttons', async () => {
    render(
      <StorefrontEditor.Root initialConfig={mockInitialConfig} tenant={mockTenant}>
        <StorefrontEditor.Toolbar />
        <StorefrontEditor.Canvas />
      </StorefrontEditor.Root>,
    )

    const deviceFrame = page.getByTestId('canvas-device-frame')
    const mobileBtn = page.getByRole('button', { name: 'Mobile (375px)' })
    const tabletBtn = page.getByRole('button', { name: 'Tablet (768px)' })
    const desktopBtn = page.getByRole('button', { name: 'Desktop (100%)' })

    // Focus mobile button
    await expect.element(mobileBtn).toBeInTheDocument()
    const mobileEl = mobileBtn.element() as HTMLButtonElement
    mobileEl.focus()

    // Press ArrowRight to move to Tablet
    mobileEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await expect.element(tabletBtn).toHaveAttribute('aria-pressed', 'true')
    await expect.element(deviceFrame).toHaveAttribute('data-viewport', 'tablet')

    // Press ArrowRight to move to Desktop
    const tabletEl = tabletBtn.element() as HTMLButtonElement
    tabletEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await expect.element(desktopBtn).toHaveAttribute('aria-pressed', 'true')
    await expect.element(deviceFrame).toHaveAttribute('data-viewport', 'desktop')

    // Press ArrowLeft to move back to Tablet
    const desktopEl = desktopBtn.element() as HTMLButtonElement
    desktopEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await expect.element(tabletBtn).toHaveAttribute('aria-pressed', 'true')
    await expect.element(deviceFrame).toHaveAttribute('data-viewport', 'tablet')
  })
})
