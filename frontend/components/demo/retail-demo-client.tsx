'use client';

import { BusinessDemo } from '@/lib/types';
import { RetailDemoProvider } from './retail/core/RetailDemoContext';

// Themes
import { UrbanLayout } from './retail/themes/urban/UrbanLayout';
import { EditorialLayout } from './retail/themes/editorial/EditorialLayout';
import { TechLayout } from './retail/themes/tech/TechLayout';
import { DarkLayout } from './retail/themes/dark/DarkLayout';
import { FreshLayout } from './retail/themes/fresh/FreshLayout';
import { ArtisanLayout } from './retail/themes/artisan/ArtisanLayout';

// Universals
import { RetailCartModal } from './retail/universal/RetailCartModal';
import { RetailFloatingCart } from './retail/universal/RetailFloatingCart';
import { RetailFloatingDock } from './retail/universal/RetailFloatingDock';
import { RetailQuickViewModal } from './retail/universal/RetailQuickViewModal';

export function RetailDemoClient({ client, themeVariant = 'retail-theme-urban' }: { client: BusinessDemo, themeVariant?: string }) {
  // Map legacy theme variants to the new format for backward compatibility
  let normalizedVariant = themeVariant;
  if (themeVariant === 'clothing-default' || themeVariant === 'default') normalizedVariant = 'retail-theme-urban';
  if (themeVariant === 'clothing-editorial' || themeVariant === 'editorial') normalizedVariant = 'retail-theme-editorial';
  if (themeVariant === 'electronic-default') normalizedVariant = 'retail-theme-tech';
  if (themeVariant === 'electronic-dark' || themeVariant === 'dark') normalizedVariant = 'retail-theme-dark';
  if (themeVariant === 'groceries-default') normalizedVariant = 'retail-theme-fresh';
  if (themeVariant === 'groceries-artisan' || themeVariant === 'artisan') normalizedVariant = 'retail-theme-artisan';
  
  if (themeVariant === 'retail-clothing-default') normalizedVariant = 'retail-theme-urban';
  if (themeVariant === 'retail-electronic-dark') normalizedVariant = 'retail-theme-dark';
  if (themeVariant === 'retail-groceries-artisan') normalizedVariant = 'retail-theme-artisan';

  let LayoutComponent = UrbanLayout;
  
  switch (normalizedVariant) {
    case 'retail-theme-urban': LayoutComponent = UrbanLayout; break;
    case 'retail-theme-editorial': LayoutComponent = EditorialLayout; break;
    case 'retail-theme-tech': LayoutComponent = TechLayout; break;
    case 'retail-theme-dark': LayoutComponent = DarkLayout; break;
    case 'retail-theme-fresh': LayoutComponent = FreshLayout; break;
    case 'retail-theme-artisan': LayoutComponent = ArtisanLayout; break;
  }

  // Determine which universal components to render based on the theme family
  const isClothing = normalizedVariant.includes('urban') || normalizedVariant.includes('editorial');
  const isElectronic = normalizedVariant.includes('tech') || normalizedVariant.includes('dark');
  const isGroceries = normalizedVariant.includes('fresh') || normalizedVariant.includes('artisan');

  return (
    <RetailDemoProvider client={client}>
      <LayoutComponent client={client} />
      
      {/* Universal Components for all Themes */}
      <RetailCartModal />
      <RetailQuickViewModal />
      
      {/* Theme specific floating elements (mostly for Clothing) */}
      {isClothing && (
        <>
          <RetailFloatingCart />
          <RetailFloatingDock />
        </>
      )}
    </RetailDemoProvider>
  );
}
