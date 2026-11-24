'use client'

import type {
  CatalogSectionContent,
  FooterSectionContent,
  GallerySectionContent,
  HeroSectionContent,
  OperatingHoursSectionContent,
  ReviewsSectionContent,
  SectionType,
} from '@/db/schema/storefront'

import { cn } from 'cn'

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useStorefrontEditor } from './context'

const SECTION_TITLES: Record<SectionType, string> = {
  catalog: 'Catalog section',
  footer: 'Footer section',
  gallery: 'Gallery section',
  hero: 'Hero section',
  operating_hours: 'Operating hours section',
  reviews: 'Reviews section',
}
function isHeroSectionContent(content: unknown): content is HeroSectionContent {
  return typeof content === 'object' && content !== null && !Array.isArray(content)
}

function isCatalogSectionContent(content: unknown): content is CatalogSectionContent {
  return typeof content === 'object' && content !== null && !Array.isArray(content)
}

function isReviewsSectionContent(content: unknown): content is ReviewsSectionContent {
  return typeof content === 'object' && content !== null && !Array.isArray(content)
}

function isGallerySectionContent(content: unknown): content is GallerySectionContent {
  return typeof content === 'object' && content !== null && !Array.isArray(content)
}

function isOperatingHoursSectionContent(content: unknown): content is OperatingHoursSectionContent {
  return typeof content === 'object' && content !== null && !Array.isArray(content)
}

function isFooterSectionContent(content: unknown): content is FooterSectionContent {
  return typeof content === 'object' && content !== null && !Array.isArray(content)
}

function getHeroContent(content: unknown): HeroSectionContent {
  return isHeroSectionContent(content) ? content : {}
}

function getCatalogContent(content: unknown): CatalogSectionContent {
  return isCatalogSectionContent(content) ? content : {}
}

function getReviewsContent(content: unknown): ReviewsSectionContent {
  return isReviewsSectionContent(content) ? content : {}
}

function getGalleryContent(content: unknown): GallerySectionContent {
  return isGallerySectionContent(content) ? content : {}
}

function getOperatingHoursContent(content: unknown): OperatingHoursSectionContent {
  return isOperatingHoursSectionContent(content) ? content : {}
}

function getFooterContent(content: unknown): FooterSectionContent {
  return isFooterSectionContent(content) ? content : {}
}

export interface StorefrontEditorInspectorProps {
  className?: string
}

