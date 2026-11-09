import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import { getTenantSettings, updateTenantSettings } from '@/lib/dashboard/mutations'

const updateSettingsSchema = z.object({
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  operatingHours: z
    .object({
      closeTime: z.string().optional(),
      isOpen: z.boolean().optional(),
      openTime: z.string().optional(),
      raw: z.string().optional(),
      schedules: z
        .array(
          z.object({
            close: z.string(),
            closed: z.boolean().optional(),
            day: z.string(),
            open: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
      instagram: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
      tiktok: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
      whatsapp: z.object({ active: z.boolean().optional(), url: z.string() }).optional(),
    })
    .optional(),
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
  const tenant = await getTenantSettings(id, session.user.id)

  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  return NextResponse.json({ tenant })
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = updateSettingsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const updated = await updateTenantSettings(id, session.user.id, parsed.data)

  if (!updated) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    tenant: updated,
  })
}
