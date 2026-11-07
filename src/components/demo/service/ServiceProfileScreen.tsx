'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useServiceDemo } from './ServiceDemoContext'

export function ServiceProfileScreen() {
  const { client, setIsScheduleModalOpen, selectedDay, selectedTime } = useServiceDemo()
  const { ref, isVisible } = useScrollReveal(0.1)

  const openBookingModal = () => {
    setIsScheduleModalOpen(true)
  }

  const getWaBookingUrl = () => {
    const treatmentText = 'Treatment Medis'
    const message = `Halo ${client.name}, saya ingin reservasi jadwal treatment *${treatmentText}* untuk hari *${selectedDay}, ${selectedTime} WIB*. Apakah jadwal masih tersedia?`
    return `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <footer id="profil" className="scroll-mt-16 bg-slate-900 py-16 text-slate-300 sm:py-24">
      <div
        ref={ref}
        className={`mx-auto grid max-w-6xl transform gap-12 px-4 transition-all duration-1000 md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:gap-16 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      >
        {/* Left: Brand & Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className={`bg-brand-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl text-white shadow-lg`}
            >
              {client.iconEmoji || '🏥'}
            </div>
            <div>
              <h2 className="text-xl leading-tight font-black text-white">{client.name}</h2>
              <p className={`text-brand-primary mt-0.5 text-xs font-bold`}>{client.category}</p>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">{client.tagline}</p>

          <div className="space-y-3 pt-4 text-sm font-medium">
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <p>{client.address}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🕒</span>
              <p>{client.hours}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📞</span>
              <p>{client.phone}</p>
            </div>
          </div>
        </div>

        {/* Center: Quick Links / Actions */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Akses Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => openBookingModal()}
              className="flex items-center gap-3 rounded-xl bg-slate-800 p-3 text-left text-white transition-colors hover:bg-slate-700"
            >
              <span className="text-xl">📅</span>
              <span className="text-xs font-bold">
                Booking
                <br />
                Jadwal
              </span>
            </button>
            <a
              href={getWaBookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-emerald-800 bg-emerald-900/40 p-3 text-emerald-100 transition-colors hover:bg-emerald-900/60"
            >
              <span className="text-xl">💬</span>
              <span className="text-xs font-bold">
                Chat
                <br />
                WhatsApp
              </span>
            </a>
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 flex items-center gap-3 rounded-xl bg-slate-800 p-3 text-white transition-colors hover:bg-slate-700"
            >
              <span className="text-xl">🗺️</span>
              <span className="text-xs font-bold">Buka Rute Navigasi di Google Maps</span>
            </a>
          </div>
        </div>

        {/* Right: Google Profile Embed Mock */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Google Business Profile</h3>
          <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80"
              alt="Google Maps Profile Banner"
              className="h-32 w-full object-cover opacity-80"
            />
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-white">{client.name}</span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                  ✓ Verified
                </span>
              </div>
              <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <span>⭐ {client.rating.toFixed(1)}</span>
                <span className="text-slate-400">({client.reviewCount}+ Google Reviews)</span>
              </div>
              <div className="space-y-3">
                {client.reviews?.slice(0, 2).map((rev: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rev.authorName}</span>
                      <span className="text-[8px] text-amber-500">
                        {'⭐'.repeat(Math.max(1, Math.min(5, Math.round(Number(rev.rating) || 5))))}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-[11px] text-slate-400 italic">
                      &quot;{rev.text}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl border-t border-slate-800 px-4 pt-8 text-center text-xs text-slate-500 md:px-8">
        <p>Powered by Growfin Digital Templates. All rights reserved.</p>
      </div>
    </footer>
  )
}
