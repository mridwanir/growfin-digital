'use client';

import { BusinessDemo } from '@/lib/types';
import { EditorialNavbar } from './EditorialNavbar';
import { EditorialHero } from './EditorialHero';
import { EditorialLookbook } from './EditorialLookbook';
import { EditorialShop } from './EditorialShop';
import { EditorialTestimonial } from './EditorialTestimonial';
import { EditorialFooter } from './EditorialFooter';
import { ClothingCartModal } from '../../universal/ClothingCartModal';
import { ClothingQuickViewModal } from '../../universal/ClothingQuickViewModal';
import { ClothingFloatingCart } from '../../universal/ClothingFloatingCart';
import { ClothingFloatingDock } from '../../universal/ClothingFloatingDock';

export function EditorialLayout({ client }: { client: BusinessDemo }) {
  return (
    <div className="font-sans antialiased text-[#121212] bg-[#F5F5F5] min-h-screen relative selection:bg-[#8C907E] selection:text-white">
      
      {/* Styles for Marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-serif-custom { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 30s linear infinite;
        }
      `}} />

      <EditorialNavbar />
      <EditorialHero />
      <EditorialLookbook />
      <EditorialShop />
      <EditorialTestimonial />
      <EditorialFooter />
      
      <ClothingQuickViewModal />
      <ClothingCartModal />
      <ClothingFloatingCart />
      <ClothingFloatingDock />
    </div>
  );
}
