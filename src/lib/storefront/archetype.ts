export type StorefrontArchetype = 'fnb' | 'retail'

export const ARCHETYPE_KEYWORDS = {
  fnb: [
    'cafe',
    'resto',
    'warung',
    'kopi',
    'coffee',
    'kuliner',
    'bakery',
    'roti',
    'cake',
    'bistro',
    'kitchen',
    'dapur',
    'makan',
    'minum',
    'beverage',
    'food',
    'bar',
    'juice',
    'tea',
    'teh',
    'boba',
    'snack',
    'cemilan',
    'jajanan',
    'dessert',
    'catering',
  ],
  retail: [
    'shop',
    'toko',
    'store',
    'boutique',
    'fashion',
    'clothing',
    'distro',
    'apparel',
    'retail',
    'merchandise',
    'accessories',
    'aksesoris',
    'hijab',
    'sepatu',
    'shoes',
    'tas',
    'bag',
    'elektronik',
    'gadget',
    'buku',
    'book',
    'florist',
    'bunga',
    'petshop',
    'hewan',
    'optik',
    'eyewear',
    'pharmacy',
    'apotek',
    'skincare',
    'beauty',
    'kosmetik',
    'cosmetics',
    'laundry',
    'cleaning',
    'tailor',
    'penjahit',
    'travel',
    'real estate',
    'agency',
  ],
} as const

/**
 * Resolves business category string into one of two core storefront archetypes: 'fnb' | 'retail'.
 * Salon, barbershop, spa, and clinic categories resolve cleanly to retail.
 */
export function resolveArchetype(category: string | null | undefined): StorefrontArchetype {
  if (!category) return 'retail'
  const normalized = category.toLowerCase().trim()

  const legacyRetailCategories = [
    'barber',
    'salon',
    'spa',
    'cukur',
    'klinik',
    'dokter',
    'pijat',
    'massage',
  ]
  for (const keyword of legacyRetailCategories) {
    if (normalized.includes(keyword)) return 'retail'
  }

  for (const keyword of ARCHETYPE_KEYWORDS.fnb) {
    if (keyword === 'bar') {
      if (/\bbar\b/.test(normalized)) return 'fnb'
    } else if (normalized.includes(keyword)) {
      return 'fnb'
    }
  }

  return 'retail'
}
