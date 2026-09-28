'use client';

import { BusinessDemo } from '@/lib/types';
import { ClothingRouter } from './retail/clothing/ClothingRouter';

export function RetailDemoClient({ client, themeVariant }: { client: BusinessDemo, themeVariant?: string }) {
  // Pattern: "retail-[category]-[theme]"
  const parts = themeVariant ? themeVariant.split('-') : [];
  
  let category = 'clothing'; // default fallback
  let themeName = themeVariant;

  if (parts.length >= 2 && parts[0] === 'retail') {
    category = parts[1];
    themeName = parts.length >= 3 ? parts.slice(2).join('-') : 'default';
  } else if (themeVariant === 'editorial' || themeVariant === 'default') {
    // Handling direct "editorial" or "default" layout_ids
    category = 'clothing';
    themeName = themeVariant;
  }

  if (category === 'clothing') {
    return <ClothingRouter client={client} themeName={themeName} />;
  }
  
  // Future Categories (e.g. grocery)
  // if (category === 'grocery') {
  //   return <GroceryRouter client={client} themeName={themeName} />;
  // }
  
  // Ultimate Fallback
  return <ClothingRouter client={client} themeName="default" />;
}
