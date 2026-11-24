/* oxlint-disable next/no-img-element -- Dynamic storefront images require raw img elements for CDN URLs */
import type {
  BrandingContent,
  HeroSectionContent,
  OperatingHours,
  Tenant,
} from '@/db/schema/tenants'

import { cn } from 'cn'
import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react'

import { resolveTenantWhatsAppNumber } from '../utils/whatsapp'

export interface HeroSectionProps {
  tenant: Tenant
  content?: HeroSectionContent
  variant?: 'default' | 'centered' | 'split' | 'minimal' | 'bold'
  catalogAnchorId?: string
  className?: string
}

export function Hero({
  tenant,
  content,
  variant = 'default',
  catalogAnchorId = 'catalog',
  className,
}: HeroSectionProps) {
  const branding =
    'brandingContent' in tenant ? (tenant.brandingContent as BrandingContent) || {} : {}
  const operatingHours = (tenant.operatingHours as OperatingHours) || {}

  const name = content?.title || tenant.name || 'Storefront'
  const tagline = content?.subtitle || branding.tagline || branding.heroSubtitle || ''
  const description =
    content?.description ||
    (content?.subtitle ? '' : branding.heroTitle) ||
    branding.heroSubtitle ||
    branding.tagline ||
    ''
  const heroImageUrl =
    content?.heroImageUrl ||
    branding.heroImageUrl ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'
  const logoUrl = content?.logoUrl || branding.logoUrl || null
  const iconEmoji = content?.iconEmoji || branding.iconEmoji || '🏪'
  const effectiveCatalogAnchorId = content?.catalogAnchorId || catalogAnchorId
  const primaryButtonText = content?.primaryButtonText || 'Lihat Produk & Menu'
  const whatsappButtonText = content?.whatsappButtonText || 'WhatsApp'
  const showOperationalBadge = content?.showOperationalBadge ?? true
  const isOpen = operatingHours.isOpen !== false
  const openTime = operatingHours.openTime || '08:00'
  const closeTime = operatingHours.closeTime || '21:00'
  const hoursText = operatingHours.raw || `${openTime} - ${closeTime}`

  const waNumber = resolveTenantWhatsAppNumber(tenant)
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(name)},%20saya%20tertarik%20dengan%20produk%20Anda.`
    : undefined

  // Operational Badge component
  const operationalBadge = (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs backdrop-blur-md"
      data-slot="operational-badge"
    >
      <span className="relative flex size-2">
        {isOpen && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex size-2 rounded-full',
            isOpen ? 'bg-emerald-500' : 'bg-rose-500',
          )}
        />
      </span>
      <span>{isOpen ? `Buka Sekarang • ${hoursText}` : 'Sedang Tutup'}</span>
    </div>
  )

  const lightOperationalBadge = (
    <div
      className="border-border/60 bg-muted/70 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs"
      data-slot="operational-badge"
    >
      <span className="relative flex size-2">
        {isOpen && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex size-2 rounded-full',
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
        className={cn('bg-background relative w-full overflow-hidden py-12 md:py-20', className)}
        data-slot="storefront-hero"
        id="hero"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              {showOperationalBadge && lightOperationalBadge}
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img
                    alt={name}
                    className="border-border size-16 rounded-2xl border object-cover shadow-sm"
                    src={logoUrl}
                  />
                ) : (
                  <div className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-sm">
                    {iconEmoji || name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
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
                  className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90"
                  href={`#${effectiveCatalogAnchorId}`}
                >
                  <ShoppingBag className="size-4" />
                  <span>{primaryButtonText}</span>
                  <ArrowRight className="size-4" />
                </a>
                {waUrl && (
                  <a
                    className="border-border bg-card text-card-foreground hover:bg-accent inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold shadow-xs transition-all hover:-translate-y-0.5"
                    href={waUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MessageCircle className="size-4" />
                    <span>{whatsappButtonText}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="border-border/60 relative aspect-4/3 w-full overflow-hidden rounded-3xl border shadow-xl lg:aspect-square">
              <img
                alt={name}
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
                src={heroImageUrl}
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
      data-slot="storefront-hero"
      id="hero"
      className={cn(
        'relative flex min-h-[480px] w-full items-center justify-center overflow-hidden py-20 text-white md:min-h-[580px]',
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <img alt={name} className="size-full object-cover" loading="eager" src={heroImageUrl} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        {showOperationalBadge && <div className="mb-6">{operationalBadge}</div>}

        <div className="mb-6 flex flex-col items-center gap-4">
          {logoUrl ? (
            <img
              alt={name}
              className="size-20 rounded-full border-2 border-white/60 object-cover shadow-xl"
              src={logoUrl}
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full border-2 border-white/60 bg-white/20 text-3xl font-bold shadow-xl backdrop-blur-md">
              {iconEmoji || name.charAt(0)}
            </div>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {name}
          </h1>
          {tagline && (
            <p className="max-w-xl text-lg font-medium text-stone-200 sm:text-xl">{tagline}</p>
          )}
        </div>

        {description && description !== tagline && (
          <p className="mb-8 max-w-lg text-sm text-stone-300 sm:text-base">{description}</p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
            href={`#${effectiveCatalogAnchorId}`}
          >
            <ShoppingBag className="size-5" />
            <span>{content?.primaryButtonText || 'Lihat Menu & Katalog'}</span>
          </a>
          {waUrl && (
            <a
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-6 py-3.5 text-base font-semibold text-stone-900 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white"
              href={waUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="size-5" />
              <span>{whatsappButtonText}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
