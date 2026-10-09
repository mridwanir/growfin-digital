'use client';

import { useRetailDemo, getRetailPlaceholderImage } from '../../core/RetailDemoContext';

export function TechProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useRetailDemo();

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">{client.menuTitle || client.name}</h2>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{client.menuDescription || "Perangkat unggulan garansi 24 Bulan"}</span>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {client.menu.map((prod) => {
          const priceNum = Number(prod.price.toString().replace(/[^0-9]/g, '')) || 0;
          return (
            <div key={prod.id} className="bg-white rounded-3xl border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-400 hover:shadow-lg transition-all duration-300">
              <div>
                <div className="relative aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden mb-5 cursor-pointer" onClick={() => handleOpenModal(prod)}>
                  <img
                    src={prod.imageUrl || getRetailPlaceholderImage(prod.id)}
                    alt={prod.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />

                </div>

                {prod.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{prod.category}</span>
                )}
                <h3 className="text-base font-bold text-zinc-950 mt-1 line-clamp-1">{prod.name}</h3>
                {prod.desc && (
                  <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">{prod.desc}</p>
                )}
              </div>

              <div className="pt-5 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 line-through">{formatIDR(priceNum * 1.2)}</span>
                  <div className="text-lg font-bold text-zinc-950">{formatIDR(priceNum)}</div>
                </div>
                <button onClick={() => handleOpenModal(prod)} className="px-4 py-2.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm hover:opacity-90" style={{ backgroundColor: 'var(--theme-color)' }}>
                  Detail
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
}
