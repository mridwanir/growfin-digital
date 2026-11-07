'use client'

import { CountdownTimer } from '@/components/demo/CountdownTimer'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function TechHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo()

  const spotlightProduct = client.menu?.[0] || {
    name: 'Aether Mech 75 Low-Profile',
    desc: 'Gasket Mount 75% • CNC Aluminum Top Case',
    price: 1850000,
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
  }

  const basePrice = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 1850000
  const discountPercentage = client.marketing?.discountPercentage || 35
  const originalPrice = basePrice * (1 + discountPercentage / 100)
  const formatIDR = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  const spotlightLabel = client.marketing?.promoLabel || 'Penawaran Terbatas'
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang'
  const flashSaleEnd = client.marketing?.flashSaleEnd
  const secondaryAction = client.heroSecondaryAction || 'gallery'
  const getWaUrl = () =>
    `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Main Billboard Banner (8 Cols) */}
        <div className="relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl bg-zinc-950 p-8 shadow-xl sm:p-14 lg:col-span-8">
          <img
            src={
              client.heroImage ||
              'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop'
            }
            alt="Minimalist Tech"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent"></div>

          <div className="relative z-10 max-w-xl space-y-4">
            {client.marketing?.promoLabel && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--theme-color)' }}
                ></span>
                {client.marketing.promoLabel}
              </div>
            )}
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl">
              {client.name}.
            </h1>
            {client.tagline && (
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{client.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href="#katalog"
                className="rounded-xl px-6 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all"
                style={{ backgroundColor: 'var(--theme-color)' }}
              >
                {client.uiLabels?.buyButtonText || 'Lihat Seluruh Produk'}
              </a>

              {secondaryAction === 'whatsapp' ? (
                <a
                  href={getWaUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Hubungi Kami
                </a>
              ) : secondaryAction === 'cart' ? (
                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Cek Keranjang
                </button>
              ) : (
                <a
                  href="#lookbook"
                  className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md transition-all hover:bg-white/20"
                >
                  {client.uiLabels?.lookbookButtonText || 'Jelajahi Inspirasi Setup'}
                </a>
              )}
            </div>

            {/* Mini USP Badges */}
            <div className="mt-4 grid max-w-md grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              {(
                client.marketing?.usps || [
                  { title: 'Garansi Resmi', desc: '12 Bulan Servis' },
                  { title: 'Pengiriman Aman', desc: 'Asuransi Penuh' },
                  { title: 'Dukungan Teknis', desc: 'Layanan 24/7' },
                ]
              ).map((usp, idx) => (
                <div key={idx}>
                  <p className="text-xs font-bold text-white uppercase">{usp.title}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-zinc-400">{usp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo Spotlight Card (4 Cols) */}
        <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm lg:col-span-4">
          <div>
            <div className="mb-4 flex items-center justify-between text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              <span>{spotlightLabel}</span>
              {discountPercentage > 0 && (
                <span className="rounded bg-rose-50 px-2 py-0.5 font-bold text-rose-600">
                  -{discountPercentage}% OFF
                </span>
              )}
            </div>

            {flashSaleEnd && (
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Berakhir dalam
                </span>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 font-mono text-xs font-bold text-rose-600">
                  <CountdownTimer targetDate={flashSaleEnd} />
                </span>
              </div>
            )}

            <div className="mb-6 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <img
                src={
                  spotlightProduct.imageUrl ||
                  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop'
                }
                alt={spotlightProduct.name}
                className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>

            <h3 className="line-clamp-1 text-lg font-bold text-zinc-950">
              {spotlightProduct.name}
            </h3>
            {spotlightProduct.desc && (
              <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{spotlightProduct.desc}</p>
            )}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center">
            <div>
              {discountPercentage > 0 && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatIDR(originalPrice)}
                </span>
              )}
              <div className="text-xl font-bold text-zinc-950">{formatIDR(basePrice)}</div>
            </div>
            <a
              href="#katalog"
              className="flex-shrink-0 cursor-pointer rounded-xl px-5 py-2.5 text-center text-[11px] font-bold text-white shadow-sm transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
