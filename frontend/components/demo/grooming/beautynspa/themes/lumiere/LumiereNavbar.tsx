import { useState } from 'react';
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LumiereNavbar({ scrolled }: { scrolled: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { client, setIsBookingModalOpen } = useGroomingDemo();

  return (
    <nav className={`fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-[#eeded4] transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex-shrink-0 flex items-center">
                    <span className="font-serif-lumiere text-2xl font-semibold tracking-wider text-[#4a3c37]">{client.name || 'Lumière.'}</span>
                </div>
                
                <div className="md:hidden flex items-center">
                  <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#4a3c37] hover:text-brand-primary transition focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                  </button>
                </div>

                <div className="hidden md:flex space-x-8 items-center">
                    <a href="#lookbook" className="text-sm font-medium text-[#5c4d47] hover:text-brand-primary transition">Lookbook</a>
                    <a href="#reviews" className="text-sm font-medium text-[#5c4d47] hover:text-brand-primary transition">Reviews</a>
                    <a href="#treatments" className="text-sm font-medium text-[#5c4d47] hover:text-brand-primary transition">Treatments</a>
                    <a href="#stylists" className="text-sm font-medium text-[#5c4d47] hover:text-brand-primary transition">Stylists</a>
                    <button onClick={() => setIsBookingModalOpen(true)} className="px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-none hover:opacity-90 transition-colors shadow-sm">
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#eeded4] shadow-lg absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <a href="#lookbook" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-[#5c4d47] border-b border-gray-100">Lookbook</a>
              <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-[#5c4d47] border-b border-gray-100">Reviews</a>
              <a href="#treatments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-[#5c4d47] border-b border-gray-100">Treatments</a>
              <a href="#stylists" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-[#5c4d47] border-b border-gray-100">Stylists</a>
              <button onClick={() => { setIsBookingModalOpen(true); setMobileMenuOpen(false); }} className="mt-4 w-full px-5 py-3 bg-brand-primary text-white text-base font-medium text-center">
                Book Appointment
              </button>
            </div>
          </div>
        )}
    </nav>
  );
}
