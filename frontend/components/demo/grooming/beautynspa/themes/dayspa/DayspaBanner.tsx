
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function DayspaBanner() {
  const { setIsBookingModalOpen } = useGroomingDemo();

  return (
    <section className="py-20 px-6 bg-brand-primary text-white text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="font-serif-dayspa text-3xl sm:text-5xl font-light">Berikan Raga Anda Istirahat yang Pantas</h2>
        <p className="text-white/80 text-sm sm:text-base font-light">
          Slot harian kami batasi secara ketat untuk menjamin ketenangan privat dan sterilisasi ruangan optimal untuk setiap tamu.
        </p>
        <div className="pt-2">
          <button onClick={() => setIsBookingModalOpen(true)} className="px-8 py-4 bg-white text-[#2B2623] hover:bg-[#2B2623] hover:text-white rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300">
            Jadwalkan Waktu Relaksasi
          </button>
        </div>
      </div>
    </section>
  );
}
