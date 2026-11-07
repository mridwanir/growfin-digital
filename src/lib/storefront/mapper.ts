import type { Category } from '@/db/schema/catalog'
import type { BrandingContent, OperatingHours, Tenant, ThemeConfig } from '@/db/schema/tenants'
import type {
  BusinessDemo,
  VariantOption as LegacyVariantOption,
  LookbookItem,
  MenuItem,
  MenuItemVariant,
  PractitionerInfo,
  ReviewInfo,
  SpecificationItem,
} from '@/lib/types'

export type StorefrontArchetype = 'fnb' | 'retail' | 'grooming' | 'service'

export interface RelationalVariantOptionInput {
  id?: string
  label: string
  priceModifier: number
  sortOrder?: number
  variantId?: string
}

export interface RelationalProductVariantInput {
  id?: string
  name: string
  options?: RelationalVariantOptionInput[]
  productId?: string
  required?: boolean
}

export interface RelationalStorefrontProductInput {
  basePrice: number
  category?: Category | null
  categoryId?: string | null
  createdAt?: Date
  description?: string | null
  duration?: number | null
  id: string
  imageGallery?: string[] | null
  imageStorageKey?: string | null
  imageUrl?: string | null
  isActive?: boolean
  name: string
  originalPrice?: number | null
  sortOrder?: number
  specifications?: SpecificationItem[] | null
  stock?: number | null
  tenantId?: string
  updatedAt?: Date
  variants?: RelationalProductVariantInput[]
}

export interface RelationalStorefrontInput {
  categories: Category[]
  products: RelationalStorefrontProductInput[]
  tenant: Tenant
}

export type RelationalStorefrontInputParam =
  | RelationalStorefrontInput
  | (Tenant & {
      categories?: Category[]
      products?: RelationalStorefrontProductInput[]
    })

const ARCHETYPE_KEYWORDS = {
  fnb: [
    'cafe',
    'resto',
    'warung',
    'kopi',
    'coffee',
    'kuliner',
    'makan',
    'minum',
    'bakso',
    'soto',
    'sate',
    'mie',
    'restaurant',
    'bakery',
    'fast food',
    'bar',
    'pub',
    'bubble tea',
    'juice',
    'f&b',
    'fnb',
  ],
  grooming: [
    'kecantikan',
    'salon',
    'spa',
    'cukur',
    'barber',
    'pijat',
    'massage',
    'terapi',
    'beauty',
    'hair',
    'nail',
    'skin care',
    'skincare',
    'make-up',
    'makeup',
    'artist',
    'klinik kecantikan',
    'aesthetic',
    'grooming',
  ],
  retail: [
    'toko',
    'roti',
    'baju',
    'pakaian',
    'sepatu',
    'tas',
    'supermarket',
    'minimarket',
    'grosir',
    'elektronik',
    'gadget',
    'handphone',
    'komputer',
    'optik',
    'kacamata',
    'kosmetik',
    'apotek',
    'obat',
    'material',
    'bangunan',
    'buku',
    'alat tulis',
    'mainan',
    'pet shop',
    'convenience',
    'clothing',
    'boutique',
    'shoe',
    'hardware',
    'retail',
  ],
  service: [
    'klinik',
    'dokter',
    'gigi',
    'bidan',
    'bengkel',
    'reparasi',
    'servis',
    'service',
    'cuci mobil',
    'laundry',
    'cleaning',
    'tailor',
    'penjahit',
    'travel',
    'real estate',
    'agency',
  ],
} as const

interface ArchetypeDefaultConfig {
  emoji: string
  fbType?: 'DINE_IN' | 'QUICK_SERVICE' | 'PRE_ORDER'
  lookbook: LookbookItem[]
  practitioners: PractitionerInfo[]
  reviews: ReviewInfo[]
  themeColor: string
}

