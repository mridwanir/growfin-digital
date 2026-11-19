'use client'

import { ShoppingBagIcon } from 'lucide-react'

import {
  formatCurrency,
  useCartItemCount,
  useCartTotal,
} from '@/lib/storefront/cart'

import { componentRenderCache } from './cache'

export interface MobileCartBarProps {
  onOpenCart: () => void
}

export function MobileCartBar(props: MobileCartBarProps) {
  const { onOpenCart } = props
  const itemCount = useCartItemCount()
  const total = useCartTotal()

  if (itemCount === 0) {
    return null
  }

  const barElement = (
    <div
      className="pointer-events-none fixed bottom-0 inset-x-0 z-40 p-4 md:hidden"
      data-slot="mobile-cart-bar"
    >
      <div className="pointer-events-auto mx-auto max-w-md">
        <button
          aria-label={`Buka keranjang belanja, ${itemCount} produk, total ${formatCurrency(total)}`}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-between rounded-2xl px-5 py-3.5 shadow-lg transition-all active:scale-[0.98]"
          data-slot="mobile-cart-open"
          type="button"
          onClick={onOpenCart}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <ShoppingBagIcon className="size-6" />
              <span className="bg-accent text-accent-foreground absolute -top-1.5 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold">
                {itemCount}
              </span>
            </div>
            <div className="text-left">
              <div className="text-xs opacity-90">{itemCount} produk</div>
              <div className="font-bold">{formatCurrency(total)}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            Lihat Keranjang
          </div>
        </button>
      </div>
    </div>
  )

  componentRenderCache.set(props, barElement)

  return barElement
}
