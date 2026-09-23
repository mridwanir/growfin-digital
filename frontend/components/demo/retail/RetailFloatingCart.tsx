'use client';

import { useRetailDemo } from './RetailDemoContext';

export function RetailFloatingCart() {
  const { cartItemCount, cartTotal, isCartModalOpen, setIsCartModalOpen } = useRetailDemo();

  if (cartItemCount === 0 || isCartModalOpen) return null;

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
      <button 
        onClick={() => setIsCartModalOpen(true)}
        className="w-full bg-brand-primary text-white rounded-full p-4 flex items-center justify-between shadow-2xl hover:bg-brand-hover transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center border-2 border-brand-primary">
              {cartItemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-white/80 leading-none mb-1">Total Pesanan</p>
            <p className="font-black leading-none">{formatRupiah(cartTotal)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-bold text-sm bg-white/20 px-4 py-2 rounded-full">
          <span>Checkout</span>
          <span>➔</span>
        </div>
      </button>
    </div>
  );
}
