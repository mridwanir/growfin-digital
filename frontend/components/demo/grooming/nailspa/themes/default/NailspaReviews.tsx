import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaReviews() {
  const { client } = useGroomingDemo();

  const defaultReviews = [
    { authorName: "Gisella Anastasia", text: "Bukan cuma salon kuku biasa, vibenya beneran relaxing sanctuary! Kursinya empuk banget, dapet complimentary matcha latte hangat, dan ngerjain kutikulanya rapi gak perih sama sekali." },
    { authorName: "Tara Indira", text: "Kuku wedding saya dipercayakan ke sini, hasilnya stunning & tahan sampai honeymoon 3 minggu kemudian! Detail nail art-nya bersih banget. Sangat worth the price." },
    { authorName: "Stefani Kusuma", text: "Alat-alatnya dibuka baru dari pouch steril segel di depan mata kita. Untuk yang higienis-freak kayak aku, ini safe banget. Selalu reservasi tiap bulan." }
  ];

  const reviews = client.reviews?.length ? client.reviews.slice(0, 3) : defaultReviews;

  return (
    <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-1 text-amber-500 mb-3">
          {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-charcoal">Suasana & Kesan Tamu</h2>
        <p className="text-neutral-500 text-sm mt-3">Kenyamanan tanpa kompromi adalah janji kami kepada Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review: any, idx: number) => {
          const initials = (review.authorName || review.name || 'G').substring(0, 2).toUpperCase();
          return (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-nude-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-1 text-amber-500 text-xs mb-4">
                {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
              </div>
              <p className="font-serif italic text-lg text-charcoal leading-relaxed mb-6">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary font-semibold flex items-center justify-center text-sm">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{review.authorName || review.name}</p>
                  <p className="text-xs text-neutral-400">Verified Guest</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
