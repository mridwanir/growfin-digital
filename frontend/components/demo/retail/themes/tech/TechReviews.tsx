'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function TechReviews() {
  const { client } = useRetailDemo();
  if (!client.reviews || client.reviews.length === 0) return null;
  const reviews = client.reviews;

  return (
    <section id="testimoni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        {client.reviewsDescription && (
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--theme-color)' }}>{client.reviewsDescription}</span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">{client.reviewsTitle || "Dipercaya Kreator & Profesional"}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-7 rounded-2xl border border-zinc-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex gap-1 mb-4" style={{ color: 'var(--theme-color)' }}>
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-800 uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">{r.authorName || r.author || r.name || 'User'}</h4>
                <p className="text-[11px] text-zinc-400">{r.time || 'Verified Buyer'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {client.googleMapsUrl && (
        <div className="text-center mt-12">
          <a 
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Lihat {client.reviewCount}+ Ulasan di Maps ↗
          </a>
        </div>
      )}
    </section>
  );
}
