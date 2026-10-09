import { useFnbDemo } from '../../core/FnbDemoContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function BoldHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo();
  const heroImage = client.heroImage || '/image/fnb/fastfood/fastfood (1).jpg';
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'C';

  return (
    <>


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
            <a href="#menu" className="hover:text-brand-primary transition">Menu</a>
            <a href="#gallery" className="hover:text-brand-primary transition">Galeri</a>
            <a href="#reviews" className="hover:text-brand-primary transition">Ulasan</a>
            <a href="#contact" className="hover:text-brand-primary transition">Kontak</a>
          </nav>

          <button onClick={() => setIsCartModalOpen(true)} className="relative bg-neutral-900 text-white px-4 py-2.5 rounded-full hover:bg-neutral-800 transition flex items-center gap-2 shadow-md cursor-pointer">
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline font-bold text-sm">Keranjang</span>
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
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              {client.tagline ? client.tagline.split(' ').slice(0, Math.ceil(client.tagline.split(' ').length / 2)).join(' ') : client.name} <br/>
              <span className="text-brand-primary">{client.tagline ? client.tagline.split(' ').slice(Math.ceil(client.tagline.split(' ').length / 2)).join(' ') : ''}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#menu" className="bg-brand-primary hover:bg-brand-hover text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-brand-primary/25 transition duration-200 transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                Pesan Sekarang <ArrowRight className="w-5 h-5" />
              </a>

            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-800 aspect-4/3 group">
              <img src={heroImage} alt="Signature Burger" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
