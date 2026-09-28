import { FnbHeader } from './FnbHeader';
import { FnbHeroScreen } from './FnbHeroScreen';
import { FnbGallery } from './FnbGallery';
import { FnbServiceList } from './FnbServiceList';
import { FnbSocialProof } from './FnbSocialProof';
import { FnbProfileScreen } from './FnbProfileScreen';

export function ClassicLayout() {
  return (
    <div className="min-h-screen font-sans selection:bg-brand-primary/30 bg-stone-50 text-stone-800">
      <FnbHeader />
      <main>
        <FnbHeroScreen />
        <FnbGallery />
        <FnbSocialProof />
        <FnbServiceList />
      </main>
      <FnbProfileScreen />
    </div>
  );
}
