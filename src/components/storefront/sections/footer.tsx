import type { Tenant, BrandingContent } from '@/db/schema/tenants'

import { cn } from 'cn'
import {
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from 'lucide-react'

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

  const rawWa =
    branding.socialLinks?.whatsapp?.url ||
    (branding['waNumber'] as string) ||
    tenant.phone ||
    ''
  const cleanWa = rawWa.replace(/[^0-9]/g, '')
  const waNumber = cleanWa.startsWith('0') ? `62${cleanWa.slice(1)}` : cleanWa
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
      id="footer"
      className={cn(
        'border-t border-border/60 bg-muted/30 py-12 text-muted-foreground sm:py-16',
        className,
      )}
      data-slot="storefront-footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 md:grid-cols-12 md:gap-8">
          <div className="space-y-4 md:col-span-5">
            <h3 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {name}
            </h3>
            {tagline && (
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {tagline}
              </p>
            )}

            {hasSocials && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-primary flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}

                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-emerald-600 flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}

                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Google Maps"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-blue-600 flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                  </a>
                )}

                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-primary flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </a>
                )}

                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="border-border/60 bg-card hover:bg-accent text-foreground hover:text-primary flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-foreground transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-foreground transition-colors">
                  Katalog & Menu
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-foreground transition-colors">
                  Galeri Foto
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-foreground transition-colors">
                  Ulasan Pelanggan
                </a>
              </li>
              <li>
                <a href="#operating-hours" className="hover:text-foreground transition-colors">
                  Jam Operasional
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-4">
            <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
              Alamat & Kontak
            </h4>
            <div className="space-y-2 text-sm leading-relaxed">
              {address && (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    {address}
                    {city ? `, ${city}` : ''}
                  </span>
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{phone}</span>
                </p>
              )}
              {googleMapsUrl && (
                <div className="pt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p className="text-muted-foreground/80">Powered by Growfin Digital</p>
        </div>
      </div>
    </footer>
  )
}
