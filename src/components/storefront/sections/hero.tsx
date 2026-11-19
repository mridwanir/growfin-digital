import type { Tenant, BrandingContent, OperatingHours } from '@/db/schema/tenants'

import { cn } from 'cn'
import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react'
import { normalizeWaNumber } from '@/lib/storefront/whatsapp'

export interface HeroSectionProps {
  tenant: Tenant
  variant?: 'default' | 'centered' | 'split' | 'minimal' | 'bold'
  catalogAnchorId?: string
  className?: string
}

export function Hero({
  tenant,
  variant = 'default',
  catalogAnchorId = 'catalog',
  className,
}: HeroSectionProps) {
  const branding = (tenant.brandingContent as BrandingContent) || {}
  const operatingHours = (tenant.operatingHours as OperatingHours) || {}

  const name = tenant.name || 'Storefront'
  const tagline = branding.tagline || branding.heroSubtitle || ''
  const description = branding.heroTitle || branding.heroSubtitle || branding.tagline || ''
  const heroImageUrl =
    branding.heroImageUrl ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'
  const logoUrl = branding.logoUrl || null
  const iconEmoji = branding.iconEmoji || '🏪'

  const isOpen = operatingHours.isOpen !== false
  const openTime = operatingHours.openTime || '08:00'
  const closeTime = operatingHours.closeTime || '21:00'
  const hoursText = operatingHours.raw || `${openTime} - ${closeTime}`

  const rawWa =
    branding.socialLinks?.whatsapp?.url ||
    (branding['waNumber'] as string) ||
    tenant.phone ||
    ''
  const waNumber = normalizeWaNumber(rawWa)
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(name)},%20saya%20tertarik%20dengan%20produk%20Anda.`
    : undefined

  // Operational Badge component
  const operationalBadge = (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-xs"
      data-slot="operational-badge"
    >
      <span className="relative flex h-2 w-2">
        {isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            isOpen ? 'bg-emerald-500' : 'bg-rose-500',
          )}
        />
      </span>
      <span>{isOpen ? `Buka Sekarang • ${hoursText}` : 'Sedang Tutup'}</span>
    </div>
  )

  const lightOperationalBadge = (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/70 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs"
      data-slot="operational-badge"
    >
      <span className="relative flex h-2 w-2">
        {isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            isOpen ? 'bg-emerald-500' : 'bg-rose-500',
          )}
        />
      </span>
      <span>{isOpen ? `Buka Sekarang • ${hoursText}` : 'Sedang Tutup'}</span>
    </div>
  )

  if (variant === 'split') {
    return (
      <section
        id="hero"
        className={cn('relative w-full overflow-hidden bg-background py-12 md:py-20', className)}
        data-slot="storefront-hero"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              {lightOperationalBadge}
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={name}
                    className="h-16 w-16 rounded-2xl border border-border object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-sm">
                    {iconEmoji || name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    {name}
                  </h1>
                  {tagline && (
                    <p className="text-muted-foreground mt-1 text-sm font-medium sm:text-base">
                      {tagline}
                    </p>
                  )}
                </div>
              </div>

              {description && description !== tagline && (
                <p className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg">
                  {description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={`#${catalogAnchorId}`}
                  className="bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Lihat Produk & Menu</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-border bg-card text-card-foreground hover:bg-accent inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold shadow-xs transition-all hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border/60 shadow-xl lg:aspect-square">
              <img
                src={heroImageUrl}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default / Centered / Bold
  return (
    <header
      id="hero"
      className={cn(
        'relative flex min-h-[480px] w-full items-center justify-center overflow-hidden py-20 text-white md:min-h-[580px]',
        className,
      )}
      data-slot="storefront-hero"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageUrl}
          alt={name}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <div className="mb-6">{operationalBadge}</div>

        <div className="mb-6 flex flex-col items-center gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="h-20 w-20 rounded-full border-2 border-white/60 object-cover shadow-xl"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/60 bg-white/20 text-3xl font-bold backdrop-blur-md shadow-xl">
              {iconEmoji || name.charAt(0)}
            </div>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {name}
          </h1>
          {tagline && (
            <p className="max-w-xl text-lg font-medium text-stone-200 sm:text-xl">
              {tagline}
            </p>
          )}
        </div>

        {description && description !== tagline && (
          <p className="mb-8 max-w-lg text-sm text-stone-300 sm:text-base">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`#${catalogAnchorId}`}
            className="bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Lihat Menu & Katalog</span>
          </a>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-6 py-3.5 text-base font-semibold text-stone-900 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
