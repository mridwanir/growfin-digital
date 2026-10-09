import { useFnbDemo } from '../../core/FnbDemoContext';
import { MenuItem } from '@/lib/types';
import { Star, Eye, Sliders } from 'lucide-react';

const FNB_MENU_IMAGES = [
  '/image/fnb/fastfood/fastfood (2).jpg',
  '/image/fnb/fastfood/fastfood (3).jpg',
  '/image/fnb/fastfood/fastfood (4).jpg',
  '/image/fnb/fastfood/fastfood (5).jpg',
  '/image/fnb/fastfood/fastfood (6).jpg',
  '/image/fnb/fastfood/fastfood (7).jpg'
];

export function BoldMenu() {
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">{client.menuTitle || 'Katalog Visual Etalase'}</h2>
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest block mb-2">{client.menuDescription || 'Sajian Khas Kami'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {client.menu.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <div className="relative overflow-hidden aspect-4/3 bg-neutral-100 cursor-pointer" onClick={() => handleSelectProduct(item)}>
              <img src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <span className="absolute top-4 left-4 bg-neutral-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                {item.category || 'Menu Utama'}
              </span>
              <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="bg-white text-neutral-950 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition">
                  <Eye className="w-4 h-4" /> Quick View Spesifikasi
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>

                <h3 className="text-lg font-bold text-neutral-950 group-hover:text-brand-primary transition">{item.name}</h3>
                <p className="text-neutral-500 text-xs line-clamp-2 mt-1.5">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-neutral-950">{formatRupiah(item.price)}</span>
                </div>
                <button onClick={() => handleSelectProduct(item)} className="bg-brand-primary hover:bg-brand-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
                  <Sliders className="w-4 h-4" /> Konfigurasi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
