'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function TechHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo();
  
  const spotlightProduct = client.menu?.[0] || {
    name: "Aether Mech 75 Low-Profile",
    desc: "Gasket Mount 75% • CNC Aluminum Top Case",
    price: 1850000,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop"
  };

  const basePrice = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 1850000;
  const discountPercentage = client.marketing?.discountPercentage || 35;
  const originalPrice = basePrice * (1 + discountPercentage / 100);
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const spotlightLabel = client.marketing?.promoLabel || 'Penawaran Terbatas';
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang';
  const flashSaleEnd = client.marketing?.flashSaleEnd;
  const secondaryAction = client.heroSecondaryAction || 'gallery';
  const getWaUrl = () => `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Main Billboard Banner (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl p-8 sm:p-14 flex flex-col justify-between relative overflow-hidden min-h-[460px] bg-zinc-950 shadow-xl">
          <img 
            src={client.heroImage || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"} 
            alt="Minimalist Tech" 
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent"></div>

          <div className="relative z-10 max-w-xl space-y-4">
            {client.marketing?.promoLabel && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-color)' }}></span>
                {client.marketing.promoLabel}
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {client.name}.
            </h1>
            {client.tagline && (
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {client.tagline}
              </p>
            )}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a href="#katalog" className="px-6 py-3 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm" style={{ backgroundColor: 'var(--theme-color)' }}>
                {client.uiLabels?.buyButtonText || 'Lihat Seluruh Produk'}
              </a>
              
              {secondaryAction === 'whatsapp' ? (
                <a href={getWaUrl()} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer backdrop-blur-md">
                  Hubungi Kami
                </a>
              ) : secondaryAction === 'cart' ? (
                <button onClick={() => setIsCartDrawerOpen(true)} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer backdrop-blur-md">
                  Cek Keranjang
                </button>
              ) : (
                <a href="#lookbook" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer backdrop-blur-md">
                  {client.uiLabels?.lookbookButtonText || 'Jelajahi Inspirasi Setup'}
                </a>
              )}
            </div>

            {/* Mini USP Badges */}
            <div className="pt-8 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 max-w-md">
              {(client.marketing?.usps || [
                { title: 'Garansi Resmi', desc: '12 Bulan Servis' },
                { title: 'Pengiriman Aman', desc: 'Asuransi Penuh' },
                { title: 'Dukungan Teknis', desc: 'Layanan 24/7' }
              ]).map((usp, idx) => (
                <div key={idx}>
                  <p className="font-bold text-white text-xs uppercase">{usp.title}</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5 leading-tight">{usp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo Spotlight Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-zinc-200/80 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <span>{spotlightLabel}</span>
              {discountPercentage > 0 && (
                <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">-{discountPercentage}% OFF</span>
              )}
            </div>
            
            {flashSaleEnd && (
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Berakhir dalam</span>
                <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{flashSaleEnd}</span>
              </div>
            )}

            <div className="aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden mb-6 flex items-center justify-center p-4">
              <img 
                src={spotlightProduct.imageUrl || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop"} 
                alt={spotlightProduct.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            <h3 className="text-lg font-bold text-zinc-950 line-clamp-1">{spotlightProduct.name}</h3>
            {spotlightProduct.desc && (
              <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{spotlightProduct.desc}</p>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-100 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {discountPercentage > 0 && (
                <span className="text-xs text-zinc-400 line-through">{formatIDR(originalPrice)}</span>
              )}
              <div className="text-xl font-bold text-zinc-950">{formatIDR(basePrice)}</div>
            </div>
            <a href="#katalog" className="px-5 py-2.5 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer shadow-sm hover:opacity-90 flex-shrink-0 text-center" style={{ backgroundColor: 'var(--theme-color)' }}>
              {ctaText}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
