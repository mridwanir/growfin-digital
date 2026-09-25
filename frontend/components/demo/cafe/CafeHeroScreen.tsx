import { useCafeDemo } from './CafeDemoContext';
import { Utensils, CalendarCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CAFE_IMAGES = [
  '/image/cafe/mitch-Da1F2k3BFeU-unsplash.jpg',
  '/image/cafe/queensland-australia-7WVpQhFGUqQ-unsplash.jpg'
];

export function CafeHeroScreen() {
  const { client, isOpenNow, setIsCartModalOpen } = useCafeDemo();
  const { ref: contentRef, isVisible: isContentVisible } = useScrollReveal(0.1);

  const getWaReservationUrl = () => {
    return `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20mau%20reservasi%20meja.`;
  };

  const heroImg = '/image/cafe/haydn-golden-EVoICOUotkg-unsplash.jpg';

  return (
    <header className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden scroll-mt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt="Cafe Interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div
        ref={contentRef}
        className={`relative z-10 text-center px-4 max-w-3xl mx-auto transition-all duration-1000 transform ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Real-time Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
          {isOpenNow ? (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          )}
          {isOpenNow ? `Buka Sekarang (${client.hours || '08:00 - 22:00'})` : 'Sedang Tutup'}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
          {client.name.split(' ')[0]} <br />
          <span className="text-brand-primary">
            {client.name.split(' ').slice(1).join(' ') || 'Kenyamanan Sempurna'}
          </span>
        </h1>
        <p className="text-stone-200 text-lg md:text-xl mb-8 font-light">
          {client.tagline || 'Nikmati hidangan spesial kami langsung di tempat atau pesan untuk dinikmati di rumah.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Utensils className="w-5 h-5" /> Lihat Menu & Pesan
          </button>

          {client.fbType === 'DINE_IN' ? (
            <a
              href={getWaReservationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" /> Reservasi Meja
            </a>
          ) : (
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" /> Cek Pesanan
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

