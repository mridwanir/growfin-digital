'use client';

import { BusinessDemo } from '@/lib/types';
import { BeautynspaRouter } from './grooming/beautynspa/BeautynspaRouter';

export function GroomingDemoClient({ client, themeVariant }: { client: BusinessDemo, themeVariant?: string }) {
  // Pattern: "grooming-[category]-[theme]"
  const parts = themeVariant ? themeVariant.split('-') : [];
  
  let category = 'beautynspa'; // default fallback
  let themeName = themeVariant;

  if (parts.length >= 2 && parts[0] === 'grooming') {
    category = parts[1];
    themeName = parts.length >= 3 ? parts.slice(2).join('-') : 'default';
  } else if (themeVariant === 'lumiere' || themeVariant === 'default') {
    category = 'beautynspa';
    themeName = themeVariant;
  }

  if (category === 'beautynspa') {
    return <BeautynspaRouter client={client} themeName={themeName} />;
  }
  
  // Ultimate Fallback
  return <BeautynspaRouter client={client} themeName="default" />;
}
