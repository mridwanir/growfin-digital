import { useFnbDemo } from '../../../core/FnbDemoContext';

export function BubbleteaLookbook() {
  const { client } = useFnbDemo();
  
  const lookbookItems = client.lookbook || client.metadata?.lookbook || [
    {
      name: "Matcha Oat Booster",
      category: "Desk Focus",
      imageUrl: "/image/fnb/bubleteanjuice/bubleteanjuice (8).jpg"
    },
    {
      name: "Sparkling Citrus Detox",
      category: "Sunny Refresh",
      imageUrl: "/image/fnb/bubleteanjuice/bubleteanjuice (9).jpg"
    },
    {
      name: "Boba Cheese Caramel",
      category: "Sweet Cravings",
      imageUrl: "/image/fnb/bubleteanjuice/bubleteanjuice (7).jpg"
    },
    {
      name: "Cold-Pressed Watermelon",
      category: "Post Workout",
      imageUrl: "/image/fnb/bubleteanjuice/bubleteanjuice (6).jpg"
    }
  ];

  return (
    <section id="lookbook" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">Inspirasi Momen</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">Lookbook: Sips for Every Mood</h2>
          </div>
          <p className="text-stone-500 text-sm max-w-md mt-2 md:mt-0">
            Temukan paduan racikan terbaik untuk menemani kerja kantoran, santai sore, hingga kumpul bersama sahabat.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lookbookItems.slice(0, 4).map((item: any, idx: number) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-sm">
              <img src={item.imageUrl || `/image/fnb/bubleteanjuice/bubleteanjuice (${(idx % 9) + 1}).jpg`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-xs font-semibold uppercase text-brand-light">{item.category}</span>
                <p className="text-sm font-bold">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
