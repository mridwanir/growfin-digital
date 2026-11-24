import type { BrandingContent, OperatingHours, ThemeConfig } from '@/db/schema/tenants'

import { z } from 'zod'

export const generateInputSchema = z.object({
  name: z.string().trim().min(1, { message: 'Business name is required' }),
  googleMapsUrl: z.url().optional(),
  mapsUrl: z.url().optional(),
})

export type GenerateInput = z.infer<typeof generateInputSchema>

function parseNumericInteger(val: number | string): number {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? Math.round(val) : 0
  }
  const digits = val.replace(/[^\d-]/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}

const numericPriceSchema = z.union([z.number(), z.string()]).transform(parseNumericInteger)

const generatedVariantOptionSchema = z.object({
  label: z.string().trim().min(1, { message: 'Variant option label is required' }),
  priceModifier: z.union([z.number(), z.string()]).transform(parseNumericInteger).default(0),
  sortOrder: z.number().int().optional().default(0),
})

const generatedVariantSchema = z.object({
  name: z.string().trim().min(1, { message: 'Variant name is required' }),
  options: z.array(generatedVariantOptionSchema).default([]),
  required: z.boolean().optional().default(false),
})

const generatedProductSchema = z.object({
  name: z.string().trim().min(1, { message: 'Product name is required' }),
  basePrice: numericPriceSchema,
  categoryName: z.string().trim().optional(),
  description: z.string().trim().optional().default(''),
  duration: z.number().int().nullable().optional(),
  imageGallery: z.array(z.string()).optional().default([]),
  imageUrl: z.string().nullable().optional(),
  originalPrice: numericPriceSchema.nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
  stock: z.number().int().nullable().optional(),
  variants: z.array(generatedVariantSchema).optional().default([]),
  specifications: z
    .array(
      z.object({
        label: z.string().trim(),
        value: z.string().trim(),
      }),
    )
    .optional()
    .default([]),
})

const generatedCategorySchema = z.object({
  name: z.string().trim().min(1, { message: 'Category name is required' }),
  slug: z.string().trim().optional(),
  sortOrder: z.number().int().optional().default(0),
})

const generatedBusinessMetadataSchema = z.object({
  name: z.string().trim().min(1, { message: 'Business name is required' }),
  address: z.string().trim().optional().default(''),
  brandingContent: z.custom<BrandingContent>().optional().default({}),
  category: z.string().trim().default('Retail'),
  city: z.string().trim().optional().default(''),
  googleMapsUrl: z.string().trim().optional(),
  operatingHours: z.custom<OperatingHours>().optional().default({}),
  phone: z.string().trim().optional().default(''),
  tagline: z.string().trim().optional(),
  themeConfig: z.custom<ThemeConfig>().optional().default({}),
})

export const generatedWebsiteSchema = z.object({
  business: generatedBusinessMetadataSchema,
  products: z.array(generatedProductSchema).min(1, { message: 'At least one product is required' }),
  categories: z
    .array(generatedCategorySchema)
    .min(1, { message: 'At least one category is required' }),
})

export type GeneratedWebsiteData = z.infer<typeof generatedWebsiteSchema>

export { generateTenantSlug } from './slug'
