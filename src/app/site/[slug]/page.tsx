import type { Metadata } from 'next'

import type { PackageTier } from '@/lib/site-config'

import { notFound } from 'next/navigation'

import { DynamicThemeProvider } from '@/components/demo/DynamicThemeProvider'
import { ExpiredSiteScreen } from '@/components/demo/ExpiredSiteScreen'
import { GlobalClickTracker } from '@/components/demo/GlobalClickTracker'
import { GrowfinWatermark } from '@/components/demo/GrowfinWatermark'
import { PACKAGE_LIMITS } from '@/lib/site-config'
import { getStorefrontDataBySlug } from '@/lib/storefront/loader'
import { mapTenantToBusinessDemo, resolveArchetype } from '@/lib/storefront/mapper'
import { renderStorefrontArchetype } from '@/lib/storefront/renderer'
import { buildLocalBusinessJsonLd, buildSiteMetadata } from '@/lib/storefront/seo'

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

  const { tenant } = data
  const now = new Date()
  const isLocked = tenant.status === 'locked'
  const isExpired = Boolean(tenant.siteActiveUntil && new Date(tenant.siteActiveUntil) < now)

  if (isLocked || isExpired) {
    return <ExpiredSiteScreen businessName={tenant.name} />
  }

  if (tenant.status !== 'published') {
    notFound()
  }

  const templateType = resolveArchetype(tenant.category)
  const genericClient = mapTenantToBusinessDemo(data)

  const activeTier: PackageTier = (tenant.packageTier as PackageTier) || 'instan'
  const tierLimits = PACKAGE_LIMITS[activeTier] || PACKAGE_LIMITS.instan

  const jsonLd = buildLocalBusinessJsonLd(tenant, genericClient, templateType)
  const demoComponent = renderStorefrontArchetype(
    templateType,
    genericClient,
    tenant.themeConfig?.layoutId,
  )

  return (
    <DynamicThemeProvider themeColor={genericClient.themeColor}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <GlobalClickTracker businessId={tenant.id} />
      {demoComponent}
      {!tierLimits.removeBranding && <GrowfinWatermark />}
    </DynamicThemeProvider>
  )
}
