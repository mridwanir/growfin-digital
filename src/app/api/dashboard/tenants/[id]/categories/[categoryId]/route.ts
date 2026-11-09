import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import { deleteCategory, updateCategory } from '@/lib/dashboard/mutations'

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

interface RouteParams {
  params: Promise<{ id: string; categoryId: string; }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { categoryId, id } = await params
  const body = await request.json().catch(() => null)
  const parsed = updateCategorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const updated = await updateCategory(id, session.user.id, categoryId, parsed.data)

  if (!updated) {
    return NextResponse.json({ error: 'Category or tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ category: updated })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { categoryId, id } = await params
  const success = await deleteCategory(id, session.user.id, categoryId)

  if (!success) {
    return NextResponse.json({ error: 'Category or tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
