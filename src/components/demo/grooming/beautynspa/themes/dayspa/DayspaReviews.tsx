import { Star } from 'lucide-react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function DayspaReviews() {
  const { client } = useGroomingDemo()

  return (
    <section id="reviews" className="border-t border-[#F3ECE2] bg-[#F3ECE2]/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-xl space-y-3 text-center">
          <span className="text-brand-primary text-xs font-semibold tracking-[0.25em] uppercase">
            Ulasan Pengunjung
          </span>
          <h2 className="font-serif-dayspa text-4xl font-normal text-[#2B2623] sm:text-5xl">
            Ketenangan yang Mereka Rasakan
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {(client.reviews || [])?.slice(0, 3).map((review: any, idx: number) => (
            <div
              key={idx}
              className="relative rounded-3xl border border-[#F3ECE2] bg-white p-8 shadow-sm"
            >
              <div className="mb-4 flex gap-1 text-amber-500">
                {Array.from({
                  length: Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))),
                }).map((_, i) => (
                  <Star key={i} size={16} className="fill-current text-amber-500" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed font-light text-[#2B2623]/80 italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="font-serif-dayspa text-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-[#F3ECE2] font-semibold">
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
  )
}
