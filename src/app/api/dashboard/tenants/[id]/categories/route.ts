import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import { createCategory, getTenantCategories } from '@/lib/dashboard/mutations'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().optional(),
  sortOrder: z.number().int().optional(),
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
  const categoriesList = await getTenantCategories(id, session.user.id)

  if (categoriesList === null) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ categories: categoriesList })
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = createCategorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const created = await createCategory(id, session.user.id, parsed.data)

  if (!created) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ category: created }, { status: 201 })
}
