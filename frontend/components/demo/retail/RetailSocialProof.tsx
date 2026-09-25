'use client';

import { useRetailDemo } from './RetailDemoContext';

export function RetailSocialProof() {
  const { client } = useRetailDemo();
  const reviews = client.reviews || [];

  return (
    <section id="ulasan" className="py-20 bg-white -mx-4 sm:mx-0 px-4 sm:px-6 lg:px-8 sm:rounded-[40px] mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kata Mereka</h2>
          <p className="text-gray-500">Ulasan dari pelanggan setia {client.name}.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((review, idx) => (
            <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div className="flex text-yellow-400 mb-4">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-xl mr-4">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{review.authorName}</p>
                  <p className="text-sm text-gray-500">{review.time}</p>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl">
              <p className="text-gray-500">Belum ada ulasan untuk saat ini.</p>
            </div>
          )}
        </div>
        
        {reviews.length > 0 && (
          <div className="text-center mt-12">
            <a 
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Lihat {client.reviewCount}+ Ulasan di Maps ↗
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
