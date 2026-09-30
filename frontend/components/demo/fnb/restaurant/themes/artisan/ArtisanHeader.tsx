import { useFnbDemo } from '../../../core/FnbDemoContext';
import { UtensilsCrossed, ShoppingBag, Sparkles, Calendar, Clock3, Coffee, ShieldCheck } from 'lucide-react';

export function ArtisanHeader() {
  const { client, isOpenNow, cartItemCount, setIsCartModalOpen } = useFnbDemo();
  const heroImage = client.heroImage || '/image/fnb/restaurant/restaurant (1).jpg';

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-primary rounded-xl text-stone-950 font-black">
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <div>
              <span className="font-serif-title font-bold text-lg md:text-xl tracking-wide text-brand-light">{client.name}</span>
              <span className="text-[10px] block text-stone-400 -mt-1 tracking-widest uppercase">{client.category || 'Artisan Dine & Coffee'}</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
            <a href="#menu" className="hover:text-brand-primary transition">Menu Pilihan</a>
            <a href="#lookbook" className="hover:text-brand-primary transition">Galeri Suasana</a>
            <a href="#reviews" className="hover:text-brand-primary transition">Ulasan</a>
            <a href="#contact" className="hover:text-brand-primary transition">Kontak Admin</a>
          </nav>

          <button onClick={() => setIsCartModalOpen(true)} className="relative flex items-center gap-2 bg-stone-800 hover:bg-stone-700 px-3.5 py-2 rounded-full border border-stone-700 text-sm transition">
            <ShoppingBag className="w-4 h-4 text-brand-primary" />
            <span className="hidden sm:inline font-medium">Pesanan</span>
            <span className="bg-brand-primary text-stone-950 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">{cartItemCount}</span>
          </button>
        </div>
      </header>

      <section className="relative min-h-[85vh] flex items-center justify-center bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Restaurant Ambiance" className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-stone-900/80 border border-stone-700/80 backdrop-blur-md mb-6 shadow-lg shadow-black/40">
            {isOpenNow ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs md:text-sm font-semibold text-stone-200">
                  Buka Sekarang &bull; {client.hours || '10:00 - 22:00'}
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="text-xs md:text-sm font-semibold text-stone-200">
                  Tutup Saat Ini &bull; {client.hours || '10:00 - 22:00'}
                </span>
              </>
            )}
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-100 leading-tight">
            {client.name.split(' ').slice(0, Math.ceil(client.name.split(' ').length / 2)).join(' ')} <br/>
            <span className="italic text-brand-primary font-normal">{client.name.split(' ').slice(Math.ceil(client.name.split(' ').length / 2)).join(' ')}</span>
          </h1>
          <p className="mt-5 text-stone-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {client.tagline || 'Nikmati pengalaman bersantap istimewa dengan racikan bahan lokal terbaik atau pesan cepat langsung dari meja Anda.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#menu" className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-primary hover:bg-brand-hover text-stone-950 font-bold shadow-lg shadow-brand-primary/20 transition transform active:scale-95">
              <Sparkles className="w-4 h-4" />
              Pesan Cepat (Self-Order)
            </a>
            <button onClick={scrollToContact} className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-800/90 hover:bg-stone-700 border border-stone-600 text-stone-100 font-semibold backdrop-blur-sm transition">
              <Calendar className="w-4 h-4 text-brand-primary" />
              Reservasi Meja
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 max-w-lg mx-auto border-t border-stone-800/80 pt-6 text-stone-400 text-xs md:text-sm">
            <div className="flex flex-col items-center gap-1">
              <Clock3 className="w-5 h-5 text-brand-primary" />
              <span>Penyajian &le; 15 Mnt</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-stone-800">
              <Coffee className="w-5 h-5 text-brand-primary" />
              <span>100% Arabica</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
              <span>Higienis & Halal</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
