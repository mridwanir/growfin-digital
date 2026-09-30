'use client';

import { BusinessDemo } from '@/lib/types';
import { ClothingRouter } from './retail/clothing/ClothingRouter';
import { GroceriesRouter } from './retail/groceries/GroceriesRouter';
import { ElectronicRouter } from './retail/electronic/ElectronicRouter';

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
  } else if (!themeVariant) {
    const isGroceries = client.category?.toLowerCase().includes('supermarket') || 
                        client.category?.toLowerCase().includes('convenience') ||
                        client.category?.toLowerCase().includes('grosir') ||
                        client.category?.toLowerCase().includes('minimarket');
    const isElectronic = client.category?.toLowerCase().includes('electronic') || 
                         client.category?.toLowerCase().includes('gadget') ||
                         client.category?.toLowerCase().includes('computer');
                         
    if (isGroceries) {
      category = 'groceries';
      themeName = 'default';
    } else if (isElectronic) {
      category = 'electronic';
      themeName = 'default';
    }
  }

  if (category === 'clothing') {
    return <ClothingRouter client={client} themeName={themeName} />;
  }
  
  if (category === 'groceries') {
    return <GroceriesRouter client={client} themeName={themeName} />;
  }
  
  if (category === 'electronic') {
    return <ElectronicRouter client={client} themeName={themeName} />;
  }
  
  // Ultimate Fallback
  return <ClothingRouter client={client} themeName="default" />;
}
