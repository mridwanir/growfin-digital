'use client';

import { useState } from 'react';
import { useRetailDemo } from './RetailDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MenuItem } from '@/lib/types';

function AnimatedProductCard({ item, index }: { item: MenuItem; index: number }) {
  const { setSelectedProductForCustomization, setIsCustomizationModalOpen } = useRetailDemo();
  const delay = (index % 4) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  const formatPrice = (price?: string) => {
    if (!price) return '';
    const cleaned = price.trim();
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned;
    }
    return `Rp ${cleaned}`;
  };

  const handleOpenProduct = () => {
    setSelectedProductForCustomization(item);
    setIsCustomizationModalOpen(true);
  };

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 flex flex-col group relative transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Visual Tags */}
      {item.tag && (
        <div className="absolute top-4 right-4 z-10 animate-bounce [animation-duration:3s]">
          <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-brand-primary text-white shadow-xl rotate-12">
            {item.tag} ✨
          </div>
        </div>
      )}

      {/* Large Visual Image Area */}
      <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden bg-slate-100/50 cursor-pointer" onClick={handleOpenProduct}>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary to-brand-dark opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl || `https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80`}
          alt={item.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out relative z-0"
        />
        
        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-sm font-black text-slate-900 shadow-md">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="text-lg font-black text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-slate-950 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium mb-5">
          {item.desc}
        </p>
        <div className="mt-auto">
          <button
            onClick={handleOpenProduct}
            className="w-full flex items-center justify-center py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white text-sm font-extrabold transition-all active:scale-95 shadow-lg shadow-brand-primary/25 overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">Pesan Sekarang 🛍️</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function RetailProductList() {
  const { client } = useRetailDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredCatalog = client.menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="katalog" className="space-y-10 scroll-mt-24">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <h2 className="text-3xl font-black text-slate-900">
          Koleksi <span className="text-brand-primary">Kami</span>
        </h2>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-4">
          {/* Search Bar */}
          <div className="relative group w-full sm:w-[300px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-dark rounded-full blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-sm border border-slate-200">
              <span className="text-slate-400 text-lg">✨</span>
              <input
                type="text"
                placeholder="Cari produk impianmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-bold"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500 font-bold hover:bg-slate-200">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory">
            {client.categories?.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 snap-start rounded-2xl px-5 py-3 text-sm font-black transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-brand-primary to-brand-dark text-white shadow-lg shadow-brand-primary/25 scale-105'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:scale-105'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
        {filteredCatalog.length > 0 ? (
          filteredCatalog.map((item, idx) => (
            <AnimatedProductCard 
              key={item.id} 
              item={item} 
              index={idx}
            />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-200">
            <span className="text-6xl mb-4 opacity-50">🕵️‍♀️</span>
            <p className="text-xl font-bold text-slate-600">Oops! Produk tidak ditemukan.</p>
            <p className="text-sm text-slate-400 mt-2">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </div>
    </section>
  );
}
