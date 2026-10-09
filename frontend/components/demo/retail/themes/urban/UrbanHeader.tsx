'use client';

import { Store } from 'lucide-react';
import { useRetailDemo } from '../../core/RetailDemoContext';

export function UrbanHeader() {
  const { client } = useRetailDemo();

  return (
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
            <a href="#lookbook" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Lookbook</a>
            <a href="#katalog" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Produk</a>
            <a href="#testimoni" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Ulasan</a>
            <a href="#faq" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">FAQ</a>
          </div>

          {/* Right Nav */}
          <div className="flex items-center">
          </div>
        </div>
      </div>
    </nav>
  );
}
