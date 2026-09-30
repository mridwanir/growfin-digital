const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'components', 'demo', 'retail', 'groceries');

const dirs = [
  'core',
  'themes/default',
  'universal'
];

dirs.forEach(d => {
  const target = path.join(baseDir, d);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
});

const files = {
  'core/GroceriesContext.tsx': `'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';

export interface GroceriesCartItem {
  id: string;
  product: MenuItem;
  quantity: number;
  selectedVariant: string; 
  selectedSize: string;
  totalPrice: number;
}

interface GroceriesContextType {
  client: BusinessDemo;
  cart: GroceriesCartItem[];
  addToCart: (item: GroceriesCartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  selectedProduct: MenuItem | null;
  setSelectedProduct: (product: MenuItem | null) => void;
}

const GroceriesContext = createContext<GroceriesContextType | undefined>(undefined);

export function GroceriesProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [cart, setCart] = useState<GroceriesCartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const addToCart = (item: GroceriesCartItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant === item.selectedVariant && i.selectedSize === item.selectedSize);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity, totalPrice: i.totalPrice + item.totalPrice } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => 
      prev.map(item => item.id === id ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity } : item)
    );
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <GroceriesContext.Provider value={{
      client, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, cartTotal, cartItemCount,
      isCartDrawerOpen, setIsCartDrawerOpen, isProductModalOpen, setIsProductModalOpen, selectedProduct, setSelectedProduct
    }}>
      {children}
    </GroceriesContext.Provider>
  );
}

export function useGroceriesDemo() {
  const context = useContext(GroceriesContext);
  if (context === undefined) {
    throw new Error('useGroceriesDemo must be used within a GroceriesProvider');
  }
  return context;
}
`,
  'GroceriesRouter.tsx': `'use client';

import { BusinessDemo } from '@/lib/types';
import { DefaultLayout } from './themes/default/DefaultLayout';
import { GroceriesProvider } from './core/GroceriesContext';

export function GroceriesRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  return (
    <GroceriesProvider client={client}>
      <DefaultLayout client={client} />
    </GroceriesProvider>
  );
}
`,
  'themes/default/DefaultLayout.tsx': `'use client';

import { BusinessDemo } from '@/lib/types';
import { GroceriesHeader } from './GroceriesHeader';
import { GroceriesHero } from './GroceriesHero';
import { GroceriesProductGrid } from './GroceriesProductGrid';
import { GroceriesLookbook } from './GroceriesLookbook';
import { GroceriesReviews } from './GroceriesReviews';
import { GroceriesFooter } from './GroceriesFooter';
import { GroceriesProductModal } from '../../universal/GroceriesProductModal';
import { GroceriesCartDrawer } from '../../universal/GroceriesCartDrawer';
import { useGroceriesDemo } from '../../core/GroceriesContext';

export function DefaultLayout({ client }: { client: BusinessDemo }) {
  const { cartItemCount, cartTotal, setIsCartDrawerOpen } = useGroceriesDemo();
  
  // Custom Font
  const themeColor = client.themeColor || '#10b981';

  return (
    <div className="bg-zinc-50 text-zinc-900 antialiased selection:bg-emerald-500 selection:text-white pb-24 lg:pb-0" style={{ '--theme-color': themeColor } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      \`}} />
      
      <div className="font-jakarta">
        {/* Top Announcement */}
        <div className="bg-[var(--theme-color)] text-white text-xs font-semibold px-4 py-2 text-center tracking-wide flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7L45.25,130.49a8,8,0,0,0,2.22,11.89,8.23,8.23,0,0,0,3.17.65h0l57.73,21.64L93.71,238.1a8,8,0,0,0,13.69,7l108.9-120A8,8,0,0,0,215.79,118.17ZM120.35,214.9,132.89,152.2a8,8,0,0,0-5-9.17L70.16,121.39l75.46-81,1-5v1.27a8,8,0,0,0-1,.22L123.11,103.8a8,8,0,0,0,5,9.17l57.73,21.64Z"></path></svg>
          <span>FLASH SALE HARI INI: Gratis Ongkir Instan radius 5 km untuk pesanan minimal Rp 75.000!</span>
        </div>

        <GroceriesHeader />
        
        <main>
          <GroceriesHero />
          <GroceriesProductGrid />
          <GroceriesLookbook />
          <GroceriesReviews />
        </main>

        <GroceriesFooter />

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 flex items-center justify-between lg:hidden">
          <div>
            <span className="text-[11px] text-zinc-400 block font-medium">Total Pesanan:</span>
            <span className="font-bold text-[var(--theme-color)] text-sm">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cartTotal)}
            </span>
          </div>
          <button onClick={() => setIsCartDrawerOpen(true)} className="px-5 py-2.5 rounded-full bg-[var(--theme-color)] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
            <span>Buka Tas Belanja</span>
          </button>
        </div>

        <GroceriesProductModal />
        <GroceriesCartDrawer />
      </div>
    </div>
  );
}
`,
  'themes/default/GroceriesHeader.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useGroceriesDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-color)] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[var(--theme-color)]/20 group-hover:scale-105 transition-transform">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 block leading-none">
              {client.name}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">{client.tagline || 'Fresh Daily • 24/7 Store'}</span>
          </div>
        </a>

        {/* Navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#katalog" className="hover:text-[var(--theme-color)] transition-colors">Katalog Produk</a>
          <a href="#lookbook" className="hover:text-[var(--theme-color)] transition-colors">Lookbook Tren</a>
          <a href="#reviews" className="hover:text-[var(--theme-color)] transition-colors">Ulasan Pembeli</a>
          <a href="#about" className="hover:text-[var(--theme-color)] transition-colors">Tentang Toko</a>
        </nav>

        {/* Cart Button trigger */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartDrawerOpen(true)} className="relative p-2.5 rounded-full bg-zinc-100 hover:bg-emerald-50 text-zinc-800 hover:text-[var(--theme-color)] transition flex items-center gap-2 cursor-pointer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
            <span className="absolute -top-1 -right-1 bg-[var(--theme-color)] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cartItemCount}</span>
            <span className="hidden sm:inline text-xs font-semibold pr-1">Keranjang</span>
          </button>
        </div>

      </div>
    </header>
  );
}
`,
  'themes/default/GroceriesHero.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesHero() {
  const { client } = useGroceriesDemo();
  const heroImage = client.heroImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-zinc-900 text-white shadow-2xl" style={{ backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))', '--tw-gradient-from': 'color-mix(in srgb, var(--theme-color) 40%, black)', '--tw-gradient-via': 'color-mix(in srgb, var(--theme-color) 20%, black)', '--tw-gradient-to': '#18181b' } as React.CSSProperties}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Midnight Craving Season
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Kebutuhan Harian, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Siap Kirim Kilat.</span>
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              {client.tagline || "Dari Onigiri Salmon hangat, bento box artisan, matcha cold brew, hingga snack import eksklusif. Rasakan kemudahan belanja ala minimarket dari rumah."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#katalog" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--theme-color)] hover:brightness-110 text-white font-bold transition transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 text-sm">
                <span>Buka Etalase Produk</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z" transform="scale(1, -1) translate(0, -256)"></path></svg>
              </a>
              <a href="#lookbook" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold transition text-sm">
                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256"><path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path></svg>
                <span>Inspirasi Lookbook</span>
              </a>
            </div>

            {/* Mini USP Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-zinc-300">
              <div>
                <p className="font-bold text-white text-sm">15-30 Menit</p>
                <p>Garansi Cepat Sampai</p>
              </div>
              <div>
                <p className="font-bold text-white text-sm">100% Higienis</p>
                <p>Kualitas Terjaga</p>
              </div>
              <div>
                <p className="font-bold text-white text-sm">Kemasan Aman</p>
                <p>Suhu Tetap Stabil</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform rotate-1 hover:rotate-0 transition duration-500">
              <img src={heroImage} alt="Convenience Store Feast" className="w-full h-80 sm:h-96 object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="inline-block bg-amber-400 text-zinc-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">Rekomendasi Utama</span>
                <p className="text-sm font-bold text-white mt-1">Produk Unggulan {client.name}</p>
                <p className="text-xs text-zinc-300">Nikmati kualitas premium dengan penawaran terbaik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  'themes/default/GroceriesProductGrid.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';
import { useState } from 'react';

export function GroceriesProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useGroceriesDemo();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const categories = ['Semua', ...Array.from(new Set(client.menu.map(p => p.category)))];
  const filteredProducts = activeCategory === 'Semua' ? client.menu : client.menu.filter(p => p.category === activeCategory);

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-color)]">Etalase Toko</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">Katalog Produk Pilihan</h2>
          <p className="text-sm text-zinc-500 mt-1">Format visual besar & bersih untuk kenyamanan inspeksi detail kemasan & bahan.</p>
        </div>

        {/* Kategori Filter Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {categories.slice(0, 5).map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-4 py-2 rounded-full transition \${activeCategory === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item, index) => (
          <div key={item.id} className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Large Aspect Ratio Clean Image Container */}
              <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden cursor-pointer" onClick={() => handleOpenProduct(item)}>
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
                <button className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-zinc-900 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition transform group-hover:scale-110">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.35c18.83-18.83,27.3-37.62,27.65-38.41A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-extrabold text-base text-zinc-900 group-hover:text-[var(--theme-color)] transition-colors line-clamp-1 cursor-pointer" onClick={() => handleOpenProduct(item)}>
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc || 'Produk unggulan berkualitas premium dengan standar higienis.'}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-zinc-100">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 font-bold block">Harga Mulai</span>
                <span className="text-base font-black text-[var(--theme-color)]">{formatIDR(Number(item.price.toString().replace(/[^0-9]/g, '')) || 0)}</span>
              </div>
              <button onClick={() => handleOpenProduct(item)} className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-[var(--theme-color)] text-emerald-700 hover:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48V88a8,8,0,0,1-16,0V56H56V200H200V168a8,8,0,0,1,16,0v32a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,48ZM229.66,106.34l-32-32a8,8,0,0,0-11.32,11.32L204.69,104H88a8,8,0,0,0,0,16H204.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,229.66,106.34Z"></path></svg>
                <span>Opsi & Beli</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  'themes/default/GroceriesLookbook.tsx': `'use client';

