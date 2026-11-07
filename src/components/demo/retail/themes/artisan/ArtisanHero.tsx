'use client'

import { CountdownTimer } from '@/components/demo/CountdownTimer'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function ArtisanHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo()
  const heroImage =
    client.heroImage ||
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80'
  const spotlightProduct = client.menu?.[0] || {
    id: 'spotlight-1',
    name: 'Produk Unggulan',
    desc: 'Kualitas terbaik pilihan kami',
    price: 150000,
    imageUrl:
      client.heroImage ||
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
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
  const spotlightLabel = client.marketing?.promoLabel || client.categories?.[0] || 'Flash Sale'
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang'
  const flashSaleEnd = client.marketing?.flashSaleEnd
  const secondaryAction = client.heroSecondaryAction || 'gallery'
  const getWaUrl = () => {
    return `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`
  }
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Bento 1: Main Banner (Large) */}
        <div className="relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl bg-zinc-900 p-8 text-white shadow-xl shadow-stone-900/10 sm:p-12 lg:col-span-8">
          <img
            src={heroImage}
            alt="Organic Produce"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent"></div>

          <div className="relative z-10 max-w-xl space-y-4">
            <h1 className="font-serif-display text-3xl leading-tight font-semibold tracking-normal text-amber-50 sm:text-5xl">
              {client.name}
            </h1>
            <p className="text-sm leading-relaxed font-light text-zinc-200 sm:text-base">
              {client.tagline || 'Kurasi bahan pangan premium langsung dari mitra terpercaya.'}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-4 pt-8">
            <a
              href="#katalog"
              className="rounded-xl bg-amber-400 px-6 py-3 text-xs font-bold tracking-wider text-zinc-950 uppercase shadow-md transition hover:bg-amber-300"
            >
              {client.uiLabels?.buyButtonText || 'Mulai Belanja'}
            </a>

            {secondaryAction === 'whatsapp' ? (
              <a
                href={getWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md transition hover:bg-white/20"
              >
                Hubungi Kami
              </a>
            ) : secondaryAction === 'cart' ? (
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md transition hover:bg-white/20"
              >
                Cek Keranjang
              </button>
            ) : (
              <a
                href="#lookbook"
                className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md transition hover:bg-white/20"
              >
                {client.uiLabels?.lookbookButtonText || 'Lihat Inspirasi Dapur'}
              </a>
            )}
          </div>

          {/* Mini USP Badges */}
          <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 text-xs text-zinc-200 sm:grid-cols-3">
            {(
              client.marketing?.usps || [
                { title: '15-30 Menit', desc: 'Garansi Cepat Sampai' },
                { title: '100% Higienis', desc: 'Kualitas Terjaga' },
                { title: 'Kemasan Aman', desc: 'Suhu Tetap Stabil' },
              ]
            ).map((usp, idx) => (
              <div key={idx}>
                <p className="text-sm font-bold text-white">{usp.title}</p>
                <p className="mt-0.5 opacity-80">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bento 2 & 3: Flash Sale Flash Card & Trust Metric */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          {/* Promo Spotlight Card */}
          <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-900 uppercase">
                  {spotlightLabel}
                </span>
                {flashSaleEnd && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800">
                    <CountdownTimer targetDate={flashSaleEnd} />
                  </span>
                )}
              </div>

              <div className="group relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-50">
                <img
                  src={spotlightProduct.imageUrl}
                  alt={spotlightProduct.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-2 right-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    -{discountPercentage}% OFF
                  </div>
                )}
              </div>

              <h3 className="line-clamp-1 text-base font-bold text-zinc-900">
                {spotlightProduct.name}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500">
                {spotlightProduct.desc}
              </p>
            </div>

            <div className="mt-4 flex flex-col justify-between gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center">
              <div>
                {discountPercentage > 0 && (
                  <span className="block text-[10px] leading-tight text-zinc-400 line-through">
                    {formatIDR(originalPrice)}
                  </span>
                )}
                <span className="text-base leading-tight font-bold text-[var(--theme-color)]">
                  {formatIDR(basePrice)}
                </span>
              </div>
              <a
                href="#katalog"
                className="shrink-0 rounded-xl bg-[var(--theme-color)] px-4 py-2 text-center text-[11px] font-bold text-white transition hover:opacity-90"
              >
                {ctaText}
              </a>
            </div>
          </div>

          {/* Cold Chain Guarantee */}
          <div className="flex items-center gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider text-zinc-900 uppercase">
                {client.categories?.[1] || 'Kualitas Terjamin'}
              </h4>
              <p className="mt-0.5 text-xs text-zinc-500">
                {client.categories?.[2] ||
                  'Disiapkan dan dikirim dengan standar kebersihan tertinggi langsung ke tempat Anda.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
