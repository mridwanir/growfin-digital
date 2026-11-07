import { Sparkles } from 'lucide-react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

import { getGroomingImageUrl } from '../default/BeautynspaArtists'

export function DayspaTherapists() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()

  if (!client.practitioners || client.practitioners.length === 0) return null

  return (
    <section id="therapists" className="border-y border-[#F3ECE2] bg-[#F3ECE2]/45 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-brand-primary text-xs font-semibold tracking-[0.25em] uppercase">
              The Healing Hands
            </span>
            <h2 className="font-serif-dayspa mt-2 text-4xl font-normal text-[#2B2623] sm:text-5xl">
              Pilih Terapis Personal Anda
            </h2>
          </div>
          <p className="max-w-md text-sm font-light text-[#2B2623]/70">
            Koneksi dan sentuhan terapis bersifat sangat personal. Pilih praktisi yang paling sesuai
            dengan kebutuhan energi dan preferensi pijatan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {client.practitioners.map((practitioner, idx) => {
            const imageUrl = practitioner.avatarUrl || getGroomingImageUrl(practitioner.id || idx)
            return (
              <div
                key={idx}
                className="group overflow-hidden rounded-3xl border border-[#F3ECE2]/80 bg-white"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={practitioner.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 rounded-full bg-[#2B2623]/70 px-3 py-1 text-[11px] tracking-wider text-white uppercase backdrop-blur-md">
                    {5 + (idx % 5)}+ Tahun Pengalaman
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="font-serif-dayspa text-2xl font-medium text-[#2B2623]">
                      {practitioner.name}
                    </h3>
                    <span className="text-brand-primary text-xs font-semibold tracking-wider uppercase">
                      {practitioner.role || 'Therapist'}
                    </span>
                  </div>
                  <p className="mb-4 h-12 text-xs text-[#2B2623]/65">
                    Spesialisasi pada teknik pijat deep tissue dan akupresur. Cocok untuk Anda yang
                    menyukai tekanan tegas dan terukur.
                  </p>
                  <div className="flex items-center justify-between border-t border-[#F3ECE2] pt-4">
                    <span className="flex items-center gap-1 text-xs font-medium text-[#959F89]">
                      <Sparkles size={16} className="fill-current" /> Signature Touch
                    </span>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="hover:text-brand-primary text-xs font-semibold tracking-wider text-[#2B2623] uppercase underline underline-offset-4"
                    >
                      Pilih {practitioner.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
