import type { SpecificationItem, VariantOption } from './types'

/**
 * Normalizes a variant option which may be either a structured VariantOption or a legacy formatted
 * string (e.g. "Large (+Rp 5.000)").
 */
export function normalizeVariantOption(
  opt: string | VariantOption | null | undefined,
): VariantOption {
  if (!opt) {
    return { label: '', priceModifier: 0 }
  }

  if (typeof opt === 'object') {
    return {
      label: (opt.label || '').trim(),
      priceModifier: Number(opt.priceModifier) || 0,
    }
  }

  const str = String(opt).trim()
  const match = str.match(/\(\s*([+-])?\s*(?:Rp\.?\s*)?([\d.,]+)\s*\)/i)

  if (match) {
    const sign = match[1] === '-' ? -1 : 1
    const digits = match[2].replace(/[.,]/g, '')
    const num = Number(digits) || 0
    const label = str.replace(/\s*\([^)]*[\d.,]+[^)]*\)/, '').trim()

    return {
      label,
      priceModifier: sign * num,
    }
  }

  return {
    label: str,
    priceModifier: 0,
  }
}

/**
 * Safely parses integer Rupiah price from number or formatted string.
 */
export function parseNumericPrice(val: number | string | null | undefined): number | undefined {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? Math.round(val) : undefined
  }
  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (!trimmed) return undefined
    const digits = trimmed.replace(/\D/g, '')
    if (!digits) return undefined
    const num = Number.parseInt(digits, 10)
    return Number.isFinite(num) ? num : undefined
  }
  return undefined
}

/**
 * Calculates item subtotal price using pure numeric addition.
 */
export function calculateItemPrice(
  basePrice: number | string,
  selectedVariants: (VariantOption | string)[] = [],
  selectedAddons: { price: number }[] = [],
): number {
  const parsedBase = parseNumericPrice(basePrice) || 0

  const variantSum = selectedVariants.reduce((sum, v) => {
    const opt = normalizeVariantOption(v)
    return sum + (opt.priceModifier || 0)
  }, 0)

  const addonSum = selectedAddons.reduce((sum, a) => {
    return sum + (Number(a.price) || 0)
  }, 0)

  return Math.max(0, parsedBase + variantSum + addonSum)
}

/**
 * Determines whether a valid strikethrough discount exists. Returns true ONLY when originalPrice >
 * price.
 */
export function hasValidDiscount(price: number | string, originalPrice?: number | string): boolean {
  const p = parseNumericPrice(price)
  const op = parseNumericPrice(originalPrice)
  if (p === undefined || op === undefined) return false
  return op > p
}

/**
 * Calculates discount percentage rounded to whole integer. Returns 0 if hasValidDiscount is false.
 */
export function getDiscountPercentage(
  price: number | string,
  originalPrice?: number | string,
): number {
  if (!hasValidDiscount(price, originalPrice)) return 0
  const p = parseNumericPrice(price)!
  const op = parseNumericPrice(originalPrice)!
  return Math.round(((op - p) / op) * 100)
}

/**
 * Generates a deterministic composite hash for cart deduplication. Sorts variant keys and addon
 * items alphabetically.
 */
export function buildCartItemHash(
  productId: number | string,
  selectedVariants: Record<string, string | VariantOption> = {},
  selectedAddons: string[] = [],
): string {
  const sortedVariants = Object.keys(selectedVariants)
    .sort()
    .map(key => {
      const val = selectedVariants[key]
      const label = typeof val === 'object' && val !== null ? val.label : String(val)
      return `${key}:${label}`
    })
    .join('|')

  const sortedAddons = [...selectedAddons].sort().join('|')

  return `${productId}__vars:${sortedVariants}__addons:${sortedAddons}`
}

/**
 * Formats a variant option for display in UI or WhatsApp receipt, cleanly itemizing surcharges only
 * when non-zero.
 */
export function formatVariantOptionDisplay(
  variantName: string,
  option: string | VariantOption | null | undefined,
): string {
  const normalized = normalizeVariantOption(option)
  if (!normalized.label) return ''

  if (normalized.priceModifier > 0) {
    const formattedPrice = `Rp ${normalized.priceModifier.toLocaleString('id-ID')}`
    return `${variantName}: ${normalized.label} (+${formattedPrice})`
  }

  if (normalized.priceModifier < 0) {
    const formattedPrice = `Rp ${Math.abs(normalized.priceModifier).toLocaleString('id-ID')}`
    return `${variantName}: ${normalized.label} (-${formattedPrice})`
  }

  return `${variantName}: ${normalized.label}`
}

/**
 * Formats a map of selected variant options into a clean, comma-separated line for WhatsApp orders
 * or cart summaries.
 */
export function formatVariantReceiptLine(
  selectedVariants: Record<string, string | VariantOption> = {},
): string {
  const lines = Object.entries(selectedVariants)
    .map(([key, val]) => formatVariantOptionDisplay(key, val))
    .filter(Boolean)

  return lines.join(', ')
}

/**
 * Stacks quantity and total price if an item with matching id/hash already exists in the cart;
 * otherwise appends as a new line item.
 */
export function stackCartItem<T extends { id: string; quantity: number; totalPrice: number }>(
  cart: T[],
  item: T,
): T[] {
  const existingIndex = cart.findIndex(c => c.id === item.id)

  if (existingIndex >= 0) {
    const updated = [...cart]
    const existing = updated[existingIndex]
    updated[existingIndex] = {
      ...existing,
      quantity: existing.quantity + item.quantity,
      totalPrice: existing.totalPrice + item.totalPrice,
    }
    return updated
  }

  return [...cart, { ...item }]
}

/**
 * Sanitizes and validates a list of specification items, filtering out rows with empty labels or
 * empty values.
 */
export function getValidSpecifications(
  specifications?: SpecificationItem[] | { label?: unknown; value?: unknown }[] | null,
): SpecificationItem[] {
  if (!Array.isArray(specifications)) {
    return []
  }

  return specifications
    .map(s => ({
      label: String(s?.label ?? '').trim(),
      value: String(s?.value ?? '').trim(),
    }))
    .filter(s => s.label.length > 0 && s.value.length > 0)
}
