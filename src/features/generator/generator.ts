import { resolveArchetype } from '@/features/storefront'
import { env } from '@/lib/env'

import { generateWithGemini } from './gemini'
import { persistGeneratedWebsite } from './persistence'
import { generateInputSchema } from './schema'

import 'server-only'

export type GenerateWebsiteDraftResult =
  | {
      previewUrl: string
      slug: string
      success: true
      tenant: {
        id: string
        name: string
        category: string | null
        slug: string
        status: string
      }
    }
  | {
      error: string
      status: number
      success: false
    }

export async function generateStorefrontDraft(input: unknown): Promise<GenerateWebsiteDraftResult> {
  const validationResult = generateInputSchema.safeParse(input)
  if (!validationResult.success) {
    const firstIssue = validationResult.error.issues[0]
    return {
      error: firstIssue?.message || 'Invalid input parameters',
      status: 400,
      success: false,
    }
  }

  const validatedInput = validationResult.data
  const generatedData = await generateWithGemini(validatedInput)

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

  return {
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
  }
}
