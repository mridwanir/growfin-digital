import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { env } from '@/lib/env'
import { generateWithGemini } from '@/lib/generator/gemini'
import { persistGeneratedWebsite } from '@/lib/generator/persistence'
import { generateInputSchema } from '@/lib/generator/schema'
import { resolveArchetype } from '@/lib/storefront/mapper'

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 })
    }

    const validationResult = generateInputSchema.safeParse(body)
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]
      return NextResponse.json(
        { error: firstIssue?.message || 'Invalid input parameters' },
        { status: 400 },
      )
    }

    const input = validationResult.data

    const generatedData = await generateWithGemini(input)
    // Map grooming/service categories and layouts to retail archetype
    const archetype = resolveArchetype(generatedData.business.category)
    const currentLayout = generatedData.business.themeConfig?.layoutId
    const isLegacyLayout =
      currentLayout?.startsWith('grooming') || currentLayout?.startsWith('service')
    const needsRetailLayout =
      archetype === 'retail' && (!currentLayout || !currentLayout.startsWith('retail'))

    if (isLegacyLayout || needsRetailLayout) {
      generatedData.business.themeConfig = {
        ...generatedData.business.themeConfig,
        layoutId: 'retail-theme-urban',
      }
    }
    const { tenant } = await persistGeneratedWebsite(generatedData)

    const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN
    const protocol = baseDomain.includes('localhost') ? 'http' : 'https'
    const previewUrl = `${protocol}://${tenant.slug}.${baseDomain}`

    return NextResponse.json({
      previewUrl,
      slug: tenant.slug,
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        category: tenant.category,
        slug: tenant.slug,
        status: tenant.status,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    console.error('Website generation error:', error)

    return NextResponse.json({ error: `Failed to generate website: ${message}` }, { status: 500 })
  }
}
