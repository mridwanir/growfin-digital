'use client';

import { BusinessDemo } from '@/lib/types';
import { ElectronicDarkHeader } from './ElectronicDarkHeader';
import { ElectronicDarkHero } from './ElectronicDarkHero';
import { ElectronicDarkProductGrid } from './ElectronicDarkProductGrid';
import { ElectronicDarkLookbook } from './ElectronicDarkLookbook';
import { ElectronicDarkReviews } from './ElectronicDarkReviews';
import { ElectronicDarkFooter } from './ElectronicDarkFooter';
import { ElectronicProductModal } from '../../universal/ElectronicProductModal';
import { ElectronicCartDrawer } from '../../universal/ElectronicCartDrawer';

export function ElectronicDarkLayout({ client }: { client: BusinessDemo }) {
  return (
    <div className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-black" style={{ '--theme-color': client.themeColor || '#06b6d4' } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="font-jakarta">
        <ElectronicDarkHeader />
        
        <main>
          <ElectronicDarkHero />
          <ElectronicDarkProductGrid />
          <ElectronicDarkLookbook />
          <ElectronicDarkReviews />
        </main>

        <ElectronicDarkFooter />

        {/* Existing modals and drawers should handle dark mode natively or we can just use the universal ones which are light mode for now. Ideally we should create dark variants of the modal/drawer too, but we will stick to universal for now or let them inherit dark mode if we styled them. Actually the universal modal is light. We'll use it for now. */}
        <ElectronicProductModal />
        <ElectronicCartDrawer />
      </div>
    </div>
  );
}
