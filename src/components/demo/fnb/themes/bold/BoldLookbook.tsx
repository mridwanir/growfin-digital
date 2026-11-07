import { useFnbDemo } from '../../core/FnbDemoContext'

export function BoldLookbook() {
  const { client } = useFnbDemo()

  const lookbookItems = client.lookbook || [
    {
      name: 'Party Platter & Crispy Loaded Fries',
      desc: 'Ideal untuk 3-4 orang. Kombinasi 2 Burger Signature, 6pcs Korean Wings, dan Truffle Fries Jumbo.',
      category: 'Style #01: Weekend Binge',
      imageUrl: '/image/fnb/fastfood/fastfood (8).jpg',
    },
    {
      name: 'Nashville Hot Chicken & Fizzy Slush',
      desc: 'Tingkat kepedasan level 3 dipadukan dengan Lemon Sparkling dingin penyegar dahaga.',
      category: 'Style #02: Solo Soul Food',
      imageUrl: '/image/fnb/fastfood/fastfood (9).jpg',
    },
    {
      name: 'Onion Rings with Garlic Aioli',
      desc: 'Camilan renyah sore hari pendamping kerjaan dengan saus rempah rahasia.',
      category: 'Style #03: Coffee & Snack Break',
      imageUrl: '/image/fnb/fastfood/fastfood (10).jpg',
    },
  ]

  return (
    <section id="gallery" className="bg-neutral-100 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
            {client.galleryTitle || 'Inspirasi Padu-Padan Meja Makan'}
          </h2>
          <span className="text-brand-primary mb-2 block text-xs font-bold tracking-widest uppercase">
            {client.galleryDescription || 'Suasana di Lokasi Kami'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {lookbookItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className="group relative aspect-3/4 overflow-hidden rounded-3xl shadow-md"
            >
              <img
                src={item.imageUrl || `/image/fnb/fastfood/fastfood (${(idx % 10) + 1}).jpg`}
                alt={item.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent p-6 text-white">
                <span className="text-brand-primary mb-1 text-xs font-bold tracking-wider uppercase">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
