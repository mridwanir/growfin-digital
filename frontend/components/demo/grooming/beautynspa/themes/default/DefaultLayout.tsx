import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { BeautynspaHeader } from './BeautynspaHeader';
import { BeautynspaHero } from './BeautynspaHero';
import { BeautynspaTreatments } from './BeautynspaTreatments';
import { BeautynspaArtists } from './BeautynspaArtists';
import { BeautynspaLookbook } from './BeautynspaLookbook';
import { BeautynspaReviews } from './BeautynspaReviews';
import { BeautynspaFooter } from './BeautynspaFooter';

export function DefaultLayout() {
  const { client } = useGroomingDemo();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 text-stone-800 antialiased selection:bg-brand-primary selection:text-white relative overflow-x-hidden">
      <BeautynspaHeader />

      <main className="flex-1 w-full">
        <BeautynspaHero />
        <BeautynspaTreatments />
        <BeautynspaArtists />
        <BeautynspaLookbook />
        <BeautynspaReviews />
      </main>

      <BeautynspaFooter />
    </div>
  );
}
