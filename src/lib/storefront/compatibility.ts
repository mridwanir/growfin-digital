import type {
  BrandingContent,
  CatalogSectionContent,
  FooterSectionContent,
  GallerySectionContent,
  HeroSectionContent,
  ReviewsSectionContent,
  StorefrontConfig,
  StorefrontSection,
  StorefrontTheme,
  ThemeConfig,
} from '@/db/schema/tenants'

export const DEFAULT_STOREFRONT_THEME: StorefrontTheme = {
  fontFamily: 'font-sans',
  layoutId: 'modern',
  themeColor: '#000000',
}

export const DEFAULT_STOREFRONT_SECTIONS: StorefrontSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    isVisible: true,
    sortOrder: 1,
    content: {
      subtitle: 'Belanja mudah dan cepat',
      title: 'Toko Online',
    },
  },
  {
    id: 'sec-catalog',
    type: 'catalog',
    isVisible: true,
    sortOrder: 2,
    content: {
      title: 'Katalog Produk',
    },
  },
  {
    id: 'sec-reviews',
    type: 'reviews',
    isVisible: true,
    sortOrder: 3,
    content: {
      title: 'Ulasan Pelanggan',
    },
  },
  {
    id: 'sec-gallery',
    type: 'gallery',
    isVisible: true,
    sortOrder: 4,
    content: {
      title: 'Galeri Foto',
    },
  },
  {
    id: 'sec-hours',
    type: 'operating_hours',
    isVisible: true,
    sortOrder: 5,
    content: {
      title: 'Jam Operasional',
    },
  },
  {
    id: 'sec-footer',
    type: 'footer',
    content: {},
    isVisible: true,
    sortOrder: 6,
  },
]

/**
 * Extracts legacy BrandingContent shape from modern StorefrontSection array.
 */
export function extractLegacyBrandingFromSections(
  sections: StorefrontSection[] = [],
): BrandingContent {
  const heroSection = sections.find(s => s.type === 'hero')
  const hero = (heroSection?.content as HeroSectionContent | undefined) || {}

  const footerSection = sections.find(s => s.type === 'footer')
  const footer = (footerSection?.content as FooterSectionContent | undefined) || {}

  const gallerySection = sections.find(s => s.type === 'gallery')
  const gallery = (gallerySection?.content as GallerySectionContent | undefined) || {}

  const reviewsSection = sections.find(s => s.type === 'reviews')
  const reviews = (reviewsSection?.content as ReviewsSectionContent | undefined) || {}

  const catalogSection = sections.find(s => s.type === 'catalog')
  const catalog = (catalogSection?.content as CatalogSectionContent | undefined) || {}

  return {
    galleryDescription: gallery.description,
    galleryTitle: gallery.title,
    heroImageUrl: hero.heroImageUrl,
    heroSubtitle: hero.subtitle,
    heroTitle: hero.title,
    iconEmoji: hero.iconEmoji,
    imageGallery: gallery.images as string[] | undefined,
    logoUrl: hero.logoUrl,
    lookbook: gallery.images,
    menuDescription: catalog.description,
    menuTitle: catalog.title,
    reviews: reviews.reviews,
    reviewsDescription: reviews.description,
    reviewsTitle: reviews.title,
    tagline: footer.tagline || hero.subtitle,
    socialLinks: footer.socialLinks
      ? {
          facebook: footer.socialLinks.facebook ? { url: footer.socialLinks.facebook } : undefined,
          tiktok: footer.socialLinks.tiktok ? { url: footer.socialLinks.tiktok } : undefined,
          whatsapp: footer.socialLinks.whatsapp ? { url: footer.socialLinks.whatsapp } : undefined,
          instagram: footer.socialLinks.instagram
            ? { url: footer.socialLinks.instagram }
            : undefined,
        }
      : undefined,
  }
}

/**
 * Extracts legacy ThemeConfig shape from modern StorefrontConfig.
 */
export function extractLegacyThemeConfig(config: StorefrontConfig): ThemeConfig {
  const sections = config.sections || []
  const sortedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder)
  const visibleOrder = sortedSections.filter(s => s.isVisible).map(s => s.type)
  const hidden = sortedSections.filter(s => !s.isVisible).map(s => s.type)

  return {
    ...config.theme,
    fontFamily: config.theme?.fontFamily,
    hiddenSections: hidden,
    layoutId: config.theme?.layoutId,
    sectionOrder: visibleOrder,
    themeColor: config.theme?.themeColor,
  }
}

export const extractLegacyThemeFromConfig = extractLegacyThemeConfig
