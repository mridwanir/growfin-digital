export function DayspaLookbook() {
  return (
    <section id="lookbook" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-16 max-w-xl space-y-3 text-center">
        <span className="text-brand-primary text-xs font-semibold tracking-[0.25em] uppercase">
          Visual Atmosphere
        </span>
        <h2 className="font-serif-dayspa text-4xl font-normal text-[#2B2623] sm:text-5xl">
          Lookbook Sanctuary
        </h2>
        <p className="text-sm font-light text-[#2B2623]/70">
          Eksplorasi sudut ruang yang dirancang khusus untuk memanjakan kelima panca indra Anda.
        </p>
      </div>

      <div className="grid auto-rows-[220px] grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {/* Gallery Item 1 */}
        <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
            alt="Private Suite"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2623]/80 via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <span className="text-brand-primary text-[10px] font-semibold tracking-widest uppercase">
              Private Couple Suite
            </span>
            <p className="font-serif-dayspa text-2xl">Bilik Pijat dengan Bathtub Kayu Cedar</p>
          </div>
        </div>

        {/* Gallery Item 2 */}
        <div className="group relative overflow-hidden rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80"
            alt="Aromatherapy Bottles"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#2B2623]/20 transition-colors group-hover:bg-[#2B2623]/40"></div>
        </div>

        {/* Gallery Item 3 */}
        <div className="group relative overflow-hidden rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80"
            alt="Relaxation Lounge"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#2B2623]/20 transition-colors group-hover:bg-[#2B2623]/40"></div>
        </div>

        {/* Gallery Item 4 */}
        <div className="group relative col-span-2 overflow-hidden rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80"
            alt="Herbal Compress"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2623]/70 to-transparent"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <p className="font-serif-dayspa text-lg">
              Pojok Teh Herbal & Relaksasi Pasca Treatment
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
