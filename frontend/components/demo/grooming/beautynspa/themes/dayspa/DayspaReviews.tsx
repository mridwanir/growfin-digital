
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { Star } from 'lucide-react';

export function DayspaReviews() {
  const { client } = useGroomingDemo();

  return (
    <section id="reviews" className="py-24 bg-[#F3ECE2]/30 border-t border-[#F3ECE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs tracking-[0.25em] text-brand-primary font-semibold uppercase">Ulasan Pengunjung</span>
          <h2 className="font-serif-dayspa text-4xl sm:text-5xl font-normal text-[#2B2623]">Ketenangan yang Mereka Rasakan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(client.reviews || client.metadata?.reviews)?.slice(0, 3).map((review: any, idx: number) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-[#F3ECE2] relative shadow-sm">
              <div className="flex text-amber-500 mb-4 gap-1">
                {Array.from({ length: review.rating || 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-current text-amber-500" />
                ))}
              </div>
              <p className="text-sm text-[#2B2623]/80 italic leading-relaxed mb-6 font-light">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F3ECE2] flex items-center justify-center font-serif-dayspa font-semibold text-brand-primary">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2B2623]">{review.authorName}</h4>
                  <span className="text-[11px] text-[#2B2623]/50">{review.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
