'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function FreshReviews() {
  const { client } = useRetailDemo();
  if (!client.reviews || client.reviews.length === 0) return null;
  const reviews = client.reviews;

  return (
    <section id="testimoni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">{client.reviewsTitle || "Ulasan Pelanggan"}</h2>
          {client.reviewsDescription && (
            <p className="text-sm text-zinc-500 mt-1">{client.reviewsDescription}</p>
          )}
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg>
          <span>Rating {client.rating || '4.9'} / 5.0 ({client.reviewCount || '2,400+'} Ulasan)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg>
                ))}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm uppercase">
                {(r.authorName || r.author || r.name || 'User').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">{r.authorName || r.author || r.name || 'User'}</h4>
                <span className="text-[11px] text-zinc-400">{r.time || 'Pembeli Terverifikasi'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {client.googleMapsUrl && (
        <div className="text-center mt-10">
          <a 
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold transition-colors shadow-sm"
          >
            Lihat {client.reviewCount}+ Ulasan di Maps ↗
          </a>
        </div>
      )}
    </section>
  );
}
