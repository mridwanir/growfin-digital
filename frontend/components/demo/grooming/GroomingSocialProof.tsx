'use client';

import { useGroomingDemo } from './GroomingDemoContext';

export function GroomingSocialProof() {
  const { client } = useGroomingDemo();

  return (
    <section id="ulasan" className="py-24 bg-stone-100 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-stone-400 tracking-widest uppercase mb-2 block">Social Proof</span>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Kata Mereka Tentang Kami</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {client.reviews?.slice(0, 3).map((review, idx) => (
            <div key={idx} className={`bg-white p-8 rounded-2xl shadow-sm relative ${idx === 1 ? 'transform md:-translate-y-4' : ''}`}>
              <div className="text-4xl text-stone-200 absolute top-6 right-6 font-serif">"</div>
              <div className="flex text-amber-400 text-sm mb-4 gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-900">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <h5 className="font-semibold text-stone-900">{review.authorName}</h5>
                  <span className="text-xs text-gray-500">{review.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
