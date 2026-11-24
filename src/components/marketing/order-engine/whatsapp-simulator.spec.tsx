import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { getContrastRatio } from '@/components/marketing/test-utils/contrast'

import { WhatsAppSimulator } from './whatsapp-simulator'

import '@/styles/globals.css'

describe('WhatsAppSimulator Component (Screen 3)', () => {
  it('renders viewport cleanly with display typography and explanatory copy detailing the zero-commission model', async () => {
    await page.viewport(1440, 900)
    render(<WhatsAppSimulator />)

    const section = page.getByTestId('whatsapp-simulator-section')
    await expect.element(section).toBeVisible()
    await expect.element(section).toHaveClass(/min-h-screen/)
    const rect = section.element().getBoundingClientRect()
    expect(rect.height).toBeGreaterThanOrEqual(800)
    // Headline in Bricolage Grotesque
    const headline = page.getByRole('heading', { level: 2 })
    await expect.element(headline).toBeVisible()
    await expect.element(headline).toHaveClass('font-display')

    // Explanatory copy detailing zero-commission direct model
    const explanation = page.getByTestId('zero-commission-explanation')
    await expect.element(explanation).toBeVisible()
    const explanationText = explanation.element().textContent || ''
    expect(explanationText).toContain('0%')
    expect(explanationText).toContain('komisi')
  })

  it('allows quantity adjustments and modifier toggles, updating subtotal calculations in real time in IDR with tabular numbers', async () => {
    render(<WhatsAppSimulator />)

    const item1Subtotal = page.getByTestId('item-subtotal-item-1')
    const item2Subtotal = page.getByTestId('item-subtotal-item-2')
    const orderTotal = page.getByTestId('cart-order-total')

    // Initial state verification: Item 1 = Rp 18.000, Item 2 = Rp 24.000, Total = Rp 42.000
    await expect.element(item1Subtotal).toBeVisible()
    await expect.element(item1Subtotal).toHaveTextContent('Rp 18.000')
    await expect.element(item2Subtotal).toHaveTextContent('Rp 24.000')
    await expect.element(orderTotal).toHaveTextContent('Rp 42.000')

    // Verify font-mono and tabular-nums on price elements
    await expect.element(orderTotal).toHaveClass('font-mono')
    await expect.element(orderTotal).toHaveClass('tabular-nums')

    // Increment item 1 quantity: qty 1 -> 2. Subtotal becomes Rp 36.000, total becomes Rp 60.000
    const incButton = page.getByTestId('btn-increment-item-1')
    await incButton.click()
    await expect.element(item1Subtotal).toHaveTextContent('Rp 36.000')
    await expect.element(orderTotal).toHaveTextContent('Rp 60.000')

    // Decrement item 1 quantity back to 1
    const decButton = page.getByTestId('btn-decrement-item-1')
    await decButton.click()
    await expect.element(item1Subtotal).toHaveTextContent('Rp 18.000')
    await expect.element(orderTotal).toHaveTextContent('Rp 42.000')

    // Toggle modifier: Extra Espresso Shot (+Rp 4.000). Item 1 becomes Rp 22.000, total becomes Rp 46.000
    const modifierToggle = page.getByTestId('modifier-item-1-extraShot')
    await modifierToggle.click()
    await expect.element(item1Subtotal).toHaveTextContent('Rp 22.000')
    await expect.element(orderTotal).toHaveTextContent('Rp 46.000')
  })

  it('animates/switches into realistic WhatsApp chat bubble showing structured order summary', async () => {
    render(<WhatsAppSimulator />)

    // Toggle Extra Espresso Shot on Item 1 (+Rp 4.000)
    const modifierToggle = page.getByTestId('modifier-item-1-extraShot')
    await modifierToggle.click()

    // Dispatch action button
    const dispatchButton = page.getByTestId('btn-dispatch-whatsapp')
    await expect.element(dispatchButton).toBeVisible()
    await dispatchButton.click()

    // WhatsApp chat bubble appears
    const chatBubble = page.getByTestId('whatsapp-chat-bubble')
    await expect.element(chatBubble).toBeVisible()

    // Structured message verification
    const messageText = page.getByTestId('whatsapp-message-text')
    await expect.element(messageText).toBeVisible()

    // Verifies tenant name, items, modifier, total, customer, and payment instructions
    const rawText = messageText.element().textContent || ''
    expect(rawText).toContain('Kopi Sudut Senja')
    expect(rawText).toContain('Es Kopi Susu Aren')
    expect(rawText).toContain('Extra Espresso Shot')
    expect(rawText).toContain('Croissant Cokelat Mentega')
    expect(rawText).toContain('Rp 46.000')
    expect(rawText).toContain('Instruksi Pembayaran')

    // Realistic timestamp and read receipt
    const timestamp = page.getByTestId('whatsapp-timestamp')
    await expect.element(timestamp).toBeVisible()
    const readReceipt = page.getByTestId('whatsapp-read-receipt')
    await expect.element(readReceipt).toBeVisible()

    // Return to cart button switches view back
    const editButton = page.getByTestId('btn-edit-order')
    await expect.element(editButton).toBeVisible()
    await editButton.click()

    // Cart view is active again
    await expect.element(page.getByTestId('cart-order-total')).toBeVisible()
  })

  it('satisfies WCAG 2.2 AA contrast compliance on primary CTA and message bubble elements', async () => {
    render(<WhatsAppSimulator />)

    const section = page.getByTestId('whatsapp-simulator-section')
    await expect.element(section).toBeVisible()

    const headline = page.getByRole('heading', { level: 2 })
    await expect.element(headline).toBeVisible()

    const headlineColor = window.getComputedStyle(headline.element()).color
    const sectionBg = window.getComputedStyle(section.element()).backgroundColor || '#ffffff'
    const headlineContrast = getContrastRatio(headlineColor, sectionBg)
    expect(headlineContrast).toBeGreaterThanOrEqual(4.5)

    const dispatchBtn = page.getByTestId('btn-dispatch-whatsapp')
    await expect.element(dispatchBtn).toBeVisible()
    const btnEl = dispatchBtn.element()
    const btnBg = window.getComputedStyle(btnEl).backgroundColor
    const btnColor = window.getComputedStyle(btnEl).color
    const btnContrast = getContrastRatio(btnColor, btnBg)
    expect(btnContrast).toBeGreaterThanOrEqual(4.5)

    // Switch to WhatsApp view and verify message contrast
    await dispatchBtn.click()
    const chatBubble = page.getByTestId('whatsapp-chat-bubble')
    await expect.element(chatBubble).toBeVisible()
    const messageText = page.getByTestId('whatsapp-message-text')
    await expect.element(messageText).toBeVisible()

    const bubbleBg = window.getComputedStyle(chatBubble.element()).backgroundColor
    const messageColor = window.getComputedStyle(messageText.element()).color
    const bubbleContrast = getContrastRatio(messageColor, bubbleBg)
    expect(bubbleContrast).toBeGreaterThanOrEqual(4.5)
  })
})
