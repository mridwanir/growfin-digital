import { useFnbDemo } from '../../core/FnbDemoContext';
import { ArrowDown, ChevronDown } from 'lucide-react';

export function PremiumHeader() {
  const { client, isOpenNow } = useFnbDemo();
  const heroImage = client.heroImage || '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg';

  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Cafe Interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl transition-all duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-brand-primary/30 text-brand-primary text-sm font-medium mb-8 backdrop-blur-sm">
          {isOpenNow ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span>Buka Sekarang • {client.hours}</span>
            </>
          ) : (
            <span>Tutup Saat Ini</span>
          )}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          {client.name.split(' ')[0]} <br /> <span className="text-brand-primary font-extrabold">{client.name.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
          {client.tagline || 'Experience premium artisanal coffee and gourmet bites, crafted with uncompromising quality and passion.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#menu" className="px-8 py-4 bg-brand-primary text-slate-950 rounded-none font-bold text-lg w-full sm:w-auto text-center flex justify-center items-center gap-3 active:scale-95 transition-transform hover:brightness-110">
            Explore Menu <ArrowDown size={20} />
          </a>
          {client.heroSecondaryAction === 'whatsapp' ? (
            <a href={`https://wa.me/${client.waNumber}`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-none font-bold text-lg w-full sm:w-auto text-center flex justify-center items-center gap-3 active:scale-95 transition-transform">
              Reservasi Meja
            </a>
          ) : client.heroSecondaryAction === 'cart' ? (
            <button className="px-8 py-4 bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-none font-bold text-lg w-full sm:w-auto text-center flex justify-center items-center gap-3 active:scale-95 transition-transform">
              Pesan Online
            </button>
          ) : (
            <a href="#gallery" className="px-8 py-4 bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-none font-bold text-lg w-full sm:w-auto text-center flex justify-center items-center gap-3 active:scale-95 transition-transform">
              Lihat Suasana
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="text-slate-500 w-8 h-8" />
      </div>
    </header>
  )
}
