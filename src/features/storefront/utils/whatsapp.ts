import type { CartLineItem } from '../cart/domain'

import { z } from 'zod'

import { formatCurrency } from '../cart/domain'

/**
 * Normalizes phone numbers to international WhatsApp format without leading + sign or punctuation.
 * Converts local Indonesian formats (08..., +628..., 628..., +62 08...) to clean 628...
 * click-to-chat format.
 */
export function normalizeWaNumber(phone?: string | null): string {
  if (!phone) return ''
  let digits = phone.replace(/\D/g, '')
  if (!digits) return ''

  // Edge case: redundant 0 following Indonesian country code (+62 08...)
  if (digits.startsWith('620')) {
    digits = `62${digits.slice(3)}`
  } else if (digits.startsWith('0')) {
    digits = `62${digits.slice(1)}`
  } else if (digits.startsWith('8')) {
    digits = `62${digits}`
  }

  return digits
}

/**
 * Resolves and normalizes a tenant's WhatsApp contact number from branding content, explicit
 * waNumber, or fallback phone number.
 */
export function resolveTenantWhatsAppNumber(
  tenant?: {
    brandingContent?: unknown
    phone?: string | null
    waNumber?: string | null
  } | null,
): string {
  if (!tenant) return ''
  const branding = (tenant.brandingContent as Record<string, unknown> | null) || {}
  const socialLinks = branding.socialLinks as Record<string, { url?: string }> | undefined
  const rawWa =
    socialLinks?.whatsapp?.url ||
    (branding.waNumber as string | undefined) ||
    (branding['waNumber'] as string | undefined) ||
    tenant.waNumber ||
    tenant.phone ||
    ''
  return normalizeWaNumber(rawWa)
}

/**
 * Strict Zod discriminated union schema for storefront checkout fulfillment details. Supports
 * DINE_IN, TAKEAWAY, PICKUP, and DELIVERY modes.
 */
export const FulfillmentSchema = z.discriminatedUnion('mode', [
  z.object({
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
    mode: z.literal('DINE_IN'),
    tableNumber: z.string().trim().min(1, 'Nomor meja wajib diisi'),
  }),
  z.object({
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
    mode: z.literal('TAKEAWAY'),
    pickupPreferences: z.string().trim().optional(),
  }),
  z.object({
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
    mode: z.literal('PICKUP'),
    pickupPreferences: z.string().trim().optional(),
  }),
  z.object({
    address: z.string().trim().min(5, 'Alamat pengiriman lengkap wajib diisi'),
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
    mode: z.literal('DELIVERY'),
  }),
])

export type FulfillmentInput = z.infer<typeof FulfillmentSchema>
export type FulfillmentData = FulfillmentInput

export interface TenantContactInfo {
  name: string
  phone?: string | null
  waNumber?: string | null
}

export interface BuildOrderSummaryParams {
  cartItems?: CartLineItem[]
  items?: CartLineItem[]
  fulfillment: FulfillmentInput
  tenant: TenantContactInfo
}

export type CartInput = CartLineItem[] | { items: CartLineItem[] } | { cartItems: CartLineItem[] }

/**
 * Compiles a formatted multi-line WhatsApp order summary and encodes a click-to-chat wa.me URL.
 * Supports both positional buildOrderSummary(cart, fulfillment, tenant) and single-object
 * buildOrderSummary({ cartItems, fulfillment, tenant }).
 */
