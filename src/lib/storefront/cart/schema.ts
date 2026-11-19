import { z } from 'zod'

export const CART_STORAGE_VERSION = 1

export const CartLineItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePrice: z.number().optional(),
  hash: z.string().optional(),
  notes: z.string().optional(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  selectedAddons: z.array(z.string()).optional(),
  selectedVariants: z.record(z.string(), z.string()).optional(),
  subtotal: z.number().int().nonnegative(),
  unitPrice: z.number().int().nonnegative().optional(),
})

export const PersistedCartStateSchema = z.object({
  items: z.array(CartLineItemSchema),
  tenantId: z.string(),
})

export const PersistedCartStorageSchema = z.object({
  state: PersistedCartStateSchema,
  version: z.literal(CART_STORAGE_VERSION),
})

export type PersistedCartState = z.infer<typeof PersistedCartStateSchema>
