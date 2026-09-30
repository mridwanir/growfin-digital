
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
