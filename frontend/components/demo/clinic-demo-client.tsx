'use client';

import { BusinessDemo } from '@/lib/types';
import { Activity } from 'lucide-react';
import { ClinicDemoProvider, useClinicDemo } from './clinic/ClinicDemoContext';
import { ClinicHeroScreen } from './clinic/ClinicHeroScreen';
import { ClinicPractitionerList } from './clinic/ClinicPractitionerList';
import { ClinicServicesPricing } from './clinic/ClinicServicesPricing';
import { ClinicSocialProof } from './clinic/ClinicSocialProof';
import { ClinicGallery } from './clinic/ClinicGallery';
import { ClinicBookingModal } from './clinic/ClinicBookingModal';
import { ClinicFloatingDock } from './clinic/ClinicFloatingDock';

function ClinicDemoContent() {
  const { client, setIsBookingModalOpen } = useClinicDemo();

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50 antialiased selection:bg-brand-primary selection:text-white relative overflow-hidden pb-20 md:pb-0">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-brand-primary text-white rounded-lg flex items-center justify-center text-xl font-bold shadow-lg">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                {client.name}
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-600 hover:text-brand-primary font-medium transition">Beranda</a>
              <a href="#services" className="text-gray-600 hover:text-brand-primary font-medium transition">Layanan</a>
              <a href="#experts" className="text-gray-600 hover:text-brand-primary font-medium transition">Pakar Kami</a>
              <a href="#gallery" className="text-gray-600 hover:text-brand-primary font-medium transition">Fasilitas</a>
              <a href="#reviews" className="text-gray-600 hover:text-brand-primary font-medium transition">Ulasan</a>
            </div>
            <div className="hidden md:flex">
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-brand-primary hover:bg-brand-hover text-white px-6 py-2.5 rounded-full font-semibold transition shadow-md shadow-brand-primary/30"
              >
                Booking Sekarang
              </button>
            </div>
            {/* Mobile menu button handled visually via FloatingDock */}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full relative z-10">
        <ClinicHeroScreen />
        <ClinicServicesPricing />
        <ClinicPractitionerList />
        <ClinicGallery />
        <ClinicSocialProof />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-md flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">{client.name}</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              {client.tagline || 'Melayani dengan integritas, profesionalitas, dan teknologi terkini. Komitmen kami adalah memberikan hasil terbaik untuk kepuasan Anda.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-brand-primary transition">Layanan Kami</a></li>
              <li><a href="#experts" className="hover:text-brand-primary transition">Profil Ahli</a></li>
              <li><a href="#gallery" className="hover:text-brand-primary transition">Fasilitas</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span>{client.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span>{client.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span>{client.hours}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} {client.name}. All rights reserved.
        </div>
      </footer>

      <ClinicBookingModal />
      <ClinicFloatingDock />

    </div>
  );
}

export function ClinicDemoClient({ client }: { client: BusinessDemo }) {
  return (
    <ClinicDemoProvider client={client}>
      <ClinicDemoContent />
    </ClinicDemoProvider>
  );
}
