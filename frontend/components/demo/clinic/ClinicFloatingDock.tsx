'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { Calendar, Users, MapPin } from 'lucide-react';

export function ClinicFloatingDock() {
  const { client, setIsBookingModalOpen } = useClinicDemo();

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 sm:hidden pb-safe">
      <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-3 flex items-center justify-between shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] gap-2">
        
        <button 
          onClick={() => setIsBookingModalOpen(true)} 
          className="flex-1 flex flex-col items-center justify-center py-1 gap-1 text-slate-500 hover:text-brand-primary transition-colors bg-brand-light/50 rounded-xl"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold text-brand-primary mt-1">Buat Janji</span>
        </button>

        <a href="#praktisi" className="flex-1 flex flex-col items-center justify-center py-1 gap-1 text-slate-500 hover:text-brand-primary transition-colors">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Praktisi</span>
        </a>

        <a href={client.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center py-1 gap-1 text-slate-500 hover:text-blue-500 transition-colors">
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Rute Klinik</span>
        </a>

      </div>
    </div>
  );
}
