import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { LightHeader } from './LightHeader';
import { LightHero } from './LightHero';
import { LightLookbook } from './LightLookbook';
import { LightReviews } from './LightReviews';
import { LightTreatments } from './LightTreatments';
import { LightStylists } from './LightStylists';
import { LightFooter } from './LightFooter';
import { LightBookingModal } from './LightBookingModal';

export function LightLayout() {
  const { client } = useGroomingDemo();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans-Light { font-family: 'Montserrat', sans-serif; }
        
        .bg-blush-50 { background-color: #fdf8f9; }
        .bg-blush-100 { background-color: #fceef1; }
        .bg-blush-300 { background-color: #f4b8c6; }
        
        .text-charcoal-800 { color: #4a4a4a; }
        .text-charcoal-900 { color: #222222; }
        .bg-charcoal-900 { background-color: #222222; }
        .bg-charcoal-900\\/80 { background-color: rgba(34, 34, 34, 0.8); }
        .bg-charcoal-900\\/40 { background-color: rgba(34, 34, 34, 0.4); }
      `}} />
      <div className="bg-blush-50 text-charcoal-900 antialiased selection:bg-brand-primary pb-28 font-sans-Light">
        <LightHeader />
        <LightHero />
        <LightLookbook />
        <LightReviews />
        <LightTreatments />
        <LightStylists />
        <LightFooter />
        
      </div>
    </>
  );
}
