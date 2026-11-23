import { http, HttpResponse } from 'msw'

export const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const MIDTRANS_SNAP_URL_PATTERN =
  /^https:\/\/app\.(?:sandbox\.)?midtrans\.com\/snap\/v1\/transactions$/

const MIDTRANS_STATUS_URL_PATTERN =
  /^https:\/\/api\.(?:sandbox\.)?midtrans\.com\/v2\/([^/]+)\/status$/

const NEON_AUTH_JWKS_URL =
  'https://test.neonauth.us-east-1.aws.neon.tech/neondb/auth/.well-known/jwks.json'

export const handlers = [
  // 1. Google Gemini API
  http.post(GEMINI_API_URL, async () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  business: {
                    name: 'Warung Kopi Mantap',
                    address: 'Jl. Riau No. 12',
                    category: 'Cafe & Coffee Shop',
                    city: 'Bandung',
                    googleMapsUrl: '',
                    phone: '081234567890',
                    tagline: 'Kopi nikmat harga bersahabat',
                    brandingContent: {
                      faqs: [{ answer: '09:00 - 21:00', question: 'Buka jam berapa?' }],
                      heroSubtitle: 'Biji kopi pilihan nusantara',
                      heroTitle: 'Nikmati Kopi Terbaik',
                      tagline: 'Kopi nikmat harga bersahabat',
                      usps: [{ description: 'Biji kopi murni', title: 'Asli' }],
                    },
                    operatingHours: {
                      closeTime: '21:00',
                      openTime: '09:00',
                      raw: '09:00 - 21:00',
                    },
                    themeConfig: {
                      fbType: 'DINE_IN',
                      layoutId: 'retail-theme-urban',
                      themeColor: '#0f766e',
                    },
                  },
                  categories: [
                    { name: 'Minuman Kopi', sortOrder: 0 },
                    { name: 'Camilan', sortOrder: 1 },
                  ],
                  products: [
                    {
                      name: 'Es Kopi Susu',
                      basePrice: 18000,
                      categoryName: 'Minuman Kopi',
                      description: 'Kopi susu gula aren',
                      imageUrl: 'https://images.unsplash.com/kopi',
                      variants: [
                        {
                          name: 'Ukuran',
                          options: [
                            { label: 'Regular', priceModifier: 0 },
                            { label: 'Large', priceModifier: 5000 },
                          ],
                        },
                      ],
                    },
                  ],
                }),
              },
            ],
          },
        },
      ],
    })
  }),

  // 2. Midtrans Snap Transaction (consolidated sandbox and production)
  http.post(MIDTRANS_SNAP_URL_PATTERN, () => {
    return HttpResponse.json({
      redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-mock-12345',
      token: 'snap-token-mock-12345',
    })
  }),

  // 3. Midtrans Status Check (consolidated sandbox and production)
  http.get(MIDTRANS_STATUS_URL_PATTERN, ({ params }) => {
    const orderId = (params.orderId ?? params[0]) as string
    return HttpResponse.json({
      fraud_status: 'accept',
      gross_amount: '299000.00',
      order_id: orderId,
      payment_type: 'gopay',
      signature_key: 'mock-signature-key',
      status_code: '200',
      status_message: 'Success, transaction found',
      transaction_id: 'midtrans-post-verify-123',
      transaction_status: 'settlement',
      transaction_time: '2026-11-23 10:00:00',
    })
  }),

  // 4. Neon Auth JWKS Endpoint
  http.get(NEON_AUTH_JWKS_URL, () => {
    return HttpResponse.json({
      keys: [
        {
          alg: 'RS256',
          e: 'AQAB',
          kid: 'mock-neon-key-id',
          kty: 'RSA',
          n: 'mock-n-value',
          use: 'sig',
        },
      ],
    })
  }),
]

type HttpMethod = 'all' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put'

/**
 * Creates an MSW handler simulating a network failure (e.g. connection refused, network drop).
 */
export function mockNetworkError(url: string | RegExp, method: HttpMethod = 'all') {
  return http[method](url, () => {
    return HttpResponse.error()
  })
}

/**
 * Creates an MSW handler returning an HTTP error response.
 */
export function mockHttpError(
  url: string | RegExp,
  status: number,
  body?: unknown,
  method: HttpMethod = 'all',
) {
  return http[method](url, () => {
    if (typeof body === 'string') {
      return new HttpResponse(body, { status })
    }
    if (body !== undefined) {
      return HttpResponse.json(body, { status })
    }
    return new HttpResponse(null, { status })
  })
}

/**
 * Dedicated error simulation handlers satisfying spec requirement 16.
 */
export const mockGeminiError = (
  status = 500,
  body: unknown = { error: { message: `Google Gemini error (${status})` } },
) => mockHttpError(GEMINI_API_URL, status, body, 'post')

export const mockMidtransSnapError = (
  status = 500,
  body: unknown = { error_messages: [`Midtrans Snap error (${status})`] },
) => mockHttpError(MIDTRANS_SNAP_URL_PATTERN, status, body, 'post')

export const mockMidtransStatusError = (
  status = 500,
  body: unknown = { status_code: String(status), status_message: `Midtrans error (${status})` },
) => mockHttpError(MIDTRANS_STATUS_URL_PATTERN, status, body, 'get')
