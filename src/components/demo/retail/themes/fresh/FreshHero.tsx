'use client'

import { CountdownTimer } from '@/components/demo/CountdownTimer'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function FreshHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo()
  const spotlightProduct = client.menu?.[0] || {
    id: 'spotlight-1',
    name: 'Produk Unggulan',
    desc: 'Kualitas terbaik pilihan kami',
    price: 150000,
    imageUrl:
      client.heroImage ||
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  }
  const basePrice = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 150000
  const discountPercentage = client.marketing?.discountPercentage || 35
  const originalPrice = basePrice * (1 + discountPercentage / 100)
  const formatIDR = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  const spotlightLabel =
    client.marketing?.promoLabel || client.categories?.[0] || 'Rekomendasi Utama'
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang'
  const flashSaleEnd = client.marketing?.flashSaleEnd
  const secondaryAction = client.heroSecondaryAction || 'gallery'
  const getWaUrl = () =>
    `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-3xl bg-green-950 from-emerald-950 via-emerald-900 to-zinc-900 text-white shadow-2xl"
        style={
          {
            backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))',
            '--tw-gradient-from': 'color-mix(in srgb, var(--theme-color) 40%, black)',
            '--tw-gradient-via': 'color-mix(in srgb, var(--theme-color) 20%, black)',
            '--tw-gradient-to': '#18181b',
          } as React.CSSProperties
        }
      >
        <img
          src={
            client.heroImage ||
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
          }
          alt="Fresh Market"
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3.5 py-1 text-xs font-bold tracking-wider text-emerald-300 uppercase">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400"></span>
              Buka{' '}
              {client.openTime && client.closeTime
                ? `${client.openTime} - ${client.closeTime}`
                : '24 Jam Non-Stop'}
            </div>

            <h1 className="text-3xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Kebutuhan Harian,{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
                Siap Kirim Kilat.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed font-normal text-zinc-300 sm:text-lg">
              {client.tagline ||
                'Dari Onigiri Salmon hangat, bento box artisan, matcha cold brew, hingga snack import eksklusif. Rasakan kemudahan belanja ala minimarket dari rumah.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#katalog"
                className="inline-flex transform items-center gap-2 rounded-full bg-[var(--theme-color)] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <span>{client.uiLabels?.buyButtonText || 'Buka Etalase Produk'}</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"
                    transform="scale(1, -1) translate(0, -256)"
                  ></path>
                </svg>
              </a>

              {secondaryAction === 'whatsapp' ? (
                <a
                  href={getWaUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <svg className="h-4 w-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path>
                  </svg>
                  <span>Hubungi Kami</span>
                </a>
              ) : secondaryAction === 'cart' ? (
                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <svg className="h-4 w-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path>
                  </svg>
                  <span>Cek Keranjang</span>
                </button>
              ) : (
                <a
                  href="#lookbook"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <svg className="h-4 w-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path>
                  </svg>
                  <span>{client.uiLabels?.lookbookButtonText || 'Inspirasi Lookbook'}</span>
                </a>
              )}
            </div>

            {/* Mini USP Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-xs text-zinc-300">
              {(
                client.marketing?.usps || [
                  { title: '15-30 Menit', desc: 'Garansi Cepat Sampai' },
                  { title: '100% Higienis', desc: 'Kualitas Terjaga' },
                  { title: 'Kemasan Aman', desc: 'Suhu Tetap Stabil' },
                ]
              ).map((usp, idx) => (
                <div key={idx}>
                  <p className="text-sm font-bold text-white">{usp.title}</p>
                  <p>{usp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="group relative mx-auto max-w-sm rotate-1 transform overflow-hidden rounded-2xl border border-white/20 shadow-2xl transition duration-500 hover:rotate-0">
              <img
                src={spotlightProduct.imageUrl}
                alt={spotlightProduct.name}
                className="h-80 w-full object-cover sm:h-96"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="mb-1 inline-block rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black text-zinc-950 uppercase">
                      {spotlightLabel}
                    </span>
                    <p className="line-clamp-1 text-sm font-bold text-white">
                      {spotlightProduct.name}
                    </p>
                    <p className="line-clamp-1 text-[11px] text-zinc-300">
                      {spotlightProduct.desc}
                    </p>
                  </div>
                  {discountPercentage > 0 && (
                    <span className="shrink-0 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>

                {flashSaleEnd && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <CountdownTimer targetDate={flashSaleEnd} />
                    </span>
                  </div>
                )}

                <div className="mt-1 flex items-end justify-between border-t border-white/20 pt-3">
                  <div>
                    {discountPercentage > 0 && (
                      <span className="block text-[10px] leading-tight text-zinc-400 line-through">
                        {formatIDR(originalPrice)}
                      </span>
                    )}
                    <span className="text-base leading-tight font-bold text-emerald-400">
                      {formatIDR(basePrice)}
                    </span>
                  </div>
                  <a
                    href="#katalog"
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black shadow transition hover:bg-zinc-200"
                  >
                    {ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
