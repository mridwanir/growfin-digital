import type { Metadata } from 'next'

import type { StorefrontArchetype } from './mapper'
import type { Tenant } from '@/db/schema/tenants'
import type { BusinessDemo } from '@/lib/types'

import { env } from '@/lib/env'

function getFnbBusinessType(cat: string): string {
  if (cat.includes('cafe') || cat.includes('kopi')) return 'CafeOrCoffeeShop'
  if (cat.includes('bakery') || cat.includes('roti')) return 'Bakery'
  return 'Restaurant'
}

function getGroomingBusinessType(cat: string): string {
  if (cat.includes('barber') || cat.includes('cukur')) return 'Barbershop'
  if (cat.includes('beauty') || cat.includes('salon')) return 'BeautySalon'
  return 'DaySpa'
}

function getServiceBusinessType(cat: string): string {
  if (cat.includes('klinik') || cat.includes('dokter')) return 'MedicalClinic'
  if (cat.includes('gigi') || cat.includes('dental')) return 'Dentist'
  if (cat.includes('bengkel')) return 'AutoRepair'
  return 'ProfessionalService'
}

export function getLocalBusinessType(
  category: string = '',
  templateType: StorefrontArchetype = 'retail',
): string {
  const cat = category.toLowerCase()
  if (templateType === 'fnb') return getFnbBusinessType(cat)
  if (templateType === 'grooming') return getGroomingBusinessType(cat)
  if (templateType === 'service') return getServiceBusinessType(cat)
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
  client: BusinessDemo,
  templateType: StorefrontArchetype,
) {
  const { logoUrl, ogImageUrl, siteUrl } = resolveStorefrontUrls(tenant)

  return {
    name: client.name,
    '@context': 'https://schema.org',
    '@type': getLocalBusinessType(tenant.category, templateType),
    description: client.tagline || `Website resmi ${client.name}`,
    image: ogImageUrl,
    logo: logoUrl,
    priceRange: '$$',
    telephone: client.phone || client.waNumber || undefined,
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
      addressLocality: client.city || 'Indonesia',
      streetAddress: client.address || `${client.city}, Indonesia`,
    },
    ...(client.googleMapsUrl ? { hasMap: client.googleMapsUrl } : {}),
    ...(client.rating && client.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: client.rating,
            reviewCount: client.reviewCount,
          },
        }
      : {}),
    ...(client.openTime && client.closeTime
      ? {
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              closes: client.closeTime,
              opens: client.openTime,
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
