export type PackageTier = 'free_trial' | 'instan' | 'pro-basic' | 'pro-advanced' | 'enterprise'

export interface PackageLimits {
  maxProducts: number
  maxCategories: number
  customDomain: boolean
  paymentGateway: boolean
  bookingSystem: boolean
  promoFeatures: boolean // Mengontrol Flash Sale, Promo Badge, Discount % & Custom UI Labels
  advancedVariants: boolean // Mengontrol Multi-Varian dengan Price Modifier (+Rp), Galeri Multi-Foto & Tabel Spesifikasi
  removeBranding: boolean // Menghapus floating/footer badge "Powered by Growfin Digital"
}

export const PACKAGE_LIMITS: Record<PackageTier, PackageLimits> = {
  enterprise: {
    advancedVariants: true,
    bookingSystem: true,
    customDomain: true,
    maxCategories: 100,
    maxProducts: 1000,
    paymentGateway: true,
    promoFeatures: true,
    removeBranding: true,
  },
  free_trial: {
    advancedVariants: true,
    bookingSystem: true,
    customDomain: false,
    maxCategories: 5,
    maxProducts: 7,
    paymentGateway: false,
    promoFeatures: true,
    removeBranding: false,
  },
  instan: {
    advancedVariants: false,
    bookingSystem: false,
    customDomain: false,
    maxCategories: 5,
    maxProducts: 20,
    paymentGateway: false,
    promoFeatures: false,
    removeBranding: false,
  },
  'pro-advanced': {
    advancedVariants: true,
    bookingSystem: true,
    customDomain: true,
    maxCategories: 50,
    maxProducts: 300,
    paymentGateway: true,
    promoFeatures: true,
    removeBranding: true,
  },
  'pro-basic': {
    advancedVariants: false,
    bookingSystem: true,
    customDomain: true,
    maxCategories: 20,
    maxProducts: 100,
    paymentGateway: false,
    promoFeatures: true,
    removeBranding: true,
  },
}

