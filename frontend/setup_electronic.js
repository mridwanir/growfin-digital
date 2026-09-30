const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'components', 'demo', 'retail', 'electronic');

const coreDir = path.join(baseDir, 'core');
const themesDefaultDir = path.join(baseDir, 'themes', 'default');
const universalDir = path.join(baseDir, 'universal');

[coreDir, themesDefaultDir, universalDir].forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

const files = {
  'core/ElectronicContext.tsx': `'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';

export const getElectronicPlaceholderImage = (id: string | number) => {
  const placeholders = [
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop"
  ];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return placeholders[Math.abs(hash) % placeholders.length];
};

export interface ElectronicCartItem {
  id: string;
  product: MenuItem;
  quantity: number;
  selectedColor: string;
  selectedVariant: string;
  totalPrice: number;
}

interface ElectronicContextType {
  client: BusinessDemo;
  cart: ElectronicCartItem[];
  addToCart: (item: ElectronicCartItem) => void;
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

const ElectronicContext = createContext<ElectronicContextType | undefined>(undefined);

export function ElectronicProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [cart, setCart] = useState<ElectronicCartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const addToCart = (item: ElectronicCartItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant === item.selectedVariant && i.selectedColor === item.selectedColor);
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
    <ElectronicContext.Provider value={{
      client, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, cartTotal, cartItemCount,
      isCartDrawerOpen, setIsCartDrawerOpen, isProductModalOpen, setIsProductModalOpen, selectedProduct, setSelectedProduct
    }}>
      {children}
    </ElectronicContext.Provider>
  );
}

export function useElectronicDemo() {
  const context = useContext(ElectronicContext);
  if (context === undefined) {
    throw new Error('useElectronicDemo must be used within a ElectronicProvider');
  }
  return context;
}
`,
  'ElectronicRouter.tsx': `'use client';

import { BusinessDemo } from '@/lib/types';
import { ElectronicProvider } from './core/ElectronicContext';
import { ElectronicDefaultLayout } from './themes/default/ElectronicDefaultLayout';

export function ElectronicRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  const renderLayout = () => {
    return <ElectronicDefaultLayout client={client} />;
  };

  return (
    <ElectronicProvider client={client}>
      {renderLayout()}
    </ElectronicProvider>
  );
}
`,
  'themes/default/ElectronicDefaultLayout.tsx': `'use client';

import { BusinessDemo } from '@/lib/types';
import { ElectronicHeader } from './ElectronicHeader';
import { ElectronicHero } from './ElectronicHero';
import { ElectronicProductGrid } from './ElectronicProductGrid';
import { ElectronicLookbook } from './ElectronicLookbook';
import { ElectronicReviews } from './ElectronicReviews';
import { ElectronicFooter } from './ElectronicFooter';
import { ElectronicProductModal } from '../../universal/ElectronicProductModal';
import { ElectronicCartDrawer } from '../../universal/ElectronicCartDrawer';

export function ElectronicDefaultLayout({ client }: { client: BusinessDemo }) {
  return (
    <div className="bg-[#FAFAFA] text-zinc-800 antialiased selection:bg-zinc-900 selection:text-white" style={{ '--theme-color': client.themeColor || '#09090b' } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      \`}} />
      <div className="font-jakarta">
        {/* TOP NOTICE BAR */}
        <div className="bg-zinc-900 text-zinc-300 text-xs py-2 px-4 text-center font-medium tracking-wide">
          Gratis Ongkir Seluruh Indonesia & Asuransi Penuh Pengiriman untuk Pembelian Hari Ini.
        </div>

        <ElectronicHeader />
        
        <main>
          <ElectronicHero />
          <ElectronicProductGrid />
          <ElectronicLookbook />
          <ElectronicReviews />
        </main>

        <ElectronicFooter />

        <ElectronicProductModal />
        <ElectronicCartDrawer />
      </div>
    </div>
  );
}
`,
  'themes/default/ElectronicHeader.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useElectronicDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-zinc-950">
          <span className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm uppercase">
            {client.name.substring(0, 1)}
          </span>
          {client.name.split(' ')[0]}<span className="text-zinc-400 font-normal">{client.name.split(' ').slice(1).join(' ')}</span>
        </a>

        {/* Minimal Navigation Menu */}
        <nav className="hidden md:flex items-center gap-9 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <a href="#katalog" className="hover:text-zinc-950 transition-colors">Katalog Produk</a>
          <a href="#lookbook" className="hover:text-zinc-950 transition-colors">Setup & Lookbook</a>
          <a href="#reviews" className="hover:text-zinc-950 transition-colors">Ulasan Pembeli</a>
          <a href="#layanan" className="hover:text-zinc-950 transition-colors">Garansi & Servis</a>
        </nav>

        {/* Cart Button Pill */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartDrawerOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/70 transition-all text-xs font-semibold text-zinc-900 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span>Keranjang</span>
            <span className="bg-zinc-950 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartItemCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
`,
  'themes/default/ElectronicHero.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicHero() {
  const { client } = useElectronicDemo();
  
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Main Billboard Banner (8 Cols) */}
        <div className="lg:col-span-8 bg-zinc-100 rounded-3xl p-8 sm:p-14 border border-zinc-200/80 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-900 text-[11px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Koleksi Terbaru Musim Ini
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15]">
              Presisi Desain.<br/>Performa Audio & Komputasi Tanpa Celah.
            </h1>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              {client.tagline || "Menghadirkan lini perangkat keras minimalis dengan material aluminium anodized dan tuning akustik kelas studio profesional."}
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a href="#katalog" className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
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
                src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop" 
                alt="Promo Item" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            <h3 className="text-lg font-bold text-zinc-950">Aether Mech 75 Low-Profile</h3>
            <p className="text-xs text-zinc-500 mt-1">Gasket Mount 75% • CNC Aluminum Top Case</p>
          </div>

          <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 line-through">Rp 2.200.000</span>
              <div className="text-xl font-bold text-zinc-950">Rp 1.850.000</div>
            </div>
            <a href="#katalog" className="p-3 bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-900 rounded-xl transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
`,
  'themes/default/ElectronicProductGrid.tsx': `'use client';

import { useElectronicDemo, getElectronicPlaceholderImage } from '../../core/ElectronicContext';

export function ElectronicProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useElectronicDemo();

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Katalog Terkurasi</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">Perangkat Keras Pilihan</h2>
        </div>
        <p className="text-xs text-zinc-500 mt-2 sm:mt-0 font-medium">
          Menampilkan {client.menu.length} Perangkat Unggulan • Bergaransi 24 Bulan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {client.menu.map((prod) => {
          const priceNum = Number(prod.price.toString().replace(/[^0-9]/g, '')) || 0;
          return (
            <div key={prod.id} className="bg-white rounded-3xl border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-400 hover:shadow-lg transition-all duration-300">
              <div>
                <div className="relative aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden mb-5 cursor-pointer" onClick={() => handleOpenModal(prod)}>
                  <img 
                    src={prod.imageUrl || getElectronicPlaceholderImage(prod.id)} 
                    alt={prod.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white text-zinc-900 border border-zinc-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    Official Choice
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{prod.category || 'Acoustics'}</span>
                <h3 className="text-base font-bold text-zinc-950 mt-1 line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">{prod.desc || 'Desain minimalis dan performa terbaik'}</p>
              </div>

              <div className="pt-5 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 line-through">{formatIDR(priceNum * 1.2)}</span>
                  <div className="text-lg font-bold text-zinc-950">{formatIDR(priceNum)}</div>
                </div>
                <button onClick={() => handleOpenModal(prod)} className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                  Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
`,
  'themes/default/ElectronicLookbook.tsx': `'use client';

export function ElectronicLookbook() {
  return (
    <section id="lookbook" className="bg-zinc-100/70 border-y border-zinc-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-xl mb-12">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Inspirasi Tata Ruang</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">Eksplorasi Setup & Sinergi Alat</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            Desain ruang kerja cerdas, hening, dan elegan.
          </p>
        </div>

        {/* Workspace Hero with Interactive Pins */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-sm bg-white">
          <img 
            src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1600&auto=format&fit=crop" 
            alt="Clean Minimalist Desk Setup" 
            className="w-full h-[480px] sm:h-[580px] object-cover"
          />

          <div className="absolute top-[28%] left-[22%] sm:left-[24%] group">
            <button className="w-9 h-9 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform border border-zinc-200 cursor-pointer">
              01
            </button>
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xl hidden group-hover:block w-48 text-left z-20">
              <p className="text-[10px] uppercase font-bold text-zinc-400">Headphone</p>
              <p className="text-xs font-bold text-zinc-950">Aether Studio Pro ANC</p>
            </div>
          </div>

          <div className="absolute top-[65%] left-[45%] sm:left-[48%] group">
            <button className="w-9 h-9 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform border border-zinc-200 cursor-pointer">
              02
            </button>
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xl hidden group-hover:block w-48 text-left z-20">
              <p className="text-[10px] uppercase font-bold text-zinc-400">Keyboard</p>
              <p className="text-xs font-bold text-zinc-950">Aether Mech 75 Low-Profile</p>
            </div>
          </div>

          <div className="absolute top-[52%] right-[18%] sm:right-[22%] group">
            <button className="w-9 h-9 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform border border-zinc-200 cursor-pointer">
              03
            </button>
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xl hidden group-hover:block w-48 text-left z-20">
              <p className="text-[10px] uppercase font-bold text-zinc-400">Wearable</p>
              <p className="text-xs font-bold text-zinc-950">Aether Chrono GPS Ultra</p>
            </div>
          </div>

          {/* Bottom overlay tag */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl border border-zinc-200/80 text-xs text-zinc-600 shadow-sm">
            <strong>Workstation Scandinavian:</strong> Dirancang hening, lapang, dan minim kabel untuk fokus optimal.
          </div>
        </div>

      </div>
    </section>
  );
}
`,
  'themes/default/ElectronicReviews.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicReviews() {
  const { client } = useElectronicDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { rating: 5, text: "Material finishing headphone-nya sangat berkelas, bantalan telinganya nyaman dipakai 8 jam non-stop saat editing video. Pengiriman kurir instan sampai tepat waktu.", authorName: "Aris Ramadhan", time: "Product Designer • Jakarta" },
    { rating: 5, text: "Paling suka dengan proses order via WhatsApp-nya. Tidak perlu isi formulir akun berbelit, tinggal pilih barang, isi alamat pengiriman, dan admin langsung memproses resi.", authorName: "Sherly Levina", time: "Software Engineer • Bandung" },
    { rating: 5, text: "Packaging sangat rapi dengan lapisan kardus ganda dan segel resmi. Garansi langsung otomatis terdaftar begitu dicek lewat serial number.", authorName: "M. Taufiq", time: "Arsitek • Surabaya" }
  ];

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Testimoni Nyata</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">Dipercaya Kreator & Profesional</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2">
          Tingkat kepuasan 99.4% terhadap kualitas barang, garansi resmi distributor, dan proteksi kemasan kayu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-7 rounded-2xl border border-zinc-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex text-zinc-900 gap-1 mb-4">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-800 uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">{r.authorName || r.author || r.name || 'User'}</h4>
                <p className="text-[11px] text-zinc-400">{r.time || 'Verified Buyer'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  'themes/default/ElectronicFooter.tsx': `'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicFooter() {
  const { client } = useElectronicDemo();
  return (
    <footer className="bg-white border-t border-zinc-200 py-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-950 font-bold uppercase">
          <span className="w-6 h-6 rounded bg-zinc-950 text-white flex items-center justify-center font-bold text-[11px]">{client.name.substring(0,1)}</span>
          {client.name}
        </div>
        <p>© {new Date().getFullYear()} {client.name}. Desain Minimalis & Jaminan Garansi Resmi 24 Bulan.</p>
        <div className="flex gap-6 text-zinc-500">
          <a href="#" className="hover:text-zinc-950">Pusat Bantuan</a>
          <a href="#" className="hover:text-zinc-950">Kebijakan Privasi</a>
          <a href="#" className="hover:text-zinc-950">Tracking Resi</a>
        </div>
      </div>
    </footer>
  );
}
`,
  'universal/ElectronicProductModal.tsx': `'use client';

import { useElectronicDemo, getElectronicPlaceholderImage } from '../core/ElectronicContext';
import { useState, useEffect } from 'react';

export function ElectronicProductModal() {
  const { isProductModalOpen, setIsProductModalOpen, selectedProduct, addToCart } = useElectronicDemo();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      const colors = selectedProduct.colors || ["Pure Arctic White", "Graphite Slate", "Sandstone Beige"];
      const variants = selectedProduct.variants || ["Standard Edition", "Travel Case Set"];
      setSelectedColor(colors[0]);
      setSelectedVariant(variants[0]);
      setActiveImage(''); // Will fallback to product image
    }
  }, [selectedProduct]);

  if (!isProductModalOpen || !selectedProduct) return null;

  const colors = selectedProduct.colors || ["Pure Arctic White", "Graphite Slate", "Sandstone Beige"];
  const variants = selectedProduct.variants || ["Standard Edition", "Travel Case Set"];
  const specs = selectedProduct.specs || ["Custom Neodymium Driver", "Active Noise Cancellation 48dB", "Baterai hingga 60 Jam Pemakaian"];

  const price = Number(selectedProduct.price.toString().replace(/[^0-9]/g, '')) || 0;
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleAddToCart = () => {
    addToCart({
      id: selectedProduct.id.toString(),
      product: selectedProduct,
      quantity: 1,
      selectedColor,
      selectedVariant,
      totalPrice: price
    });
    setIsProductModalOpen(false);
  };

  const currentImage = activeImage || selectedProduct.imageUrl || getElectronicPlaceholderImage(selectedProduct.id);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl my-6">
          
          {/* Close Button */}
          <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto no-scrollbar">
            
            {/* Image Gallery Left */}
            <div className="p-6 sm:p-8 bg-zinc-50 flex flex-col justify-between gap-4 border-b md:border-b-0 md:border-r border-zinc-200">
              <div className="aspect-square rounded-2xl bg-white border border-zinc-200/80 overflow-hidden p-2 flex items-center justify-center">
                <img src={currentImage} alt="Detail Produk" className="w-full h-full object-cover rounded-xl" />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                <button className="aspect-square rounded-xl overflow-hidden border border-zinc-200 focus:border-zinc-950 cursor-pointer hover:opacity-80">
                  <img src={currentImage} className="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            {/* Product Details Right */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{selectedProduct.category || "Acoustics"}</span>
                  <h3 className="text-2xl font-extrabold text-zinc-950 mt-1">{selectedProduct.name}</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-bold text-zinc-950">{formatIDR(price)}</span>
                    <span className="text-xs line-through text-zinc-400">{formatIDR(price * 1.2)}</span>
                  </div>
                </div>

                {/* SKU: Colors */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Pilihan Warna</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c: string) => (
                      <button 
                        key={c}
                        onClick={() => setSelectedColor(c)} 
                        className={\`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer \${selectedColor === c ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}\`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SKU: Variants */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Varian / Tipe</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v: string) => (
                      <button 
                        key={v}
                        onClick={() => setSelectedVariant(v)} 
                        className={\`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer \${selectedVariant === v ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}\`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Spec Sheet */}
                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="text-[11px] font-bold text-zinc-950 uppercase tracking-wider mb-2">Spesifikasi Lengkap</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-500">
                    {specs.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="pt-4 border-t border-zinc-100">
                <button onClick={handleAddToCart} className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Masukkan ke Keranjang
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
  'universal/ElectronicCartDrawer.tsx': `'use client';

import { useElectronicDemo, getElectronicPlaceholderImage } from '../core/ElectronicContext';
import { useState } from 'react';

export function ElectronicCartDrawer() {
  const { client, isCartDrawerOpen, setIsCartDrawerOpen, cart, cartTotal, updateCartItemQuantity, clearCart } = useElectronicDemo();
  
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custNotes, setCustNotes] = useState('');

  if (!isCartDrawerOpen) return null;

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const processWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
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
      msg += \`- \${item.product.name} (\${item.selectedColor}, \${item.selectedVariant}) x\${item.quantity} = \${formatIDR(item.totalPrice)}%0A\`;
    });
    
    msg += \`============================%0A\`;
    msg += \`*TOTAL PESANAN: \${formatIDR(cartTotal)}*%0A\`;
    msg += \`%0AMohon info ketersediaan stok & total ongkos kirim. Terima kasih!\`;

    window.open(\`https://wa.me/\${client.waNumber}?text=\${msg}\`, '_blank');
    clearCart();
    setIsCartDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity" onClick={() => setIsCartDrawerOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-base font-bold text-zinc-950">Keranjang Belanja</h2>
            </div>
            <button onClick={() => setIsCartDrawerOpen(false)} className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Selected Items List */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Item yang Dipilih</h3>
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-10 text-center">Keranjang Anda masih kosong.</p>
                ) : (
                  cart.map(item => (
                    <div key={\`\${item.id}-\${item.selectedVariant}-\${item.selectedColor}\`} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                      <img src={item.product.imageUrl || getElectronicPlaceholderImage(item.product.id)} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg shrink-0 border border-zinc-200" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-zinc-950 truncate">{item.product.name}</h4>
                        <p className="text-xs font-semibold text-zinc-800">{formatIDR(item.totalPrice / item.quantity)}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{item.selectedColor} • {item.selectedVariant}</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-lg p-1">
                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 cursor-pointer">-</button>
                        <span className="text-xs font-bold text-zinc-950 px-1">{item.quantity}</span>
                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 cursor-pointer">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Logistic Form */}
            {cart.length > 0 && (
              <div className="pt-6 border-t border-zinc-200">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Informasi Tujuan Pengiriman
                </h3>

                <form id="checkout-form" className="space-y-3" onSubmit={processWhatsAppCheckout}>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Nama Lengkap</label>
                    <input type="text" value={custName} onChange={e => setCustName(e.target.value)} required placeholder="Contoh: Rian Pratama" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Nomor WhatsApp</label>
                    <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} required placeholder="Contoh: 081234567890" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Alamat Pengiriman & Kode Pos</label>
                    <textarea rows={2} value={custAddress} onChange={e => setCustAddress(e.target.value)} required placeholder="Jl. Anggrek No. 12, Kel. Menteng, Jakarta Pusat 10310" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Catatan Tambahan (Opsional)</label>
                    <input type="text" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Tinggalkan di pos sekuriti / hubungi sebelum tiba" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none" />
                  </div>
                  <button type="submit" id="hidden-submit-btn" className="hidden">Submit</button>
                </form>
              </div>
            )}

          </div>

          {/* Drawer Footer Summary */}
          <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal Produk</span>
                <span className="font-bold text-zinc-900">{formatIDR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Ongkir & Asuransi</span>
                <span className="text-emerald-600 font-semibold">Gratis Hari Ini</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total Pesanan</span>
                <span>{formatIDR(cartTotal)}</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => document.getElementById('hidden-submit-btn')?.click()}
              disabled={cart.length === 0}
              className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Checkout via WhatsApp
            </button>
            
            <p className="text-[10px] text-center text-zinc-400">
              Ringkasan data logistik & keranjang akan otomatis diformat ke chat admin WhatsApp resmi.
            </p>
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
console.log('Successfully setup electronic components.');
