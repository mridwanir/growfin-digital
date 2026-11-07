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

import { useFnbDemo } from '../../core/FnbDemoContext'

export function PremiumFooter() {
  const { client, isOpenNow } = useFnbDemo()

  return (
    <footer id="contact" className="border-t border-slate-900 bg-slate-950 py-20 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 border-b border-slate-900 pb-16 md:grid-cols-3 lg:gap-16">
          {/* Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-brand-primary flex h-12 w-12 items-center justify-center rounded-none border border-slate-800 bg-slate-900">
                <Coffee className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-widest text-white uppercase">
                  {client.name}
                </h2>
                <div className="bg-brand-primary mt-1 h-0.5 w-8"></div>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-medium text-slate-500">{client.tagline}</p>
            <div className="flex gap-3 pt-2">
              {client.socialMedia?.instagram?.active && (
                <a
                  href={client.socialMedia.instagram.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary hover:border-brand-primary flex h-10 w-10 items-center justify-center rounded-none border border-slate-800 bg-slate-900 transition-colors hover:text-slate-950"
                >
                  <Camera size={18} />
                </a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a
                  href={client.socialMedia.tiktok.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary hover:border-brand-primary flex h-10 w-10 items-center justify-center rounded-none border border-slate-800 bg-slate-900 transition-colors hover:text-slate-950"
                >
                  <Share2 size={18} />
                </a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a
                  href={client.socialMedia.facebook.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-brand-primary hover:border-brand-primary flex h-10 w-10 items-center justify-center rounded-none border border-slate-800 bg-slate-900 transition-colors hover:text-slate-950"
                >
                  <MessageCircle size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-5">
            <h3 className="font-heading mb-4 text-sm font-bold tracking-widest text-white uppercase">
              Information
            </h3>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 shrink-0 text-slate-600" />
              <div className="flex items-center gap-3">
                <p className="text-sm">{client.hours}</p>
                <span
                  className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${isOpenNow ? 'border-emerald-500/30 text-emerald-500' : 'border-slate-700 text-slate-500'}`}
                >
                  {isOpenNow ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-slate-600" />
              <p className="text-sm">{client.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-slate-600" />
              <p className="text-sm">
                {client.userEmail || `hello@${client.name.toLowerCase().replace(/\s+/g, '')}.com`}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-5">
            <h3 className="font-heading mb-4 text-sm font-bold tracking-widest text-white uppercase">
              Location
            </h3>
            <div className="mb-6 flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
              <div>
                <p className="text-sm leading-relaxed">{client.address}</p>
              </div>
            </div>
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-primary inline-flex w-full items-center justify-center gap-2 rounded-none px-6 py-3 text-sm font-bold tracking-wider text-slate-950 uppercase transition-all hover:brightness-110 sm:w-auto"
            >
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-xs font-medium tracking-widest text-slate-600 uppercase md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} {client.name}.
          </p>
          <p className="text-brand-primary">Powered by Growfin</p>
        </div>
      </div>
    </footer>
  )
}
