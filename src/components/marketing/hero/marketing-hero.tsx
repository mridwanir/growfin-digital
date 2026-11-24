import { ArrowRight, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { MeracikWordmark } from '@/components/brand'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { HeroEditorSimulator } from './hero-editor-simulator'

export interface MarketingHeroProps {
  className?: string
}

export function MarketingHero({ className }: MarketingHeroProps) {
  return (
    <section
      aria-label="Marketing Hero"
      data-testid="marketing-hero"
      className={cn(
        'bg-background text-foreground relative flex min-h-screen flex-col justify-between overflow-hidden',
        className,
      )}
    >
      {/* Brand Header Navigation */}
      <header className="border-border/40 bg-background/85 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link aria-label="Beranda MeracikWeb" className="flex items-center gap-2" href="/">
              <MeracikWordmark size="md" />
            </Link>
            <nav
              aria-label="Navigasi Utama"
              className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex"
            >
              <a
                className="hover:text-foreground transition-colors motion-reduce:transition-none"
                href="#editor-simulator"
              >
                Simulator Editor
              </a>
              <a
                className="hover:text-foreground transition-colors motion-reduce:transition-none"
                href="#archetypes"
              >
                Model Bisnis
              </a>
              <a
                className="hover:text-foreground transition-colors motion-reduce:transition-none"
                href="#order-flow"
              >
                Alur Pesanan
              </a>
              <a
                className="hover:text-foreground transition-colors motion-reduce:transition-none"
                href="#harga"
              >
                Harga
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'ghost' }),
                'text-sm font-medium',
              )}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'default' }),
                'text-sm font-semibold',
              )}
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Content & Dual-Pane Simulator */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Top Text & Headline */}
        <div className="mb-8 max-w-3xl text-center md:mb-10">
          <div className="border-primary/20 bg-primary/5 text-primary mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" />
            <span>Storefront Instan untuk UMKM Indonesia</span>
          </div>

          <h1 className="font-display text-foreground text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:leading-[1.12]">
            Bikin Website Toko Online Sekejap, Langsung Jual Hari Ini
          </h1>

          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl font-sans text-base sm:text-lg">
            Atur produk, harga, dan varian secara instan. Pelanggan memesan lewat website storefront
            modern dan pesanan terhubung langsung ke WhatsApp tanpa potongan komisi.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'default' }),
                'h-11 px-6 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 motion-reduce:transition-none sm:h-12 sm:px-8 sm:text-base',
              )}
            >
              <span>Mulai Toko Gratis</span>
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <a
              href="#editor-simulator"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base',
              )}
            >
              Lihat Simulator
            </a>
          </div>

          {/* Micro Trust Indicators */}
          <div className="text-muted-foreground mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Check className="text-primary size-4" />
              <span>0% Biaya Transaksi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="text-primary size-4" />
              <span>Checkout Langsung WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="text-primary size-4" />
              <span>Tanpa Kartu Kredit</span>
            </div>
          </div>
        </div>

        {/* Dual-Pane Application Frame Simulator Island */}
        <HeroEditorSimulator />
      </div>
    </section>
  )
}
