/**
 * Pure domain module for storefront shopping carts.
 * Decoupled from React UI components, DOM, and browser storage APIs.
 */

export interface CartLineItem {
  id: string
  productId: string
  name: string
  basePrice?: number
  quantity: number
  selectedVariants?: Record<string, string>
  selectedAddons?: string[]
  notes?: string
  subtotal: number
}

/**
 * Calculates item subtotal price using integer IDR arithmetic.
 * Formula: subtotal = (basePrice + sum(variantModifiers) + sum(addons)) * quantity
 * Clamps result to 0 when negative modifiers exceed base price or quantity is <= 0.
 */
export function calculateItemSubtotal(
  basePrice: number,
  variantModifiers: number[] = [],
  addons: { price: number }[] = [],
  quantity: number = 1,
): number {
  if (quantity <= 0) {
    return 0
  }

  const safeBase = Number.isFinite(basePrice) ? basePrice : 0
  const variantSum = (variantModifiers || []).reduce(
    (acc, mod) => acc + (Number.isFinite(mod) ? mod : 0),
    0,
  )
  const addonSum = (addons || []).reduce(
    (acc, addon) => acc + (Number.isFinite(addon?.price) ? addon.price : 0),
    0,
  )

  const unitPrice = safeBase + variantSum + addonSum
  if (unitPrice <= 0) {
    return 0
  }

  return Math.round(unitPrice * quantity)
}

/**
 * Generates a deterministic composite hash for cart item deduplication and stacking.
 * Sorts variant keys and addon names to ensure identical configurations stack
 * quantities while distinct configurations remain separate line items.
 */
export function buildCartItemHash(
  productId: string,
  selectedVariants: Record<string, string> = {},
  selectedAddons: string[] = [],
): string {
  const safeVariants = selectedVariants || {}
  const sortedVariantKeys = Object.keys(safeVariants).sort()
  const variantSegments = sortedVariantKeys.map(key => `${key}:${safeVariants[key]}`)

  const safeAddons = Array.isArray(selectedAddons) ? selectedAddons : []
  const sortedAddons = [...safeAddons].map(a => String(a).trim()).sort()

  return `${String(productId)}::variants=[${variantSegments.join(',')}]::addons=[${sortedAddons.join(',')}]`
}

/**
 * Formats an integer Indonesian Rupiah price into a standard display string (e.g. "Rp 25.000").
 * Preserves integer pricing invariants throughout domain math and formats only at the leaf.
 */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return 'Rp 0'
  const isNegative = amount < 0
  const absoluteValue = Math.abs(Math.round(amount))
  const formatted = absoluteValue.toLocaleString('id-ID')
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`
}
