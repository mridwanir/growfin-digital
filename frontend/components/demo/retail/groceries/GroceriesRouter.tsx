'use client';

import { BusinessDemo } from '@/lib/types';
import { DefaultLayout } from './themes/default/DefaultLayout';
import { ArtisanLayout } from './themes/artisan/ArtisanLayout';
import { GroceriesProvider } from './core/GroceriesContext';

export function GroceriesRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  const renderLayout = () => {
    if (themeName === 'retail-groceries-artisan' || themeName === 'artisan') {
      return <ArtisanLayout client={client} />;
    }
    return <DefaultLayout client={client} />;
  };

  return (
    <GroceriesProvider client={client}>
      {renderLayout()}
    </GroceriesProvider>
  );
}
