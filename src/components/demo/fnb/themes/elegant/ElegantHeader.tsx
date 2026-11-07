import { CakeSlice, ShoppingBag, Sparkles } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ElegantHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo()
  const heroImage = client.heroImage || '/image/fnb/bakeryndessert/bakeryndessert (1).jpg'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2">
            <span className="bg-brand-primary/20 text-brand-primary flex h-10 w-10 items-center justify-center rounded-full">
              <CakeSlice className="h-5 w-5" />
            </span>
            <div>
              <span className="font-serif-title block text-2xl leading-none font-bold tracking-tight text-stone-900">
                {client.name.split(' ')[0]}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-stone-600 uppercase">
                {client.category || 'Artisan Pâtisserie'}
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide md:flex">
            <a href="#menu" className="hover:text-brand-primary text-stone-900 transition-colors">
              Menu
            </a>
            <a
              href="#gallery"
              className="hover:text-brand-primary text-stone-900 transition-colors"
            >
              Ruangan
            </a>
            <a
              href="#contact"
              className="hover:text-brand-primary text-stone-900 transition-colors"
            >
              Kontak
            </a>
          </nav>

          <button
            onClick={() => setIsCartModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark relative flex items-center gap-2 rounded-full px-4 py-2 text-white transition-colors focus:outline-none"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden text-sm font-bold sm:inline">Keranjang</span>
            <span className="text-brand-primary rounded-full bg-white px-2 py-0.5 text-[10px] font-bold shadow-sm">
              {cartItemCount}
            </span>
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-br from-stone-100 to-stone-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="bg-brand-primary/10 text-brand-primary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="h-4 w-4" /> Seasonal Release • Fresh Baked Daily
              </div>
              <h1 className="font-serif-title text-4xl leading-tight font-bold text-stone-900 sm:text-5xl lg:text-6xl">
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
              <p className="max-w-xl text-base leading-relaxed text-stone-700 sm:text-lg">
                {client.tagline ||
                  'Dibuat segar setiap subuh tanpa bahan pengawet. Nikmati kue tart bertekstur lembut, croissant renyah berlapis, dan dessert elegan untuk momen istimewa Anda.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#menu"
                  className="transform rounded-full bg-stone-900 px-8 py-4 font-medium text-white shadow-lg transition hover:bg-stone-800 active:scale-95"
                >
                  Beli Sekarang (Order Hari Ini)
                </a>
                {client.heroSecondaryAction === 'whatsapp' ? (
                  <a
                    href={`https://wa.me/${client.waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-stone-900/40 px-6 py-4 font-medium text-stone-900 transition hover:bg-white/60"
                  >
                    Tanya Admin
                  </a>
                ) : client.heroSecondaryAction === 'cart' ? (
                  <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="rounded-full border border-stone-900/40 px-6 py-4 font-medium text-stone-900 transition hover:bg-white/60"
                  >
                    Cek Pesanan
                  </button>
                ) : (
                  <a
                    href="#gallery"
                    className="rounded-full border border-stone-900/40 px-6 py-4 font-medium text-stone-900 transition hover:bg-white/60"
                  >
                    Lihat Inspirasi Meja Pesta
                  </a>
                )}
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl ring-8 ring-white/60">
                  <img
                    src={heroImage}
                    alt="Signature Cake"
                    className="h-full w-full transform object-cover transition duration-700 hover:scale-105"
                  />

                  <div className="bg-brand-primary absolute top-4 right-4 flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-md">
                    <Sparkles className="h-3 w-3" /> TERLARIS HARI INI
                  </div>

                  <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-stone-50 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                    <p className="text-brand-primary text-xs font-bold tracking-wider uppercase">
                      Signature Cake
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <h3 className="font-serif-title text-lg font-bold text-stone-900">
                        Chantilly Strawberry Supreme
                      </h3>
                      <span className="text-brand-primary font-bold">Rp 320.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
