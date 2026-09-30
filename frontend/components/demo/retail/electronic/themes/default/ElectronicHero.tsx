'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicHero() {
  const { client } = useElectronicDemo();
  
  const spotlightProduct = client.menu?.[0] || {
    name: "Aether Mech 75 Low-Profile",
    desc: "Gasket Mount 75% • CNC Aluminum Top Case",
    price: 1850000,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop"
  };

  const priceNum = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 1850000;
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Main Billboard Banner (8 Cols) */}
        <div className="lg:col-span-8 bg-zinc-100 rounded-3xl p-8 sm:p-14 border border-zinc-200/80 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-900 text-[11px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-color)' }}></span>
              Koleksi Terbaru Musim Ini
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15]">
              {client.name}.<br/>{client.tagline ? client.tagline.split(':')[0] : "Performa Audio & Komputasi."}
            </h1>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              {client.tagline || "Menghadirkan lini perangkat keras minimalis dengan material aluminium anodized dan tuning akustik kelas studio profesional."}
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a href="#katalog" className="px-6 py-3 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm" style={{ backgroundColor: 'var(--theme-color)' }}>
                Lihat Seluruh Produk
              </a>
              <a href="#lookbook" className="px-6 py-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all">
                Jelajahi Inspirasi Setup
              </a>
            </div>
          </div>

          {/* Ambient Product Image inside Banner */}
          <div className="mt-8 lg:mt-0 lg:absolute lg:right-[-40px] lg:bottom-[-20px] lg:w-96 rounded-2xl overflow-hidden shadow-2xl border border-white">
            <img 
              src={client.heroImage || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"} 
              alt="Minimalist Tech" 
              className="w-full h-72 lg:h-96 object-cover"
            />
          </div>
        </div>

        {/* Promo Spotlight Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-zinc-200/80 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <span>Penawaran Terbatas</span>
              <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">-35% OFF</span>
            </div>

            <div className="aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden mb-6 flex items-center justify-center p-4">
              <img 
                src={spotlightProduct.imageUrl || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop"} 
                alt="Promo Item" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            <h3 className="text-lg font-bold text-zinc-950 line-clamp-1">{spotlightProduct.name}</h3>
            <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{spotlightProduct.desc || 'Gasket Mount 75% • CNC Aluminum Top Case'}</p>
          </div>

          <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 line-through">{formatIDR(priceNum * 1.35)}</span>
              <div className="text-xl font-bold text-zinc-950">{formatIDR(priceNum)}</div>
            </div>
            <a href="#katalog" className="p-3 text-white rounded-xl transition-colors cursor-pointer shadow-sm hover:opacity-90" style={{ backgroundColor: 'var(--theme-color)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
