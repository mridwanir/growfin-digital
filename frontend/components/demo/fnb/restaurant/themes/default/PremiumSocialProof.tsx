import { useFnbDemo } from '../../../core/FnbDemoContext';
import { Star } from 'lucide-react';

export function PremiumSocialProof() {
  const { client } = useFnbDemo();
  if (!client.reviews || client.reviews.length === 0) return null;

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Words of Praise</h2>
                    <p className="text-slate-400">What our guests say about their experience.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {client.reviews.map((rev, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-8 hover:border-brand-primary/50 transition-colors group">
                      <div className="flex text-brand-primary mb-6 text-sm">
                          {[...Array(Math.floor(rev.rating))].map((_, idx) => (
                            <Star key={idx} className="fill-current w-4 h-4 text-brand-primary" />
                          ))}
                      </div>
                      <p className="text-slate-300 italic mb-8">"{rev.text}"</p>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full grayscale opacity-80 border border-slate-700 bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                             {rev.authorName.charAt(0)}
                          </div>
                          <div>
                              <h4 className="text-white font-semibold text-sm group-hover:text-brand-primary transition-colors">{rev.authorName}</h4>
                              <span className="text-xs text-slate-500">{rev.time || 'Guest'}</span>
                          </div>
                      </div>
                  </div>
                ))}
            </div>
        </div>
    </section>
  );
}
