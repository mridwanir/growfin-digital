import { ShoppingBag } from 'lucide-react'

import { useFnbDemo } from '../core/FnbDemoContext'

export function FloatingCart() {
  const { cartItemCount, cartTotal, isCartModalOpen, setIsCartModalOpen } = useFnbDemo()

  // Don't show if empty or if cart modal is already open
  if (cartItemCount === 0 || isCartModalOpen) return null

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in pointer-events-none fixed right-0 bottom-24 left-0 z-[60] flex justify-center px-4 duration-500 sm:bottom-8">
      <button
        onClick={() => setIsCartModalOpen(true)}
        className={`bg-brand-primary hover:bg-brand-hover pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-2xl p-3 pl-4 text-white shadow-2xl transition-transform active:scale-95`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-sm">
              {cartItemCount}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs leading-none font-bold opacity-80">Total Pesanan</span>
            <span className="text-sm font-black">Rp {cartTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <span className="rounded-xl bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-md">
          Checkout ➔
        </span>
      </button>
    </div>
  )
}
