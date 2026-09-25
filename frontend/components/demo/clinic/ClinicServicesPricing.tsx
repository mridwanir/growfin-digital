'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const SERVICE_IMAGES = [
  '/image/service/anton-savinov-aQxOYwG_GyI-unsplash.jpg',
  '/image/service/arlington-research-Kz8nHVg_tGI-unsplash.jpg',
  '/image/service/arlington-research-kN_kViDchA0-unsplash.jpg',
  '/image/service/baljkann-4-wnpf3Q5pkXA-unsplash.jpg',
  '/image/service/cova-software-ddA5Xh7yWrQ-unsplash.jpg',
  '/image/service/emmanuel-ikwuegbu--0-kl1BjvFc-unsplash.jpg',
  '/image/service/giorgio-tomassetti-mTslIt14OUo-unsplash.jpg',
  '/image/service/helcim-payments-jQvkte13Emc-unsplash.jpg',
  '/image/service/patrick-tomasso-fMntI8HAAB8-unsplash.jpg',
  '/image/service/photo-1559839734-2b71ea197ec2.jpg',
  '/image/service/ricardo-iv-tamayo-nApaD08bFAE-unsplash.jpg',
  '/image/service/ux-indonesia-2NDWFiD0UMM-unsplash.jpg'
];

export const getServiceImageUrl = (id: string | number) => {
  const numId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) || 0 : id;
  return SERVICE_IMAGES[numId % SERVICE_IMAGES.length];
};

export function ClinicServicesPricing() {
  const { client, setIsBookingModalOpen, updateBookingField } = useClinicDemo();
  
  const handleBookService = (service: any) => {
    updateBookingField('selectedService', service);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="services" className="py-20 -mx-4 sm:mx-0 sm:rounded-[40px] bg-white border border-gray-100 shadow-sm mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-primary font-semibold tracking-wide uppercase text-sm mb-2">Katalog Layanan</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Layanan Unggulan Kami</h3>
          <p className="text-gray-600">Solusi menyeluruh yang disesuaikan dengan standar tertinggi untuk menjawab setiap permasalahan Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {client.menu.map((service, idx) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={idx} 
              onBook={() => handleBookService(service)} 
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-light/20 px-8 py-3 rounded-full font-semibold transition"
          >
            Konsultasi Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, onBook }: { service: any, index: number, onBook: () => void }) {
  const delay = (index % 3) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="h-48 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={getServiceImageUrl(service.id)} 
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {service.category}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <h4 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h4>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-1">
          {service.desc}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Mulai dari</p>
            <p className="text-lg font-bold text-brand-primary">{service.price}</p>
          </div>
          <button 
            onClick={onBook}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-brand-primary hover:text-white flex items-center justify-center transition"
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  );
}
