import { useFnbDemo } from '../../core/FnbDemoContext'

export function PremiumGallery() {
  const { client } = useFnbDemo()
  const images =
    client.lookbook && client.lookbook.length > 0
      ? client.lookbook.map(l => l.imageUrl)
      : [
          '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
          '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
          '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
          '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
        ]

  return (
    <section id="gallery" className="border-t border-slate-800 bg-slate-900 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-16 text-center transition-all duration-1000">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {client.galleryTitle || 'The Atmosphere'}
          </h2>
          <p className="mx-auto max-w-xl text-slate-400">
            {client.galleryDescription ||
              'A glimpse into our meticulously designed space, where modern elegance meets cozy warmth.'}
          </p>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div className="group relative col-span-2 row-span-2 overflow-hidden">
            <img
              src={images[0]}
              alt="Gallery 1"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent"></div>
          </div>
          <div className="group relative col-span-1 row-span-1 overflow-hidden">
            <img
              src={images[1]}
              alt="Gallery 2"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="group relative col-span-1 row-span-2 overflow-hidden">
            <img
              src={images[2]}
              alt="Gallery 3"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="group relative col-span-1 row-span-1 overflow-hidden">
            <img
              src={images[3]}
              alt="Gallery 4"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
