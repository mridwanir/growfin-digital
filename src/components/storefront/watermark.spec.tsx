import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { GrowfinWatermark, MeracikWatermark } from './watermark'

describe('MeracikWatermark component', () => {
  it('renders watermark landmark with accessible name', async () => {
    render(<MeracikWatermark />)

    const landmark = page.getByRole('complementary', { name: 'Watermark MeracikWeb' })
    await expect.element(landmark).toBeVisible()
  })

  it('renders link to platform URL with MeracikWeb and Buat Web Gratis', async () => {
    render(<MeracikWatermark href="https://meracik.web.id" />)

    const link = page.getByRole('link', { name: /Buat Web Gratis/i })
    await expect.element(link).toBeVisible()
    await expect.element(link).toHaveAttribute('href', 'https://meracik.web.id')
    await expect.element(link).toHaveAttribute('target', '_blank')
    await expect.element(link).toHaveAttribute('rel', 'noopener noreferrer')

    const baseBrand = page.getByText('Meracik')
    await expect.element(baseBrand).toBeVisible()

    const italicSuffix = page.getByText('Web')
    await expect.element(italicSuffix).toBeVisible()
    await expect.element(italicSuffix).toHaveClass('italic')

    const cta = page.getByText('Buat Web Gratis')
    await expect.element(cta).toBeVisible()
  })

  it('exports GrowfinWatermark as backwards-compatible alias', () => {
    expect(GrowfinWatermark).toBe(MeracikWatermark)
  })
})
