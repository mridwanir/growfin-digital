'use client'

import { Calendar, Scissors, MapPin } from 'lucide-react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function GroomingFloatingDock() {
  const { client, setIsBookingModalOpen, selectedServices } = useGroomingDemo()

  // If there are selected services, the floating summary bar from ServiceMenu is shown
  // We can hide this dock to prevent overlap, or just let them coexist.
  // Hiding it is cleaner.
  if (selectedServices.length > 0) return null

  return (
    <div className="pb-safe fixed bottom-0 left-0 z-40 w-full sm:hidden">
      <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white/95 px-2 py-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl">
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="hover:text-brand-primary bg-brand-light/50 flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 text-slate-500 transition-colors"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-brand-primary mt-1 text-[10px] font-bold">Cek Antrean</span>
        </button>

        <a
          href="#layanan"
          className="hover:text-brand-primary flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-500 transition-colors"
        >
          <Scissors className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold">Daftar Harga</span>
        </a>

        <a
          href={client.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-500 transition-colors hover:text-blue-500"
        >
          <MapPin className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold">Navigasi Lokasi</span>
        </a>
      </div>
    </div>
  )
}
