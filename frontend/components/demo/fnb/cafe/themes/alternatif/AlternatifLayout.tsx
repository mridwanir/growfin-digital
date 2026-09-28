import { AlternatifHeader } from './AlternatifHeader';
import { AlternatifMenu } from './AlternatifMenu';
import { AlternatifGallery } from './AlternatifGallery';
import { AlternatifSocialProof } from './AlternatifSocialProof';
import { AlternatifFooter } from './AlternatifFooter';

export function AlternatifLayout() {
  return (
    <div className="bg-stone-50 text-stone-800 antialiased relative overflow-x-hidden">
      <AlternatifHeader />
      <AlternatifMenu />
      <AlternatifGallery />
      <AlternatifSocialProof />
      <AlternatifFooter />
    </div>
  );
}
