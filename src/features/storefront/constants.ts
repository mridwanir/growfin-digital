import type { StorefrontSection, StorefrontTheme } from '@/db/schema/storefront'

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
