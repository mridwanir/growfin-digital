import type { MenuItem, MenuItemVariant, SpecificationItem, VariantOption } from './types'

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
 * Normalizes product metadata, guaranteeing structured VariantOption[] inside variants, parsed
 * numeric originalPrice (or undefined), and sanitized imageGallery/specifications.
 */
function parseProductStock(stockVal: unknown): number | undefined {
  if (typeof stockVal === 'number' && Number.isFinite(stockVal)) return stockVal
  if (typeof stockVal === 'string' && stockVal.trim() !== '') {
    const num = Number(stockVal)
    if (Number.isFinite(num)) return num
  }
  return undefined
}

function parseProductGallery(gallery: unknown): string[] | undefined {
  if (!Array.isArray(gallery)) return undefined
  return gallery
    .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    .slice(0, 5)
}

function parseProductVariants(variants: unknown): MenuItemVariant[] | undefined {
  if (!Array.isArray(variants)) return undefined
  return variants.map(v => ({
    name: String(v.name || '').trim(),
    options: Array.isArray(v.options) ? v.options.map(normalizeVariantOption) : [],
  }))
}

export function normalizeProduct(item: Partial<MenuItem> | null | undefined): MenuItem {
  const base = item || {}
  const originalPrice = parseNumericPrice(base.originalPrice)
  const stock = parseProductStock(base.stock)
  const imageGallery = parseProductGallery(base.imageGallery)
  const specifications = Array.isArray(base.specifications)
    ? getValidSpecifications(base.specifications)
    : undefined
  const variants = parseProductVariants(base.variants)

  return {
    id: typeof base.id === 'number' ? base.id : Number(base.id) || 0,
    name: String(base.name || ''),
    desc: String(base.desc || ''),
    price: base.price !== undefined ? String(base.price) : '0',
    ...(originalPrice !== undefined ? { originalPrice } : {}),
    ...(stock !== undefined ? { stock } : {}),
    ...(imageGallery !== undefined ? { imageGallery } : {}),
    ...(specifications !== undefined ? { specifications } : {}),
    ...(base.tag !== undefined ? { tag: base.tag } : {}),
    ...(base.category !== undefined ? { category: base.category } : {}),
    ...(base.imageUrl !== undefined ? { imageUrl: base.imageUrl } : {}),
    ...(base.imagePublicId !== undefined ? { imagePublicId: base.imagePublicId } : {}),
    ...(base.duration !== undefined ? { duration: base.duration } : {}),
    ...(variants !== undefined ? { variants } : {}),
    ...(base.addons !== undefined ? { addons: base.addons } : {}),
  }
}

/**
 * Calculates item subtotal price using pure numeric addition.
 */
export function calculateItemPrice(
  basePrice: number | string,
  selectedVariants: (VariantOption | string)[] = [],
  selectedAddons: { price: number }[] = [],
): number {
  const base = parseNumericPrice(basePrice) ?? 0

  const variantSum = (selectedVariants || []).reduce((acc, opt) => {
    const normalized = normalizeVariantOption(opt)
    return acc + (Number(normalized.priceModifier) || 0)
  }, 0)

  const addonSum = (selectedAddons || []).reduce((acc, addon) => {
    return acc + (Number(addon?.price) || 0)
  }, 0)

  const total = Math.round(base + variantSum + addonSum)
  return total < 0 ? 0 : total
}

/**
 * Determines whether a valid strikethrough discount exists. Returns true ONLY when originalPrice >
 * price.
 */
export function hasValidDiscount(price: number | string, originalPrice?: number | string): boolean {
  const curr = parseNumericPrice(price)
  const orig = parseNumericPrice(originalPrice)

  if (curr === undefined || orig === undefined) {
    return false
  }

  return orig > curr
}

/**
 * Calculates discount percentage rounded to whole integer. Returns 0 if hasValidDiscount is false.
 */
export function getDiscountPercentage(
  price: number | string,
  originalPrice?: number | string,
): number {
  if (!hasValidDiscount(price, originalPrice)) {
    return 0
  }

  const curr = parseNumericPrice(price)!
  const orig = parseNumericPrice(originalPrice)!

  if (orig <= 0) {
    return 0
  }

  return Math.round(((orig - curr) / orig) * 100)
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
  const safeVariants = selectedVariants || {}
  const sortedVariantKeys = Object.keys(safeVariants).sort()

  const variantSegments = sortedVariantKeys.map(key => {
    const val = safeVariants[key]
    const normalized = normalizeVariantOption(val)
    return `${key}:${normalized.label}:${normalized.priceModifier}`
  })

  const safeAddons = Array.isArray(selectedAddons) ? selectedAddons : []
  const sortedAddons = [...safeAddons].map(a => String(a).trim()).sort()

  return `${String(productId)}::variants=[${variantSegments.join(',')}]::addons=[${sortedAddons.join(',')}]`
}

