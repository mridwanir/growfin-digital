export const STORE_CATEGORIES = [
  'Makanan & Minuman (F&B)',
  'Fashion & Pakaian',
  'Kebutuhan Sehari-hari / Toko Kelontong',
  'Elektronik & Gadget',
  'Kecantikan & Perawatan',
  'Jasa & Layanan',
  'Lainnya',
] as const

export type StoreCategory = (typeof STORE_CATEGORIES)[number]
