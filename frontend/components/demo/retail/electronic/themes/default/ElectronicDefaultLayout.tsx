'use client';

import { BusinessDemo } from '@/lib/types';
import { ElectronicHeader } from './ElectronicHeader';
import { ElectronicHero } from './ElectronicHero';
import { ElectronicProductGrid } from './ElectronicProductGrid';
import { ElectronicLookbook } from './ElectronicLookbook';
import { ElectronicReviews } from './ElectronicReviews';
import { ElectronicFooter } from './ElectronicFooter';
import { ElectronicProductModal } from '../../universal/ElectronicProductModal';
import { ElectronicCartDrawer } from '../../universal/ElectronicCartDrawer';

export function ElectronicDefaultLayout({ client }: { client: BusinessDemo }) {
  return (
    <div className="bg-[#FAFAFA] text-zinc-800 antialiased selection:bg-zinc-900 selection:text-white" style={{ '--theme-color': client.themeColor || '#09090b' } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="font-jakarta">
        {/* TOP NOTICE BAR */}
        <div className="bg-zinc-900 text-zinc-300 text-xs py-2 px-4 text-center font-medium tracking-wide">
          Gratis Ongkir Seluruh Indonesia & Asuransi Penuh Pengiriman untuk Pembelian Hari Ini.
        </div>

        <ElectronicHeader />
        
        <main>
          <ElectronicHero />
          <ElectronicProductGrid />
          <ElectronicLookbook />
          <ElectronicReviews />
        </main>

        <ElectronicFooter />

        <ElectronicProductModal />
        <ElectronicCartDrawer />
      </div>
    </div>
  );
}
