import { useFnbDemo } from '../../core/FnbDemoContext';
import { MenuItem } from '@/lib/types';
import { Eye } from 'lucide-react';

const FNB_MENU_IMAGES = [
  '/image/fnb/bubleteanjuice/bubleteanjuice (2).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (3).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (4).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (5).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (6).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (7).jpg'
];

export function VibrantMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo();

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProductForCustomization(item);
    setIsCustomizationModalOpen(true);
  };

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val;
  };

  return (
    <section id="menu" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">{client.menuTitle || 'Etalase Minuman Segar'}</h2>
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">{client.menuDescription || 'Sajian Khas Kami'}</span>

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {client.menu.map((item, idx) => (
            <div key={item.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-200/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer" onClick={() => handleSelectProduct(item)}>
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-stone-900 shadow-sm">
                    {item.category || 'Menu Utama'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-brand-primary transition-colors">{item.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-base font-extrabold text-stone-900">{formatRupiah(item.price)}</span>
                  <button className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-primary/20 cursor-pointer flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Detail / SKU
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
