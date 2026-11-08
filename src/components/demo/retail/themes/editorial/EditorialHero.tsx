'use client'

import Image from 'next/image'

import { CountdownTimer } from '@/components/demo/CountdownTimer'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function EditorialHero() {
  const { client } = useRetailDemo()

  const spotlightProduct = client.menu?.[0]
  const spotlightLabel = client.marketing?.promoLabel || 'Rekomendasi Utama'
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang'
  const flashSaleEnd = client.marketing?.flashSaleEnd

  return (
    <section className="flex min-h-screen flex-col bg-[#FFFFFF] pt-20 md:flex-row">
      <div className="relative order-2 flex w-full flex-col justify-center px-8 py-16 md:order-1 md:w-1/2 md:px-24 md:py-0">
        <div className="absolute top-10 left-10 hidden origin-left rotate-90 text-xs tracking-[0.3em] text-[#8E8E8E] uppercase md:block">
          {client.name} Collection
        </div>

        {client.marketing?.promoLabel && (
          <span className="mb-6 inline-block w-max border border-[#121212] px-3 py-1 text-xs tracking-widest uppercase">
            {client.marketing.promoLabel}
          </span>
        )}
        <h1 className="font-serif-custom mb-6 text-5xl leading-[1.1] md:text-7xl">{client.name}</h1>
        {client.tagline && (
          <p className="mb-8 max-w-md text-lg leading-relaxed font-light text-[#8E8E8E]">
            {client.tagline}
          </p>
        )}

        {client.marketing?.usps && client.marketing.usps.length > 0 && (
          <ul className="mb-10 flex flex-col gap-3">
            {client.marketing.usps.map((usp, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-light text-[#121212]">
                <span className="block h-1.5 w-1.5 rounded-full bg-[#8E8E8E]"></span>
                <span>
                  <span className="font-semibold">{usp.title}</span>
                  {usp.desc && <span className="ml-2 text-xs text-[#8E8E8E]">({usp.desc})</span>}
                </span>
              </li>
            ))}
          </ul>
        )}

        <a
          href="#katalog"
          className="w-max bg-[#121212] px-8 py-4 text-sm tracking-widest text-white uppercase transition-colors duration-300 hover:bg-[#8C907E]"
        >
          Explore Collection
        </a>
      </div>

      <div className="relative order-1 h-[60vh] w-full md:order-2 md:h-auto md:w-1/2">
        <img
          src={
            client.heroImage ||
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'
          }
          alt="Editorial Hero"
          className="h-full w-full object-cover"
          onError={e => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'
          }}
        />

        {/* Floating Spotlight Card */}
        {/* Floating Spotlight Card */}
        {spotlightProduct && (
          <div className="group absolute bottom-6 left-6 hidden max-w-[280px] border border-gray-100 bg-white p-5 shadow-2xl transition-transform duration-300 hover:-translate-y-2 sm:bottom-12 sm:left-12 md:block">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {spotlightLabel}
              </span>
              {flashSaleEnd && (
                <CountdownTimer
                  targetDate={flashSaleEnd}
                  className="bg-gray-100 px-2 py-0.5 font-mono text-[9px] font-bold text-[#121212]"
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  alt={spotlightProduct.name}
                  className="h-16 w-16 rounded-sm object-cover transition group-hover:opacity-80"
                  height={64}
                  src={
                    spotlightProduct.imageUrl ||
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=200&auto=format&fit=crop'
                  }
                  width={64}
                />
                {client.marketing?.discountPercentage && (
                  <span className="absolute -top-1.5 -right-1.5 rounded-sm bg-[#121212] px-1 py-0.5 text-[8px] font-bold text-white">
                    -{client.marketing.discountPercentage}%
                  </span>
                )}
              </div>
              <div>
                <h3 className="line-clamp-1 text-xs font-bold text-[#121212]">
                  {spotlightProduct.name}
                </h3>
                <span className="mt-0.5 block text-xs font-bold text-[#121212]">
                  {spotlightProduct.price}
                </span>
              </div>
            </div>
            <a
              href="#katalog"
              className="mt-4 block w-full bg-[#121212] py-2.5 text-center text-[10px] tracking-widest text-white uppercase transition hover:bg-[#8C907E]"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
