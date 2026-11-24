import type { BaseStorefrontLayoutProps } from './types'
import type {
  CatalogSectionContent,
  FooterSectionContent,
  GallerySectionContent,
  HeroSectionContent,
  OperatingHoursSectionContent,
  ReviewsSectionContent,
} from '@/db/schema/storefront'

import { cn } from 'cn'

import { isSectionVisible } from '@/lib/section-utils'

import { ProductCatalog } from '../catalog'
import { Footer, Gallery, Hero, OperatingHours, Reviews } from '../sections'
import { resolveArchetype } from '../utils/archetype'
import { DynamicThemeProvider } from './dynamic-theme-provider'

export function BaseStorefrontLayout({
  tenant,
  config,
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
  const sections = config?.sections
  const themeRecord = (config?.theme || {}) as Record<string, unknown>
  const hiddenSections = Array.isArray(themeRecord.hiddenSections)
    ? (themeRecord.hiddenSections as string[])
    : []
  const order =
    Array.isArray(themeRecord.sectionOrder) && (themeRecord.sectionOrder as string[]).length > 0
      ? (themeRecord.sectionOrder as string[])
      : defaultSectionOrder

  const resolvedFontFamily = config?.theme?.fontFamily || fontFamily
  const resolvedThemeColor = config?.theme?.themeColor
  const renderCatalog = (id: string, catalogContent?: CatalogSectionContent) => {
    const title =
      catalogContent?.title ||
      (resolveArchetype(tenant.category) === 'retail' ? 'Katalog Produk' : 'Menu Pilihan')
    const description = catalogContent?.description
    const placeholder = catalogContent?.searchPlaceholder || 'Cari produk / menu...'
    const activeCategoryVariant = catalogContent?.categoryVariant || categoryVariant
    const activeCardDensity = catalogContent?.cardDensity || cardDensity
    const activeCardRadius = catalogContent?.cardRadius || cardRadius
    const activeCardVariant = catalogContent?.cardVariant || cardVariant
    const activeGridCols = (Number(catalogContent?.gridCols) || gridCols) as 1 | 2 | 3 | 4
    const activeGridGap = (catalogContent?.gridGap || gridGap) as 'sm' | 'default' | 'lg'

    return (
      <section key={id} className="w-full py-12 md:py-20" data-slot="catalog-section" id="catalog">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductCatalog.Root categories={categories} products={products}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {title}
                </h2>
                {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
              </div>
              <ProductCatalog.SearchInput placeholder={placeholder} />
            </div>
            <ProductCatalog.CategoryBar
              allLabel="Semua"
              className="mb-8"
              variant={activeCategoryVariant}
            />

            <ProductCatalog.Grid
              cardDensity={activeCardDensity}
              cardRadius={activeCardRadius}
              cardVariant={activeCardVariant}
              cols={activeGridCols}
              gap={activeGridGap}
            />

            <ProductCatalog.Empty />
          </ProductCatalog.Root>
        </div>
      </section>
    )
  }

  const renderSection = (id: string) => {
    if (!isSectionVisible(id, hiddenSections)) return null

    switch (id) {
      case 'hero':
        return <Hero key={id} tenant={tenant} variant={heroVariant} />

      case 'menu':
      case 'katalog':
      case 'catalog':
      case 'products':
        return renderCatalog(id)

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

  let mainContent: React.ReactNode
  let shouldRenderFooter = false
  const footerSectionContent = sections?.find(s => s.type === 'footer')?.content as
    | FooterSectionContent
    | undefined

  if (sections && sections.length > 0) {
    const sortedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder)
    const hasFooterSection = sortedSections.some(s => s.type === 'footer')
    shouldRenderFooter = !hasFooterSection && isSectionVisible('footer', hiddenSections)

    mainContent = sortedSections.map(section => {
      if (!section.isVisible) return null

      switch (section.type) {
        case 'hero':
          return (
            <Hero
              key={section.id}
              content={section.content as HeroSectionContent}
              tenant={tenant}
              variant={heroVariant}
            />
          )

        case 'catalog':
          return renderCatalog(section.id, section.content as CatalogSectionContent)

        case 'gallery':
          return (
            <Gallery
              key={section.id}
              content={section.content as GallerySectionContent}
              tenant={tenant}
              variant={(section.content as GallerySectionContent)?.variant || galleryVariant}
            />
          )

        case 'reviews':
          return (
            <Reviews
              key={section.id}
              content={section.content as ReviewsSectionContent}
              tenant={tenant}
              variant={(section.content as ReviewsSectionContent)?.variant || reviewsVariant}
            />
          )

        case 'operating_hours':
          return (
            <OperatingHours
              key={section.id}
              content={section.content as OperatingHoursSectionContent}
              tenant={tenant}
            />
          )

        case 'footer':
          return (
            <Footer
              key={section.id}
              content={section.content as FooterSectionContent}
              tenant={tenant}
            />
          )

        default:
          return null
      }
    })
  } else {
    const hasFooterInOrder = order.includes('footer')
    shouldRenderFooter = !hasFooterInOrder && isSectionVisible('footer', hiddenSections)
    mainContent = order.map(sectionId => renderSection(sectionId))
  }
  return (
    <DynamicThemeProvider
      className={cn(resolvedFontFamily, className)}
      themeColor={resolvedThemeColor}
    >
      <div
        data-slot="storefront-layout-shell"
        className={cn(
          'bg-background text-foreground relative flex min-h-screen flex-col overflow-x-hidden antialiased',
          containerClassName,
        )}
      >
        <main className="flex-1">{mainContent}</main>

        {shouldRenderFooter && <Footer content={footerSectionContent} tenant={tenant} />}

        {children}
      </div>
    </DynamicThemeProvider>
  )
}
