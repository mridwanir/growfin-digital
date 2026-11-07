'use client'

import { useRetailDemo } from '../core/RetailDemoContext'

export function RetailFloatingCart() {
  const { cartItemCount, cartTotal, isCartModalOpen, setIsCartModalOpen } = useRetailDemo()

  if (cartItemCount === 0 || isCartModalOpen) return null

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  return (
    <div className="fixed bottom-24 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 sm:bottom-6">
      <button
        onClick={() => setIsCartModalOpen(true)}
        className="bg-brand-primary hover:bg-brand-hover flex w-full items-center justify-between rounded-full p-4 text-white shadow-2xl transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="border-brand-primary absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-rose-500 text-xs font-black text-white">
              {cartItemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="mb-1 text-xs leading-none font-medium text-white/80">Total Pesanan</p>
            <p className="leading-none font-black">{formatRupiah(cartTotal)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
          <span>Checkout</span>
          <span>➔</span>
        </div>
      </button>
    </div>
  )
}
