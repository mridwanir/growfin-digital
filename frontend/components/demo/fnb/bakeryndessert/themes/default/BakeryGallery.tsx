import { useFnbDemo } from '../../../core/FnbDemoContext';

export function BakeryGallery() {
  const { client } = useFnbDemo();
  
  // Use lookbook from client or fallback to default
  const lookbookItems = client.lookbook || client.metadata?.lookbook || [
    {
      name: "High Tea Set & Viennoiserie",
      desc: "Padukan Butter Croissant renyah dengan Artisan Earl Grey Tea untuk santap sore elegan bersama sahabat.",
      category: "Weekend Gathering",
      imageUrl: "/image/fnb/bakeryndessert/bakeryndessert (8).jpg"
    },
    {
      name: "Minimalist Korean Cake Style",
      desc: "Pilihan tepat untuk ulang tahun estetik. Dekorasi bunga mawar segar dan lilin ulir warna pastel.",
      category: "Intimate Celebration",
      imageUrl: "/image/fnb/bakeryndessert/bakeryndessert (9).jpg"
    },
    {
      name: "French Macaron & Eclair Giftset",
      desc: "Paket bingkisan mewah dengan pita satin premium. Hadiah sempurna untuk klien bisnis atau keluarga terkasih.",
      category: "Artisan Box Gifts",
      imageUrl: "/image/fnb/bakeryndessert/bakeryndessert (10).jpg"
    }
  ];

  return (
    <section id="lookbook" className="py-20 bg-stone-100 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Lookbook & Inspirasi Penyajian</span>
          <h2 className="font-serif-title text-3xl sm:text-4xl text-stone-900 font-bold mt-2">Momen Manis di Meja Anda</h2>
          <p className="text-stone-600 text-sm mt-2">Ide padu-padan pastry untuk tea party intim, perayaan ulang tahun estetik, hingga hampers gift mewah.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbookItems.map((item: any, idx: number) => (
            <div key={idx} className="group relative rounded-3xl overflow-hidden shadow-md bg-white">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={item.imageUrl || `/image/fnb/bakeryndessert/bakeryndessert (${(idx % 10) + 1}).jpg`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <span className="text-xs uppercase tracking-wider text-brand-primary font-bold">{item.category || 'Lookbook'}</span>
                <h3 className="font-serif-title text-xl font-bold text-stone-900 mt-1">{item.name}</h3>
                <p className="text-sm text-stone-600 mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