export function buildOrderSummary(params: BuildOrderSummaryParams): {
  message: string
  waUrl: string
}
export function buildOrderSummary(
  cart: CartInput,
  fulfillment: FulfillmentInput,
  tenant: TenantContactInfo,
): { message: string; waUrl: string }
export function buildOrderSummary(
  first: BuildOrderSummaryParams | CartInput,
  second?: FulfillmentInput,
  third?: TenantContactInfo,
): { message: string; waUrl: string } {
  const { cartItems, fulfillment, tenant } = resolveOrderSummaryArgs(first, second, third)
  const lines: string[] = [`Halo ${tenant.name}, saya ingin memesan:`, '']

  let orderTotal = 0

  if (cartItems.length > 0) {
    cartItems.forEach((item, idx) => {
      const itemSubtotal = typeof item.subtotal === 'number' ? item.subtotal : 0
      orderTotal += itemSubtotal

      lines.push(`${idx + 1}. *${item.name}* (x${item.quantity})`)

      const variantEntries = Object.entries(item.selectedVariants || {})
      if (variantEntries.length > 0) {
        const variantsText = variantEntries.map(([k, v]) => `${k}: ${v}`).join(', ')
        lines.push(`   Variasi: ${variantsText}`)
      }

      if (item.selectedAddons && item.selectedAddons.length > 0) {
        lines.push(`   Tambahan: ${item.selectedAddons.join(', ')}`)
      }

      if (item.notes && item.notes.trim().length > 0) {
        lines.push(`   Catatan: ${item.notes.trim()}`)
      }

      lines.push(`   Subtotal: ${formatCurrency(itemSubtotal)}`, '')
    })
  }

  lines.push(`*Total: ${formatCurrency(orderTotal)}*`, '', ...formatFulfillmentLines(fulfillment))

  const message = lines.join('\n')
  const rawPhone = tenant.waNumber || tenant.phone || ''
  const normalizedPhone = normalizeWaNumber(rawPhone)
  const encodedText = encodeURIComponent(message)
  const waUrl = normalizedPhone
    ? `https://wa.me/${normalizedPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`

  return { message, waUrl }
}

function resolveOrderSummaryArgs(
  first: BuildOrderSummaryParams | CartInput,
  second?: FulfillmentInput,
  third?: TenantContactInfo,
): { cartItems: CartLineItem[]; fulfillment: FulfillmentInput; tenant: TenantContactInfo } {
  if (second !== undefined && third !== undefined) {
    let cartItems: CartLineItem[] = []
    if (Array.isArray(first)) {
      cartItems = first
    } else if (first && typeof first === 'object') {
      const candidate = first as Record<string, unknown>
      if (Array.isArray(candidate.cartItems)) {
        cartItems = candidate.cartItems as CartLineItem[]
      } else if (Array.isArray(candidate.items)) {
        cartItems = candidate.items as CartLineItem[]
      }
    }
    return { cartItems, fulfillment: second, tenant: third }
  }

  const obj = first as BuildOrderSummaryParams
  return {
    cartItems: obj.cartItems ?? obj.items ?? [],
    fulfillment: obj.fulfillment,
    tenant: obj.tenant,
  }
}

function formatFulfillmentLines(fulfillment: FulfillmentInput): string[] {
  const lines: string[] = ['*Data Pemesan:*', `- Nama: ${fulfillment.customerName}`]

  switch (fulfillment.mode) {
    case 'DINE_IN':
      lines.push('- Metode: Dine In (Makan di Tempat)', `- No. Meja: ${fulfillment.tableNumber}`)
      break
    case 'TAKEAWAY':
      lines.push('- Metode: Takeaway (Bungkus)')
      if (fulfillment.pickupPreferences && fulfillment.pickupPreferences.trim().length > 0) {
        lines.push(`- Preferensi: ${fulfillment.pickupPreferences.trim()}`)
      }
      break
    case 'PICKUP':
      lines.push('- Metode: Pickup (Ambil Sendiri)')
      if (fulfillment.pickupPreferences && fulfillment.pickupPreferences.trim().length > 0) {
        lines.push(`- Preferensi: ${fulfillment.pickupPreferences.trim()}`)
      }
      break
    case 'DELIVERY':
      lines.push('- Metode: Delivery (Pengiriman)', `- Alamat: ${fulfillment.address}`)
      break
  }

  return lines
}
