import { Check } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface PricingMatrixProps {
  className?: string
  enterpriseConsultationUrl?: string
}

export function PricingMatrix({
  className,
  enterpriseConsultationUrl = 'https://wa.me/6281234567890?text=Halo%20MeracikWeb%2C%20saya%20tertarik%20konsultasi%20Paket%20Enterprise',
}: PricingMatrixProps) {
  return (
    <section
      aria-label="Harga Paket MeracikWeb"
      data-testid="pricing-section"
      id="harga"
      className={cn(
        'bg-background text-foreground relative flex min-h-screen w-full flex-col justify-center overflow-hidden py-10 lg:h-screen lg:max-h-screen lg:py-6',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 max-w-3xl text-center lg:mb-8">
          <Badge
            className="border-border text-foreground px-3 py-1 text-xs font-semibold"
            variant="outline"
          >
            Biaya Transparan
          </Badge>
          <h2 className="font-display text-foreground mt-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
            Pilih Paket Sesuai Skala Bisnis Anda
          </h2>
          <p className="mt-2 text-sm text-pretty text-zinc-700 sm:text-base dark:text-zinc-300">
            Semua paket ditagih per bulan tanpa biaya tersembunyi dan tanpa potongan komisi
            transaksi.
          </p>
        </div>

        {/* Three-Tier Pricing Grid */}
        <div
          className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch"
          data-ui="pricing-cards"
        >
          {/* 1. Gratis Tier */}
          <div
            className="border-border bg-card relative flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-colors motion-reduce:transition-none sm:p-8"
            data-testid="pricing-card-gratis"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground font-sans text-xl font-bold text-balance">Gratis</h3>
              </div>
              <p className="mt-2 min-h-[40px] text-sm text-pretty text-zinc-600 dark:text-zinc-400">
                Untuk UMKM pemula yang baru memulai katalog online tanpa risiko biaya.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className="text-foreground font-mono text-4xl font-bold tracking-tight tabular-nums"
                  data-testid="price-gratis"
                >
                  Rp 0
                </span>
                <span className="font-sans text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  /bulan
                </span>
              </div>

              <ul className="border-border/60 mt-6 space-y-3 border-t pt-6 text-sm" role="list">
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>
                    Subdomain{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      &lt;slug&gt;.growfin.my.id
                    </code>
                  </span>
                </li>
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Maksimal 30 produk katalog aktif</span>
                </li>
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Checkout pesanan WhatsApp standar</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-2">
              <Link
                className="border-border text-foreground hover:bg-muted/40 inline-flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg border px-5 text-sm font-semibold transition-colors"
                data-testid="cta-gratis"
                href="/register"
              >
                Mulai Gratis
              </Link>
            </div>
          </div>

          {/* 2. Pro Tier (Highlighted) */}
          <div
            className="border-primary bg-card relative flex flex-col justify-between rounded-2xl border-2 p-6 shadow-xl transition-all motion-reduce:transition-none sm:p-8 lg:-translate-y-2 lg:motion-reduce:translate-y-0"
            data-testid="pricing-card-pro"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge
                className="bg-primary text-primary-foreground border-primary px-3 py-1 font-semibold shadow-sm"
                data-testid="popular-badge"
              >
                Paling Populer
              </Badge>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground font-sans text-xl font-bold text-balance">Pro</h3>
              </div>
              <p className="mt-2 min-h-[40px] text-sm text-pretty text-zinc-600 dark:text-zinc-400">
                Untuk bisnis berkembang yang butuh domain mandiri dan katalog lengkap.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className="text-foreground font-mono text-4xl font-bold tracking-tight tabular-nums"
                  data-testid="price-pro"
                >
                  Rp 49.000
                </span>
                <span className="font-sans text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  /bulan
                </span>
              </div>

              <ul className="border-border/60 mt-6 space-y-3 border-t pt-6 text-sm" role="list">
                <li className="text-foreground flex items-start gap-3 leading-normal font-medium text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Ringkasan pesanan langsung</span>
                </li>
                <li className="text-foreground flex items-start gap-3 leading-normal font-medium text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Domain kustom</span>
                </li>
                <li className="text-foreground flex items-start gap-3 leading-normal font-medium text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Produk tak terbatas</span>
                </li>
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Analitik harian</span>
                </li>
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Dukungan prioritas WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-2">
              <Link
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg px-5 text-sm font-semibold shadow-xs transition-colors"
                data-testid="cta-pro"
                href="/register?tier=pro"
              >
                Pilih Paket Pro
              </Link>
            </div>
          </div>

          {/* 3. Enterprise Tier */}
          <div
            className="border-border bg-card relative flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-colors motion-reduce:transition-none sm:p-8"
            data-testid="pricing-card-enterprise"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground font-sans text-xl font-bold text-balance">
                  Enterprise
                </h3>
              </div>
              <p className="mt-2 min-h-[40px] text-sm text-pretty text-zinc-600 dark:text-zinc-400">
                Untuk jaringan multi-cabang dengan volume pesanan besar dan integrasi POS.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className="text-foreground font-mono text-3xl font-bold tracking-tight tabular-nums sm:text-4xl"
                  data-testid="price-enterprise"
                >
                  Harga Kustom
                </span>
                <span className="font-sans text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  /kebutuhan
                </span>
              </div>

              <ul className="border-border/60 mt-6 space-y-3 border-t pt-6 text-sm" role="list">
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Manajemen multi-cabang terpusat</span>
                </li>
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Sinkronisasi stok POS real-time</span>
                </li>
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Integrasi kustom WhatsApp Business API</span>
                </li>
                <li className="flex items-start gap-3 leading-normal text-pretty text-zinc-700 dark:text-zinc-300">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-2">
              <a
                className="border-border text-foreground hover:bg-muted/40 inline-flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg border px-5 text-sm font-semibold transition-colors"
                data-testid="cta-enterprise"
                href={enterpriseConsultationUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Konsultasi Enterprise
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
