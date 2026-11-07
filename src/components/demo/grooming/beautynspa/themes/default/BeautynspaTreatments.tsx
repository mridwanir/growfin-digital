'use client'

import type { MenuItem } from '@/lib/types'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BeautynspaTreatments() {
  const { client, toggleServiceSelection, setIsBookingModalOpen } = useGroomingDemo()

  const handleSelectService = (service: MenuItem) => {
    toggleServiceSelection(service)
    setIsBookingModalOpen(true)
  }

  return (
    <section id="layanan" className="bg-stone-50 py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl text-stone-900 md:text-4xl">Treatment Catalog</h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-500">
            Pilihan layanan komprehensif yang dirancang khusus untuk kenyamanan dan transformasi
            penampilan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {client.menu.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              onSelect={() => handleSelectService(service)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  onSelect,
}: {
  service: MenuItem
  index: number
  onSelect: () => void
}) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-stone-200 hover:shadow-xl">
      <h3 className="mb-2 font-serif text-xl font-semibold">{service.name}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">{service.desc}</p>
      <div className="mb-6 flex items-center justify-between border-t border-stone-100 pt-4">
        <span className="flex items-center text-sm font-medium text-stone-400">
          {service.duration || 45} Menit
        </span>
        <span className="text-lg font-semibold text-stone-900">{service.price}</span>
      </div>
      <button
        onClick={onSelect}
        className="hover:border-brand-primary hover:bg-brand-primary w-full rounded-xl border border-stone-900 py-3 font-medium text-stone-900 transition-all duration-300 hover:text-white"
      >
        Pilih Layanan
      </button>
    </div>
  )
}
