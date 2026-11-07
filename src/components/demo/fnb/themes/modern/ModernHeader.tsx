import { ArrowRight } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ModernHeader() {
  const { client, isOpenNow, setIsCartModalOpen } = useFnbDemo()
  const heroImage = client.heroImage || '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg'
  const secondaryAction = client.heroSecondaryAction || 'gallery'

  const getWaReservationUrl = () => {
    return `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20mau%20reservasi%20meja.`
  }

  return (
    <header className="relative flex min-h-[90vh] w-full flex-col bg-white lg:flex-row">
      <div className="z-10 order-2 flex w-full items-center justify-center bg-white p-8 lg:order-1 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-xl">
          <div className="bg-brand-primary/10 border-brand-primary/20 text-brand-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm">
            {isOpenNow ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="bg-brand-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                  <span className="bg-brand-primary relative inline-flex h-2.5 w-2.5 rounded-full"></span>
                </span>
                Buka • {client.hours || '08:00 - 22:00'}
              </>
            ) : (
              'Tutup Saat Ini'
            )}
          </div>

          <h1 className="mb-6 text-4xl leading-tight font-extrabold text-stone-900 lg:text-6xl">
            {client.name.split(' ')[0]}
            <br />{' '}
            <span className="text-brand-primary">{client.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-stone-500">
            {client.tagline ||
              'Rasakan pengalaman kuliner modern dengan sentuhan bahan lokal terbaik.'}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() =>
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-brand-primary flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold text-white shadow-xl shadow-stone-900/20 transition-all hover:bg-black active:scale-95"
            >
              Pesan Sekarang <ArrowRight size={20} />
            </button>
            {secondaryAction === 'whatsapp' ? (
              <a
                href={getWaReservationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-stone-100 px-8 py-4 font-bold text-stone-900 transition-all hover:bg-stone-200 active:scale-95"
              >
                Reservasi WA
              </a>
            ) : secondaryAction === 'cart' ? (
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-stone-100 px-8 py-4 font-bold text-stone-900 transition-all hover:bg-stone-200 active:scale-95"
              >
                Cek Pesanan
              </button>
            ) : (
              <button
                onClick={() =>
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-stone-100 px-8 py-4 font-bold text-stone-900 transition-all hover:bg-stone-200 active:scale-95"
              >
                Lihat Suasana
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative order-1 h-[50vh] w-full overflow-hidden lg:order-2 lg:h-auto lg:w-1/2">
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 h-full w-full scale-105 transform object-cover transition-transform duration-1000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 lg:hidden"></div>
      </div>
    </header>
  )
}
