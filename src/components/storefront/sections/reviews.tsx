import type { BrandingContent, Tenant } from '@/db/schema/tenants'

import { cn } from 'cn'
import { ExternalLink, Heart, Star } from 'lucide-react'

interface ReviewItemData {
  authorName?: string
  name?: string
  rating: number
  text: string
  time?: string
}

export interface ReviewsSectionProps {
  tenant: Tenant
  title?: string
  description?: string
  reviews?: ReviewItemData[]
  variant?: 'grid' | 'cards' | 'scroll'
  className?: string
}

const DEFAULT_REVIEWS: ReviewItemData[] = [
  {
    authorName: 'Budi Santoso',
    rating: 5,
    text: 'Pelayanan sangat ramah dan kualitas produk luar biasa memuaskan. Sangat direkomendasikan untuk siapa pun yang mencari kualitas terbaik!',
    time: '1 minggu lalu',
  },
  {
    authorName: 'Siti Rahmawati',
    rating: 5,
    text: 'Tempatnya nyaman, suasananya asik, dan pesanan saya disiapkan dengan sangat cepat dan rapi. Pasti akan order lagi di sini.',
    time: '2 minggu lalu',
  },
  {
    authorName: 'Dimas Wicaksono',
    rating: 5,
    text: 'Pengalaman belanja yang praktis langsung lewat WhatsApp. Barangnya sesuai ekspektasi dan respon dari admin sangat cepat.',
    time: '1 bulan lalu',
  },
]

export function Reviews({
  tenant,
  title,
  description,
  reviews: explicitReviews,
  variant = 'grid',
  className,
}: ReviewsSectionProps) {
  const branding = (tenant.brandingContent as BrandingContent) || {}

  const sectionTitle = title || branding.reviewsTitle || 'Ulasan Pelanggan'
  const sectionDescription =
    description ||
    branding.reviewsDescription ||
    'Lihat kepuasan dan testimoni nyata dari para pelanggan setia kami.'

  // Extract reviews
  let displayReviews: ReviewItemData[] = []
  if (explicitReviews && explicitReviews.length > 0) {
    displayReviews = explicitReviews
  } else {
    const rawReviews = branding['reviews']
    if (Array.isArray(rawReviews) && rawReviews.length > 0) {
      displayReviews = rawReviews.map(r => {
        const item = r as Record<string, unknown>
        return {
          rating: typeof item.rating === 'number' ? item.rating : 5,
          text: typeof item.text === 'string' ? item.text : '',
          time: typeof item.time === 'string' ? item.time : undefined,
          authorName:
            typeof item.authorName === 'string'
              ? item.authorName
              : typeof item.name === 'string'
                ? item.name
                : 'Pelanggan',
        }
      })
    } else {
      displayReviews = DEFAULT_REVIEWS
    }
  }

  const googleMapsUrl = tenant.googleMapsUrl || null

  return (
    <section
      className={cn('w-full py-12 md:py-20', className)}
      data-slot="storefront-reviews"
      id="reviews"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <div className="text-primary inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <Heart className="size-3.5 fill-red-500 text-red-500" />
              <span>Testimoni & Pengalaman</span>
            </div>
            <h2 className="text-foreground mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className="text-muted-foreground mt-2 max-w-2xl text-base">{sectionDescription}</p>
            )}
          </div>

          {googleMapsUrl && (
            <a
              className="text-primary hover:text-primary/80 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold hover:underline"
              href={googleMapsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Ulasan Google Maps</span>
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>

        <div
          className={cn(
            variant === 'scroll'
              ? 'flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6'
              : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {displayReviews.map(review => {
            const author = review.authorName || review.name || 'Pelanggan'
            const initial = author.charAt(0).toUpperCase()
            const ratingScore = Math.min(5, Math.max(1, Math.round(review.rating || 5)))

            return (
              <div
                key={`${author}-${review.time || ''}-${review.text.slice(0, 16)}`}
                data-slot="review-card"
                className={cn(
                  'border-border/60 bg-card text-card-foreground flex flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md',
                  variant === 'scroll' && 'w-80 shrink-0 snap-start',
                )}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                        {initial}
                      </div>
                      <div>
                        <h4 className="text-foreground text-sm font-bold">{author}</h4>
                        {review.time && (
                          <span className="text-muted-foreground text-xs">{review.time}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`star-${author}-${i + 1}`}
                          className={cn(
                            'size-4',
                            i < ratingScore
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/30',
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
