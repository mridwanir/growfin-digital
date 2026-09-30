const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'components', 'demo', 'retail', 'groceries', 'themes', 'artisan');

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

const files = {
  'ArtisanLayout.tsx': `'use client';

import { BusinessDemo } from '@/lib/types';
import { ArtisanHeader } from './ArtisanHeader';
import { ArtisanHero } from './ArtisanHero';
import { ArtisanLookbook } from './ArtisanLookbook';
import { ArtisanProductGrid } from './ArtisanProductGrid';
import { ArtisanReviews } from './ArtisanReviews';
import { ArtisanFooter } from './ArtisanFooter';
import { ArtisanProductModal } from './ArtisanProductModal';
import { ArtisanCartDrawer } from './ArtisanCartDrawer';

export function ArtisanLayout({ client }: { client: BusinessDemo }) {
  const themeColor = client.themeColor || '#2D4739';

  return (
    <div className="bg-[#FBF9F5] text-zinc-800 antialiased selection:bg-[#2D4739] selection:text-amber-100" style={{ '--theme-color': themeColor } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif-display { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      \`}} />
      
      <div className="font-jakarta">
        {/* TOP TICKER BAR */}
        <div className="bg-[#21352A] text-amber-100/90 text-xs py-2 px-4 border-b border-amber-900/30" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color) 80%, black)' }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="font-medium tracking-wide">Panen Subuh: Pengiriman kurir cold-storage langsung dari kebun jam {client.openTime || '08:00'} - {client.closeTime || '17:00'}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold tracking-wider text-amber-200">
              <span className="flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Slot Hari Ini Tersedia</span>
              <span>•</span>
              <span>Garansi Kesegaran 100%</span>
            </div>
          </div>
        </div>

        <ArtisanHeader />
        
        <main>
          <ArtisanHero />
          <ArtisanLookbook />
          <ArtisanProductGrid />
          <ArtisanReviews />
        </main>

        <ArtisanFooter />

        <ArtisanProductModal />
        <ArtisanCartDrawer />
      </div>
    </div>
  );
}
`,
  'ArtisanHeader.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanHeader() {
  const { client, cartItemCount, cartTotal, setIsCartDrawerOpen } = useGroceriesDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--theme-color)] text-amber-300 flex items-center justify-center shadow-lg shadow-[var(--theme-color)]/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 20h10"></path><path d="M10 20c5.5-1.5 5.5-5 5.5-5a5.5 5.5 0 0 0-11 0c0 0 0 3.5 5.5 5Z"></path><path d="M12 15v-5"></path><path d="M12 10a2.5 2.5 0 0 0-5 0"></path><path d="M12 10a2.5 2.5 0 0 1 5 0"></path></svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 block leading-tight">
              {client.name.split(' ')[0]}<span className="text-[var(--theme-color)] font-normal">{client.name.split(' ').slice(1).join(' ')}</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">Farm-to-Door Market</span>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-9 text-xs font-bold tracking-widest uppercase text-zinc-600">
          <a href="#lookbook" className="hover:text-[var(--theme-color)] transition">Lookbook Resep</a>
          <a href="#katalog" className="hover:text-[var(--theme-color)] transition">Katalog Segar</a>
          <a href="#testimoni" className="hover:text-[var(--theme-color)] transition">Ulasan Pembeli</a>
        </nav>

        {/* Cart Trigger Button */}
        <button onClick={() => setIsCartDrawerOpen(true)} className="group flex items-center gap-3 bg-white hover:bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-2xl shadow-xs transition cursor-pointer">
          <div className="relative">
            <svg className="w-5 h-5 text-[var(--theme-color)] group-hover:scale-110 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 11-1 9"></path><path d="m19 11-4-7"></path><path d="M2 11h20"></path><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"></path><path d="M4.5 15.5h15"></path><path d="m5 11 4-7"></path><path d="m9 11 1 9"></path></svg>
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">{cartItemCount}</span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] uppercase font-bold text-zinc-400 leading-tight">Keranjang</span>
            <span className="block text-xs font-bold text-zinc-900 leading-tight">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cartTotal)}
            </span>
          </div>
        </button>

      </div>
    </header>
  );
}
`,
  'ArtisanHero.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanHero() {
  const { client } = useGroceriesDemo();
  const heroImage = client.heroImage || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Bento 1: Main Banner (Large) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[var(--theme-color)] text-white p-8 sm:p-12 flex flex-col justify-between min-h-[460px] shadow-xl shadow-stone-900/10">
          <img src={heroImage} alt="Organic Produce" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
          
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              Panen Musim Ini
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-display font-semibold tracking-normal leading-tight text-amber-50">
              Kelezatan Alami, Bersih Tanpa Kompromi.
            </h1>
            <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed">
              {client.tagline || "Kurasi bahan pangan premium langsung dari mitra tani terakreditasi hidroponik & peternakan organik bebas antibiotik."}
            </p>
          </div>

          <div className="relative z-10 pt-8 flex flex-wrap items-center gap-4">
            <a href="#katalog" className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wider uppercase transition shadow-md">
              Mulai Belanja
            </a>
            <a href="#lookbook" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-md border border-white/20 transition">
              Lihat Inspirasi Dapur
            </a>
          </div>
        </div>

        {/* Bento 2 & 3: Flash Sale Flash Card & Trust Metric */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Flash Sale Card */}
          <div className="rounded-3xl bg-amber-100/70 border border-amber-200/80 p-6 sm:p-7 flex flex-col justify-between flex-1 relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-300/60 px-2.5 py-0.5 rounded-md">Flash Sale</span>
                <span className="text-xs font-mono font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
                  04 : 22 : 18
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Diskon Panen 35% Untuk Buah & Daging</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">Stok terbatas setiap hari. Disiapkan dalam kemasan vakum bersegel pendingin.</p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--theme-color)]">Promo Berakhir Hari Ini</span>
              <a href="#katalog" className="w-9 h-9 rounded-xl bg-[var(--theme-color)] text-white flex items-center justify-center hover:bg-zinc-800 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
            </div>
          </div>

          {/* Cold Chain Guarantee */}
          <div className="rounded-3xl bg-white border border-zinc-200/80 p-6 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Garansi Rantai Dingin</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Dikirim menggunakan ice-pack & thermal bag higienis sampai depan pintu Anda.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
`,
  'ArtisanLookbook.tsx': `'use client';

export function ArtisanLookbook() {
  return (
    <section id="lookbook" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--theme-color)]">Kurasi Kuliner & Dapur</span>
          <h2 className="text-3xl font-serif-display font-bold text-zinc-900 mt-1">Lookbook Menu Segar Sepekan</h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-sm">Temukan inspirasi padu padan bahan segar untuk sajian rumah ala chef berbintang.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Lookbook Card 1 (Large 7 Cols) */}
        <div className="md:col-span-7 group rounded-3xl overflow-hidden bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-lg transition duration-300">
          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80" alt="Gourmet Bowl" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-zinc-800">
              Menu 01 • Clean Living
            </span>
          </div>
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif-display font-bold text-zinc-900">Hydroponic Green Goddess Bowl</h3>
              <p className="text-xs text-zinc-500 mt-1">Paduan selada romaine renyah, mentimun jepang, alpukat hass, dan dressing herba.</p>
            </div>
            <a href="#katalog" className="shrink-0 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-[var(--theme-color)] text-white text-xs font-bold tracking-wider uppercase transition text-center cursor-pointer">
              Beli Bahan
            </a>
          </div>
        </div>

        {/* Lookbook Card 2 (5 Cols) */}
        <div className="md:col-span-5 group rounded-3xl overflow-hidden bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-lg transition duration-300">
          <div className="relative aspect-[16/10] md:aspect-auto md:h-64 overflow-hidden bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" alt="Steak Grill" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-zinc-800">
              Menu 02 • Chef Choice
            </span>
          </div>
          <div className="p-6 flex flex-col justify-between gap-4 h-full">
            <div>
              <h3 className="text-lg font-serif-display font-bold text-zinc-900">Garlic Butter Ribeye & Herb Roast</h3>
              <p className="text-xs text-zinc-500 mt-1">Daging meltique lembut dipadu baby rosemary dan mentega artisan.</p>
            </div>
            <a href="#katalog" className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-[var(--theme-color)] text-white text-xs font-bold tracking-wider uppercase transition text-center cursor-pointer">
              Beli Bahan
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
`,
  'ArtisanProductGrid.tsx': `'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../../core/GroceriesContext';
import { useState } from 'react';

export function ArtisanProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen, addToCart } = useGroceriesDemo();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(client.menu.map(p => p.category)))];
  const filteredProducts = activeCategory === 'Semua' ? client.menu : client.menu.filter(p => p.category === activeCategory);

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const price = Number(product.price.toString().replace(/[^0-9]/g, '')) || 0;
    addToCart({
      id: product.id.toString(),
      product,
      quantity: 1,
      selectedVariant: product.variants?.[0] || 'Original',
      selectedSize: 'Standard',
      totalPrice: price
    });
  };

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--theme-color)]">Etalase Pangan</span>
          <h2 className="text-3xl font-serif-display font-bold text-zinc-900 mt-1">Katalog Produk Pilihan Hari Ini</h2>
        </div>
        
        {/* Filter Badges UI */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {categories.slice(0, 4).map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-3 py-1.5 rounded-full border transition \${activeCategory === cat ? 'bg-[var(--theme-color)] text-white border-[var(--theme-color)]' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'}\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Tall Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((p) => {
          const price = Number(p.price.toString().replace(/[^0-9]/g, '')) || 0;
          return (
            <div key={p.id} className="group bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => handleOpenModal(p)}>
                <img src={p.imageUrl || getGroceryPlaceholderImage(p.id)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <span className="w-full py-2 bg-white/95 backdrop-blur-md rounded-xl text-center text-xs font-bold text-zinc-900 shadow-sm">
                    Lihat Spesifikasi
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#FBF9F5]/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-lg text-zinc-700">
                  {p.category}
                </span>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 onClick={() => handleOpenModal(p)} className="text-sm sm:text-base font-bold text-zinc-900 hover:text-[var(--theme-color)] cursor-pointer line-clamp-1 transition">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{p.variants?.[0] || '1 Pack'}</p>
                  <div className="text-base sm:text-lg font-extrabold text-[var(--theme-color)] mt-2">
                    {formatIDR(price)}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button onClick={() => handleOpenModal(p)} className="flex-1 py-2 px-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-semibold transition text-center cursor-pointer">
                    Detail
                  </button>
                  <button onClick={(e) => handleQuickAdd(e, p)} className="py-2 px-3 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-amber-200 text-xs font-bold shadow-xs transition flex items-center justify-center gap-1 cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    Beli
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
`,
  'ArtisanReviews.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanReviews() {
  const { client } = useGroceriesDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { rating: 5, text: "Kualitas selada dan tomat cerinya luar biasa segar, teksturnya crunchy dan manis alami. Sangat cocok buat meal prep salad mingguan keluarga kami.", authorName: "Anindya Maheswari", time: "Verified Buyer • Dago, Bandung" },
    { rating: 5, text: "Sistem checkout langsung ke WhatsApp sangat cepat dan rekapnya rapi. Pengiriman tiba dengan ice pack yang masih dingin beku, daging wagyu tetap segar.", authorName: "Reza Hendrawan", time: "Verified Buyer • Kemang, Jaksel" },
    { rating: 5, text: "Alpukat hass menteganya pas dibelah tidak ada yang cacat atau berurat. Jarang supermarket online bisa menjaga konsistensi mutu sebagus ini.", authorName: "dr. Maya Wulandari", time: "Verified Buyer • BSD City" }
  ];

  return (
    <section id="testimoni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-zinc-200">
      <div className="max-w-xl mx-auto text-center mb-10">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--theme-color)]">Kepuasan Pelanggan</span>
        <h2 className="text-3xl font-serif-display font-bold text-zinc-900 mt-1">Ulasan Dapur Pelanggan Kami</h2>
        <p className="text-xs text-zinc-500 mt-2">Dengarkan pengalaman memasak dengan bahan segar berkualitas kurasi kami.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-7 rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[var(--theme-color)] font-bold text-xs flex items-center justify-center uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">{r.authorName || r.author || r.name || 'User'}</h4>
                <p className="text-[10px] text-zinc-400">{r.time || 'Verified Buyer'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  'ArtisanFooter.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanFooter() {
  const { client } = useGroceriesDemo();
  return (
    <footer className="border-t border-zinc-200 bg-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} {client.name}. Hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <a href="#katalog" className="hover:text-zinc-800">Katalog</a>
          <a href="#lookbook" className="hover:text-zinc-800">Lookbook</a>
          <a href="#testimoni" className="hover:text-zinc-800">Testimoni</a>
        </div>
      </div>
    </footer>
  );
}
`,
  'ArtisanProductModal.tsx': `'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../../core/GroceriesContext';
