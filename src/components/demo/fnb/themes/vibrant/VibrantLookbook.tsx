import { useFnbDemo } from '../../core/FnbDemoContext'

export function VibrantLookbook() {
  const { client } = useFnbDemo()

  const lookbookItems = client.lookbook || [
    {
      name: 'Matcha Oat Booster',
      category: 'Desk Focus',
      imageUrl: '/image/fnb/bubleteanjuice/bubleteanjuice (8).jpg',
    },
    {
      name: 'Sparkling Citrus Detox',
      category: 'Sunny Refresh',
      imageUrl: '/image/fnb/bubleteanjuice/bubleteanjuice (9).jpg',
    },
    {
      name: 'Boba Cheese Caramel',
      category: 'Sweet Cravings',
      imageUrl: '/image/fnb/bubleteanjuice/bubleteanjuice (7).jpg',
    },
    {
      name: 'Cold-Pressed Watermelon',
      category: 'Post Workout',
      imageUrl: '/image/fnb/bubleteanjuice/bubleteanjuice (6).jpg',
    },
  ]

  return (
    <section id="gallery" className="border-b border-stone-200/70 bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
              {client.galleryTitle || 'Lookbook: Sips for Every Mood'}
            </h2>
            <span className="text-brand-primary mb-2 block text-xs font-bold tracking-widest uppercase">
              {client.galleryDescription || 'Suasana di Lokasi Kami'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {lookbookItems.slice(0, 4).map((item: any, idx: number) => (
            <div
              key={idx}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm"
            >
              <img
                src={
                  item.imageUrl || `/image/fnb/bubleteanjuice/bubleteanjuice (${(idx % 9) + 1}).jpg`
                }
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-stone-900/80 via-transparent to-transparent p-4 text-white"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
