import Link from 'next/link'

import { cn } from '@/lib/utils'

export interface MeracikWatermarkProps {
  className?: string
  href?: string
}

export function MeracikWatermark({
  className,
  href = 'https://meracik.web.id',
}: MeracikWatermarkProps = {}) {
  return (
    <aside
      aria-label="Watermark MeracikWeb"
      className={cn('pointer-events-auto fixed bottom-4 left-1/2 z-45 -translate-x-1/2', className)}
    >
      <Link
        aria-label="Website UMKM oleh MeracikWeb — Buat Web Gratis"
        className="group border-border/80 bg-card/90 text-card-foreground hover:border-primary/50 hover:bg-card focus-visible:ring-ring flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:outline-hidden active:scale-95"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span
          aria-hidden="true"
          className="text-sm leading-none font-extrabold text-amber-500 drop-shadow select-none"
        >
          ⚡
        </span>
        <span className="text-muted-foreground">
          Website UMKM oleh{' '}
          <strong className="text-card-foreground group-hover:text-primary font-bold transition-colors">
            <span>Meracik</span>
            <span className="text-primary italic">Web</span>
          </strong>
        </span>
        <span aria-hidden="true" className="text-muted-foreground font-bold select-none">
          —
        </span>
        <span className="text-primary decoration-primary/40 group-hover:text-primary/90 font-bold underline underline-offset-2">
          Buat Web Gratis
        </span>
      </Link>
    </aside>
  )
}

export const GrowfinWatermark = MeracikWatermark
