'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useServiceDemo } from './ServiceDemoContext'
import { getServiceImageUrl } from './ServiceServicesPricing'

export function ServiceGallery() {
  const { client } = useServiceDemo()
  const { ref, isVisible } = useScrollReveal(0.1)

  // Lookbook images with static fallbacks
  const lookbookList = client.lookbook || []
  const img1 = lookbookList[0]?.imageUrl || getServiceImageUrl(5)
  const img2 = lookbookList[1]?.imageUrl || getServiceImageUrl(2)
  const img3 = lookbookList[2]?.imageUrl || getServiceImageUrl(3)
  const img4 = lookbookList[3]?.imageUrl || getServiceImageUrl(7)
  const img5 = lookbookList[4]?.imageUrl || getServiceImageUrl(8)
  const img6 = lookbookList[5]?.imageUrl || getServiceImageUrl(10)

  return (
    <section id="gallery" className="-mx-4 bg-gray-900 px-4 py-20 text-white sm:mx-0 sm:px-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-brand-light mb-2 text-sm font-semibold tracking-wide uppercase">
            Fasilitas & Hasil Kerja
          </h2>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            {client.galleryTitle || 'Didukung Teknologi Terkini'}
          </h3>
          <p className="text-gray-400">
            {client.galleryDescription ||
              'Transparansi adalah kunci. Lihat sendiri kualitas peralatan yang kami gunakan dan bukti nyata hasil pengerjaan kami.'}
          </p>
        </div>

        <div
          ref={ref}
          className={`grid transform grid-cols-2 gap-4 transition-all duration-1000 md:grid-cols-4 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          {/* Large Image */}
          <div className="col-span-2 row-span-2 overflow-hidden rounded-xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img1}
              alt="Fasilitas Utama"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          {/* Small Images */}
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img2}
              alt="Alat Modern"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img3}
              alt="Ruang Tunggu"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-800">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 overflow-hidden border-r-2 border-white bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img4} alt="Gallery 4" className="h-full w-full object-cover opacity-70" />
              </div>
              <div className="w-1/2 overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img5} alt="Gallery 5" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="absolute top-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
              Before
            </div>
            <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
              After
            </div>
          </div>

          <div className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img6}
              alt="Lebih Banyak"
              className="h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105"
            />
            <span className="absolute text-lg font-bold">
              <span>🖼️</span> Lihat Galeri
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
