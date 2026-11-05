'use client';

import { useRetailDemo, getClothingPlaceholderImage } from '../../core/RetailDemoContext';
import { hasValidDiscount, getDiscountPercentage, parseNumericPrice } from '@/lib/catalog';
import { MenuItem } from '@/lib/types';

export function EditorialProductGrid() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useRetailDemo();

  const products = client.menu || [];

  const formatPrice = (price?: string | number) => {
    if (!price) return 'Rp 0';
    if (typeof price === 'number') {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    }
    const cleaned = price.trim();
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned;
    }
    // Try parsing if it's just a raw numeric string
    const parsed = parseInt(cleaned.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parsed);
    }
    return `Rp ${cleaned}`;
  };

  const openQuickView = (prod: MenuItem) => {
    setSelectedProductForCustomization(prod);
    setIsCustomizationModalOpen(true);
  };

  return (
    <section id="katalog" className="py-24 bg-[#FFFFFF] px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif-custom">{client.menuTitle || "The Archive"}</h2>
          <p className="mt-4 text-brand-primary font-light text-sm uppercase tracking-widest">{client.menuDescription || "Koleksi Terbaik Kami"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((prod: MenuItem, idx: number) => {
            const hasDiscount = hasValidDiscount(prod.price, prod.originalPrice);
            const discountPct = getDiscountPercentage(prod.price, prod.originalPrice);
            const origNum = parseNumericPrice(prod.originalPrice);
            return (
              <div key={idx} className="group cursor-pointer flex flex-col" onClick={() => openQuickView(prod)}>
              <div className="w-full aspect-[3/4] bg-[#F5F5F5] overflow-hidden mb-6 relative">
                <img src={prod.imageUrl || getClothingPlaceholderImage(prod.id)}
                  alt={prod.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&auto=format&fit=crop" }} />

                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-[#121212] text-white text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 z-10">
                    -{discountPct}%
                  </span>
                )}

                <div className="absolute inset-0 bg-[#121212]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                  <span className="bg-white text-[#121212] text-[10px] uppercase tracking-[0.2em] px-6 py-3 font-semibold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Quick View
                  </span>
                </div>
              </div>
              <h3 className="font-serif-custom text-xl text-[#121212] group-hover:text-[#8E8E8E] transition-colors">{prod.name}</h3>
              {hasDiscount ? (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-sm tracking-widest text-brand-primary font-light">{formatPrice(prod.price)}</span>
                  {origNum !== undefined && (
                    <span className="text-xs text-[#8E8E8E] line-through font-light">
                      {formatPrice(origNum)}
                    </span>
                  )}
                  <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-medium px-1.5 py-0.5 rounded">
                    Hemat {discountPct}%
                  </span>
                </div>
              ) : (
                <p className="text-sm tracking-widest text-brand-primary mt-2 font-light">{formatPrice(prod.price)}</p>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
