import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BarbershopBarbers() {
  const { client } = useGroomingDemo()
  const images = client.instagramFeed || [
    '/image/grooming/barber/4.jpg',
    '/image/grooming/barber/5.jpg',
    '/image/grooming/barber/6.jpg',
  ]

  const barbers = client.practitioners?.length
    ? client.practitioners.map((p, i) => ({
        name: p.name,
        title: p.role,
        img: p.avatarUrl || images[i % images.length],
      }))
    : [
        { name: 'ALEX', title: 'MASTER BARBER', img: images[0] },
        { name: 'RAKA', title: 'FADE & TEXTURE SPECIALIST', img: images[1 % images.length] },
        { name: 'DONI', title: 'SENIOR HAIR THERAPIST', img: images[2 % images.length] },
      ]

  return (
    <section id="barbers" className="bg-vintage-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-display mb-4 text-4xl text-white uppercase">The Craftsmen</h2>
          <p className="text-paper/60 font-serif italic">Seniman di balik setiap mahakarya.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2 md:grid-cols-3">
          {barbers.map((barber, idx) => (
            <div key={idx}>
              <img
                src={barber.img}
                alt={barber.name}
                className="border-vintage-700 hover:border-brand-primary mx-auto mb-6 h-56 w-56 rounded-none border-4 object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
              <h3 className="font-display text-2xl text-white uppercase">{barber.name}</h3>
              <p className="text-brand-primary font-display mt-2 text-sm tracking-widest uppercase">
                {barber.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
