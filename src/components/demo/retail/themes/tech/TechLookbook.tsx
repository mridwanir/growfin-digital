'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function TechLookbook() {
  const { client } = useRetailDemo()

  if (!client.lookbook || client.lookbook.length === 0) return null
  const lookbooks = client.lookbook

  return (
    <section id="lookbook" className="border-y border-zinc-200 bg-zinc-100/70 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-xl">
          <h2 className="mt-1 text-2xl font-extrabold text-zinc-950 sm:text-3xl">
            {client.galleryTitle || 'Eksplorasi Setup'}
          </h2>
          <span
            className="text-xs font-bold tracking-widest text-zinc-400 uppercase"
            style={{ color: 'var(--theme-color)' }}
          >
            {client.galleryDescription}
          </span>
        </div>

        <div className="flex h-[600px] flex-col gap-2 overflow-hidden rounded-[2rem] bg-zinc-950 p-2 shadow-2xl md:h-[500px] md:flex-row">
          {lookbooks.slice(0, 5).map((lookbook, idx) => {
            return (
              <div
                key={lookbook.id}
                className="group relative flex-1 cursor-pointer overflow-hidden rounded-[1.5rem] bg-zinc-900 transition-all duration-700 ease-in-out md:hover:flex-[3]"
              >
                <img
                  src={lookbook.imageUrl}
                  alt={lookbook.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-100 md:opacity-50 md:mix-blend-luminosity md:group-hover:mix-blend-normal"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Always visible title on mobile, hover-expand on desktop */}
                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-4 sm:p-6">
                  <div className="transition-opacity duration-500 md:opacity-0 md:delay-300 md:group-hover:opacity-100">
                    <h3 className="mb-1 line-clamp-1 text-xl font-bold text-white md:mb-2 md:text-2xl">
                      {lookbook.name}
                    </h3>
                    <p className="line-clamp-2 text-xs text-zinc-300 sm:text-sm">{lookbook.desc}</p>
                  </div>
                </div>

                {/* Vertical Text (when collapsed on desktop) */}
                <div className="absolute bottom-8 left-1/2 hidden origin-bottom -translate-x-1/2 -rotate-90 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-0 md:block">
                  <span className="text-sm font-bold tracking-widest text-white uppercase">
                    {lookbook.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
