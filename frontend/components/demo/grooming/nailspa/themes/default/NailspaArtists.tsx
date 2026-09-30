import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaArtists() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo();
  
  const defaultImages = [
    '/image/grooming/nailspa/1.jpg',
    '/image/grooming/nailspa/2.jpg',
    '/image/grooming/nailspa/3.jpg'
  ];

  const artists = client.practitioners?.length ? client.practitioners.map((p, i) => ({
    name: p.name,
    title: p.role,
    img: p.avatarUrl || defaultImages[i % defaultImages.length]
  })) : [
    { name: "Clarissa Hartono", title: "Lead Creative & 3D Art Expert", img: defaultImages[0], roleBadge: "Master Artist" },
    { name: "Nadine Aurelia", title: "Russian Manicure & Minimalist", img: defaultImages[1], roleBadge: "Senior Specialist" },
    { name: "Valerie Wong", title: "Apres Gel & Bridal Designer", img: defaultImages[2], roleBadge: "Bridal Specialist" }
  ];

  const handleBook = (artistName: string) => {
    setIsBookingModalOpen(true);
    // You could also set a selectedArtist state in context if needed
  };

  return (
    <section id="artists" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-primary font-semibold mb-2">Artisans Behind The Work</p>
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal">Pilih Nail Artist Favoritmu</h2>
        </div>
        <p className="text-neutral-500 text-sm max-w-md font-light">
          Setiap sentuhan personal. Kamu dapat mencocokkan gaya desain impianmu dengan spesialisasi masing-masing artist kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {artists.map((artist: any, idx: number) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-nude-200/80 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/5]">
              <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-md text-white text-[11px] uppercase tracking-widest px-3 py-1 rounded-full">
                {artist.roleBadge || artist.title}
              </span>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-charcoal">{artist.name}</h3>
            <p className="text-brand-primary text-xs uppercase tracking-widest font-semibold mt-1 truncate">{artist.title}</p>
            <button onClick={() => handleBook(artist.name)} className="mt-6 w-full py-3 rounded-full border border-brand-primary text-xs uppercase tracking-widest font-semibold text-brand-primary hover:bg-brand-primary hover:text-white transition">
              Pilih {artist.name.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
