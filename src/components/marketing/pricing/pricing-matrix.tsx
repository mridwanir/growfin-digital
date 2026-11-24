import { Check } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PricingMatrixProps {
  className?: string
  enterpriseConsultationUrl?: string
}

export function PricingMatrix({
  className,
  enterpriseConsultationUrl = 'https://wa.me/6289630352370?text=Halo%20MeracikWeb%2C%20saya%20tertarik%20konsultasi%20Paket%20Enterprise',
}: PricingMatrixProps) {
  return (
    <section
      aria-label="Harga Paket MeracikWeb"
      data-testid="pricing-section"
      id="harga"
      className={cn(
        'bg-background text-foreground relative flex min-h-screen w-full flex-col justify-center py-16 sm:py-20 lg:min-h-[900px] lg:py-24',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-3xl text-center lg:mb-16">
          <Badge
            className="border-border text-foreground px-3 py-1 text-xs font-semibold"
            variant="outline"
          >
            Biaya Transparan
          </Badge>
          <h2 className="font-display text-foreground mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Pilih paket sesuai skala bisnis Anda
          </h2>
          <p className="text-muted-foreground mt-4 text-base text-pretty sm:text-lg">
            Semua paket ditagih per bulan tanpa biaya tersembunyi dan tanpa potongan komisi
            transaksi.
          </p>
        </div>

        {/* Three-Tier Pricing Grid */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
          {/* 1. Gratis Tier */}
          <div
            className="border-border bg-card relative flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-colors motion-reduce:transition-none sm:p-8"
            data-testid="pricing-card-gratis"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-foreground text-xl font-bold text-balance">
                  Gratis
                </h3>
              </div>
              <p className="text-muted-foreground mt-2 min-h-[40px] text-sm text-pretty">
                Untuk UMKM pemula yang baru memulai katalog online tanpa risiko biaya.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className="text-foreground font-mono text-4xl font-bold tracking-tight tabular-nums"
                  data-testid="price-gratis"
                >
                  Rp 0
                </span>
                <span className="text-muted-foreground font-sans text-sm font-medium">/bulan</span>
              </div>

              <ul className="border-border/60 mt-8 space-y-3.5 border-t pt-8 text-sm" role="list">
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>
                    Subdomain{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      &lt;slug&gt;.growfin.my.id
                    </code>
                  </span>
                </li>
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Maksimal 30 produk katalog aktif</span>
                </li>
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Checkout pesanan WhatsApp standar</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'text-foreground min-h-[44px] w-full rounded-lg text-sm font-semibold',
                )}
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
                <h3 className="font-heading text-foreground text-xl font-bold text-balance">Pro</h3>
              </div>
              <p className="text-muted-foreground mt-2 min-h-[40px] text-sm text-pretty">
                Untuk bisnis berkembang yang butuh domain mandiri dan katalog lengkap.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className="text-foreground font-mono text-4xl font-bold tracking-tight tabular-nums"
                  data-testid="price-pro"
                >
                  Rp 49.000
                </span>
                <span className="text-muted-foreground font-sans text-sm font-medium">/bulan</span>
              </div>

              <ul className="border-border/60 mt-8 space-y-3.5 border-t pt-8 text-sm" role="list">
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
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Analitik harian</span>
                </li>
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Dukungan prioritas WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/register?tier=pro"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'default' }),
                  'min-h-[44px] w-full rounded-lg text-sm font-semibold shadow-sm',
                )}
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
                <h3 className="font-heading text-foreground text-xl font-bold text-balance">
                  Enterprise
                </h3>
              </div>
              <p className="text-muted-foreground mt-2 min-h-[40px] text-sm text-pretty">
                Untuk jaringan multi-cabang dengan volume pesanan besar dan integrasi POS.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className="text-foreground font-mono text-3xl font-bold tracking-tight tabular-nums sm:text-4xl"
                  data-testid="price-enterprise"
                >
                  Harga Kustom
                </span>
                <span className="text-muted-foreground font-sans text-sm font-medium">
                  /kebutuhan
                </span>
              </div>

              <ul className="border-border/60 mt-8 space-y-3.5 border-t pt-8 text-sm" role="list">
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Manajemen multi-cabang terpusat</span>
                </li>
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Sinkronisasi stok POS real-time</span>
                </li>
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Integrasi kustom WhatsApp Business API</span>
                </li>
                <li className="text-muted-foreground flex items-start gap-3 leading-normal text-pretty">
                  <Check aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <a
                href={enterpriseConsultationUrl}
                rel="noopener noreferrer"
                target="_blank"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'text-foreground min-h-[44px] w-full rounded-lg text-sm font-semibold',
                )}
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
