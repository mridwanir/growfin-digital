import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaHero() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  const heroImage = client.heroImage || '/image/grooming/nailspa/1.jpg';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-20">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-light rounded-full blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-nude-200 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/40 bg-brand-light text-brand-primary text-xs uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
            A Sanctuary of Quiet Luxury & Nail Artistry
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif leading-[1.1] text-charcoal">
            {client.name}
          </h1>

          <p className="text-neutral-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            {client.tagline || 'Lepaskan penat dalam balutan aroma terapi lavender, sentuhan lembut terapis tersertifikasi, dan seni kuku presisi dengan produk non-toxic berkualitas tinggi.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-primary text-white text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition shadow-lg hover:shadow-brand-primary/20"
            >
              Reservasi Slot Kursi
            </button>
            <a href="#lookbook" className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-brand-primary text-brand-primary text-xs uppercase tracking-widest font-semibold hover:bg-brand-primary hover:text-white transition text-center">
              Lihat Lookbook
            </a>
          </div>

          <div className="pt-8 border-t border-nude-200/80 flex items-center justify-center lg:justify-start gap-8 text-neutral-500 text-xs uppercase tracking-wider">
            <div><span className="block text-xl font-serif text-charcoal font-semibold">★ {client.rating || '4.9'}</span> Customer Rating</div>
            <div className="w-px h-8 bg-nude-300"></div>
            <div><span className="block text-xl font-serif text-charcoal font-semibold">{client.reviewCount || '50'}+</span> Trusted Reviews</div>
            <div className="w-px h-8 bg-nude-300"></div>
            <div><span className="block text-xl font-serif text-charcoal font-semibold">{client.openTime || '09:00'}</span> Open Daily</div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white">
              <img src={heroImage} alt="Nail Salon Interior Vibe" className="w-full h-[520px] object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-nude-50/85 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-xl">
                ☕
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Complimentary</p>
                <p className="text-sm font-semibold text-charcoal">Artisan Tea & Macaron</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
