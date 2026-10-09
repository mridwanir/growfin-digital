'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function FreshHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo();
  const spotlightProduct = client.menu?.[0] || {
    id: 'spotlight-1',
    name: "Produk Unggulan",
    desc: "Kualitas terbaik pilihan kami",
    price: 150000,
    imageUrl: client.heroImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
  };
  const basePrice = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 150000;
  const discountPercentage = client.marketing?.discountPercentage || 35;
  const originalPrice = basePrice * (1 + discountPercentage / 100);
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const spotlightLabel = client.marketing?.promoLabel || client.categories?.[0] || 'Rekomendasi Utama';
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang';
  const flashSaleEnd = client.marketing?.flashSaleEnd;
  const secondaryAction = client.heroSecondaryAction || 'gallery';
  const getWaUrl = () => `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="relative rounded-3xl overflow-hidden bg-green-950 from-emerald-950 via-emerald-900 to-zinc-900 text-white shadow-2xl" style={{ backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))', '--tw-gradient-from': 'color-mix(in srgb, var(--theme-color) 40%, black)', '--tw-gradient-via': 'color-mix(in srgb, var(--theme-color) 20%, black)', '--tw-gradient-to': '#18181b' } as React.CSSProperties}>
        <img src={client.heroImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"} alt="Fresh Market" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Buka {client.openTime && client.closeTime ? `${client.openTime} - ${client.closeTime}` : '24 Jam Non-Stop'}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Kebutuhan Harian, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Siap Kirim Kilat.</span>
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              {client.tagline || "Dari Onigiri Salmon hangat, bento box artisan, matcha cold brew, hingga snack import eksklusif. Rasakan kemudahan belanja ala minimarket dari rumah."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#katalog" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--theme-color)] hover:brightness-110 text-white font-bold transition transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 text-sm">
                <span>{client.uiLabels?.buyButtonText || 'Buka Etalase Produk'}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z" transform="scale(1, -1) translate(0, -256)"></path></svg>
              </a>
              
              {secondaryAction === 'whatsapp' ? (
                <a href={getWaUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold transition text-sm cursor-pointer">
                  <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256"><path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path></svg>
                  <span>Hubungi Kami</span>
                </a>
              ) : secondaryAction === 'cart' ? (
                <button onClick={() => setIsCartDrawerOpen(true)} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold transition text-sm cursor-pointer">
                  <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256"><path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path></svg>
                  <span>Cek Keranjang</span>
                </button>
              ) : (
                <a href="#lookbook" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold transition text-sm cursor-pointer">
                  <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256"><path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path></svg>
                  <span>{client.uiLabels?.lookbookButtonText || 'Inspirasi Lookbook'}</span>
                </a>
              )}
            </div>

            {/* Mini USP Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-zinc-300">
              {(client.marketing?.usps || [
                { title: '15-30 Menit', desc: 'Garansi Cepat Sampai' },
                { title: '100% Higienis', desc: 'Kualitas Terjaga' },
                { title: 'Kemasan Aman', desc: 'Suhu Tetap Stabil' }
              ]).map((usp, idx) => (
                <div key={idx}>
                  <p className="font-bold text-white text-sm">{usp.title}</p>
                  <p>{usp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform rotate-1 hover:rotate-0 transition duration-500 group">
              <img src={spotlightProduct.imageUrl} alt={spotlightProduct.name} className="w-full h-80 sm:h-96 object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block bg-amber-400 text-zinc-950 text-[10px] font-black uppercase px-2 py-0.5 rounded mb-1">{spotlightLabel}</span>
                    <p className="text-sm font-bold text-white line-clamp-1">{spotlightProduct.name}</p>
                    <p className="text-[11px] text-zinc-300 line-clamp-1">{spotlightProduct.desc}</p>
                  </div>
                  {discountPercentage > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">-{discountPercentage}%</span>
                  )}
                </div>

                {flashSaleEnd && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {flashSaleEnd}
                    </span>
                  </div>
                )}

                <div className="flex items-end justify-between mt-1 pt-3 border-t border-white/20">
                  <div>
                    {discountPercentage > 0 && (
                      <span className="text-[10px] line-through text-zinc-400 block leading-tight">{formatIDR(originalPrice)}</span>
                    )}
                    <span className="text-base font-bold text-emerald-400 leading-tight">{formatIDR(basePrice)}</span>
                  </div>
                  <a href="#katalog" className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg shadow hover:bg-zinc-200 transition">
                    {ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
