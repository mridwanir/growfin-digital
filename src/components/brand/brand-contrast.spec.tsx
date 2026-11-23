import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { MeracikWordmark } from './meracik-wordmark'

import '@/styles/globals.css'

/**
 * Returns the rendered sRGB values from a CSS color string. When a background color is provided,
 * translucent foreground colors composite over the background on the 2D canvas.
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
 * Calculates WCAG 2.2 standard relative luminance from sRGB values.
 */
function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculates WCAG 2.2 contrast ratio between two rendered colors.
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

describe('Brand WCAG 2.2 AA Contrast Compliance (Light Mode)', () => {
  it('asserts Primary Button text contrast >= 4.5:1 against button background', async () => {
    render(
      <div className="bg-background text-foreground p-8" data-testid="light-container">
        <Button data-testid="light-button">Primary Action</Button>
      </div>,
    )

    const btn = page.getByTestId('light-button')
    await expect.element(btn).toBeVisible()

    const btnStyle = window.getComputedStyle(btn.element())
    const contrast = getContrastRatio(btnStyle.color, btnStyle.backgroundColor)

    expect(contrast).toBeGreaterThanOrEqual(4.5)
  })

  it('asserts Primary Badge text contrast >= 4.5:1 against badge background', async () => {
    render(
      <div className="bg-background text-foreground p-8" data-testid="light-container">
        <Badge data-testid="light-badge">New Feature</Badge>
      </div>,
    )

    const badge = page.getByTestId('light-badge')
    await expect.element(badge).toBeVisible()

    const badgeStyle = window.getComputedStyle(badge.element())
    const contrast = getContrastRatio(badgeStyle.color, badgeStyle.backgroundColor)

    expect(contrast).toBeGreaterThanOrEqual(4.5)
  })

  it('asserts Input perimeter / border non-text contrast >= 3:1 against page background', async () => {
    render(
      <div className="bg-background text-foreground p-8" data-testid="light-container">
        <Input data-testid="light-input" placeholder="Search..." />
      </div>,
    )

    const container = page.getByTestId('light-container')
    const input = page.getByTestId('light-input')
    await expect.element(input).toBeVisible()

    const containerStyle = window.getComputedStyle(container.element())
    const inputStyle = window.getComputedStyle(input.element())
    const perimeterContrast = getContrastRatio(
      inputStyle.borderColor,
      containerStyle.backgroundColor,
    )
    expect(perimeterContrast).toBeGreaterThanOrEqual(3.0)
  })

  it('asserts Card perimeter border contrast >= 3:1 against page background and text contrast >= 4.5:1', async () => {
    render(
      <div className="bg-background text-foreground p-8" data-testid="light-container">
        <Card className="border" data-testid="light-card">
          <p>Card Content</p>
        </Card>
      </div>,
    )

    const container = page.getByTestId('light-container')
    const card = page.getByTestId('light-card')
    await expect.element(card).toBeVisible()

    const containerStyle = window.getComputedStyle(container.element())
    const cardStyle = window.getComputedStyle(card.element())

    const borderContrast = getContrastRatio(cardStyle.borderColor, containerStyle.backgroundColor)
    const textContrast = getContrastRatio(cardStyle.color, cardStyle.backgroundColor)

    expect(borderContrast).toBeGreaterThanOrEqual(3.0)
    expect(textContrast).toBeGreaterThanOrEqual(4.5)
  })

  it('asserts MeracikWordmark text contrast >= 4.5:1 against background', async () => {
    render(
      <div className="bg-background text-foreground p-8" data-testid="light-container">
        <MeracikWordmark data-testid="light-wordmark" />
      </div>,
    )

    const container = page.getByTestId('light-container')
    const wordmark = page.getByTestId('light-wordmark')
    await expect.element(wordmark).toBeVisible()

    const containerStyle = window.getComputedStyle(container.element())
    const wordmarkEl = wordmark.element()
    const meracikTextEl = wordmarkEl.querySelector('span:first-child')
    const webTextEl = wordmarkEl.querySelector('span:last-child')

    expect(meracikTextEl).not.toBeNull()
    expect(webTextEl).not.toBeNull()

    const meracikStyle = window.getComputedStyle(meracikTextEl as HTMLElement)
    const webStyle = window.getComputedStyle(webTextEl as HTMLElement)

    const meracikContrast = getContrastRatio(meracikStyle.color, containerStyle.backgroundColor)
    const webContrast = getContrastRatio(webStyle.color, containerStyle.backgroundColor)

    expect(meracikContrast).toBeGreaterThanOrEqual(4.5)
    expect(webContrast).toBeGreaterThanOrEqual(4.5)
  })
})

