import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { NailspaHeader } from './NailspaHeader';
import { NailspaHero } from './NailspaHero';
import { NailspaTreatments } from './NailspaTreatments';
import { NailspaArtists } from './NailspaArtists';
import { NailspaLookbook } from './NailspaLookbook';
import { NailspaReviews } from './NailspaReviews';
import { NailspaCta } from './NailspaCta';
import { NailspaFooter } from './NailspaFooter';

export function DefaultLayout() {
  const { client } = useGroomingDemo();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#242120] font-sans antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      <NailspaHeader />
      <main className="pt-20">
        <NailspaHero />
        <NailspaTreatments />
        <NailspaArtists />
        <NailspaLookbook />
        <NailspaReviews />
        <NailspaCta />
      </main>
      <NailspaFooter />
      
    </div>
  );
}
