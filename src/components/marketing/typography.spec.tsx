import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import '@/styles/globals.css'

describe('Marketing Typography System and Tokens', () => {
  it('applies font-display utility class and resolves to --font-display token', async () => {
    render(
      <div style={{ '--font-display': "'Bricolage Grotesque', sans-serif" } as React.CSSProperties}>
        <h1 className="font-display" data-testid="display-heading">
          Solusi Digital UMKM Indonesia
        </h1>
      </div>,
    )

    const heading = page.getByTestId('display-heading')
    await expect.element(heading).toBeVisible()
    await expect.element(heading).toHaveClass('font-display')

    const computedStyle = window.getComputedStyle(heading.element())
    expect(computedStyle.fontFamily).toMatch(/Bricolage Grotesque/i)
  })

  it('applies font-sans utility class and resolves to --font-sans token', async () => {
    render(
      <div style={{ '--font-sans': "'DM Sans', sans-serif" } as React.CSSProperties}>
        <p className="font-sans" data-testid="body-text">
          Kelola menu, pesanan, dan pembayaran dalam satu dasbor.
        </p>
      </div>,
    )

    const paragraph = page.getByTestId('body-text')
    await expect.element(paragraph).toBeVisible()
    await expect.element(paragraph).toHaveClass('font-sans')

    const computedStyle = window.getComputedStyle(paragraph.element())
    expect(computedStyle.fontFamily).toMatch(/DM Sans/i)
  })

  it('applies font-mono utility class and resolves to --font-mono token', async () => {
    render(
      <div style={{ '--font-mono': "'JetBrains Mono', monospace" } as React.CSSProperties}>
        <code className="font-mono" data-testid="mono-receipt">
          INV-2026-001
        </code>
      </div>,
    )

    const code = page.getByTestId('mono-receipt')
    await expect.element(code).toBeVisible()
    await expect.element(code).toHaveClass('font-mono')

    const computedStyle = window.getComputedStyle(code.element())
    expect(computedStyle.fontFamily).toMatch(/JetBrains Mono/i)
  })

  it('preserves font-plus-jakarta utility class for brand wordmark', async () => {
    render(
      <div
        style={{ '--font-plus-jakarta': "'Plus Jakarta Sans', sans-serif" } as React.CSSProperties}
      >
        <span className="font-plus-jakarta" data-testid="wordmark-text">
          MeracikWeb
        </span>
      </div>,
    )

    const wordmark = page.getByTestId('wordmark-text')
    await expect.element(wordmark).toBeVisible()
    await expect.element(wordmark).toHaveClass('font-plus-jakarta')

    const computedStyle = window.getComputedStyle(wordmark.element())
    expect(computedStyle.fontFamily).toMatch(/Plus Jakarta Sans/i)
  })

  it('applies tabular-nums utility class for monetary figures and data', async () => {
    render(
      <div style={{ '--font-mono': "'JetBrains Mono', monospace" } as React.CSSProperties}>
        <span className="font-mono tabular-nums" data-testid="price-figure">
          Rp 49.000/bulan
        </span>
      </div>,
    )

    const price = page.getByTestId('price-figure')
    await expect.element(price).toBeVisible()
    await expect.element(price).toHaveClass('tabular-nums')

    const computedStyle = window.getComputedStyle(price.element())
    expect(computedStyle.fontVariantNumeric).toBe('tabular-nums')
  })
})
