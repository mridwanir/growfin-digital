import type { Metadata } from 'next'

import type { StorefrontArchetype } from './archetype'
import type { OperatingHours, Tenant } from '@/db/schema/auth'
import type {
  FooterSectionContent,
  HeroSectionContent,
  OperatingHoursSectionContent,
  StorefrontConfig,
} from '@/db/schema/storefront'

import { env } from '@/lib/env'

export { resolveArchetype, type StorefrontArchetype } from './archetype'

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

function resolveStorefrontUrls(
  tenant: Tenant,
  config?: StorefrontConfig,
): {
  logoUrl: string
  ogImageUrl: string
  siteUrl: string
} {
  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN || 'growfin.my.id'
  const siteUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://${baseDomain}/${tenant.slug}`

  const heroSection = config?.sections?.find(s => s.type === 'hero')
  const heroContent = heroSection?.content as HeroSectionContent | undefined

  const rawImage =
    (heroContent?.logoUrl as string) ||
    (heroContent?.heroImageUrl as string) ||
    (tenant.logo as string) ||
    '/image/landing/growfin-logo-icon.png'
  const ogImageUrl = rawImage.startsWith('http')
    ? rawImage
    : `https://${baseDomain}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`

  const resolvedLogo = (heroContent?.logoUrl as string) || (tenant.logo as string)
  const logoUrl = resolvedLogo
    ? resolvedLogo.startsWith('http')
      ? resolvedLogo
      : `https://${baseDomain}${resolvedLogo.startsWith('/') ? '' : '/'}${resolvedLogo}`
    : ogImageUrl

  return { logoUrl, ogImageUrl, siteUrl }
}

export function buildSiteMetadata(tenant: Tenant, config?: StorefrontConfig): Metadata {
  const { ogImageUrl, siteUrl } = resolveStorefrontUrls(tenant, config)
  const heroSection = config?.sections?.find(s => s.type === 'hero')
  const heroContent = heroSection?.content as HeroSectionContent | undefined
  const footerSection = config?.sections?.find(s => s.type === 'footer')
  const footerContent = footerSection?.content as FooterSectionContent | undefined

  const clientName = tenant.name
  const description =
    footerContent?.tagline ||
    heroContent?.subtitle ||
    heroContent?.description ||
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
  config?: StorefrontConfig,
) {
  const { logoUrl, ogImageUrl, siteUrl } = resolveStorefrontUrls(tenant, config)
  const heroSection = config?.sections?.find(s => s.type === 'hero')
  const heroContent = heroSection?.content as HeroSectionContent | undefined
  const footerSection = config?.sections?.find(s => s.type === 'footer')
  const footerContent = footerSection?.content as FooterSectionContent | undefined
  const operatingHours = (tenant.operatingHours as OperatingHours | null) || {}
  const hoursSection = config?.sections?.find(s => s.type === 'operating_hours')
  const hoursContent = hoursSection?.content as OperatingHoursSectionContent | undefined
  const openTime = hoursContent?.openTime || operatingHours.openTime
  const closeTime = hoursContent?.closeTime || operatingHours.closeTime

  const description =
    footerContent?.tagline || heroContent?.subtitle || `Website resmi ${tenant.name}`
  return {
    name: tenant.name,
    '@context': 'https://schema.org',
    '@type': getLocalBusinessType(tenant.category || undefined, archetype),
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
    ...(openTime && closeTime
      ? {
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              closes: closeTime,
              opens: openTime,
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
