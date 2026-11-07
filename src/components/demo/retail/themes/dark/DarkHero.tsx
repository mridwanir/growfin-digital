'use client'

import { CountdownTimer } from '@/components/demo/CountdownTimer'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function DarkHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo()

  const spotlightProduct = client.menu?.[0] || {
    name: 'Voltrix Studio Pro Wireless',
    desc: 'Active Noise Cancelling 48dB • 60H Battery',
    price: 2499000,
    imageUrl:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
  }

  const basePrice = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 2499000
  const discountPercentage = client.marketing?.discountPercentage || 35
  const originalPrice = basePrice * (1 + discountPercentage / 100)
  const formatIDR = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  const spotlightLabel = client.marketing?.promoLabel || 'Featured Spotlight'
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang'
  const flashSaleEnd = client.marketing?.flashSaleEnd
  const secondaryAction = client.heroSecondaryAction || 'gallery'
  const getWaUrl = () =>
    `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`

  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 lg:py-24">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
        style={{ backgroundColor: 'var(--theme-color)' }}
      ></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-7">
            <div
              className="inline-flex items-center gap-2 rounded-full border bg-slate-900 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase"
              style={{ borderColor: 'var(--theme-color)', color: 'var(--theme-color)' }}
            >
              <span
                className="h-2 w-2 animate-ping rounded-full"
                style={{ backgroundColor: 'var(--theme-color)' }}
              ></span>
              Buka{' '}
              {client.openTime && client.closeTime
                ? `${client.openTime} - ${client.closeTime}`
                : 'Setiap Hari'}
            </div>

            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {client.name}.
            </h1>

            {client.tagline && (
              <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                {client.tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#katalog"
                className="flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-slate-950 shadow-lg transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--theme-color)' }}
              >
                {client.uiLabels?.buyButtonText || 'Jelajahi Katalog'}{' '}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>

              {secondaryAction === 'whatsapp' ? (
                <a
                  href={getWaUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-xl border border-slate-700/60 bg-slate-900 px-8 py-3.5 font-semibold text-slate-200 transition-all hover:bg-slate-800"
                >
                  Hubungi Kami
                </a>
              ) : secondaryAction === 'cart' ? (
                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="cursor-pointer rounded-xl border border-slate-700/60 bg-slate-900 px-8 py-3.5 font-semibold text-slate-200 transition-all hover:bg-slate-800"
                >
                  Cek Keranjang
                </button>
              ) : (
                <a
                  href="#lookbook"
                  className="cursor-pointer rounded-xl border border-slate-700/60 bg-slate-900 px-8 py-3.5 font-semibold text-slate-200 transition-all hover:bg-slate-800"
                >
                  {client.uiLabels?.lookbookButtonText || 'Inspirasi Setup'}
                </a>
              )}
            </div>

            {/* Feature mini-bullets */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400">
              {(
                client.marketing?.usps || [
                  { title: '100% Original', desc: 'Distributor Resmi' },
                  { title: 'Same-Day Courier', desc: 'Instant Packing Aman' },
                  { title: '24 Bulan Garansi', desc: 'Ganti Unit Baru' },
                ]
              ).map((usp, idx) => (
                <div key={idx}>
                  <p className="text-sm font-bold text-slate-200">{usp.title}</p>
                  <span>{usp.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Promotional Showcase Image */}
          <div className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-2 shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
                <img
                  src={
                    spotlightProduct.imageUrl ||
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop'
                  }
                  alt="Spotlight"
                  className="h-full w-full transform object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute right-4 bottom-4 left-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <span
                        className="mb-1 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase"
                        style={{ color: 'var(--theme-color)' }}
                      >
                        {spotlightLabel}
                      </span>
                      <h3 className="line-clamp-1 text-base font-bold text-white">
                        {spotlightProduct.name}
                      </h3>
                      <p className="line-clamp-1 text-xs text-slate-400">{spotlightProduct.desc}</p>
                    </div>
                    {discountPercentage > 0 && (
                      <span
                        className="ml-2 rounded px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-slate-950"
                        style={{ backgroundColor: 'var(--theme-color)' }}
                      >
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {flashSaleEnd && (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-slate-700/50 bg-slate-900/80 px-2.5 py-1">
                      <svg
                        className="h-3.5 w-3.5 animate-pulse text-rose-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <CountdownTimer
                        targetDate={flashSaleEnd}
                        className="font-mono text-[10px] font-bold tracking-widest text-rose-400"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                    <div>
                      {discountPercentage > 0 && (
                        <span className="mb-0.5 block text-[10px] leading-none text-slate-500 line-through">
                          {formatIDR(originalPrice)}
                        </span>
                      )}
                      <p
                        className="text-base leading-none font-bold sm:text-lg"
                        style={{ color: 'var(--theme-color)' }}
                      >
                        {formatIDR(basePrice)}
                      </p>
                    </div>
                    <a
                      href="#katalog"
                      className="rounded-lg px-4 py-2 text-[11px] font-bold tracking-wider text-slate-950 uppercase shadow-lg transition hover:opacity-90"
                      style={{ backgroundColor: 'var(--theme-color)' }}
                    >
                      {ctaText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
