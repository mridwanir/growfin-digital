import type { BaseStorefrontLayoutProps } from './types'
import type { BrandingContent, ThemeConfig } from '@/db/schema/tenants'

import { cn } from 'cn'

import { ProductCatalog } from '@/components/storefront/catalog'
import { Footer, Gallery, Hero, OperatingHours, Reviews } from '@/components/storefront/sections'
import { DynamicThemeProvider } from '@/components/storefront/theme'
import { isSectionVisible } from '@/lib/section-utils'
import { resolveArchetype } from '@/lib/storefront/archetype'

export function BaseStorefrontLayout({
  tenant,
  categories = [],
  products = [],
  children,
  fontFamily = 'font-sans',
  cardRadius = 'default',
  cardVariant = 'outline',
  cardDensity = 'default',
  gridCols = 4,
  gridGap = 'default',
  categoryVariant = 'pills',
  heroVariant = 'default',
  galleryVariant = 'grid',
  reviewsVariant = 'grid',
  defaultSectionOrder = ['hero', 'menu', 'gallery', 'reviews', 'hours'],
  className,
  containerClassName,
}: BaseStorefrontLayoutProps) {
  const branding = (tenant.brandingContent as BrandingContent) || {}
  const themeConfig = (tenant.themeConfig as ThemeConfig) || {}

  const order =
    themeConfig.sectionOrder && themeConfig.sectionOrder.length > 0
      ? themeConfig.sectionOrder
      : defaultSectionOrder

  const hidden = themeConfig.hiddenSections

  const resolvedFontFamily = themeConfig.fontFamily || fontFamily

  const renderSection = (id: string) => {
    if (!isSectionVisible(id, hidden)) return null

    switch (id) {
      case 'hero':
        return <Hero key={id} tenant={tenant} variant={heroVariant} />

      case 'menu':
      case 'katalog':
      case 'catalog':
      case 'products':
        return (
          <section
            key={id}
            className="w-full py-12 md:py-20"
            data-slot="catalog-section"
            id="catalog"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ProductCatalog.Root categories={categories} products={products}>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {branding.menuTitle ||
                        (resolveArchetype(tenant.category) === 'retail'
                          ? 'Katalog Produk'
                          : 'Menu Pilihan')}
                    </h2>
                    {branding.menuDescription && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {branding.menuDescription}
                      </p>
                    )}
                  </div>
                  <ProductCatalog.SearchInput placeholder="Cari produk / menu..." />
                </div>
                <ProductCatalog.CategoryBar
                  allLabel="Semua"
                  className="mb-8"
                  variant={categoryVariant}
                />

                <ProductCatalog.Grid
                  cardDensity={cardDensity}
                  cardRadius={cardRadius}
                  cardVariant={cardVariant}
                  cols={gridCols}
                  gap={gridGap}
                />

                <ProductCatalog.Empty />
              </ProductCatalog.Root>
            </div>
          </section>
        )

      case 'gallery':
      case 'lookbook':
        return <Gallery key={id} tenant={tenant} variant={galleryVariant} />

      case 'reviews':
      case 'testimoni':
        return <Reviews key={id} tenant={tenant} variant={reviewsVariant} />

      case 'hours':
      case 'operatingHours':
      case 'operating-hours':
        return <OperatingHours key={id} tenant={tenant} />

      case 'footer':
        return <Footer key={id} tenant={tenant} />

      default:
        return null
    }
  }

  const hasFooterInOrder = order.includes('footer')
  const shouldRenderFooter = !hasFooterInOrder && isSectionVisible('footer', hidden)

  return (
    <DynamicThemeProvider
      className={cn(resolvedFontFamily, className)}
      themeColor={themeConfig.themeColor}
    >
      <div
        data-slot="storefront-layout-shell"
        className={cn(
          'bg-background text-foreground relative flex min-h-screen flex-col overflow-x-hidden antialiased',
          containerClassName,
        )}
      >
        <main className="flex-1">{order.map(sectionId => renderSection(sectionId))}</main>

        {shouldRenderFooter && <Footer tenant={tenant} />}

        {children}
      </div>
    </DynamicThemeProvider>
  )
}
