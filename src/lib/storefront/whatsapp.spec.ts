import type { CartLineItem } from '@/lib/storefront/cart/domain'
import type { FulfillmentData, FulfillmentInput } from '@/lib/storefront/whatsapp'

import { describe, expect, it } from 'vitest'

import {
  buildOrderSummary,
  FulfillmentSchema,
  normalizeWaNumber,
  resolveTenantWhatsAppNumber,
} from '@/lib/storefront/whatsapp'

describe('WhatsApp Domain Engine', () => {
  describe('normalizeWaNumber', () => {
    it('normalizes standard local Indonesian number with leading 08', () => {
      expect(normalizeWaNumber('081234567890')).toBe('6281234567890')
    })

    it('normalizes Indonesian number with international code +62', () => {
      expect(normalizeWaNumber('+6281234567890')).toBe('6281234567890')
    })

    it('leaves already normalized 628... number unchanged', () => {
      expect(normalizeWaNumber('6281234567890')).toBe('6281234567890')
    })

    it('strips dashes, spaces, and punctuation from local number', () => {
      expect(normalizeWaNumber('0857-1234-5678')).toBe('6285712345678')
      expect(normalizeWaNumber('+62 812-3456-7890')).toBe('6281234567890')
      expect(normalizeWaNumber('(0812) 3456 7890')).toBe('6281234567890')
    })

    it('normalizes edge case of redundant 0 after country code (+62 08...)', () => {
      expect(normalizeWaNumber('+62 0812-3456-7890')).toBe('6281234567890')
      expect(normalizeWaNumber('62081234567890')).toBe('6281234567890')
    })

    it('normalizes number starting with 8 without leading zero', () => {
      expect(normalizeWaNumber('81234567890')).toBe('6281234567890')
    })

    it('returns empty string for invalid, empty, or nil inputs', () => {
      expect(normalizeWaNumber('')).toBe('')
      expect(normalizeWaNumber('   ')).toBe('')
      expect(normalizeWaNumber(null)).toBe('')
      expect(normalizeWaNumber(undefined)).toBe('')
      expect(normalizeWaNumber('invalid-phone')).toBe('')
    })
  })

  describe('fulfillmentSchema', () => {
    describe('dINE_IN mode', () => {
      it('validates valid DINE_IN input', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: 'Budi Santoso',
          mode: 'DINE_IN',
          tableNumber: '12A',
        })
        expect(result.success).toBe(true)
        if (!result.success || result.data.mode !== 'DINE_IN') {
          throw new Error('Expected DINE_IN success')
        }
        expect(result.data.tableNumber).toBe('12A')
        expect(result.data.customerName).toBe('Budi Santoso')
      })

      it('rejects empty or whitespace-only tableNumber', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: 'Budi Santoso',
          mode: 'DINE_IN',
          tableNumber: '   ',
        })
        expect(result.success).toBe(false)
        if (result.success) {
          throw new Error('Expected failure')
        }
        const messages = result.error.issues.map(i => i.message)
        expect(messages).toContain('Nomor meja wajib diisi')
      })

      it('rejects missing or empty customerName', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: '',
          mode: 'DINE_IN',
          tableNumber: '12',
        })
        expect(result.success).toBe(false)
        if (result.success) {
          throw new Error('Expected failure')
        }
        const messages = result.error.issues.map(i => i.message)
        expect(messages).toContain('Nama pemesan wajib diisi')
      })
    })

    describe('tAKEAWAY mode', () => {
      it('validates valid TAKEAWAY input', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: 'Siti Rahma',
          mode: 'TAKEAWAY',
        })
        expect(result.success).toBe(true)
        if (!result.success) {
          throw new Error('Expected success')
        }
        expect(result.data.mode).toBe('TAKEAWAY')
        expect(result.data.customerName).toBe('Siti Rahma')
      })

      it('validates TAKEAWAY input with optional pickupPreferences', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: 'Siti Rahma',
          mode: 'TAKEAWAY',
          pickupPreferences: 'Siap jam 13:00 WIB',
        })
        expect(result.success).toBe(true)
        if (!result.success) {
          throw new Error('Expected success')
        }
        expect(result.data.mode).toBe('TAKEAWAY')
        const data = result.data as Extract<FulfillmentInput, { mode: 'TAKEAWAY' }>
        expect(data.pickupPreferences).toBe('Siap jam 13:00 WIB')
      })

      it('rejects missing or whitespace customerName', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: '   ',
          mode: 'TAKEAWAY',
        })
        expect(result.success).toBe(false)
        if (result.success) {
          throw new Error('Expected failure')
        }
        const messages = result.error.issues.map(i => i.message)
        expect(messages).toContain('Nama pemesan wajib diisi')
      })
    })

    describe('pICKUP mode', () => {
      it('validates valid PICKUP input', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: 'Ahmad Faiz',
          mode: 'PICKUP',
        })
        expect(result.success).toBe(true)
        if (!result.success) {
          throw new Error('Expected success')
        }
        expect(result.data.mode).toBe('PICKUP')
        expect(result.data.customerName).toBe('Ahmad Faiz')
      })

      it('validates PICKUP input with optional pickupPreferences', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: 'Ahmad Faiz',
          mode: 'PICKUP',
          pickupPreferences: 'Ambil di kasir lantai 2',
        })
        expect(result.success).toBe(true)
        if (!result.success) {
          throw new Error('Expected success')
        }
        expect(result.data.mode).toBe('PICKUP')
        const data = result.data as Extract<FulfillmentInput, { mode: 'PICKUP' }>
        expect(data.pickupPreferences).toBe('Ambil di kasir lantai 2')
      })

      it('rejects missing customerName', () => {
        const result = FulfillmentSchema.safeParse({
          customerName: '',
          mode: 'PICKUP',
        })
        expect(result.success).toBe(false)
        if (result.success) {
          throw new Error('Expected failure')
        }
        const messages = result.error.issues.map(i => i.message)
        expect(messages).toContain('Nama pemesan wajib diisi')
      })
    })

    describe('dELIVERY mode', () => {
      it('validates valid DELIVERY input with address >= 5 characters', () => {
        const result = FulfillmentSchema.safeParse({
          address: 'Jl. Riau No. 45, Bandung',
          customerName: 'Dewi Lestari',
          mode: 'DELIVERY',
        })
        expect(result.success).toBe(true)
        if (!result.success || result.data.mode !== 'DELIVERY') {
          throw new Error('Expected DELIVERY success')
        }
        expect(result.data.address).toBe('Jl. Riau No. 45, Bandung')
        expect(result.data.customerName).toBe('Dewi Lestari')
      })

      it('rejects address shorter than 5 characters', () => {
        const result = FulfillmentSchema.safeParse({
          address: 'Jl.',
          customerName: 'Dewi Lestari',
          mode: 'DELIVERY',
        })
        expect(result.success).toBe(false)
        if (result.success) {
          throw new Error('Expected failure')
        }
        const messages = result.error.issues.map(i => i.message)
        expect(messages).toContain('Alamat pengiriman lengkap wajib diisi')
      })

      it('rejects missing customerName in DELIVERY mode', () => {
        const result = FulfillmentSchema.safeParse({
          address: 'Jl. Dipati Ukur No. 10',
          customerName: '  ',
          mode: 'DELIVERY',
        })
        expect(result.success).toBe(false)
        if (result.success) {
          throw new Error('Expected failure')
        }
        const messages = result.error.issues.map(i => i.message)
        expect(messages).toContain('Nama pemesan wajib diisi')
      })
    })

    it('rejects DELIVERY with completely missing address', () => {
      const result = FulfillmentSchema.safeParse({
        customerName: 'Dewi Lestari',
        mode: 'DELIVERY',
      })
      expect(result.success).toBe(false)
    })

    it('rejects unrecognized fulfillment mode', () => {
      const result = FulfillmentSchema.safeParse({
        customerName: 'Test Customer',
        mode: 'DRIVE_THRU',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('buildOrderSummary', () => {
    const mockTenant = {
      name: 'Kopi Artisan Nusantara',
      phone: '081234567890',
      waNumber: '6281234567890',
    }

    const mockCartItems: CartLineItem[] = [
      {
        id: 'hash-1',
        name: 'Kopi Susu Aren',
        basePrice: 20000,
        notes: 'Jangan terlalu manis',
        productId: 'prod-1',
        quantity: 2,
        selectedAddons: ['Extra Shot', 'Oat Milk'],
        subtotal: 54000,
        selectedVariants: {
          Suhu: 'Less Ice',
          Ukuran: 'Large',
        },
      },
      {
        id: 'hash-2',
        name: 'Croissant Butter',
        basePrice: 18000,
        productId: 'prod-2',
        quantity: 1,
        selectedAddons: [],
        selectedVariants: {},
        subtotal: 18000,
      },
    ]

    it('compiles order summary message and wa.me URL for DINE_IN fulfillment', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Budi Hartono',
        mode: 'DINE_IN',
        tableNumber: 'Meja 05',
      }

      const { message, waUrl } = buildOrderSummary({
        cartItems: mockCartItems,
        fulfillment,
        tenant: mockTenant,
      })

      // Verification of greeting
      expect(message).toContain('Halo Kopi Artisan Nusantara, saya ingin memesan:')

      // Verification of items, quantity, variants, addons, notes, and subtotal
      expect(message).toContain('1. *Kopi Susu Aren* (x2)')
      expect(message).toContain('Ukuran: Large')
      expect(message).toContain('Suhu: Less Ice')
      expect(message).toContain('Extra Shot, Oat Milk')
      expect(message).toContain('Jangan terlalu manis')
      expect(message).toContain('Rp 54.000')

      expect(message).toContain('2. *Croissant Butter* (x1)')
      expect(message).toContain('Rp 18.000')

      // Verification of total (54000 + 18000 = 72000)
      expect(message).toContain('Total: Rp 72.000')

      // Verification of fulfillment details
      expect(message).toContain('Nama: Budi Hartono')
      expect(message).toContain('Meja 05')

      // Verification of wa.me URL
      expect(waUrl.startsWith('https://wa.me/6281234567890?text=')).toBe(true)
      const decodedParam = decodeURIComponent(
        waUrl.replace('https://wa.me/6281234567890?text=', ''),
      )
      expect(decodedParam).toBe(message)
    })

    it('compiles order summary for TAKEAWAY fulfillment', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Siti Aminah',
        mode: 'TAKEAWAY',
      }

      const { message, waUrl } = buildOrderSummary({
        cartItems: [mockCartItems[0]],
        fulfillment,
        tenant: mockTenant,
      })

      expect(message).toContain('Nama: Siti Aminah')
      expect(message).toMatch(/Takeaway|Bungkus/i)
      expect(waUrl).toContain('https://wa.me/6281234567890?text=')
    })

    it('includes pickup preferences in TAKEAWAY order summary when present', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Siti Aminah',
        mode: 'TAKEAWAY',
        pickupPreferences: 'Bungkus terpisah ya',
      }

      const { message } = buildOrderSummary({
        cartItems: [mockCartItems[0]],
        fulfillment,
        tenant: mockTenant,
      })

      expect(message).toContain('Preferensi: Bungkus terpisah ya')
    })

    it('includes pickup preferences in PICKUP order summary when present', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Ferry Salim',
        mode: 'PICKUP',
        pickupPreferences: 'Ambil sore jam 17:00',
      }

      const { message } = buildOrderSummary({
        cartItems: [mockCartItems[0]],
        fulfillment,
        tenant: mockTenant,
      })

      expect(message).toContain('Preferensi: Ambil sore jam 17:00')
    })

    it('compiles order summary for PICKUP fulfillment', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Ferry Salim',
        mode: 'PICKUP',
      }

      const { message, waUrl } = buildOrderSummary({
        cartItems: [mockCartItems[0]],
        fulfillment,
        tenant: mockTenant,
      })

      expect(message).toContain('Nama: Ferry Salim')
      expect(message).toMatch(/Pickup|Ambil/i)
      expect(waUrl).toContain('https://wa.me/6281234567890?text=')
    })

    it('compiles order summary for DELIVERY fulfillment with delivery address', () => {
      const fulfillment: FulfillmentInput = {
        address: 'Jl. Surya Sumantri No. 88, Sukajadi',
        customerName: 'Rina Nose',
        mode: 'DELIVERY',
      }

      const { message, waUrl } = buildOrderSummary({
        cartItems: mockCartItems,
        fulfillment,
        tenant: mockTenant,
      })

      expect(message).toContain('Nama: Rina Nose')
      expect(message).toContain('Jl. Surya Sumantri No. 88, Sukajadi')
      expect(message).toMatch(/Delivery|Kirim/i)
      expect(waUrl).toContain('https://wa.me/6281234567890?text=')
    })

    it('falls back to tenant.phone if tenant.waNumber is undefined', () => {
      const fulfillment: FulfillmentData = {
        customerName: 'Anton',
        mode: 'TAKEAWAY',
      }

      const { waUrl } = buildOrderSummary({
        cartItems: [],
        fulfillment,
        tenant: {
          name: 'Warung Bu Joko',
          phone: '0856-7890-1234',
        },
      })

      expect(waUrl.startsWith('https://wa.me/6285678901234?text=')).toBe(true)
    })

    it('handles empty cart gracefully with 0 total', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Test Empty',
        mode: 'TAKEAWAY',
      }

      const { message, waUrl } = buildOrderSummary({
        cartItems: [],
        fulfillment,
        tenant: mockTenant,
      })

      expect(message).toContain('Total: Rp 0')
      expect(waUrl).toContain('https://wa.me/6281234567890?text=')
    })

    it('handles tenant with neither waNumber nor phone gracefully', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'No Contact',
        mode: 'TAKEAWAY',
      }

      const { waUrl } = buildOrderSummary({
        cartItems: [],
        fulfillment,
        tenant: {
          name: 'Toko Offline',
        },
      })

      expect(waUrl.startsWith('https://wa.me/?text=')).toBe(true)
    })

    it('omits notes line when customer notes are whitespace-only', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Dewi',
        mode: 'TAKEAWAY',
      }

      const { message } = buildOrderSummary({
        fulfillment,
        tenant: mockTenant,
        cartItems: [
          {
            id: 'h1',
            name: 'Kopi',
            notes: '    ',
            productId: 'p1',
            quantity: 1,
            subtotal: 15000,
          },
        ],
      })

      expect(message).not.toContain('Catatan:')
    })

    it('handles cart item with missing or non-number subtotal', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Dewi',
        mode: 'TAKEAWAY',
      }

      const { message } = buildOrderSummary({
        fulfillment,
        tenant: mockTenant,
        cartItems: [
          {
            id: 'h1',
            name: 'Kopi',
            productId: 'p1',
            quantity: 1,
            subtotal: undefined as unknown as number,
          },
        ],
      })

      expect(message).toContain('Total: Rp 0')
    })

    it('supports positional call buildOrderSummary(cartItems, fulfillment, tenant)', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Budi Hartono',
        mode: 'TAKEAWAY',
      }

      const { message, waUrl } = buildOrderSummary(mockCartItems, fulfillment, mockTenant)

      expect(message).toContain('Halo Kopi Artisan Nusantara, saya ingin memesan:')
      expect(message).toContain('*Kopi Susu Aren* (x2)')
      expect(message).toContain('*Croissant Butter* (x1)')
      expect(message).toContain('Total: Rp 72.000')
      expect(message).toContain('Metode: Takeaway (Bungkus)')
      expect(waUrl).toContain('https://wa.me/6281234567890?text=')
    })

    it('supports positional call with cart state object { items: CartLineItem[] }', () => {
      const fulfillment: FulfillmentInput = {
        customerName: 'Siti Rahma',
        mode: 'PICKUP',
      }

      const { message, waUrl } = buildOrderSummary(
        { items: mockCartItems },
        fulfillment,
        mockTenant,
      )

      expect(message).toContain('Total: Rp 72.000')
      expect(message).toContain('Metode: Pickup (Ambil Sendiri)')
      expect(waUrl).toContain('https://wa.me/6281234567890?text=')
    })

    it('supports single-object call with items alias { items, fulfillment, tenant }', () => {
      const fulfillment: FulfillmentInput = {
        address: 'Jl. Merdeka No. 10',
        customerName: 'Agus Pratama',
        mode: 'DELIVERY',
      }

      const { message, waUrl } = buildOrderSummary({
        fulfillment,
        items: mockCartItems,
        tenant: mockTenant,
      })

      expect(message).toContain('Total: Rp 72.000')
      expect(message).toContain('Metode: Delivery (Pengiriman)')
      expect(message).toContain('Alamat: Jl. Merdeka No. 10')
      expect(waUrl).toContain('https://wa.me/6281234567890?text=')
    })
  })
})

describe('resolveTenantWhatsAppNumber', () => {
  it('resolves normalized number from branding socialLinks.whatsapp.url', () => {
    const tenant = {
      phone: '08999999999',
      brandingContent: {
        socialLinks: {
          whatsapp: { url: '081234567890' },
        },
      },
    }
    expect(resolveTenantWhatsAppNumber(tenant)).toBe('6281234567890')
  })

  it('resolves normalized number from branding.waNumber', () => {
    const tenant = {
      phone: '08999999999',
      brandingContent: {
        waNumber: '+62 812-3456-7890',
      },
    }
    expect(resolveTenantWhatsAppNumber(tenant)).toBe('6281234567890')
  })

  it('falls back to tenant.phone when branding lacks WhatsApp info', () => {
    const tenant = {
      phone: '081234567890',
    }
    expect(resolveTenantWhatsAppNumber(tenant)).toBe('6281234567890')
  })

  it('returns empty string when tenant is null or has no contact info', () => {
    expect(resolveTenantWhatsAppNumber(null)).toBe('')
    expect(resolveTenantWhatsAppNumber({})).toBe('')
  })
})
