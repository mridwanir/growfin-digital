'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function EditorialHero() {
  const { client } = useRetailDemo();

  const spotlightProduct = client.menu?.[0];
  const spotlightLabel = client.marketing?.promoLabel || 'Rekomendasi Utama';
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang';
  const flashSaleEnd = client.marketing?.flashSaleEnd;

  return (
    <section className="pt-20 min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-16 md:py-0 order-2 md:order-1 relative">
          <div className="absolute top-10 left-10 hidden md:block text-xs uppercase tracking-[0.3em] text-[#8E8E8E] rotate-90 origin-left">
              {client.name} Collection
          </div>
          
          {client.marketing?.promoLabel && (
            <span className="inline-block px-3 py-1 border border-[#121212] text-xs uppercase tracking-widest w-max mb-6">
                {client.marketing.promoLabel}
            </span>
          )}
          <h1 className="text-5xl md:text-7xl font-serif-custom leading-[1.1] mb-6">
              {client.name}
          </h1>
          {client.tagline && (
            <p className="text-[#8E8E8E] mb-8 max-w-md text-lg font-light leading-relaxed">
                {client.tagline}
            </p>
          )}

          {client.marketing?.usps && client.marketing.usps.length > 0 && (
            <ul className="flex flex-col gap-3 mb-10">
              {client.marketing.usps.map((usp, i) => (
                <li key={i} className="flex items-center gap-3 text-[#121212] text-sm font-light">
                  <span className="w-1.5 h-1.5 bg-[#8E8E8E] rounded-full block"></span>
                  <span>
                    <span className="font-semibold">{usp.title}</span>
                    {usp.desc && <span className="ml-2 text-[#8E8E8E] text-xs">({usp.desc})</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <a href="#katalog" className="bg-[#121212] text-white text-sm uppercase tracking-widest px-8 py-4 w-max hover:bg-[#8C907E] transition-colors duration-300">
              Explore Collection
          </a>
      </div>
      
      <div className="w-full md:w-1/2 h-[60vh] md:h-auto order-1 md:order-2 relative">
          <img src={client.heroImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"} alt="Editorial Hero" className="w-full h-full object-cover" 
               onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" }} />
               
          {/* Floating Spotlight Card */}
          {/* Floating Spotlight Card */}
          {spotlightProduct && (
            <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 max-w-[280px] bg-white p-5 shadow-2xl hidden md:block border border-gray-100 transition-transform duration-300 hover:-translate-y-2 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{spotlightLabel}</span>
                {flashSaleEnd && (
                  <span className="text-[9px] font-mono font-bold text-[#121212] bg-gray-100 px-2 py-0.5">{flashSaleEnd}</span>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <img src={spotlightProduct.imageUrl || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=200&auto=format&fit=crop"} alt={spotlightProduct.name} className="w-16 h-16 object-cover rounded-sm group-hover:opacity-80 transition" />
                  {client.marketing?.discountPercentage && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#121212] text-white text-[8px] font-bold px-1 py-0.5 rounded-sm">-{client.marketing.discountPercentage}%</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#121212] line-clamp-1">{spotlightProduct.name}</h3>
                  <span className="text-xs font-bold text-[#121212] block mt-0.5">{spotlightProduct.price}</span>
                </div>
              </div>
              <a href="#katalog" className="mt-4 block w-full text-center py-2.5 bg-[#121212] text-white text-[10px] uppercase tracking-widest hover:bg-[#8C907E] transition">
                {ctaText}
              </a>
            </div>
          )}
      </div>
    </section>
  );
}
