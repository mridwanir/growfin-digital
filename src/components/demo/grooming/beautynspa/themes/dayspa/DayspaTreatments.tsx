import { Clock, ChevronRight } from 'lucide-react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function DayspaTreatments() {
  const { client, toggleServiceSelection, setIsBookingModalOpen } = useGroomingDemo()

  return (
    <section id="treatments" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
        <span className="text-brand-primary text-xs font-semibold tracking-[0.25em] uppercase">
          Layanan Eksklusif
        </span>
        <h2 className="font-serif-dayspa text-4xl font-normal text-[#2B2623] sm:text-5xl">
          Kurasi Perawatan & Durasi
        </h2>
        <p className="text-sm font-light text-[#2B2623]/70 sm:text-base">
          Setiap ritual dirancang presisi dengan alokasi waktu ideal demi kenyamanan tanpa
          terburu-buru.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {client.menu.map((service, idx) => (
          <div
            key={idx}
            className="hover:border-brand-primary/40 group flex flex-col justify-between rounded-2xl border border-[#F3ECE2] bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl"
          >
            <div>
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="text-brand-primary inline-flex items-center gap-1.5 rounded-full bg-[#F3ECE2]/70 px-3 py-1 text-xs font-medium">
                  <Clock size={16} /> {service.duration || 90} Menit
                </span>
                <span className="font-serif-dayspa text-xl font-semibold text-[#2B2623]">
                  {service.price}
                </span>
              </div>
              <h3 className="font-serif-dayspa group-hover:text-brand-primary text-2xl font-medium text-[#2B2623] transition-colors">
                {service.name}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#2B2623]/70 sm:text-sm">
                {service.desc}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#F3ECE2]/60 pt-6">
              <span className="text-xs text-[#2B2623]/50 italic">Termasuk relaksasi standar</span>
              <button
                onClick={() => {
                  toggleServiceSelection(service)
                  setIsBookingModalOpen(true)
                }}
                className="text-brand-primary inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase hover:text-[#2B2623]"
              >
                Pilih Layanan <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
