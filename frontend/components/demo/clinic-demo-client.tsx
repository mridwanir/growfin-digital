'use client';

import { BusinessDemo } from '@/lib/types';
import { ClinicDemoProvider, useClinicDemo } from './clinic/ClinicDemoContext';
import { ClinicHeroScreen } from './clinic/ClinicHeroScreen';
import { ClinicPractitionerList } from './clinic/ClinicPractitionerList';
import { ClinicServicesPricing } from './clinic/ClinicServicesPricing';
import { ClinicSocialProof } from './clinic/ClinicSocialProof';
import { ClinicBookingModal } from './clinic/ClinicBookingModal';
import { ClinicFloatingDock } from './clinic/ClinicFloatingDock';

function ClinicDemoContent() {
  const { client, setIsBookingModalOpen } = useClinicDemo();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-primary selection:text-white relative overflow-hidden pb-20 md:pb-0">
      
      {/* Background Decor */}
      <div className="fixed -top-64 -right-64 w-[600px] h-[600px] rounded-full blur-[120px] bg-gradient-to-br from-brand-primary to-brand-dark opacity-10 pointer-events-none" />
      <div className="fixed top-1/2 -left-64 w-[500px] h-[500px] rounded-full blur-[100px] bg-gradient-to-tr from-brand-primary to-brand-dark opacity-5 pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white font-bold text-xl shadow-lg shadow-brand-primary/25">
              {client.iconEmoji || '🏥'}
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
              <a href="#praktisi" className="hover:text-brand-primary transition-colors">Praktisi</a>
              <a href="#layanan" className="hover:text-brand-primary transition-colors">Layanan & Tarif</a>
              <a href="#info" className="hover:text-brand-primary transition-colors">Info Fasilitas</a>
            </nav>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand-primary/25 font-bold text-sm relative group"
            >
              <span className="text-lg leading-none">🗓️</span>
              <span>Buat Janji</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 md:py-8 relative z-10">
        <ClinicHeroScreen />
        <ClinicPractitionerList />
        <ClinicServicesPricing />
        <ClinicSocialProof />
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-slate-900 pt-20 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white text-2xl shadow-lg">
                {client.iconEmoji || '🏥'}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white leading-none">{client.name}</h3>
                <p className="text-xs font-bold text-brand-primary mt-1 uppercase tracking-widest">{client.category}</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Kami selalu berkomitmen memberikan pelayanan terbaik secara profesional dan rahasia untuk Anda.
            </p>
          </div>
          <div className="space-y-6">
             <h4 className="text-lg font-bold text-white">Informasi Kontak & Lokasi</h4>
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
