'use client';

import { BusinessDemo } from '@/lib/types';
import { GroceriesHeader } from './GroceriesHeader';
import { GroceriesHero } from './GroceriesHero';
import { GroceriesProductGrid } from './GroceriesProductGrid';
import { GroceriesLookbook } from './GroceriesLookbook';
import { GroceriesReviews } from './GroceriesReviews';
import { GroceriesFooter } from './GroceriesFooter';
import { GroceriesProductModal } from '../../universal/GroceriesProductModal';
import { GroceriesCartDrawer } from '../../universal/GroceriesCartDrawer';
import { useGroceriesDemo } from '../../core/GroceriesContext';

export function DefaultLayout({ client }: { client: BusinessDemo }) {
  const { cartItemCount, cartTotal, setIsCartDrawerOpen } = useGroceriesDemo();
  
  // Custom Font
  const themeColor = client.themeColor || '#10b981';

  return (
    <div className="bg-zinc-50 text-zinc-900 antialiased selection:bg-emerald-500 selection:text-white pb-24 lg:pb-0" style={{ '--theme-color': themeColor } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <div className="font-jakarta">
        {/* Top Announcement */}
        <div className="bg-[var(--theme-color)] text-white text-xs font-semibold px-4 py-2 text-center tracking-wide flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7L45.25,130.49a8,8,0,0,0,2.22,11.89,8.23,8.23,0,0,0,3.17.65h0l57.73,21.64L93.71,238.1a8,8,0,0,0,13.69,7l108.9-120A8,8,0,0,0,215.79,118.17ZM120.35,214.9,132.89,152.2a8,8,0,0,0-5-9.17L70.16,121.39l75.46-81,1-5v1.27a8,8,0,0,0-1,.22L123.11,103.8a8,8,0,0,0,5,9.17l57.73,21.64Z"></path></svg>
          <span>FLASH SALE HARI INI: Gratis Ongkir Instan radius 5 km untuk pesanan minimal Rp 75.000!</span>
        </div>

        <GroceriesHeader />
        
        <main>
          <GroceriesHero />
          <GroceriesProductGrid />
          <GroceriesLookbook />
          <GroceriesReviews />
        </main>

        <GroceriesFooter />

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 flex items-center justify-between lg:hidden">
          <div>
            <span className="text-[11px] text-zinc-400 block font-medium">Total Pesanan:</span>
            <span className="font-bold text-[var(--theme-color)] text-sm">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cartTotal)}
            </span>
          </div>
          <button onClick={() => setIsCartDrawerOpen(true)} className="px-5 py-2.5 rounded-full bg-[var(--theme-color)] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
            <span>Buka Tas Belanja</span>
          </button>
        </div>

        <GroceriesProductModal />
        <GroceriesCartDrawer />
      </div>
    </div>
  );
}
