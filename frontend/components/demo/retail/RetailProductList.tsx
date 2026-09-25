'use client';

import { useState } from 'react';
import { useRetailDemo } from './RetailDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MenuItem } from '@/lib/types';

export const RETAIL_CATALOG_IMAGES = [
  '/image/retail/alina-bordunova-Lq78VGxRJhc-unsplash.jpg',
  '/image/retail/anomaly-WWesmHEgXDs-unsplash.jpg',
  '/image/retail/caio-coelho-QRN47la37gw-unsplash.jpg',
  '/image/retail/dmitry-ganin-EhWzbMPQcqQ-unsplash.jpg',
  '/image/retail/junko-nakase-Q-72wa9-7Dg-unsplash.jpg',
  '/image/retail/mediamodifier-7cERndkOyDw-unsplash.jpg',
  '/image/retail/parker-burchfield-tvG4WvjgsEY-unsplash.jpg',
  '/image/retail/tanya-layko-QINaeQQHghQ-unsplash.jpg',
  '/image/retail/thom-bradley-mwa_nzFpnJw-unsplash.jpg',
  '/image/retail/tobias-tullius-Fg15LdqpWrs-unsplash.jpg'
];

export const getRetailImageUrl = (id: number) => {
  return RETAIL_CATALOG_IMAGES[(id || 0) % RETAIL_CATALOG_IMAGES.length];
};

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
      className={`group cursor-pointer transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      onClick={handleOpenProduct}
    >
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getRetailImageUrl(item.id)} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
        
        {/* Hover Action (Dekstop) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur text-center py-3 rounded-xl font-medium text-gray-900 shadow-lg">
            Quick View
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">{item.name}</h3>
      <p className="text-gray-500 font-medium">{formatPrice(item.price)}</p>
    </div>
  );
}

export function RetailProductList() {
  const { client } = useRetailDemo();
  const catalog = client.menu || [];

  return (
    <section id="koleksi" className="py-20 bg-gray-50 -mx-4 sm:mx-0 px-4 sm:px-6 lg:px-8 sm:rounded-[40px] mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Koleksi Terbaru</h2>
            <p className="text-gray-500">Pilihan produk dengan kualitas terbaik dari {client.name}.</p>
          </div>
          <a href="#" className="hidden md:block text-brand-primary font-medium hover:underline">Lihat Semua</a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {catalog.length > 0 ? (
            catalog.map((item, idx) => (
              <AnimatedProductCard 
                key={item.id} 
                item={item} 
                index={idx}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[40px] border border-gray-200">
              <span className="text-6xl mb-4 opacity-50">🛍️</span>
              <p className="text-xl font-bold text-gray-600">Belum ada produk</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
