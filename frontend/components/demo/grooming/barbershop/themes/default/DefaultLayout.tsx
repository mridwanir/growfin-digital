import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { BarbershopHeader } from './BarbershopHeader';
import { BarbershopHero } from './BarbershopHero';
import { BarbershopLookbook } from './BarbershopLookbook';
import { BarbershopReviews } from './BarbershopReviews';
import { BarbershopTreatments } from './BarbershopTreatments';
import { BarbershopBarbers } from './BarbershopBarbers';
import { BarbershopFooter } from './BarbershopFooter';

export function DefaultLayout() {
  const { client } = useGroomingDemo();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-display { font-family: 'Oswald', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .bg-vintage-900 { background-color: #0a0a0a; }
        .bg-vintage-800 { background-color: #1a1a1a; }
        .bg-vintage-700 { background-color: #2d2d2d; }
        .border-vintage-700 { border-color: #2d2d2d; }
        .text-vintage-900 { color: #0a0a0a; }
        
        .text-paper { color: #f4ece2; }
        .text-paper\\/80 { color: rgba(244, 236, 226, 0.8); }
        .text-paper\\/70 { color: rgba(244, 236, 226, 0.7); }
        .text-paper\\/60 { color: rgba(244, 236, 226, 0.6); }
        .text-paper\\/50 { color: rgba(244, 236, 226, 0.5); }
        .text-paper\\/40 { color: rgba(244, 236, 226, 0.4); }

        .group:hover .group-hover\\:text-vintage-900 { color: #0a0a0a; }
      `}} />
      <div className="bg-vintage-900 text-paper antialiased selection:bg-brand-primary pb-28 font-serif">
        <BarbershopHeader />
        <BarbershopHero />
        <BarbershopLookbook />
        <BarbershopReviews />
        <BarbershopTreatments />
        <BarbershopBarbers />
        <BarbershopFooter />
        
      </div>
    </>
  );
}
