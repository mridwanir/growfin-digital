import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { StorefrontPreviewClient } from '@/components/storefront/preview-client'
import { getStorefrontDraftDataBySlug } from '@/lib/storefront/loader'
import { serializeRecord } from '@/lib/storefront/serialization'
// oxlint-disable-next-line react/only-export-components -- Next.js 16 Route Segment Config for Cache Components
export const instant = false

interface PreviewPageProps {
  params: Promise<{ tenantSlug: string }>
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { tenantSlug } = await params
  const data = await getStorefrontDraftDataBySlug(tenantSlug)

  if (!data) {
    return { title: 'Storefront Not Found' }
  }

  return {
    title: `Preview: ${data.tenant.name}`,
    robots: {
      follow: false,
      index: false,
    },
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { tenantSlug } = await params
  const data = await getStorefrontDraftDataBySlug(tenantSlug)

  if (!data) {
    notFound()
  }

  const { categories, config, products, tenant } = data

  return (
    <StorefrontPreviewClient
      categories={serializeRecord(categories)}
      config={serializeRecord(config)}
      products={serializeRecord(products)}
      tenant={serializeRecord(tenant)}
    />
  )
}
