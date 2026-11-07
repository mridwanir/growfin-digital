'use client'
import type { MenuItem } from '@/lib/types'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useServiceDemo } from './ServiceDemoContext'

function AnimatedServiceCard({
  item,
  isSelected,
  formatPrice,
  openBookingModal,
  getServiceImage,
  idx,
}: any) {
  const delay = (idx % 4) * 100
  const { ref, isVisible } = useScrollReveal(0.1, delay)

  return (
    <div
      ref={ref}
      onClick={() => openBookingModal(item, true)} // Custom flag to just select, wait I'll handle click below
      className={`group relative flex transform cursor-pointer items-center justify-between rounded-[20px] border bg-white p-3.5 transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${
        isSelected
          ? `border-brand-primary ring-brand-primary/20 bg-brand-light shadow-md ring-2`
          : 'border-slate-100/80 hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      {/* Left Details */}
      <div className="min-w-0 flex-1 pr-4">
        {item.tag && (
          <span
            className={`text-brand-primary mb-1 inline-block rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[9px] font-black tracking-widest uppercase`}
          >
            {item.tag}
          </span>
        )}
        <h3 className="mb-0.5 line-clamp-1 text-sm leading-snug font-bold text-slate-900">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-[11px] leading-relaxed font-medium text-slate-500">
          {item.desc}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className={`text-[13px] font-black text-slate-900`}>{formatPrice(item.price)}</span>
          <button
            onClick={e => {
              e.stopPropagation()
              openBookingModal(item, false) // false means open modal directly
            }}
            className={`ml-auto flex h-7 items-center justify-center gap-1 rounded-full bg-slate-900 px-3 text-[10px] font-bold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95`}
          >
            <span>Pilih</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] border border-slate-100 bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getServiceImage(item, idx)}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  )
}

export function ServiceServiceList() {
  const {
    client,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedService,
    setIsScheduleModalOpen,
    serviceTerminology,
  } = useServiceDemo()

  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal(0.1)

  // Price formatter helper to prevent double "Rp"
  const formatPrice = (price?: string) => {
    if (!price) return ''
    const cleaned = price.trim()
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned
    }
    return `Rp ${cleaned}`
  }

  // Service images map fallback
  const getServiceImage = (item: MenuItem, idx: number) => {
    if (item.imageUrl) return item.imageUrl
    const fallbackImages = [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=300&auto=format&fit=crop&q=80',
    ]
    return fallbackImages[idx % fallbackImages.length]
  }

  // Filtered menu logic
  const filteredMenu = client.menu.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openBookingModal = (service: MenuItem, justSelect: boolean) => {
    setSelectedService(service)
    if (!justSelect) {
      setIsScheduleModalOpen(true)
    }
  }

  return (
    <section
      id="layanan"
      className="scroll-mt-16 bg-slate-50/50 py-16 selection:bg-slate-100 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Header: Clean & Minimal */}
        <div
          ref={headerRef}
          className={`mb-10 transform text-center transition-all duration-700 ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <h2 className="mb-4 text-3xl leading-none font-black tracking-tight text-slate-900 sm:text-4xl">
            Pilih <span className="text-brand-primary">Layanan</span>
          </h2>
          <p className="font-medium text-slate-500">
            Temukan layanan yang paling sesuai dengan kebutuhan Anda hari ini.
          </p>
        </div>

        {/* Search & Filter Top Bar */}
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row">
          {/* Clean Search Bar */}
          <div className="flex w-full items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 md:w-[300px]">
            <span className="text-sm text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex w-full flex-1 scrollbar-none gap-2 overflow-x-auto pb-2 md:pb-0">
            {client.categories.map(cat => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? `bg-slate-900 text-white shadow-md`
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Service Cards (Animated Grid) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item, idx) => (
              <AnimatedServiceCard
                key={item.id}
                item={item}
                isSelected={useServiceDemo().selectedService?.id === item.id}

                formatPrice={formatPrice}
                openBookingModal={openBookingModal}
                getServiceImage={getServiceImage}
                idx={idx}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center rounded-[32px] border border-dashed border-slate-200 bg-white p-16 text-center">
              <span className="mb-4 text-4xl opacity-50">🔍</span>
              <p className="text-base font-bold text-slate-700">Tidak ada layanan.</p>
              <p className="mt-2 text-sm text-slate-400">Coba gunakan kata kunci lain.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
