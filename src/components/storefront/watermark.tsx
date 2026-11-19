'use client'

import Link from 'next/link'

export function GrowfinWatermark() {
  return (
    <aside
      aria-label="Watermark Growfin Digital"
      className="pointer-events-auto fixed bottom-4 left-1/2 z-[45] -translate-x-1/2"
    >
      <Link
        href="https://growfin.my.id"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-[#14141A]/90 px-4 py-2 text-xs font-medium whitespace-nowrap text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[#00b894]/50 hover:bg-[#14141A] active:scale-95"
      >
        <span className="text-sm leading-none font-extrabold text-amber-400 drop-shadow">⚡</span>
        <span className="text-slate-200">
          Website UMKM oleh{' '}
          <strong className="font-bold text-white transition-colors group-hover:text-[#00e0b8]">
            Growfin Digital
          </strong>
        </span>
        <span className="font-bold text-slate-500">—</span>
        <span className="font-bold text-[#00e0b8] underline decoration-[#00e0b8]/40 underline-offset-2 group-hover:text-[#00b894]">
          Buat Web Gratis
        </span>
      </Link>
    </aside>
  )
}
