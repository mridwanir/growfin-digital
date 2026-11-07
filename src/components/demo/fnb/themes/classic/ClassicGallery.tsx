import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ClassicGallery() {
  const { client } = useFnbDemo()
  const { ref, isVisible } = useScrollReveal(0.1)

  const fallbackImages = [
    '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
    '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
    '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
    '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
    '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  ]

  const images =
    client.lookbook && client.lookbook.length > 0
      ? client.lookbook.map(l => l.imageUrl)
      : fallbackImages

  // Ensure we always have 5 images to fit the CSS grid, padding with fallbacks if needed
  const displayImages = [...images]
  while (displayImages.length < 5) {
    displayImages.push(fallbackImages[displayImages.length % fallbackImages.length])
  }

  return (
    <section id="gallery" className="mx-auto max-w-7xl bg-stone-50 px-4 py-16">
      <div
        ref={ref}
        className={`mb-10 transform text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <h2 className="mb-2 text-3xl font-bold text-stone-900">
          {client.galleryTitle || 'Suasana & Rasa'}
        </h2>
        <p className="text-stone-500">
          {client.galleryDescription || 'Intip kenyamanan ruang dan sajian estetis kami'}
        </p>
      </div>

      <div
        className={`grid transform auto-rows-[150px] grid-cols-2 gap-4 transition-all delay-300 duration-1000 md:auto-rows-[200px] md:grid-cols-4 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImages[0]}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            alt="Cafe gallery 1"
          />
        </div>
        <div className="overflow-hidden rounded-2xl shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImages[1]}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            alt="Cafe gallery 2"
          />
        </div>
        <div className="overflow-hidden rounded-2xl shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImages[2]}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            alt="Cafe gallery 3"
          />
        </div>
        <div className="col-span-2 overflow-hidden rounded-2xl shadow-md md:col-span-1 md:row-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImages[3]}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            alt="Cafe gallery 4"
          />
        </div>
        <div className="overflow-hidden rounded-2xl shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImages[4]}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            alt="Cafe gallery 5"
          />
        </div>
      </div>
    </section>
  )
}
