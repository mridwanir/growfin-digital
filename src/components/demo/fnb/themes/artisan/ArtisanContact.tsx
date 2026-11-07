import {
  MessageCircle,
  CalendarCheck,
  Camera,
  Share2,
  Mail,
  MapPin,
  Clock,
  Phone,
  Navigation,
  UtensilsCrossed,
} from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ArtisanContact() {
  const { client, isOpenNow } = useFnbDemo()

  const handleWaClick = (msg: string) => {
    window.open(`https://wa.me/${client.phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="contact" className="bg-brand-light/30 border-brand-primary/20 border-y py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10 md:flex-row">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="/image/fnb/restaurant/restaurant (6).jpg"
                alt="Admin Reservasi"
                className="border-brand-light h-20 w-20 rounded-full border-4 object-cover"
              />
              <span className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"></span>
            </div>
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                Online & Siap Membantu
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                {client.admin?.name || 'Admin Reservasi'}
              </h3>
              <p className="text-xs text-stone-500">
                {client.admin?.role || 'Concierge & Guest Relations'}
              </p>
              <p className="mt-2 text-xs text-stone-600 italic">
                "
                {client.admin?.sampleChat?.recommendationDesc ||
                  'Butuh meja romantis, VIP Room, atau catering event?'}
                "
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <button
              onClick={() =>
                handleWaClick(
                  `Halo Admin ${client.name}, saya mau tanya ketersediaan meja hari ini.`,
                )
              }
              data-track="whatsapp"
              className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              <MessageCircle className="h-4 w-4" />
              Tanya Admin via WA
            </button>
          </div>
        </div>

        {/* Dynamic Footer Information */}
        <div className="mt-16 border-t border-stone-200 pt-16">
          <div className="grid grid-cols-1 items-start gap-12 border-b border-stone-200 pb-16 text-stone-600 md:grid-cols-3 lg:gap-16">
            {/* Brand & Socials */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-brand-primary flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 shadow-sm">
                  <UtensilsCrossed className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-stone-900">
                    {client.name}
                  </h2>
                  <p className="mt-1 text-xs font-bold tracking-widest text-stone-500 uppercase">
                    {client.category}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed font-medium text-stone-500">{client.tagline}</p>
              <div className="flex gap-3 pt-2">
                {client.socialMedia?.instagram?.active && (
                  <a
                    href={client.socialMedia.instagram.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 transition-colors hover:text-white"
                  >
                    <Camera
                      size={18}
                      className="text-stone-400 transition-colors group-hover/soc:text-white"
                    />
                  </a>
                )}
                {client.socialMedia?.tiktok?.active && (
                  <a
                    href={client.socialMedia.tiktok.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 transition-colors hover:text-white"
                  >
                    <Share2
                      size={18}
                      className="text-stone-400 transition-colors group-hover/soc:text-white"
                    />
                  </a>
                )}
                {client.socialMedia?.facebook?.active && (
                  <a
                    href={client.socialMedia.facebook.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-brand-primary group/soc flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 transition-colors hover:text-white"
                  >
                    <MessageCircle
                      size={18}
                      className="text-stone-400 transition-colors group-hover/soc:text-white"
                    />
                  </a>
                )}
              </div>
            </div>

            {/* Contact & Hours */}
            <div className="space-y-5">
              <h3 className="mb-4 text-lg font-bold text-stone-900">Informasi</h3>
              <div className="flex items-center gap-3">
                <Clock className="text-brand-primary h-5 w-5 shrink-0" />
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium">{client.hours}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${isOpenNow ? 'border border-emerald-200 bg-emerald-50 text-emerald-600' : 'border border-rose-200 bg-rose-50 text-rose-600'}`}
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
              <h3 className="mb-4 text-lg font-bold text-stone-900">Lokasi</h3>
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
                className="hover:bg-brand-primary inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md sm:w-auto"
              >
                <Navigation className="h-4 w-4" /> Buka Google Maps
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-sm font-medium text-stone-400 md:flex-row md:text-left">
            <p>
              © {new Date().getFullYear()} {client.name}. All rights reserved.
            </p>
            <p>Powered by Growfin Digital</p>
          </div>
        </div>
      </div>
    </section>
  )
}
