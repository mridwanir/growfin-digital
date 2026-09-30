
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { Droplet } from 'lucide-react';

export function DayspaHero() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();

  return (
    <section id="about" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 py-20 mt-20">
      <div className="absolute inset-0 z-0">
        <img src={client.heroImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80"}
          alt="Spa Ambience"
          className="w-full h-full object-cover object-center brightness-[0.88] contrast-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B2623]/75 via-[#2B2623]/45 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-white">
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
            {client.isOpen} {client.openTime} - {client.closeTime}
          </div>
          <h1 className="font-serif-dayspa text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight">
            {client.name}
          </h1>
          <p className="text-white/80 max-w-xl text-base sm:text-lg font-light leading-relaxed">
            {client.tagline || 'Perpaduan teknik pijat ritual kuno Nusantara, sentuhan aromaterapi murni organik, serta terapis profesional bersertifikasi untuk regenerasi raga seutuhnya.'}
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button onClick={() => setIsBookingModalOpen(true)} className="px-8 py-4 bg-brand-primary hover:bg-white hover:text-[#2B2623] text-white rounded-full text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-lg">
              Amankan Sesi Anda
            </button>
            <a href="#treatments" className="px-7 py-4 border border-white/40 hover:bg-white/15 rounded-full text-xs font-medium tracking-[0.18em] uppercase transition-all duration-300">
              Lihat Menu Spa
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 hidden lg:block">
          <div className="p-6 rounded-3xl bg-[#FAF7F2]/15 backdrop-blur-xl border border-white/20 text-white space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary/30 flex items-center justify-center border border-brand-primary/40">
                <Droplet size={24} />
              </div>
              <div>
                <h4 className="font-serif-dayspa text-lg font-medium">100% Essential Elixirs</h4>
                <p className="text-xs text-white/70">Cold-pressed lavender & sandalwood oil</p>
              </div>
            </div>
            <div className="h-[1px] bg-white/15"></div>
            <div className="flex justify-between items-center text-xs tracking-wider uppercase text-white/80">
              <span>Slot Hari Ini:</span>
              <span className="text-brand-primary font-semibold px-2 py-0.5 rounded bg-[#2B2623]/40">Sisa 3 Jam Saja</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
