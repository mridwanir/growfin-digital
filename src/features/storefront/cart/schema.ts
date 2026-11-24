import { z } from 'zod'

export const CART_STORAGE_VERSION = 1

const CartLineItemSchema = z.object({
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
