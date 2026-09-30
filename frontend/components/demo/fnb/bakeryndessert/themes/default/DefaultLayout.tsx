import { BakeryHeader } from './BakeryHeader';
import { BakeryMenu } from './BakeryMenu';
import { BakeryGallery } from './BakeryGallery';
import { BakeryReviews } from './BakeryReviews';
import { BakeryFooter } from './BakeryFooter';
import { useFnbDemo } from '../../../core/FnbDemoContext';

export function DefaultLayout() {
  const { client } = useFnbDemo();
  const themeColor = client.metadata?.themeColor || '#C94A29'; // Default orange/red

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --brand-primary: ${themeColor};
        }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-sans-bakery { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif-title { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="bg-stone-50 text-stone-900 antialiased selection:bg-brand-primary selection:text-white pb-20 font-sans-bakery">
        <BakeryHeader />
        <BakeryMenu />
        <BakeryGallery />
        <BakeryReviews />
        <BakeryFooter />
      </div>
    </>
  );
}
