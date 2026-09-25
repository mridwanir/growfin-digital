'use client';

import { BusinessDemo } from '@/lib/types';
import { Store } from 'lucide-react';
import { RetailDemoProvider, useRetailDemo } from './retail/RetailDemoContext';
import { RetailHeroScreen } from './retail/RetailHeroScreen';
import { RetailProductList } from './retail/RetailProductList';
import { RetailProductModal } from './retail/RetailProductModal';
import { RetailFloatingCart } from './retail/RetailFloatingCart';
import { RetailCheckoutModal } from './retail/RetailCheckoutModal';
import { RetailFloatingDock } from './retail/RetailFloatingDock';
import { RetailSocialProof } from './retail/RetailSocialProof';
import { RetailFAQ } from './retail/RetailFAQ';

function RetailDemoContent() {
  const { client } = useRetailDemo();

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-800 bg-white relative overflow-hidden pb-20 md:pb-0">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer gap-2">
              <span className="text-brand-primary"><Store className="w-8 h-8" /></span>
              <span className="font-bold text-2xl tracking-tighter text-brand-dark uppercase">{client.name}</span>
            </div>
            
            {/* Center Nav */}
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Beranda</a>
              <a href="#lookbook" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Lookbook</a>
              <a href="#koleksi" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Koleksi</a>
              <a href="#ulasan" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Ulasan</a>
              <a href="#faq" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">FAQ</a>
            </div>

            {/* Right Nav (Cart placeholder for desktop, handled by FloatingCart / Dock on mobile/desktop anyway) */}
            <div className="flex items-center">
              {/* Cart is handled globally by RetailFloatingDock and RetailFloatingCart, but we can add a visual trigger if we want. We'll rely on RetailFloatingCart for now as it overrides or complements this. */}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full pt-20 relative z-10">
        <RetailHeroScreen />
        <RetailProductList />
        <RetailSocialProof />
        <RetailFAQ />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold tracking-tighter mb-4 uppercase">{client.name}</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">{client.tagline || 'Solusi fashion modern dengan kualitas premium untuk gaya hidup masa kini.'}</p>
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} {client.name}. Hak Cipta Dilindungi.</p>
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
