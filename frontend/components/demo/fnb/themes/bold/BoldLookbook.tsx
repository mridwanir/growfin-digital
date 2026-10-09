import { useFnbDemo } from '../../core/FnbDemoContext';

export function BoldLookbook() {
  const { client } = useFnbDemo();

  const lookbookItems = client.lookbook || client.metadata?.lookbook || [
    {
      name: "Party Platter & Crispy Loaded Fries",
      desc: "Ideal untuk 3-4 orang. Kombinasi 2 Burger Signature, 6pcs Korean Wings, dan Truffle Fries Jumbo.",
      category: "Style #01: Weekend Binge",
      imageUrl: "/image/fnb/fastfood/fastfood (8).jpg"
    },
    {
      name: "Nashville Hot Chicken & Fizzy Slush",
      desc: "Tingkat kepedasan level 3 dipadukan dengan Lemon Sparkling dingin penyegar dahaga.",
      category: "Style #02: Solo Soul Food",
      imageUrl: "/image/fnb/fastfood/fastfood (9).jpg"
    },
    {
      name: "Onion Rings with Garlic Aioli",
      desc: "Camilan renyah sore hari pendamping kerjaan dengan saus rempah rahasia.",
      category: "Style #03: Coffee & Snack Break",
      imageUrl: "/image/fnb/fastfood/fastfood (10).jpg"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">{client.galleryTitle || 'Inspirasi Padu-Padan Meja Makan'}</h2>
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest block mb-2">{client.galleryDescription || 'Suasana di Lokasi Kami'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbookItems.map((item: any, idx: number) => (
            <div key={idx} className="group relative rounded-3xl overflow-hidden shadow-md aspect-3/4">
              <img src={item.imageUrl || `/image/fnb/fastfood/fastfood (${(idx % 10) + 1}).jpg`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-brand-primary text-xs font-bold uppercase tracking-wider mb-1">{item.category}</span>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
