import { ArrowDown, ChevronDown } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function PremiumHeader() {
  const { client, isOpenNow } = useFnbDemo()
  const heroImage = client.heroImage || '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg'

  return (
    <header className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Cafe Interior" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950"></div>
      </div>

      <div className="relative z-10 max-w-4xl px-4 text-center transition-all duration-1000">
        <div className="border-brand-primary/30 text-brand-primary mb-8 inline-flex items-center gap-2 rounded-full border bg-slate-900/80 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          {isOpenNow ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="bg-brand-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                <span className="bg-brand-primary relative inline-flex h-2 w-2 rounded-full"></span>
              </span>
              <span>Buka Sekarang • {client.hours}</span>
            </>
          ) : (
            <span>Tutup Saat Ini</span>
          )}
        </div>

        <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight text-white md:text-7xl">
          {client.name.split(' ')[0]} <br />{' '}
          <span className="text-brand-primary font-extrabold">
            {client.name.split(' ').slice(1).join(' ')}
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-slate-300 md:text-xl">
          {client.tagline ||
            'Experience premium artisanal coffee and gourmet bites, crafted with uncompromising quality and passion.'}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#menu"
            className="bg-brand-primary flex w-full items-center justify-center gap-3 rounded-none px-8 py-4 text-center text-lg font-bold text-slate-950 transition-transform hover:brightness-110 active:scale-95 sm:w-auto"
          >
            Explore Menu <ArrowDown size={20} />
          </a>
          {client.heroSecondaryAction === 'whatsapp' ? (
            <a
              href={`https://wa.me/${client.waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 flex w-full items-center justify-center gap-3 rounded-none border bg-transparent px-8 py-4 text-center text-lg font-bold transition-transform active:scale-95 sm:w-auto"
            >
              Reservasi Meja
            </a>
          ) : client.heroSecondaryAction === 'cart' ? (
            <button className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 flex w-full items-center justify-center gap-3 rounded-none border bg-transparent px-8 py-4 text-center text-lg font-bold transition-transform active:scale-95 sm:w-auto">
              Pesan Online
            </button>
          ) : (
            <a
              href="#gallery"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 flex w-full items-center justify-center gap-3 rounded-none border bg-transparent px-8 py-4 text-center text-lg font-bold transition-transform active:scale-95 sm:w-auto"
            >
              Lihat Suasana
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-slate-500" />
      </div>
    </header>
  )
}
