import { ArrowRight, CheckCircle2, Landmark, QrCode, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { MeracikWordmark } from '@/components/brand'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const REGISTRATION_URL = '/register'
const LOGIN_URL = '/login'
const CONSULTATION_URL =
  'https://wa.me/6281234567890?text=Halo%20MeracikWeb%2C%20saya%20tertarik%20konsultasi%20layanan'

export interface MarketingFooterProps {
  className?: string
}

export function MarketingFooter({ className }: MarketingFooterProps) {
  return (
    <footer
      aria-label="Mulai Toko Gratis dan Informasi Platform MeracikWeb"
      data-testid="marketing-footer"
      id="mulai"
      style={{ '--h': 1 } as React.CSSProperties}
      className={cn(
        'closing border-border bg-background relative flex min-h-screen w-full flex-col justify-between overflow-hidden border-t py-6 lg:h-screen lg:max-h-screen lg:py-2.5',
        className,
      )}
    >
      {/* Screen 5: Closing Conversion Trigger Block */}
      <div
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        data-testid="closing-cta-section"
      >
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            className="border-primary/30 text-primary bg-primary/5 mb-3 px-3 py-1 text-xs font-semibold"
            variant="outline"
          >
            Langkah Penutup
          </Badge>
          <h2 className="font-display text-foreground text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
            Buka Katalog Online dan Mulai Terima Pesanan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-700 sm:text-base dark:text-zinc-300">
            Daftar gratis tanpa biaya pendaftaran. Pesanan pelanggan masuk langsung ke nomor
            WhatsApp bisnis Anda tanpa potongan komisi per transaksi.
          </p>

          {/* Primary Action Button */}
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary focus-visible:ring-offset-background inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg px-8 text-sm font-semibold shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
              href={REGISTRATION_URL}
            >
              <span>Mulai Toko Gratis</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid w-full max-w-4xl grid-cols-1 items-center gap-4 md:grid-cols-12">
          {/* Photo card */}
          <div
            className="border-border bg-muted relative h-32 w-full overflow-hidden rounded-xl border shadow-xs sm:h-36 md:col-span-4"
            data-ui="closing-visual"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Authentic lifestyle photography of Indonesian merchant owner */}
            <img
              alt="Pengusaha UMKM Indonesia menjalankan toko online secara mandiri"
              className="size-full object-cover transition-transform hover:scale-102"
              src="/images/marketing/merchant-owner.jpg"
            />
            <div className="absolute bottom-2.5 left-2.5">
              <Badge className="bg-background/90 text-foreground border-border/80 text-[10px] font-medium backdrop-blur-xs">
                Kisah Sukses UMKM
              </Badge>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:col-span-8">
            {/* QRIS Trust Badge */}
            <div
              className="border-border bg-card flex flex-col gap-1.5 rounded-xl border p-3.5 shadow-2xs"
              data-testid="trust-badge-qris"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                  <QrCode aria-hidden="true" className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground font-sans text-xs font-bold">QRIS</h3>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    Semua E-Wallet
                  </span>
                </div>
              </div>
              <p className="mt-0.5 text-xs text-pretty text-zinc-700 dark:text-zinc-300">
                GoPay, OVO, Dana, ShopeePay, dan seluruh m-banking.
              </p>
            </div>

            {/* Bank Transfer Trust Badge */}
            <div
              className="border-border bg-card flex flex-col gap-1.5 rounded-xl border p-3.5 shadow-2xs"
              data-testid="trust-badge-bank"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                  <Landmark aria-hidden="true" className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground font-sans text-xs font-bold">Transfer Bank</h3>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    Bank Nasional
                  </span>
                </div>
              </div>
              <p className="mt-0.5 text-xs text-pretty text-zinc-700 dark:text-zinc-300">
                BCA, Bank Mandiri, BNI, BRI, dan Bank Permata.
              </p>
            </div>

            {/* Zero Commission Reassurance Badge */}
            <div
              className="border-border bg-card flex flex-col gap-1.5 rounded-xl border p-3.5 shadow-2xs"
              data-testid="trust-badge-commission"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground font-sans text-xs font-bold">0% Komisi</h3>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    Penjualan Utuh
                  </span>
                </div>
              </div>
              <p className="mt-0.5 text-xs text-pretty text-zinc-700 dark:text-zinc-300">
                100% nominal pembayaran langsung ke rekening Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Footer Sub-block */}
      <div
        className="border-border/60 bg-muted/20 w-full border-t pt-3 pb-2"
        data-testid="platform-footer"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="flex flex-col gap-2.5 lg:col-span-2">
              <Link
                aria-label="Beranda MeracikWeb"
                className="focus-visible:ring-primary focus-visible:ring-offset-background inline-flex min-h-[44px] items-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2"
                href="/"
              >
                <MeracikWordmark size="md" />
              </Link>
              <p className="max-w-sm text-xs text-pretty text-zinc-600 dark:text-zinc-400">
                Platform digitalisasi katalog produk dan penerimaan pesanan WhatsApp untuk UMKM
                Indonesia.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 aria-hidden="true" className="text-primary size-3.5" />
                <span className="text-foreground text-xs font-medium">
                  Platform SaaS UMKM Indonesia
                </span>
              </div>
            </div>

            {/* Navigation Anchors Column */}
            <div className="flex flex-col gap-1.5">
              <h4 className="text-foreground text-xs font-semibold">Navigasi</h4>
              <nav aria-label="Navigasi Halaman" className="flex flex-col">
                <a
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href="#editor-simulator"
                >
                  Simulator Editor
                </a>
                <a
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href="#archetypes"
                >
                  Model Bisnis
                </a>
                <a
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href="#order-flow"
                >
                  Alur Pesanan
                </a>
                <a
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href="#harga"
                >
                  Harga Paket
                </a>
              </nav>
            </div>

            {/* Account & Consultation Column */}
            <div className="flex flex-col gap-1.5">
              <h4 className="text-foreground text-xs font-semibold">Layanan</h4>
              <nav aria-label="Layanan Pengguna" className="flex flex-col">
                <Link
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href={LOGIN_URL}
                >
                  Masuk ke Dashboard
                </Link>
                <Link
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href={REGISTRATION_URL}
                >
                  Mulai Toko Gratis
                </Link>
                <a
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href={CONSULTATION_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Konsultasi WhatsApp
                </a>
              </nav>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-1.5">
              <h4 className="text-foreground text-xs font-semibold">Legalitas</h4>
              <nav aria-label="Tautan Hukum" className="flex flex-col">
                <Link
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href="/privacy"
                >
                  Kebijakan Privasi
                </Link>
                <Link
                  className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-xs text-zinc-600 transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none dark:text-zinc-400"
                  href="/terms"
                >
                  Syarat & Ketentuan
                </Link>
              </nav>
            </div>
          </div>

          {/* Copyright Sub-footer */}
          <div className="border-border/60 flex flex-col items-center justify-between gap-2 border-t pt-3 text-[11px] text-zinc-600 sm:flex-row dark:text-zinc-400">
            <p>&copy; 2026 MeracikWeb. Semua hak cipta dilindungi.</p>
            <p>Dibuat untuk pertumbuhan UMKM kuliner dan ritel di Indonesia.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