export function StorefrontEditorInspector({ className }: StorefrontEditorInspectorProps) {
  const { sections, selectedSectionId, updateSectionContent } = useStorefrontEditor()

  const selectedSection = sections.find(s => s.id === selectedSectionId)

  if (!selectedSection) {
    return (
      <aside
        aria-label="Section inspector"
        className={cn('bg-background flex w-80 shrink-0 flex-col border-l p-4', className)}
        data-slot="storefront-editor-inspector"
      >
        <p className="text-muted-foreground text-center text-sm">
          Select a section to edit its content.
        </p>
      </aside>
    )
  }

  const sectionTitle = SECTION_TITLES[selectedSection.type] ?? 'Section settings'
  const rawContent = selectedSection.content
  const heroContent = getHeroContent(rawContent)
  const catalogContent = getCatalogContent(rawContent)
  const reviewsContent = getReviewsContent(rawContent)
  const galleryContent = getGalleryContent(rawContent)
  const hoursContent = getOperatingHoursContent(rawContent)
  const footerContent = getFooterContent(rawContent)
  return (
    <aside
      aria-label="Section inspector"
      className={cn('bg-background flex w-80 shrink-0 flex-col border-l', className)}
      data-slot="storefront-editor-inspector"
    >
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{sectionTitle}</h2>
        <p className="text-muted-foreground text-xs">
          Edit text, copywriting, and options for this section.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <FieldGroup>
          {selectedSection.type === 'hero' && (
            <>
              <Field>
                <FieldLabel htmlFor="hero-title">Title</FieldLabel>
                <Input
                  id="hero-title"
                  value={heroContent.title ?? ''}
                  onChange={e =>
                    updateSectionContent<HeroSectionContent>(selectedSection.id, {
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="hero-subtitle">Subtitle</FieldLabel>
                <Input
                  id="hero-subtitle"
                  value={heroContent.subtitle ?? ''}
                  onChange={e =>
                    updateSectionContent<HeroSectionContent>(selectedSection.id, {
                      subtitle: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="hero-description">Description</FieldLabel>
                <Textarea
                  id="hero-description"
                  value={heroContent.description ?? ''}
                  onChange={e =>
                    updateSectionContent<HeroSectionContent>(selectedSection.id, {
                      description: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="hero-primary-button">Primary button text</FieldLabel>
                <Input
                  id="hero-primary-button"
                  value={heroContent.primaryButtonText ?? ''}
                  onChange={e =>
                    updateSectionContent<HeroSectionContent>(selectedSection.id, {
                      primaryButtonText: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="hero-whatsapp-button">WhatsApp button text</FieldLabel>
                <Input
                  id="hero-whatsapp-button"
                  value={heroContent.whatsappButtonText ?? ''}
                  onChange={e =>
                    updateSectionContent<HeroSectionContent>(selectedSection.id, {
                      whatsappButtonText: e.target.value,
                    })
                  }
                />
              </Field>

              <Field className="flex items-center justify-between" orientation="horizontal">
                <FieldLabel htmlFor="hero-badge">Show operational badge</FieldLabel>
                <Switch
                  checked={Boolean(heroContent.showOperationalBadge)}
                  id="hero-badge"
                  size="sm"
                  onCheckedChange={checked =>
                    updateSectionContent<HeroSectionContent>(selectedSection.id, {
                      showOperationalBadge: checked,
                    })
                  }
                />
              </Field>
            </>
          )}

          {selectedSection.type === 'catalog' && (
            <>
              <Field>
                <FieldLabel htmlFor="catalog-title">Title</FieldLabel>
                <Input
                  id="catalog-title"
                  value={catalogContent.title ?? ''}
                  onChange={e =>
                    updateSectionContent<CatalogSectionContent>(selectedSection.id, {
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="catalog-description">Description</FieldLabel>
                <Textarea
                  id="catalog-description"
                  value={catalogContent.description ?? ''}
                  onChange={e =>
                    updateSectionContent<CatalogSectionContent>(selectedSection.id, {
                      description: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="catalog-search">Search placeholder</FieldLabel>
                <Input
                  id="catalog-search"
                  value={catalogContent.searchPlaceholder ?? ''}
                  onChange={e =>
                    updateSectionContent<CatalogSectionContent>(selectedSection.id, {
                      searchPlaceholder: e.target.value,
                    })
                  }
                />
              </Field>
            </>
          )}

          {selectedSection.type === 'reviews' && (
            <>
              <Field>
                <FieldLabel htmlFor="reviews-title">Title</FieldLabel>
                <Input
                  id="reviews-title"
                  value={reviewsContent.title ?? ''}
                  onChange={e =>
                    updateSectionContent<ReviewsSectionContent>(selectedSection.id, {
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="reviews-description">Description</FieldLabel>
                <Textarea
                  id="reviews-description"
                  value={reviewsContent.description ?? ''}
                  onChange={e =>
                    updateSectionContent<ReviewsSectionContent>(selectedSection.id, {
                      description: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="reviews-gmaps">Google Maps review link</FieldLabel>
                <Input
                  id="reviews-gmaps"
                  value={reviewsContent.googleMapsUrl ?? ''}
                  onChange={e =>
                    updateSectionContent<ReviewsSectionContent>(selectedSection.id, {
                      googleMapsUrl: e.target.value,
                    })
                  }
                />
              </Field>
            </>
          )}

          {selectedSection.type === 'gallery' && (
            <>
              <Field>
                <FieldLabel htmlFor="gallery-title">Title</FieldLabel>
                <Input
                  id="gallery-title"
                  value={galleryContent.title ?? ''}
                  onChange={e =>
                    updateSectionContent<GallerySectionContent>(selectedSection.id, {
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="gallery-description">Description</FieldLabel>
                <Textarea
                  id="gallery-description"
                  value={galleryContent.description ?? ''}
                  onChange={e =>
                    updateSectionContent<GallerySectionContent>(selectedSection.id, {
                      description: e.target.value,
                    })
                  }
                />
              </Field>
            </>
          )}

          {selectedSection.type === 'operating_hours' && (
            <>
              <Field>
                <FieldLabel htmlFor="hours-title">Title</FieldLabel>
                <Input
                  id="hours-title"
                  value={hoursContent.title ?? ''}
                  onChange={e =>
                    updateSectionContent<OperatingHoursSectionContent>(selectedSection.id, {
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="hours-description">Description</FieldLabel>
                <Textarea
                  id="hours-description"
                  value={hoursContent.description ?? ''}
                  onChange={e =>
                    updateSectionContent<OperatingHoursSectionContent>(selectedSection.id, {
                      description: e.target.value,
                    })
                  }
                />
              </Field>
            </>
          )}

          {selectedSection.type === 'footer' && (
            <Field>
              <FieldLabel htmlFor="footer-tagline">Tagline</FieldLabel>
              <Input
                id="footer-tagline"
                value={footerContent.tagline ?? ''}
                onChange={e =>
                  updateSectionContent<FooterSectionContent>(selectedSection.id, {
                    tagline: e.target.value,
                  })
                }
              />
            </Field>
          )}
        </FieldGroup>
      </div>
    </aside>
  )
}
