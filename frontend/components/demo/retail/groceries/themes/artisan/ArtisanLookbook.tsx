'use client';

export function ArtisanLookbook() {
  return (
    <section id="lookbook" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--theme-color)]">Kurasi Kuliner & Dapur</span>
          <h2 className="text-3xl font-serif-display font-bold text-zinc-900 mt-1">Lookbook Menu Segar Sepekan</h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-sm">Temukan inspirasi padu padan bahan segar untuk sajian rumah ala chef berbintang.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Lookbook Card 1 (Large 7 Cols) */}
        <div className="md:col-span-7 group rounded-3xl overflow-hidden bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-lg transition duration-300">
          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80" alt="Gourmet Bowl" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-zinc-800">
              Menu 01 • Clean Living
            </span>
          </div>
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif-display font-bold text-zinc-900">Hydroponic Green Goddess Bowl</h3>
              <p className="text-xs text-zinc-500 mt-1">Paduan selada romaine renyah, mentimun jepang, alpukat hass, dan dressing herba.</p>
            </div>
            <a href="#katalog" className="shrink-0 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-[var(--theme-color)] text-white text-xs font-bold tracking-wider uppercase transition text-center cursor-pointer">
              Beli Bahan
            </a>
          </div>
        </div>

        {/* Lookbook Card 2 (5 Cols) */}
        <div className="md:col-span-5 group rounded-3xl overflow-hidden bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-lg transition duration-300">
          <div className="relative aspect-[16/10] md:aspect-auto md:h-64 overflow-hidden bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" alt="Steak Grill" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-zinc-800">
              Menu 02 • Chef Choice
            </span>
          </div>
          <div className="p-6 flex flex-col justify-between gap-4 h-full">
            <div>
              <h3 className="text-lg font-serif-display font-bold text-zinc-900">Garlic Butter Ribeye & Herb Roast</h3>
              <p className="text-xs text-zinc-500 mt-1">Daging meltique lembut dipadu baby rosemary dan mentega artisan.</p>
            </div>
            <a href="#katalog" className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-[var(--theme-color)] text-white text-xs font-bold tracking-wider uppercase transition text-center cursor-pointer">
              Beli Bahan
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
