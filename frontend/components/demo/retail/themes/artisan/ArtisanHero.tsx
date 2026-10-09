'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function ArtisanHero() {
  const { client, setIsCartDrawerOpen } = useRetailDemo();
  const heroImage = client.heroImage || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80";
  const spotlightProduct = client.menu?.[0] || {
    id: 'spotlight-1',
    name: "Produk Unggulan",
    desc: "Kualitas terbaik pilihan kami",
    price: 150000,
    imageUrl: client.heroImage || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
  };
  const basePrice = Number(spotlightProduct.price.toString().replace(/[^0-9]/g, '')) || 150000;
  const discountPercentage = client.marketing?.discountPercentage || 35;
  const originalPrice = basePrice * (1 + discountPercentage / 100);
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const spotlightLabel = client.marketing?.promoLabel || client.categories?.[0] || 'Flash Sale';
  const ctaText = client.uiLabels?.buyButtonText || 'Beli Sekarang';
  const flashSaleEnd = client.marketing?.flashSaleEnd;
  const secondaryAction = client.heroSecondaryAction || 'gallery';
  const getWaUrl = () => {
    return `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20tertarik%20untuk%20memesan.`;
  };
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Bento 1: Main Banner (Large) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-zinc-900 text-white p-8 sm:p-12 flex flex-col justify-between min-h-[460px] shadow-xl shadow-stone-900/10">
          <img src={heroImage} alt="Organic Produce" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent"></div>

          <div className="relative z-10 space-y-4 max-w-xl">
            <h1 className="text-3xl sm:text-5xl font-serif-display font-semibold tracking-normal leading-tight text-amber-50">
              {client.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed">
              {client.tagline || "Kurasi bahan pangan premium langsung dari mitra terpercaya."}
            </p>
          </div>

          <div className="relative z-10 pt-8 flex flex-wrap items-center gap-4">
            <a href="#katalog" className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wider uppercase transition shadow-md">
              {client.uiLabels?.buyButtonText || 'Mulai Belanja'}
            </a>

            {secondaryAction === 'whatsapp' ? (
              <a href={getWaUrl()} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-md border border-white/20 transition cursor-pointer">
                Hubungi Kami
              </a>
            ) : secondaryAction === 'cart' ? (
              <button onClick={() => setIsCartDrawerOpen(true)} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-md border border-white/20 transition cursor-pointer">
                Cek Keranjang
              </button>
            ) : (
              <a href="#lookbook" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-md border border-white/20 transition cursor-pointer">
                {client.uiLabels?.lookbookButtonText || 'Lihat Inspirasi Dapur'}
              </a>
            )}
          </div>

          {/* Mini USP Badges */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-white/10 text-xs text-zinc-200">
            {(client.marketing?.usps || [
              { title: '15-30 Menit', desc: 'Garansi Cepat Sampai' },
              { title: '100% Higienis', desc: 'Kualitas Terjaga' },
              { title: 'Kemasan Aman', desc: 'Suhu Tetap Stabil' }
            ]).map((usp, idx) => (
              <div key={idx}>
                <p className="font-bold text-white text-sm">{usp.title}</p>
                <p className="opacity-80 mt-0.5">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bento 2 & 3: Flash Sale Flash Card & Trust Metric */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Promo Spotlight Card */}
          <div className="rounded-3xl bg-white border border-zinc-200/80 p-6 flex flex-col justify-between flex-1 relative overflow-hidden shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md">{spotlightLabel}</span>
                {flashSaleEnd && (
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {flashSaleEnd}
                  </span>
                )}
              </div>

              <div className="relative aspect-[16/9] rounded-2xl bg-zinc-50 overflow-hidden mb-4 group">
                <img src={spotlightProduct.imageUrl} alt={spotlightProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                {discountPercentage > 0 && (
                  <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    -{discountPercentage}% OFF
                  </div>
                )}
              </div>

              <h3 className="text-base font-bold text-zinc-900 line-clamp-1">{spotlightProduct.name}</h3>
              <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{spotlightProduct.desc}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {discountPercentage > 0 && (
                  <span className="text-[10px] text-zinc-400 line-through block leading-tight">{formatIDR(originalPrice)}</span>
                )}
                <span className="text-base font-bold text-[var(--theme-color)] leading-tight">{formatIDR(basePrice)}</span>
              </div>
              <a href="#katalog" className="px-4 py-2 bg-[var(--theme-color)] text-white text-[11px] font-bold rounded-xl hover:opacity-90 transition text-center shrink-0">
                {ctaText}
              </a>
            </div>
          </div>

          {/* Cold Chain Guarantee */}
          <div className="rounded-3xl bg-white border border-zinc-200/80 p-6 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{client.categories?.[1] || "Kualitas Terjamin"}</h4>
              <p className="text-xs text-zinc-500 mt-0.5">{client.categories?.[2] || "Disiapkan dan dikirim dengan standar kebersihan tertinggi langsung ke tempat Anda."}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
