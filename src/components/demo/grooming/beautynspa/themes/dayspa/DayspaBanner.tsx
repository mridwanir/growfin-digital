import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function DayspaBanner() {
  const { setIsBookingModalOpen } = useGroomingDemo()

  return (
    <section className="bg-brand-primary px-6 py-20 text-center text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="font-serif-dayspa text-3xl font-light sm:text-5xl">
          Berikan Raga Anda Istirahat yang Pantas
        </h2>
        <p className="text-sm font-light text-white/80 sm:text-base">
          Slot harian kami batasi secara ketat untuk menjamin ketenangan privat dan sterilisasi
          ruangan optimal untuk setiap tamu.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="rounded-full bg-white px-8 py-4 text-xs font-semibold tracking-widest text-[#2B2623] uppercase transition-all duration-300 hover:bg-[#2B2623] hover:text-white"
          >
            Jadwalkan Waktu Relaksasi
          </button>
        </div>
      </div>
    </section>
  )
}
