
export function DayspaLookbook() {
  return (
    <section id="lookbook" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
        <span className="text-xs tracking-[0.25em] text-brand-primary font-semibold uppercase">Visual Atmosphere</span>
        <h2 className="font-serif-dayspa text-4xl sm:text-5xl font-normal text-[#2B2623]">Lookbook Sanctuary</h2>
        <p className="text-sm text-[#2B2623]/70 font-light">Eksplorasi sudut ruang yang dirancang khusus untuk memanjakan kelima panca indra Anda.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px]">
        {/* Gallery Item 1 */}
        <div className="relative rounded-2xl overflow-hidden group col-span-2 row-span-2">
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80" 
               alt="Private Suite" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2623]/80 via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <span className="text-[10px] tracking-widest uppercase text-brand-primary font-semibold">Private Couple Suite</span>
            <p className="font-serif-dayspa text-2xl">Bilik Pijat dengan Bathtub Kayu Cedar</p>
          </div>
        </div>

        {/* Gallery Item 2 */}
        <div className="relative rounded-2xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80" 
               alt="Aromatherapy Bottles" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-[#2B2623]/20 group-hover:bg-[#2B2623]/40 transition-colors"></div>
        </div>

        {/* Gallery Item 3 */}
        <div className="relative rounded-2xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80" 
               alt="Relaxation Lounge" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-[#2B2623]/20 group-hover:bg-[#2B2623]/40 transition-colors"></div>
        </div>

        {/* Gallery Item 4 */}
        <div className="relative rounded-2xl overflow-hidden group col-span-2">
          <img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80" 
               alt="Herbal Compress" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2623]/70 to-transparent"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <p className="font-serif-dayspa text-lg">Pojok Teh Herbal & Relaksasi Pasca Treatment</p>
          </div>
        </div>
      </div>
    </section>
  );
}
