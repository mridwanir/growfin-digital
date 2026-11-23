import type { Metadata } from 'next'

import { createElement } from 'react'

import { GrowfinWatermark } from '@/components/storefront'
import { StorefrontClientIslands } from '@/components/storefront/client-islands'
import { getStorefrontLayout } from '@/components/storefront/layouts'
import { ThemePreviewBar } from '@/components/storefront/theme-preview-bar'
import { StorefrontCartProvider } from '@/lib/storefront/cart'
import { getMockStorefrontData } from '@/lib/storefront/mock-data'

// oxlint-disable-next-line react/only-export-components -- Next.js 16 Route Segment Config for Cache Components
export const instant = false

interface PreviewPageProps {
  searchParams: Promise<{ theme?: string }>
}

export async function generateMetadata({ searchParams }: PreviewPageProps): Promise<Metadata> {
  const { theme } = await searchParams
  const { selectedTheme, tenant } = getMockStorefrontData(theme)

  return {
    description: `Preview tema ${selectedTheme.label} (${selectedTheme.archetype.toUpperCase()}) - ${selectedTheme.description}`,
    title: `Preview: ${selectedTheme.label} Theme | ${tenant.name}`,
  }
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { theme } = await searchParams
  const { categories, config, products, selectedTheme, tenant } = getMockStorefrontData(theme)

  return (
    <StorefrontCartProvider tenantId={tenant.id}>
      <div className="relative min-h-screen">
        <ThemePreviewBar currentThemeId={selectedTheme.id} />
        {createElement(
          getStorefrontLayout(selectedTheme.id, selectedTheme.archetype),
          { categories, config, products, tenant },
          <StorefrontClientIslands tenant={tenant} />,
          <GrowfinWatermark />,
        )}
      </div>
    </StorefrontCartProvider>
  )
}
