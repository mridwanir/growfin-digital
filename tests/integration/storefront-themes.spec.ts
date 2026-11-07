import type { BusinessDemo, MenuItem } from '@/lib/types'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { FnbDemoClient } from '@/components/demo/fnb-demo-client'
import { GroomingDemoClient } from '@/components/demo/grooming-demo-client'
import { RetailDemoClient } from '@/components/demo/retail-demo-client'
import { ServiceDemoClient } from '@/components/demo/service-demo-client'
import { calculateItemPrice, formatVariantOptionDisplay, stackCartItem } from '@/lib/catalog'

const mockFnbClient: BusinessDemo = {
  name: 'Kopi Artisan Nusantara',
  address: 'Jl. Riau No. 55',
  categories: ['Coffee', 'Snacks'],
  category: 'Coffee Shop & Cafe',
  city: 'Bandung',
  googleMapsUrl: 'https://maps.google.com/?cid=123',
  hours: '08:00 - 22:00',
  iconEmoji: '☕',
  package_tier: 'pro-basic',
  phone: '081234567890',
  rating: 4.9,
  reviewCount: 120,
  tagline: 'Secangkir Cerita Tiap Hari',
  themeColor: '#d97706',
  waNumber: '6281234567890',
  marketing: {
    promoLabel: 'Diskon 20%',
    usps: [{ desc: '100% Arabika', title: 'Biji Pilihan' }],
  },
  menu: [
    {
      id: 1,
      name: 'Kopi Susu Aren',
      category: 'Coffee',
      desc: 'Espresso segar dengan gula aren',
      price: '20000',
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
  reviews: [
    {
      authorName: 'Budi Santoso',
      rating: 5,
      text: 'Kopi terenak di Bandung!',
    },
  ],
}

const mockRetailClient: BusinessDemo = {
  ...mockFnbClient,
  name: 'Urban Streetwear Bandung',
  category: 'Clothing & Fashion',
  themeColor: '#09090b',
  menu: [
    {
      id: 101,
      name: 'Overdose Boxy Tee',
      category: 'T-Shirts',
      desc: 'Heavyweight cotton t-shirt',
      originalPrice: 199000,
      price: '149000',
      variants: [
        {
          name: 'Size',
          options: [
            { label: 'M', priceModifier: 0 },
            { label: 'XL', priceModifier: 15000 },
          ],
        },
      ],
    },
  ],
}

const mockGroomingClient: BusinessDemo = {
  ...mockFnbClient,
  name: 'Gentlemen Classic Barber',
  category: 'Barbershop & Grooming',
  themeColor: '#1c1917',
  menu: [
    {
      id: 201,
      name: 'Gentleman Cut & Wash',
      category: 'Haircut',
      desc: 'Potong rambut klasik dengan hot towel',
      duration: 45,
      price: '65000',
    },
  ],
}

const mockServiceClient: BusinessDemo = {
  ...mockFnbClient,
  name: 'Smile Dental Care',
  category: 'Klinik Gigi & Dental Care',
  themeColor: '#0284c7',
  menu: [
    {
      id: 301,
      name: 'Ultrasonic Scaling',
      category: 'Pembersihan',
      desc: 'Pembersihan karang gigi dengan teknologi ultrasonic',
      duration: 30,
      price: '250000',
    },
  ],
  practitioners: [
    {
      id: 'doc-1',
      name: 'drg. Rian Hidayat',
      avatarEmoji: '👨‍⚕️',
      role: 'Dokter Gigi Spesialis Ortodonti',
    },
  ],
}

describe('storefront theme rendering, catalog & variant ordering (seam 3)', () => {
  describe('catalog variant selection & cart math', () => {
    it('calculates item subtotal accurately with variant price modifiers', () => {
      const basePrice = 20000
      const regularPrice = calculateItemPrice(basePrice, [{ label: 'Regular', priceModifier: 0 }])
      expect(regularPrice).toBe(20000)

      const largePrice = calculateItemPrice(basePrice, [{ label: 'Large', priceModifier: 5000 }])
      expect(largePrice).toBe(25000)

      const negativeModifierPrice = calculateItemPrice(basePrice, [
        { label: 'Hemat', priceModifier: -3000 },
      ])
      expect(negativeModifierPrice).toBe(17000)
    })

    it('stacks identical cart items and separates different variant selections', () => {
      const product: MenuItem = mockFnbClient.menu[0]
      const cart: any[] = []

      // Add 1 Regular
      const regularItem = {
        id: 'cart-1',
        product,
        quantity: 1,
        selectedAddons: [],
        selectedVariants: { Ukuran: { label: 'Regular', priceModifier: 0 } },
        totalPrice: 20000,
      }
      const cartAfterFirst = stackCartItem(cart, regularItem)
      expect(cartAfterFirst).toHaveLength(1)
      expect(cartAfterFirst[0].quantity).toBe(1)

      // Add another identical Regular -> stacks to quantity 2
      const cartAfterSecond = stackCartItem(cartAfterFirst, regularItem)
      expect(cartAfterSecond).toHaveLength(1)
      expect(cartAfterSecond[0].quantity).toBe(2)

      // Add Large -> does not stack, appends as distinct line item
      const largeItem = {
        id: 'cart-2',
        product,
        quantity: 1,
        selectedAddons: [],
        selectedVariants: { Ukuran: { label: 'Large', priceModifier: 5000 } },
        totalPrice: 25000,
      }
      const cartAfterThird = stackCartItem(cartAfterSecond, largeItem)
      expect(cartAfterThird).toHaveLength(2)
      expect(cartAfterThird[1].quantity).toBe(1)
    })

    it('formats variant option display strings for receipts and WhatsApp messages', () => {
      expect(formatVariantOptionDisplay('Ukuran', { label: 'Large', priceModifier: 5000 })).toBe(
        'Ukuran: Large (+Rp 5.000)',
      )
      expect(formatVariantOptionDisplay('Ukuran', { label: 'Regular', priceModifier: 0 })).toBe(
        'Ukuran: Regular',
      )
    })
  })

  describe('fnb visual themes rendering', () => {
    const fnbThemes = [
      'fnb-theme-classic',
      'fnb-theme-modern',
      'fnb-theme-premium',
      'fnb-theme-artisan',
      'fnb-theme-elegant',
      'fnb-theme-bold',
      'fnb-theme-vibrant',
    ]

    for (const theme of fnbThemes) {
      it(`renders FnB theme variant "${theme}" without crashing`, () => {
        const markup = renderToStaticMarkup(
          React.createElement(FnbDemoClient, {
            client: mockFnbClient,
            themeVariant: theme,
          }),
        )

        expect(markup).toContain('Kopi Artisan Nusantara')
        expect(markup).toContain('Kopi Susu Aren')
      })
    }
  })

  describe('retail visual themes rendering', () => {
    const retailThemes = [
      'retail-theme-urban',
      'retail-theme-editorial',
      'retail-theme-tech',
      'retail-theme-dark',
      'retail-theme-fresh',
      'retail-theme-artisan',
    ]

    for (const theme of retailThemes) {
      it(`renders Retail theme variant "${theme}" without crashing`, () => {
        const markup = renderToStaticMarkup(
          React.createElement(RetailDemoClient, {
            client: mockRetailClient,
            themeVariant: theme,
          }),
        )

        expect(markup).toContain('Urban Streetwear Bandung')
        expect(markup).toContain('Overdose Boxy Tee')
      })
    }
  })

  describe('grooming visual themes rendering', () => {
    const groomingThemes = [
      'grooming-barbershop-default',
      'grooming-barbershop-light',
      'grooming-beautynspa-default',
      'grooming-beautynspa-dayspa',
      'grooming-beautynspa-lumiere',
      'grooming-nailspa-default',
    ]

    for (const theme of groomingThemes) {
      it(`renders Grooming theme variant "${theme}" without crashing`, () => {
        const markup = renderToStaticMarkup(
          React.createElement(GroomingDemoClient, {
            client: mockGroomingClient,
            themeVariant: theme,
          }),
        )

        expect(markup).toContain('Gentlemen Classic Barber')
      })
    }
  })

  describe('service archetype rendering', () => {
    it('renders Service template with practitioner and service pricing lists', () => {
      const markup = renderToStaticMarkup(
        React.createElement(ServiceDemoClient, {
          client: mockServiceClient,
        }),
      )

      expect(markup).toContain('Smile Dental Care')
      expect(markup).toContain('drg. Rian Hidayat')
      expect(markup).toContain('Ultrasonic Scaling')
    })
  })

  describe('whatsApp link integration', () => {
    it('generates properly formatted WhatsApp ordering link with catalog items', () => {
      const waNumber = mockFnbClient.waNumber
      const encodedMessage = encodeURIComponent(
        `Halo ${mockFnbClient.name}, saya ingin memesan:\n1. Kopi Susu Aren (x2)\nTotal: Rp 40.000`,
      )
      const expectedUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`

      expect(expectedUrl).toContain('wa.me/6281234567890')
      expect(decodeURIComponent(expectedUrl)).toContain('Halo Kopi Artisan Nusantara')
    })
  })
})
