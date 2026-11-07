'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useServiceDemo } from './ServiceDemoContext'
import { getServiceImageUrl } from './ServiceServicesPricing'

export function ServicePractitionerList() {
  const { client } = useServiceDemo()

  // If no practitioners are provided, we don't render this section
  if (!client.practitioners || client.practitioners.length === 0) return null

  return (
    <section
      id="experts"
      className="-mx-4 border-t border-gray-100 bg-white px-4 py-20 sm:mx-0 sm:px-0"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-brand-primary mb-2 text-sm font-semibold tracking-wide uppercase">
              Profil Praktisi
            </h2>
            <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Ditangani oleh Ahlinya
            </h3>
            <p className="text-gray-600">
              Tim spesialis kami memiliki sertifikasi resmi dan jam terbang tinggi dalam menangani
              berbagai macam kasus di bidangnya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {client.practitioners.map((practitioner, idx) => (
            <PractitionerCard key={practitioner.id} practitioner={practitioner} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PractitionerCard({ practitioner, index }: { practitioner: any; index: number }) {
  const { setIsBookingModalOpen } = useServiceDemo()
  const delay = (index % 4) * 100
  const { ref, isVisible } = useScrollReveal(0.1, delay)

  // Fallback to our local service images or the one provided
  const imageUrl =
    practitioner.avatarUrl && practitioner.avatarUrl.includes('unsplash')
      ? getServiceImageUrl(practitioner.id)
      : practitioner.avatarUrl || getServiceImageUrl(practitioner.id)

  return (
    <div
      ref={ref}
      className={`group transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={practitioner.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-gray-900/80 via-transparent to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/30 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition"
          >
            Booking Jadwal
          </button>
        </div>
      </div>
      <h4 className="text-lg font-bold text-gray-900">{practitioner.name}</h4>
      <p className="text-brand-primary mb-2 text-sm font-medium">{practitioner.role}</p>

      {practitioner.licenseNumber && (
        <p className="text-xs text-gray-500">
          <span>🛡️</span> {practitioner.licenseNumber}
        </p>
      )}
      {!practitioner.licenseNumber && (
        <p className="text-xs text-gray-500">
          <span>✨</span> Tersertifikasi Profesional
        </p>
      )}
    </div>
  )
}