import { useState, useEffect } from 'react';

export function ArtisanProductModal() {
  const { isProductModalOpen, setIsProductModalOpen, selectedProduct, addToCart } = useGroceriesDemo();
  
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      const variants = selectedProduct.variants || ['Pack 250 Gram'];
      setSelectedVariant(variants[0]);
      setQuantity(1);
      setActiveImage(selectedProduct.imageUrl || getGroceryPlaceholderImage(selectedProduct.id));
    }
  }, [selectedProduct]);

  if (!isProductModalOpen || !selectedProduct) return null;

  const price = Number(selectedProduct.price.toString().replace(/[^0-9]/g, '')) || 0;
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleAddToCart = () => {
    addToCart({
      id: selectedProduct.id.toString(),
      product: selectedProduct,
      quantity,
      selectedVariant,
      selectedSize: 'Standard',
      totalPrice: price * quantity
    });
    setIsProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative">
        
        {/* Close button */}
        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="grid md:grid-cols-12 gap-8 p-6 sm:p-10">
          
          {/* Left: Image Gallery (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <img src={activeImage} alt="Detail Produk" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square rounded-xl overflow-hidden border border-zinc-200 cursor-pointer hover:opacity-80">
                <img src={selectedProduct.imageUrl || getGroceryPlaceholderImage(selectedProduct.id)} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right: Information & SKU (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[var(--theme-color)] bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">{selectedProduct.category}</span>
                  <span className="text-[11px] text-zinc-400">SKU: <strong className="text-zinc-700">AP-{selectedProduct.id}</strong></span>
                </div>
                <h3 className="text-2xl font-serif-display font-bold text-zinc-900">{selectedProduct.name}</h3>
                <p className="text-2xl font-extrabold text-[var(--theme-color)] mt-2">{formatIDR(price)}</p>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-600 leading-relaxed max-h-24 overflow-y-auto">{selectedProduct.desc || "Deskripsi produk belum tersedia."}</p>

              {/* Specification List */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/70">
                <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">Spesifikasi Kualitas:</h5>
                <ul className="space-y-1.5 text-xs text-zinc-600">
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Standar: Grade A Export Quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Kondisi: Segar dipetik subuh hari</span>
                  </li>
                </ul>
              </div>

              {/* SKU Variants Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">Pilih Porsi / Ukuran Kemasan:</label>
                <div className="flex flex-wrap gap-2">
                  {(selectedProduct.variants?.length ? selectedProduct.variants : ['Pack 250 Gram']).map((v: string) => (
                    <button 
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer \${
                        selectedVariant === v 
                          ? 'border-[var(--theme-color)] bg-[var(--theme-color)] text-amber-200 shadow-xs' 
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 bg-white'
                      }\`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty Counter */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold text-zinc-700 uppercase">Jumlah:</span>
                <div className="inline-flex items-center border border-zinc-200 rounded-xl bg-white p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-200 cursor-pointer">-</button>
                  <span className="w-10 text-center font-bold text-xs text-zinc-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-200 cursor-pointer">+</button>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-6 mt-6 border-t border-zinc-100">
              <button onClick={handleAddToCart} className="w-full py-3.5 px-6 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-amber-200 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-[var(--theme-color)]/20 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> Masukkan ke Keranjang - {formatIDR(price * quantity)}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
`,
  'ArtisanCartDrawer.tsx': `'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../../core/GroceriesContext';
import { useState } from 'react';

export function ArtisanCartDrawer() {
  const { client, isCartDrawerOpen, setIsCartDrawerOpen, cart, cartTotal, updateCartItemQuantity, clearCart } = useGroceriesDemo();
  
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custNotes, setCustNotes] = useState('');

  if (!isCartDrawerOpen) return null;

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const processWhatsAppCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang belanja Anda masih kosong!");
      return;
    }
    if (!custName || !custAddress) {
      alert("Harap isi Nama Penerima dan Alamat Lengkap untuk logistik pengiriman.");
      return;
    }

    let msg = \`*HALO \${client.name.toUpperCase()} - ORDER BARU*%0A\`;
    msg += \`============================%0A\`;
    msg += \`*DETAIL PENERIMA & LOGISTIK:*%0A\`;
    msg += \`👤 Nama: \${encodeURIComponent(custName)}%0A\`;
    msg += \`📍 Alamat: \${encodeURIComponent(custAddress)}%0A\`;
    if (custNotes) msg += \`📝 Catatan: \${encodeURIComponent(custNotes)}%0A\`;
    msg += \`============================%0A\`;
    msg += \`*RINGKASAN PESANAN:*%0A\`;
    
    cart.forEach(item => {
      msg += \`- \${item.product.name} (\${item.selectedVariant}) x\${item.quantity} = \${formatIDR(item.totalPrice)}%0A\`;
    });
    
    msg += \`============================%0A\`;
    msg += \`*TOTAL: \${formatIDR(cartTotal)}*%0A\`;
    msg += \`%0AMohon info ketersediaan stok & total ongkos kirim. Terima kasih!\`;

    window.open(\`https://wa.me/\${client.waNumber}?text=\${msg}\`, '_blank');
    clearCart();
    setIsCartDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartDrawerOpen(false)}></div>
      
      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Cart Top Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--theme-color)] text-amber-300 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <h2 className="text-base font-bold text-zinc-900">Keranjang Belanja</h2>
            </div>
            <button onClick={() => setIsCartDrawerOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-700 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-400 text-center space-y-2">
                <svg className="w-12 h-12 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path><path d="M12 16v1a2 2 0 0 1-2 2H6m-2-5v-1"></path><path d="m22 2-2 2-2-2-2 2-2-2"></path></svg>
                <p className="text-sm font-medium">Keranjang masih kosong</p>
                <button onClick={() => setIsCartDrawerOpen(false)} className="text-xs text-[var(--theme-color)] font-bold underline cursor-pointer">Mulai Eksplorasi Pangan</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={\`\${item.id}-\${item.selectedVariant}\`} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200">
                  <img src={item.product.imageUrl || getGroceryPlaceholderImage(item.product.id)} className="w-14 h-16 rounded-xl object-cover border border-zinc-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-zinc-400">{item.selectedVariant}</p>
                    <p className="text-xs font-bold text-[var(--theme-color)] mt-1">{formatIDR(item.totalPrice / item.quantity)}</p>
                  </div>
                  <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 p-1">
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-5 h-5 rounded bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer">-</button>
                    <span className="w-6 text-center text-xs font-bold text-zinc-800">{item.quantity}</span>
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-5 h-5 rounded bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout & Logistics Section */}
          <div className="p-6 border-t border-zinc-200 bg-[#FBF9F5] space-y-4">
            
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider block">Informasi Pengiriman</span>
              <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Nama Penerima" className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:ring-1 focus:ring-[var(--theme-color)] focus:outline-none" />
              <textarea rows={2} value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Alamat Rinci & Nomor Rumah" className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:ring-1 focus:ring-[var(--theme-color)] focus:outline-none"></textarea>
              <input type="text" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Catatan Kurir (misal: Titip pos satpam)" className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:ring-1 focus:ring-[var(--theme-color)] focus:outline-none" />
            </div>

            {/* Total Calculation Summary */}
            <div className="pt-2 border-t border-zinc-200 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal Produk</span>
                <span>{formatIDR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Kurir Cold-Pack</span>
                <span className="text-emerald-700 font-semibold">Termasuk (Gratis)</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Akhir</span>
                <span className="text-[var(--theme-color)]">{formatIDR(cartTotal)}</span>
              </div>
            </div>

            {/* Conversion Button: WhatsApp Checkout */}
            <button onClick={processWhatsAppCheckout} className="w-full py-3.5 px-4 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-amber-200 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[var(--theme-color)]/30 transition flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Kirim Order ke WhatsApp Toko
            </button>
            
            <p className="text-[10px] text-center text-zinc-400">Order akan diproses oleh tim panen kami seketika chat terkirim.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, relativePath), content);
}
console.log('Successfully setup artisan components.');
