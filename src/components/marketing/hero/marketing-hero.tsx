import { ArrowRight, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { MeracikWordmark } from '@/components/brand'
import { cn } from '@/lib/utils'

import { HeroEditorSimulator } from './hero-editor-simulator'

export interface MarketingHeaderProps {
  className?: string
}

export function MarketingHeader({ className }: MarketingHeaderProps) {
  return (
    <header
      className={cn(
        'border-border/40 bg-background/85 sticky top-0 z-50 w-full border-b backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            aria-label="Beranda MeracikWeb"
            className="focus-visible:ring-primary focus-visible:ring-offset-background inline-flex min-h-[44px] min-w-[44px] items-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2"
            href="/"
          >
            <MeracikWordmark size="md" />
          </Link>
          <nav
            aria-label="Navigasi Utama"
            className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-400"
          >
            <a
              className="hover:text-foreground inline-flex min-h-[44px] items-center px-1 transition-colors motion-reduce:transition-none"
              href="#editor-simulator"
            >
              Simulator Editor
            </a>
            <a
              className="hover:text-foreground inline-flex min-h-[44px] items-center px-1 transition-colors motion-reduce:transition-none"
              href="#archetypes"
            >
              Model Bisnis
            </a>
            <a
              className="hover:text-foreground inline-flex min-h-[44px] items-center px-1 transition-colors motion-reduce:transition-none"
              href="#order-flow"
            >
              Alur Pesanan
            </a>
            <a
              className="hover:text-foreground inline-flex min-h-[44px] items-center px-1 transition-colors motion-reduce:transition-none"
              href="#harga"
            >
              Harga
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            className="border-border text-foreground hover:bg-muted/40 inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors"
            href="/login"
          >
            Masuk
          </Link>
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors"
            href="/register"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  )
}

export interface MarketingHeroProps {
  className?: string
  showHeader?: boolean
}

export function MarketingHero({ className, showHeader = false }: MarketingHeroProps) {
  return (
    <>
      {showHeader && <MarketingHeader />}
      <section
        aria-label="Marketing Hero"
        data-testid="marketing-hero"
        className={cn(
          'bg-background text-foreground relative flex min-h-screen flex-col justify-center overflow-hidden py-3 lg:h-[calc(100svh-4rem)] lg:max-h-[calc(100svh-4rem)] lg:py-2',
          className,
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
          {/* Top Text & Headline */}
          <div className="mb-2 max-w-3xl text-center md:mb-3">
            <div className="border-primary/20 bg-primary/5 text-primary mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" />
              <span>Storefront Instan untuk UMKM Indonesia</span>
            </div>

            <h1 className="font-display text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Platform Toko Online UMKM Indonesia
            </h1>

            <p className="mx-auto mt-2 max-w-2xl font-sans text-sm text-zinc-700 sm:text-base dark:text-zinc-300">
              Atur produk, harga, dan varian secara instan. Pelanggan memesan lewat website
              storefront modern dan pesanan terhubung langsung ke WhatsApp tanpa potongan komisi.
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 min-h-[44px] items-center justify-center rounded-lg px-6 text-sm font-semibold shadow-xs transition-colors"
                href="/register"
              >
                <span>Mulai Toko Gratis</span>
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <a
                className="border-border bg-background text-foreground hover:bg-muted/40 inline-flex h-11 min-h-[44px] items-center justify-center rounded-lg border px-6 text-sm font-semibold transition-colors"
                href="#editor-simulator"
              >
                Lihat Simulator
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
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
    </>
  )
}
