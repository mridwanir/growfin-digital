import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import MarketingPage from '@/app/page'

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

describe('Marketing Page Integration (Screens 1 to 5)', () => {
  afterEach(async () => {
    await page.viewport(1440, 900)
  })

  it('renders all 5 marketing sections in sequential order', async () => {
    await page.viewport(1440, 900)
    render(<MarketingPage />)

    const hero = page.getByTestId('marketing-hero')
    const archetypes = page.getByTestId('archetype-switcher-section')
    const whatsapp = page.getByTestId('whatsapp-simulator-section')
    const pricing = page.getByTestId('pricing-section')
    const footer = page.getByTestId('marketing-footer')

    await expect.element(hero).toBeVisible()
    await expect.element(archetypes).toBeVisible()
    await expect.element(whatsapp).toBeVisible()
    await expect.element(pricing).toBeVisible()
    await expect.element(footer).toBeVisible()

    const heroEl = hero.element()
    const archetypesEl = archetypes.element()
    const whatsappEl = whatsapp.element()
    const pricingEl = pricing.element()
    const footerEl = footer.element()

    expect(
      Boolean(heroEl.compareDocumentPosition(archetypesEl) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true)
    expect(
      Boolean(archetypesEl.compareDocumentPosition(whatsappEl) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true)
    expect(
      Boolean(whatsappEl.compareDocumentPosition(pricingEl) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true)
    expect(
      Boolean(pricingEl.compareDocumentPosition(footerEl) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true)
  })

  it('provides an accessible skip-to-content link linked to #main-content', async () => {
    await page.viewport(1440, 900)
    render(<MarketingPage />)

    const skipLink = page.getByRole('link', { name: /lewati ke konten utama/i })
    await expect.element(skipLink).toBeInTheDocument()
    await expect.element(skipLink).toHaveAttribute('href', '#main-content')

    const mainContent = document.getElementById('main-content')
    expect(mainContent).not.toBeNull()
    expect(mainContent?.getAttribute('tabindex')).toBe('-1')
  })

  it('renders primary conversion routes for registration, login, and WhatsApp consultation', async () => {
    await page.viewport(1440, 900)
    render(<MarketingPage />)

    const registerLinks = page.getByRole('link', { name: /mulai toko gratis/i })
    await expect.element(registerLinks.first()).toBeVisible()
    await expect.element(registerLinks.first()).toHaveAttribute('href', '/register')

    const loginLinks = page.getByRole('link', { name: /masuk/i })
    await expect.element(loginLinks.first()).toBeVisible()
    await expect.element(loginLinks.first()).toHaveAttribute('href', '/login')

    const enterpriseCta = page.getByRole('link', { name: /konsultasi enterprise/i })
    await expect.element(enterpriseCta).toBeVisible()
    await expect
      .element(enterpriseCta)
      .toHaveAttribute('href', expect.stringContaining('https://wa.me/'))
  })

  it('renders Screen 5 closing conversion CTA, payment trust badges, and brand footer', async () => {
    await page.viewport(1440, 900)
    render(<MarketingPage />)

    const closingSection = page.getByTestId('closing-cta-section')
    await expect.element(closingSection).toBeVisible()

    const closeHeading = page.getByRole('heading', {
      name: /buka katalog online|mulai digitalisasi toko|siap menumbuhkan bisnis/i,
    })
    await expect.element(closeHeading).toBeVisible()

    const qrisBadge = page.getByTestId('trust-badge-qris')
    const bankBadge = page.getByTestId('trust-badge-bank')
    await expect.element(qrisBadge).toBeVisible()
    await expect.element(bankBadge).toBeVisible()

    const platformFooter = page.getByTestId('platform-footer')
    await expect.element(platformFooter).toBeVisible()

    const wordmark = page.getByRole('img', { name: 'MeracikWeb' })
    await expect.element(wordmark.first()).toBeVisible()

    const privacyLink = page.getByRole('link', { name: /kebijakan privasi/i })
    const termsLink = page.getByRole('link', { name: /syarat & ketentuan/i })
    await expect.element(privacyLink).toBeVisible()
    await expect.element(termsLink).toBeVisible()

    const copyright = page.getByText(/2026 MeracikWeb/i)
    await expect.element(copyright).toBeVisible()
  })

  it('collapses dual-pane simulator into single frames with 44px min tap targets on viewports under 640px', async () => {
    await page.viewport(390, 844)
    render(<MarketingPage />)

    const adminToggle = page.getByRole('tab', { name: /mode admin/i })
    const buyerToggle = page.getByRole('tab', { name: /mode pembeli/i })

    await expect.element(adminToggle).toBeVisible()
    await expect.element(buyerToggle).toBeVisible()

    const adminRect = adminToggle.element().getBoundingClientRect()
    const buyerRect = buyerToggle.element().getBoundingClientRect()

    expect(adminRect.height).toBeGreaterThanOrEqual(44)
    expect(adminRect.width).toBeGreaterThanOrEqual(44)
    expect(buyerRect.height).toBeGreaterThanOrEqual(44)
    expect(buyerRect.width).toBeGreaterThanOrEqual(44)

    const editorPane = page.getByTestId('editor-pane')
    const mobilePreview = page.getByTestId('mobile-preview')

    await expect.element(editorPane).toBeVisible()

    await buyerToggle.click()
    await expect.element(mobilePreview).toBeVisible()

    await adminToggle.click()
    await expect.element(editorPane).toBeVisible()
  })

  it('has zero horizontal element overflow at 390px and 320px mobile viewports', async () => {
    await page.viewport(390, 844)
    render(<MarketingPage />)

    const scrollWidth390 = document.documentElement.scrollWidth
    expect(scrollWidth390).toBeLessThanOrEqual(390)

    await page.viewport(320, 568)
    const scrollWidth320 = document.documentElement.scrollWidth
    expect(scrollWidth320).toBeLessThanOrEqual(320)
  })

  it('meets WCAG 2.2 AA contrast compliance across primary interactive actions', async () => {
    await page.viewport(1440, 900)
    render(<MarketingPage />)

    const headline = page.getByRole('heading', { level: 1 })
    await expect.element(headline).toBeVisible()

    const heroSection = page.getByTestId('marketing-hero')
    await expect.element(heroSection).toBeVisible()

    const headlineColor = window.getComputedStyle(headline.element()).color
    const heroBg = window.getComputedStyle(heroSection.element()).backgroundColor || '#ffffff'
    const headlineContrast = getContrastRatio(headlineColor, heroBg)
    expect(headlineContrast).toBeGreaterThanOrEqual(4.5)

    const primaryCta = page.getByRole('link', { name: /mulai toko gratis/i }).first()
    await expect.element(primaryCta).toBeVisible()

    const primaryCtaEl = primaryCta.element()
    const ctaBg = window.getComputedStyle(primaryCtaEl).backgroundColor
    const ctaColor = window.getComputedStyle(primaryCtaEl).color
    const ctaContrast = getContrastRatio(ctaColor, ctaBg)
    expect(ctaContrast).toBeGreaterThanOrEqual(4.5)
  })
})
