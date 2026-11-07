import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaLookbook() {
  const { client } = useGroomingDemo()
  const gallery = client.instagramFeed?.length
    ? client.instagramFeed
    : [
        '/image/grooming/nailspa/4.jpg',
        '/image/grooming/nailspa/5.jpg',
        '/image/grooming/nailspa/6.jpg',
        '/image/grooming/nailspa/1.jpg',
      ]

  return (
    <section id="lookbook" className="bg-nude-100/50 border-nude-200/80 border-t py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-brand-primary mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
            Recent Gallery
          </p>
          <h2 className="text-charcoal font-serif text-3xl sm:text-5xl">The Lookbook</h2>
          <p className="mt-3 text-sm text-neutral-600">
            Karya nyata dari jemari nail artist kami minggu ini di salon.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {gallery.map((img: string, idx: number) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200 shadow-sm"
            >
              <img
                src={img}
                alt={`Lookbook ${idx + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="from-charcoal/80 absolute inset-0 flex flex-col justify-end bg-gradient-to-t via-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="font-serif text-base">Inspirasi {idx + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
