'use client';

import { BusinessDemo } from '@/lib/types';
import { FnbDemoProvider } from './fnb/core/FnbDemoContext';
import { ClassicLayout } from './fnb/themes/classic/ClassicLayout';
import { ModernLayout } from './fnb/themes/modern/ModernLayout';
import { PremiumLayout } from './fnb/themes/premium/PremiumLayout';
import { ArtisanLayout } from './fnb/themes/artisan/ArtisanLayout';
import { ElegantLayout } from './fnb/themes/elegant/ElegantLayout';
import { BoldLayout } from './fnb/themes/bold/BoldLayout';
import { VibrantLayout } from './fnb/themes/vibrant/VibrantLayout';
import { FloatingCart } from './fnb/universal/FloatingCart';
import { MobileFloatingDock } from './fnb/universal/MobileFloatingDock';
import { ProductCustomizationModal } from './fnb/universal/ProductCustomizationModal';
import { CheckoutModal } from './fnb/universal/CheckoutModal';

export function FnbDemoClient({ client, themeVariant = 'fnb-theme-classic' }: { client: BusinessDemo, themeVariant?: string }) {
  // Map legacy theme variants to the new format backward compatibility
  let normalizedVariant = themeVariant;
  if (themeVariant === 'fnb-cafe-default' || themeVariant === 'classic') normalizedVariant = 'fnb-theme-classic';
  if (themeVariant === 'fnb-cafe-alternatif' || themeVariant === 'alternatif') normalizedVariant = 'fnb-theme-modern';
  if (themeVariant === 'fnb-restaurant-default' || themeVariant === 'premium-dark' || themeVariant === 'premium') normalizedVariant = 'fnb-theme-premium';
  if (themeVariant === 'fnb-restaurant-artisan') normalizedVariant = 'fnb-theme-artisan';
  if (themeVariant === 'fnb-bakeryndessert-default') normalizedVariant = 'fnb-theme-elegant';
  if (themeVariant === 'fnb-fastfood-default') normalizedVariant = 'fnb-theme-bold';
  if (themeVariant === 'fnb-bubleteanjuice-default') normalizedVariant = 'fnb-theme-vibrant';

  let LayoutComponent = ClassicLayout;
  switch (normalizedVariant) {
    case 'fnb-theme-classic': LayoutComponent = ClassicLayout; break;
    case 'fnb-theme-modern': LayoutComponent = ModernLayout; break;
    case 'fnb-theme-premium': LayoutComponent = PremiumLayout; break;
    case 'fnb-theme-artisan': LayoutComponent = ArtisanLayout; break;
    case 'fnb-theme-elegant': LayoutComponent = ElegantLayout; break;
    case 'fnb-theme-bold': LayoutComponent = BoldLayout; break;
    case 'fnb-theme-vibrant': LayoutComponent = VibrantLayout; break;
  }

  return (
    <FnbDemoProvider client={client}>
      <LayoutComponent />
      
      {/* Universal Floating Elements & Modals */}
      <FloatingCart />
      <MobileFloatingDock />
      <ProductCustomizationModal />
      <CheckoutModal />
    </FnbDemoProvider>
  );
}
