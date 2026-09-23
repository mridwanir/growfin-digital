'use client';
import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ClinicProfileScreen() {
  const { client, setIsScheduleModalOpen, selectedDay, selectedTime } = useClinicDemo();
  const { ref, isVisible } = useScrollReveal(0.1);

  const openBookingModal = () => {
    setIsScheduleModalOpen(true);
  };

  const getWaBookingUrl = () => {
    const treatmentText = 'Treatment Medis';
    const message = `Halo ${client.name}, saya ingin reservasi jadwal treatment *${treatmentText}* untuk hari *${selectedDay}, ${selectedTime} WIB*. Apakah jadwal masih tersedia?`;
    return `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <footer id="profil" className="bg-slate-900 text-slate-300 py-16 sm:py-24 scroll-mt-16">
      <div 
        ref={ref}
        className={`max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        
        {/* Left: Brand & Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white text-2xl shadow-lg`}>
              {client.iconEmoji || '🏥'}
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">
                {client.name}
              </h2>
              <p className={`text-xs font-bold text-brand-primary mt-0.5`}>{client.category}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            {client.tagline}
          </p>

          <div className="space-y-3 pt-4 text-sm font-medium">
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <p>{client.address}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🕒</span>
              <p>{client.hours}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📞</span>
              <p>{client.phone}</p>
            </div>
          </div>
        </div>

        {/* Center: Quick Links / Actions */}
        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg">Akses Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => openBookingModal()}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors text-left"
            >
              <span className="text-xl">📅</span>
              <span className="text-xs font-bold">Booking<br/>Jadwal</span>
            </button>
            <a
              href={getWaBookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-100 transition-colors"
            >
              <span className="text-xl">💬</span>
              <span className="text-xs font-bold">Chat<br/>WhatsApp</span>
            </a>
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors col-span-2"
            >
              <span className="text-xl">🗺️</span>
              <span className="text-xs font-bold">Buka Rute Navigasi di Google Maps</span>
            </a>
          </div>
        </div>

        {/* Right: Google Profile Embed Mock */}
        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg">Google Business Profile</h3>
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80"
              alt="Google Maps Profile Banner"
              className="h-32 w-full object-cover opacity-80"
            />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">{client.name}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                  ✓ Verified
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-3">
                <span>⭐ {client.rating.toFixed(1)}</span>
                <span className="text-slate-400">({client.reviewCount}+ Google Reviews)</span>
              </div>
              <div className="space-y-3">
                {client.reviews?.slice(0, 2).map((rev: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{rev.authorName}</span>
                      <span className="text-[8px] text-amber-500">{'⭐'.repeat(rev.rating)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                      &quot;{rev.text}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>Powered by Growfin Digital Templates. All rights reserved.</p>
      </div>
    </footer>
  );
}
