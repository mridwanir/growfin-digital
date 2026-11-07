'use client'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export const GROOMING_IMAGES = [
  '/image/grooming/beautynspa/adam-winger-WDmvpGs2060-unsplash.jpg',
  '/image/grooming/beautynspa/agustin-fernandez-1Pmp9uxK8X8-unsplash.jpg',
  '/image/grooming/beautynspa/benyamin-bohlouli-LGXN4OSQSa4-unsplash.jpg',
  '/image/grooming/beautynspa/buddy-an-LpK2xddrElI-unsplash.jpg',
  '/image/grooming/beautynspa/cika-VuseVukDioU-unsplash.jpg',
  '/image/grooming/beautynspa/dinuka-lankaloka-JGIfuL-nzCE-unsplash.jpg',
  '/image/grooming/beautynspa/engin-akyurt-g-m8EDc4X6Q-unsplash.jpg',
  '/image/grooming/beautynspa/giorgio-trovato-gb6gtiTZKB8-unsplash.jpg',
  '/image/grooming/beautynspa/h-co-OpjlRo-31SI-unsplash.jpg',
]

export const getGroomingImageUrl = (id: string | number) => {
  const numId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) || 0 : id
  return GROOMING_IMAGES[numId % GROOMING_IMAGES.length]
}

export function BeautynspaArtists() {
  const { client } = useGroomingDemo()

  // If no practitioners are provided, we don't render this section
  if (!client.practitioners || client.practitioners.length === 0) return null

  return (
    <section id="stylist" className="-mx-4 bg-stone-100 px-4 py-24 sm:mx-0 sm:px-0">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl text-stone-900 md:text-4xl">
            Artisan & Stylist Kami
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-500">
            Ditangani langsung oleh para ahli berpengalaman dengan sentuhan seni yang personal untuk
            hasil terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {client.practitioners.map((practitioner, idx) => {
            const imageUrl = practitioner.avatarUrl || getGroomingImageUrl(practitioner.id || idx)

            return (
              <div key={practitioner.id} className="group cursor-pointer text-center">
                <div className="group-hover:border-brand-primary mx-auto mb-6 aspect-square max-w-[240px] overflow-hidden rounded-full border-4 border-white shadow-md transition-colors duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={practitioner.name}
                    className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900">{practitioner.name}</h4>
                <p className="mt-1 text-sm text-stone-500">{practitioner.role}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
