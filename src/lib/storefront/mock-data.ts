import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { Category } from '@/db/schema/catalog'
import type { Tenant } from '@/db/schema/tenants'

export interface ThemeOption {
  id: string
  label: string
  archetype: 'fnb' | 'retail'
  description: string
  color: string
}

export const AVAILABLE_THEMES: ThemeOption[] = [
  // F&B Themes (7)
  {
    id: 'fnb-theme-classic',
    archetype: 'fnb',
    color: '#d97706',
    description: 'Bistro hangat, serif klasik, card rounded-lg',
    label: 'Classic',
  },
  {
    id: 'fnb-theme-modern',
    archetype: 'fnb',
    color: '#059669',
    description: 'Clean sans-serif, elevated cards, category pills',
    label: 'Modern',
  },
  {
    id: 'fnb-theme-premium',
    archetype: 'fnb',
    color: '#b45309',
    description: 'Luxury serif, sharp borders, ghost category bar',
    label: 'Premium',
  },
  {
    id: 'fnb-theme-artisan',
    archetype: 'fnb',
    color: '#78350f',
    description: 'Warm cafe vibe, masonry gallery, elevated cards',
    label: 'Artisan',
  },
  {
    id: 'fnb-theme-elegant',
    archetype: 'fnb',
    color: '#4338ca',
    description: 'Fine dining typography, 4-column catalog grid',
    label: 'Elegant',
  },
  {
    id: 'fnb-theme-bold',
    archetype: 'fnb',
    color: '#dc2626',
    description: 'High-contrast branding, bold hero, sharp borders',
    label: 'Bold',
  },
  {
    id: 'fnb-theme-vibrant',
    archetype: 'fnb',
    color: '#ea580c',
    description: 'Energetic full-rounded cards, cheerful styling',
    label: 'Vibrant',
  },

  // Retail Themes (6)
  {
    id: 'retail-theme-urban',
    archetype: 'retail',
    color: '#09090b',
    description: 'Streetwear aesthetic, split hero, rounded-lg cards',
    label: 'Urban',
  },
  {
    id: 'retail-theme-editorial',
    archetype: 'retail',
    color: '#18181b',
    description: 'High-fashion boutique, serif typography, sharp cards',
    label: 'Editorial',
  },
  {
    id: 'retail-theme-tech',
    archetype: 'retail',
    color: '#2563eb',
    description: 'Gadget minimalist, compact cards, ghost tabs',
    label: 'Tech',
  },
  {
    id: 'retail-theme-dark',
    archetype: 'retail',
    color: '#030712',
    description: 'Midnight theme, dark tokens, elevated cards',
    label: 'Dark',
  },
  {
    id: 'retail-theme-fresh',
    archetype: 'retail',
    color: '#16a34a',
    description: 'Clean organic market, full-rounded cards, pills bar',
    label: 'Fresh',
  },
  {
    id: 'retail-theme-artisan',
    archetype: 'retail',
    color: '#854d0e',
    description: 'Handcrafted goods, warm serif typography',
    label: 'Retail Artisan',
  },
]

// ---------------------------------------------------------------------------
// Mock Categories
// ---------------------------------------------------------------------------

const mockFnbCategories: Category[] = [
  {
    id: 'cat-espresso',
    name: 'Espresso Based',
    slug: 'espresso-based',
    sortOrder: 0,
    tenantId: 'mock-fnb-tenant',
  },
  {
    id: 'cat-manual-brew',
    name: 'Manual Brew & Tea',
    slug: 'manual-brew-tea',
    sortOrder: 1,
    tenantId: 'mock-fnb-tenant',
  },
  {
    id: 'cat-pastry',
    name: 'Pastry & Bites',
    slug: 'pastry-bites',
    sortOrder: 2,
    tenantId: 'mock-fnb-tenant',
  },
]

