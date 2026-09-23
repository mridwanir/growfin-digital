import { useCafeDemo } from './CafeDemoContext';
import { ShoppingBag } from 'lucide-react';

export function CafeHeader() {
  const { client, cartItemCount, setIsCartModalOpen } = useCafeDemo();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md transform group-hover:scale-105 transition-all bg-gradient-to-br from-brand-primary to-brand-dark text-white`}>
            {client.iconEmoji || '☕'}
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
            {client.name}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-8 font-bold text-sm text-slate-600">
          <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className={`hover:text-brand-primary transition-colors`}>Menu</button>
          <button onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })} className={`hover:text-brand-primary transition-colors`}>Lokasi</button>
          
          <button 
            onClick={() => setIsCartModalOpen(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-white shadow-md hover:shadow-lg active:scale-95 bg-brand-primary hover:bg-brand-hover`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Keranjang</span>
            {cartItemCount > 0 && (
              <span className="bg-white text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-black ml-1">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Header Cart Icon (Optional since we have dock, but good for completeness) */}
        <button 
          onClick={() => setIsCartModalOpen(true)}
          className={`sm:hidden relative p-2 text-slate-700 hover:text-brand-primary transition-colors`}
        >
          <ShoppingBag className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

      </div>
    </header>
  );
}
