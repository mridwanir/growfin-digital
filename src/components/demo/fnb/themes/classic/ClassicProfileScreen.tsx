import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Coffee,
  Mail,
  Camera,
  MessageCircle,
  Share2,
} from 'lucide-react'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ClassicProfileScreen() {
  const { client, isOpenNow } = useFnbDemo()
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <footer id="contact" className="scroll-mt-20 bg-slate-900 py-16 text-slate-300 sm:py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl transform px-4 transition-all duration-1000 md:px-8 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      >
        <div className="grid grid-cols-1 items-start gap-12 border-b border-slate-800 pb-16 md:grid-cols-3 lg:gap-16">
          {/* Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="from-brand-primary to-brand-dark flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg">
                <Coffee className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">{client.name}</h2>
                <p className="text-brand-primary mt-1 text-xs font-black tracking-widest uppercase">
                  {client.category}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-medium text-slate-400">{client.tagline}</p>
            <div className="flex gap-3 pt-2">
              {client.socialMedia?.instagram?.active && (
                <a
                  href={client.socialMedia.instagram.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:text-white"
                >
                  <Camera
                    size={18}
                    className="text-slate-400 transition-colors group-hover/soc:text-white"
                  />
                </a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a
                  href={client.socialMedia.tiktok.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:text-white"
                >
                  <Share2
                    size={18}
                    className="text-slate-400 transition-colors group-hover/soc:text-white"
                  />
                </a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a
                  href={client.socialMedia.facebook.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:text-white"
                >
                  <MessageCircle
                    size={18}
                    className="text-slate-400 transition-colors group-hover/soc:text-white"
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
                <p className="text-sm font-medium text-slate-300">{client.hours}</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${isOpenNow ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'}`}
                >
                  {isOpenNow ? 'Buka' : 'Tutup'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-primary h-5 w-5 shrink-0" />
              <p className="text-sm font-medium text-slate-300">{client.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-brand-primary h-5 w-5 shrink-0" />
              <p className="text-sm font-medium text-slate-300">
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
                <p className="text-sm leading-relaxed font-medium text-slate-300">
                  {client.address}
                </p>
              </div>
            </div>
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-brand-primary inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:shadow-lg sm:w-auto"
            >
              <Navigation className="h-4 w-4" /> Buka Google Maps
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-sm font-medium text-slate-500 md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} {client.name}. All rights reserved.
          </p>
          <p>Powered by Growfin Digital</p>
        </div>
      </div>
    </footer>
  )
}
