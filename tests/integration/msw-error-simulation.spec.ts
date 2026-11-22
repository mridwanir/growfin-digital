import { describe, expect, it } from 'vitest'

import {
  GEMINI_API_URL,
  mockGeminiError,
  mockHttpError,
  mockMidtransSnapError,
  mockMidtransStatusError,
  mockNetworkError,
} from './msw/handlers'
import { server } from './setup'

describe('MSW Error Simulation Helpers (Spec Requirement 16)', () => {
  it('simulates a network-level failure via mockNetworkError', async () => {
    server.use(mockNetworkError('https://example.test/api/flaky'))

    await expect(fetch('https://example.test/api/flaky')).rejects.toThrow()
  })

  it('simulates HTTP errors with custom status and payload via mockHttpError', async () => {
    server.use(
      mockHttpError('https://example.test/api/item', 400, {
        error: 'Bad Request',
      }),
    )

    const res = await fetch('https://example.test/api/item')
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toEqual({ error: 'Bad Request' })
  })

  it('simulates Google Gemini 400 and 500 error responses via mockGeminiError', async () => {
    server.use(mockGeminiError(400, { error: { message: 'Invalid prompt structure' } }))

    const res400 = await fetch(GEMINI_API_URL, { method: 'POST' })
    expect(res400.status).toBe(400)
    const body400 = await res400.json()
    expect(body400.error.message).toBe('Invalid prompt structure')

    server.use(mockGeminiError(500))
    const res500 = await fetch(GEMINI_API_URL, { method: 'POST' })
    expect(res500.status).toBe(500)
  })

  it('simulates Midtrans Snap 400 and 500 errors via mockMidtransSnapError', async () => {
    server.use(mockMidtransSnapError(400, { error_messages: ['gross_amount is required'] }))

    const res400 = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
    })
    expect(res400.status).toBe(400)
    const body400 = await res400.json()
    expect(body400.error_messages).toEqual(['gross_amount is required'])

    server.use(mockMidtransSnapError(500))
    const res500 = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
    })
    expect(res500.status).toBe(500)
  })

  it('simulates Midtrans status check 400 and 500 errors via mockMidtransStatusError', async () => {
    server.use(mockMidtransStatusError(404, { status_code: '404', status_message: 'Not found' }))

    const res404 = await fetch('https://api.sandbox.midtrans.com/v2/ORD-UNKNOWN/status')
    expect(res404.status).toBe(404)
    const body404 = await res404.json()
    expect(body404.status_code).toBe('404')

    server.use(mockMidtransStatusError(500))
    const res500 = await fetch('https://api.midtrans.com/v2/ORD-FAIL/status')
    expect(res500.status).toBe(500)
  })
})
