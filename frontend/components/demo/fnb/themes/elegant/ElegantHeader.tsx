import { useFnbDemo } from '../../core/FnbDemoContext';
import { CakeSlice, ShoppingBag, Sparkles } from 'lucide-react';

export function ElegantHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo();
  const heroImage = client.heroImage || '/image/fnb/bakeryndessert/bakeryndessert (1).jpg';

  return (
    <>
      <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <CakeSlice className="w-5 h-5" />
            </span>
            <div>
              <span className="font-serif-title text-2xl font-bold tracking-tight text-stone-900 block leading-none">{client.name.split(' ')[0]}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-stone-600 font-semibold">{client.category || "Artisan Pâtisserie"}</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="#menu" className="text-stone-900 hover:text-brand-primary transition-colors">Menu</a>
            <a href="#gallery" className="text-stone-900 hover:text-brand-primary transition-colors">Ruangan</a>
            <a href="#contact" className="text-stone-900 hover:text-brand-primary transition-colors">Kontak</a>
          </nav>

          <button onClick={() => setIsCartModalOpen(true)} className="relative flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full hover:bg-brand-dark transition-colors focus:outline-none">
            <ShoppingBag className="w-4 h-4" />
            <span className="font-bold text-sm hidden sm:inline">Keranjang</span>
            <span className="bg-white text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{cartItemCount}</span>
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 py-16 md:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-4 h-4" /> Seasonal Release • Fresh Baked Daily
              </div>
              <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-bold leading-tight">
                {client.name.split(' ').slice(0, Math.ceil(client.name.split(' ').length / 2)).join(' ')} <br/>
                <span className="italic font-normal text-brand-primary">{client.name.split(' ').slice(Math.ceil(client.name.split(' ').length / 2)).join(' ')}</span>
              </h1>
              <p className="text-base sm:text-lg text-stone-700 max-w-xl leading-relaxed">
                {client.tagline || 'Dibuat segar setiap subuh tanpa bahan pengawet. Nikmati kue tart bertekstur lembut, croissant renyah berlapis, dan dessert elegan untuk momen istimewa Anda.'}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="#menu" className="px-8 py-4 bg-stone-900 text-white font-medium rounded-full shadow-lg hover:bg-stone-800 transition transform active:scale-95">
                  Beli Sekarang (Order Hari Ini)
                </a>
                {client.heroSecondaryAction === 'whatsapp' ? (
                  <a href={`https://wa.me/${client.waNumber}`} target="_blank" rel="noopener noreferrer" className="px-6 py-4 border border-stone-900/40 text-stone-900 font-medium rounded-full hover:bg-white/60 transition">
                    Tanya Admin
                  </a>
                ) : client.heroSecondaryAction === 'cart' ? (
                  <button onClick={() => setIsCartModalOpen(true)} className="px-6 py-4 border border-stone-900/40 text-stone-900 font-medium rounded-full hover:bg-white/60 transition">
                    Cek Pesanan
                  </button>
                ) : (
                  <a href="#gallery" className="px-6 py-4 border border-stone-900/40 text-stone-900 font-medium rounded-full hover:bg-white/60 transition">
                    Lihat Inspirasi Meja Pesta
                  </a>
                )}
              </div>


            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/60">
                  <img src={heroImage} alt="Signature Cake" className="w-full h-full object-cover transform hover:scale-105 transition duration-700" />
                  
                  <div className="absolute top-4 right-4 bg-brand-primary text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> TERLARIS HARI INI
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-stone-50">
                    <p className="text-xs text-brand-primary font-bold tracking-wider uppercase">Signature Cake</p>
                    <div className="flex justify-between items-baseline mt-1">
                      <h3 className="font-serif-title font-bold text-stone-900 text-lg">Chantilly Strawberry Supreme</h3>
                      <span className="text-brand-primary font-bold">Rp 320.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
