'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ClinicServicesPricing() {
  const { client, setIsBookingModalOpen, updateBookingField } = useClinicDemo();
  
  const handleBookService = (service: any) => {
    updateBookingField('selectedService', service);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="layanan" className="space-y-16 scroll-mt-24 mb-16">
      
      {/* 3-Step Patient Journey */}
      <div className="bg-slate-900 rounded-[40px] p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-primary rounded-full blur-[100px] opacity-30"></div>
        
        <h2 className="text-2xl sm:text-3xl font-black mb-10 text-center relative z-10">
          Proses Penanganan Terpadu
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-8 relative z-10">
          <div className="text-center relative">
            <div className="w-16 h-16 mx-auto bg-brand-primary rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-lg shadow-brand-primary/30">1</div>
            <h3 className="font-bold text-lg mb-2">Jadwalkan Temu</h3>
            <p className="text-sm text-slate-400">Pilih sesi waktu dan isi form pra-konsultasi secara online.</p>
            {/* Connector Line (Desktop) */}
            <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-brand-primary to-transparent opacity-30"></div>
          </div>
          <div className="text-center relative">
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-2xl font-black mb-4 border-2 border-brand-primary">2</div>
            <h3 className="font-bold text-lg mb-2">Konsultasi / Periksa</h3>
            <p className="text-sm text-slate-400">Pemeriksaan fisik atau diskusi mendalam bersama ahlinya.</p>
            {/* Connector Line (Desktop) */}
            <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-600 to-transparent opacity-30"></div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-2xl font-black mb-4 text-brand-primary border-2 border-slate-700">3</div>
            <h3 className="font-bold text-lg mb-2">Tindak Lanjut</h3>
            <p className="text-sm text-slate-400">Pemberian resep, tindakan medis lanjutan, atau drafting dokumen.</p>
          </div>
        </div>
      </div>

      {/* Services Pricing */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Layanan & <span className="text-brand-primary">Estimasi Biaya</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Transparansi biaya adalah komitmen kami. Tindakan tambahan akan selalu didiskusikan terlebih dahulu dengan Anda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {client.menu.map((service, idx) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={idx} 
              onBook={() => handleBookService(service)} 
            />
          ))}
        </div>
        
        <p className="text-center text-xs text-slate-400 font-medium mt-8">
          *Tarif di atas adalah estimasi dasar (Fixed Price / Starting Price). Biaya final dapat menyesuaikan kondisi pasca-pemeriksaan aktual.
        </p>
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
      className={`bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 flex flex-col transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="h-48 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={service.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'} 
          alt={service.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">{service.category}</p>
          <h3 className="text-lg font-black text-white leading-tight">{service.name}</h3>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1 bg-white">
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {service.desc}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Mulai Dari</p>
            <p className="text-brand-primary font-black text-lg">{service.price}</p>
          </div>
          <button 
            onClick={onBook}
            className="w-12 h-12 rounded-full bg-brand-light text-brand-primary flex items-center justify-center text-xl hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  );
}
