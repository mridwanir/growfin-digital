import { useCafeDemo } from './CafeDemoContext';
import { Heart, Star, StarHalf } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function CafeSocialProof() {
  const { client } = useCafeDemo();
  const { ref, isVisible } = useScrollReveal(0.1);

  if (!client.reviews || client.reviews.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Heart className="text-red-500 fill-red-500 w-6 h-6" /> Kata Mereka
          </h2>
          {client.googleMapsUrl && (
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-primary hover:underline whitespace-nowrap"
            >
              Lihat selengkapnya &rarr;
            </a>
          )}
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none">
          {client.reviews.map((r, idx) => (
            <div key={idx} className="snap-start shrink-0 w-80 bg-stone-50 rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500">
                    {r.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{r.authorName}</h4>
                    <p className="text-xs text-stone-500">Pelanggan</p>
                  </div>
                </div>
                <span className="text-xs text-stone-400">{r.time}</span>
              </div>
              <div className="text-brand-primary flex gap-1 text-sm mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(r.rating) ? 'fill-current' : 'text-stone-300'}`} />
                ))}
              </div>
              <p className="text-stone-600 text-sm line-clamp-3">
                &quot;{r.text}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
