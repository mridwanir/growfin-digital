import { useFnbDemo } from '../../core/FnbDemoContext'

export function ModernGallery() {
  const { client } = useFnbDemo()

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

  return (
    <section id="gallery" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-end justify-between md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-bold text-stone-900 lg:text-4xl">
              {client.galleryTitle || 'Momen & Ruang'}
            </h2>
            <p className="text-stone-500">
              {client.galleryDescription ||
                'Dirancang untuk kenyamanan, mengabadikan setiap momen kebersamaan Anda bersama kami.'}
            </p>
          </div>
        </div>

        <div className="columns-2 gap-4 space-y-4 md:columns-3">
          {images.map((img, i) => (
            <div key={i} className="group break-inside-avoid overflow-hidden rounded-2xl">
              <img
                src={img}
                alt="Gallery"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
