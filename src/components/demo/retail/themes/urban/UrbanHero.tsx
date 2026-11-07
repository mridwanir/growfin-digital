'use client'

import { CountdownTimer } from '@/components/demo/CountdownTimer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function UrbanHero() {
  const { client } = useRetailDemo()
  const { ref: heroRef, isVisible: isHeroVisible } = useScrollReveal(0.1)
  const { ref: lookbookRef, isVisible: isLookbookVisible } = useScrollReveal(0.1)

  const spotlightProduct = client.menu?.[0]
  const spotlightLabel = client.marketing?.promoLabel || 'Rekomendasi Utama'
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang'
  const flashSaleEnd = client.marketing?.flashSaleEnd

  return (
    <section id="hero" className="relative -mt-8 overflow-hidden bg-gray-50 sm:rounded-[40px]">
      <div
        ref={heroRef}
        className={`relative h-[70vh] w-full transform overflow-hidden transition-all duration-1000 ${isHeroVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            client.heroImage ||
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2000&auto=format&fit=crop'
          }
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 lg:px-12">
          {client.marketing?.promoLabel && (
            <span className="bg-brand-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-semibold tracking-wide text-white">
              {client.marketing.promoLabel}
            </span>
          )}
          <h1 className="mb-6 max-w-2xl text-4xl leading-tight font-bold text-white md:text-6xl">
            {client.name}.
          </h1>
          {client.tagline && (
            <p className="mb-8 max-w-xl text-lg text-gray-200">{client.tagline}</p>
          )}

          {client.marketing?.usps && client.marketing.usps.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-4">
              {client.marketing.usps.map((usp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-brand-primary/20 flex h-5 w-5 items-center justify-center rounded-full">
                    <svg
                      className="text-brand-primary h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-200">{usp.title}</span>
                    {usp.desc && <span className="text-[10px] text-gray-400">{usp.desc}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <a
            href="#katalog"
            className="text-brand-dark hover:bg-brand-light hover:text-brand-dark rounded-full bg-white px-8 py-4 font-bold shadow-lg transition-colors"
          >
            Belanja Sekarang
          </a>
        </div>

        {/* Floating Spotlight Card */}
        {spotlightProduct && (
          <div className="group absolute right-6 bottom-6 hidden max-w-sm cursor-pointer items-center gap-4 rounded-2xl border border-white/40 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-colors duration-300 hover:bg-white sm:right-12 sm:bottom-12 md:flex">
            <div className="relative">
              <img
                src={
                  spotlightProduct.imageUrl ||
                  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=200&auto=format&fit=crop'
                }
                alt={spotlightProduct.name}
                className="h-20 w-20 rounded-xl border border-gray-100 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {client.marketing?.discountPercentage && (
                <span className="absolute -top-2 -right-2 rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                  -{client.marketing.discountPercentage}%
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-brand-primary bg-brand-light inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                  {spotlightLabel}
                </span>
                {flashSaleEnd && (
                  <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-rose-500">
                    <svg
                      className="h-2.5 w-2.5"
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
                )}
              </div>
              <h3 className="line-clamp-1 text-sm font-bold text-gray-900">
                {spotlightProduct.name}
              </h3>
              {spotlightProduct.desc && (
                <p className="mb-1.5 line-clamp-1 text-[10px] text-gray-500">
                  {spotlightProduct.desc}
                </p>
              )}
              <div className="flex items-end justify-between">
                <div>
                  <span className="block text-sm leading-tight font-bold text-gray-900">
                    {spotlightProduct.price}
                  </span>
                </div>
                <a
                  href="#katalog"
                  className="bg-brand-dark hover:bg-brand-primary rounded-lg px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition"
                >
                  {ctaText}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
