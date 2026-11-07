export type PackageTier =
  | 'free'
  | 'free_trial'
  | 'instant'
  | 'instan'
  | 'pro'
  | 'pro-basic'
  | 'pro-advanced'
  | 'enterprise'

export interface VariantOption {
  label: string
  priceModifier: number
}

export interface SpecificationItem {
  label: string
  value: string
}

export interface MenuItemVariant {
  name: string
  options: Array<string | VariantOption>
}

export interface MenuItemAddon {
  name: string
  price: number
}

export interface MenuItem {
  id: number | string
  name: string
  desc: string
  price: string
  originalPrice?: number | string
  stock?: number
  imageGallery?: string[]
  specifications?: SpecificationItem[]
  tag?: string
  category?: string
  imageUrl?: string
  imagePublicId?: string
  duration?: number
  variants?: MenuItemVariant[]
  addons?: MenuItemAddon[]
}

export interface PractitionerInfo {
  id: string
  name: string
  role: string
  avatarEmoji?: string
  avatarUrl?: string
  licenseNumber?: string
  schedule?: string
}

export interface ReviewInfo {
  authorName: string
  name?: string
  rating: number
  text: string
  time?: string
  profilePhotoUrl?: string
}

export interface DoctorInfo {
  avatarUrl?: string
  name?: string
  role?: string
  sampleChat?: string
  [key: string]: unknown
}

export interface AdminInfo {
  [key: string]: unknown
  name?: string
  role?: string
  sampleChat?: {
    [key: string]: unknown
    recommendationDesc?: string
  }
}

export interface LookbookItem {
  id: string
  name: string
  imageUrl: string
  desc?: string
  imagePublicId?: string
}

export interface BusinessDemo {
  name: string
  category: string
  city: string
  rating: number
  reviewCount: number
  phone: string
  address: string
  googleMapsUrl: string
  hours: string
  isOpen?: boolean
  openTime?: string
  closeTime?: string
  waNumber: string
  tagline: string
  iconEmoji: string
  practitioners?: PractitionerInfo[]
  categories: string[]
  menu: MenuItem[]
  reviews?: ReviewInfo[]
  lookbook?: LookbookItem[]
  heroImage?: string
  heroImagePublicId?: string
  logoUrl?: string
  logoImagePublicId?: string
  instagramFeed?: string[]
  fbType?: 'DINE_IN' | 'QUICK_SERVICE' | 'PRE_ORDER'
  themeColor?: string
  package_tier?: PackageTier | string
  heroSecondaryAction?: 'whatsapp' | 'cart' | 'gallery'
  galleryTitle?: string
  galleryDescription?: string
  menuTitle?: string
  menuDescription?: string
  reviewsTitle?: string
  reviewsDescription?: string
  sectionOrder?: string[]
  hiddenSections?: string[]
  marketing?: {
    discountPercentage?: number
    flashSaleEnd?: string
    promoLabel?: string
    usps?: Array<{ desc: string; title: string }>
  }
  uiLabels?: {
    buyButtonText?: string
    lookbookButtonText?: string
    viewAllButtonText?: string
  }
  userEmail?: string
  socialMedia?: {
    facebook?: { active: boolean; url: string }
    instagram?: { active: boolean; url: string }
    tiktok?: { active: boolean; url: string }
  }
  faqs?: Array<{
    answer: string
    question: string
  }>
  domainRequest?: {
    adminNotes?: string
    alternativeDomain?: string
    requestedAt: string
    requestedDomain: string
    status: 'active' | 'pending' | 'processing' | 'rejected'
    whatsappContact?: string
  }
  admin?: AdminInfo | null
  doctor?: DoctorInfo | null
  metadata?: Record<string, unknown> | null
  status?: string
}
