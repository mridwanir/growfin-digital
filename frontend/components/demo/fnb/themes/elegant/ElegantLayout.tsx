import { ElegantHeader } from './ElegantHeader';
import { ElegantMenu } from './ElegantMenu';
import { ElegantGallery } from './ElegantGallery';
import { ElegantReviews } from './ElegantReviews';
import { ElegantFooter } from './ElegantFooter';
import { useFnbDemo } from '../../core/FnbDemoContext';

export function ElegantLayout() {
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
        {client.sectionOrder?.map((sectionId) => {
          switch (sectionId) {
            case 'hero': return <ElegantHeader key="hero" />;
            case 'menu': return <ElegantMenu key="menu" />;
            case 'gallery': return <ElegantGallery key="gallery" />;
            case 'reviews': return <ElegantReviews key="reviews" />;
            default: return null;
          }
        }) || (
          <>
            <ElegantHeader />
            <ElegantMenu />
            <ElegantGallery />
            <ElegantReviews />
          </>
        )}
        <ElegantFooter />
      </div>
    </>
  );
}
