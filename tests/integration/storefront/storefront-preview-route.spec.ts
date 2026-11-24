import type { TestTenantFixture } from '../../fixtures/tenant-fixture'
import type { StorefrontSection, StorefrontTheme } from '@/db/schema/storefront'

import { NextRequest } from 'next/server'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, describe, expect, it, vi } from 'vitest'

import PreviewPage, { generateMetadata } from '@/app/(storefront)/preview/[tenantSlug]/page'
import proxy from '@/proxy'

import { createTestTenant } from '../../fixtures/tenant-fixture'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

describe('Isolated Storefront Preview Route (/preview/[tenantSlug])', () => {
  const fixtures: TestTenantFixture[] = []
  afterAll(async () => {
    for (const fixture of fixtures) {
      await fixture.cleanup()
    }
  })

  it('allows public unauthenticated access to /preview/[tenantSlug] via proxy middleware', async () => {
    const request = new NextRequest('http://localhost:3000/preview/kopi-artisan')
    const response = await proxy(request)
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Security-Policy')).toBe("frame-ancestors 'self'")
  })

  it('generates noindex metadata for draft preview', async () => {
    const fixture = await createTestTenant({
      name: 'Metadata Test Store',
    })
    fixtures.push(fixture)

    const metadata = await generateMetadata({
      params: Promise.resolve({ tenantSlug: fixture.slug }),
    })

    expect(metadata.title).toBe('Preview: Metadata Test Store')
    expect(metadata.robots).toEqual({
      follow: false,
      index: false,
    })
  })

  it('generates not found metadata for non-existent tenant', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ tenantSlug: 'non-existent-tenant-999' }),
    })

    expect(metadata.title).toBe('Storefront Not Found')
  })

  it('renders draft storefront layout, sections, islands, and watermark', async () => {
    const draftTheme: StorefrontTheme = {
      fontFamily: 'font-sans',
      layoutId: 'modern',
      themeColor: '#3b82f6',
    }
    const draftSections: StorefrontSection[] = [
      {
        id: 'sec-hero-draft',
        type: 'hero',
        isVisible: true,
        sortOrder: 1,
        content: {
          subtitle: 'Work In Progress For Merchant',
          title: 'Draft Exclusive Preview Headline',
        },
      },
    ]

    const fixture = await createTestTenant({
      name: 'Draft Preview Active Store',
      draftSections,
      draftTheme,
    })
    fixtures.push(fixture)

    const element = await PreviewPage({
      params: Promise.resolve({ tenantSlug: fixture.slug }),
    })
    const markup = renderToStaticMarkup(element)

    // Draft hero content is rendered
    expect(markup).toContain('Draft Exclusive Preview Headline')
    expect(markup).toContain('Work In Progress For Merchant')

    // Meracik Watermark is rendered
    expect(markup).toContain('Watermark MeracikWeb')
    expect(markup).toContain('Buat Web Gratis')

    // Isolated from dashboard chrome
    expect(markup).not.toContain('Dashboard')
    expect(markup).not.toContain('nav-sidebar')
  })

  it('throws notFound when tenant does not exist', async () => {
    await expect(
      PreviewPage({
        params: Promise.resolve({ tenantSlug: 'does-not-exist-slug' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
