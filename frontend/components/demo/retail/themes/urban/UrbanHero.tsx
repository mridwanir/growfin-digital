'use client';

import { useRetailDemo } from './../../core/RetailDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function UrbanHero() {
  const { client } = useRetailDemo();
  const { ref: heroRef, isVisible: isHeroVisible } = useScrollReveal(0.1);
  const { ref: lookbookRef, isVisible: isLookbookVisible } = useScrollReveal(0.1);

  const spotlightProduct = client.menu?.[0];
  const spotlightLabel = client.marketing?.promoLabel || 'Rekomendasi Utama';
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang';
  const flashSaleEnd = client.marketing?.flashSaleEnd;

  return (
    <section id="hero" className="relative bg-gray-50 -mt-8 sm:rounded-[40px] overflow-hidden">
      <div
        ref={heroRef}
        className={`relative h-[70vh] w-full overflow-hidden transition-all duration-1000 transform ${isHeroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={client.heroImage || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2000&auto=format&fit=crop"} alt="Hero" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col justify-center items-start">
          {client.marketing?.promoLabel && (
            <span className="inline-block py-1 px-3 rounded-full bg-brand-primary text-white text-sm font-semibold tracking-wide mb-4">
              {client.marketing.promoLabel}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-2xl">
            {client.name}.
          </h1>
          {client.tagline && (
            <p className="text-lg text-gray-200 mb-8 max-w-xl">
              {client.tagline}
            </p>
          )}

          {client.marketing?.usps && client.marketing.usps.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-10">
              {client.marketing.usps.map((usp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-200">{usp.title}</span>
                    {usp.desc && <span className="text-[10px] text-gray-400">{usp.desc}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <a href="#katalog" className="bg-white text-brand-dark px-8 py-4 rounded-full font-bold hover:bg-brand-light hover:text-brand-dark transition-colors shadow-lg">
            Belanja Sekarang
          </a>
        </div>

        {/* Floating Spotlight Card */}
        {spotlightProduct && (
          <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/40 hidden md:flex gap-4 items-center group cursor-pointer hover:bg-white transition-colors duration-300">
            <div className="relative">
              <img src={spotlightProduct.imageUrl || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=200&auto=format&fit=crop"} alt={spotlightProduct.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100 group-hover:scale-105 transition-transform duration-300" />
              {client.marketing?.discountPercentage && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">-{client.marketing.discountPercentage}%</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-brand-light px-2 py-0.5 rounded inline-block">{spotlightLabel}</span>
                {flashSaleEnd && (
                  <span className="text-[9px] font-mono font-bold text-rose-500 flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {flashSaleEnd}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{spotlightProduct.name}</h3>
              {spotlightProduct.desc && (
                <p className="text-[10px] text-gray-500 line-clamp-1 mb-1.5">{spotlightProduct.desc}</p>
              )}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-900 leading-tight block">{spotlightProduct.price}</span>
                </div>
                <a href="#katalog" className="px-3 py-1.5 bg-brand-dark text-white text-[10px] font-bold rounded-lg hover:bg-brand-primary transition shadow-sm">
                  {ctaText}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
