'use client';

import { useGroomingDemo } from './GroomingDemoContext';

export function GroomingSocialProof() {
  const { client } = useGroomingDemo();

  return (
    <section id="info" className="mt-20 scroll-mt-24">
      <div className="grid md:grid-cols-2 gap-6 px-4 sm:px-0">
        
        {/* Rating Summary Card */}
        <div className="bg-slate-900 rounded-[32px] p-8 shadow-sm flex flex-col justify-center items-center text-center h-full relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary rounded-full blur-[80px] opacity-40"></div>
          
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mb-4 border border-white/20 backdrop-blur-md">
            ⭐
          </div>
          <h3 className="text-5xl font-black text-white mb-2">{client.rating.toFixed(1)}</h3>
          <p className="text-slate-400 font-bold mb-8">Berdasarkan {client.reviewCount}+ Ulasan Pelanggan</p>
          
          <a 
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-black shadow-lg shadow-brand-primary/25 transition-all active:scale-95 w-full sm:w-auto"
          >
            Lihat Ulasan Google ↗
          </a>
        </div>
        
        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          {client.reviews?.slice(0, 3).map((review, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800">{review.authorName}</span>
                <span className="text-amber-400 text-sm">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">"{review.text}"</p>
              <p className="text-slate-400 text-xs font-bold mt-3">{review.time}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
