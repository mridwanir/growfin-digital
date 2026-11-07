import {
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  Calendar,
  Clock3,
  Coffee,
  ShieldCheck,
} from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ArtisanHeader() {
  const { client, isOpenNow, cartItemCount, setIsCartModalOpen } = useFnbDemo()
  const heroImage = client.heroImage || '/image/fnb/restaurant/restaurant (1).jpg'

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-900/90 text-stone-100 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="bg-brand-primary rounded-xl p-2 font-black text-stone-950">
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <div>
              <span className="font-serif-title text-brand-light text-lg font-bold tracking-wide md:text-xl">
                {client.name}
              </span>
              <span className="-mt-1 block text-[10px] tracking-widest text-stone-400 uppercase">
                {client.category || 'Artisan Dine & Coffee'}
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-300 md:flex">
            <a href="#menu" className="hover:text-brand-primary transition">
              Menu
            </a>
            <a href="#gallery" className="hover:text-brand-primary transition">
              Ruangan
            </a>
            <a href="#contact" className="hover:text-brand-primary transition">
              Kontak
            </a>
          </nav>

          <button
            onClick={() => setIsCartModalOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-3.5 py-2 text-sm transition hover:bg-stone-700"
          >
            <ShoppingBag className="text-brand-primary h-4 w-4" />
            <span className="hidden font-medium sm:inline">Keranjang</span>
            <span className="bg-brand-primary min-w-5 rounded-full px-1.5 py-0.5 text-center text-xs font-bold text-stone-950">
              {cartItemCount}
            </span>
          </button>
        </div>
      </header>

      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-stone-950 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Restaurant Ambiance"
            className="h-full w-full scale-105 object-cover opacity-35 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-stone-700/80 bg-stone-900/80 px-4 py-2 shadow-lg shadow-black/40 backdrop-blur-md">
            {isOpenNow ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-stone-200 md:text-sm">
                  Buka Sekarang &bull; {client.hours || '10:00 - 22:00'}
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
                </span>
                <span className="text-xs font-semibold text-stone-200 md:text-sm">
                  Tutup Saat Ini &bull; {client.hours || '10:00 - 22:00'}
                </span>
              </>
            )}
          </div>

          <h1 className="font-serif-title text-4xl leading-tight font-bold tracking-tight text-stone-100 sm:text-6xl md:text-7xl">
            {client.name
              .split(' ')
              .slice(0, Math.ceil(client.name.split(' ').length / 2))
              .join(' ')}{' '}
            <br />
            <span className="text-brand-primary font-normal italic">
              {client.name
                .split(' ')
                .slice(Math.ceil(client.name.split(' ').length / 2))
                .join(' ')}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-300 md:text-lg">
            {client.tagline ||
              'Nikmati pengalaman bersantap istimewa dengan racikan bahan lokal terbaik atau pesan cepat langsung dari meja Anda.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#menu"
              className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/20 flex transform items-center gap-2 rounded-full px-6 py-3.5 font-bold text-stone-950 shadow-lg transition active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Pesan Cepat (Self-Order)
            </a>
            {client.heroSecondaryAction === 'whatsapp' ? (
              <a
                href={`https://wa.me/${client.waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-stone-600 bg-stone-800/90 px-6 py-3.5 font-semibold text-stone-100 backdrop-blur-sm transition hover:bg-stone-700"
              >
                <Calendar className="text-brand-primary h-4 w-4" />
                Reservasi Meja
              </a>
            ) : client.heroSecondaryAction === 'cart' ? (
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="flex items-center gap-2 rounded-full border border-stone-600 bg-stone-800/90 px-6 py-3.5 font-semibold text-stone-100 backdrop-blur-sm transition hover:bg-stone-700"
              >
                <ShoppingBag className="text-brand-primary h-4 w-4" />
                Pesan Online
              </button>
            ) : (
              <a
                href="#gallery"
                className="flex items-center gap-2 rounded-full border border-stone-600 bg-stone-800/90 px-6 py-3.5 font-semibold text-stone-100 backdrop-blur-sm transition hover:bg-stone-700"
              >
                <Sparkles className="text-brand-primary h-4 w-4" />
                Lihat Suasana
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
