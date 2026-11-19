import type { Metadata } from 'next'

import type { PackageTier } from '@/lib/site-config'

import { notFound } from 'next/navigation'

import {
  ExpiredSiteScreen,
  GlobalClickTracker,
  GrowfinWatermark,
  StorefrontClientIslands,
} from '@/components/storefront'
import { getStorefrontLayout } from '@/components/storefront/layouts'
import { PACKAGE_LIMITS } from '@/lib/site-config'
import { StorefrontCartProvider } from '@/lib/storefront/cart'
import { getStorefrontDataBySlug } from '@/lib/storefront/loader'
import {
  buildLocalBusinessJsonLd,
  buildSiteMetadata,
  resolveArchetype,
} from '@/lib/storefront/seo'

// oxlint-disable-next-line react/only-export-components -- Next.js 16 Route Segment Config for Cache Components
export const instant = false

interface SitePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getStorefrontDataBySlug(slug)

  if (!data) {
    return { title: 'Site Not Found' }
  }

  const { tenant } = data
  const now = new Date()
  const isLockedOrExpired =
    tenant.status === 'locked' ||
    (Boolean(tenant.siteActiveUntil) && new Date(tenant.siteActiveUntil!) < now)

  if (isLockedOrExpired) {
    return {
      description: `Website resmi ${tenant.name} sedang dalam masa pembaruan layanan.`,
      robots: { follow: false, index: false },
      title: `${tenant.name} - Masa Pembaruan Layanan`,
    }
  }

  if (tenant.status !== 'published') {
    return { title: 'Site Not Found' }
  }

  return buildSiteMetadata(tenant)
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params
  const data = await getStorefrontDataBySlug(slug)

  if (!data) {
    notFound()
  }

  const { categories, products, tenant } = data
  const now = new Date()
  const isLocked = tenant.status === 'locked'
  const isExpired = Boolean(tenant.siteActiveUntil && new Date(tenant.siteActiveUntil) < now)

  if (isLocked || isExpired) {
    return <ExpiredSiteScreen businessName={tenant.name} />
  }

  if (tenant.status !== 'published') {
    notFound()
  }

  const archetype = resolveArchetype(tenant.category)
  const LayoutComponent = getStorefrontLayout(tenant.themeConfig?.layoutId, archetype)

  const activeTier: PackageTier = (tenant.packageTier as PackageTier) || 'instan'
  const tierLimits = PACKAGE_LIMITS[activeTier] || PACKAGE_LIMITS.instan

  const jsonLd = buildLocalBusinessJsonLd(tenant, archetype)

  return (
    <StorefrontCartProvider tenantId={tenant.id}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <GlobalClickTracker businessId={tenant.id} />
      <LayoutComponent tenant={tenant} categories={categories} products={products}>
        <StorefrontClientIslands tenant={tenant} />
        {!tierLimits.removeBranding && <GrowfinWatermark />}
      </LayoutComponent>
    </StorefrontCartProvider>
  )
}
