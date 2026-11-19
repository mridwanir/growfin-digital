import type { Metadata } from 'next'

import type { StorefrontArchetype } from './archetype'
import type { BrandingContent, OperatingHours, Tenant } from '@/db/schema/tenants'

import { env } from '@/lib/env'
export { type StorefrontArchetype, resolveArchetype } from './archetype'


function getFnbBusinessType(cat: string): string {
  if (cat.includes('cafe') || cat.includes('kopi')) return 'CafeOrCoffeeShop'
  if (cat.includes('bakery') || cat.includes('roti')) return 'Bakery'
  return 'Restaurant'
}


export function getLocalBusinessType(
  category: string = '',
  archetype: StorefrontArchetype = 'retail',
): string {
  const cat = category.toLowerCase()
  if (archetype === 'fnb') return getFnbBusinessType(cat)
  return 'Store'
}

export function resolveStorefrontUrls(tenant: Tenant): {
  logoUrl: string
  ogImageUrl: string
  siteUrl: string
} {
  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN || 'growfin.my.id'
  const siteUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://${baseDomain}/${tenant.slug}`

  const branding = (tenant.brandingContent as Record<string, unknown> | null) || {}
  const rawImage =
    (branding.logoUrl as string) ||
    (branding.heroImage as string) ||
    '/image/landing/growfin-logo-icon.png'

  const ogImageUrl = rawImage.startsWith('http')
    ? rawImage
    : `https://${baseDomain}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`

  const logoUrl = branding.logoUrl
    ? (branding.logoUrl as string).startsWith('http')
      ? (branding.logoUrl as string)
      : `https://${baseDomain}${(branding.logoUrl as string).startsWith('/') ? '' : '/'}${branding.logoUrl}`
    : ogImageUrl

  return { logoUrl, ogImageUrl, siteUrl }
}

export function buildSiteMetadata(tenant: Tenant): Metadata {
  const { ogImageUrl, siteUrl } = resolveStorefrontUrls(tenant)
  const branding = (tenant.brandingContent as Record<string, unknown> | null) || {}
  const clientName = tenant.name
  const description =
    (branding.tagline as string) ||
    `Website resmi ${clientName}. Temukan informasi, produk, promo, dan layanan terbaik kami di sini.`

  return {
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: 'website',
      description,
      locale: 'id_ID',
      siteName: clientName,
      title: `${clientName} | Website Resmi`,
      url: siteUrl,
      images: [
        {
          alt: clientName,
          height: 630,
          url: ogImageUrl,
          width: 1200,
        },
      ],
    },
    title: {
      default: `${clientName} | Website Resmi`,
      template: `%s | ${clientName}`,
    },
    twitter: {
      card: 'summary_large_image',
      description,
      images: [ogImageUrl],
      title: `${clientName} | Website Resmi`,
    },
  }
}

export function buildLocalBusinessJsonLd(
  tenant: Tenant,
  archetype: StorefrontArchetype = 'retail',
) {
  const { logoUrl, ogImageUrl, siteUrl } = resolveStorefrontUrls(tenant)
  const branding = (tenant.brandingContent as BrandingContent | null) || {}
  const operatingHours = (tenant.operatingHours as OperatingHours | null) || {}

  const description =
    branding.tagline ||
    branding.heroSubtitle ||
    `Website resmi ${tenant.name}`

  return {
    name: tenant.name,
    '@context': 'https://schema.org',
    '@type': getLocalBusinessType(tenant.category, archetype),
    description,
    image: ogImageUrl,
    logo: logoUrl,
    priceRange: '$$',
    telephone: tenant.phone || undefined,
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
      addressLocality: tenant.city || 'Indonesia',
      streetAddress: tenant.address || (tenant.city ? `${tenant.city}, Indonesia` : 'Indonesia'),
    },
    ...(tenant.googleMapsUrl ? { hasMap: tenant.googleMapsUrl } : {}),
    ...(operatingHours.openTime && operatingHours.closeTime
      ? {
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            closes: operatingHours.closeTime,
            opens: operatingHours.openTime,
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
          },
        ],
      }
      : {}),
  }
}
