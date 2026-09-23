import { useCafeDemo } from './CafeDemoContext';
import { MapPin, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function CafeHeroScreen() {
  const { client, isOpenNow, setIsCartModalOpen } = useCafeDemo();
  const { ref: contentRef, isVisible: isContentVisible } = useScrollReveal(0.1);

  const getWaReservationUrl = () => {
    return `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20mau%20reservasi%20meja.`;
  };

  return (
    <section id="hero" className="relative pt-24 pb-32 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-b from-brand-primary to-brand-dark opacity-80 mix-blend-multiply`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={client.heroImage} alt="Cafe Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div 
        ref={contentRef}
        className={`max-w-6xl mx-auto px-4 relative z-10 text-center transition-all duration-1000 transform ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-flex py-1 px-4 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30">
            {client.category}
          </span>
          <span className={`inline-flex items-center gap-1.5 py-1 px-4 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30`}>
            {isOpenNow ? (
              <><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Buka Sekarang</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-rose-400" /> Sedang Tutup</>
            )}
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight leading-tight text-white drop-shadow-lg">
          Sensasi Rasa <br /> di Setiap Tegukan
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium drop-shadow-md">
          {client.tagline}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => {
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105 bg-brand-primary hover:bg-brand-hover text-white`}
          >
            Lihat Menu <ArrowRight className="w-4 h-4" />
          </button>
          
          {client.fbType === 'DINE_IN' ? (
            <a 
              href={getWaReservationUrl()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Reservasi Meja
            </a>
          ) : (
            <button 
              onClick={() => setIsCartModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Cek Pesanan
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
