'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function DarkHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo();
  
  const spotlightProduct = client.menu?.[0] || {
    name: "Voltrix Studio Pro Wireless",
    desc: "Active Noise Cancelling 48dB • 60H Battery",
    price: 2499000,
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
  };

  const basePrice = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 2499000;
  const discountPercentage = client.marketing?.discountPercentage || 35;
  const originalPrice = basePrice * (1 + discountPercentage / 100);
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const spotlightLabel = client.marketing?.promoLabel || 'Featured Spotlight';
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang';
  const flashSaleEnd = client.marketing?.flashSaleEnd;
  const secondaryAction = client.heroSecondaryAction || 'gallery';
  const getWaUrl = () => `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`;

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
              {client.name}.
            </h1>

            {client.tagline && (
              <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                {client.tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#katalog" className="px-8 py-3.5 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:opacity-90" style={{ backgroundColor: 'var(--theme-color)' }}>
                {client.uiLabels?.buyButtonText || 'Jelajahi Katalog'} <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              
              {secondaryAction === 'whatsapp' ? (
                <a href={getWaUrl()} target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold rounded-xl transition-all cursor-pointer">
                  Hubungi Kami
                </a>
              ) : secondaryAction === 'cart' ? (
                <button onClick={() => setIsCartDrawerOpen(true)} className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold rounded-xl transition-all cursor-pointer">
                  Cek Keranjang
                </button>
              ) : (
                <a href="#lookbook" className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold rounded-xl transition-all cursor-pointer">
                  {client.uiLabels?.lookbookButtonText || 'Inspirasi Setup'}
                </a>
              )}
            </div>

            {/* Feature mini-bullets */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
              {(client.marketing?.usps || [
                { title: '100% Original', desc: 'Distributor Resmi' },
                { title: 'Same-Day Courier', desc: 'Instant Packing Aman' },
                { title: '24 Bulan Garansi', desc: 'Ganti Unit Baru' }
              ]).map((usp, idx) => (
                <div key={idx}>
                  <p className="font-bold text-slate-200 text-sm">{usp.title}</p>
                  <span>{usp.desc}</span>
                </div>
              ))}
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
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded text-white mb-1 inline-block" style={{ color: 'var(--theme-color)' }}>{spotlightLabel}</span>
                      <h3 className="font-bold text-white text-base line-clamp-1">{spotlightProduct.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{spotlightProduct.desc}</p>
                    </div>
                    {discountPercentage > 0 && (
                      <span className="text-[10px] font-bold text-slate-950 px-2 py-0.5 rounded whitespace-nowrap ml-2" style={{ backgroundColor: 'var(--theme-color)' }}>
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>
                  
                  {flashSaleEnd && (
                    <div className="mb-3 inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/50 px-2.5 py-1 rounded-md">
                      <svg className="w-3.5 h-3.5 text-rose-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span className="text-[10px] font-mono font-bold text-rose-400 tracking-widest">{flashSaleEnd}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                    <div>
                      {discountPercentage > 0 && (
                        <span className="text-[10px] line-through text-slate-500 block leading-none mb-0.5">{formatIDR(originalPrice)}</span>
                      )}
                      <p className="font-bold text-base sm:text-lg leading-none" style={{ color: 'var(--theme-color)' }}>{formatIDR(basePrice)}</p>
                    </div>
                    <a href="#katalog" className="px-4 py-2 text-slate-950 font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-lg hover:opacity-90 transition" style={{ backgroundColor: 'var(--theme-color)' }}>
                      {ctaText}
                    </a>
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
