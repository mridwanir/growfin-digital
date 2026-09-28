import { PremiumHeader } from './PremiumHeader';
import { PremiumMenu } from './PremiumMenu';
import { PremiumGallery } from './PremiumGallery';
import { PremiumSocialProof } from './PremiumSocialProof';
import { PremiumFooter } from './PremiumFooter';

export function PremiumLayout() {
  return (
    <div className="bg-slate-950 text-slate-100 antialiased relative overflow-x-hidden">
      <PremiumHeader />
      <PremiumMenu />
      <PremiumGallery />
      <PremiumSocialProof />
      <PremiumFooter />
    </div>
  );
}
