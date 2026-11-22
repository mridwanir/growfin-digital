import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { Category } from '@/db/schema/catalog'

export const mockFnbCategories: Category[] = [
  {
    id: 'cat-fnb-1',
    name: 'Kopi & Minuman',
    slug: 'kopi-dan-minuman',
    sortOrder: 1,
    tenantId: 'fnb-tenant-123',
  },
  {
    id: 'cat-fnb-2',
    name: 'Makanan & Snack',
    slug: 'makanan-dan-snack',
    sortOrder: 2,
    tenantId: 'fnb-tenant-123',
  },
]

export const mockFnbProduct: ProductWithVariants = {
  id: 'prod-coffee-1',
  name: 'Kopi Susu Gula Aren',
  basePrice: 20000,
  categoryId: 'cat-fnb-1',
  description: 'Espresso dengan susu segar dan gula aren asli',
  imageUrl: 'https://images.unsplash.com/photo-coffee',
  originalPrice: 25000,
  addons: [
    { id: 'addon-shot', name: 'Ekstra Shot', price: 4000 },
    { id: 'addon-jelly', name: 'Jelly Karamel', price: 3000 },
  ],
  imageGallery: [
    'https://images.unsplash.com/photo-coffee-1',
    'https://images.unsplash.com/photo-coffee-2',
  ],
  variants: [
    {
      id: 'var-size',
      name: 'Ukuran',
      required: true,
      options: [
        { id: 'opt-reg', label: 'Regular', priceModifier: 0 },
        { id: 'opt-lrg', label: 'Large', priceModifier: 5000 },
      ],
    },
    {
      id: 'var-temp',
      name: 'Suhu',
      required: true,
      options: [
        { id: 'opt-cold', label: 'Dingin', priceModifier: 0 },
        { id: 'opt-hot', label: 'Panas', priceModifier: 0 },
      ],
    },
  ],
}

export const mockSimpleProduct: ProductWithVariants = {
  id: 'prod-snack-1',
  name: 'Donat Cokelat',
  basePrice: 12000,
  categoryId: 'cat-fnb-2',
  description: 'Donat kentang empuk dengan meses cokelat tebal',
  imageUrl: 'https://images.unsplash.com/photo-donut',
  originalPrice: null,
}

export const mockRetailProduct: ProductWithVariants = {
  id: 'prod-retail-1',
  name: 'Overdose Boxy Tee',
  basePrice: 185000,
  categoryId: 'cat-ret-1',
  description: 'Heavyweight cotton 24s oversized fit t-shirt',
  imageUrl: 'https://images.unsplash.com/photo-tee',
  originalPrice: 220000,
}

export const mockStorefrontTenant = {
  id: 'fnb-tenant-123',
  name: 'Kopi Artisan Senopati',
  category: 'Cafe & Coffee Shop',
  fulfillmentModes: ['DINE_IN', 'TAKEAWAY', 'PICKUP', 'DELIVERY'] as const,
  phone: '081234567890',
  waNumber: '6281234567890',
  brandingContent: {
    waNumber: '6281234567890',
  },
  themeConfig: {
    fulfillmentModes: ['DINE_IN', 'TAKEAWAY', 'PICKUP', 'DELIVERY'],
  },
}
