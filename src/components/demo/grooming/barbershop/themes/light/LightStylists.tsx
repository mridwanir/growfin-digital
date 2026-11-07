import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LightStylists() {
  const { client } = useGroomingDemo()
  const images = client.instagramFeed || [
    '/image/grooming/barber/4.jpg',
    '/image/grooming/barber/5.jpg',
    '/image/grooming/barber/6.jpg',
  ]

  const stylists = client.practitioners?.length
    ? client.practitioners.map((p, i) => ({
        name: p.name,
        title: p.role,
        img: p.avatarUrl || images[i % images.length],
      }))
    : [
        { name: 'Valerie', title: 'Master Colorist', img: images[0] },
        { name: 'Jessica', title: 'Styling & Blowout Director', img: images[1 % images.length] },
        { name: 'Nadia', title: 'Keratin & Texture Expert', img: images[2 % images.length] },
      ]

  return (
    <section id="stylists" className="bg-blush-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-charcoal-900 mb-4 font-serif text-4xl">Meet The Artists</h2>
          <p className="text-charcoal-800 text-sm font-light">
            Penata rambut terbaik, siap merawat mahkota Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2 md:grid-cols-3">
          {stylists.map((stylist, idx) => (
            <div key={idx} className="group">
              <div className="relative mx-auto mb-6 h-56 w-56">
                <img
                  src={stylist.img}
                  alt={stylist.name}
                  className="group-hover:border-brand-primary h-full w-full rounded-full border-4 border-white object-cover shadow-lg transition-colors duration-300"
                />
              </div>
              <h3 className="text-charcoal-900 font-serif text-2xl">{stylist.name}</h3>
              <p className="text-brand-primary mt-2 text-xs font-semibold tracking-wider uppercase">
                {stylist.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
