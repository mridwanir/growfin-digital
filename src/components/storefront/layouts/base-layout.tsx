import type { BrandingContent, ThemeConfig } from '@/db/schema/tenants'
import type { BaseStorefrontLayoutProps } from './types'

import { cn } from 'cn'

import { ProductCatalog } from '@/components/storefront/catalog'
import {
  Footer,
  Gallery,
  Hero,
  OperatingHours,
  Reviews,
} from '@/components/storefront/sections'
import { DynamicThemeProvider } from '@/components/storefront/theme'
import { isSectionVisible } from '@/lib/section-utils'

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
        return (
          <Hero
            key={id}
            tenant={tenant}
            variant={heroVariant}
          />
        )

      case 'menu':
      case 'katalog':
      case 'catalog':
      case 'products':
        return (
          <section
            key={id}
            id="catalog"
            className="w-full py-12 md:py-20"
            data-slot="catalog-section"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ProductCatalog.Root
                categories={categories}
                products={products}
              >
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                      {branding.menuTitle ||
                        (tenant.category === 'retail' ? 'Katalog Produk' : 'Menu Pilihan')}
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
                  variant={categoryVariant}
                  className="mb-8"
                  allLabel="Semua"
                />

                <ProductCatalog.Grid cols={gridCols} gap={gridGap}>
                  {product => (
                    <ProductCatalog.Card
                      key={product.id}
                      product={product}
                      radius={cardRadius}
                      variant={cardVariant}
                      density={cardDensity}
                    />
                  )}
                </ProductCatalog.Grid>

                <ProductCatalog.Empty />
              </ProductCatalog.Root>
            </div>
          </section>
        )

      case 'gallery':
      case 'lookbook':
        return (
          <Gallery
            key={id}
            tenant={tenant}
            variant={galleryVariant}
          />
        )

      case 'reviews':
      case 'testimoni':
        return (
          <Reviews
            key={id}
            tenant={tenant}
            variant={reviewsVariant}
          />
        )

      case 'hours':
      case 'operatingHours':
      case 'operating-hours':
        return (
          <OperatingHours
            key={id}
            tenant={tenant}
          />
        )

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
      themeColor={themeConfig.themeColor}
      className={cn(resolvedFontFamily, className)}
    >
      <div
        className={cn(
          'relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground antialiased',
          containerClassName,
        )}
        data-slot="storefront-layout-shell"
      >
        <main className="flex-1">
          {order.map(sectionId => renderSection(sectionId))}
        </main>

        {shouldRenderFooter && <Footer tenant={tenant} />}

        {children}
      </div>
    </DynamicThemeProvider>
  )
}
