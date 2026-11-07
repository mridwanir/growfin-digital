'use client'

import { useState } from 'react'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function FreshLookbook() {
  const { client } = useRetailDemo()
  const [activeIdx, setActiveIdx] = useState(0)

  if (!client.lookbook || client.lookbook.length === 0) return null
  const lookbooks = client.lookbook

  // Guard in case lookbooks gets modified and activeIdx goes out of bounds
  const activeLookbook = lookbooks[activeIdx] || lookbooks[0]

  return (
    <section id="lookbook" className="bg-zinc-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">
            {client.galleryTitle || 'Lookbook'}
          </h2>
          {client.galleryDescription && (
            <p className="mt-2 text-sm text-zinc-600">{client.galleryDescription}</p>
          )}
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-10">
          {/* Main Stage */}
          <div className="group relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-xl shadow-emerald-900/5 sm:aspect-[4/3] lg:w-2/3">
            <img
              key={activeLookbook.id}
              src={activeLookbook.imageUrl}
              alt={activeLookbook.name}
              className="animate-in fade-in zoom-in-95 absolute inset-0 h-full w-full object-cover duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute right-6 bottom-6 left-6 translate-y-4 transform rounded-3xl bg-white/95 p-6 opacity-0 shadow-xl backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:right-10 sm:bottom-10 sm:left-10 sm:p-8">
              <h3 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                {activeLookbook.name}
              </h3>
              {activeLookbook.desc && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
                  {activeLookbook.desc}
                </p>
              )}
              <a
                href="#katalog"
                className="mt-4 inline-block text-sm font-bold tracking-wider text-[var(--theme-color)] uppercase"
              >
                Beli Sekarang &rarr;
              </a>
            </div>
          </div>

          {/* Thumbnails */}
          <div
            className="scrollbar-hide flex w-full flex-row gap-4 overflow-x-auto pb-4 lg:max-h-[600px] lg:w-1/3 lg:flex-col lg:overflow-y-auto lg:pb-0"
            style={{ scrollbarWidth: 'none' }}
          >
            {lookbooks.slice(0, 6).map((lookbook, idx) => (
              <button
                key={lookbook.id}
                onClick={() => setActiveIdx(idx)}
                className={`relative aspect-[16/9] w-48 shrink-0 overflow-hidden rounded-2xl border-4 text-left transition-all duration-300 lg:aspect-auto lg:h-32 lg:w-full ${activeIdx === idx ? 'border-[var(--theme-color)] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img
                  src={lookbook.imageUrl}
                  alt={lookbook.name}
                  className="h-full w-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-black/40 transition-opacity ${activeIdx === idx ? 'opacity-0' : 'opacity-100'}`}
                ></div>
                <div className="absolute right-4 bottom-3 left-4 z-10 lg:hidden">
                  <p className="line-clamp-1 text-xs font-bold text-white">{lookbook.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
