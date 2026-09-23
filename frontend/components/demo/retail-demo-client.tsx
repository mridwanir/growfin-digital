'use client';

import { BusinessDemo } from '@/lib/types';
import { RetailDemoProvider, useRetailDemo } from './retail/RetailDemoContext';
import { RetailHeroScreen } from './retail/RetailHeroScreen';
import { RetailProductList } from './retail/RetailProductList';
import { RetailProductModal } from './retail/RetailProductModal';
import { RetailFloatingCart } from './retail/RetailFloatingCart';
import { RetailCheckoutModal } from './retail/RetailCheckoutModal';
import { RetailFloatingDock } from './retail/RetailFloatingDock';
import { RetailSocialProof } from './retail/RetailSocialProof';

function RetailDemoContent() {
  const { client } = useRetailDemo();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-primary selection:text-white relative overflow-hidden pb-20 md:pb-0">
      
      {/* Background Decor */}
      <div className="fixed -top-64 -right-64 w-[600px] h-[600px] rounded-full blur-[120px] bg-gradient-to-br from-brand-primary to-brand-dark opacity-20 pointer-events-none" />
      <div className="fixed top-1/2 -left-64 w-[500px] h-[500px] rounded-full blur-[100px] bg-gradient-to-tr from-brand-primary to-brand-dark opacity-10 pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white font-bold text-xl shadow-lg shadow-brand-primary/25 rotate-3 hover:rotate-6 transition-transform">
              {client.iconEmoji || '🛍️'}
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none truncate max-w-[150px] sm:max-w-[300px]">
                {client.name}
              </h1>
              <p className="text-[10px] font-black text-brand-primary mt-1 uppercase tracking-widest">{client.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8 mr-4 text-sm font-bold text-slate-600">
              <a href="#hero" className="hover:text-brand-primary transition-colors">Beranda</a>
              <a href="#katalog" className="hover:text-brand-primary transition-colors">Katalog</a>
              <a href="#info" className="hover:text-brand-primary transition-colors">Info Layanan</a>
            </nav>
            <a
              href={`https://wa.me/${client.waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-600 hover:bg-emerald-50 transition-colors border border-slate-200 shadow-sm font-bold text-sm relative group"
            >
              <span className="text-lg leading-none">💬</span>
              <span>Hubungi CS</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 md:py-8 relative z-10">
        <RetailHeroScreen />
        <RetailProductList />
        <RetailSocialProof />
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-slate-900 pt-20 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white text-2xl shadow-lg">
                {client.iconEmoji || '🛍️'}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white leading-none">{client.name}</h3>
                <p className="text-xs font-bold text-brand-primary mt-1 uppercase tracking-widest">{client.category}</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Kami selalu berkomitmen memberikan pelayanan terbaik dan produk berkualitas untuk Anda.
            </p>
          </div>
          <div className="space-y-6">
             <h4 className="text-lg font-bold text-white">Informasi Kontak</h4>
             <p className="text-slate-400 leading-relaxed">
               {client.address}<br/>
               {client.hours}<br/>
               {client.phone}
             </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-sm font-medium text-slate-500">
          <p>© {new Date().getFullYear()} {client.name} — Powered by Growfin Digital Templates.</p>
        </div>
      </footer>

      <RetailProductModal />
      <RetailCheckoutModal />
      <RetailFloatingCart />
      <RetailFloatingDock />

    </div>
  );
}

export function RetailDemoClient({ client }: { client: BusinessDemo }) {
  return (
    <RetailDemoProvider client={client}>
      <RetailDemoContent />
    </RetailDemoProvider>
  );
}
