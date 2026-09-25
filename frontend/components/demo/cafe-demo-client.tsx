'use client';

import { BusinessDemo } from '@/lib/types';
import { CafeDemoProvider, useCafeDemo } from './cafe/CafeDemoContext';
import { CafeHeader } from './cafe/CafeHeader';
import { CafeHeroScreen } from './cafe/CafeHeroScreen';
import { CafeGallery } from './cafe/CafeGallery';
import { CafeServiceList } from './cafe/CafeServiceList';
import { CafeSocialProof } from './cafe/CafeSocialProof';
import { CafeProfileScreen } from './cafe/CafeProfileScreen';
import { FloatingCart } from './cafe/FloatingCart';
import { MobileFloatingDock } from './cafe/MobileFloatingDock';
import { ProductCustomizationModal } from './cafe/ProductCustomizationModal';
import { CheckoutModal } from './cafe/CheckoutModal';

function CafeDemoContent() {
  

  return (
    <div className={`min-h-screen font-sans selection:bg-brand-primary/30 bg-stone-50 text-stone-800`}>
      <CafeHeader />
      
      <main>
        <CafeHeroScreen />
        <CafeGallery />
        <CafeSocialProof />
        <CafeServiceList />
      </main>

      <CafeProfileScreen />
      
      {/* Floating Elements & Modals */}
      <FloatingCart />
      <MobileFloatingDock />
      <ProductCustomizationModal />
      <CheckoutModal />
    </div>
  );
}

export function CafeDemoClient({ client }: { client: BusinessDemo }) {
  return (
    <CafeDemoProvider client={client}>
      <CafeDemoContent />
    </CafeDemoProvider>
  );
}
