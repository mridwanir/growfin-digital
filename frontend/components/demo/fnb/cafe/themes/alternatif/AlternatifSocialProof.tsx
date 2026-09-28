import { useFnbDemo } from '../../../core/FnbDemoContext';
import { Star } from 'lucide-react';

export function AlternatifSocialProof() {
  const { client } = useFnbDemo();
  if (!client.reviews || client.reviews.length === 0) return null;

  return (
    <section className="py-20 bg-stone-50 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-stone-900 mb-12">Cerita Pelanggan</h2>
            
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory text-left" style={{ scrollbarWidth: 'none' }}>
                {client.reviews.map((rev, i) => (
                  <div key={i} className="snap-center shrink-0 w-[85vw] md:w-96 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                      <div className="text-yellow-400 text-sm mb-4 flex gap-1">
                          {[...Array(Math.floor(rev.rating))].map((_, idx) => (
                            <Star key={idx} className="fill-current w-4 h-4 text-yellow-400" />
                          ))}
                      </div>
                      <p className="text-stone-900 font-medium text-lg mb-6 leading-relaxed">
                          "{rev.text}"
                      </p>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500">
                             {rev.authorName.charAt(0)}
                          </div>
                          <div>
                              <h4 className="font-bold text-sm text-stone-900">{rev.authorName}</h4>
                              <p className="text-xs text-stone-500">{rev.time || 'Pelanggan Setia'}</p>
                          </div>
                      </div>
                  </div>
                ))}
            </div>
        </div>
    </section>
  );
}
