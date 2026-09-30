import { useState, useEffect } from 'react';
import { Scissors } from 'lucide-react';
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BeautynspaHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-40 top-0 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="absolute inset-0 bg-stone-50/90 backdrop-blur-md"></div>
      <div className="container mx-auto px-6 py-4 relative flex justify-between items-center max-w-7xl">
        <a href="#" className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
          <span className="text-brand-primary"><Scissors className="w-6 h-6" /></span>
          {client.name}
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#layanan" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Layanan</a>
          <a href="#stylist" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Stylist</a>
          <a href="#lookbook" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Lookbook</a>
          <a href="#ulasan" className="text-sm font-medium hover:text-brand-primary transition-colors duration-200">Ulasan</a>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Reservasi
          </button>
        </div>

        <button 
          className="md:hidden text-stone-900 text-2xl focus:outline-none" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

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
            className="w-full bg-brand-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Reservasi Sekarang
          </button>
        </div>
      </div>
    </nav>
  );
}
