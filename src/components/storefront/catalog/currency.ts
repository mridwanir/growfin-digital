/**
 * Pure integer currency formatting and discount calculation in Indonesian Rupiah (IDR).
 */

/**
 * Formats an integer amount (in IDR) into a storefront currency display string. Examples: 25000 ->
 * "Rp 25.000", -5000 -> "-Rp 5.000", 0 -> "Rp 0"
 */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return 'Rp 0'
  const isNegative = amount < 0
  const absoluteValue = Math.abs(Math.round(amount))
  const formatted = absoluteValue.toLocaleString('id-ID')
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`
}

/**
 * Determines whether a valid strikethrough discount exists. Returns true ONLY when originalPrice >
 * price and both are valid positive numbers.
 */
export function hasValidDiscount(
  price: number | null | undefined,
  originalPrice?: number | null | undefined,
): boolean {
  if (price == null || originalPrice == null) return false
  if (!Number.isFinite(price) || !Number.isFinite(originalPrice)) return false
  return originalPrice > price
}

/**
 * Calculates discount percentage rounded to whole integer. Returns 0 if hasValidDiscount is false.
 */
export function getDiscountPercentage(
  price: number | null | undefined,
  originalPrice?: number | null | undefined,
): number {
  if (!hasValidDiscount(price, originalPrice)) return 0
  const p = price as number
  const orig = originalPrice as number
  if (orig <= 0) return 0
  return Math.round(((orig - p) / orig) * 100)
}