const ARCHETYPE_DEFAULTS: Record<StorefrontArchetype, ArchetypeDefaultConfig> = {
  fnb: {
    emoji: '☕',
    fbType: 'DINE_IN',
    practitioners: [{ id: '1', name: 'Barista / Chef', avatarEmoji: '👨‍🍳', role: 'Staff' }],
    themeColor: '#78350f',
    lookbook: [
      {
        id: 'lb-fnb-1',
        name: 'Signature Coffee & Pastry',
        desc: 'Paduan biji kopi pilihan dan sajian hangat favorit',
        imageUrl: '/image/fnb/hero.jpg',
      },
      {
        id: 'lb-fnb-2',
        name: 'Cozy Dining Space',
        desc: 'Suasana santai dan nyaman untuk bekerja dan bersantai',
        imageUrl: '/image/fnb/interior.jpg',
      },
    ],
    reviews: [
      {
        authorName: 'Clarissa Putri',
        rating: 5,
        text: 'Rasa dan kualitas makanan sangat memuaskan, tempatnya nyaman dan bersih.',
        time: 'Kemarin',
      },
      {
        authorName: 'Dimas Anggara',
        rating: 5,
        text: 'Menu bervariasi dan penyajian cepat. Sangat direkomendasikan untuk kumpul keluarga.',
        time: '3 hari lalu',
      },
    ],
  },
  grooming: {
    emoji: '✂️',
    themeColor: '#c2410c',
    lookbook: [
      {
        id: 'lb-grooming-1',
        name: 'Precision Styling & Haircut',
        desc: 'Potongan rambut presisi dengan sentuhan stylist profesional',
        imageUrl: '/image/grooming/lookbook1.jpg',
      },
      {
        id: 'lb-grooming-2',
        name: 'Relaxing Spa & Treatment',
        desc: 'Perawatan relaksasi kepala dan tubuh menyegarkan',
        imageUrl: '/image/grooming/lookbook2.jpg',
      },
    ],
    practitioners: [
      {
        id: '1',
        name: 'Master Stylist / Terapis',
        avatarEmoji: '💇',
        role: 'Professional',
      },
    ],
    reviews: [
      {
        authorName: 'Natasha W.',
        rating: 5,
        text: 'Hasil perawatan sangat rapi dan teliti. Tempatnya estetik dan staf sangat ramah.',
        time: 'Kemarin',
      },
      {
        authorName: 'Adrian K.',
        rating: 5,
        text: 'Potongan rambut sangat presisi sesuai ekspektasi. Pasti akan kembali lagi.',
        time: '3 hari lalu',
      },
    ],
  },
  retail: {
    emoji: '🛍️',
    practitioners: [{ id: '1', name: 'Customer Service', avatarEmoji: '👨‍💼', role: 'Staff' }],
    themeColor: '#18181b',
    lookbook: [
      {
        id: 'lb-retail-1',
        name: 'New Arrivals Showcase',
        desc: 'Koleksi produk terbaru dengan mutu terjamin',
        imageUrl: '/image/retail/lookbook1.jpg',
      },
      {
        id: 'lb-retail-2',
        name: 'Seasonal Best Sellers',
        desc: 'Pilihan terbaik untuk melengkapi gaya harian',
        imageUrl: '/image/retail/lookbook2.jpg',
      },
    ],
    reviews: [
      {
        authorName: 'Anindya Maheswari',
        rating: 5,
        text: 'Kualitas barang sesuai deskripsi, bahan premium dan pengemasan sangat rapi.',
        time: 'Kemarin',
      },
      {
        authorName: 'Reza Hendrawan',
        rating: 5,
        text: 'Proses pemesanan cepat dan admin sangat responsif membantu pilihan varian.',
        time: '2 hari lalu',
      },
    ],
  },
  service: {
    emoji: '🩺',
    themeColor: '#0284c7',
    lookbook: [
      {
        id: 'lb-service-1',
        name: 'Comprehensive Inspection & Diagnostic',
        desc: 'Pemeriksaan menyeluruh dengan peralatan modern berstandar tinggi',
        imageUrl: '/image/service/lookbook1.jpg',
      },
      {
        id: 'lb-service-2',
        name: 'Certified Professional Care',
        desc: 'Penanganan cepat dan tepat oleh tenaga ahli bersertifikasi',
        imageUrl: '/image/service/lookbook2.jpg',
      },
    ],
    practitioners: [
      {
        id: '1',
        name: 'Dokter / Teknisi Spesialis',
        avatarEmoji: '👨‍⚕️',
        role: 'Professional',
      },
    ],
    reviews: [
      {
        authorName: 'Budi Santoso',
        rating: 5,
        text: 'Pengerjaan cepat, transparan, dan bergaransi resmi. Sangat memuaskan!',
        time: 'Kemarin',
      },
      {
        authorName: 'Siti Rahma',
        rating: 5,
        text: 'Teknisi ramah dan menjelaskan masalah dengan jelas sebelum mulai perbaikan.',
        time: '4 hari lalu',
      },
    ],
  },
}

