import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import { createElement } from 'react'

import {
  ExpiredSiteScreen,
  MeracikWatermark,
  StorefrontClientIslands,
} from '@/components/storefront'
import { getStorefrontLayout } from '@/components/storefront/layouts'
import { env } from '@/lib/env'
import { StorefrontCartProvider } from '@/lib/storefront/cart'
import { extractLegacyBrandingFromSections } from '@/lib/storefront/compatibility'
import { getStorefrontDataBySlug } from '@/lib/storefront/loader'
import { buildLocalBusinessJsonLd, resolveArchetype } from '@/lib/storefront/seo'
// oxlint-disable-next-line react/only-export-components -- Next.js 16 Route Segment Config for Cache Components
export const instant = false

// oxlint-disable react/no-danger -- Structured JSON-LD script for SEO

interface DemoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getStorefrontDataBySlug(slug)

  if (!data) {
    return { title: 'Demo Not Found' }
  }

  const tenantName = data.tenant.name
  const legacyBranding =
    'brandingContent' in data.tenant
      ? (data.tenant.brandingContent as Record<string, unknown> | null)
      : null
  const branding = {
    ...(legacyBranding || {}),
    ...(data.config ? extractLegacyBrandingFromSections(data.config.sections) : {}),
  }
  const description =
    (branding.tagline as string) ||
    `Preview website resmi ${tenantName}. Informasi, produk, dan katalog UMKM.`
  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN || 'growfin.my.id'
  const rawImage =
    (branding.logoUrl as string) ||
    (branding.heroImageUrl as string) ||
    (branding.heroImage as string) ||
    '/image/landing/growfin-logo-icon.png'

  const imageUrl = rawImage.startsWith('http')
    ? rawImage
    : `https://${baseDomain}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`

  return {
    description,
    title: `Preview: ${tenantName} | MeracikWeb`,
    openGraph: {
      description,
      images: [{ alt: tenantName, url: imageUrl }],
      title: `Preview: ${tenantName} | MeracikWeb`,
    },
  }
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params
  const data = await getStorefrontDataBySlug(slug)

  if (!data) {
    notFound()
  }

  const { categories, config, products, tenant } = data
  const now = new Date()
  const isLocked = tenant.status === 'locked'
  const isExpired = Boolean(tenant.siteActiveUntil && new Date(tenant.siteActiveUntil) < now)
  if (isLocked || isExpired) {
    return <ExpiredSiteScreen businessName={tenant.name} />
  }

  const archetype = resolveArchetype(tenant.category)
  const jsonLd = buildLocalBusinessJsonLd(tenant, archetype, config)
  return (
    <StorefrontCartProvider tenantId={tenant.id}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      {createElement(
        getStorefrontLayout(
          config?.theme?.layoutId ||
            ('themeConfig' in tenant
              ? (tenant.themeConfig as { layoutId?: string } | undefined)?.layoutId
              : undefined),
          archetype,
        ),
        { categories, config, products, tenant },
        <StorefrontClientIslands tenant={tenant} />,
        <MeracikWatermark />,
      )}
    </StorefrontCartProvider>
  )
}
