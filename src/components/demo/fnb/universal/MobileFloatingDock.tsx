import { Menu, MapPin, ShoppingBag } from 'lucide-react'

import { useFnbDemo } from '../core/FnbDemoContext'

export function MobileFloatingDock() {
  const { cartItemCount, setIsCartModalOpen } = useFnbDemo()

  return (
    <div className="pb-safe fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200/50 bg-white/80 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        <button
          onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          className={`hover:text-brand-primary flex w-16 flex-col items-center justify-center rounded-2xl py-2 text-slate-500 transition-colors hover:bg-slate-50`}
        >
          <Menu className="mb-1 h-5 w-5" />
          <span className="text-[10px] font-bold">Menu</span>
        </button>

        <button
          onClick={() => setIsCartModalOpen(true)}
          className={`hover:text-brand-primary relative flex w-16 flex-col items-center justify-center rounded-2xl py-2 text-slate-500 transition-colors hover:bg-slate-50`}
        >
          <div className="relative">
            <ShoppingBag className="mb-1 h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Pesanan</span>
        </button>

        <button
          onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })}
          className={`hover:text-brand-primary flex w-16 flex-col items-center justify-center rounded-2xl py-2 text-slate-500 transition-colors hover:bg-slate-50`}
        >
          <MapPin className="mb-1 h-5 w-5" />
          <span className="text-[10px] font-bold">Lokasi</span>
        </button>
      </div>
    </div>
  )
}
