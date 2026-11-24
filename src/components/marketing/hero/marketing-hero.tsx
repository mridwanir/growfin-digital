'use client'

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Package,
  ShoppingBag,
  Sliders,
  Sparkles,
  Store,
  Wifi,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { MeracikWordmark } from '@/components/brand'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Formats numeric IDR string or integer into formatted Indonesian Rupiah currency.
 */
function formatRupiah(value: number | string): string {
  const numeric = typeof value === 'string' ? Number.parseInt(value.replace(/\D/g, ''), 10) : value
  if (Number.isNaN(numeric) || numeric === 0) {
    return 'Rp 0'
  }
  return `Rp ${numeric.toLocaleString('id-ID')}`
}

export interface MarketingHeroProps {
  className?: string
}

export function MarketingHero({ className }: MarketingHeroProps) {
  // Local state for interactive Storefront Editor simulation
  const [storeName, setStoreName] = useState('Kopi Senja Utama')
  const [productName, setProductName] = useState('Es Kopi Susu Aren')
  const [price, setPrice] = useState('18000')
  const [variantOption, setVariantOption] = useState('Ukuran Regular (350ml)')
  const categoryName = 'Minuman Kopi'
  const [mobileSimulatorTab, setMobileSimulatorTab] = useState<'admin' | 'buyer'>('admin')
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
              <a className="hover:text-foreground transition-colors" href="#editor-simulator">
                Simulator Editor
              </a>
              <a className="hover:text-foreground transition-colors" href="#fitur">
                Fitur
              </a>
              <a className="hover:text-foreground transition-colors" href="#harga">
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
                'h-11 px-6 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 sm:h-12 sm:px-8 sm:text-base',
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

        {/* Dual-Pane Application Frame Simulator */}
        <div
          className="border-border bg-card w-full max-w-5xl rounded-xl border shadow-2xl transition-all"
          data-testid="app-frame"
          id="editor-simulator"
        >
          {/* Frame Top Bar (macOS / App Window style) */}
          <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
              <span className="text-muted-foreground ml-2 hidden text-xs font-medium sm:inline">
                MeracikWeb Studio &mdash; Storefront Editor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className="bg-primary/10 text-primary border-primary/20 gap-1 text-[11px] font-medium"
                variant="outline"
              >
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span>Simulasi Real-time</span>
              </Badge>
            </div>
          </div>
          {/* Mobile Viewport Toggle Bar (<640px) */}
          <div
            aria-label="Mode Simulasi"
            className="border-border bg-muted/40 flex items-center justify-center border-b p-2 sm:hidden"
            role="tablist"
          >
            <div className="border-border bg-muted inline-flex rounded-lg border p-1">
              <button
                aria-selected={mobileSimulatorTab === 'admin'}
                role="tab"
                type="button"
                onClick={() => setMobileSimulatorTab('admin')}
                className={cn(
                  'focus-visible:ring-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-4 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden',
                  mobileSimulatorTab === 'admin'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Mode Admin
              </button>
              <button
                aria-selected={mobileSimulatorTab === 'buyer'}
                role="tab"
                type="button"
                onClick={() => setMobileSimulatorTab('buyer')}
                className={cn(
                  'focus-visible:ring-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-4 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden',
                  mobileSimulatorTab === 'buyer'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Mode Pembeli
              </button>
            </div>
          </div>

          {/* Dual-Pane Workspace */}
          <div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Left Pane: Storefront Editor Form Inputs */}
            <div
              data-testid="editor-pane"
              className={cn(
                'bg-card flex flex-col justify-between p-5 sm:p-6 lg:col-span-6',
                mobileSimulatorTab !== 'admin' && 'hidden sm:flex',
              )}
            >
              <div className="space-y-4">
                <div className="border-border/60 flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="text-primary size-4" />
                    <h3 className="text-foreground text-sm font-semibold">Editor Katalog Toko</h3>
                  </div>
                  <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    Tersimpan lokal
                  </span>
                </div>

                {/* Input: Store / Tenant Name */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-medium" htmlFor="store-name-input">
                    Nama Toko
                  </Label>
                  <div className="relative">
                    <Store className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                    <Input
                      className="pl-9 text-sm"
                      id="store-name-input"
                      placeholder="Contoh: Kopi Senja Utama"
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Input: Product Name */}
                <div className="space-y-1.5">
                  <Label
                    className="text-foreground text-xs font-medium"
                    htmlFor="product-name-input"
                  >
                    Nama Produk
                  </Label>
                  <div className="relative">
                    <Package className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                    <Input
                      className="pl-9 text-sm"
                      id="product-name-input"
                      placeholder="Contoh: Es Kopi Susu Aren"
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Input: Price */}
                <div className="space-y-1.5">
                  <Label
                    className="text-foreground text-xs font-medium"
                    htmlFor="product-price-input"
                  >
                    Harga (IDR)
                  </Label>
                  <div className="relative">
                    <span className="text-muted-foreground absolute top-2.5 left-3 font-mono text-xs font-semibold">
                      Rp
                    </span>
                    <Input
                      className="pl-9 font-mono text-sm tabular-nums"
                      id="product-price-input"
                      placeholder="18000"
                      type="number"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Input: Variant Option */}
                <div className="space-y-1.5">
                  <Label
                    className="text-foreground text-xs font-medium"
                    htmlFor="variant-option-input"
                  >
                    Varian Produk
                  </Label>
                  <Input
                    className="text-sm"
                    id="variant-option-input"
                    placeholder="Contoh: Ukuran Regular (350ml)"
                    value={variantOption}
                    onChange={e => setVariantOption(e.target.value)}
                  />
                </div>
              </div>

              {/* Informative hint footer */}
              <div className="border-border/80 bg-muted/30 text-muted-foreground mt-6 rounded-lg border p-3 text-xs">
                <p>
                  Ketik nama produk, harga, atau varian di atas untuk melihat sinkronisasi instan ke
                  tampilan website pembeli di panel kanan.
                </p>
              </div>
            </div>

            {/* Right Pane: Live Mobile Customer Storefront Preview */}
            <div
              data-testid="mobile-preview"
              className={cn(
                'bg-muted/20 flex items-center justify-center p-3 sm:p-6 lg:col-span-6',
                mobileSimulatorTab !== 'buyer' && 'hidden sm:flex',
              )}
            >
              {/* Phone Mockup Frame */}
              <div className="border-foreground/20 bg-background w-full max-w-[310px] rounded-[2rem] border-4 shadow-xl">
                {/* Mobile Device Status Bar */}
                <div className="border-border/40 text-muted-foreground flex items-center justify-between border-b px-5 py-2 text-[10px] font-medium">
                  <span>09:41</span>
                  <div className="bg-foreground/10 h-3 w-16 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Wifi className="size-3" />
                    <span>5G</span>
                  </div>
                </div>

                {/* Mobile Browser Bar */}
                <div className="border-border/50 bg-muted/40 text-muted-foreground flex items-center justify-between border-b px-3 py-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="truncate font-mono">
                      {storeName
                        ? `${storeName.toLowerCase().replace(/\s+/g, '-')}.meracik.id`
                        : 'toko.meracik.id'}
                    </span>
                  </div>
                  <ExternalLink className="text-muted-foreground size-2.5 shrink-0" />
                </div>

                {/* Mobile Storefront Body */}
                <div className="space-y-3 p-3.5">
                  {/* Storefront Header */}
                  <div className="border-border/60 flex items-center gap-2.5 border-b pb-2.5">
                    <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full text-xs font-bold">
                      {storeName ? storeName.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-foreground truncate text-xs font-bold"
                        data-testid="preview-store-name"
                      >
                        {storeName || 'Nama Toko'}
                      </h4>
                      <p className="text-muted-foreground flex items-center gap-1 text-[10px]">
                        <Clock className="size-2.5 text-emerald-600" />
                        <span>Buka • Pesan Cepat</span>
                      </p>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                    <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 font-medium">
                      {categoryName}
                    </span>
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                      Menu Populer
                    </span>
                  </div>

                  {/* Customer Product Card */}
                  <div className="border-border bg-card space-y-2 rounded-xl border p-3 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <h5
                          className="text-foreground line-clamp-2 text-xs leading-tight font-semibold"
                          data-testid="preview-product-name"
                        >
                          {productName || 'Nama Produk'}
                        </h5>
                        <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                          <span>Varian:</span>
                          <span
                            className="text-foreground bg-secondary rounded px-1.5 py-0.5 font-medium"
                            data-testid="preview-variant-option"
                          >
                            {variantOption || 'Standar'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <ShoppingBag className="size-5" />
                      </div>
                    </div>

                    <div className="border-border/40 flex items-center justify-between border-t pt-1">
                      <span
                        className="text-primary font-mono text-xs font-bold tabular-nums"
                        data-testid="preview-product-price"
                      >
                        {formatRupiah(price)}
                      </span>
                      <Button
                        className="h-6 gap-1 px-2.5 text-[10px] font-semibold"
                        size="sm"
                        variant="default"
                      >
                        <MessageCircle className="size-2.5" />
                        <span>Pesan</span>
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Storefront WhatsApp Order Bar */}
                  <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                      <MessageCircle className="size-3.5" />
                      <span>Order via WA</span>
                    </div>
                    <span className="text-foreground font-mono text-[10px] font-bold">
                      {formatRupiah(price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
