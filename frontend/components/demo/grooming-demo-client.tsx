'use client';

import { BusinessDemo } from '@/lib/types';
import { BeautynspaRouter } from './grooming/beautynspa/BeautynspaRouter';
import { BarbershopRouter } from './grooming/barbershop/BarbershopRouter';
import { NailspaRouter } from './grooming/nailspa/NailspaRouter';
import { GroomingDemoProvider } from './grooming/core/GroomingDemoContext';
import { GroomingBookingModal } from './grooming/universal/GroomingBookingModal';

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

  return (
    <GroomingDemoProvider client={client}>
      {category === 'barbershop' && <BarbershopRouter client={client} themeName={themeName} />}
      {category === 'nailspa' && <NailspaRouter client={client} themeName={themeName} />}
      {category === 'beautynspa' && <BeautynspaRouter client={client} themeName={themeName} />}
      {/* Fallback */}
      {category !== 'barbershop' && category !== 'nailspa' && category !== 'beautynspa' && (
        <BeautynspaRouter client={client} themeName="default" />
      )}
      <GroomingBookingModal />
    </GroomingDemoProvider>
  );
}
