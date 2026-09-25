'use client';

import { useRetailDemo } from './RetailDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function RetailHeroScreen() {
  const { client } = useRetailDemo();
  const { ref: heroRef, isVisible: isHeroVisible } = useScrollReveal(0.1);
  const { ref: lookbookRef, isVisible: isLookbookVisible } = useScrollReveal(0.1);

  // Fallback images if not provided
  const heroImg = '/image/retail/heather-ford-5gkYsrH_ebY-unsplash.jpg';
  
  const lookbooks = client.lookbook && client.lookbook.length >= 3 
    ? client.lookbook 
    : [
        { id: '1', name: 'Casual Elegance', imageUrl: '/image/retail/alina-bordunova-Lq78VGxRJhc-unsplash.jpg' },
        { id: '2', name: 'Urban Chic', imageUrl: '/image/retail/caio-coelho-QRN47la37gw-unsplash.jpg' },
        { id: '3', name: 'Modern Classic', imageUrl: '/image/retail/tanya-layko-QINaeQQHghQ-unsplash.jpg' }
      ];

  return (
    <>
      <section id="home" className="relative bg-gray-50 -mt-8 mx-[-16px] sm:mx-0 sm:rounded-[40px] overflow-hidden">
        <div 
          ref={heroRef}
          className={`relative h-[70vh] w-full overflow-hidden transition-all duration-1000 transform ${isHeroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt="Hero" className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col justify-center items-start">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-primary text-white text-sm font-semibold tracking-wide mb-4">
              PILIHAN TERBAIK MINGGU INI
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-2xl">
              {client.tagline}
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-xl">
              Koleksi premium terbaru dengan kualitas tinggi. Tingkatkan kepercayaan dirimu dengan sentuhan elegan dari {client.name}.
            </p>
            <a href="#koleksi" className="bg-white text-brand-dark px-8 py-4 rounded-full font-bold hover:bg-brand-light hover:text-brand-dark transition-colors shadow-lg">
              Belanja Sekarang
            </a>
          </div>
        </div>
      </section>

      <section id="lookbook" className="py-20 bg-white">
        <div 
          ref={lookbookRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isLookbookVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lookbook Inspirasi</h2>
            <p className="text-gray-500">Padu padan gaya terbaik untuk setiap momen berhargamu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
            {lookbooks[0] && (
              <div className="relative rounded-2xl overflow-hidden group md:col-span-2 md:row-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lookbooks[0].imageUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Trend 1" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xl font-semibold">{lookbooks[0].name}</p>
                </div>
              </div>
            )}
            {lookbooks[1] && (
              <div className="relative rounded-2xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lookbooks[1].imageUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Trend 2" />
              </div>
            )}
            {lookbooks[2] && (
              <div className="relative rounded-2xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lookbooks[2].imageUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Trend 3" />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
