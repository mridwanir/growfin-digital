'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../../core/GroceriesContext';
import { useState } from 'react';

export function GroceriesProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useGroceriesDemo();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const categories = ['Semua', ...Array.from(new Set(client.menu.map(p => p.category).filter(c => c && c !== 'Semua')))];
  const filteredProducts = activeCategory === 'Semua' ? client.menu : client.menu.filter(p => p.category === activeCategory);

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-color)]">Etalase Toko</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">Katalog Produk Pilihan</h2>
          <p className="text-sm text-zinc-500 mt-1">Format visual besar & bersih untuk kenyamanan inspeksi detail kemasan & bahan.</p>
        </div>

        {/* Kategori Filter Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {categories.slice(0, 5).map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full transition ${activeCategory === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item, index) => (
          <div key={item.id} className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Large Aspect Ratio Clean Image Container */}
              <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden cursor-pointer" onClick={() => handleOpenProduct(item)}>
                <img src={item.imageUrl || getGroceryPlaceholderImage(item.id)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
                <button className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-zinc-900 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition transform group-hover:scale-110">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.35c18.83-18.83,27.3-37.62,27.65-38.41A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-extrabold text-base text-zinc-900 group-hover:text-[var(--theme-color)] transition-colors line-clamp-1 cursor-pointer" onClick={() => handleOpenProduct(item)}>
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc || 'Produk unggulan berkualitas premium dengan standar higienis.'}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-zinc-100">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 font-bold block">Harga Mulai</span>
                <span className="text-base font-black text-[var(--theme-color)]">{formatIDR(Number(item.price.toString().replace(/[^0-9]/g, '')) || 0)}</span>
              </div>
              <button onClick={() => handleOpenProduct(item)} className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-[var(--theme-color)] text-emerald-700 hover:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48V88a8,8,0,0,1-16,0V56H56V200H200V168a8,8,0,0,1,16,0v32a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,48ZM229.66,106.34l-32-32a8,8,0,0,0-11.32,11.32L204.69,104H88a8,8,0,0,0,0,16H204.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,229.66,106.34Z"></path></svg>
                <span>Opsi & Beli</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
