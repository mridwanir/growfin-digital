import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import { createProduct, getTenantProducts } from '@/lib/dashboard/mutations'

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

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  basePrice: z.number().int().min(0, 'Base price must be a non-negative integer'),
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
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const productsList = await getTenantProducts(id, session.user.id)

  if (productsList === null) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ products: productsList })
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = createProductSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const created = await createProduct(id, session.user.id, parsed.data)

  if (!created) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ product: created }, { status: 201 })
}
