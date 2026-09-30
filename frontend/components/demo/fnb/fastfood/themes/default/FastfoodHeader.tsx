import { useFnbDemo } from '../../../core/FnbDemoContext';
import { Zap, ShoppingBag, ArrowRight } from 'lucide-react';

export function FastfoodHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo();
  const heroImage = client.heroImage || '/image/fnb/fastfood/fastfood (1).jpg';
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'C';

  return (
    <>
      <div className="bg-neutral-950 text-brand-primary text-xs sm:text-sm font-semibold tracking-wide py-2.5 px-4 text-center border-b border-neutral-800 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        🔥 FLASH SALE: Gunakan kupon <span className="text-white underline underline-offset-2">LAPERPOOL</span> untuk Gratis Ongkir Jabodetabek!
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30 text-white font-extrabold text-xl">
              {brandInitial}
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-neutral-950 block leading-tight">
                {client.name.split(' ')[0]}<span className="text-brand-primary">{client.name.split(' ').slice(1).join(' ')}</span>
              </span>
              <span className="text-[10px] tracking-widest font-semibold uppercase text-neutral-400">{client.category || 'Artisan Fast Food'}</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-600">
            <a href="#promo" className="hover:text-brand-primary transition">Flash Promo</a>
            <a href="#katalog" className="hover:text-brand-primary transition">Katalog Visual</a>
            <a href="#lookbook" className="hover:text-brand-primary transition">Combobook</a>
            <a href="#reviews" className="hover:text-brand-primary transition">Ulasan</a>
          </nav>

          <button onClick={() => setIsCartModalOpen(true)} className="relative bg-neutral-900 text-white p-3 rounded-full hover:bg-neutral-800 transition flex items-center justify-center shadow-md cursor-pointer">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-neutral-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ring-1 ring-brand-primary">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <section id="promo" className="relative overflow-hidden bg-neutral-950 py-16 lg:py-24 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6 border border-brand-primary/30">
              <Zap className="w-4 h-4" /> Limited Drop No. #04
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              {client.tagline ? client.tagline.split(' ').slice(0, 2).join(' ') : 'Double Smashed'} <br/>
              <span className="text-brand-primary">{client.tagline ? client.tagline.split(' ').slice(2).join(' ') : 'Truffle Beast Edition'}</span>
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
              100% Australian Wagyu beef, slow-melted aged cheddar, crisp smoked beef bacon, dan siraman black truffle glaze premium. Disajikan panas dan berair.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#katalog" className="bg-brand-primary hover:bg-brand-hover text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-brand-primary/25 transition duration-200 transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                Pesan Sekarang <ArrowRight className="w-5 h-5" />
              </a>
              <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl">
                <span className="text-xs text-neutral-400 font-medium">Sisa Slot Hari Ini:</span>
                <span className="text-sm font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">Hanya 14 Porsi</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-800 aspect-4/3 group">
              <img src={heroImage} alt="Signature Burger" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute bottom-4 left-4 right-4 bg-neutral-900/80 backdrop-blur-md p-4 rounded-2xl border border-neutral-700/50 flex justify-between items-center">
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase">Katalog Signature</p>
                  <h4 className="font-bold text-white text-base">Truffle Beast Wagyu</h4>
                </div>
                <div className="text-right">
                  <span className="line-through text-xs text-neutral-500">Rp 95.000</span>
                  <p className="text-brand-primary font-extrabold text-lg">Rp 74.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
