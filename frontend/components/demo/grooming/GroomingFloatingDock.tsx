'use client';

import { useGroomingDemo } from './GroomingDemoContext';

export function GroomingFloatingDock() {
  const { client, setIsBookingModalOpen, selectedServices } = useGroomingDemo();

  // If there are selected services, the floating summary bar from ServiceMenu is shown
  // We can hide this dock to prevent overlap, or just let them coexist. 
  // Hiding it is cleaner.
  if (selectedServices.length > 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 sm:hidden pb-safe">
      <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-3 flex items-center justify-between shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] gap-2">
        
        <button 
          onClick={() => setIsBookingModalOpen(true)} 
          className="flex-1 flex flex-col items-center justify-center py-1 gap-1 text-slate-500 hover:text-brand-primary transition-colors bg-brand-light/50 rounded-xl"
        >
          <span className="text-xl">🗓️</span>
          <span className="text-[10px] font-bold text-brand-primary">Cek Antrean</span>
        </button>

        <a href="#layanan" className="flex-1 flex flex-col items-center justify-center py-1 gap-1 text-slate-500 hover:text-brand-primary transition-colors">
          <span className="text-xl">✂️</span>
          <span className="text-[10px] font-bold">Daftar Harga</span>
        </a>

        <a href={client.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center py-1 gap-1 text-slate-500 hover:text-blue-500 transition-colors">
          <span className="text-xl">📍</span>
          <span className="text-[10px] font-bold">Navigasi Lokasi</span>
        </a>

      </div>
    </div>
  );
}
