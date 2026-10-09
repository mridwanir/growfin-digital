import { useState } from 'react';
import { useFnbDemo } from '../../core/FnbDemoContext';
import { MenuItem } from '@/lib/types';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

const FNB_MENU_IMAGES = [
  '/image/fnb/bakeryndessert/bakeryndessert (2).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (3).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (4).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (5).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (6).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (7).jpg'
];

export function ElegantMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo();

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProductForCustomization(item);
    setIsCustomizationModalOpen(true);
  };

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val;
  };

  return (
    <section id="menu" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>

          <h2 className="font-serif-title text-3xl sm:text-4xl text-stone-900 font-bold mt-1">{client.menuTitle || 'Etalase Pilihan Chef'}</h2>
          <p className="text-stone-600 text-sm mt-1">{client.menuDescription || 'Pilih sajian segar yang siap meluncur ke depan pintu rumah Anda.'}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <span className="inline-flex items-center gap-2 bg-stone-200 px-4 py-2 rounded-full text-xs font-semibold text-stone-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Semua Varian Siap Kirim Hari Ini
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {client.menu.map((item, idx) => (
          <div key={item.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-md border border-stone-100 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer" onClick={() => handleSelectProduct(item)}>
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                <span className="text-[10px] font-bold text-stone-900 uppercase tracking-wider">{item.category || "Menu Utama"}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-serif-title font-bold text-xl text-stone-900 group-hover:text-brand-primary transition-colors leading-snug">{item.name}</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>

                  <span className="font-bold text-lg text-brand-primary">{formatRupiah(item.price)}</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition shadow-sm">
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
