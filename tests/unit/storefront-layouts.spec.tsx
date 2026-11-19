import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { Category } from '@/db/schema/catalog'
import type { Tenant } from '@/db/schema/tenants'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import {
  ArtisanLayout,
  BoldLayout,
  ClassicLayout,
  DarkLayout,
  EditorialLayout,
  ElegantLayout,
  FreshLayout,
  getStorefrontLayout,
  ModernLayout,
  PremiumLayout,
  RetailArtisanLayout,
  TechLayout,
  THEME_LAYOUTS,
  UrbanLayout,
  VibrantLayout,
} from '@/components/storefront/layouts'
import {
  Footer,
  Gallery,
  Hero,
  OperatingHours,
  Reviews,
} from '@/components/storefront/sections'
import { DynamicThemeProvider } from '@/components/storefront/theme'

// ---------------------------------------------------------------------------
// Test Fixtures
// ---------------------------------------------------------------------------

const mockTenant: Tenant = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Kopi Artisan Senopati',
  slug: 'kopi-artisan-senopati',
  category: 'fnb',
  status: 'published',
  packageTier: 'pro',
  address: 'Jl. Senopati No. 42, Kebayoran Baru',
  city: 'Jakarta Selatan',
  phone: '081234567890',
  googleMapsUrl: 'https://maps.google.com/?cid=12345',
  customDomain: null,
  domainActiveUntil: null,
  siteActiveUntil: null,
  fomoExpiresAt: null,
  userId: null,
  organizationId: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  brandingContent: {
    heroTitle: 'Kopi Artisan Terbaik di Senopati',
    heroSubtitle: 'Biji kopi pilihan Nusantara dipanggang segar setiap pagi.',
    heroImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
    tagline: 'Secangkir Ketenangan di Tengah Hiruk Pikuk Ibu Kota',
    iconEmoji: '☕',
    galleryTitle: 'Suasana & Seduhan Kami',
    galleryDescription: 'Tempat ideal untuk berbincang santai atau bekerja produktif.',
    menuTitle: 'Menu Unggulan',
    menuDescription: 'Racikan kopi spesial dan pastry lezat buatan kami.',
    reviewsTitle: 'Ulasan Pecinta Kopi',
    reviewsDescription: 'Pengalaman nyata dari pengunjung setia kami.',
    socialLinks: {
      instagram: { active: true, url: 'https://instagram.com/kopiartisan' },
      whatsapp: { active: true, url: 'https://wa.me/6281234567890' },
      facebook: { active: true, url: 'https://facebook.com/kopiartisan' },
    },
    lookbook: [
      {
        caption: 'Manual Brew Bar',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      },
      {
        caption: 'Espresso Machine',
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      },
    ],
    reviews: [
      {
        authorName: 'Rian Pratama',
        rating: 5,
        text: 'Kopi susu arennya juara! Tempatnya juga tenang dan estetik.',
        time: '3 hari lalu',
      },
      {
        authorName: 'Alya Putri',
        rating: 5,
        text: 'Pelayanan cepat dan barista sangat menguasai origin kopi.',
        time: '1 minggu lalu',
      },
    ],
  },
  operatingHours: {
    isOpen: true,
    openTime: '07:00',
    closeTime: '22:00',
    raw: '07:00 - 22:00 WIB',
    schedules: [
      { day: 'Senin', open: '07:00', close: '22:00', closed: false },
      { day: 'Selasa', open: '07:00', close: '22:00', closed: false },
      { day: 'Rabu', open: '07:00', close: '22:00', closed: false },
      { day: 'Kamis', open: '07:00', close: '22:00', closed: false },
      { day: 'Jumat', open: '07:00', close: '23:00', closed: false },
      { day: 'Sabtu', open: '07:00', close: '23:00', closed: false },
      { day: 'Minggu', open: '08:00', close: '21:00', closed: false },
    ],
  },
  themeConfig: {
    themeColor: '#059669',
    layoutId: 'classic',
    fontFamily: 'font-serif',
  },
}

const mockCategories: Category[] = [
  {
    id: 'cat-coffee',
    name: 'Espresso Based',
    slug: 'espresso-based',
    sortOrder: 0,
    tenantId: mockTenant.id,
  },
  {
    id: 'cat-pastry',
    name: 'Artisan Pastry',
    slug: 'artisan-pastry',
    sortOrder: 1,
    tenantId: mockTenant.id,
  },
]

