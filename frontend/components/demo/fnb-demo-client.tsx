'use client';

import { BusinessDemo } from '@/lib/types';
import { FnbDemoProvider } from './fnb/core/FnbDemoContext';
import { CafeRouter } from './fnb/cafe/CafeRouter';
import { RestaurantRouter } from './fnb/restaurant/RestaurantRouter';
import { FloatingCart } from './fnb/universal/FloatingCart';
import { MobileFloatingDock } from './fnb/universal/MobileFloatingDock';
import { ProductCustomizationModal } from './fnb/universal/ProductCustomizationModal';
import { CheckoutModal } from './fnb/universal/CheckoutModal';

export function FnbDemoClient({ client, themeVariant = 'fnb-cafe-default' }: { client: BusinessDemo, themeVariant?: string }) {
  // Map legacy theme variants to the new format
  let normalizedVariant = themeVariant;
  if (themeVariant === 'classic') normalizedVariant = 'fnb-cafe-default';
  if (themeVariant === 'alternatif') normalizedVariant = 'fnb-cafe-alternatif';
  if (themeVariant === 'premium-dark' || themeVariant === 'premium') normalizedVariant = 'fnb-restaurant-default';

  // themeVariant format: fnb-cafe-default, fnb-restaurant-premium, etc
  const parts = normalizedVariant.split('-');
  const category = parts[1] || 'cafe';
  const themeName = parts.slice(2).join('-') || 'default';

  return (
    <FnbDemoProvider client={client}>
      {category === 'cafe' && <CafeRouter themeName={themeName} />}
      {category === 'restaurant' && <RestaurantRouter themeName={themeName} />}
      
      {/* Universal Floating Elements & Modals */}
      <FloatingCart />
      <MobileFloatingDock />
      <ProductCustomizationModal />
      <CheckoutModal />
    </FnbDemoProvider>
  );
}