export const siteConfig = {
  contact: {
    email: 'growfin.id@gmail.com',
    whatsappNumber: '6289630352370',
    // Base URLs for quick chat links
    waLinks: {
      enterprise:
        'https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20berkonsultasi%20untuk%20Enterprise%20Solutions.',
      instan:
        'https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Template%20Instan.',
      proAdvanced:
        'https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Pro%20Advanced.',
      proBasic:
        'https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Pro%20Basic.',
    },
  },
  pricing: [
    {
      id: 'instan',
      badgeEn: 'Beginners & SMEs',
      badgeId: 'Pemula & UMKM',
      buttonEn: 'Choose Instant Plan',
      buttonId: 'Pilih Paket Instan',
      isFeatured: false,
      linkKey: 'instan',
      periodEn: 'One-time payment (Lifetime)',
      periodId: 'Sekali Bayar (Aktif Selamanya)',
      price: 'Rp 299rb',
      priceNumeric: 299000,
      titleEn: 'Instant Template',
      titleId: 'Template Instan',
      descEn:
        'Instant solution for SMEs. Catalog & WhatsApp order website live right now with lifetime access.',
      descId:
        'Solusi instan untuk UMKM. Website katalog & order WhatsApp langsung aktif detik ini juga.',
      featuresEn: [
        '1 Business Website & Official Subdomain (.growfin.my.id)',
        'Lifetime Website Access (No Monthly Fees)',
        'Up to 20 Products/Menu & 5 Categories',
        'Live Editor: Customize Theme, Color & Page Layout',
        'WhatsApp Order Integration & Smart QR ID Card',
      ],
      featuresId: [
        '1 Website Bisnis & Subdomain Resmi (.growfin.my.id)',
        'Masa Aktif Website Selamanya (Tanpa Biaya Bulanan)',
        'Hingga 20 Produk/Menu & 5 Kategori',
        'Live Editor: Kustomisasi Tema, Warna & Susunan Halaman',
        'Integrasi Order WhatsApp & Smart QR ID Card',
      ],
    },
    {
      id: 'pro-basic',
      badgeEn: 'Stand Out',
      badgeId: 'Tampil Beda',
      buttonEn: 'Choose Pro Basic',
      buttonId: 'Pilih Pro Basic',
      isFeatured: false,
      linkKey: 'proBasic',
      periodEn: 'Lifetime Website (Domain 1 Year)',
      periodId: 'Website Selamanya (Domain 1 Tahun)',
      price: 'Rp 999rb',
      priceNumeric: 999000,
      titleEn: 'Pro Basic',
      titleId: 'Pro Basic',
      descEn:
        'Look more credible with official .com domain (handled by admin) and promotional features. Lifetime website access, renew only domain annually.',
      descId:
        'Tampil lebih kredibel dengan domain .com resmi (terima beres) dan fitur promosi penarik pembeli. Website aktif selamanya, perpanjangan hanya untuk domain per tahun.',
      featuresEn: [
        { bold: true, text: 'Free Domain (.com) 1 Year — Setup Handled by Admin' },
        'Lifetime Website Access (Renew Only Domain Annually)',
        'Up to 100 Products/Menu & 20 Categories',
        'Promo Badge, Strikethrough Discount & Flash Sale Timer',
        'Custom Button Labels (Call to Action)',
        "No 'Powered by Growfin' Watermark",
      ],
      featuresId: [
        { bold: true, text: 'Gratis Domain (.com) 1 Tahun — Terima Beres Disetup Admin' },
        'Website Aktif Selamanya (Hanya Perpanjangan Domain Tahunan)',
        'Hingga 100 Produk/Menu & 20 Kategori',
        'Fitur Promo Badge, Diskon Coret & Flash Sale Timer',
        'Kustomisasi Teks Tombol (Call to Action)',
        "Tanpa Watermark 'Powered by Growfin'",
      ],
    },
    {
      id: 'pro-advanced',
      badgeEn: 'For Growing Scale',
      badgeId: 'Katalog Marketplace',
      buttonEn: 'Choose Pro Advanced',
      buttonId: 'Pilih Pro Advanced',
      featuredBadgeEn: 'Most Popular',
      featuredBadgeId: 'Terpopuler',
      isFeatured: true,
      linkKey: 'proAdvanced',
      periodEn: '1 Year Access (Full Access)',
      periodId: 'Aktif 1 Tahun (Full Akses)',
      price: 'Rp 2,49 Jt',
      priceNumeric: 2490000,
      titleEn: 'Pro Advanced',
      titleId: 'Pro Advanced',
      descEn:
        'Marketplace-scale catalog with dynamic price variants, large capacity, and priority setup.',
      descId:
        'Katalog skala marketplace dengan varian harga dinamis, kapasitas besar, dan prioritas setup.',
      featuresEn: [
        { bold: true, text: 'All Pro Basic Features + Official Domain (.com / .id)' },
        'Up to 300 Products/Menu & 50 Categories',
        'Marketplace Catalog: Multi-Variant Price Modifier (+Rp) & Specs Table',
        'Complete Schedule Booking & Reservation System',
        'Content Setup Support & Priority Technical Assistance',
      ],
      featuresId: [
        { bold: true, text: 'Semua Fitur Pro Basic + Domain Resmi (.com / .id)' },
        'Hingga 300 Produk/Menu & 50 Kategori',
        'Katalog Marketplace: Multi-Varian Beda Harga (+Rp) & Tabel Spesifikasi',
        'Sistem Booking Jadwal / Reservasi Lengkap',
        'Dukungan Setup Konten & Prioritas Teknis Admin',
      ],
    },
    {
      id: 'enterprise',
      badgeEn: 'Enterprise Scale',
      badgeId: 'Skala Perusahaan',
      buttonEn: 'Consult Enterprise',
      buttonId: 'Konsultasi Enterprise',
      descEn: 'Custom systems built from scratch for complex requirements.',
      descId: 'Sistem kustom yang dibangun dari nol (from scratch) untuk kebutuhan kompleks.',
      isFeatured: false,
      linkKey: 'enterprise',
      periodEn: 'Project based',
      periodId: 'Project based',
      priceEn: 'Starts at 15M+',
      priceId: 'Mulai 15 Jt+',
      priceNumeric: 15000000,
      titleEn: 'Enterprise',
      titleId: 'Enterprise',
      featuresEn: [
        'Custom Software Architecture',
        'AI Model Integration (Gemini/GPT)',
        'Microservices & Cloud Systems',
        'Priority Technical Support',
      ],
      featuresId: [
        'Arsitektur Software Khusus',
        'Integrasi Model AI (Gemini/GPT)',
        'Sistem Microservices & Cloud',
        'Dukungan Teknis Prioritas',
      ],
    },
  ],
}
