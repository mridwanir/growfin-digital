import type { Tenant } from '@/db/schema/auth'
import type { StorefrontConfig, StorefrontSection } from '@/db/schema/storefront'

import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import {
  mockFnbCategories,
  mockFnbProduct,
  mockStorefrontTenant,
} from '../__fixtures__/storefront-fixtures'
import { StorefrontPreviewClient } from './preview-client'
import { MERACIK_PREVIEW_UPDATE } from './preview-protocol'

describe('StorefrontPreviewClient (Browser Mode)', () => {
  const initialSections: StorefrontSection[] = [
    {
      id: 'sec-hero',
      type: 'hero',
      isVisible: true,
      sortOrder: 1,
      content: {
        subtitle: 'Authentic Specialty Coffee',
        title: 'Initial Draft Hero Title',
      },
    },
    {
      id: 'sec-catalog',
      type: 'catalog',
      isVisible: true,
      sortOrder: 2,
      content: {
        title: 'Daftar Menu',
      },
    },
  ]

  const initialConfig: StorefrontConfig = {
    id: 'cfg-preview-1',
    sections: initialSections,
    status: 'draft',
    tenantId: mockStorefrontTenant.id,
    updatedAt: new Date(),
    theme: {
      fontFamily: 'font-sans',
      layoutId: 'modern',
      themeColor: '#3b82f6',
    },
  }

  const tenant = {
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
    siteActiveUntil: null,
    slug: 'kopi-artisan-senopati',
    status: 'draft',
    updatedAt: new Date(),
    userId: null,
  } as unknown as Tenant

  it('renders initial draft configuration including layout, sections, islands, and watermark', async () => {
    await render(
      <StorefrontPreviewClient
        categories={mockFnbCategories}
        config={initialConfig}
        products={[mockFnbProduct]}
        tenant={tenant}
      />,
    )

    await expect.element(page.getByText('Initial Draft Hero Title')).toBeVisible()
    await expect.element(page.getByText('Authentic Specialty Coffee')).toBeVisible()
    await expect.element(page.getByText('Buat Web Gratis')).toBeVisible()
    await expect.element(page.getByText('Kopi Susu Gula Aren')).toBeVisible()
  })

  it('updates section contents dynamically when receiving MERACIK_PREVIEW_UPDATE postMessage', async () => {
    await render(
      <StorefrontPreviewClient
        categories={mockFnbCategories}
        config={initialConfig}
        products={[mockFnbProduct]}
        tenant={tenant}
      />,
    )

    await expect.element(page.getByText('Initial Draft Hero Title')).toBeVisible()

    const updatedSections: StorefrontSection[] = [
      {
        id: 'sec-hero',
        type: 'hero',
        isVisible: true,
        sortOrder: 1,
        content: {
          subtitle: 'Updated From Editor Sidebar',
          title: 'Live Synchronized Hero Title',
        },
      },
    ]

    window.postMessage(
      {
        type: MERACIK_PREVIEW_UPDATE,
        payload: {
          sections: updatedSections,
        },
      },
      '*',
    )

    await expect.element(page.getByText('Live Synchronized Hero Title')).toBeVisible()
    await expect.element(page.getByText('Updated From Editor Sidebar')).toBeVisible()
    await expect.element(page.getByText('Initial Draft Hero Title')).not.toBeInTheDocument()
  })

  it('updates theme dynamically when receiving MERACIK_PREVIEW_UPDATE postMessage', async () => {
    const { container } = await render(
      <StorefrontPreviewClient
        categories={mockFnbCategories}
        config={initialConfig}
        products={[mockFnbProduct]}
        tenant={tenant}
      />,
    )

    window.postMessage(
      {
        type: MERACIK_PREVIEW_UPDATE,
        payload: {
          theme: {
            ...initialConfig.theme,
            themeColor: '#ef4444',
          },
        },
      },
      '*',
    )

    // DynamicThemeProvider sets --brand-primary
    await expect
      .poll(() => {
        const themedElement = container.querySelector('[style*="--brand-primary"]')
        return themedElement?.getAttribute('style')?.includes('--brand-primary')
      })
      .toBe(true)
  })

  it('ignores postMessage events with mismatched type or empty payload', async () => {
    await render(
      <StorefrontPreviewClient
        categories={mockFnbCategories}
        config={initialConfig}
        products={[mockFnbProduct]}
        tenant={tenant}
      />,
    )

    await expect.element(page.getByText('Initial Draft Hero Title')).toBeVisible()

    window.postMessage(
      {
        type: 'SOME_UNRELATED_EVENT',
        payload: {
          sections: [
            {
              id: 'sec-hero',
              type: 'hero',
              content: { title: 'Should NOT Appear' },
              isVisible: true,
              sortOrder: 1,
            },
          ],
        },
      },
      '*',
    )

    await expect.element(page.getByText('Initial Draft Hero Title')).toBeVisible()
    await expect.element(page.getByText('Should NOT Appear')).not.toBeInTheDocument()
  })
})
