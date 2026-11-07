import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaArtists() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo()

  const defaultImages = [
    '/image/grooming/nailspa/1.jpg',
    '/image/grooming/nailspa/2.jpg',
    '/image/grooming/nailspa/3.jpg',
  ]

  const artists = client.practitioners?.length
    ? client.practitioners.map((p, i) => ({
        name: p.name,
        title: p.role,
        img: p.avatarUrl || defaultImages[i % defaultImages.length],
      }))
    : [
        {
          name: 'Clarissa Hartono',
          title: 'Lead Creative & 3D Art Expert',
          img: defaultImages[0],
          roleBadge: 'Master Artist',
        },
        {
          name: 'Nadine Aurelia',
          title: 'Russian Manicure & Minimalist',
          img: defaultImages[1],
          roleBadge: 'Senior Specialist',
        },
        {
          name: 'Valerie Wong',
          title: 'Apres Gel & Bridal Designer',
          img: defaultImages[2],
          roleBadge: 'Bridal Specialist',
        },
      ]

  const handleBook = (artistName: string) => {
    setIsBookingModalOpen(true)
    // You could also set a selectedArtist state in context if needed
  }

  return (
    <section id="artists" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-brand-primary mb-2 text-xs font-semibold tracking-[0.25em] uppercase">
            Artisans Behind The Work
          </p>
          <h2 className="text-charcoal font-serif text-3xl sm:text-5xl">
            Pilih Nail Artist Favoritmu
          </h2>
        </div>
        <p className="max-w-md text-sm font-light text-neutral-500">
          Setiap sentuhan personal. Kamu dapat mencocokkan gaya desain impianmu dengan spesialisasi
          masing-masing artist kami.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {artists.map((artist: any, idx: number) => (
          <div
            key={idx}
            className="border-nude-200/80 rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={artist.img} alt={artist.name} className="h-full w-full object-cover" />
              <span className="bg-charcoal/80 absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] tracking-widest text-white uppercase backdrop-blur-md">
                {artist.roleBadge || artist.title}
              </span>
            </div>
            <h3 className="text-charcoal font-serif text-2xl font-semibold">{artist.name}</h3>
            <p className="text-brand-primary mt-1 truncate text-xs font-semibold tracking-widest uppercase">
              {artist.title}
            </p>
            <button
              onClick={() => handleBook(artist.name)}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary mt-6 w-full rounded-full border py-3 text-xs font-semibold tracking-widest uppercase transition hover:text-white"
            >
              Pilih {artist.name.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
