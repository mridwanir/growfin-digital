import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaCta() {
  const { setIsBookingModalOpen } = useGroomingDemo()

  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-black p-10 text-center text-white md:p-20">
        <div className="bg-brand-primary/40 pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full blur-3xl"></div>
        <p className="text-brand-primary mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
          Limited Daily Slots
        </p>
        <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight sm:text-5xl">
          Manjakan diri Anda dengan sentuhan artistik yang tak lekang oleh waktu.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm font-light text-neutral-300">
          Kami membatasi tamu tiap jam untuk menjamin kenyamanan intim dan sterilisasi total
          ruangan.
        </p>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="bg-brand-primary hover:text-brand-primary mt-8 rounded-full px-9 py-4 text-xs font-semibold tracking-widest text-white uppercase shadow-xl transition hover:bg-white"
        >
          Reservasi Sekarang
        </button>
      </div>
    </section>
  )
}