describe('Brand WCAG 2.2 AA Contrast Compliance (Dark Mode)', () => {
  it('asserts Primary Button text contrast >= 4.5:1 against button background', async () => {
    render(
      <div className="dark bg-background text-foreground p-8" data-testid="dark-container">
        <Button data-testid="dark-button">Primary Action</Button>
      </div>,
    )

    const btn = page.getByTestId('dark-button')
    await expect.element(btn).toBeVisible()

    const btnStyle = window.getComputedStyle(btn.element())
    const contrast = getContrastRatio(btnStyle.color, btnStyle.backgroundColor)

    expect(contrast).toBeGreaterThanOrEqual(4.5)
  })

  it('asserts Primary Badge text contrast >= 4.5:1 against badge background', async () => {
    render(
      <div className="dark bg-background text-foreground p-8" data-testid="dark-container">
        <Badge data-testid="dark-badge">New Feature</Badge>
      </div>,
    )

    const badge = page.getByTestId('dark-badge')
    await expect.element(badge).toBeVisible()

    const badgeStyle = window.getComputedStyle(badge.element())
    const contrast = getContrastRatio(badgeStyle.color, badgeStyle.backgroundColor)

    expect(contrast).toBeGreaterThanOrEqual(4.5)
  })

  it('asserts Input perimeter / border non-text contrast >= 3:1 against page background', async () => {
    render(
      <div className="dark bg-background text-foreground p-8" data-testid="dark-container">
        <Input data-testid="dark-input" placeholder="Search..." />
      </div>,
    )

    const container = page.getByTestId('dark-container')
    const input = page.getByTestId('dark-input')
    await expect.element(input).toBeVisible()

    const containerStyle = window.getComputedStyle(container.element())
    const inputStyle = window.getComputedStyle(input.element())

    const perimeterContrast = getContrastRatio(
      inputStyle.borderColor,
      containerStyle.backgroundColor,
    )
    expect(perimeterContrast).toBeGreaterThanOrEqual(3.0)
  })

  it('asserts Card perimeter border contrast >= 3:1 against page background and text contrast >= 4.5:1', async () => {
    render(
      <div className="dark bg-background text-foreground p-8" data-testid="dark-container">
        <Card className="border" data-testid="dark-card">
          <p>Card Content</p>
        </Card>
      </div>,
    )

    const container = page.getByTestId('dark-container')
    const card = page.getByTestId('dark-card')
    await expect.element(card).toBeVisible()

    const containerStyle = window.getComputedStyle(container.element())
    const cardStyle = window.getComputedStyle(card.element())

    const borderContrast = getContrastRatio(cardStyle.borderColor, containerStyle.backgroundColor)
    const textContrast = getContrastRatio(cardStyle.color, cardStyle.backgroundColor)

    expect(borderContrast).toBeGreaterThanOrEqual(3.0)
    expect(textContrast).toBeGreaterThanOrEqual(4.5)
  })

  it('asserts MeracikWordmark text contrast >= 4.5:1 against background', async () => {
    render(
      <div className="dark bg-background text-foreground p-8" data-testid="dark-container">
        <MeracikWordmark data-testid="dark-wordmark" />
      </div>,
    )

    const container = page.getByTestId('dark-container')
    const wordmark = page.getByTestId('dark-wordmark')
    await expect.element(wordmark).toBeVisible()

    const containerStyle = window.getComputedStyle(container.element())
    const wordmarkEl = wordmark.element()
    const meracikTextEl = wordmarkEl.querySelector('span:first-child')
    const webTextEl = wordmarkEl.querySelector('span:last-child')

    expect(meracikTextEl).not.toBeNull()
    expect(webTextEl).not.toBeNull()

    const meracikStyle = window.getComputedStyle(meracikTextEl as HTMLElement)
    const webStyle = window.getComputedStyle(webTextEl as HTMLElement)

    const meracikContrast = getContrastRatio(meracikStyle.color, containerStyle.backgroundColor)
    const webContrast = getContrastRatio(webStyle.color, containerStyle.backgroundColor)

    expect(meracikContrast).toBeGreaterThanOrEqual(4.5)
    expect(webContrast).toBeGreaterThanOrEqual(4.5)
  })
})
