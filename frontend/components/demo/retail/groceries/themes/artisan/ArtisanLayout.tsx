'use client';

import { BusinessDemo } from '@/lib/types';
import { ArtisanHeader } from './ArtisanHeader';
import { ArtisanHero } from './ArtisanHero';
import { ArtisanLookbook } from './ArtisanLookbook';
import { ArtisanProductGrid } from './ArtisanProductGrid';
import { ArtisanReviews } from './ArtisanReviews';
import { ArtisanFooter } from './ArtisanFooter';
import { ArtisanProductModal } from './ArtisanProductModal';
import { ArtisanCartDrawer } from './ArtisanCartDrawer';

export function ArtisanLayout({ client }: { client: BusinessDemo }) {
  const themeColor = client.themeColor || '#2D4739';

  return (
    <div className="bg-[#FBF9F5] text-zinc-800 antialiased selection:bg-[#2D4739] selection:text-amber-100" style={{ '--theme-color': themeColor } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif-display { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <div className="font-jakarta">
        {/* TOP TICKER BAR */}
        <div className="bg-[#21352A] text-amber-100/90 text-xs py-2 px-4 border-b border-amber-900/30" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color) 80%, black)' }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="font-medium tracking-wide">Panen Subuh: Pengiriman kurir cold-storage langsung dari kebun jam {client.openTime || '08:00'} - {client.closeTime || '17:00'}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold tracking-wider text-amber-200">
              <span className="flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Slot Hari Ini Tersedia</span>
              <span>•</span>
              <span>Garansi Kesegaran 100%</span>
            </div>
          </div>
        </div>

        <ArtisanHeader />
        
        <main>
          <ArtisanHero />
          <ArtisanLookbook />
          <ArtisanProductGrid />
          <ArtisanReviews />
        </main>

        <ArtisanFooter />

        <ArtisanProductModal />
        <ArtisanCartDrawer />
      </div>
    </div>
  );
}
