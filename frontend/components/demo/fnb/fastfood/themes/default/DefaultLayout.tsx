import { useFnbDemo } from '../../../core/FnbDemoContext';
import { FastfoodHeader } from './FastfoodHeader';
import { FastfoodMenu } from './FastfoodMenu';
import { FastfoodLookbook } from './FastfoodLookbook';
import { FastfoodReviews } from './FastfoodReviews';
import { FastfoodFooter } from './FastfoodFooter';

export function DefaultLayout() {
  const { client } = useFnbDemo();
  const themeColor = client.metadata?.themeColor || '#f59e0b'; // Default amber-500

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --brand-primary: ${themeColor};
        }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-sans-fastfood { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
      <div className="bg-neutral-50 text-neutral-900 antialiased selection:bg-brand-primary selection:text-white pb-20 font-sans-fastfood">
        <FastfoodHeader />
        <FastfoodMenu />
        <FastfoodLookbook />
        <FastfoodReviews />
        <FastfoodFooter />
      </div>
    </>
  );
}
