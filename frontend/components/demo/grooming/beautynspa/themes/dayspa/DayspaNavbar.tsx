
import { useState } from 'react';
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function DayspaNavbar({ scrolled }: { scrolled: boolean }) {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#F3ECE2]/70 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex flex-col">
          <span className="font-serif-dayspa text-2xl tracking-[0.2em] font-medium uppercase text-[#2B2623]">
            {client.name || 'Lumina'}
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-brand-primary -mt-1 font-medium">Sanctuary Spa</span>
        </a>

        <nav className="hidden md:flex items-center space-x-10 text-xs uppercase tracking-widest font-medium text-[#2B2623]/80">
          <a href="#about" className="hover:text-brand-primary transition-colors">Filosofi</a>
          <a href="#treatments" className="hover:text-brand-primary transition-colors">Menu Treatment</a>
          <a href="#therapists" className="hover:text-brand-primary transition-colors">Master Terapis</a>
          <a href="#lookbook" className="hover:text-brand-primary transition-colors">Atmosphere</a>
          <a href="#reviews" className="hover:text-brand-primary transition-colors">Cerita Klien</a>
        </nav>

        <div className="hidden md:flex items-center">
            <button onClick={() => setIsBookingModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary hover:bg-[#2B2623] text-white text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
            <span>Reservasi</span>
            <ArrowUpRight size={14} />
            </button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#2B2623]">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#F3ECE2] absolute w-full shadow-lg">
            <div className="px-6 py-4 flex flex-col space-y-4 text-sm font-medium uppercase tracking-widest text-[#2B2623]">
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>Filosofi</a>
                <a href="#treatments" onClick={() => setMobileMenuOpen(false)}>Menu Treatment</a>
                <a href="#therapists" onClick={() => setMobileMenuOpen(false)}>Master Terapis</a>
                <a href="#lookbook" onClick={() => setMobileMenuOpen(false)}>Atmosphere</a>
                <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Cerita Klien</a>
                <button onClick={() => { setIsBookingModalOpen(true); setMobileMenuOpen(false); }} className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-primary text-white font-semibold">
                    Reservasi Sekarang
                </button>
            </div>
        </div>
      )}
    </header>
  );
}