export function GroceriesLookbook() {
  return (
    <section id="lookbook" className="bg-zinc-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-color)]">Lifestyle Pairing</span>
          <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">Lookbook: Everyday Moments</h2>
          <p className="text-zinc-600 text-sm mt-2">Inspirasi padu-padan menu instan estetik dan nikmat untuk menemani aktivitas harian Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lookbook 1 */}
          <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200/80">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-200">
              <img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80" alt="Work from Cafe Mood" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold text-[var(--theme-color)] uppercase tracking-wider">01 • Deep Work Session</span>
              <h3 className="font-bold text-lg text-zinc-900 mt-1">Iced Matcha Latte + Strawberry Sando</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">Kombinasi kafein lembut dan manis asam roti lapis buah segar untuk fokus kerja tanpa kantuk berlebih.</p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">Estimasi Kalori: 340 kcal</span>
              </div>
            </div>
          </div>

          {/* Lookbook 2 */}
          <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200/80">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-200">
              <img src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80" alt="Midnight Supper" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold text-[var(--theme-color)] uppercase tracking-wider">02 • Midnight Movie Marathon</span>
              <h3 className="font-bold text-lg text-zinc-900 mt-1">Spicy Miso Ramen Cup + Ajitsuke Tamago</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">Kuah ramen kaya rasa berpadu dengan telur marinasi gurih meleleh. Pas untuk teman nonton series favorit.</p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">Waktu Masak: 3 Menit</span>
              </div>
            </div>
          </div>

          {/* Lookbook 3 */}
          <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200/80">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-200">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Morning Recharge" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold text-[var(--theme-color)] uppercase tracking-wider">03 • Morning Commute Fuel</span>
              <h3 className="font-bold text-lg text-zinc-900 mt-1">Tokyo Chicken Bento + Calamansi Sparkler</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">Nasi jepang pulen, karage renyah dengan salad segar. Tetap bertenaga mengawali hari yang padat.</p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">Disajikan: Hangat Segar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  'themes/default/GroceriesReviews.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesReviews() {
  const { client } = useGroceriesDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { id: 1, author: "Dimas Anggara", rating: 5, content: "Packaging onigiri-nya rapi banget! Nori tetap renyah garing karena plastik pemisahnya standar Jepang. Pengiriman cuma 22 menit nyampe!" },
    { id: 2, author: "Farah Nabila", rating: 5, content: "Suka banget fitur pilih varian kepedasan sama saus bento-nya langsung di web. Order malam pas lembur, kurirnya sopan dan makanan masih anget." },
    { id: 3, author: "Rizky Kurniawan", rating: 5, content: "Matcha cold brew-nya otentik pahit gurihnya pas, bukan gula doang. Check-out otomatis ke WhatsApp admin bikin tracking order jauh lebih gampang." }
  ];

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-color)]">Testimoni & Kepercayaan</span>
          <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">Ulasan Pelanggan Terverifikasi</h2>
          <p className="text-sm text-zinc-500 mt-1">98.4% pesanan tiba dalam kondisi prima dan sesuai pesanan.</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg>
          <span>Rating {client.rating || '4.9'} / 5.0 ({client.reviewCount || '2,400+'} Ulasan)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg>
                ))}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                "{r.content || r.text}"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm uppercase">
                {(r.author || r.name).substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">{r.author || r.name}</h4>
                <span className="text-[11px] text-zinc-400">Pembeli Terverifikasi</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  'themes/default/GroceriesFooter.tsx': `'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesFooter() {
  const { client } = useGroceriesDemo();
  
  return (
    <footer id="about" className="bg-zinc-950 text-white pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--theme-color)] text-white flex items-center justify-center font-black">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xl font-bold tracking-tight">{client.name}</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {client.tagline || 'Convenience store generasi baru dengan kurasi produk harian dan sistem pesan-antar kilat.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-300 mb-4">Jam Operasional</h4>
            <ul className="text-xs text-zinc-400 space-y-2">
              <li>{client.hours || 'Buka Setiap Hari: 24 Jam Non-stop'}</li>
              <li>Pengiriman Instan & Same Day</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-300 mb-4">Customer Care</h4>
            <ul className="text-xs text-zinc-400 space-y-2">
              <li>WhatsApp Order: {client.waNumber}</li>
              <li>{client.address}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-300 mb-4">Standar Layanan</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">100% Original</span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">Safe Packaging</span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">Fast Delivery</span>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} {client.name}. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
`,
  'universal/GroceriesProductModal.tsx': `'use client';

import { useGroceriesDemo } from '../core/GroceriesContext';
import { useState, useEffect } from 'react';

export function GroceriesProductModal() {
  const { isProductModalOpen, setIsProductModalOpen, selectedProduct, addToCart } = useGroceriesDemo();
  
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      const variants = selectedProduct.variants || ['Original'];
      const sizes = ['Standard']; // Or extract from addons/sizes if available
      
      setSelectedVariant(variants[0]);
      setSelectedSize(sizes[0]);
      setQuantity(1);
      setActiveImage(selectedProduct.imageUrl);
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
      selectedSize,
      totalPrice: price * quantity
    });
    setIsProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 my-8">
          
          {/* Close Button */}
          <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-zinc-100 text-zinc-600 flex items-center justify-center border border-zinc-200 transition cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Modal: Multi-Image Gallery */}
            <div className="p-6 bg-zinc-50 border-r border-zinc-100 flex flex-col justify-between">
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-200 mb-4">
                  <img src={activeImage} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                {/* Simulated multiple images using the same image for demo */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[var(--theme-color)] transition flex-shrink-0">
                    <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48Zm-16,0H48V208H208V48Z"></path></svg>
                <span>Kualitas terjamin & dikemas standar higienis.</span>
              </div>
            </div>

            {/* Modal: Spesifikasi Detail & Opsi SKU */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[var(--theme-color)] tracking-wider">{selectedProduct.category}</span>
                <h3 className="text-2xl font-extrabold text-zinc-900 mt-1">{selectedProduct.name}</h3>
                <p className="text-2xl font-black text-[var(--theme-color)] mt-2">{formatIDR(price)}</p>
                
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Deskripsi Produk</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed max-h-24 overflow-y-auto pr-1">
                    {selectedProduct.desc || 'Deskripsi lengkap spesifikasi, komposisi, dan detail penyimpanan.'}
                  </p>
                </div>

                {/* SKU Selector: Varian / Rasa */}
                <div className="mt-5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-2">Pilihan Varian</label>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProduct.variants?.length ? selectedProduct.variants : ['Original']).map((v: string) => (
                      <button 
                        key={v}
                        onClick={() => setSelectedVariant(v)} 
                        className={\`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer \${selectedVariant === v ? 'border-[var(--theme-color)] bg-emerald-50 text-[var(--theme-color)] ring-1 ring-[var(--theme-color)]' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}\`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qty Selector */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 uppercase tracking-wide">Kuantitas</span>
                  <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold">-</button>
                    <span className="w-10 text-center text-sm font-semibold text-zinc-800">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold">+</button>
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="mt-8 pt-4 border-t border-zinc-100">
                <button onClick={handleAddToCart} className="w-full py-3.5 px-6 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-white font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
                  <span>Tambahkan ke Keranjang - {formatIDR(price * quantity)}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'universal/GroceriesCartDrawer.tsx': `'use client';

import { useGroceriesDemo } from '../core/GroceriesContext';
import { useState } from 'react';

export function GroceriesCartDrawer() {
  const { client, isCartDrawerOpen, setIsCartDrawerOpen, cart, cartTotal, updateCartItemQuantity, clearCart } = useGroceriesDemo();
  
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
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
    msg += \`📞 HP: \${encodeURIComponent(custPhone)}%0A\`;
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartDrawerOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Cart Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--theme-color)]" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
              <h2 className="text-lg font-extrabold text-zinc-900">Keranjang Belanja</h2>
            </div>
            <button onClick={() => setIsCartDrawerOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
            </button>
          </div>

          {/* Cart Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {cart.length === 0 ? (
              <div className="h-full min-h-[16rem] flex flex-col items-center justify-center text-center text-zinc-400">
                <svg className="w-12 h-12 mb-2 text-zinc-300" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
                <p className="text-sm font-semibold text-zinc-600">Tas belanja Anda masih kosong</p>
                <p className="text-xs text-zinc-400 mt-1">Pilih produk favorit Anda dari katalog etalase.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={\`\${item.id}-\${item.selectedVariant}\`} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-zinc-500 block">{item.selectedVariant}</span>
                    <span className="text-xs font-black text-[var(--theme-color)] mt-1 block">{formatIDR(item.totalPrice / item.quantity)}</span>
                  </div>
                  <div className="flex items-center border border-zinc-200 bg-white rounded-lg overflow-hidden">
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-bold text-xs">-</button>
                    <span className="w-7 text-center text-xs font-bold text-zinc-800">{item.quantity}</span>
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-bold text-xs">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Logistics Checkout Form Section */}
          <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-zinc-600">
              <span>Total Tagihan:</span>
              <span className="text-xl font-black text-[var(--theme-color)]">{formatIDR(cartTotal)}</span>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase">Informasi Logistik & Pengiriman</label>
              
              <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Nama Penerima" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]" />
              
              <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="No. WhatsApp / HP" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]" />

              <textarea rows={2} value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Alamat Lengkap (No Rumah, Blok, Patokan)" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]"></textarea>

              <input type="text" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Catatan Tambahan" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]" />
            </div>

            <button onClick={processWhatsAppCheckout} className="w-full mt-3 py-3 px-4 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-white font-bold flex items-center justify-center gap-2 transition shadow-md shadow-[var(--theme-color)]/20 cursor-pointer text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23-7.7,11.55a8,8,0,0,0-.82,8.69,56.55,56.55,0,0,0,24,24,8,8,0,0,0,8.69-.82l11.55-7.7,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-1.08L48,213l9.83-29.49a8,8,0,0,0-1.08-6.54A88,88,0,1,1,128,216Z"></path></svg>
              <span>Checkout ke WhatsApp Admin</span>
            </button>
            <p className="text-[10px] text-center text-zinc-400">Ringkasan order dan format invoice akan disusun otomatis.</p>
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
console.log('Successfully setup groceries components.');
