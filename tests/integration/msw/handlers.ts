import { http, HttpResponse } from 'msw'

export const handlers = [
  // 1. Google Gemini API
  http.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    async () => {
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
    },
  ),

  // 2. Midtrans Snap Transaction
  http.post('https://app.sandbox.midtrans.com/snap/v1/transactions', () => {
    return HttpResponse.json({
      redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-mock-12345',
      token: 'snap-token-mock-12345',
    })
  }),

  http.post('https://app.midtrans.com/snap/v1/transactions', () => {
    return HttpResponse.json({
      redirect_url: 'https://app.midtrans.com/snap/v2/vtweb/snap-token-mock-12345',
      token: 'snap-token-mock-12345',
    })
  }),

  // Resend Emails (fallback when SDK is not mocked)
  http.post('https://api.resend.com/emails', () => {
    return HttpResponse.json({ id: 'mock-resend-email-id' })
  }),

  // 3. Midtrans Status Check
  http.get('https://api.sandbox.midtrans.com/v2/:orderId/status', ({ params }) => {
    return HttpResponse.json({
      fraud_status: 'accept',
      gross_amount: '299000.00',
      order_id: params.orderId,
      payment_type: 'gopay',
      signature_key: 'mock-signature-key',
      status_code: '200',
      status_message: 'Success, transaction found',
      transaction_id: 'midtrans-post-verify-123',
      transaction_status: 'settlement',
      transaction_time: '2026-11-23 10:00:00',
    })
  }),

  http.get('https://api.midtrans.com/v2/:orderId/status', ({ params }) => {
    return HttpResponse.json({
      fraud_status: 'accept',
      gross_amount: '299000.00',
      order_id: params.orderId,
      payment_type: 'gopay',
      signature_key: 'mock-signature-key',
      status_code: '200',
      status_message: 'Success, transaction found',
      transaction_id: 'midtrans-post-verify-prod',
      transaction_status: 'settlement',
      transaction_time: '2026-11-23 10:00:00',
    })
  }),

  // 4. Neon Auth JWKS Endpoint
  http.get(
    'https://test.neonauth.us-east-1.aws.neon.tech/neondb/auth/.well-known/jwks.json',
    () => {
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
    },
  ),
]
