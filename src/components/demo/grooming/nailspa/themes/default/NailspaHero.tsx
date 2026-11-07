import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaHero() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()
  const heroImage = client.heroImage || '/image/grooming/nailspa/1.jpg'

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-20">
      <div className="bg-brand-light pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-70 blur-3xl"></div>
      <div className="bg-nude-200 pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full opacity-60 blur-3xl"></div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
          <div className="border-brand-primary/40 bg-brand-light text-brand-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase">
            <span className="bg-brand-primary h-2 w-2 animate-pulse rounded-full"></span>
            A Sanctuary of Quiet Luxury & Nail Artistry
          </div>

          <h1 className="text-charcoal font-serif text-4xl leading-[1.1] sm:text-6xl xl:text-7xl">
            {client.name}
          </h1>

          <p className="mx-auto max-w-xl text-base leading-relaxed font-light text-neutral-600 sm:text-lg lg:mx-0">
            {client.tagline ||
              'Lepaskan penat dalam balutan aroma terapi lavender, sentuhan lembut terapis tersertifikasi, dan seni kuku presisi dengan produk non-toxic berkualitas tinggi.'}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-brand-primary hover:shadow-brand-primary/20 w-full rounded-full px-8 py-4 text-xs font-semibold tracking-widest text-white uppercase shadow-lg transition hover:opacity-90 sm:w-auto"
            >
              Reservasi Slot Kursi
            </button>
            <a
              href="#lookbook"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary w-full rounded-full border-2 px-8 py-4 text-center text-xs font-semibold tracking-widest uppercase transition hover:text-white sm:w-auto"
            >
              Lihat Lookbook
            </a>
          </div>

          <div className="border-nude-200/80 flex items-center justify-center gap-8 border-t pt-8 text-xs tracking-wider text-neutral-500 uppercase lg:justify-start">
            <div>
              <span className="text-charcoal block font-serif text-xl font-semibold">
                ★ {client.rating || '4.9'}
              </span>{' '}
              Customer Rating
            </div>
            <div className="bg-nude-300 h-8 w-px"></div>
            <div>
              <span className="text-charcoal block font-serif text-xl font-semibold">
                {client.reviewCount || '50'}+
              </span>{' '}
              Trusted Reviews
            </div>
            <div className="bg-nude-300 h-8 w-px"></div>
            <div>
              <span className="text-charcoal block font-serif text-xl font-semibold">
                {client.openTime || '09:00'}
              </span>{' '}
              Open Daily
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
              <img
                src={heroImage}
                alt="Nail Salon Interior Vibe"
                className="h-[520px] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="bg-nude-50/85 absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-white/60 p-4 shadow-xl backdrop-blur-md">
              <div className="bg-brand-light text-brand-primary flex h-12 w-12 items-center justify-center rounded-full text-xl">
                ☕
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Complimentary</p>
                <p className="text-charcoal text-sm font-semibold">Artisan Tea & Macaron</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
