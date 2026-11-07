import { ShoppingBag, Coffee } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ClassicHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useFnbDemo()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-slate-200/50 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20">
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex cursor-pointer items-center gap-3"
        >
          <div
            className={`from-brand-primary to-brand-dark flex h-10 w-10 transform items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-all group-hover:scale-105`}
          >
            <Coffee className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-slate-700">
            {client.name}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 sm:flex">
          <button
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            className={`hover:text-brand-primary transition-colors`}
          >
            Menu
          </button>
          <button
            onClick={() =>
              document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
            }
            className={`hover:text-brand-primary transition-colors`}
          >
            Ruangan
          </button>
          <button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className={`hover:text-brand-primary transition-colors`}
          >
            Kontak
          </button>

          <button
            onClick={() => setIsCartModalOpen(true)}
            className={`bg-brand-primary hover:bg-brand-hover flex items-center gap-2 rounded-full px-5 py-2.5 text-white shadow-md transition-all hover:shadow-lg active:scale-95`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Keranjang</span>
            {cartItemCount > 0 && (
              <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-900">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Header Cart Icon (Optional since we have dock, but good for completeness) */}
        <button
          onClick={() => setIsCartModalOpen(true)}
          className={`hover:text-brand-primary relative p-2 text-slate-700 transition-colors sm:hidden`}
        >
          <ShoppingBag className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          )}
        </button>
      </div>
    </header>
  )
}
