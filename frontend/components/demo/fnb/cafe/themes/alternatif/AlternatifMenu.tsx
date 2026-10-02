import { useState } from 'react';
import { useFnbDemo } from '../../../core/FnbDemoContext';
import { MenuItem } from '@/lib/types';

const FNB_MENU_IMAGES = [
  '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/fnb/mahesa-tyo-X0HP9m0euz0-unsplash.jpg'
];

export function AlternatifMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(client.menu.map(p => p.category).filter(c => c && c !== 'Semua')))];
  const filteredMenu = activeCategory === 'Semua'
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
    <section id="menu" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">Pilihan Menu</h2>
            
            <div className="flex overflow-x-auto gap-3 justify-start md:justify-center mt-8 pb-4" style={{ scrollbarWidth: 'none' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat as string)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm active:scale-95 transition-all whitespace-nowrap shadow-md ${
                      activeCategory === cat 
                        ? 'bg-brand-primary text-white' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {filteredMenu.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="bg-white rounded-3xl p-4 flex gap-4 border border-stone-100 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              >
                 <img src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]} alt={item.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0" />
                 <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-stone-900 mb-1">{item.name}</h3>
                    <p className="text-stone-500 text-sm line-clamp-2 mb-3">{item.desc}</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="font-bold text-brand-primary">{formatRupiah(item.price)}</span>
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                           +
                        </div>
                    </div>
                 </div>
              </div>
            ))}
        </div>
    </section>
  )
}
