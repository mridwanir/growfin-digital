'use client';

import { BusinessDemo } from '@/lib/types';
import { DefaultLayout } from './themes/default/DefaultLayout';
import { EditorialLayout } from './themes/editorial/EditorialLayout';
import { ClothingProvider } from './core/ClothingContext';

export function ClothingRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  let layout;
  
  if (themeName === 'editorial') {
    layout = <EditorialLayout client={client} />;
  } else {
    // Default fallback
    layout = <DefaultLayout client={client} />;
  }

  // If the layouts themselves use ClothingProvider inside them, we don't need to wrap here.
  // Let's check DefaultLayout: it wraps itself with ClothingProvider.
  // Wait, EditorialLayout doesn't currently use ClothingProvider, but we will refactor it.
  // It's actually better to remove ClothingProvider from DefaultLayout and put it HERE at the router level!
  // But since I just changed DefaultLayout to use ClothingProvider, I'll keep it there for now,
  // or I can wrap it here and remove it from DefaultLayout later.
  // Let's wrap it here, so all themes in clothing share the same context automatically.

  return (
    <ClothingProvider client={client}>
      {themeName === 'editorial' ? <EditorialLayout client={client} /> : <DefaultLayout client={client} />}
    </ClothingProvider>
  );
}
