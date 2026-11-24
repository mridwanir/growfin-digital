import { ArrowRight, CheckCircle2, Landmark, QrCode, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { MeracikWordmark } from '@/components/brand'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface MarketingFooterProps {
  className?: string
  registrationUrl?: string
  loginUrl?: string
  consultationUrl?: string
}

export function MarketingFooter({
  className,
  registrationUrl = '/register',
  loginUrl = '/login',
  consultationUrl = 'https://wa.me/6289630352370?text=Halo%20MeracikWeb%2C%20saya%20tertarik%20konsultasi%20layanan',
}: MarketingFooterProps) {
  return (
    <div className={cn('w-full', className)} data-testid="marketing-footer">
      {/* Screen 5: Closing Conversion Trigger Block */}
      <section
        aria-label="Mulai Toko Gratis"
        className="border-border bg-card/60 relative w-full border-t py-16 sm:py-20 lg:py-24"
        data-testid="closing-cta-section"
        id="mulai"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              className="border-primary/30 text-primary bg-primary/5 mb-4 px-3 py-1 text-xs font-semibold"
              variant="outline"
            >
              Langkah Penutup
            </Badge>
            <h2 className="font-display text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Buka katalog online Anda dan mulai terima pesanan WhatsApp
            </h2>
            <p className="text-muted-foreground mt-4 text-base text-pretty sm:text-lg">
              Daftar gratis tanpa biaya pendaftaran. Pesanan pelanggan masuk langsung ke nomor
              WhatsApp bisnis Anda tanpa potongan komisi per transaksi.
            </p>

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={registrationUrl}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'focus-visible:ring-ring min-h-[44px] min-w-[44px] gap-2 px-8 text-base font-semibold shadow-md focus-visible:ring-2 focus-visible:outline-hidden',
                )}
              >
                <span>Mulai Toko Gratis</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>

          {/* Payment Reassurance and Trust Badges */}
          <div className="mt-14 w-full max-w-4xl">
            <p className="text-muted-foreground text-center text-xs font-semibold tracking-wider uppercase">
              Mendukung metode pembayaran langsung terpercaya
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* QRIS Trust Badge */}
              <div
                className="border-border bg-card flex flex-col gap-2 rounded-xl border p-4 shadow-2xs"
                data-testid="trust-badge-qris"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <QrCode aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">QRIS</h3>
                    <span className="text-muted-foreground text-xs">Semua E-Wallet</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 text-xs text-pretty">
                  Terima pembayaran dari GoPay, OVO, Dana, ShopeePay, dan seluruh aplikasi
                  m-banking.
                </p>
              </div>

              {/* Bank Transfer Trust Badge */}
              <div
                className="border-border bg-card flex flex-col gap-2 rounded-xl border p-4 shadow-2xs"
                data-testid="trust-badge-bank"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <Landmark aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">Transfer Bank</h3>
                    <span className="text-muted-foreground text-xs">Bank Nasional</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 text-xs text-pretty">
                  Mendukung transfer rekening BCA, Bank Mandiri, BNI, BRI, dan Permata.
                </p>
              </div>

              {/* Zero Commission Reassurance Badge */}
              <div
                className="border-border bg-card flex flex-col gap-2 rounded-xl border p-4 shadow-2xs sm:col-span-2 lg:col-span-1"
                data-testid="trust-badge-commission"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <ShieldCheck aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">0% Potongan Komisi</h3>
                    <span className="text-muted-foreground text-xs">Penjualan Utuh</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 text-xs text-pretty">
                  Seluruh pembayaran pesanan ditransfer langsung ke rekening atau e-wallet milik
                  Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Footer */}
      <footer
        aria-label="Informasi Platform MeracikWeb"
        className="border-border bg-background w-full border-t py-12 sm:py-16"
        data-testid="platform-footer"
        role="contentinfo"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Link
                aria-label="Beranda MeracikWeb"
                className="focus-visible:ring-ring inline-flex min-h-[44px] items-center gap-2 focus-visible:ring-2 focus-visible:outline-hidden"
                href="/"
              >
                <MeracikWordmark size="md" />
              </Link>
              <p className="text-muted-foreground max-w-sm text-sm text-pretty">
                Platform digitalisasi katalog produk dan penerimaan pesanan WhatsApp untuk UMKM
                Indonesia.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 text-emerald-600 dark:text-emerald-500"
                />
                <span className="text-foreground font-medium">Platform SaaS UMKM Indonesia</span>
              </div>
            </div>

            {/* Navigation Anchors Column */}
            <div className="flex flex-col gap-2">
              <h4 className="text-foreground text-sm font-semibold">Navigasi</h4>
              <nav aria-label="Navigasi Halaman" className="flex flex-col">
                <a
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href="#editor-simulator"
                >
                  Simulator Editor
                </a>
                <a
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href="#archetypes"
                >
                  Model Bisnis
                </a>
                <a
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href="#pesanan-whatsapp"
                >
                  Pesanan WhatsApp
                </a>
                <a
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href="#harga"
                >
                  Harga Paket
                </a>
              </nav>
            </div>

            {/* Account & Consultation Column */}
            <div className="flex flex-col gap-2">
              <h4 className="text-foreground text-sm font-semibold">Layanan</h4>
              <nav aria-label="Layanan Pengguna" className="flex flex-col">
                <Link
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href={loginUrl}
                >
                  Masuk ke Dashboard
                </Link>
                <Link
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href={registrationUrl}
                >
                  Mulai Toko Gratis
                </Link>
                <a
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href={consultationUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Konsultasi WhatsApp
                </a>
              </nav>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-2">
              <h4 className="text-foreground text-sm font-semibold">Legalitas</h4>
              <nav aria-label="Tautan Hukum" className="flex flex-col">
                <Link
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href="/privacy"
                >
                  Kebijakan Privasi
                </Link>
                <Link
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-[44px] items-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  href="/terms"
                >
                  Syarat & Ketentuan
                </Link>
              </nav>
            </div>
          </div>

          {/* Copyright Sub-footer */}
          <div className="border-border/60 text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row">
            <p>&copy; 2026 MeracikWeb. Semua hak cipta dilindungi.</p>
            <p>Dibuat untuk pertumbuhan UMKM kuliner dan ritel di Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
