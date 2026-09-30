import { useFnbDemo } from '../../../core/FnbDemoContext';
import { ShoppingBag } from 'lucide-react';

export function BubbleteaHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo();
  const heroImage = client.heroImage || '/image/fnb/bubleteanjuice/bubleteanjuice (1).jpg';
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'B';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-black text-xl shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform">
                {brandInitial}
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-stone-900 block leading-none">{client.name}</span>
                <span className="text-[10px] tracking-widest text-brand-primary font-semibold uppercase">{client.category || 'Artisan Brews'}</span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-600">
              <a href="#katalog" className="hover:text-brand-primary transition-colors">Menu Katalog</a>
              <a href="#lookbook" className="hover:text-brand-primary transition-colors">Lookbook Tren</a>
              <a href="#reviews" className="hover:text-brand-primary transition-colors">Ulasan Pembeli</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartModalOpen(true)} className="relative p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all cursor-pointer flex items-center gap-2 font-semibold text-sm">
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartItemCount}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-primary/80 to-brand-primary/60 text-white py-16 sm:py-24">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                {client.metadata?.promoText || 'Flash Sale 40% Off • Weekend Treat'}
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
                {client.tagline ? client.tagline.split(' ').slice(0, 3).join(' ') : 'Segarnya Buah Asli'} &amp; <br/>
                {client.tagline ? client.tagline.split(' ').slice(3).join(' ') : 'Kenyalnya Brown Sugar Boba.'}
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 font-normal">
                Dibuat dari daun teh pegunungan pilihan, 100% susu murni, dan potongan buah segar tanpa pengawet. Sensasi dingin yang bikin hari Anda lebih ceria!
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a href="#katalog" className="px-8 py-4 rounded-xl bg-white text-stone-900 font-bold hover:bg-stone-100 shadow-xl shadow-stone-900/10 transition-all transform hover:-translate-y-0.5">
                  Pesan Sekarang
                </a>
                <a href="#lookbook" className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 backdrop-blur-sm transition-all">
                  Jelajahi Lookbook
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-72 sm:w-88 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src={heroImage} alt="Signature Drink" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Most Loved</span>
                  <h3 className="text-white text-xl font-bold">Royal Signature</h3>
                  <p className="text-stone-300 text-sm">Best Seller Pilihan Pelanggan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
