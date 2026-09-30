import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaCta() {
  const { setIsBookingModalOpen } = useGroomingDemo();

  return (
    <section className="pb-24 px-6">
      <div className="max-w-7xl mx-auto rounded-[3rem] bg-black text-white p-10 md:p-20 text-center relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-primary/40 rounded-full blur-3xl pointer-events-none"></div>
        <p className="text-xs uppercase tracking-[0.25em] text-brand-primary font-semibold mb-3">Limited Daily Slots</p>
        <h2 className="text-3xl sm:text-5xl font-serif max-w-2xl mx-auto leading-tight">
          Manjakan diri Anda dengan sentuhan artistik yang tak lekang oleh waktu.
        </h2>
        <p className="text-neutral-300 text-sm max-w-lg mx-auto mt-4 font-light">
          Kami membatasi tamu tiap jam untuk menjamin kenyamanan intim dan sterilisasi total ruangan.
        </p>
        <button onClick={() => setIsBookingModalOpen(true)} className="mt-8 px-9 py-4 rounded-full bg-brand-primary text-white hover:bg-white hover:text-brand-primary transition font-semibold text-xs tracking-widest uppercase shadow-xl">
          Reservasi Sekarang
        </button>
      </div>
    </section>
  );
}
