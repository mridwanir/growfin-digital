import { useState } from 'react';
import { useCafeDemo } from './CafeDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MenuItem } from '@/lib/types';
import { Plus } from 'lucide-react';

const CAFE_MENU_IMAGES = [
  '/image/cafe/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/cafe/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/cafe/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/cafe/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/cafe/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/cafe/mahesa-tyo-X0HP9m0euz0-unsplash.jpg'
];

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { setSelectedProductForCustomization, setIsCustomizationModalOpen } = useCafeDemo();
  const delay = (index % 4) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val;
  };

  const menuImageUrl = CAFE_MENU_IMAGES[index % CAFE_MENU_IMAGES.length];

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      <div className="h-48 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={menuImageUrl} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-semibold text-stone-900 shadow-sm">
          {item.category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-stone-900 leading-tight">{item.name}</h3>
        </div>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">{item.desc}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-brand-primary">{formatRupiah(item.price)}</span>
          <button
            onClick={() => {
              setSelectedProductForCustomization(item);
              setIsCustomizationModalOpen(true);
            }}
            className="bg-stone-900 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CafeServiceList() {
  const { client } = useCafeDemo();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal(0.1);

  const categories = ['Semua', ...Array.from(new Set(client.menu.map(p => p.category).filter(Boolean)))];
  const filteredProducts = activeCategory === 'Semua'
    ? client.menu
    : client.menu.filter(p => p.category === activeCategory);

  return (
    <section id="menu" className="py-16 max-w-7xl mx-auto px-4 min-h-screen scroll-mt-20">
      <div
        ref={headerRef}
        className={`flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 transition-all duration-700 transform ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div>
          <h2 className="text-3xl font-bold text-stone-900 mb-2">Eksplorasi Menu</h2>
          <p className="text-stone-500">Pilih hidangan favoritmu dan sesuaikan selera</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto scrollbar-none gap-2 pb-2">
          {categories.map(c => {
            const isActive = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c as string)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${isActive
                    ? `bg-stone-900 text-white`
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p, idx) => (
          <MenuCard key={p.id} item={p} index={idx} />
        ))}
      </div>
    </section>
  );
}
