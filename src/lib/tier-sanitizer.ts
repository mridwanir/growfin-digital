import type { MenuItem, MenuItemVariant, SpecificationItem } from './types'

import { normalizeVariantOption } from './catalog'

export interface TierSanitizerOptions {
  advancedVariants?: boolean
}

function sanitizeVariants(
  variants: MenuItem['variants'],
  allowAdvanced: boolean,
): MenuItemVariant[] | undefined {
  if (!Array.isArray(variants)) return undefined
  return variants.map(v => ({
    name: String(v.name || '').trim(),
    options: Array.isArray(v.options)
      ? v.options.map(opt => {
          const normalized = normalizeVariantOption(opt)
          return {
            label: normalized.label,
            priceModifier: allowAdvanced ? normalized.priceModifier : 0,
          }
        })
      : [],
  }))
}

function sanitizeGallery(
  gallery: string[] | undefined,
  allowAdvanced: boolean,
): string[] | undefined {
  if (!allowAdvanced || !Array.isArray(gallery)) return undefined
  return gallery
    .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    .slice(0, 5)
}

function sanitizeSpecs(
  specs: SpecificationItem[] | undefined,
  allowAdvanced: boolean,
): SpecificationItem[] | undefined {
  if (!allowAdvanced || !Array.isArray(specs)) return undefined
  return specs.map(s => ({
    label: String(s.label || '').trim(),
    value: String(s.value || '').trim(),
  }))
}

/**
 * Sanitizes a single menu item based on tenant tier limits.
 */
export function sanitizeMenuItem(
  item: Partial<MenuItem> | MenuItem,
  options: TierSanitizerOptions,
): MenuItem {
  const base = item || {}
  const allowAdvanced = Boolean(options.advancedVariants)

  const variants = sanitizeVariants(base.variants, allowAdvanced)
  const imageGallery = sanitizeGallery(base.imageGallery, allowAdvanced)
  const specifications = sanitizeSpecs(base.specifications, allowAdvanced)

  return {
    id: typeof base.id === 'number' ? base.id : Number(base.id) || 0,
    name: String(base.name || ''),
    desc: String(base.desc || ''),
    price: base.price !== undefined ? String(base.price) : '0',
    ...(base.originalPrice !== undefined ? { originalPrice: base.originalPrice } : {}),
    ...(base.stock !== undefined ? { stock: base.stock } : {}),
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
 * Sanitizes an array of menu items based on tenant tier limits.
 */
export function sanitizeMenuItems(
  menu: (Partial<MenuItem> | MenuItem)[],
  options: TierSanitizerOptions,
): MenuItem[] {
  if (!Array.isArray(menu)) return []
  return menu.map(item => sanitizeMenuItem(item, options))
}
