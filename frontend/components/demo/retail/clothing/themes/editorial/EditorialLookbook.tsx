'use client';

import { useClothingDemo } from '../../core/ClothingContext';

export function EditorialLookbook() {
  const { client } = useClothingDemo();
  return (
    <section id="lookbook" className="py-24 bg-[#F5F5F5] px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <h2 className="text-4xl md:text-5xl font-serif-custom">Curated <br/> <span className="italic text-[#8E8E8E]">Looks</span></h2>
              <p className="max-w-sm text-[#8E8E8E] font-light">Draw inspiration from our seasonal lookbook. Unconventional pairings for the contemporary eye.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 relative group cursor-pointer">
                  <img src="/image/retail/clothing/caio-coelho-QRN47la37gw-unsplash.jpg" alt="Look 1" className="w-full h-[600px] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                       onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" }} />
                  <p className="mt-4 text-sm uppercase tracking-widest text-[#2A2A2A]">01 — {client.name} Signature</p>
              </div>
              
              <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 md:mt-24">
                  <div className="md:col-start-2 relative group cursor-pointer">
                      <img src="/image/retail/clothing/dmitry-ganin-EhWzbMPQcqQ-unsplash.jpg" alt="Look 2" className="w-full h-[400px] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                           onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1550614000-4b9560f61208?q=80&w=600&auto=format&fit=crop" }} />
                      <p className="mt-4 text-sm uppercase tracking-widest text-[#2A2A2A]">02 — Fluid Textures</p>
                  </div>
                  <div className="md:col-span-2 relative group mt-8 cursor-pointer">
                      <img src="/image/retail/clothing/tanya-layko-QINaeQQHghQ-unsplash.jpg" alt="Look 3" className="w-full h-[450px] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                           onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1434389678232-06b2a413f12a?q=80&w=1200&auto=format&fit=crop" }} />
                      <p className="mt-4 text-sm uppercase tracking-widest text-[#2A2A2A]">03 — Earth Tones</p>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
}