const mockRetailCategories: Category[] = [
  {
    id: 'cat-tshirts',
    name: 'T-Shirts & Tops',
    slug: 't-shirts-tops',
    sortOrder: 0,
    tenantId: 'mock-retail-tenant',
  },
  {
    id: 'cat-outerwear',
    name: 'Jackets & Hoodies',
    slug: 'jackets-hoodies',
    sortOrder: 1,
    tenantId: 'mock-retail-tenant',
  },
  {
    id: 'cat-accessories',
    name: 'Accessories & Bags',
    slug: 'accessories-bags',
    sortOrder: 2,
    tenantId: 'mock-retail-tenant',
  },
]

// ---------------------------------------------------------------------------
// Mock Products (With Variants & Simple Items)
// ---------------------------------------------------------------------------

const mockFnbProducts: ProductWithVariants[] = [
  {
    id: 'fnb-prod-1',
    name: 'Kopi Susu Gula Aren',
    basePrice: 22000,
    categoryId: 'cat-espresso',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageStorageKey: null,
    isActive: true,
    originalPrice: 28000, // 21% off
    sortOrder: 0,
    stock: 50,
    tenantId: 'mock-fnb-tenant',
    updatedAt: new Date('2026-01-01'),
    description:
      'Espresso ganda dari biji kopi Arabika Ciwidey dengan susu segar dan sirup gula aren organik asli.',
    imageGallery: [
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    variants: [
      {
        id: 'var-size',
        name: 'Ukuran Gelas',
        productId: 'fnb-prod-1',
        required: true,
        options: [
          {
            id: 'opt-reg',
            label: 'Regular (12 oz)',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-size',
          },
          {
            id: 'opt-lrg',
            label: 'Large (16 oz)',
            priceModifier: 6000,
            sortOrder: 1,
            variantId: 'var-size',
          },
        ],
      },
      {
        id: 'var-temp',
        name: 'Suhu Penyajian',
        productId: 'fnb-prod-1',
        required: true,
        options: [
          {
            id: 'opt-ice',
            label: 'Dingin (Iced)',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-temp',
          },
          {
            id: 'opt-hot',
            label: 'Hangat (Hot)',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-temp',
          },
        ],
      },
      {
        id: 'var-sugar',
        name: 'Tingkat Manis',
        productId: 'fnb-prod-1',
        required: false,
        options: [
          {
            id: 'opt-sug-normal',
            label: 'Normal (100%)',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-sugar',
          },
          {
            id: 'opt-sug-less',
            label: 'Less Sugar (50%)',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-sugar',
          },
          {
            id: 'opt-sug-none',
            label: 'No Sugar (0%)',
            priceModifier: 0,
            sortOrder: 2,
            variantId: 'var-sugar',
          },
        ],
      },
      {
        id: 'var-milk',
        name: 'Pilihan Susu',
        productId: 'fnb-prod-1',
        required: false,
        options: [
          {
            id: 'opt-fresh',
            label: 'Fresh Milk',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-milk',
          },
          {
            id: 'opt-oat',
            label: 'Oat Milk (+Rp 8.000)',
            priceModifier: 8000,
            sortOrder: 1,
            variantId: 'var-milk',
          },
          {
            id: 'opt-almond',
            label: 'Almond Milk (+Rp 10.000)',
            priceModifier: 10000,
            sortOrder: 2,
            variantId: 'var-milk',
          },
        ],
      },
    ],
  },
  {
    id: 'fnb-prod-2',
    name: 'Manual Brew V60 Gayo',
    basePrice: 28000,
    categoryId: 'cat-manual-brew',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: null,
    sortOrder: 1,
    stock: 25,
    tenantId: 'mock-fnb-tenant',
    updatedAt: new Date('2026-01-01'),
    description:
      'Single origin Aceh Gayo diseduh manual dengan metode V60 pour over. Karakter floral, citrus, dan honey finish.',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    variants: [
      {
        id: 'var-beans',
        name: 'Proses Pasca Panen',
        productId: 'fnb-prod-2',
        required: true,
        options: [
          {
            id: 'opt-washed',
            label: 'Washed Process',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-beans',
          },
          {
            id: 'opt-natural',
            label: 'Natural Anaerobic (+Rp 4.000)',
            priceModifier: 4000,
            sortOrder: 1,
            variantId: 'var-beans',
          },
        ],
      },
    ],
  },
  {
    id: 'fnb-prod-3',
    name: 'Kyoto Matcha Latte',
    basePrice: 26000,
    categoryId: 'cat-espresso',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: 30000,
    sortOrder: 2,
    stock: 40,
    tenantId: 'mock-fnb-tenant',
    updatedAt: new Date('2026-01-01'),
    description:
      'Matcha murni dari Uji, Kyoto berpadu dengan susu creamy dan sedikit pemanis madu alami.',
    imageUrl:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    variants: [
      {
        id: 'var-matcha-temp',
        name: 'Suhu Penyajian',
        productId: 'fnb-prod-3',
        required: true,
        options: [
          {
            id: 'opt-m-ice',
            label: 'Iced Matcha',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-matcha-temp',
          },
          {
            id: 'opt-m-hot',
            label: 'Hot Matcha',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-matcha-temp',
          },
        ],
      },
    ],
  },
  {
    id: 'fnb-prod-4',
    name: 'Artisan Butter Croissant',
    basePrice: 18000,
    categoryId: 'cat-pastry',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: 22000,
    sortOrder: 3,
    stock: 15,
    tenantId: 'mock-fnb-tenant',
    updatedAt: new Date('2026-01-01'),
    variants: [], // Simple product: 1-click addition
    description:
      'Croissant khas Prancis dengan 100% butter Elle & Vire. Tekstur luar renyah berlapis dan bagian dalam lembut gurih.',
    imageUrl:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fnb-prod-5',
    name: 'Truffle Parmesan Fries',
    basePrice: 25000,
    categoryId: 'cat-pastry',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: null,
    sortOrder: 4,
    stock: 30,
    tenantId: 'mock-fnb-tenant',
    updatedAt: new Date('2026-01-01'),
    variants: [], // Simple product: 1-click addition
    description:
      'Kentang goreng renyah dengan aroma minyak truffle putih mewah dan taburan keju parmesan parut segar.',
    imageUrl:
      'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
  },
]

const mockRetailProducts: ProductWithVariants[] = [
  {
    id: 'ret-prod-1',
    name: 'Overdose Heavyweight Boxy Tee',
    basePrice: 165000,
    categoryId: 'cat-tshirts',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageStorageKey: null,
    isActive: true,
    originalPrice: 210000, // 21% off
    sortOrder: 0,
    stock: 45,
    tenantId: 'mock-retail-tenant',
    updatedAt: new Date('2026-01-01'),
    description:
      'Kaos siluet boxy oversized berbahan katun combed 24s heavy knit 220 GSM. Kerah tebal rib 1x1, preshrunk, sablon plastisol discharge halus.',
    imageGallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    variants: [
      {
        id: 'var-color',
        name: 'Pilihan Warna',
        productId: 'ret-prod-1',
        required: true,
        options: [
          {
            id: 'opt-c-black',
            label: 'Washed Charcoal Black',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-color',
          },
          {
            id: 'opt-c-white',
            label: 'Vintage Off-White',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-color',
          },
          {
            id: 'opt-c-olive',
            label: 'Military Olive Green',
            priceModifier: 0,
            sortOrder: 2,
            variantId: 'var-color',
          },
        ],
      },
      {
        id: 'var-tee-size',
        name: 'Ukuran Pakaian',
        productId: 'ret-prod-1',
        required: true,
        options: [
          {
            id: 'opt-s',
            label: 'Size S (Lebar 54 cm)',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-tee-size',
          },
          {
            id: 'opt-m',
            label: 'Size M (Lebar 57 cm)',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-tee-size',
          },
          {
            id: 'opt-l',
            label: 'Size L (Lebar 60 cm)',
            priceModifier: 0,
            sortOrder: 2,
            variantId: 'var-tee-size',
          },
          {
            id: 'opt-xl',
            label: 'Size XL (Lebar 63 cm)',
            priceModifier: 10000,
            sortOrder: 3,
            variantId: 'var-tee-size',
          },
        ],
      },
    ],
  },
  {
    id: 'ret-prod-2',
    name: 'Technical Windbreaker Shell Jacket',
    basePrice: 349000,
    categoryId: 'cat-outerwear',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: 429000,
    sortOrder: 1,
    stock: 20,
    tenantId: 'mock-retail-tenant',
    updatedAt: new Date('2026-01-01'),
    description:
      'Jaket anti angin & gerimis ringan dengan material ripstop nylon berteknologi DWR coating. Dilengkapi resleting YKK waterproof dan ventilasi punggung.',
    imageUrl:
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    variants: [
      {
        id: 'var-jacket-size',
        name: 'Ukuran Jaket',
        productId: 'ret-prod-2',
        required: true,
        options: [
          {
            id: 'opt-j-m',
            label: 'Size M',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-jacket-size',
          },
          {
            id: 'opt-j-l',
            label: 'Size L',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-jacket-size',
          },
          {
            id: 'opt-j-xl',
            label: 'Size XL',
            priceModifier: 15000,
            sortOrder: 2,
            variantId: 'var-jacket-size',
          },
        ],
      },
    ],
  },
  {
    id: 'ret-prod-3',
    name: 'Heavyweight Fleece Hoodie',
    basePrice: 289000,
    categoryId: 'cat-outerwear',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: null,
    sortOrder: 2,
    stock: 35,
    tenantId: 'mock-retail-tenant',
    updatedAt: new Date('2026-01-01'),
    description:
      'Hoodie hangat material katun fleece 330 GSM dengan double-layered hood dan saku kangguru beraksen jahitan bartack kokoh.',
    imageUrl:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    variants: [
      {
        id: 'var-hoodie-size',
        name: 'Ukuran',
        productId: 'ret-prod-3',
        required: true,
        options: [
          {
            id: 'opt-h-m',
            label: 'Medium',
            priceModifier: 0,
            sortOrder: 0,
            variantId: 'var-hoodie-size',
          },
          {
            id: 'opt-h-l',
            label: 'Large',
            priceModifier: 0,
            sortOrder: 1,
            variantId: 'var-hoodie-size',
          },
        ],
      },
    ],
  },
  {
    id: 'ret-prod-4',
    name: 'Vintage Corduroy Bucket Hat',
    basePrice: 89000,
    categoryId: 'cat-accessories',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: 119000,
    sortOrder: 3,
    stock: 60,
    tenantId: 'mock-retail-tenant',
    updatedAt: new Date('2026-01-01'),
    variants: [], // Simple item: 1-click addition
    description:
      'Bucket hat corduroy 8-wale dengan bordir logo Overdose minimalis. Nyaman dan stylish untuk aktivitas santai harian.',
    imageUrl:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ret-prod-5',
    name: 'Heavy Duty Canvas Daily Tote',
    basePrice: 75000,
    categoryId: 'cat-accessories',
    createdAt: new Date('2026-01-01'),
    duration: null,
    imageGallery: [],
    imageStorageKey: null,
    isActive: true,
    originalPrice: 95000,
    sortOrder: 4,
    stock: 80,
    tenantId: 'mock-retail-tenant',
    updatedAt: new Date('2026-01-01'),
    variants: [], // Simple item: 1-click addition
    description:
      'Tote bag kanvas tebal 14 oz dengan saku dalam berseleting dan strap bahu ergonomis berpanjang 60 cm.',
    imageUrl:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
]

// ---------------------------------------------------------------------------
// Mock Tenants
// ---------------------------------------------------------------------------

const mockFnbTenant: Tenant = {
  id: 'mock-fnb-tenant',
  name: 'Kopi Artisan Nusantara',
  address: 'Jl. Riau No. 55, Citarum, Kec. Bandung Wetan, Kota Bandung',
  category: 'Coffee Shop & Cafe',
  city: 'Bandung',
  createdAt: new Date('2026-01-01'),
  customDomain: null,
  domainActiveUntil: null,
  fomoExpiresAt: null,
  googleMapsUrl: 'https://maps.google.com/?cid=mock-fnb',
  operatingHours: null,
  organizationId: null,
  packageTier: 'pro',
  phone: '081234567890',
  siteActiveUntil: new Date('2030-01-01'),
  slug: 'kopi-artisan',
  status: 'published',
  updatedAt: new Date('2026-01-01'),
  userId: 'mock-user-1',
  brandingContent: {
    tagline: 'Secangkir Cerita Tiap Hari',
    themeColor: '#d97706',
    description:
      'Spesialis racikan kopi biji pilihan nusantara, manual brew pour over, dan pastry hangat yang dipanggang segar setiap pagi.',
    heroImage:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
    logoUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    lookbookImages: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
    ],
    marketingUsps: [
      { desc: 'Biji kopi pilihan petani lokal Jawa Barat & Aceh', title: '100% Single Origin' },
      { desc: 'Pastry butter Prancis dipanggang fresh tiap pagi', title: 'Fresh Baked Daily' },
      { desc: 'Area ber-AC, colokan melimpah, dan Wi-Fi cepat', title: 'Ruang Nyaman' },
    ],
    operatingHours: {
      closeTime: '22:00',
      openTime: '08:00',
      text: 'Setiap Hari: 08:00 - 22:00 WIB',
      schedules: [
        { day: 'Senin - Jumat', hours: '08:00 - 22:00' },
        { day: 'Sabtu - Minggu', hours: '07:00 - 23:00' },
      ],
    },
    reviews: [
      {
        author: 'Budi Santoso',
        date: '2 hari lalu',
        rating: 5,
        text: 'Kopi Susu Arennya enak banget! Manisnya pas nggak bikin eneg. Tempatnya juga cocok buat WFC berjam-jam.',
      },
      {
        author: 'Siti Rahmawati',
        date: '1 minggu lalu',
        rating: 5,
        text: 'V60 Gayo anaerobiknya juara, aromanya wangi semerbak. Baristanya ramah dan detail ngejelasin proses seduh.',
      },
      {
        author: 'Dimas Pratama',
        date: '2 minggu lalu',
        rating: 5,
        text: 'Croissant butter-nya garing di luar tapi lembut di dalam. Wajib coba bareng cappuccino hangatnya!',
      },
      {
        author: 'Jessica Amanda',
        date: '1 bulan lalu',
        rating: 4,
        text: 'Ambience tenang, playlist musiknya asik. Parkir motor dan mobil gampang.',
      },
    ],
    socialLinks: {
      instagram: { active: true, url: 'https://instagram.com/growfin.id' },
      whatsapp: { active: true, url: 'https://wa.me/6281234567890' },
    },
  },
  themeConfig: {
    fulfillmentModes: ['DINE_IN', 'TAKEAWAY', 'DELIVERY'],
    layoutId: 'fnb-theme-classic',
    themeColor: '#d97706',
  },
}

const mockRetailTenant: Tenant = {
  id: 'mock-retail-tenant',
  name: 'Overdose Streetwear Co.',
  address: 'Jl. Trunojoyo No. 24, Citarum, Kec. Bandung Wetan, Kota Bandung',
  category: 'Clothing & Fashion',
  city: 'Bandung',
  createdAt: new Date('2026-01-01'),
  customDomain: null,
  domainActiveUntil: null,
  fomoExpiresAt: null,
  googleMapsUrl: 'https://maps.google.com/?cid=mock-retail',
  operatingHours: null,
  organizationId: null,
  packageTier: 'pro',
  phone: '081298765432',
  siteActiveUntil: new Date('2030-01-01'),
  slug: 'overdose-streetwear',
  status: 'published',
  updatedAt: new Date('2026-01-01'),
  userId: 'mock-user-2',
  brandingContent: {
    tagline: 'Urban Aesthetic & Everyday Heavyweight Apparel',
    themeColor: '#09090b',
    description:
      'Brand streetwear independen berbasis di Bandung. Menghadirkan siluet boxy kontemporer dengan bahan katun premium berstandar internasional.',
    heroImage:
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1600&q=80',
    logoUrl:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    lookbookImages: [
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    ],
    marketingUsps: [
      {
        desc: 'Material 24s & 16s combed bergramasi tinggi hingga 235 GSM',
        title: 'Heavyweight Cotton',
      },
      {
        desc: 'Pola potongan kontemporer yang pas dan kokoh dipakai seharian',
        title: 'Original Boxy Fit',
      },
      {
        desc: 'Layanan penukaran size mudah tanpa ribet dalam 7 hari kerja',
        title: 'Garansi Tukar Ukuran',
      },
    ],
    operatingHours: {
      closeTime: '21:00',
      openTime: '10:00',
      schedules: [{ day: 'Setiap Hari', hours: '10:00 - 21:00' }],
      text: 'Senin - Minggu: 10:00 - 21:00 WIB',
    },
    reviews: [
      {
        author: 'Reza Fahlevi',
        date: '3 hari lalu',
        rating: 5,
        text: 'Kaos boxy-nya parah sih kualitasnya, kerahnya tebel gak gampang melar abis dicuci. Packaging kardusnya juga niat banget.',
      },
      {
        author: 'Nadia Putri',
        date: '1 minggu lalu',
        rating: 5,
        text: 'Technical jacket-nya keren parah! Pas dipake naik motor malem-malem anget tapi gak gerah.',
      },
      {
        author: 'Aditya Pratama',
        date: '2 minggu lalu',
        rating: 5,
        text: 'Tote bag kanvasnya tebel kuat nampung laptop 15 inch plus buku. Jahitan bartack rapi!',
      },
    ],
    socialLinks: {
      instagram: { active: true, url: 'https://instagram.com/growfin.id' },
      whatsapp: { active: true, url: 'https://wa.me/6281298765432' },
    },
  },
  themeConfig: {
    fulfillmentModes: ['PICKUP', 'DELIVERY'],
    layoutId: 'retail-theme-urban',
    themeColor: '#09090b',
  },
}

// ---------------------------------------------------------------------------
// Storefront Data Resolver
// ---------------------------------------------------------------------------

export interface MockStorefrontData {
  tenant: Tenant
  categories: Category[]
  products: ProductWithVariants[]
  selectedTheme: ThemeOption
}

export function getMockStorefrontData(requestedThemeId?: string | null): MockStorefrontData {
  const selectedTheme = AVAILABLE_THEMES.find(t => t.id === requestedThemeId) || AVAILABLE_THEMES[0]

  const isRetail = selectedTheme.archetype === 'retail'

  const baseTenant = isRetail ? mockRetailTenant : mockFnbTenant
  const categories = isRetail ? mockRetailCategories : mockFnbCategories
  const products = isRetail ? mockRetailProducts : mockFnbProducts

  const tenant: Tenant = {
    ...baseTenant,
    brandingContent: {
      ...(baseTenant.brandingContent as Record<string, unknown>),
      themeColor: selectedTheme.color,
    },
    themeConfig: {
      ...baseTenant.themeConfig,
      layoutId: selectedTheme.id,
      themeColor: selectedTheme.color,
    },
  }

  return {
    categories,
    products,
    selectedTheme,
    tenant,
  }
}
