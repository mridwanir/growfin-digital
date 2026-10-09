import { useState } from 'react';
import { useFnbDemo } from '../../core/FnbDemoContext';
import { MenuItem } from '@/lib/types';
import { Plus } from 'lucide-react';

const FNB_MENU_IMAGES = [
  '/image/fnb/restaurant/restaurant (2).jpg',
  '/image/fnb/restaurant/restaurant (3).jpg',
  '/image/fnb/restaurant/restaurant (4).jpg',
  '/image/fnb/restaurant/restaurant (5).jpg',
  '/image/fnb/restaurant/restaurant (6).jpg',
  '/image/fnb/restaurant/restaurant (7).jpg'
];

export function ArtisanMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo();
  const [activeCategory, setActiveCategory] = useState<string>('All Menu');

  const categories = ['All Menu', ...Array.from(new Set(client.menu.map(p => p.category).filter(c => c && c !== 'All Menu')))];
  const filteredMenu = activeCategory === 'All Menu'
    ? client.menu
    : client.menu.filter(p => p.category === activeCategory);

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProductForCustomization(item);
    setIsCustomizationModalOpen(true);
  };

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val;
  };

  return (
    <section id="menu" className="py-16 md:py-24 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-stone-900 mt-1">{client.menuTitle || 'Eksplorasi Menu Kami'}</h2>
          <span className="text-brand-primary font-semibold tracking-wider text-xs uppercase">{client.menuDescription}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as string)}
            className={`cat-pill px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer whitespace-nowrap ${activeCategory === cat
              ? 'bg-stone-900 text-stone-100 shadow-sm'
              : 'bg-stone-200/70 hover:bg-stone-200 text-stone-700'
              }`}
          >
            {cat === 'All Menu' ? 'Semua Menu' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-stone-900 text-base group-hover:text-brand-primary transition leading-snug">{item.name}</h3>
                </div>
                <p className="text-stone-500 text-xs mt-1.5 line-clamp-2">{item.desc}</p>
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
              <div>
                <span className="font-bold text-stone-900 text-sm sm:text-base">{formatRupiah(item.price)}</span>
              </div>
              <button onClick={() => handleSelectProduct(item)} className="bg-brand-primary hover:bg-brand-hover text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                Kustom
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
