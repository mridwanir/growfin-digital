import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BarbershopLookbook() {
  const { client } = useGroomingDemo()
  // Use images from metadata or fallback to placeholders
  const images = client.instagramFeed || [
    '/image/grooming/barber/1.jpg',
    '/image/grooming/barber/2.jpg',
    '/image/grooming/barber/3.jpg',
  ]

  const lookbookItems = [
    { title: 'CLASSIC POMPADOUR', img: images[0] },
    { title: 'EXECUTIVE FADE', img: images[1 % images.length] },
    { title: 'HOT TOWEL BEARD SHAVE', img: images[2 % images.length] },
  ]

  return (
    <section id="lookbook" className="bg-vintage-800 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-display mb-4 text-4xl text-white uppercase">Galeri Karya</h2>
          <p className="text-paper/60 font-serif italic">
            Presisi dalam setiap tarikan mesin dan gunting.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {lookbookItems.map((item, idx) => (
            <div key={idx} className="group relative h-[400px] overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="bg-vintage-900/80 group-hover:border-brand-primary/50 absolute inset-0 flex items-center justify-center border-4 border-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-brand-primary font-display px-4 text-center text-2xl tracking-wide uppercase">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
