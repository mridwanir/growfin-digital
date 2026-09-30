import { ArtisanHeader } from './ArtisanHeader';
import { ArtisanMenu } from './ArtisanMenu';
import { ArtisanGallery } from './ArtisanGallery';
import { ArtisanReviews } from './ArtisanReviews';
import { ArtisanContact } from './ArtisanContact';

import { useFnbDemo } from '../../../core/FnbDemoContext';

export function ArtisanLayout() {
  const { client } = useFnbDemo();
  const themeColor = client.metadata?.themeColor; // amber-500 fallback

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --brand-primary: ${themeColor};
        }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');
        .font-sans-artisan { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif-title { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="bg-stone-50 text-stone-800 antialiased selection:bg-brand-primary selection:text-white pb-28 font-sans-artisan">
        <ArtisanHeader />
        <ArtisanMenu />
        <ArtisanGallery />
        <ArtisanReviews />
        <ArtisanContact />
      </div>
    </>
  );
}
