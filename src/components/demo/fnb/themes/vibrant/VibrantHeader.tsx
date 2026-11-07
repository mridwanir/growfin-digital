import { ShoppingBag } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function VibrantHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo()
  const heroImage = client.heroImage || '/image/fnb/bubleteanjuice/bubleteanjuice (1).jpg'
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'B'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-white/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <a href="#" className="group flex items-center gap-2">
              <div className="bg-brand-primary shadow-brand-primary/20 flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-black text-white shadow-md transition-transform group-hover:scale-105">
                {brandInitial}
              </div>
              <div>
                <span className="block text-xl leading-none font-extrabold tracking-tight text-stone-900">
                  {client.name}
                </span>
                <span className="text-brand-primary text-[10px] font-semibold tracking-widest uppercase">
                  {client.category || 'Artisan Brews'}
                </span>
              </div>
            </a>

            <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-600 md:flex">
              <a href="#menu" className="hover:text-brand-primary transition-colors">
                Menu
              </a>
              <a href="#gallery" className="hover:text-brand-primary transition-colors">
                Galeri
              </a>
              <a href="#reviews" className="hover:text-brand-primary transition-colors">
                Ulasan
              </a>
              <a href="#contact" className="hover:text-brand-primary transition-colors">
                Kontak
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="relative flex cursor-pointer items-center gap-2 rounded-full bg-stone-100 p-2.5 text-sm font-semibold text-stone-800 transition-all hover:bg-stone-200"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="bg-brand-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="from-brand-primary via-brand-primary/80 to-brand-primary/60 relative overflow-hidden bg-gradient-to-br py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight sm:text-6xl">
                {client.tagline
                  ? client.tagline
                      .split(' ')
                      .slice(0, Math.ceil(client.tagline.split(' ').length / 2))
                      .join(' ')
                  : client.name}{' '}
                <br />
                {client.tagline
                  ? client.tagline
                      .split(' ')
                      .slice(Math.ceil(client.tagline.split(' ').length / 2))
                      .join(' ')
                  : ''}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
                <a
                  href="#menu"
                  className="transform rounded-xl bg-white px-8 py-4 font-bold text-stone-900 shadow-xl shadow-stone-900/10 transition-all hover:-translate-y-0.5 hover:bg-stone-100"
                >
                  Pesan Sekarang
                </a>
                <a
                  href="#gallery"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Jelajahi Galeri
                </a>
              </div>
            </div>

            <div className="relative flex justify-center lg:col-span-5">
              <div className="relative aspect-[3/4] w-72 rotate-2 transform overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:w-88">
                <img src={heroImage} alt="Signature Drink" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