const mockProducts: ProductWithVariants[] = [
  {
    id: 'prod-latte',
    name: 'Caffe Latte Double Shot',
    description: 'Espresso ganda dengan susu steam lembut bertekstur microfoam halus.',
    basePrice: 35000,
    originalPrice: 40000,
    stock: 50,
    categoryId: 'cat-coffee',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
    isActive: true,
    sortOrder: 0,
    variants: [
      {
        id: 'var-milk',
        name: 'Jenis Susu',
        required: true,
        options: [
          { label: 'Fresh Milk', priceModifier: 0 },
          { label: 'Oat Milk', priceModifier: 10000 },
        ],
      },
    ],
  },
  {
    id: 'prod-croissant',
    name: 'Almond Butter Croissant',
    description: 'Croissant renyah berlapis mentega Prancis dengan isian pasta almond gurih.',
    basePrice: 28000,
    stock: 25,
    categoryId: 'cat-pastry',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    isActive: true,
    sortOrder: 1,
  },
]

// ---------------------------------------------------------------------------
// Unit & Integration Tests: Storefront Layouts & Server Sections
// ---------------------------------------------------------------------------

describe('Server Component Shell, Static Sections & Theme Layouts (Ticket 06)', () => {
  // -------------------------------------------------------------------------
  // 1. All 13 Theme Layouts Smoke Tests
  // -------------------------------------------------------------------------
  describe('13 Theme Layouts Server Rendering Smoke Tests', () => {
    const fnbLayouts = [
      { name: 'ClassicLayout', component: ClassicLayout },
      { name: 'ModernLayout', component: ModernLayout },
      { name: 'PremiumLayout', component: PremiumLayout },
      { name: 'ArtisanLayout', component: ArtisanLayout },
      { name: 'ElegantLayout', component: ElegantLayout },
      { name: 'BoldLayout', component: BoldLayout },
      { name: 'VibrantLayout', component: VibrantLayout },
    ]

    for (const { name, component: LayoutComponent } of fnbLayouts) {
      it(`renders F&B layout "${name}" to static HTML without crashing`, () => {
        const html = renderToStaticMarkup(
          <LayoutComponent
            tenant={mockTenant}
            categories={mockCategories}
            products={mockProducts}
          />,
        )

        // Core business identity
        expect(html).toContain('Kopi Artisan Senopati')
        expect(html).toContain('Caffe Latte Double Shot')
        expect(html).toContain('Almond Butter Croissant')

        // Static sections presence
        expect(html).toContain('Suasana &amp; Seduhan Kami')
        expect(html).toContain('Ulasan Pecinta Kopi')
        expect(html).toContain('Jam Operasional &amp; Lokasi')
        expect(html).toContain('Powered by Growfin Digital')
      })
    }

    const retailTenant: Tenant = {
      ...mockTenant,
      name: 'Urban Goods Bandung',
      category: 'retail',
      brandingContent: {
        ...mockTenant.brandingContent,
        menuTitle: 'Koleksi Streetwear',
      },
    }

    const retailLayouts = [
      { name: 'UrbanLayout', component: UrbanLayout },
      { name: 'EditorialLayout', component: EditorialLayout },
      { name: 'TechLayout', component: TechLayout },
      { name: 'DarkLayout', component: DarkLayout },
      { name: 'FreshLayout', component: FreshLayout },
      { name: 'RetailArtisanLayout', component: RetailArtisanLayout },
    ]

    for (const { name, component: LayoutComponent } of retailLayouts) {
      it(`renders Retail layout "${name}" to static HTML without crashing`, () => {
        const html = renderToStaticMarkup(
          <LayoutComponent
            tenant={retailTenant}
            categories={mockCategories}
            products={mockProducts}
          />,
        )

        expect(html).toContain('Urban Goods Bandung')
        expect(html).toContain('Caffe Latte Double Shot')
        expect(html).toContain('Powered by Growfin Digital')
      })
    }
  })

  // -------------------------------------------------------------------------
  // 2. Theme Registry & Resolver
  // -------------------------------------------------------------------------
  describe('THEME_LAYOUTS Registry & getStorefrontLayout', () => {
    it('registers all 13 themes in the lookup dictionary', () => {
      expect(THEME_LAYOUTS['classic']).toBe(ClassicLayout)
      expect(THEME_LAYOUTS['modern']).toBe(ModernLayout)
      expect(THEME_LAYOUTS['premium']).toBe(PremiumLayout)
      expect(THEME_LAYOUTS['artisan']).toBe(ArtisanLayout)
      expect(THEME_LAYOUTS['elegant']).toBe(ElegantLayout)
      expect(THEME_LAYOUTS['bold']).toBe(BoldLayout)
      expect(THEME_LAYOUTS['vibrant']).toBe(VibrantLayout)
      expect(THEME_LAYOUTS['urban']).toBe(UrbanLayout)
      expect(THEME_LAYOUTS['editorial']).toBe(EditorialLayout)
      expect(THEME_LAYOUTS['tech']).toBe(TechLayout)
      expect(THEME_LAYOUTS['dark']).toBe(DarkLayout)
      expect(THEME_LAYOUTS['fresh']).toBe(FreshLayout)
      expect(THEME_LAYOUTS['retail-artisan']).toBe(RetailArtisanLayout)
    })

    it('resolves correct layout by ID or falls back to archetype default', () => {
      expect(getStorefrontLayout('fnb-theme-modern')).toBe(ModernLayout)
      expect(getStorefrontLayout('retail-theme-editorial')).toBe(EditorialLayout)
      expect(getStorefrontLayout('unknown-theme', 'retail')).toBe(UrbanLayout)
      expect(getStorefrontLayout('unknown-theme', 'fnb')).toBe(ClassicLayout)
      expect(getStorefrontLayout(null)).toBe(ClassicLayout)
    })
  })

  // -------------------------------------------------------------------------
  // 3. Dynamic Section Ordering (sectionOrder)
  // -------------------------------------------------------------------------
  describe('Dynamic Section Ordering (sectionOrder)', () => {
    it('respects tenant custom section order', () => {
      const customTenant: Tenant = {
        ...mockTenant,
        themeConfig: {
          ...mockTenant.themeConfig,
          sectionOrder: ['reviews', 'gallery', 'hero'],
        },
      }

      const html = renderToStaticMarkup(
        <ClassicLayout
          tenant={customTenant}
          categories={mockCategories}
          products={mockProducts}
        />,
      )

      const reviewsIndex = html.indexOf('data-slot="storefront-reviews"')
      const galleryIndex = html.indexOf('data-slot="storefront-gallery"')
      const heroIndex = html.indexOf('data-slot="storefront-hero"')

      expect(reviewsIndex).toBeGreaterThan(-1)
      expect(galleryIndex).toBeGreaterThan(-1)
      expect(heroIndex).toBeGreaterThan(-1)

      // Reviews must appear before Gallery, and Gallery before Hero
      expect(reviewsIndex).toBeLessThan(galleryIndex)
      expect(galleryIndex).toBeLessThan(heroIndex)
    })
  })

  // -------------------------------------------------------------------------
  // 4. Section Suppression (hiddenSections)
  // -------------------------------------------------------------------------
  describe('Section Suppression (hiddenSections)', () => {
    it('omits hidden sections when configured in themeConfig.hiddenSections', () => {
      const suppressedTenant: Tenant = {
        ...mockTenant,
        themeConfig: {
          ...mockTenant.themeConfig,
          hiddenSections: ['reviews', 'gallery'],
        },
      }

      const html = renderToStaticMarkup(
        <ModernLayout
          tenant={suppressedTenant}
          categories={mockCategories}
          products={mockProducts}
        />,
      )

      expect(html).not.toContain('data-slot="storefront-reviews"')
      expect(html).not.toContain('data-slot="storefront-gallery"')
      expect(html).toContain('data-slot="storefront-hero"')
      expect(html).toContain('data-slot="catalog-section"')
    })

    it('respects section aliases when suppressing sections (e.g. lookbook/testimoni/katalog)', () => {
      const aliasSuppressedTenant: Tenant = {
        ...mockTenant,
        themeConfig: {
          ...mockTenant.themeConfig,
          hiddenSections: ['lookbook', 'testimoni'],
        },
      }

      const html = renderToStaticMarkup(
        <UrbanLayout
          tenant={aliasSuppressedTenant}
          categories={mockCategories}
          products={mockProducts}
        />,
      )

      expect(html).not.toContain('data-slot="storefront-gallery"')
      expect(html).not.toContain('data-slot="storefront-reviews"')
    })
  })

  // -------------------------------------------------------------------------
  // 5. Pure Server Static Sections In Isolation
  // -------------------------------------------------------------------------
  describe('Static Server Sections', () => {
    it('Hero renders tenant identity, cover, operational badge, and CTAs', () => {
      const html = renderToStaticMarkup(<Hero tenant={mockTenant} />)

      expect(html).toContain('Kopi Artisan Senopati')
      expect(html).toContain('Secangkir Ketenangan di Tengah Hiruk Pikuk Ibu Kota')
      expect(html).toContain('data-slot="operational-badge"')
      expect(html).toContain('Buka Sekarang')
      expect(html).toContain('Lihat Menu &amp; Katalog')
      expect(html).toContain('https://wa.me/6281234567890')
    })

    it('Hero renders closed state when tenant operatingHours.isOpen is false', () => {
      const closedTenant: Tenant = {
        ...mockTenant,
        operatingHours: {
          ...mockTenant.operatingHours,
          isOpen: false,
        },
      }

      const html = renderToStaticMarkup(<Hero tenant={closedTenant} />)
      expect(html).toContain('Sedang Tutup')
      expect(html).not.toContain('Buka Sekarang')
    })

    it('Gallery renders lookbook photo grid and captions', () => {
      const html = renderToStaticMarkup(<Gallery tenant={mockTenant} />)

      expect(html).toContain('data-slot="storefront-gallery"')
      expect(html).toContain('Suasana &amp; Seduhan Kami')
      expect(html).toContain('Manual Brew Bar')
      expect(html).toContain('Espresso Machine')
    })

    it('Reviews renders customer testimonials, ratings, and Google Maps link', () => {
      const html = renderToStaticMarkup(<Reviews tenant={mockTenant} />)

      expect(html).toContain('data-slot="storefront-reviews"')
      expect(html).toContain('Rian Pratama')
      expect(html).toContain('Alya Putri')
      expect(html).toContain('Kopi susu arennya juara!')
      expect(html).toContain('https://maps.google.com/?cid=12345')
      expect(html).toContain('target="_blank"')
      expect(html).toContain('rel="noopener noreferrer"')
    })

    it('OperatingHours renders weekly schedule and business address', () => {
      const html = renderToStaticMarkup(<OperatingHours tenant={mockTenant} />)

      expect(html).toContain('data-slot="storefront-operating-hours"')
      expect(html).toContain('Senin')
      expect(html).toContain('Minggu')
      expect(html).toContain('07:00 - 22:00')
      expect(html).toContain('Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan')
      expect(html).toContain('081234567890')
    })

    it('Footer renders copyright, tenant info, address, and target="_blank" social links', () => {
      const html = renderToStaticMarkup(<Footer tenant={mockTenant} />)

      expect(html).toContain('data-slot="storefront-footer"')
      expect(html).toContain('Kopi Artisan Senopati')
      expect(html).toContain('Jl. Senopati No. 42, Kebayoran Baru')
      expect(html).toContain('Powered by Growfin Digital')

      // All external links must open in a new tab with security rel
      expect(html).toContain('href="https://instagram.com/kopiartisan"')
      expect(html).toContain('href="https://wa.me/6281234567890"')
      expect(html).toContain('href="https://maps.google.com/?cid=12345"')
      expect(html).toContain('target="_blank"')
      expect(html).toContain('rel="noopener noreferrer"')
    })
  })

  // -------------------------------------------------------------------------
  // 6. DynamicThemeProvider Pure Server Component
  // -------------------------------------------------------------------------
  describe('DynamicThemeProvider (Server Component)', () => {
    it('generates brand color CSS variables as inline style without client hooks', () => {
      const html = renderToStaticMarkup(
        <DynamicThemeProvider themeColor="#10b981">
          <div data-slot="child-content">Content</div>
        </DynamicThemeProvider>,
      )

      expect(html).toContain('--brand-primary:#10b981')
      expect(html).toContain('--brand-hover:')
      expect(html).toContain('--brand-light:')
      expect(html).toContain('--brand-dark:')
      expect(html).toContain('Content')
    })
  })
})
