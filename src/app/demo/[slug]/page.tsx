import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { DynamicThemeProvider } from '@/components/demo/DynamicThemeProvider'
import { ExpiredSiteScreen } from '@/components/demo/ExpiredSiteScreen'
import { GrowfinWatermark } from '@/components/demo/GrowfinWatermark'
import { env } from '@/lib/env'
import { getStorefrontDataBySlug } from '@/lib/storefront/loader'
import { mapTenantToBusinessDemo, resolveArchetype } from '@/lib/storefront/mapper'
import { renderStorefrontArchetype } from '@/lib/storefront/renderer'

// oxlint-disable-next-line react/only-export-components -- Next.js 16 Route Segment Config for Cache Components
export const instant = false

interface DemoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getStorefrontDataBySlug(slug)

  if (!data) {
    return { title: 'Demo Not Found' }
  }

  const clientName = data.tenant.name
  const branding = (data.tenant.brandingContent as Record<string, unknown> | null) || {}
  const description =
    (branding.tagline as string) ||
    `Preview website resmi ${clientName}. Informasi, produk, dan katalog UMKM.`

  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN || 'growfin.my.id'
  const rawImage =
    (branding.logoUrl as string) ||
    (branding.heroImage as string) ||
    '/image/landing/growfin-logo-icon.png'

  const imageUrl = rawImage.startsWith('http')
    ? rawImage
    : `https://${baseDomain}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`

  return {
    description,
    title: `Preview: ${clientName} | Growfin Digital`,
    openGraph: {
      description,
      images: [{ alt: clientName, url: imageUrl }],
      title: `Preview: ${clientName} | Growfin Digital`,
    },
  }
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params
  const data = await getStorefrontDataBySlug(slug)

  if (!data) {
    notFound()
  }

  const { tenant } = data
  const now = new Date()
  const isLocked = tenant.status === 'locked'
  const isExpired =
    (tenant.status === 'published' &&
      Boolean(tenant.siteActiveUntil && new Date(tenant.siteActiveUntil) < now)) ||
    (tenant.status === 'draft' &&
      Boolean(tenant.fomoExpiresAt && new Date(tenant.fomoExpiresAt) < now))

  if (isLocked || isExpired) {
    return <ExpiredSiteScreen businessName={tenant.name} />
  }

  const templateType = resolveArchetype(tenant.category)
  const genericClient = mapTenantToBusinessDemo(data)
  const demoComponent = renderStorefrontArchetype(
    templateType,
    genericClient,
    tenant.themeConfig?.layoutId,
  )

  return (
    <DynamicThemeProvider themeColor={genericClient.themeColor}>
      {demoComponent}
      <GrowfinWatermark />
    </DynamicThemeProvider>
  )
}