/**
 * Resolves business category string into one of four core storefront archetypes.
 */
export function resolveArchetype(category: string | null | undefined): StorefrontArchetype {
  if (!category) return 'retail'
  const normalized = category.toLowerCase().trim()

  for (const keyword of ARCHETYPE_KEYWORDS.grooming) {
    if (normalized.includes(keyword)) return 'grooming'
  }
  for (const keyword of ARCHETYPE_KEYWORDS.fnb) {
    if (normalized.includes(keyword)) return 'fnb'
  }
  for (const keyword of ARCHETYPE_KEYWORDS.service) {
    if (normalized.includes(keyword)) return 'service'
  }
  for (const keyword of ARCHETYPE_KEYWORDS.retail) {
    if (normalized.includes(keyword)) return 'retail'
  }

  return 'retail'
}

/**
 * Formats an integer amount (in IDR) into a storefront currency display string. e.g. 25000 -> "Rp
 * 25.000", -5000 -> "-Rp 5.000"
 */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return 'Rp 0'
  const isNegative = amount < 0
  const absoluteValue = Math.abs(Math.round(amount))
  const formatted = absoluteValue.toLocaleString('id-ID')
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`
}

/**
 * Parses a storefront currency display string or number into an integer Rupiah amount. Handles "Rp
 * 25.000", "Rp -5.000", "-Rp 5.000", "(-Rp 5.000)", etc.
 */
export function parseCurrency(val: string | number | null | undefined): number {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') {
    return Number.isFinite(val) ? Math.round(val) : 0
  }
  const str = String(val).trim()
  if (!str) return 0

  const isNegative = str.includes('-')
  const digits = str.replace(/\D/g, '')
  if (!digits) return 0

  const parsed = Number.parseInt(digits, 10)
  if (!Number.isFinite(parsed)) return 0
  return isNegative ? -parsed : parsed
}

/**
 * Normalizes phone numbers to international WhatsApp format without leading +. Converts local
 * Indonesian numbers (08...) to 628...
 */
export function normalizeWaNumber(rawPhoneOrWa?: string | null): string {
  if (!rawPhoneOrWa) return ''
  let digits = rawPhoneOrWa.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) {
    digits = `62${digits.slice(1)}`
  }
  return digits
}

function resolveSocialLink(link?: { active?: boolean; url?: string }): {
  active: boolean
  url: string
} {
  return {
    active: Boolean(link?.active ?? link?.url),
    url: link?.url || '',
  }
}

/**
 * Maps relational product variants and their options with price modifiers into the legacy
 * MenuItemVariant schema.
 */
export function mapVariantOptionsToLegacy(
  variants?: RelationalProductVariantInput[],
): MenuItemVariant[] {
  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    return []
  }

  return variants.map(variant => {
    const options = Array.isArray(variant.options) ? [...variant.options] : []

    options.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

    const mappedOptions: LegacyVariantOption[] = options.map(opt => ({
      label: String(opt.label || '').trim(),
      priceModifier: parseCurrency(opt.priceModifier),
    }))

    return {
      name: String(variant.name || '').trim(),
      options: mappedOptions,
    }
  })
}

function isWrappedStorefrontInput(
  input: RelationalStorefrontInputParam,
): input is RelationalStorefrontInput {
  return typeof input === 'object' && input !== null && 'tenant' in input
}

function extractCategoriesAndProducts(
  input: RelationalStorefrontInputParam,
  tenant: Tenant,
  isWrapped: boolean,
) {
  const rawCategories = isWrapped && input.categories?.length ? input.categories : undefined
  const categoriesList: Category[] =
    rawCategories ||
    ('categories' in tenant && Array.isArray(tenant.categories) ? tenant.categories : [])

  const rawProducts = isWrapped && input.products?.length ? input.products : undefined
  const productsList: RelationalStorefrontProductInput[] =
    rawProducts || ('products' in tenant && Array.isArray(tenant.products) ? tenant.products : [])

  return { categoriesList, productsList }
}

function mapProductsToMenuItems(
  productsList: RelationalStorefrontProductInput[],
  categoryMap: Map<string, string>,
): MenuItem[] {
  return productsList.map((prod, index) => {
    const prodCategoryName =
      prod.category?.name || (prod.categoryId ? categoryMap.get(prod.categoryId) : undefined) || ''

    return {
      id: prod.id || index + 1,
      name: prod.name,
      category: prodCategoryName,
      desc: String(prod.description || ''),
      duration: prod.duration ?? undefined,
      imageGallery: Array.isArray(prod.imageGallery) ? prod.imageGallery : [],
      imagePublicId: prod.imageStorageKey ?? undefined,
      imageUrl: prod.imageUrl ?? undefined,
      price: formatCurrency(prod.basePrice),
      specifications: Array.isArray(prod.specifications) ? prod.specifications : [],
      stock: prod.stock ?? undefined,
      variants: mapVariantOptionsToLegacy(prod.variants),
      originalPrice:
        prod.originalPrice !== null && prod.originalPrice !== undefined
          ? parseCurrency(prod.originalPrice)
          : undefined,
    }
  })
}

/**
 * Maps normalized relational database records into the legacy BusinessDemo contract, preserving
 * compatibility with all legacy storefront theme components.
 */
export function mapTenantToBusinessDemo(input: RelationalStorefrontInputParam): BusinessDemo {
  const isWrapped = isWrappedStorefrontInput(input)
  const tenant: Tenant = isWrapped ? input.tenant : input
  const { categoriesList, productsList } = extractCategoriesAndProducts(input, tenant, isWrapped)
  const branding: BrandingContent = (tenant.brandingContent as BrandingContent) || {}
  const themeConfig: ThemeConfig = (tenant.themeConfig as ThemeConfig) || {}
  const operatingHours: OperatingHours = (tenant.operatingHours as OperatingHours) || {}

  const archetype = resolveArchetype(tenant.category)
  const defaults = ARCHETYPE_DEFAULTS[archetype]

  // Category lookup map
  const categoryMap = new Map<string, string>()
  for (const cat of categoriesList) {
    categoryMap.set(cat.id, cat.name)
  }

  // Categories array for BusinessDemo (string array of names)
  const categoryNames = categoriesList.map(c => c.name)
  const menu = mapProductsToMenuItems(productsList, categoryMap)

  // Extract phone & WhatsApp numbers (international format without leading +)
  const rawWa =
    branding.socialLinks?.whatsapp?.url || (branding['waNumber'] as string) || tenant.phone || ''
  const waNumber = normalizeWaNumber(rawWa)

  // Operational hours fallback
  const openTime = operatingHours.openTime || '08:00'
  const closeTime = operatingHours.closeTime || '21:00'
  const hours = operatingHours.raw || `${openTime} - ${closeTime}`
  const isOpen = operatingHours.isOpen ?? true

  // Ratings & reviews fallback
  const rating =
    typeof branding['rating'] === 'number' && Number.isFinite(branding['rating'])
      ? branding['rating']
      : 4.9
  const reviewCount =
    typeof branding['reviewCount'] === 'number' && Number.isFinite(branding['reviewCount'])
      ? branding['reviewCount']
      : 128

  // Customer reviews fallback
  const rawReviews = (branding['reviews'] as ReviewInfo[]) || []
  const reviews: ReviewInfo[] =
    Array.isArray(rawReviews) && rawReviews.length > 0 ? rawReviews : defaults.reviews

  // Lookbook items fallback
  const rawLookbook = (branding['lookbook'] as LookbookItem[]) || []
  const lookbook: LookbookItem[] =
    Array.isArray(rawLookbook) && rawLookbook.length > 0 ? rawLookbook : defaults.lookbook

  // Practitioners fallback
  const rawPractitioners = (branding['practitioners'] as PractitionerInfo[]) || []
  const practitioners: PractitionerInfo[] =
    Array.isArray(rawPractitioners) && rawPractitioners.length > 0
      ? rawPractitioners
      : defaults.practitioners

  // Social media mapping & fallbacks
  const socialMedia = {
    facebook: resolveSocialLink(branding.socialLinks?.facebook),
    instagram: resolveSocialLink(branding.socialLinks?.instagram),
    tiktok: resolveSocialLink(branding.socialLinks?.tiktok),
  }

  // Marketing content mapping
  const marketing = {
    discountPercentage: branding.marketing?.discountPercentage,
    flashSaleEnd: branding.marketing?.flashSaleEnd,
    promoLabel: branding.marketing?.promoLabel,
    usps:
      branding.marketing?.usps ||
      branding.usps?.map(u => ({
        desc: u.description || '',
        title: u.title,
      })) ||
      [],
  }

  const uiLabels = branding.uiLabels || {}

  const demo: BusinessDemo = {
    name: tenant.name,
    address: tenant.address || '',
    categories: categoryNames,
    category: tenant.category,
    city: tenant.city || '',
    closeTime,
    faqs: branding.faqs || [],
    fbType: themeConfig.fbType || defaults.fbType,
    galleryDescription: branding.galleryDescription,
    galleryTitle: branding.galleryTitle,
    googleMapsUrl: tenant.googleMapsUrl || '',
    heroImage: branding.heroImageUrl || '',
    heroImagePublicId: branding.heroImageStorageKey || undefined,
    heroSecondaryAction: themeConfig.heroSecondaryAction || 'whatsapp',
    hiddenSections: themeConfig.hiddenSections || [],
    hours,
    iconEmoji: branding.iconEmoji || defaults.emoji,
    instagramFeed: (branding['instagramFeed'] as string[]) || [],
    isOpen,
    logoImagePublicId: branding.logoStorageKey || undefined,
    logoUrl: branding.logoUrl || '',
    lookbook,
    marketing,
    menu,
    menuDescription: branding.menuDescription,
    menuTitle: branding.menuTitle,
    openTime,
    package_tier: tenant.packageTier,
    phone: tenant.phone || '',
    practitioners,
    rating,
    reviewCount,
    reviews,
    reviewsDescription: branding.reviewsDescription,
    reviewsTitle: branding.reviewsTitle,
    sectionOrder: themeConfig.sectionOrder || ['hero', 'lookbook', 'katalog', 'testimoni', 'faq'],
    socialMedia,
    status: tenant.status,
    tagline: branding.tagline || branding.heroSubtitle || '',
    themeColor: themeConfig.themeColor || defaults.themeColor,
    uiLabels,
    waNumber,
  }

  return demo
}
