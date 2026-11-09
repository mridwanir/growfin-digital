import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import { deleteProduct, updateProduct } from '@/lib/dashboard/mutations'

const variantOptionSchema = z.object({
  label: z.string().min(1, 'Option label is required'),
  priceModifier: z.number().int().default(0),
  sortOrder: z.number().int().optional(),
})

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  options: z.array(variantOptionSchema).min(1, 'Variant must have at least one option'),
  required: z.boolean().default(false),
})

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  basePrice: z.number().int().min(0).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  duration: z.number().int().nullable().optional(),
  imageGallery: z.array(z.string()).optional(),
  imageStorageKey: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  originalPrice: z.number().int().nullable().optional(),
  sortOrder: z.number().int().optional(),
  stock: z.number().int().nullable().optional(),
  variants: z.array(variantSchema).optional(),
})

interface RouteParams {
  params: Promise<{ id: string; productId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, productId } = await params
  const body = await request.json().catch(() => null)
  const parsed = updateProductSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const updated = await updateProduct(id, session.user.id, productId, parsed.data)

  if (!updated) {
    return NextResponse.json({ error: 'Product or tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ product: updated })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, productId } = await params
  const success = await deleteProduct(id, session.user.id, productId)

  if (!success) {
    return NextResponse.json({ error: 'Product or tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
