import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { ArchetypeSwitcher } from './archetype-switcher'

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
    const sRgb = val / 255
    return sRgb <= 0.03928 ? sRgb / 12.92 : ((sRgb + 0.055) / 1.055) ** 2.4
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

describe('ArchetypeSwitcher Component (Screen 2)', () => {
  it('renders Screen 2 cleanly with full viewport height, display typography, and value proposition copy', async () => {
    render(<ArchetypeSwitcher />)

    const section = page.getByTestId('archetype-switcher-section')
    await expect.element(section).toBeVisible()
    await expect.element(section).toHaveClass(/min-h-screen/)

    // Display heading in Bricolage Grotesque
    const heading = page.getByRole('heading', { level: 2 })
    await expect.element(heading).toBeVisible()
    await expect.element(heading).toHaveClass('font-display')
    await expect.element(heading).toHaveTextContent('Dua Model Bisnis UMKM dalam Satu Platform')

    // Value proposition copy
    const valueProp = page.getByTestId('archetype-value-prop')
    await expect.element(valueProp).toBeVisible()
    expect(valueProp.element().textContent).toContain('F&B')
    expect(valueProp.element().textContent).toContain('retail')
  })

  it('provides an accessible segmented tab control toggling between F&B and Retail views', async () => {
    render(<ArchetypeSwitcher />)

    const tabList = page.getByRole('tablist')
    await expect.element(tabList).toBeVisible()

    const fnbTab = page.getByRole('tab', { name: /kuliner & f&b/i })
    const retailTab = page.getByRole('tab', { name: /toko retail/i })

    await expect.element(fnbTab).toBeVisible()
    await expect.element(retailTab).toBeVisible()

    // Default view is F&B
    const fnbView = page.getByTestId('fnb-archetype-view')
    await expect.element(fnbView).toBeVisible()

    // Click Retail tab
    await retailTab.click()

    const retailView = page.getByTestId('retail-archetype-view')
    await expect.element(retailView).toBeVisible()

    // Switch back to F&B tab
    await fnbTab.click()
    await expect.element(fnbView).toBeVisible()
  })

  it('displays F&B variant options with price modifiers calculated in IDR for Kopi Sudut Senja', async () => {
    render(<ArchetypeSwitcher />)

    // Verify F&B preset business name and product
    const storeBadge = page.getByTestId('fnb-preset-badge')
    await expect.element(storeBadge).toHaveTextContent('Kopi Sudut Senja')

    const productName = page.getByTestId('fnb-product-name')
    await expect.element(productName).toBeVisible()

    // Initial base price is Rp 18.000
    const calculatedPrice = page.getByTestId('fnb-calculated-price')
    await expect.element(calculatedPrice).toHaveTextContent('Rp 18.000')

    // Select Large cup size (+Rp 4.000 modifier)
    const largeCupOption = page.getByTestId('fnb-cup-large')
    await largeCupOption.click()
    await expect.element(calculatedPrice).toHaveTextContent('Rp 22.000')

    // Select 1 Liter cup size (+Rp 55.000 modifier)
    const literCupOption = page.getByTestId('fnb-cup-liter')
    await literCupOption.click()
    await expect.element(calculatedPrice).toHaveTextContent('Rp 73.000')

    // Select Regular back (+Rp 0)
    const regularCupOption = page.getByTestId('fnb-cup-regular')
    await regularCupOption.click()
    await expect.element(calculatedPrice).toHaveTextContent('Rp 18.000')

    // Test Sugar Level selection
    const lessSugarOption = page.getByTestId('fnb-sugar-less')
    await lessSugarOption.click()

    // Test Ice Level selection
    const noIceOption = page.getByTestId('fnb-ice-none')
    await noIceOption.click()

    // Test Fulfillment Mode toggle (Dine-in vs Takeaway)
    const takeawayOption = page.getByTestId('fnb-fulfillment-takeaway')
    await takeawayOption.click()

    // Order summary reflects chosen options
    const summaryText = page.getByTestId('fnb-order-summary')
    expect(summaryText.element().textContent).toContain('Bawa Pulang')
    expect(summaryText.element().textContent).toContain('50% Less Sugar')
    expect(summaryText.element().textContent).toContain('Tanpa Es (No Ice)')
  })

  it('displays Retail product sizing, color options, and stock status indicators for Tenun Nusantara', async () => {
    render(<ArchetypeSwitcher />)

    // Switch to Retail tab
    const retailTab = page.getByRole('tab', { name: /toko retail/i })
    await retailTab.click()

    // Verify Retail preset business name and product
    const storeBadge = page.getByTestId('retail-preset-badge')
    await expect.element(storeBadge).toHaveTextContent('Tenun Nusantara')

    const productName = page.getByTestId('retail-product-name')
    await expect.element(productName).toBeVisible()
    await expect.element(productName).toHaveTextContent('Kemeja Tenun Ikat Jepara')

    // Verify stock status indicator badge
    const stockBadge = page.getByTestId('retail-stock-indicator')
    await expect.element(stockBadge).toBeVisible()
    await expect.element(stockBadge).toHaveTextContent('Stok Tersedia (14 pcs)')

    // Test size selection
    const sizeL = page.getByTestId('retail-size-L')
    await sizeL.click()
    const activeSizeDisplay = page.getByTestId('retail-selected-size')
    await expect.element(activeSizeDisplay).toHaveTextContent('L')

    // Select XL with limited stock
    const sizeXL = page.getByTestId('retail-size-XL')
    await sizeXL.click()
    await expect.element(stockBadge).toHaveTextContent('Sisa 2 pcs (Stok Menipis)')

    // Test color selection
    const colorMarun = page.getByTestId('retail-color-marun')
    await colorMarun.click()
    const activeColorDisplay = page.getByTestId('retail-selected-color')
    await expect.element(activeColorDisplay).toHaveTextContent('Marun Terracotta')
  })

  it('satisfies WCAG 2.2 AA contrast compliance and minimum 44px tap targets', async () => {
    render(<ArchetypeSwitcher />)

    const heading = page.getByRole('heading', { level: 2 })
    await expect.element(heading).toBeVisible()
    const section = page.getByTestId('archetype-switcher-section')
    await expect.element(section).toBeVisible()
    const fnbTab = page.getByRole('tab', { name: /kuliner & f&b/i })
    await expect.element(fnbTab).toBeVisible()
    const tabEl = fnbTab.element()
    const headingColor = window.getComputedStyle(heading.element()).color
    const sectionBg = window.getComputedStyle(section.element()).backgroundColor || '#ffffff'
    const headingContrast = getContrastRatio(headingColor, sectionBg)
    expect(headingContrast).toBeGreaterThanOrEqual(4.5)

    const tabRect = tabEl.getBoundingClientRect()
    expect(tabRect.height).toBeGreaterThanOrEqual(44)
  })
})
