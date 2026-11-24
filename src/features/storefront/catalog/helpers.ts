import type { ProductWithVariants } from './types'

/**
 * Checks whether a product has variants or addons that require customization.
 */
export function hasProductCustomizations(product: ProductWithVariants): boolean {
  const hasVariants = Boolean(product.variants && product.variants.length > 0)
  const hasAddons = Boolean(product.addons && product.addons.length > 0)
  return hasVariants || hasAddons
}
