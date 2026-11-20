import { NextRequest } from 'next/server'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import PreviewPage, { generateMetadata } from '@/app/preview/page'
import { AVAILABLE_THEMES } from '@/lib/storefront/mock-data'
import proxy from '@/proxy'

describe('Theme Preview Sample Route (/preview)', () => {
  it('allows public unauthenticated access to /preview via proxy middleware', async () => {
    const request = new NextRequest('http://localhost:3000/preview')
    const response = await proxy(request)
    expect(response.status).toBe(200)
  })

  it('generates metadata correctly for requested theme', async () => {
    const fnbMeta = await generateMetadata({
      searchParams: Promise.resolve({ theme: 'fnb-theme-modern' }),
    })
    expect(fnbMeta.title).toContain('Modern Theme')
    expect(fnbMeta.description).toContain('FNB')

    const retailMeta = await generateMetadata({
      searchParams: Promise.resolve({ theme: 'retail-theme-urban' }),
    })
    expect(retailMeta.title).toContain('Urban Theme')
    expect(retailMeta.description).toContain('RETAIL')
  })

  it('renders default theme when no theme query param is supplied', async () => {
    const element = await PreviewPage({ searchParams: Promise.resolve({}) })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('Theme Preview Switcher')
    expect(markup).toContain('Kopi Artisan Nusantara')
    expect(markup).toContain('Kopi Susu Gula Aren')
    expect(markup).toContain('Secangkir Cerita Tiap Hari')
  })

  describe('renders all 13 storefront themes with mock data without crashing', () => {
    for (const theme of AVAILABLE_THEMES) {
      it(`renders theme "${theme.id}" (${theme.label}) with full mock dataset and islands`, async () => {
        const element = await PreviewPage({
          searchParams: Promise.resolve({ theme: theme.id }),
        })
        const markup = renderToStaticMarkup(element)

        // Verifies the top theme preview switcher
        expect(markup).toContain('Theme Preview Switcher')
        expect(markup).toContain(theme.label)

        // Verifies correct archetype brand and catalog items
        const expectedBrand =
          theme.archetype === 'fnb' ? 'Kopi Artisan Nusantara' : 'Overdose Streetwear Co.'
        const expectedProduct =
          theme.archetype === 'fnb' ? 'Kopi Susu Gula Aren' : 'Overdose Heavyweight Boxy Tee'

        expect(markup).toContain(expectedBrand)
        expect(markup).toContain(expectedProduct)

        // Verifies client islands and watermark are mounted
        expect(markup).toContain('data-slot="catalog-card"')
      })
    }
  })
})
