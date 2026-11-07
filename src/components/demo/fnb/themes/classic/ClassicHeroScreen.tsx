import { Utensils, CalendarCheck } from 'lucide-react'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useFnbDemo } from '../../core/FnbDemoContext'

const CAFE_IMAGES = [
  '/image/fnb/mitch-Da1F2k3BFeU-unsplash.jpg',
  '/image/fnb/queensland-australia-7WVpQhFGUqQ-unsplash.jpg',
]

export function ClassicHeroScreen() {
  const { client, isOpenNow, setIsCartModalOpen } = useFnbDemo()
  const { ref: contentRef, isVisible: isContentVisible } = useScrollReveal(0.1)

  const getWaReservationUrl = () => {
    return `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20mau%20reservasi%20meja.`
  }

  const heroImg = client.heroImage || '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg'
  const secondaryAction =
    client.heroSecondaryAction || (client.fbType === 'DINE_IN' ? 'whatsapp' : 'cart')

  return (
    <header className="relative flex h-[80vh] min-h-[500px] w-full scroll-mt-20 items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt="Fnb Interior" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div
        ref={contentRef}
        className={`relative z-10 mx-auto max-w-3xl transform px-4 text-center transition-all duration-1000 ${isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        {/* Real-time Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
          {isOpenNow ? (
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          ) : (
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
            </span>
          )}
          {isOpenNow ? `Buka Sekarang (${client.hours || '08:00 - 22:00'})` : 'Sedang Tutup'}
        </div>

        <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl">
          {client.name.split(' ')[0]} <br />
          <span className="text-brand-primary">
            {client.name.split(' ').slice(1).join(' ') || 'Kenyamanan Sempurna'}
          </span>
        </h1>
        <p className="mb-8 text-lg font-light text-stone-200 md:text-xl">
          {client.tagline ||
            'Nikmati hidangan spesial kami langsung di tempat atau pesan untuk dinikmati di rumah.'}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => {
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/30 flex transform items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-1"
          >
            <Utensils className="h-5 w-5" /> Lihat Menu & Pesan
          </button>

          {secondaryAction === 'whatsapp' ? (
            <a
              href={getWaReservationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex transform items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-stone-900 shadow-lg transition-all hover:-translate-y-1 hover:bg-stone-100"
            >
              <CalendarCheck className="h-5 w-5" /> Reservasi Meja
            </a>
          ) : secondaryAction === 'cart' ? (
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="flex transform items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-stone-900 shadow-lg transition-all hover:-translate-y-1 hover:bg-stone-100"
            >
              <CalendarCheck className="h-5 w-5" /> Cek Pesanan
            </button>
          ) : (
            <button
              onClick={() =>
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex transform items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-stone-900 shadow-lg transition-all hover:-translate-y-1 hover:bg-stone-100"
            >
              <CalendarCheck className="h-5 w-5" /> Lihat Suasana
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
