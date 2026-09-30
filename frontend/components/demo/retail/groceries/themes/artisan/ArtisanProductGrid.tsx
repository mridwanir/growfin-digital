'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../../core/GroceriesContext';
import { useState } from 'react';

export function ArtisanProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen, addToCart } = useGroceriesDemo();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(client.menu.map(p => p.category).filter(c => c && c !== 'Semua')))];
  const filteredProducts = activeCategory === 'Semua' ? client.menu : client.menu.filter(p => p.category === activeCategory);

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const price = Number(product.price.toString().replace(/[^0-9]/g, '')) || 0;
    addToCart({
      id: product.id.toString(),
      product,
      quantity: 1,
      selectedVariant: product.variants?.[0] || 'Original',
      selectedSize: 'Standard',
      totalPrice: price
    });
  };

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--theme-color)]">Etalase Pangan</span>
          <h2 className="text-3xl font-serif-display font-bold text-zinc-900 mt-1">Katalog Produk Pilihan Hari Ini</h2>
        </div>
        
        {/* Filter Badges UI */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {categories.slice(0, 4).map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full border transition ${activeCategory === cat ? 'bg-[var(--theme-color)] text-white border-[var(--theme-color)]' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Tall Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((p) => {
          const price = Number(p.price.toString().replace(/[^0-9]/g, '')) || 0;
          return (
            <div key={p.id} className="group bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => handleOpenModal(p)}>
                <img src={p.imageUrl || getGroceryPlaceholderImage(p.id)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <span className="w-full py-2 bg-white/95 backdrop-blur-md rounded-xl text-center text-xs font-bold text-zinc-900 shadow-sm">
                    Lihat Spesifikasi
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#FBF9F5]/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-lg text-zinc-700">
                  {p.category}
                </span>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 onClick={() => handleOpenModal(p)} className="text-sm sm:text-base font-bold text-zinc-900 hover:text-[var(--theme-color)] cursor-pointer line-clamp-1 transition">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{p.variants?.[0] || '1 Pack'}</p>
                  <div className="text-base sm:text-lg font-extrabold text-[var(--theme-color)] mt-2">
                    {formatIDR(price)}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button onClick={() => handleOpenModal(p)} className="flex-1 py-2 px-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-semibold transition text-center cursor-pointer">
                    Detail
                  </button>
                  <button onClick={(e) => handleQuickAdd(e, p)} className="py-2 px-3 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-amber-200 text-xs font-bold shadow-xs transition flex items-center justify-center gap-1 cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    Beli
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
