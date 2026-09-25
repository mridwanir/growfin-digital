import { useCafeDemo } from './CafeDemoContext';
import { Menu, MapPin, ShoppingBag } from 'lucide-react';

export function MobileFloatingDock() {
  const { cartItemCount, setIsCartModalOpen } = useCafeDemo();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around px-2 py-2">
        <button
          onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          className={`flex flex-col items-center justify-center w-16 py-2 rounded-2xl transition-colors hover:bg-slate-50 text-slate-500 hover:text-brand-primary`}
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">Menu</span>
        </button>

        <button
          onClick={() => setIsCartModalOpen(true)}
          className={`relative flex flex-col items-center justify-center w-16 py-2 rounded-2xl transition-colors hover:bg-slate-50 text-slate-500 hover:text-brand-primary`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-1" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Pesanan</span>
        </button>

        <button
          onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })}
          className={`flex flex-col items-center justify-center w-16 py-2 rounded-2xl transition-colors hover:bg-slate-50 text-slate-500 hover:text-brand-primary`}
        >
          <MapPin className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">Lokasi</span>
        </button>
      </div>
    </div>
  );
}
