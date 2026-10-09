'use client';

import { useRetailDemo, getRetailPlaceholderImage } from '../../core/RetailDemoContext';

export function DarkProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useRetailDemo();

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section id="katalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white mt-1">{client.menuTitle || client.name}</h2>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--theme-color)' }}>{client.menuDescription || "Produk Terbaik kami hadir disini"}</span>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {client.menu.map((prod) => {
          const priceNum = Number(prod.price.toString().replace(/[^0-9]/g, '')) || 0;
          return (
            <div key={prod.id} className="group bg-slate-900/40 rounded-3xl border border-slate-800/90 hover:border-slate-700 transition-all duration-300 flex flex-col overflow-hidden">
              {/* Large Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => handleOpenModal(prod)}>
                <img
                  src={prod.imageUrl || getRetailPlaceholderImage(prod.id)}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow" style={{ backgroundColor: 'var(--theme-color)' }}>
                  {prod.category?.split(' ')[0] || 'Tech'}
                </span>
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-sm border border-slate-700 flex items-center gap-1.5 shadow-lg">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg> Quick View
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {prod.category && (
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{prod.category}</span>
                  )}
                  <h3 className="text-base font-bold text-white mt-1 transition-colors line-clamp-1" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>
                    {prod.name}
                  </h3>
                  {prod.desc && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {prod.desc}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--theme-color)' }}>{formatIDR(priceNum)}</div>
                  </div>

                  <button
                    onClick={() => handleOpenModal(prod)}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-200 transition-colors cursor-pointer hover:bg-slate-700"
                    title="Lihat Detail & Beli"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
