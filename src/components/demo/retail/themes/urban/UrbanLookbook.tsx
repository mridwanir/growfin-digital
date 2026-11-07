'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function UrbanLookbook() {
  const { client } = useRetailDemo()
  const { ref: lookbookRef, isVisible: isLookbookVisible } = useScrollReveal(0.1)

  if (!client.lookbook || client.lookbook.length === 0) return null
  const lookbooks = client.lookbook

  return (
    <section id="lookbook" className="bg-white py-20">
      <div
        ref={lookbookRef}
        className={`mx-auto max-w-7xl transform px-4 transition-all duration-1000 sm:px-6 lg:px-8 ${isLookbookVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      >
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {client.galleryTitle || 'Lookbook Inspirasi'}
          </h2>
          <span className="text-brand-primary text-xs">
            {client.galleryDescription || 'Padu padan gaya terbaik untuk setiap momen berhargamu'}
          </span>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {lookbooks.slice(0, 6).map((lookbook, idx) => {
            // Asymmetrical grid
            let spanClass = 'col-span-2 md:col-span-1 aspect-square md:aspect-auto'
            if (idx === 0 || idx === 3) {
              spanClass = 'col-span-2 md:col-span-2 aspect-square md:aspect-auto md:row-span-2'
            }

            return (
              <div
                key={lookbook.id}
                className={`${spanClass} group relative min-h-[300px] overflow-hidden rounded-[32px] shadow-sm transition duration-300 hover:shadow-xl`}
              >
                <img
                  src={lookbook.imageUrl}
                  alt={lookbook.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="mb-1 text-xl font-semibold text-white">{lookbook.name}</p>
                  {lookbook.desc && (
                    <p className="line-clamp-2 text-sm text-gray-200">{lookbook.desc}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
