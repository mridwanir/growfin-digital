import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { GrowfinWatermark } from '@/components/storefront/watermark'

describe('GrowfinWatermark Server Component', () => {
  it('renders watermark markup cleanly without client context', () => {
    const markup = renderToStaticMarkup(<GrowfinWatermark />)

    expect(markup).toContain('aria-label="Watermark Growfin Digital"')
    expect(markup).toContain('https://growfin.my.id')
    expect(markup).toContain('Growfin Digital')
    expect(markup).toContain('Buat Web Gratis')
  })
})
