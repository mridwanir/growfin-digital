import { PremiumHeader } from './PremiumHeader';
import { PremiumMenu } from './PremiumMenu';
import { PremiumGallery } from './PremiumGallery';
import { PremiumReviews } from './PremiumReviews';
import { PremiumFooter } from './PremiumFooter';

import { useFnbDemo } from '../../core/FnbDemoContext';

export function PremiumLayout() {
  const { client } = useFnbDemo();
  const currentOrder = client.sectionOrder || ['hero', 'menu', 'gallery', 'reviews'];

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero': return <PremiumHeader key="hero" />;
      case 'menu': return <PremiumMenu key="menu" />;
      case 'gallery': return <PremiumGallery key="gallery" />;
      case 'reviews': return <PremiumReviews key="reviews" />;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 antialiased relative overflow-x-hidden">
      {currentOrder.map(renderSection)}
      <PremiumFooter />
    </div>
  );
}
