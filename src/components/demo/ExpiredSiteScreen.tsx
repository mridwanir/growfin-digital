import { Store, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { siteConfig } from '@/lib/site-config'

interface ExpiredSiteScreenProps {
  businessName?: string
}

export function ExpiredSiteScreen({ businessName }: ExpiredSiteScreenProps) {
  const displayTitle = businessName || 'Bisnis Ini'
  const supportWa = siteConfig.contact.whatsappNumber

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0E] p-4 text-white selection:bg-[#00b894] selection:text-black">
      {/* Background radial glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(0, 184, 148, 0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#262633] bg-[#14141A] p-8 text-center shadow-2xl sm:p-10">
        {/* Icon Header */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00b894]/30 bg-[#00b894]/10 text-[#00b894] shadow-inner">
          <RefreshCw className="h-8 w-8 text-[#00b894]" />
        </div>

        {/* Business Title Badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-[#262633]/60 px-3 py-1 text-xs font-semibold text-gray-300">
          <Store className="h-3.5 w-3.5 text-[#00b894]" />
          <span>{displayTitle}</span>
        </div>

        <h1 className="mb-4 text-xl leading-snug font-black text-white sm:text-2xl">
          Masa Pembaruan Layanan
        </h1>

        {/* Polite Visitor Message */}
        <p className="mb-8 text-sm leading-relaxed text-slate-300">
          Website <strong className="font-extrabold text-white">{displayTitle}</strong> Sedang Dalam
          Masa Pembaruan Layanan. Jika Anda adalah pemilik bisnis ini, silakan masuk ke Dashboard
          Growfin untuk memperpanjang masa aktif.
        </p>

        {/* Action Button */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00b894] px-5 py-3.5 text-sm font-black text-black shadow-lg transition-all hover:bg-[#00e0b8] hover:shadow-emerald-500/20 active:scale-95"
          >
            <span>Masuk ke Dashboard Growfin</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href={`https://wa.me/${supportWa}?text=${encodeURIComponent(`Halo Growfin, saya ingin bertanya tentang perpanjangan website ${displayTitle}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#262633] bg-transparent px-4 py-2.5 text-xs font-bold text-gray-400 transition-all hover:bg-[#1C1C26] hover:text-white"
          >
            <span>Bantuan Layanan (WhatsApp)</span>
          </a>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-1.5 border-t border-[#262633] pt-6 text-[11px] text-[#8E8EA0]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#00b894]" />
          <span>Growfin Digital Platform UMKM</span>
        </div>
      </div>
    </div>
  )
}
