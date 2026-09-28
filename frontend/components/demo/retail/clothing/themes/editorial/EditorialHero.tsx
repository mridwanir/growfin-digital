'use client';

import { useClothingDemo } from '../../core/ClothingContext';

export function EditorialHero() {
  const { client } = useClothingDemo();

  return (
    <section className="pt-20 min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-16 md:py-0 order-2 md:order-1 relative">
          <div className="absolute top-10 left-10 hidden md:block text-xs uppercase tracking-[0.3em] text-[#8E8E8E] rotate-90 origin-left">
              {client.name} Collection
          </div>
          
          <span className="inline-block px-3 py-1 border border-[#121212] text-xs uppercase tracking-widest w-max mb-6">
              Season Premiere
          </span>
          <h1 className="text-5xl md:text-7xl font-serif-custom leading-[1.1] mb-6">
              {client.name} <br/> <span className="italic text-[#8E8E8E]">Studio</span>
          </h1>
          <p className="text-[#8E8E8E] mb-10 max-w-md text-lg font-light leading-relaxed">
              {client.tagline || 'Elevate your everyday wardrobe with our carefully curated essentials. Designed for the modern minimalist.'}
          </p>
          <a href="#shop" className="bg-[#121212] text-white text-sm uppercase tracking-widest px-8 py-4 w-max hover:bg-[#8C907E] transition-colors duration-300">
              Explore Collection
          </a>
      </div>
      
      <div className="w-full md:w-1/2 h-[60vh] md:h-auto order-1 md:order-2">
          <img src="/image/retail/clothing/mediamodifier-7cERndkOyDw-unsplash.jpg" alt="Editorial Hero" className="w-full h-full object-cover" 
               onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" }} />
      </div>
    </section>
  );
}
