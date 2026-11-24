import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { PricingMatrix } from './pricing-matrix'

import '@/styles/globals.css'

/**
 * Returns rendered sRGB values from a CSS color string.
 */
function getRenderedRgb(color: string, background?: string): [number, number, number] {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable')
  }

  if (background) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, 1, 1)
  }

  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

/**
 * Calculates WCAG 2.2 relative luminance from sRGB values.
 */
function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculates WCAG 2.2 contrast ratio between two colors.
 */
function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = getRenderedRgb(foreground, background)
  const bgRgb = getRenderedRgb(background)
  const l1 = getRelativeLuminance(fgRgb)
  const l2 = getRelativeLuminance(bgRgb)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('PricingMatrix Component (Screen 4)', () => {
  it('renders Screen 4 viewport cleanly at 1440x900 with clear section heading and billing frequency clarity', async () => {
    await page.viewport(1440, 900)
    render(<PricingMatrix />)

    const section = page.getByTestId('pricing-section')
    await expect.element(section).toBeVisible()
    await expect.element(section).toHaveClass(/min-h-screen/)

    // Section heading in display typography
    const heading = page.getByRole('heading', { name: /pilih paket/i, level: 2 })
    await expect.element(heading).toBeVisible()
    await expect.element(heading).toHaveClass('font-display')

    // Billing frequency clarity
    const billingNote = page.getByText(/per bulan tanpa biaya tersembunyi/i)
    await expect.element(billingNote).toBeVisible()
  })

  it('renders three pricing cards with accurate pricing, tabular-nums in font-mono, and features', async () => {
    await page.viewport(1440, 900)
    render(<PricingMatrix />)

    // 1. Gratis tier
    const gratisCard = page.getByTestId('pricing-card-gratis')
    await expect.element(gratisCard).toBeVisible()
    await expect.element(page.getByRole('heading', { name: /^gratis$/i, level: 3 })).toBeVisible()

    const gratisPrice = page.getByTestId('price-gratis')
    await expect.element(gratisPrice).toBeVisible()
    await expect.element(gratisPrice).toHaveTextContent('Rp 0')
    await expect.element(gratisPrice).toHaveClass('font-mono')
    await expect.element(gratisPrice).toHaveClass('tabular-nums')

    await expect.element(page.getByText(/<slug>\.growfin\.my\.id/i)).toBeVisible()
    await expect.element(page.getByText(/maksimal 30 produk/i)).toBeVisible()
    await expect.element(page.getByText(/checkout pesanan whatsapp standar/i)).toBeVisible()

    const gratisCta = page.getByRole('link', { name: /mulai gratis/i })
    await expect.element(gratisCta).toBeVisible()
    await expect.element(gratisCta).toHaveAttribute('href', '/register')

    // 2. Pro tier (Highlighted card)
    const proCard = page.getByTestId('pricing-card-pro')
    await expect.element(proCard).toBeVisible()
    await expect.element(page.getByRole('heading', { name: /^pro$/i, level: 3 })).toBeVisible()

    const proBadge = page.getByTestId('popular-badge')
    await expect.element(proBadge).toBeVisible()
    await expect.element(proBadge).toHaveTextContent('Paling Populer')

    const proPrice = page.getByTestId('price-pro')
    await expect.element(proPrice).toBeVisible()
    await expect.element(proPrice).toHaveTextContent('Rp 49.000')
    await expect.element(proPrice).toHaveClass('font-mono')
    await expect.element(proPrice).toHaveClass('tabular-nums')

    await expect.element(page.getByText(/ringkasan pesanan langsung/i)).toBeVisible()
    await expect.element(page.getByText(/domain kustom/i)).toBeVisible()
    await expect.element(page.getByText(/produk tak terbatas/i)).toBeVisible()
    await expect.element(page.getByText(/analitik harian/i)).toBeVisible()
    await expect.element(page.getByText(/dukungan prioritas whatsapp/i)).toBeVisible()

    const proCta = page.getByRole('link', { name: /pilih paket pro/i })
    await expect.element(proCta).toBeVisible()
    await expect.element(proCta).toHaveAttribute('href', '/register?tier=pro')

    // 3. Enterprise tier
    const enterpriseCard = page.getByTestId('pricing-card-enterprise')
    await expect.element(enterpriseCard).toBeVisible()
    await expect
      .element(page.getByRole('heading', { name: /^enterprise$/i, level: 3 }))
      .toBeVisible()

    const enterprisePrice = page.getByTestId('price-enterprise')
    await expect.element(enterprisePrice).toBeVisible()
    await expect.element(enterprisePrice).toHaveTextContent('Harga Kustom')
    await expect.element(enterprisePrice).toHaveClass('font-mono')
    await expect.element(enterprisePrice).toHaveClass('tabular-nums')

    await expect.element(page.getByText(/manajemen multi-cabang/i)).toBeVisible()
    await expect.element(page.getByText(/sinkronisasi stok pos/i)).toBeVisible()
    await expect.element(page.getByText(/integrasi kustom whatsapp business api/i)).toBeVisible()
    await expect.element(page.getByText(/dedicated account manager/i)).toBeVisible()

    const enterpriseCta = page.getByRole('link', { name: /konsultasi enterprise/i })
    await expect.element(enterpriseCta).toBeVisible()
    const enterpriseHref = enterpriseCta.element().getAttribute('href')
    expect(enterpriseHref).toMatch(/^https:\/\/wa\.me\//)
  })

  it('renders three cards side-by-side on desktop (1440px) and stacks on mobile (375px)', async () => {
    // Desktop 1440x900
    await page.viewport(1440, 900)
    render(<PricingMatrix />)

    const gratisCardLocator = page.getByTestId('pricing-card-gratis')
    const proCardLocator = page.getByTestId('pricing-card-pro')
    const enterpriseCardLocator = page.getByTestId('pricing-card-enterprise')

    await expect.element(gratisCardLocator).toBeVisible()
    await expect.element(proCardLocator).toBeVisible()
    await expect.element(enterpriseCardLocator).toBeVisible()

    const gratisRectDesktop = gratisCardLocator.element().getBoundingClientRect()
    const proRectDesktop = proCardLocator.element().getBoundingClientRect()
    const enterpriseRectDesktop = enterpriseCardLocator.element().getBoundingClientRect()

    // On desktop, cards are laid out side-by-side horizontally: gratis.left < pro.left < enterprise.left
    expect(gratisRectDesktop.left).toBeLessThan(proRectDesktop.left)
    expect(proRectDesktop.left).toBeLessThan(enterpriseRectDesktop.left)

    // Mobile 375x667
    await page.viewport(375, 667)
    const gratisRectMobile = gratisCardLocator.element().getBoundingClientRect()
    const proRectMobile = proCardLocator.element().getBoundingClientRect()
    const enterpriseRectMobile = enterpriseCardLocator.element().getBoundingClientRect()

    // On mobile, cards stack vertically: gratis.top < pro.top < enterprise.top
    expect(gratisRectMobile.top).toBeLessThan(proRectMobile.top)
    expect(proRectMobile.top).toBeLessThan(enterpriseRectMobile.top)
  })

  it('verifies WCAG 2.2 AA contrast compliance across cards, badges, and CTA buttons', async () => {
    await page.viewport(1440, 900)
    render(<PricingMatrix />)

    const section = page.getByTestId('pricing-section')
    await expect.element(section).toBeVisible()
    const sectionBg = window.getComputedStyle(section.element()).backgroundColor || '#ffffff'

    // 1. Heading text contrast >= 4.5:1
    const heading = page.getByRole('heading', { name: /pilih paket/i, level: 2 })
    await expect.element(heading).toBeVisible()
    const headingColor = window.getComputedStyle(heading.element()).color
    const headingContrast = getContrastRatio(headingColor, sectionBg)
    expect(headingContrast).toBeGreaterThanOrEqual(4.5)

    // 2. Pro CTA button text contrast >= 4.5:1
    const proCta = page.getByRole('link', { name: /pilih paket pro/i })
    await expect.element(proCta).toBeVisible()
    const proCtaEl = proCta.element()
    const proCtaBg = window.getComputedStyle(proCtaEl).backgroundColor
    const proCtaColor = window.getComputedStyle(proCtaEl).color
    const proCtaContrast = getContrastRatio(proCtaColor, proCtaBg)
    expect(proCtaContrast).toBeGreaterThanOrEqual(4.5)

    // 3. Pro Highlight Badge text contrast >= 4.5:1
    const proBadge = page.getByTestId('popular-badge')
    await expect.element(proBadge).toBeVisible()
    const proBadgeEl = proBadge.element()
    const badgeBg = window.getComputedStyle(proBadgeEl).backgroundColor
    const badgeColor = window.getComputedStyle(proBadgeEl).color
    const badgeContrast = getContrastRatio(badgeColor, badgeBg)
    expect(badgeContrast).toBeGreaterThanOrEqual(4.5)

    // 4. Card border contrast >= 3.0:1
    const gratisCard = page.getByTestId('pricing-card-gratis')
    await expect.element(gratisCard).toBeVisible()
    const gratisCardStyle = window.getComputedStyle(gratisCard.element())
    const borderContrast = getContrastRatio(gratisCardStyle.borderColor, sectionBg)
    expect(borderContrast).toBeGreaterThanOrEqual(3.0)
  })

  it('ensures touch targets measure at least 44px for accessible interaction', async () => {
    await page.viewport(375, 667)
    render(<PricingMatrix />)

    const gratisCta = page.getByRole('link', { name: /mulai gratis/i })
    const proCta = page.getByRole('link', { name: /pilih paket pro/i })
    const enterpriseCta = page.getByRole('link', { name: /konsultasi enterprise/i })

    await expect.element(gratisCta).toBeVisible()
    await expect.element(proCta).toBeVisible()
    await expect.element(enterpriseCta).toBeVisible()

    expect(gratisCta.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    expect(proCta.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    expect(enterpriseCta.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
  })
})
