import { ShoppingBag } from 'lucide-react';
import { useCafeDemo } from './CafeDemoContext';

export function FloatingCart() {
  const { cartItemCount, cartTotal, isCartModalOpen, setIsCartModalOpen } = useCafeDemo();

  // Don't show if empty or if cart modal is already open
  if (cartItemCount === 0 || isCartModalOpen) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-8 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-500">
      <button
        onClick={() => setIsCartModalOpen(true)}
        className={`w-full max-w-sm flex items-center justify-between p-3 pl-4 rounded-2xl shadow-2xl pointer-events-auto transition-transform active:scale-95 bg-brand-primary hover:bg-brand-hover text-white`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
              {cartItemCount}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold opacity-80 leading-none">Total Pesanan</span>
            <span className="text-sm font-black">Rp {cartTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <span className="text-sm font-bold bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
          Checkout ➔
        </span>
      </button>
    </div>
  );
}
