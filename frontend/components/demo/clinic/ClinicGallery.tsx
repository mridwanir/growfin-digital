'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getServiceImageUrl } from './ClinicServicesPricing';

export function ClinicGallery() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="gallery" className="py-20 bg-gray-900 text-white -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-light font-semibold tracking-wide uppercase text-sm mb-2">Fasilitas & Hasil Kerja</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Didukung Teknologi Terkini</h3>
          <p className="text-gray-400">Transparansi adalah kunci. Lihat sendiri kualitas peralatan yang kami gunakan dan bukti nyata hasil pengerjaan kami.</p>
        </div>

        <div 
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {/* Large Image */}
          <div className="col-span-2 row-span-2 overflow-hidden rounded-xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getServiceImageUrl(5)} alt="Fasilitas Utama" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
          </div>
          
          {/* Small Images */}
          <div className="overflow-hidden rounded-xl bg-gray-800 aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getServiceImageUrl(2)} alt="Alat Modern" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
          </div>
          
          <div className="overflow-hidden rounded-xl bg-gray-800 aspect-square relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getServiceImageUrl(3)} alt="Ruang Tunggu" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
          </div>
          
          <div className="overflow-hidden rounded-xl bg-gray-800 aspect-square relative">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-black overflow-hidden border-r-2 border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getServiceImageUrl(7)} alt="Before" className="w-full h-full object-cover opacity-70" />
              </div>
              <div className="w-1/2 bg-black overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getServiceImageUrl(8)} alt="After" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Before</div>
            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">After</div>
          </div>
          
          <div className="overflow-hidden rounded-xl bg-gray-800 aspect-square flex items-center justify-center relative group cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getServiceImageUrl(10)} alt="Lebih Banyak" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-700" />
            <span className="absolute text-lg font-bold"><span>🖼️</span> Lihat Galeri</span>
          </div>
        </div>
      </div>
    </section>
  );
}
