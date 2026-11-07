'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function DarkLookbook() {
  const { client } = useRetailDemo()

  if (!client.lookbook || client.lookbook.length === 0) return null
  const lookbooks = client.lookbook

  return (
    <section id="lookbook" className="border-y border-slate-800 bg-slate-900/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          {client.galleryDescription && (
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: 'var(--theme-color)' }}
            >
              {client.galleryDescription}
            </span>
          )}
          <h2 className="mt-1 text-3xl font-extrabold text-white">
            {client.galleryTitle || 'Inspirasi Setup & Gaya Pemakaian'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {lookbooks.slice(0, 6).map((lookbook, idx) => {
            // Cinematic alternating sizing
            let colSpan = 'md:col-span-6'
            if (idx === 0) colSpan = 'md:col-span-4'
            else if (idx === 1) colSpan = 'md:col-span-8'
            else if (idx === 2) colSpan = 'md:col-span-8'
            else if (idx === 3) colSpan = 'md:col-span-4'
            else if (idx === 4 || idx === 5) colSpan = 'md:col-span-6'

            return (
              <div
                key={lookbook.id}
                className={`${colSpan} group relative flex h-[350px] flex-col justify-end overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xs transition duration-300 hover:shadow-xl md:h-[450px]`}
              >
                <img
                  src={lookbook.imageUrl}
                  alt={lookbook.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 mt-auto flex flex-col gap-2 p-6 sm:p-8">
                  <h3 className="line-clamp-1 text-lg font-bold text-white md:text-xl">
                    {lookbook.name}
                  </h3>
                  {lookbook.desc && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400 sm:text-sm">
                      {lookbook.desc}
                    </p>
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
