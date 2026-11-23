import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { MeracikWordmark } from './meracik-wordmark'

describe('MeracikWordmark component', () => {
  it('renders brand wordmark with accessible name', async () => {
    render(<MeracikWordmark />)

    const wordmark = page.getByRole('img', { name: 'MeracikWeb' })
    await expect.element(wordmark).toBeVisible()
    await expect.element(wordmark).toHaveAccessibleName('MeracikWeb')
  })

  it('renders typography with Plus Jakarta Sans ExtraBold and italic Web suffix', async () => {
    render(<MeracikWordmark />)

    const wordmark = page.getByRole('img', { name: 'MeracikWeb' })
    await expect.element(wordmark).toHaveClass('font-plus-jakarta')
    await expect.element(wordmark).toHaveClass('font-extrabold')

    const baseText = page.getByText('Meracik')
    await expect.element(baseText).toBeVisible()

    const italicSuffix = page.getByText('Web')
    await expect.element(italicSuffix).toBeVisible()
    await expect.element(italicSuffix).toHaveClass('italic')
  })

  it('supports size variants and custom className', async () => {
    render(
      <div>
        <MeracikWordmark data-testid="wordmark-sm" size="sm" />
        <MeracikWordmark data-testid="wordmark-md" size="md" />
        <MeracikWordmark data-testid="wordmark-lg" size="lg" />
        <MeracikWordmark className="opacity-90" data-testid="wordmark-xl" size="xl" />
      </div>,
    )

    const sm = page.getByTestId('wordmark-sm')
    const md = page.getByTestId('wordmark-md')
    const lg = page.getByTestId('wordmark-lg')
    const xl = page.getByTestId('wordmark-xl')

    await expect.element(sm).toHaveClass('text-base')
    await expect.element(md).toHaveClass('text-xl')
    await expect.element(lg).toHaveClass('text-2xl')
    await expect.element(xl).toHaveClass('text-3xl')
    await expect.element(xl).toHaveClass('opacity-90')
  })
})
