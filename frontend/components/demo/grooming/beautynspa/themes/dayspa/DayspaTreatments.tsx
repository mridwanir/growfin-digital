
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
