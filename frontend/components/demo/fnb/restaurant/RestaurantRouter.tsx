import { PremiumLayout } from './themes/default/PremiumLayout';

export function RestaurantRouter({ themeName }: { themeName: string }) {
  // Only premium layout is available for restaurant currently, acts as default
  return <PremiumLayout />;
}
