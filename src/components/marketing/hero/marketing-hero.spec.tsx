import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { MarketingHero } from './marketing-hero'

import '@/styles/globals.css'

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

function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = getRenderedRgb(foreground, background)
  const bgRgb = getRenderedRgb(background)
  const l1 = getRelativeLuminance(fgRgb)
  const l2 = getRelativeLuminance(bgRgb)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('MarketingHero Component', () => {
  beforeEach(async () => {
    await page.viewport(1440, 900)
  })

  it('renders viewport height cleanly with display typography and navigation links', async () => {
    render(<MarketingHero />)

    const heroSection = page.getByTestId('marketing-hero')
    await expect.element(heroSection).toBeVisible()
    await expect.element(heroSection).toHaveClass(/min-h-screen/)

    // Wordmark in header
    const wordmark = page.getByLabelText('MeracikWeb')
    await expect.element(wordmark).toBeVisible()

    // Secondary navigation link to /login
    const loginLink = page.getByRole('link', { name: /masuk/i })
    await expect.element(loginLink).toBeVisible()
    await expect.element(loginLink).toHaveAttribute('href', '/login')

    // Display headline in Bricolage Grotesque
    const headline = page.getByRole('heading', { level: 1 })
    await expect.element(headline).toBeVisible()
    await expect.element(headline).toHaveClass('font-display')

    // Primary CTA to /register
    const primaryCta = page.getByRole('link', { name: /mulai toko gratis/i })
    await expect.element(primaryCta).toBeVisible()
    await expect.element(primaryCta).toHaveAttribute('href', '/register')
  })

  it('renders interactive dual-pane application frame with editor and mobile preview', async () => {
    render(<MarketingHero />)

    const appFrame = page.getByTestId('app-frame')
    await expect.element(appFrame).toBeVisible()

    const editorPane = page.getByTestId('editor-pane')
    await expect.element(editorPane).toBeVisible()

    const mobilePreview = page.getByTestId('mobile-preview')
    await expect.element(mobilePreview).toBeVisible()

    // Input fields exist in editor pane
    const storeInput = page.getByLabelText(/nama toko/i)
    await expect.element(storeInput).toBeVisible()

    const productInput = page.getByLabelText(/nama produk/i)
    await expect.element(productInput).toBeVisible()

    const priceInput = page.getByLabelText(/harga/i)
    await expect.element(priceInput).toBeVisible()

    const variantInput = page.getByLabelText(/varian/i)
    await expect.element(variantInput).toBeVisible()
  })

  it('reacts instantly to product name, price, variant, and store name input changes', async () => {
    render(<MarketingHero />)

    const storeInput = page.getByLabelText(/nama toko/i)
    const productInput = page.getByLabelText(/nama produk/i)
    const priceInput = page.getByLabelText(/harga/i)
    const variantInput = page.getByLabelText(/varian/i)

    const previewStoreName = page.getByTestId('preview-store-name')
    const previewProductName = page.getByTestId('preview-product-name')
    const previewProductPrice = page.getByTestId('preview-product-price')
    const previewVariantOption = page.getByTestId('preview-variant-option')

    // Initial state verification
    await expect.element(previewStoreName).toBeVisible()
    await expect.element(previewProductName).toBeVisible()
    await expect.element(previewProductPrice).toBeVisible()
    await expect.element(previewVariantOption).toBeVisible()

    // Test product name reactivity
    await productInput.fill('Kopi Susu Pandan Premium')
    await expect.element(previewProductName).toHaveTextContent('Kopi Susu Pandan Premium')

    // Test price reactivity
    await priceInput.fill('28000')
    await expect.element(previewProductPrice).toHaveTextContent('Rp 28.000')
    // Test variant reactivity
    await variantInput.fill('Extra Large (1 Liter)')
    await expect.element(previewVariantOption).toHaveTextContent('Extra Large (1 Liter)')

    // Test store name reactivity
    await storeInput.fill('Kopi Senja Nusantara')
    await expect.element(previewStoreName).toHaveTextContent('Kopi Senja Nusantara')
  })

  it('verifies WCAG 2.2 AA contrast compliance on primary CTA and headline elements', async () => {
    render(<MarketingHero />)
    const headline = page.getByRole('heading', { level: 1 })
    await expect.element(headline).toBeVisible()

    const heroSection = page.getByTestId('marketing-hero')
    await expect.element(heroSection).toBeVisible()

    const headlineColor = window.getComputedStyle(headline.element()).color
    const heroBg = window.getComputedStyle(heroSection.element()).backgroundColor || '#ffffff'
    const headlineContrast = getContrastRatio(headlineColor, heroBg)
    // WCAG AA requirement for large text is >= 3.0:1, high-contrast headline expects >= 4.5:1
    expect(headlineContrast).toBeGreaterThanOrEqual(4.5)

    const primaryCta = page.getByRole('link', { name: /mulai toko gratis/i })
    await expect.element(primaryCta).toBeVisible()

    const primaryCtaEl = primaryCta.element()
    const ctaBg = window.getComputedStyle(primaryCtaEl).backgroundColor
    const ctaColor = window.getComputedStyle(primaryCtaEl).color
    const ctaContrast = getContrastRatio(ctaColor, ctaBg)
    // WCAG AA requirement for button text >= 4.5:1
    expect(ctaContrast).toBeGreaterThanOrEqual(4.5)
  })
})
