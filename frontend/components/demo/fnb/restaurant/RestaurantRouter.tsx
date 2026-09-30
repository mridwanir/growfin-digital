import { PremiumLayout } from './themes/default/PremiumLayout';
import { ArtisanLayout } from './themes/artisan/ArtisanLayout';

export function RestaurantRouter({ themeName }: { themeName: string }) {
  if (themeName === 'artisan') return <ArtisanLayout />;
  
  // Default layout for restaurant is premium
  return <PremiumLayout />;
}
