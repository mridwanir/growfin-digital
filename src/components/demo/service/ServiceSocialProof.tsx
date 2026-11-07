'use client'

import { useServiceDemo } from './ServiceDemoContext'

export function ServiceSocialProof() {
  const { client } = useServiceDemo()

  return (
    <section
      id="reviews"
      className="-mx-4 bg-blue-50/50 px-4 py-20 sm:mx-0 sm:rounded-[40px] sm:px-0"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-1 text-2xl text-yellow-400">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
          <h3 className="mb-4 text-3xl font-bold text-gray-900">
            Kepercayaan Mereka, Kebanggaan Kami
          </h3>
          <p className="text-gray-600">
            Ribuan orang telah merasakan kualitas pelayanan kami. Ini kata mereka berdasarkan ulasan
            terverifikasi di Google.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {client.reviews?.slice(0, 3).map((review, idx) => (
            <div
              key={idx}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    review.profilePhotoUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorName)}&background=random`
                  }
                  alt="User"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h5 className="text-sm font-bold text-gray-900">{review.authorName}</h5>
                  <p className="text-xs text-gray-500">{review.time}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google Review"
                  className="ml-auto h-5 w-5"
                />
              </div>
              <div className="mb-3 flex text-xs text-yellow-400">
                {'⭐'.repeat(Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))))}
              </div>
              <p className="mb-4 flex-grow text-sm text-gray-600 italic">"{review.text}"</p>
            </div>
          ))}
          {(!client.reviews || client.reviews.length === 0) && (
            <div className="col-span-full py-10 text-center text-slate-500">
              Belum ada ulasan yang ditampilkan.
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <a
            href={client.googleMapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:text-brand-hover inline-flex items-center font-semibold transition"
          >
            Lihat Semua Ulasan di Google <span className="ml-2 text-sm">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
