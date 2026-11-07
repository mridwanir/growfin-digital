import { useFnbDemo } from '../../core/FnbDemoContext'

export function ArtisanGallery() {
  const { client } = useFnbDemo()
  const fallbackImages = [
    '/image/fnb/restaurant/restaurant (8).jpg',
    '/image/fnb/restaurant/restaurant (9).jpg',
    '/image/fnb/restaurant/restaurant (10).jpg',
    '/image/fnb/restaurant/restaurant (2).jpg',
  ]
  const images =
    client.lookbook && client.lookbook.length > 0
      ? client.lookbook.map(l => l.imageUrl)
      : fallbackImages

  return (
    <section id="gallery" className="bg-stone-900 py-20 text-stone-100">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-serif-title mt-1 text-3xl font-bold md:text-4xl">
            {client.galleryTitle || 'Galeri Ruang & Rasa'}
          </h2>
          <span className="text-brand-primary text-xs font-semibold tracking-wider uppercase">
            {client.galleryDescription ||
              'Ruang yang dirancang untuk produktivitas kerja santai, obrolan intim, hingga makan malam istimewa.'}
          </span>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
            <img
              src={images[0] || fallbackImages[0]}
              alt="Gallery 1"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-stone-950/80 via-transparent to-transparent p-5">
              <span className="text-sm font-medium text-stone-200">Main Hall & Indoor Bar</span>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src={images[1] || fallbackImages[1]}
              alt="Gallery 2"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-stone-950/30 transition group-hover:bg-transparent"></div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src={images[2] || fallbackImages[2]}
              alt="Gallery 3"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-stone-950/30 transition group-hover:bg-transparent"></div>
          </div>
          <div className="group relative col-span-2 overflow-hidden rounded-2xl">
            <img
              src={images[3] || fallbackImages[3]}
              alt="Gallery 4"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-stone-950/80 via-transparent to-transparent p-5">
              <span className="text-sm font-medium text-stone-200">Artisan Plating Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
