'use client';

import { useClinicDemo } from './ClinicDemoContext';

export function ClinicSocialProof() {
  const { client } = useClinicDemo();

  return (
    <section id="reviews" className="py-20 bg-blue-50/50 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-[40px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-1 text-yellow-400 text-2xl mb-4">
            <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Kepercayaan Mereka, Kebanggaan Kami</h3>
          <p className="text-gray-600">Ribuan orang telah merasakan kualitas pelayanan kami. Ini kata mereka berdasarkan ulasan terverifikasi di Google.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {client.reviews?.slice(0, 3).map((review, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={review.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorName)}&background=random`} alt="User" className="w-12 h-12 rounded-full" />
                <div>
                  <h5 className="font-bold text-gray-900 text-sm">{review.authorName}</h5>
                  <p className="text-xs text-gray-500">{review.time}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Review" className="w-5 h-5 ml-auto" />
              </div>
              <div className="flex text-yellow-400 text-xs mb-3">
                {'⭐'.repeat(review.rating)}
              </div>
              <p className="text-gray-600 text-sm italic mb-4 flex-grow">"{review.text}"</p>
            </div>
          ))}
          {(!client.reviews || client.reviews.length === 0) && (
            <div className="col-span-full text-center text-slate-500 py-10">
              Belum ada ulasan yang ditampilkan.
            </div>
          )}
        </div>
        
        <div className="text-center mt-10">
          <a href={client.googleMapsUrl || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-primary font-semibold hover:text-brand-hover transition">
            Lihat Semua Ulasan di Google <span className="ml-2 text-sm">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
