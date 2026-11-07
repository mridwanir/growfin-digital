'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function EditorialLookbook() {
  const { client } = useRetailDemo()

  if (!client.lookbook || client.lookbook.length === 0) return null
  const lookbooks = client.lookbook

  return (
    <section id="lookbook" className="bg-[#F5F5F5] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <h2 className="font-serif-custom text-4xl md:text-5xl">
            {client.galleryTitle || 'Curated Looks'}
          </h2>
          <span className="text-brand-primary text-sm font-light tracking-widest uppercase">
            {client.galleryDescription || 'Draw inspiration from our seasonal lookbook'}
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          {lookbooks.slice(0, 6).map((lookbook, idx) => {
            // Dynamic bento grid sizing to match Editorial's asymmetrical feel
            let colSpan = 'md:col-span-4'
            let heightClass = 'h-[400px]'
            let mtClass = 'mt-0'

            if (idx === 0) {
              colSpan = 'md:col-span-5'
              heightClass = 'h-[600px]'
            } else if (idx === 1) {
              colSpan = 'md:col-span-7 md:col-start-6'
              heightClass = 'h-[400px]'
            } else if (idx === 2) {
              colSpan = 'md:col-span-7 md:col-start-6'
              heightClass = 'h-[450px]'
              mtClass = 'md:-mt-24' // overlap effect
            } else {
              colSpan = 'md:col-span-4'
              heightClass = 'h-[350px]'
            }

            return (
              <div
                key={lookbook.id}
                className={`${colSpan} ${mtClass} group relative cursor-pointer`}
              >
                <div className={`w-full ${heightClass} overflow-hidden`}>
                  <img
                    src={lookbook.imageUrl}
                    alt={lookbook.name}
                    className="h-full w-full object-cover grayscale-[30%] transition-all duration-700 group-hover:grayscale-0 hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-sm tracking-widest text-[#2A2A2A] uppercase">
                  0{idx + 1} — {lookbook.name}
                </p>
                {lookbook.desc && (
                  <p className="mt-1 line-clamp-1 text-xs text-[#8E8E8E]">{lookbook.desc}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
