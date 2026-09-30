import { useState } from 'react';
import { useFnbDemo } from '../../../core/FnbDemoContext';
import { MenuItem } from '@/lib/types';
import { Plus } from 'lucide-react';

const FNB_MENU_IMAGES = [
  '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/fnb/mahesa-tyo-X0HP9m0euz0-unsplash.jpg'
];

export function PremiumMenu() {
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
    <section id="menu-section" className="relative pt-20 pb-24 bg-slate-950">
        <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 pt-4 pb-4 px-4 md:px-8 mb-12">
            <div className="max-w-6xl mx-auto flex overflow-x-auto gap-4 justify-start md:justify-center items-center" style={{ scrollbarWidth: 'none' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat as string)}
                    className={`px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap active:scale-95 transition-all ${
                      activeCategory === cat 
                        ? 'bg-brand-primary text-slate-950' 
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-transparent hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => handleSelectProduct(item)}
                    className="flex gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer group"
                  >
                    <img src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]} alt={item.name} className="w-24 h-24 rounded-lg object-cover shadow-md" />
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-white font-semibold group-hover:text-brand-primary transition-colors">{item.name}</h4>
                        </div>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.desc}</p>
                        <div className="mt-auto flex justify-between items-center">
                            <span className="text-brand-primary font-medium text-sm">{formatRupiah(item.price)}</span>
                            <button className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-slate-950 group-hover:border-brand-primary transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                  </div>
                ))}
            </div>
        </div>
    </section>
  )
}
