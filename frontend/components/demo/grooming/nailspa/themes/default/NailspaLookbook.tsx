import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaLookbook() {
  const { client } = useGroomingDemo();
  const gallery = client.instagramFeed?.length ? client.instagramFeed : [
    '/image/grooming/nailspa/4.jpg',
    '/image/grooming/nailspa/5.jpg',
    '/image/grooming/nailspa/6.jpg',
    '/image/grooming/nailspa/1.jpg'
  ];

  return (
    <section id="lookbook" className="py-24 bg-nude-100/50 border-t border-nude-200/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-primary font-semibold mb-3">Recent Gallery</p>
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal">The Lookbook</h2>
          <p className="mt-3 text-neutral-600 text-sm">
            Karya nyata dari jemari nail artist kami minggu ini di salon.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {gallery.map((img: string, idx: number) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-200 shadow-sm">
              <img src={img} alt={`Lookbook ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <p className="font-serif text-base">Inspirasi {idx + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
