'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getServiceImageUrl } from './ClinicServicesPricing';

export function ClinicPractitionerList() {
  const { client } = useClinicDemo();

  // If no practitioners are provided, we don't render this section
  if (!client.practitioners || client.practitioners.length === 0) return null;

  return (
    <section id="experts" className="py-20 bg-white border-t border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-brand-primary font-semibold tracking-wide uppercase text-sm mb-2">Profil Praktisi</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ditangani oleh Ahlinya</h3>
            <p className="text-gray-600">Tim spesialis kami memiliki sertifikasi resmi dan jam terbang tinggi dalam menangani berbagai macam kasus di bidangnya.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {client.practitioners.map((practitioner, idx) => (
            <PractitionerCard key={practitioner.id} practitioner={practitioner} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PractitionerCard({ practitioner, index }: { practitioner: any, index: number }) {
  const { setIsBookingModalOpen } = useClinicDemo();
  const delay = (index % 4) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  // Fallback to our local service images or the one provided
  const imageUrl = practitioner.avatarUrl && practitioner.avatarUrl.includes('unsplash') 
    ? getServiceImageUrl(practitioner.id) 
    : practitioner.avatarUrl || getServiceImageUrl(practitioner.id);

  return (
    <div 
      ref={ref}
      className={`group transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl mb-4 shadow-md aspect-[3/4] bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt={practitioner.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-brand-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-hover transition shadow-md shadow-brand-primary/30"
          >
            Booking Jadwal
          </button>
        </div>
      </div>
      <h4 className="text-lg font-bold text-gray-900">{practitioner.name}</h4>
      <p className="text-brand-primary text-sm font-medium mb-2">{practitioner.role}</p>
      
      {practitioner.licenseNumber && (
        <p className="text-gray-500 text-xs"><span>🛡️</span> {practitioner.licenseNumber}</p>
      )}
      {!practitioner.licenseNumber && (
        <p className="text-gray-500 text-xs"><span>✨</span> Tersertifikasi Profesional</p>
      )}
    </div>
  );
}
