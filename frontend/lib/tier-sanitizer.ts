import type { MenuItem, MenuItemVariant, SpecificationItem, VariantOption } from './types';
import { normalizeVariantOption } from './catalog';

export interface TierSanitizerOptions {
  advancedVariants?: boolean;
}

/**
 * Sanitizes a single menu item based on tenant tier limits.
 *
 * If advancedVariants is false (e.g. Instan or Pro Basic):
 * - Strips imageGallery
 * - Strips specifications
 * - Strips numeric priceModifiers from variants (resets priceModifier to 0 and removes modifier suffixes)
 *
 * If advancedVariants is true (e.g. Pro Advanced, Enterprise, Free Trial):
 * - Preserves imageGallery (up to 5 items)
 * - Preserves specifications
 * - Preserves variant options and their numeric priceModifiers
 */
export function sanitizeMenuItem(
  item: Partial<MenuItem> | MenuItem,
  options: TierSanitizerOptions
): MenuItem {
  const base = item || {};
  const allowAdvanced = Boolean(options.advancedVariants);

  // Normalize variants
  let variants: MenuItemVariant[] | undefined;
  if (Array.isArray(base.variants)) {
    variants = base.variants.map((v) => ({
      name: String(v.name || '').trim(),
      options: Array.isArray(v.options)
        ? v.options.map((opt) => {
            const normalized = normalizeVariantOption(opt);
            return {
              label: normalized.label,
              priceModifier: allowAdvanced ? normalized.priceModifier : 0,
            };
          })
        : [],
    }));
  }

  // Normalize imageGallery (up to 5 images)
  let imageGallery: string[] | undefined;
  if (allowAdvanced && Array.isArray(base.imageGallery)) {
    imageGallery = base.imageGallery
      .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
      .slice(0, 5);
  }

  // Normalize specifications
  let specifications: SpecificationItem[] | undefined;
  if (allowAdvanced && Array.isArray(base.specifications)) {
    specifications = base.specifications.map((s) => ({
      label: String(s.label || '').trim(),
      value: String(s.value || '').trim(),
    }));
  }

  const result: MenuItem = {
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
  };

  return result;
}

/**
 * Sanitizes an array of menu items based on tenant tier limits.
 */
export function sanitizeMenuItems(
  menu: (Partial<MenuItem> | MenuItem)[],
  options: TierSanitizerOptions
): MenuItem[] {
  if (!Array.isArray(menu)) return [];
  return menu.map((item) => sanitizeMenuItem(item, options));
}
