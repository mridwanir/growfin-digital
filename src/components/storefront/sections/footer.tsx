import type { BrandingContent, Tenant } from '@/db/schema/tenants'

import { cn } from 'cn'
import { ExternalLink, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'

import { resolveTenantWhatsAppNumber } from '@/lib/storefront/whatsapp'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export interface FooterSectionProps {
  tenant: Tenant
  className?: string
}

const CURRENT_YEAR = new Date().getFullYear()

export function Footer({ tenant, className }: FooterSectionProps) {
  const branding = (tenant.brandingContent as BrandingContent) || {}

  const name = tenant.name || 'Storefront'
  const tagline = branding.tagline || branding.heroSubtitle || ''
  const address = tenant.address || null
  const city = tenant.city || null
  const phone = tenant.phone || null
  const googleMapsUrl = tenant.googleMapsUrl || null

  const instagramUrl =
    branding.socialLinks?.instagram?.url ||
    (branding['socialMedia'] as Record<string, { url?: string }> | undefined)?.instagram?.url ||
    null

  const waNumber = resolveTenantWhatsAppNumber(tenant)
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  const facebookUrl =
    branding.socialLinks?.facebook?.url ||
    (branding['socialMedia'] as Record<string, { url?: string }> | undefined)?.facebook?.url ||
    null

  const tiktokUrl =
    branding.socialLinks?.tiktok?.url ||
    (branding['socialMedia'] as Record<string, { url?: string }> | undefined)?.tiktok?.url ||
    null

  const hasSocials = Boolean(instagramUrl || waUrl || googleMapsUrl || facebookUrl || tiktokUrl)

  return (
    <footer
      data-slot="storefront-footer"
      id="footer"
      className={cn(
        'border-border/60 bg-muted/30 text-muted-foreground border-t py-12 sm:py-16',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 md:grid-cols-12 md:gap-8">
          <div className="space-y-4 md:col-span-5">
            <h3 className="text-foreground text-xl font-extrabold tracking-tight sm:text-2xl">
              {name}
            </h3>
            {tagline && (
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{tagline}</p>
            )}

            {hasSocials && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {instagramUrl && (
                  <a
                    aria-label="Instagram"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                    href={instagramUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <InstagramIcon className="size-4" />
                  </a>
                )}

                {waUrl && (
                  <a
                    aria-label="WhatsApp"
                    className="border-border/60 bg-card hover:bg-accent text-foreground flex size-10 items-center justify-center rounded-xl border shadow-xs transition-colors hover:text-emerald-600"
                    href={waUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MessageCircle className="size-4" />
                  </a>
                )}

                {googleMapsUrl && (
                  <a
                    aria-label="Google Maps"
                    className="border-border/60 bg-card hover:bg-accent text-foreground flex size-10 items-center justify-center rounded-xl border shadow-xs transition-colors hover:text-blue-600"
                    href={googleMapsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MapPin className="size-4" />
                  </a>
                )}

                {facebookUrl && (
                  <a
                    aria-label="Facebook"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                    href={facebookUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Share2 className="size-4" />
                  </a>
                )}

                {tiktokUrl && (
                  <a
                    aria-label="TikTok"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                    href={tiktokUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 md:col-span-3">
            <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-foreground transition-colors" href="#hero">
                  Beranda
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#catalog">
                  Katalog & Menu
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#gallery">
                  Galeri Foto
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#reviews">
                  Ulasan Pelanggan
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#operating-hours">
                  Jam Operasional
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-4">
            <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Alamat & Kontak
            </h4>
            <div className="space-y-2 text-sm leading-relaxed">
              {address && (
                <p className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <span>
                    {address}
                    {city ? `, ${city}` : ''}
                  </span>
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-2">
                  <Phone className="text-muted-foreground size-4 shrink-0" />
                  <span>{phone}</span>
                </p>
              )}
              {googleMapsUrl && (
                <div className="pt-2">
                  <a
                    className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    href={googleMapsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-border/60 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row">
          <p>
            © {CURRENT_YEAR} {name}. All rights reserved.
          </p>
          <p className="text-muted-foreground/80">Powered by Growfin Digital</p>
        </div>
      </div>
    </footer>
  )
}
