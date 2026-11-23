import { ArrowRight, RefreshCw, ShieldCheck, Store } from 'lucide-react'
import Link from 'next/link'

import { siteConfig } from '@/lib/site-config'

export interface ExpiredSiteScreenProps {
  businessName?: string
}

export function ExpiredSiteScreen({ businessName }: ExpiredSiteScreenProps) {
  const displayTitle = businessName || 'Bisnis Ini'
  const supportWa = siteConfig.contact.whatsappNumber

  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex min-h-screen flex-col items-center justify-center p-4">
      {/* Background radial glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--primary) 15%, transparent) 0%, transparent 60%)',
        }}
      />

      <div className="border-border bg-card relative z-10 w-full max-w-md rounded-3xl border p-8 text-center shadow-2xl sm:p-10">
        {/* Icon Header */}
        <div className="border-primary/30 bg-primary/10 text-primary mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border shadow-inner">
          <RefreshCw className="text-primary size-8" />
        </div>

        {/* Business Title Badge */}
        <div className="border-border/50 bg-muted/60 text-muted-foreground mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
          <Store className="text-primary size-3.5" />
          <span>{displayTitle}</span>
        </div>

        <h1 className="text-foreground mb-4 text-xl leading-snug font-black sm:text-2xl">
          Masa Pembaruan Layanan
        </h1>

        {/* Visitor Message */}
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Website <strong className="text-foreground font-extrabold">{displayTitle}</strong> sedang
          dalam masa pembaruan layanan. Jika Anda adalah pemilik bisnis ini, silakan masuk ke
          Dashboard Growfin untuk memperpanjang masa aktif.
        </p>

        {/* Action Button */}
        <div className="space-y-3">
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black shadow-lg transition-all active:scale-95"
            href="/dashboard"
          >
            <span>Masuk ke Dashboard Growfin</span>
            <ArrowRight className="size-4" />
          </Link>

          <a
            className="border-border text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center justify-center gap-2 rounded-xl border bg-transparent px-4 py-2.5 text-xs font-bold transition-all"
            href={`https://wa.me/${supportWa}?text=${encodeURIComponent(`Halo Growfin, saya ingin bertanya tentang perpanjangan website ${displayTitle}`)}`}
            rel="noreferrer"
            target="_blank"
          >
            <span>Bantuan Layanan (WhatsApp)</span>
          </a>
        </div>

        {/* Footer info */}
        <div className="border-border text-muted-foreground mt-8 flex items-center justify-center gap-1.5 border-t pt-6 text-[11px]">
          <ShieldCheck className="text-primary size-3.5" />
          <span>Growfin Digital Platform UMKM</span>
        </div>
      </div>
    </div>
  )
}
