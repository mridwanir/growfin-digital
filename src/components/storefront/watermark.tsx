import Link from 'next/link'

export function GrowfinWatermark() {
  return (
    <aside
      aria-label="Watermark Growfin Digital"
      className="pointer-events-auto fixed bottom-4 left-1/2 z-45 -translate-x-1/2"
    >
      <Link
        className="group border-border/80 bg-card/90 text-card-foreground hover:border-primary/50 hover:bg-card flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
        href="https://growfin.my.id"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="text-sm leading-none font-extrabold text-amber-400 drop-shadow">⚡</span>
        <span className="text-muted-foreground">
          Website UMKM oleh{' '}
          <strong className="text-card-foreground group-hover:text-primary font-bold transition-colors">
            Growfin Digital
          </strong>
        </span>
        <span className="text-muted-foreground font-bold">—</span>
        <span className="text-primary decoration-primary/40 group-hover:text-primary/90 font-bold underline underline-offset-2">
          Buat Web Gratis
        </span>
      </Link>
    </aside>
  )
}
