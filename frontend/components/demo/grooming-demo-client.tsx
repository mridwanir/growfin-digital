'use client';

import { useState, useEffect } from 'react';
import { Scissors } from 'lucide-react';
import { BusinessDemo } from '@/lib/types';
import { GroomingDemoProvider, useGroomingDemo } from './grooming/GroomingDemoContext';
import { GroomingHeroScreen } from './grooming/GroomingHeroScreen';
import { GroomingLookbook } from './grooming/GroomingLookbook';
import { GroomingServiceMenu } from './grooming/GroomingServiceMenu';
import { GroomingSocialProof } from './grooming/GroomingSocialProof';
import { GroomingBookingModal } from './grooming/GroomingBookingModal';
import { GroomingStylistList } from './grooming/GroomingStylistList';

function GroomingDemoContent() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 text-stone-800 antialiased selection:bg-brand-primary selection:text-white relative overflow-x-hidden">
      
      {/* Navbar */}
      <nav className={`fixed w-full z-40 top-0 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="absolute inset-0 bg-stone-50/90 backdrop-blur-md"></div>
        <div className="container mx-auto px-6 py-4 relative flex justify-between items-center max-w-7xl">
          <a href="#" className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span className="text-brand-primary"><Scissors className="w-6 h-6" /></span>
            {client.name}
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#layanan" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Layanan</a>
            <a href="#stylist" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Stylist</a>
            <a href="#lookbook" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Lookbook</a>
            <a href="#ulasan" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Ulasan</a>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Reservasi
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-stone-900 text-2xl focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:hidden absolute top-full left-0 w-full bg-stone-50 shadow-lg border-t border-stone-200 flex-col`}>
          <a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-stone-100 hover:bg-stone-100 transition">Layanan</a>
          <a href="#stylist" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-stone-100 hover:bg-stone-100 transition">Stylist</a>
          <a href="#lookbook" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-stone-100 hover:bg-stone-100 transition">Lookbook</a>
          <a href="#ulasan" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-stone-100 hover:bg-stone-100 transition">Ulasan</a>
          <div className="px-6 py-4">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBookingModalOpen(true);
              }}
              className="w-full bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition"
            >
              Reservasi Sekarang
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">
        <GroomingHeroScreen />
        <GroomingServiceMenu />
        <GroomingStylistList />
        <GroomingLookbook />
        <GroomingSocialProof />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a href="#" className="text-2xl font-serif font-bold text-white flex items-center gap-2 mb-4">
              <span className="text-brand-primary"><Scissors className="w-6 h-6" /></span>
              {client.name}
            </a>
            <p className="text-gray-400 max-w-sm mb-6">Membawa seni dalam perawatan diri. Kami hadir untuk menyempurnakan penampilan dan menenangkan pikiran Anda.</p>
            <div className="flex space-x-4">
              <a href={client.instagramUrl || '#'} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">IG</a>
              <a href={client.tiktokUrl || '#'} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">TT</a>
              <a href={`https://wa.me/${client.waNumber}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">WA</a>
            </div>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#layanan" className="hover:text-white transition">Layanan & Harga</a></li>
              <li><a href="#stylist" className="hover:text-white transition">Tim Artisan Kami</a></li>
              <li><a href="#lookbook" className="hover:text-white transition">Galeri Portofolio</a></li>
              <li><a href="#ulasan" className="hover:text-white transition">Ulasan Pelanggan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Informasi</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex flex-col gap-1"><span className="text-white font-medium">Operasional</span> <span>{client.hours}</span></li>
              <li className="flex flex-col gap-1 mt-3"><span className="text-white font-medium">Lokasi</span> <span>{client.address}</span></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 max-w-7xl mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {client.name}. All rights reserved.
        </div>
      </footer>

      <GroomingBookingModal />

    </div>
  );
}

export function GroomingDemoClient({ client }: { client: BusinessDemo }) {
  return (
    <GroomingDemoProvider client={client}>
      <GroomingDemoContent />
    </GroomingDemoProvider>
  );
}
