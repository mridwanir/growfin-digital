export type PackageTier = 'free_trial' | 'instan' | 'pro-basic' | 'pro-advanced' | 'enterprise';

export interface PackageLimits {
  maxProducts: number;
  maxCategories: number;
  customDomain: boolean;
  paymentGateway: boolean;
  bookingSystem: boolean;
  aiRegenerations: number;
}

export const PACKAGE_LIMITS: Record<PackageTier, PackageLimits> = {
  'free_trial': {
    maxProducts: 7,
    maxCategories: 5,
    customDomain: false,
    paymentGateway: false,
    bookingSystem: false,
    aiRegenerations: 3,
  },
  'instan': {
    maxProducts: 10,
    maxCategories: 5,
    customDomain: false,
    paymentGateway: false,
    bookingSystem: false,
    aiRegenerations: 10,
  },
  'pro-basic': {
    maxProducts: 100,
    maxCategories: 20,
    customDomain: true,
    paymentGateway: false,
    bookingSystem: false,
    aiRegenerations: 50,
  },
  'pro-advanced': {
    maxProducts: 200,
    maxCategories: 50,
    customDomain: true,
    paymentGateway: true,
    bookingSystem: true,
    aiRegenerations: 100,
  },
  'enterprise': {
    maxProducts: 1000,
    maxCategories: 100,
    customDomain: true,
    paymentGateway: true,
    bookingSystem: true,
    aiRegenerations: 500,
  }
};

export const siteConfig = {
  contact: {
    whatsappNumber: "6289630352370",
    email: "hello@growfin.my.id",
    // Base URLs for quick chat links
    waLinks: {
      instan: "https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Template%20Instan.",
      proBasic: "https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Pro%20Basic.",
      proAdvanced: "https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Pro%20Advanced.",
      enterprise: "https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20berkonsultasi%20untuk%20Enterprise%20Solutions.",
    }
  },
  pricing: [
    {
      id: "instan",
      badgeEn: "Beginners & SMEs",
      badgeId: "Pemula & UMKM",
      titleEn: "Instant Template",
      titleId: "Template Instan",
      descEn: "Fastest solution. Website live from a template in 24 hours.",
      descId: "Solusi tercepat. Website live dari template dalam 24 jam.",
      price: "Rp 299rb",
      priceNumeric: 299000,
      periodEn: "One-time setup",
      periodId: "Sekali bayar (One-time setup)",
      featuresEn: [
        "1 Premium Business Template",
        "Instant Live (Max 24 Hours)",
        "Basic Customization (Colors)",
        "WhatsApp Integration"
      ],
      featuresId: [
        "1 Template Bisnis Premium",
        "Live Instan (Maks. 24 Jam)",
        "Kustomisasi Dasar (Warna)",
        "Integrasi WhatsApp"
      ],
      linkKey: "instan",
      buttonEn: "Choose Instant Plan",
      buttonId: "Pilih Paket Instan",
      isFeatured: false
    },
    {
      id: "pro-basic",
      badgeEn: "Stand Out",
      badgeId: "Tampil Beda",
      titleEn: "Pro Basic",
      titleId: "Pro Basic",
      descEn: "Custom domain and unique design for stronger branding.",
      descId: "Custom domain dan desain unik untuk branding yang lebih kuat.",
      price: "Rp 999rb",
      priceNumeric: 999000,
      periodEn: "One-time setup",
      periodId: "Sekali bayar (One-time setup)",
      featuresEn: [
        { text: "Free Domain (.com) for 1 Year", bold: true },
        "Design & Layout Modifications",
        "Professional Copywriting",
        "Delivery in 3-5 Days"
      ],
      featuresId: [
        { text: "Gratis Domain (.com) 1 tahun", bold: true },
        "Modifikasi Desain & Layout",
        "Copywriting Profesional",
        "Pengerjaan 3-5 Hari"
      ],
      linkKey: "proBasic",
      buttonEn: "Choose Pro Basic",
      buttonId: "Pilih Pro Basic",
      isFeatured: false
    },
    {
      id: "pro-advanced",
      badgeEn: "For Medium-Scale Businesses",
      badgeId: "Untuk Bisnis Skala Menengah",
      featuredBadgeEn: "Most Popular",
      featuredBadgeId: "Terpopuler",
      titleEn: "Pro Advanced",
      titleId: "Pro Advanced",
      descEn: "Automated operational systems (booking, payment gateways, catalogs).",
      descId: "Sistem operasional otomatis (booking, payment gateway, katalog).",
      price: "Rp 2,49 Jt",
      priceNumeric: 2490000,
      periodEn: "One-time setup",
      periodId: "Sekali bayar (One-time setup)",
      featuresEn: [
        { text: "All Pro Basic Features", bold: true },
        "Payment Gateway Integration",
        "CMS & Database System",
        "Booking / Reservation System",
        "Delivery in 7-14 Days"
      ],
      featuresId: [
        { text: "Semua Fitur Pro Basic", bold: true },
        "Integrasi Payment Gateway",
        "Sistem CMS & Database",
        "Sistem Booking/Reservasi",
        "Pengerjaan 7-14 Hari"
      ],
      linkKey: "proAdvanced",
      buttonEn: "Choose Pro Advanced",
      buttonId: "Pilih Pro Advanced",
      isFeatured: true
    },
    {
      id: "enterprise",
      badgeEn: "Enterprise Scale",
      badgeId: "Skala Perusahaan",
      titleEn: "Enterprise",
      titleId: "Enterprise",
      descEn: "Custom systems built from scratch for complex requirements.",
      descId: "Sistem kustom yang dibangun dari nol (from scratch) untuk kebutuhan kompleks.",
      priceEn: "Starts at 15M+",
      priceId: "Mulai 15 Jt+",
      priceNumeric: 15000000,
      periodEn: "Project based",
      periodId: "Project based",
      featuresEn: [
        "Custom Software Architecture",
        "AI Model Integration (Gemini/GPT)",
        "Microservices & Cloud Systems",
        "Priority Technical Support"
      ],
      featuresId: [
        "Arsitektur Software Khusus",
        "Integrasi Model AI (Gemini/GPT)",
        "Sistem Microservices & Cloud",
        "Dukungan Teknis Prioritas"
      ],
      linkKey: "enterprise",
      buttonEn: "Consult Enterprise",
      buttonId: "Konsultasi Enterprise",
      isFeatured: false
    }
  ]
};
