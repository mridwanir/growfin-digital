import { useFnbDemo } from '../../../core/FnbDemoContext';
import { ArrowRight } from 'lucide-react';

export function AlternatifHeader() {
  const { client, isOpenNow, setIsCartModalOpen } = useFnbDemo();
  const heroImage = client.heroImage || '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg';
  const secondaryAction = client.heroSecondaryAction || 'gallery';

  const getWaReservationUrl = () => {
    return `https://wa.me/${client.waNumber}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20mau%20reservasi%20meja.`;
  };

  return (
    <header className="relative w-full min-h-[90vh] flex flex-col lg:flex-row bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1 z-10 bg-white">
        <div className="max-w-xl w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold mb-6 shadow-sm">
            {isOpenNow ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                </span>
                Buka • {client.hours || '08:00 - 22:00'}
              </>
            ) : (
              'Tutup Saat Ini'
            )}
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-stone-900 mb-6 leading-tight">
            {client.name.split(' ')[0]}<br /> <span className="text-brand-primary">{client.name.split(' ').slice(1).join(' ') || 'Lebih Dekat.'}</span>
          </h1>
          <p className="text-stone-500 text-lg mb-8 leading-relaxed">
            {client.tagline || 'Rasakan pengalaman kuliner modern dengan sentuhan bahan lokal terbaik.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-brand-primary text-white hover:bg-black rounded-2xl font-bold shadow-xl shadow-stone-900/20 active:scale-95 transition-all flex justify-center items-center gap-2">
              Pesan Sekarang <ArrowRight size={20} />
            </button>
            {secondaryAction === 'whatsapp' ? (
              <a href={getWaReservationUrl()} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-2xl font-bold active:scale-95 transition-all flex justify-center items-center gap-2">
                Reservasi WA
              </a>
            ) : secondaryAction === 'cart' ? (
              <button onClick={() => setIsCartModalOpen(true)} className="px-8 py-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-2xl font-bold active:scale-95 transition-all flex justify-center items-center gap-2">
                Cek Pesanan
              </button>
            ) : (
              <button onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-2xl font-bold active:scale-95 transition-all flex justify-center items-center gap-2">
                Lihat Suasana
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto order-1 lg:order-2 relative overflow-hidden">
        <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover scale-105 transform hover:scale-100 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 lg:hidden"></div>
      </div>
    </header>
  )
}
