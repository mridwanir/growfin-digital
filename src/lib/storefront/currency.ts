/**
 * Canonical Indonesian Rupiah (IDR) currency formatting and discount calculations.
 */

export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) {
    return 'Rp 0'
  }
  const isNegative = amount < 0
  const absoluteValue = Math.abs(Math.round(amount))
  const formatted = absoluteValue.toLocaleString('id-ID')
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`
}

export function hasValidDiscount(
  price: number | null | undefined,
  originalPrice?: number | null | undefined,
): boolean {
  if (price == null || originalPrice == null) return false
  if (!Number.isFinite(price) || !Number.isFinite(originalPrice)) return false
  return originalPrice > price
}

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
