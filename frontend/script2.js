const fs = require('fs');
const path = require('path');
const dir = 'd:/Project/Growfin Digital/frontend/components/demo/grooming/beautynspa/themes/dayspa';

// DayspaTreatments.tsx
fs.writeFileSync(path.join(dir, 'DayspaTreatments.tsx'), `
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { Clock, ChevronRight } from 'lucide-react';

export function DayspaTreatments() {
  const { client, toggleServiceSelection, setIsBookingModalOpen } = useGroomingDemo();

  return (
    <section id="treatments" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs tracking-[0.25em] text-brand-primary font-semibold uppercase">Layanan Eksklusif</span>
        <h2 className="font-serif-dayspa text-4xl sm:text-5xl font-normal text-[#2B2623]">Kurasi Perawatan & Durasi</h2>
        <p className="text-sm sm:text-base text-[#2B2623]/70 font-light">Setiap ritual dirancang presisi dengan alokasi waktu ideal demi kenyamanan tanpa terburu-buru.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {client.menu.map((service, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-7 border border-[#F3ECE2] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-xl hover:border-brand-primary/40 transition-all duration-300 group">
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary bg-[#F3ECE2]/70 px-3 py-1 rounded-full">
                  <Clock size={16} /> {service.duration || 90} Menit
                </span>
                <span className="font-serif-dayspa text-xl font-semibold text-[#2B2623]">{service.price}</span>
              </div>
              <h3 className="font-serif-dayspa text-2xl font-medium text-[#2B2623] group-hover:text-brand-primary transition-colors">{service.name}</h3>
              <p className="text-xs sm:text-sm text-[#2B2623]/70 mt-3 leading-relaxed">
                {service.desc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#F3ECE2]/60 flex items-center justify-between">
              <span className="text-xs text-[#2B2623]/50 italic">Termasuk relaksasi standar</span>
              <button onClick={() => {
                  toggleServiceSelection(service);
                  setIsBookingModalOpen(true);
              }} className="text-xs uppercase tracking-widest font-semibold text-brand-primary hover:text-[#2B2623] inline-flex items-center gap-1">
                Pilih Layanan <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`);

// DayspaTherapists.tsx
fs.writeFileSync(path.join(dir, 'DayspaTherapists.tsx'), `
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { Sparkles } from 'lucide-react';
import { getGroomingImageUrl } from '../default/BeautynspaArtists';

export function DayspaTherapists() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  
  if (!client.practitioners || client.practitioners.length === 0) return null;

  return (
    <section id="therapists" className="py-24 bg-[#F3ECE2]/45 border-y border-[#F3ECE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs tracking-[0.25em] text-brand-primary font-semibold uppercase">The Healing Hands</span>
            <h2 className="font-serif-dayspa text-4xl sm:text-5xl font-normal mt-2 text-[#2B2623]">Pilih Terapis Personal Anda</h2>
          </div>
          <p className="text-sm text-[#2B2623]/70 max-w-md font-light">
            Koneksi dan sentuhan terapis bersifat sangat personal. Pilih praktisi yang paling sesuai dengan kebutuhan energi dan preferensi pijatan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {client.practitioners.map((practitioner, idx) => {
            const imageUrl = practitioner.avatarUrl || getGroomingImageUrl(practitioner.id || idx);
            return (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#F3ECE2]/80 group">
                <div className="relative h-80 overflow-hidden">
                  <img src={imageUrl} 
                       alt={practitioner.name} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-[#2B2623]/70 backdrop-blur-md text-white text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">
                    {5 + (idx % 5)}+ Tahun Pengalaman
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif-dayspa text-2xl font-medium text-[#2B2623]">{practitioner.name}</h3>
                    <span className="text-xs text-brand-primary font-semibold tracking-wider uppercase">{practitioner.role || 'Therapist'}</span>
                  </div>
                  <p className="text-xs text-[#2B2623]/65 mb-4 h-12">
                    Spesialisasi pada teknik pijat deep tissue dan akupresur. Cocok untuk Anda yang menyukai tekanan tegas dan terukur.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#F3ECE2]">
                    <span className="text-xs text-[#959F89] font-medium flex items-center gap-1">
                      <Sparkles size={16} className="fill-current" /> Signature Touch
                    </span>
                    <button onClick={() => setIsBookingModalOpen(true)} className="text-xs font-semibold uppercase tracking-wider text-[#2B2623] hover:text-brand-primary underline underline-offset-4">
                      Pilih {practitioner.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`);

// DayspaLookbook.tsx
fs.writeFileSync(path.join(dir, 'DayspaLookbook.tsx'), `
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
`);
console.log('Done script 2');
