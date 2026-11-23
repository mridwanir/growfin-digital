/* oxlint-disable next/no-img-element -- Dynamic storefront images require raw img elements for CDN URLs */
import type { BrandingContent, GallerySectionContent, Tenant } from '@/db/schema/tenants'

import { cn } from 'cn'
import { Camera } from 'lucide-react'

export interface GallerySectionProps {
  tenant: Tenant
  content?: GallerySectionContent
  title?: string
  description?: string
  images?: string[]
  variant?: 'grid' | 'masonry' | 'compact'
  className?: string
}

const DEFAULT_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
]

interface LookbookItemData {
  imageUrl: string
  caption?: string
}
function resolveGalleryItems(
  explicitImages?: string[],
  contentImages?: Array<string | { caption?: string; imageUrl: string }>,
  branding: BrandingContent = {},
): LookbookItemData[] {
  if (explicitImages && explicitImages.length > 0) {
    return explicitImages.map(url => ({ imageUrl: url }))
  }

  if (contentImages && contentImages.length > 0) {
    return contentImages.map(item => {
      if (typeof item === 'string') return { imageUrl: item }
      if (item && typeof item === 'object' && 'imageUrl' in item) {
        return {
          caption: typeof item.caption === 'string' ? item.caption : undefined,
          imageUrl: String(item.imageUrl),
        }
      }
      return { imageUrl: DEFAULT_GALLERY_IMAGES[0] }
    })
  }

  const rawLookbook = branding['lookbook']
  if (Array.isArray(rawLookbook) && rawLookbook.length > 0) {
    return rawLookbook.map(item => {
      if (typeof item === 'string') return { imageUrl: item }
      if (item && typeof item === 'object' && 'imageUrl' in item) {
        return {
          caption: typeof item.caption === 'string' ? item.caption : undefined,
          imageUrl: String(item.imageUrl),
        }
      }
      return { imageUrl: DEFAULT_GALLERY_IMAGES[0] }
    })
  }

  const rawGallery = branding['imageGallery'] || (branding['images'] as string[])
  if (Array.isArray(rawGallery) && rawGallery.length > 0) {
    return rawGallery.map(url => ({ imageUrl: String(url) }))
  }

  return DEFAULT_GALLERY_IMAGES.map((url, i) => ({
    caption: `Dokumentasi suasana ${i + 1}`,
    imageUrl: url,
  }))
}

export function Gallery({
  tenant,
  content,
  title,
  description,
  images: explicitImages,
  variant = 'grid',
  className,
}: GallerySectionProps) {
  const branding = (tenant.brandingContent as BrandingContent) || {}

  const sectionTitle = title || content?.title || branding.galleryTitle || 'Galeri Foto'
  const sectionDescription =
    description ||
    content?.description ||
    branding.galleryDescription ||
    'Suasana dan dokumentasi terbaik dari tempat kami.'
  const effectiveVariant = content?.variant || variant
  const displayItems = resolveGalleryItems(explicitImages, content?.images, branding)

  return (
    <section
      className={cn('w-full py-12 md:py-20', className)}
      data-slot="storefront-gallery"
      id="gallery"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="text-primary inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
            <Camera className="size-3.5" />
            <span>Dokumentasi & Suasana</span>
          </div>
          <h2 className="text-foreground mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base sm:text-lg">
              {sectionDescription}
            </p>
          )}
        </div>

        {effectiveVariant === 'masonry' ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {displayItems.map((item, idx) => (
              <div
                key={item.imageUrl}
                className={cn(
                  'group border-border/40 bg-muted relative overflow-hidden rounded-2xl border shadow-xs transition-all hover:shadow-md',
                  idx === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square',
                )}
              >
                <img
                  alt={item.caption || `Foto galeri ${idx + 1}`}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  src={item.imageUrl}
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs font-medium text-white">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : effectiveVariant === 'compact' ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {displayItems.slice(0, 6).map((item, idx) => (
              <div
                key={item.imageUrl}
                className="group border-border/40 bg-muted relative aspect-square overflow-hidden rounded-xl border shadow-xs"
              >
                <img
                  alt={item.caption || `Foto galeri ${idx + 1}`}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  src={item.imageUrl}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayItems.slice(0, 6).map((item, idx) => (
              <div
                key={item.imageUrl}
                className="group border-border/40 bg-muted relative aspect-4/3 overflow-hidden rounded-2xl border shadow-xs transition-all duration-300 hover:shadow-md"
              >
                <img
                  alt={item.caption || `Foto galeri ${idx + 1}`}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  src={item.imageUrl}
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent p-4">
                    <p className="text-xs font-semibold text-white drop-shadow-xs">
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
