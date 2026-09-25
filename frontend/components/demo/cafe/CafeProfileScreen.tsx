import { useCafeDemo } from './CafeDemoContext';
import { MapPin, Clock, Phone, Navigation, Coffee } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function CafeProfileScreen() {
  const { client, isOpenNow } = useCafeDemo();
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <footer id="kontak" className="bg-slate-900 text-slate-300 py-16 sm:py-24 scroll-mt-20">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >

        {/* Left Side: Brand & Contacts */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white shadow-lg`}>
              <Coffee className="w-8 h-8" />
            </span>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">{client.name}</h2>
              <p className={`text-sm font-black text-brand-primary uppercase tracking-widest mt-1`}>{client.category}</p>
            </div>
          </div>

          <p className="text-slate-400 font-medium leading-relaxed max-w-md">
            {client.tagline}
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{client.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-slate-500 shrink-0" />
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-300 font-medium">{client.hours}</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isOpenNow ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  {isOpenNow ? 'Buka' : 'Tutup'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-slate-500 shrink-0" />
              <p className="text-sm text-slate-300 font-medium">{client.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Map Actions */}
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-[32px] space-y-6">
          <h3 className="text-xl font-bold text-white mb-2">Lokasi & Navigasi</h3>

          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Petunjuk Arah Kurir / Ojol</p>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              "Bangunan warna krem, persis di sebelah minimarket. Masuk dari pintu kaca depan."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all bg-brand-primary hover:bg-brand-hover text-white shadow-lg`}
            >
              <Navigation className="w-4 h-4" /> Buka Google Maps
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-4 mt-20 pt-8 border-t border-slate-800 text-center text-sm font-medium text-slate-500">
        <p>© {new Date().getFullYear()} {client.name} — Powered by Growfin Digital Templates.</p>
      </div>
    </footer>
  );
}
