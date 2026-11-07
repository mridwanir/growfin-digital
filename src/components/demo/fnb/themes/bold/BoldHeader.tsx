import { ShoppingBag, ArrowRight } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function BoldHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo()
  const heroImage = client.heroImage || '/image/fnb/fastfood/fastfood (1).jpg'
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'C'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2">
            <div className="bg-brand-primary shadow-brand-primary/30 flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-extrabold text-white shadow-lg">
              {brandInitial}
            </div>
            <div>
              <span className="block text-xl leading-tight font-extrabold tracking-tight text-neutral-950">
                {client.name.split(' ')[0]}
                <span className="text-brand-primary">
                  {client.name.split(' ').slice(1).join(' ')}
                </span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                {client.category || 'Artisan Fast Food'}
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-600 md:flex">
            <a href="#menu" className="hover:text-brand-primary transition">
              Menu
            </a>
            <a href="#gallery" className="hover:text-brand-primary transition">
              Galeri
            </a>
            <a href="#reviews" className="hover:text-brand-primary transition">
              Ulasan
            </a>
            <a href="#contact" className="hover:text-brand-primary transition">
              Kontak
            </a>
          </nav>

          <button
            onClick={() => setIsCartModalOpen(true)}
            className="relative flex cursor-pointer items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-white shadow-md transition hover:bg-neutral-800"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden text-sm font-bold sm:inline">Keranjang</span>
            {cartItemCount > 0 && (
              <span className="bg-brand-primary ring-brand-primary absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-neutral-950 ring-1">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <section
        id="promo"
        className="relative overflow-hidden bg-neutral-950 py-16 text-white lg:py-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h1 className="mb-6 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl">
              {client.tagline
                ? client.tagline
                    .split(' ')
                    .slice(0, Math.ceil(client.tagline.split(' ').length / 2))
                    .join(' ')
                : client.name}{' '}
              <br />
              <span className="text-brand-primary">
                {client.tagline
                  ? client.tagline
                      .split(' ')
                      .slice(Math.ceil(client.tagline.split(' ').length / 2))
                      .join(' ')
                  : ''}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#menu"
                className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/25 inline-flex transform items-center gap-2 rounded-xl px-8 py-4 font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5"
              >
                Pesan Sekarang <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="group relative aspect-4/3 overflow-hidden rounded-3xl border-4 border-neutral-800 shadow-2xl">
              <img
                src={heroImage}
                alt="Signature Burger"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
