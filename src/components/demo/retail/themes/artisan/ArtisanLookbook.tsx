'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function ArtisanLookbook() {
  const { client } = useRetailDemo()

  if (!client.lookbook || client.lookbook.length === 0) return null
  const lookbooks = client.lookbook

  return (
    <section
      id="lookbook"
      className="mx-auto max-w-7xl border-t border-zinc-200 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif-display mt-1 text-3xl font-bold text-zinc-900">
            {client.galleryTitle || 'Lookbook'}
          </h2>
          <span className="text-brand-primary text-[11px] font-extrabold tracking-widest uppercase">
            {client.galleryDescription ||
              'Temukan inspirasi padu padan bahan segar untuk sajian rumah ala chef berbintang.'}
          </span>
        </div>
      </div>

      <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
        {lookbooks.slice(0, 6).map((lookbook, idx) => {
          // Dynamic height for masonry effect
          const heightClass = idx % 2 === 0 ? 'h-[400px]' : 'h-[550px]'

          return (
            <div
              key={lookbook.id}
              className={`break-inside-avoid ${heightClass} group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-zinc-200/30 bg-zinc-900 shadow-xs transition duration-300 hover:shadow-xl`}
            >
              {/* Full Background Image */}
              <img
                src={lookbook.imageUrl}
                alt={lookbook.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="relative z-10 mt-auto flex flex-col gap-3 p-6 sm:p-8">
                <div>
                  <h3 className="font-serif-display line-clamp-1 text-xl font-bold text-white md:text-2xl">
                    {lookbook.name}
                  </h3>
                  {lookbook.desc && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-300 sm:text-sm">
                      {lookbook.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
