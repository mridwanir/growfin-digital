import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { tenants } from './tenants'

export interface SpecificationItem {
  label: string
  value: string
}

// ---------------------------------------------------------------------------
// Categories Table
// ---------------------------------------------------------------------------
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
  },
  table => [index('categories_tenant_id_idx').on(table.tenantId)],
)

// ---------------------------------------------------------------------------
// Products Table
// ---------------------------------------------------------------------------
export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    basePrice: bigint('base_price', { mode: 'number' }).notNull(), // in Indonesian Rupiah (IDR)
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    description: text('description'),
    duration: integer('duration'), // duration in minutes for services/grooming
    imageGallery: jsonb('image_gallery').$type<string[]>().default([]),
    imageStorageKey: text('image_storage_key'),
    imageUrl: text('image_url'),
    isActive: boolean('is_active').notNull().default(true),
    originalPrice: bigint('original_price', { mode: 'number' }),
    sortOrder: integer('sort_order').notNull().default(0),
    specifications: jsonb('specifications').$type<SpecificationItem[]>().default([]),
    stock: integer('stock'),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
  },
  table => [
    index('products_tenant_id_idx').on(table.tenantId),
    index('products_category_id_idx').on(table.categoryId),
  ],
)

// ---------------------------------------------------------------------------
// Product Variants Table
// ---------------------------------------------------------------------------
export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(), // e.g. "Size", "Storage", "Flavor"
    required: boolean('required').notNull().default(false),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
  },
  table => [index('product_variants_product_id_idx').on(table.productId)],
)

// ---------------------------------------------------------------------------
// Variant Options Table
// ---------------------------------------------------------------------------
export const variantOptions = pgTable(
  'variant_options',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    label: text('label').notNull(), // e.g. "Large", "256 GB"
    priceModifier: bigint('price_modifier', { mode: 'number' }).notNull().default(0), // modifier in IDR
    sortOrder: integer('sort_order').notNull().default(0),
    variantId: uuid('variant_id')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
  },
  table => [index('variant_options_variant_id_idx').on(table.variantId)],
)

export type Category = typeof categories.$inferSelect
export type Product = typeof products.$inferSelect
export type ProductVariant = typeof productVariants.$inferSelect
export type VariantOption = typeof variantOptions.$inferSelect