/**
 * Formats a variant option for display in UI or WhatsApp receipt, cleanly itemizing surcharges only
 * when priceModifier > 0. Examples:
 *
 * - "Ukuran: Regular" (for priceModifier <= 0)
 * - "Ukuran: Large (+Rp 5.000)" (for priceModifier > 0)
 */
export function formatVariantOptionDisplay(
  variantName: string,
  option: string | VariantOption | null | undefined,
): string {
  if (!option) {
    return variantName
  }
  const normalized = normalizeVariantOption(option)
  if (!normalized.label) {
    return variantName
  }
  if (normalized.priceModifier > 0) {
    return `${variantName}: ${normalized.label} (+Rp ${normalized.priceModifier.toLocaleString('id-ID')})`
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
  const safeVariants = selectedVariants || {}
  const entries = Object.entries(safeVariants)
  if (entries.length === 0) return ''
  return entries.map(([k, v]) => formatVariantOptionDisplay(k, v)).join(', ')
}

/**
 * Stacks quantity and total price if an item with matching id/hash already exists in the cart;
 * otherwise appends as a new line item.
 */
export function stackCartItem<T extends { id: string; quantity: number; totalPrice: number }>(
  cart: T[],
  item: T,
): T[] {
  const existingIndex = cart.findIndex(i => i.id === item.id)
  if (existingIndex >= 0) {
    return cart.map((i, idx) =>
      idx === existingIndex
        ? {
            ...i,
            quantity: i.quantity + item.quantity,
            totalPrice: i.totalPrice + item.totalPrice,
          }
        : i,
    )
  }
  return [...cart, item]
}

/**
 * Extracts gallery image URLs from a product item up to 5 photos. Falls back to product.imageUrl,
 * then fallbackImage, or empty array.
 */
export function getProductGalleryImages(
  product?: Partial<MenuItem> | null,
  fallbackImage?: string,
): string[] {
  if (!product && !fallbackImage) {
    return []
  }

  if (product && Array.isArray(product.imageGallery)) {
    const valid = product.imageGallery
      .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
      .slice(0, 5)
    if (valid.length > 0) {
      return valid
    }
  }

  if (
    product?.imageUrl &&
    typeof product.imageUrl === 'string' &&
    product.imageUrl.trim().length > 0
  ) {
    return [product.imageUrl.trim()]
  }

  if (fallbackImage && typeof fallbackImage === 'string' && fallbackImage.trim().length > 0) {
    return [fallbackImage.trim()]
  }

  return []
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

/**
 * Checks whether a product has at least one valid specification row.
 */
export function hasSpecifications(product?: Partial<MenuItem> | null): boolean {
  if (!product || !product.specifications) {
    return false
  }
  return getValidSpecifications(product.specifications).length > 0
}

/**
 * Normalizes an AI-generated or inbound metadata payload, ensuring:
 *
 * 1. Reviews have valid integer ratings clamped between 1 and 5.
 * 2. Menu/products items are unified under `metadata.menu` and each product is fully normalized via
 *    `normalizeProduct`.
 */
export function normalizeGeneratedMetadata<T extends Record<string, unknown>>(
  metadata: T | null | undefined,
): T & { menu: MenuItem[] } {
  const result: Record<string, unknown> =
    metadata && typeof metadata === 'object' ? { ...metadata } : {}

  if (Array.isArray(result.reviews)) {
    result.reviews = result.reviews.map(rev => {
      if (rev && typeof rev === 'object') {
        const ratingCandidate = 'rating' in rev ? rev.rating : 5
        const ratingNum = Number(ratingCandidate)
        const safeRating = Number.isFinite(ratingNum) ? Math.round(ratingNum) : 5
        return {
          ...rev,
          rating: Math.max(1, Math.min(5, safeRating)),
        }
      }
      return rev
    })
  }

  const rawMenu = Array.isArray(result.menu)
    ? result.menu
    : Array.isArray(result.products)
      ? result.products
      : null

  result.menu = rawMenu
    ? rawMenu.map(item =>
        item && typeof item === 'object'
          ? normalizeProduct(item as Partial<MenuItem>)
          : normalizeProduct({}),
      )
    : []

  return result as unknown as T & { menu: MenuItem[] }
}
export { sanitizeMenuItem, sanitizeMenuItems, type TierSanitizerOptions } from './tier-sanitizer'
