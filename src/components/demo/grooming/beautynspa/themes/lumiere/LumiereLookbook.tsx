import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

import { getGroomingImageUrl } from '../default/BeautynspaArtists'

export function LumiereLookbook() {
  const { client } = useGroomingDemo()

  const lookbooks =
    client.lookbook && client.lookbook.length >= 3
      ? client.lookbook
      : [
          { id: '1', name: 'Balayage Elegance', imageUrl: getGroomingImageUrl(0) },
          { id: '2', name: 'Premium Nail Art', imageUrl: getGroomingImageUrl(1) },
          { id: '3', name: 'Relaxing Hair Spa', imageUrl: getGroomingImageUrl(2) },
        ]

  return (
    <section id="lookbook" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif-lumiere mb-4 text-4xl text-[#4a3c37]">The Lookbook</h2>
          <p className="font-light text-[#5c4d47]">
            Sentuhan ajaib dari para ahli kami. Dari pewarnaan rambut hingga nail art.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {lookbooks.slice(0, 3).map((lb: any, idx: number) => (
            <div key={idx} className="group relative h-96 overflow-hidden">
              <img
                src={lb.imageUrl || `/image/grooming/beautynspa/look${idx + 1}.jpg`}
                alt={lb.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={e => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-serif-lumiere text-xl tracking-wide text-white">
                  {lb.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
