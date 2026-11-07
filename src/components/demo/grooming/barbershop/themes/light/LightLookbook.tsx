import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LightLookbook() {
  const { client } = useGroomingDemo()
  const images = client.instagramFeed || [
    '/image/grooming/barber/1.jpg',
    '/image/grooming/barber/2.jpg',
    '/image/grooming/barber/3.jpg',
  ]

  const lookbookItems = [
    { title: 'Ash Blonde Balayage', author: 'By Valerie', img: images[0] },
    { title: 'Volume Blowout', author: 'By Jessica', img: images[1 % images.length] },
    { title: 'Glass Hair Keratin', author: 'By Nadia', img: images[2 % images.length] },
  ]

  return (
    <section id="lookbook" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-charcoal-900 mb-4 font-serif text-4xl">Galeri Gaya</h2>
          <p className="text-charcoal-800 text-sm font-light tracking-wide">
            Transformasi rambut sempurna untuk setiap kepribadian.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {lookbookItems.map((item, idx) => (
            <div key={idx} className="group relative h-[450px] overflow-hidden rounded-lg">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="from-charcoal-900/80 absolute inset-0 flex items-end bg-gradient-to-t to-transparent p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div>
                  <h3 className="mb-1 font-serif text-2xl text-white">{item.title}</h3>
                  <p className="text-blush-100 text-sm font-light">{item.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
