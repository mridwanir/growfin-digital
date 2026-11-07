'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useServiceDemo } from './ServiceDemoContext'

export const SERVICE_IMAGES = [
  '/image/service/anton-savinov-aQxOYwG_GyI-unsplash.jpg',
  '/image/service/arlington-research-Kz8nHVg_tGI-unsplash.jpg',
  '/image/service/arlington-research-kN_kViDchA0-unsplash.jpg',
  '/image/service/baljkann-4-wnpf3Q5pkXA-unsplash.jpg',
  '/image/service/cova-software-ddA5Xh7yWrQ-unsplash.jpg',
  '/image/service/emmanuel-ikwuegbu--0-kl1BjvFc-unsplash.jpg',
  '/image/service/giorgio-tomassetti-mTslIt14OUo-unsplash.jpg',
  '/image/service/helcim-payments-jQvkte13Emc-unsplash.jpg',
  '/image/service/patrick-tomasso-fMntI8HAAB8-unsplash.jpg',
  '/image/service/photo-1559839734-2b71ea197ec2.jpg',
  '/image/service/ricardo-iv-tamayo-nApaD08bFAE-unsplash.jpg',
  '/image/service/ux-indonesia-2NDWFiD0UMM-unsplash.jpg',
]

export const getServiceImageUrl = (id: string | number) => {
  const numId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) || 0 : id
  return SERVICE_IMAGES[numId % SERVICE_IMAGES.length]
}

export function ServiceServicesPricing() {
  const { client, setIsBookingModalOpen, updateBookingField } = useServiceDemo()

  const handleBookService = (service: any) => {
    updateBookingField('selectedService', service)
    setIsBookingModalOpen(true)
  }

  return (
    <section
      id="services"
      className="-mx-4 mb-16 border border-gray-100 bg-white py-20 shadow-sm sm:mx-0 sm:rounded-[40px]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-brand-primary mb-2 text-sm font-semibold tracking-wide uppercase">
            Katalog Layanan
          </h2>
          <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Layanan Unggulan Kami
          </h3>
          <p className="text-gray-600">
            Solusi menyeluruh yang disesuaikan dengan standar tertinggi untuk menjawab setiap
            permasalahan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {client.menu.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              onBook={() => handleBookService(service)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="border-brand-primary text-brand-primary hover:bg-brand-light/20 rounded-full border-2 bg-white px-8 py-3 font-semibold transition"
          >
            Konsultasi Sekarang
          </button>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  onBook,
}: {
  service: any
  index: number
  onBook: () => void
}) {
  const delay = (index % 3) * 100
  const { ref, isVisible } = useScrollReveal(0.1, delay)

  return (
    <div
      ref={ref}
      className={`group flex transform flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:shadow-xl ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getServiceImageUrl(service.id)}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="bg-brand-primary absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md">
          {service.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <h4 className="mb-3 text-xl font-bold text-gray-900">{service.name}</h4>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{service.desc}</p>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Mulai dari</p>
            <p className="text-brand-primary text-lg font-bold">{service.price}</p>
          </div>
          <button
            onClick={onBook}
            className="hover:bg-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:text-white"
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  )
}
