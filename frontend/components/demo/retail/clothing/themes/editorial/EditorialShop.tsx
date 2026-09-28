'use client';

import { useClothingDemo } from '../../core/ClothingContext';
import { getRetailImageUrl } from '../default/RetailProductList';

export function EditorialShop() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useClothingDemo();

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

  const openQuickView = (prod: any) => {
    setSelectedProductForCustomization(prod);
    setIsCustomizationModalOpen(true);
  };

  return (
    <section id="shop" className="py-24 bg-[#FFFFFF] px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif-custom mb-16 text-center">The <span className="italic text-[#8E8E8E]">Archive</span></h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((prod: any, idx: number) => (
                <div key={idx} className="group cursor-pointer flex flex-col" onClick={() => openQuickView(prod)}>
                    <div className="w-full aspect-[3/4] bg-[#F5F5F5] overflow-hidden mb-6 relative">
                        <img src={prod.imageUrl || getRetailImageUrl(prod.id)}
                             alt={prod.name} 
                             className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                             onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&auto=format&fit=crop" }} />
                        
                        <div className="absolute inset-0 bg-[#121212]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                            <span className="bg-white text-[#121212] text-[10px] uppercase tracking-[0.2em] px-6 py-3 font-semibold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                Quick View
                            </span>
                        </div>
                    </div>
                    <h3 className="font-serif-custom text-xl text-[#121212] group-hover:text-[#8E8E8E] transition-colors">{prod.name}</h3>
                    <p className="text-sm tracking-widest text-[#8E8E8E] mt-2 font-light">{formatPrice(prod.price)}</p>
                </div>
              ))}
          </div>
      </div>
    </section>
  );
}
