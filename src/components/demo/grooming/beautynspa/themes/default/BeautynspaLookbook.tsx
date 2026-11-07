'use client'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

import { getGroomingImageUrl } from './BeautynspaArtists'

export function BeautynspaLookbook() {
  const { client, updateBookingField, setIsBookingModalOpen } = useGroomingDemo()

  const handleSelectLookbook = (item: any) => {
    updateBookingField('referenceLookbook', item)
    setIsBookingModalOpen(true)
  }

  const lookbookData =
    client.lookbook && client.lookbook.length > 0
      ? client.lookbook
      : [
          { id: '1', name: 'Balayage Color', imageUrl: '' },
          { id: '2', name: 'Classic Fade', imageUrl: '' },
          { id: '3', name: 'Gel Nail Art', imageUrl: '' },
          { id: '4', name: 'Hair Spa Therapy', imageUrl: '' },
          { id: '5', name: 'Wavy Styling', imageUrl: '' },
        ]

  return (
    <section id="lookbook" className="-mx-4 bg-white px-4 py-24 sm:mx-0 sm:px-0">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-end justify-between md:flex-row">
          <div className="max-w-2xl">
            <h2 className="mb-4 font-serif text-3xl text-stone-900 md:text-4xl">
              Lookbook Portofolio
            </h2>
            <p className="text-lg text-stone-400">
              Inspirasi gaya dan bukti nyata dari hasil karya artisan kami. Jelajahi transformasi
              klien-klien kami.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <button className="flex items-center gap-2 font-medium text-stone-900 transition-colors hover:text-stone-400">
              Lihat Semua Galeri <span>→</span>
            </button>
          </div>
        </div>

        {/* Masonry-style CSS Grid */}
        <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
          {lookbookData.map((item, idx) => {
            const imageUrl = getGroomingImageUrl(item.id || idx)

            return (
              <div
                key={item.id}
                onClick={() => handleSelectLookbook(item)}
                className="group relative cursor-zoom-in break-inside-avoid overflow-hidden rounded-xl shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full border border-white px-4 py-2 text-center font-serif text-lg tracking-wide text-white backdrop-blur-sm">
                    {item.name}
                  </span>
                  <span className="mt-3 text-xs text-white">Klik untuk pilih gaya ini</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
