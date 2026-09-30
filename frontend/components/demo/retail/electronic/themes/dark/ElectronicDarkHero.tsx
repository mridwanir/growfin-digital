'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkHero() {
  const { client } = useElectronicDemo();
  
  const spotlightProduct = client.menu?.[0] || {
    name: "Voltrix Studio Pro Wireless",
    desc: "Active Noise Cancelling 48dB • 60H Battery",
    price: 2499000,
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
  };

  const priceNum = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 2499000;
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section className="relative overflow-hidden py-12 lg:py-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] blur-[130px] rounded-full pointer-events-none opacity-20" style={{ backgroundColor: 'var(--theme-color)' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--theme-color)', color: 'var(--theme-color)' }}>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--theme-color)' }}></span>
              Buka {client.openTime && client.closeTime ? `${client.openTime} - ${client.closeTime}` : 'Setiap Hari'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {client.name}.<br/>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-color), #7dd3fc, #3b82f6)' }}>
                {client.tagline ? client.tagline.split(':')[0] : "Performa Kelas Flagship."}
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              {client.tagline || "Kurasi perangkat elektronik dan gadget premium dengan spesifikasi tertinggi untuk workstation profesional dan audiophile sejati. Garansi distributor resmi 24 bulan."}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#katalog" className="px-8 py-3.5 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:opacity-90" style={{ backgroundColor: 'var(--theme-color)' }}>
                Jelajahi Katalog <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#lookbook" className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold rounded-xl transition-all">
                Inspirasi Setup
              </a>
            </div>

            {/* Feature mini-bullets */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
              <div>
                <p className="font-bold text-slate-200 text-sm">100% Original</p>
                <span>Distributor Resmi</span>
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">Same-Day Courier</p>
                <span>Instant Packing Aman</span>
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">24 Bulan Garansi</p>
                <span>Ganti Unit Baru</span>
              </div>
            </div>
          </div>

          {/* Right Promotional Showcase Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-2 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
                <img 
                  src={spotlightProduct.imageUrl || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"} 
                  alt="Spotlight" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase" style={{ color: 'var(--theme-color)' }}>Featured Spotlight</span>
                      <h3 className="font-bold text-white text-base line-clamp-1">{spotlightProduct.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{spotlightProduct.desc || 'Premium Tech Gear'}</p>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-xs line-through text-slate-500">{formatIDR(priceNum * 1.35)}</span>
                      <p className="font-bold text-lg" style={{ color: 'var(--theme-color)' }}>{formatIDR(priceNum)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
