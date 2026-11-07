import { useFnbDemo } from '../../core/FnbDemoContext'

export function ElegantGallery() {
  const { client } = useFnbDemo()

  // Use lookbook from client or fallback to default
  const lookbookItems = client.lookbook || [
    {
      name: 'High Tea Set & Viennoiserie',
      desc: 'Padukan Butter Croissant renyah dengan Artisan Earl Grey Tea untuk santap sore elegan bersama sahabat.',
      category: 'Weekend Gathering',
      imageUrl: '/image/fnb/bakeryndessert/bakeryndessert (8).jpg',
    },
    {
      name: 'Minimalist Korean Cake Style',
      desc: 'Pilihan tepat untuk ulang tahun estetik. Dekorasi bunga mawar segar dan lilin ulir warna pastel.',
      category: 'Intimate Celebration',
      imageUrl: '/image/fnb/bakeryndessert/bakeryndessert (9).jpg',
    },
    {
      name: 'French Macaron & Eclair Giftset',
      desc: 'Paket bingkisan mewah dengan pita satin premium. Hadiah sempurna untuk klien bisnis atau keluarga terkasih.',
      category: 'Artisan Box Gifts',
      imageUrl: '/image/fnb/bakeryndessert/bakeryndessert (10).jpg',
    },
  ]

  return (
    <section id="gallery" className="border-y border-stone-200 bg-stone-100 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-serif-title mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            {client.galleryTitle || 'Momen Manis di Meja Anda'}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {client.galleryDescription ||
              'Ide padu-padan pastry untuk tea party intim, perayaan ulang tahun estetik, hingga hampers gift mewah.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {lookbookItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-md"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={
                    item.imageUrl ||
                    `/image/fnb/bakeryndessert/bakeryndessert (${(idx % 10) + 1}).jpg`
                  }
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-brand-primary text-xs font-bold tracking-wider uppercase">
                  {item.category || 'Lookbook'}
                </span>
                <h3 className="font-serif-title mt-1 text-xl font-bold text-stone-900">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
