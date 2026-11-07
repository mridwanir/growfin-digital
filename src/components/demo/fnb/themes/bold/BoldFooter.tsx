import {
  Camera,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
  Zap,
} from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function BoldFooter() {
  const { client, isOpenNow } = useFnbDemo()
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'F'

  return (
    <footer
      id="contact"
      className="border-t border-neutral-800 bg-neutral-950 py-16 text-neutral-300 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 border-b border-neutral-800 pb-16 md:grid-cols-3 lg:gap-16">
          {/* Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-brand-primary flex h-12 w-12 items-center justify-center rounded-xl text-xl font-extrabold text-white shadow-sm">
                {brandInitial}
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                  {client.name}
                </h2>
                <p className="text-brand-primary mt-1 text-xs font-bold tracking-widest uppercase">
                  {client.category || 'Fast Food Co.'}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-medium text-neutral-400">
              {client.tagline ||
                '100% Australian Wagyu beef, slow-melted aged cheddar, crisp smoked beef bacon. Disajikan panas dan berair.'}
            </p>
            <div className="flex gap-3 pt-2">
              {client.socialMedia?.instagram?.active && (
                <a
                  href={client.socialMedia.instagram.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 transition-colors hover:text-white"
                >
                  <Camera
                    size={18}
                    className="text-neutral-400 transition-colors group-hover/soc:text-white"
                  />
                </a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a
                  href={client.socialMedia.tiktok.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 transition-colors hover:text-white"
                >
                  <Share2
                    size={18}
                    className="text-neutral-400 transition-colors group-hover/soc:text-white"
                  />
                </a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a
                  href={client.socialMedia.facebook.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 transition-colors hover:text-white"
                >
                  <MessageCircle
                    size={18}
                    className="text-neutral-400 transition-colors group-hover/soc:text-white"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-5">
            <h3 className="mb-4 text-lg font-bold text-white">Informasi</h3>
            <div className="flex items-center gap-3">
              <Clock className="text-brand-primary h-5 w-5 shrink-0" />
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">{client.hours}</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${isOpenNow ? 'border border-green-500/20 bg-green-500/10 text-green-400' : 'border border-red-500/20 bg-red-500/10 text-red-400'}`}
                >
                  {isOpenNow ? 'Buka' : 'Tutup'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-primary h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{client.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-brand-primary h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                {client.userEmail || `hello@${client.name.toLowerCase().replace(/\s+/g, '')}.com`}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-5">
            <h3 className="mb-4 text-lg font-bold text-white">Lokasi</h3>
            <div className="mb-6 flex items-start gap-3">
              <MapPin className="text-brand-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm leading-relaxed font-medium">{client.address}</p>
              </div>
            </div>
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-brand-primary inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:shadow-lg sm:w-auto"
            >
              <Navigation className="h-4 w-4" /> Buka Google Maps
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-sm font-medium text-neutral-500 md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} {client.name}. All rights reserved.
          </p>
          <p>Powered by Growfin Digital</p>
        </div>
      </div>
    </footer>
  )
}
