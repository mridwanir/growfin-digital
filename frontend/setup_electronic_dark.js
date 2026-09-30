const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'components', 'demo', 'retail', 'electronic', 'themes', 'dark');

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

const files = {
  'ElectronicDarkLayout.tsx': `'use client';

import { BusinessDemo } from '@/lib/types';
import { ElectronicDarkHeader } from './ElectronicDarkHeader';
import { ElectronicDarkHero } from './ElectronicDarkHero';
import { ElectronicDarkProductGrid } from './ElectronicDarkProductGrid';
import { ElectronicDarkLookbook } from './ElectronicDarkLookbook';
import { ElectronicDarkReviews } from './ElectronicDarkReviews';
import { ElectronicDarkFooter } from './ElectronicDarkFooter';
import { ElectronicProductModal } from '../../universal/ElectronicProductModal';
import { ElectronicCartDrawer } from '../../universal/ElectronicCartDrawer';

export function ElectronicDarkLayout({ client }: { client: BusinessDemo }) {
  return (
    <div className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-black" style={{ '--theme-color': client.themeColor || '#06b6d4' } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      \`}} />
      <div className="font-jakarta">
        <ElectronicDarkHeader />
        
        <main>
          <ElectronicDarkHero />
          <ElectronicDarkProductGrid />
          <ElectronicDarkLookbook />
          <ElectronicDarkReviews />
        </main>

        <ElectronicDarkFooter />

        {/* Existing modals and drawers should handle dark mode natively or we can just use the universal ones which are light mode for now. Ideally we should create dark variants of the modal/drawer too, but we will stick to universal for now or let them inherit dark mode if we styled them. Actually the universal modal is light. We'll use it for now. */}
        <ElectronicProductModal />
        <ElectronicCartDrawer />
      </div>
    </div>
  );
}
`,
  'ElectronicDarkHeader.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useElectronicDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-2xl font-black tracking-tight text-white uppercase">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-extrabold shadow-lg" style={{ background: 'linear-gradient(to top right, var(--theme-color), #2563eb)' }}>
            {client.name.substring(0, 1)}
          </span>
          {client.name.split(' ')[0]}<span style={{ color: 'var(--theme-color)' }}>.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#katalog" className="hover:text-white transition-colors">Katalog Produk</a>
          <a href="#lookbook" className="hover:text-white transition-colors">Tech Setup & Lookbook</a>
          <a href="#reviews" className="hover:text-white transition-colors">Ulasan Pembeli</a>
          <a href="#jaminan" className="hover:text-white transition-colors">Garansi Resmi</a>
        </nav>

        {/* Cart Button Action */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartDrawerOpen(true)} className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-slate-200 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span className={\`absolute -top-1.5 -right-1.5 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center transition-transform \${cartItemCount > 0 ? 'scale-100' : 'scale-0'}\`} style={{ backgroundColor: 'var(--theme-color)' }}>
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
`,
  'ElectronicDarkHero.tsx': `'use client';

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
              Flash Sale 40% Off • Live Weekend Drop
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Kekuatan Audio & Komputasi Kelas <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-color), #7dd3fc, #3b82f6)' }}>Flagship</span>.
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
`,
  'ElectronicDarkProductGrid.tsx': `'use client';

import { useElectronicDemo, getElectronicPlaceholderImage } from '../../core/ElectronicContext';

export function ElectronicDarkProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useElectronicDemo();

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section id="katalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--theme-color)' }}>Hardware Showcase</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Katalog Produk Unggulan</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Tampilan spesifikasi riil dan detail visual resolusi tinggi untuk mempermudah pemilihan gawai Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" style={{ color: 'var(--theme-color)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Stok Siap Kirim
          </span>
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
                  src={prod.imageUrl || getElectronicPlaceholderImage(prod.id)} 
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
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{prod.category || 'Elektronik'}</span>
                  <h3 className="text-base font-bold text-white mt-1 transition-colors line-clamp-1" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {prod.desc || 'Premium Tech Gear'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] line-through text-slate-500">{formatIDR(priceNum * 1.2)}</span>
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
`,
  'ElectronicDarkLookbook.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkLookbook() {
  const { client } = useElectronicDemo();
  
  const product1 = client.menu?.[0] || { category: 'Accessories', name: 'Aether Studio Pro ANC' };
  const product2 = client.menu?.[1] || { category: 'Accessories', name: 'Aether Mech 75 Low-Profile' };
  const product3 = client.menu?.[2] || { category: 'Accessories', name: 'Aether Chrono GPS Ultra' };

  return (
    <section id="lookbook" className="py-20 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--theme-color)' }}>Curated Ecosystems</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Inspirasi Setup & Gaya Pemakaian</h2>
          <p className="text-slate-400 text-sm mt-2">
            Kombinasi harmonis perlengkapan kerja dan kreasi digital untuk produktivitas tanpa kompromi bersama {client.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lookbook 1 */}
          <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800&auto=format&fit=crop" 
                alt="Desk Setup Minimalist" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent absolute bottom-0 inset-x-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-color)' }}>The Minimalist Coder</span>
              <h3 className="text-lg font-bold text-white mt-1">Ergonomic Workflow Pack</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                Menampilkan {product1.name} untuk setup meja minimalis Anda.
              </p>
              <button className="w-full py-2.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800">
                Lihat Item Setup <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Lookbook 2 */}
          <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop" 
                alt="Audiophile Studio Setup" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent absolute bottom-0 inset-x-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-color)' }}>Studio Master</span>
              <h3 className="text-lg font-bold text-white mt-1">Audiophile Sound Station</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                Menampilkan {product2.name} untuk monitoring akustik presisi tinggi.
              </p>
              <button className="w-full py-2.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800">
                Lihat Item Setup <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Lookbook 3 */}
          <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop" 
                alt="Nomad Content Creator" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent absolute bottom-0 inset-x-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-color)' }}>Mobile Creator</span>
              <h3 className="text-lg font-bold text-white mt-1">On-The-Go Production Kit</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                Menampilkan {product3.name} untuk render di mana saja tanpa hambatan.
              </p>
              <button className="w-full py-2.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800">
                Lihat Item Setup <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  'ElectronicDarkReviews.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkReviews() {
  const { client } = useElectronicDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { rating: 5, text: "Voltrix Studio Pro ANC-nya luar biasa senyap! Noise motor di luar jendela kamar langsung hilang. Respon admin WhatsApp sangat cepat dan garansi terdaftar resmi di distributor.", authorName: "Dimas Arya", time: "Jakarta Selatan" },
    { rating: 5, text: "Pengiriman sameday beneran cuma 2 jam sampai ke kantor. Packing berlapis kayu dan bubble-wrap super tebal. Build quality juara.", authorName: "Fiona Novita", time: "Bandung" },
    { rating: 5, text: "Format order via WhatsApp-nya praktis banget. Klik dari web, data pengiriman langsung rapi di chat. Tinggal bayar dan langsung diproses. Mantap!", authorName: "Reza Hidayat", time: "Surabaya" }
  ];

  return (
    <section id="reviews" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--theme-color)' }}>Social Proof</span>
        <h2 className="text-3xl font-extrabold text-white mt-1">Ulasan Pembeli Terverifikasi</h2>
        <p className="text-slate-400 text-sm mt-2">
          Kecepatan pengiriman, keaslian segel pabrik, dan keamanan proteksi yang memuaskan ribuan pembeli.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-300 uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{r.authorName || r.author || r.name || 'User'}</h4>
                <span className="text-xs text-slate-500">{r.time || 'Verified Buyer'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  'ElectronicDarkFooter.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkFooter() {
  const { client } = useElectronicDemo();
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-lg uppercase">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-950 font-extrabold text-[11px]" style={{ backgroundColor: 'var(--theme-color)' }}>
            {client.name.substring(0,1)}
          </span>
          {client.name}
        </div>
        <p>© {new Date().getFullYear()} {client.name}. Seluruh Hak Cipta Dilindungi. Garansi Resmi & Packing Aman.</p>
        <div className="flex gap-4 text-slate-400">
          <a href="#" className="hover:text-white transition-colors" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>Syarat & Ketentuan</a>
          <a href="#" className="hover:text-white transition-colors" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>Kebijakan Privasi</a>
          <a href="#" className="hover:text-white transition-colors" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>Klaim Garansi</a>
        </div>
      </div>
    </footer>
  );
}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, relativePath), content);
}
console.log('Successfully setup electronic dark components.');
