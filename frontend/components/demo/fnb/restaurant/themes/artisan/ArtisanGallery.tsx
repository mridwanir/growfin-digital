export function ArtisanGallery() {
  return (
    <section id="lookbook" className="bg-stone-900 py-20 text-stone-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-primary font-semibold tracking-wider text-xs uppercase">Atmosfer & Estetika</span>
          <h2 className="font-serif-title text-3xl md:text-4xl font-bold mt-1">Galeri Ruang & Rasa</h2>
          <p className="text-stone-400 text-sm mt-3">Ruang yang dirancang untuk produktivitas kerja santai, obrolan intim, hingga makan malam istimewa.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl">
            <img src="/image/fnb/restaurant/restaurant (8).jpg" alt="Cafe Corner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
              <span className="text-sm font-medium text-stone-200">Main Hall & Indoor Bar</span>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-2xl">
            <img src="/image/fnb/restaurant/restaurant (9).jpg" alt="Brewing" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-transparent transition"></div>
          </div>
          <div className="relative group overflow-hidden rounded-2xl">
            <img src="/image/fnb/restaurant/restaurant (10).jpg" alt="Coffee Table" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-transparent transition"></div>
          </div>
          <div className="col-span-2 relative group overflow-hidden rounded-2xl">
            <img src="/image/fnb/restaurant/restaurant (2).jpg" alt="Culinary Plating" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
              <span className="text-sm font-medium text-stone-200">Artisan Plating Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
