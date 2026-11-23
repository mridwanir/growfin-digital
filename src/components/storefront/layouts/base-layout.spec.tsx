import type { StorefrontConfig, Tenant } from '@/db/schema/tenants'

import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { BaseStorefrontLayout } from './base-layout'

const mockTenant: Tenant = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Toko Test',
  address: null,
  category: 'Food & Beverage',
  city: null,
  createdAt: new Date(),
  customDomain: null,
  domainActiveUntil: null,
  googleMapsUrl: null,
  operatingHours: null,
  organizationId: null,
  packageTier: 'free',
  phone: null,
  siteActiveUntil: null,
  slug: 'toko-test',
  status: 'published',
  updatedAt: new Date(),
  userId: null,
}

describe('BaseStorefrontLayout footer visibility', () => {
  it('does not render footer when footer section is present with isVisible === false', async () => {
    const config: StorefrontConfig = {
      id: 'cfg-1',
      status: 'published',
      tenantId: mockTenant.id,
      theme: { layoutId: 'modern', themeColor: '#000000' },
      updatedAt: new Date(),
      sections: [
        {
          id: 'sec-hero',
          type: 'hero',
          content: { title: 'Welcome Hero' },
          isVisible: true,
          sortOrder: 1,
        },
        {
          id: 'sec-footer',
          type: 'footer',
          content: {},
          isVisible: false,
          sortOrder: 2,
        },
      ],
    }

    await render(<BaseStorefrontLayout config={config} tenant={mockTenant} />)

    await expect.element(page.getByText('Powered by Growfin Digital')).not.toBeInTheDocument()
  })

  it('renders footer when footer section is present with isVisible === true', async () => {
    const config: StorefrontConfig = {
      id: 'cfg-2',
      status: 'published',
      tenantId: mockTenant.id,
      theme: { layoutId: 'modern', themeColor: '#000000' },
      updatedAt: new Date(),
      sections: [
        {
          id: 'sec-hero',
          type: 'hero',
          content: { title: 'Welcome Hero' },
          isVisible: true,
          sortOrder: 1,
        },
        {
          id: 'sec-footer',
          type: 'footer',
          content: { tagline: 'Custom Footer Tagline' },
          isVisible: true,
          sortOrder: 2,
        },
      ],
    }

    await render(<BaseStorefrontLayout config={config} tenant={mockTenant} />)

    await expect.element(page.getByText('Powered by Growfin Digital')).toBeVisible()
    await expect.element(page.getByText('Custom Footer Tagline')).toBeVisible()
  })

  it('renders fallback footer when no footer section is present in sections', async () => {
    const config: StorefrontConfig = {
      id: 'cfg-3',
      status: 'published',
      tenantId: mockTenant.id,
      theme: { layoutId: 'modern', themeColor: '#000000' },
      updatedAt: new Date(),
      sections: [
        {
          id: 'sec-hero',
          type: 'hero',
          content: { title: 'Hero Only' },
          isVisible: true,
          sortOrder: 1,
        },
      ],
    }

    await render(<BaseStorefrontLayout config={config} tenant={mockTenant} />)

    await expect.element(page.getByText('Powered by Growfin Digital')).toBeVisible()
  })

  it('does not render fallback footer when footer is in hiddenSections', async () => {
    const config: StorefrontConfig = {
      id: 'cfg-4',
      status: 'published',
      tenantId: mockTenant.id,
      theme: { hiddenSections: ['footer'], layoutId: 'modern', themeColor: '#000000' },
      updatedAt: new Date(),
      sections: [
        {
          id: 'sec-hero',
          type: 'hero',
          content: { title: 'Hero Only' },
          isVisible: true,
          sortOrder: 1,
        },
      ],
    }

    await render(<BaseStorefrontLayout config={config} tenant={mockTenant} />)

    await expect.element(page.getByText('Powered by Growfin Digital')).not.toBeInTheDocument()
  })
})
