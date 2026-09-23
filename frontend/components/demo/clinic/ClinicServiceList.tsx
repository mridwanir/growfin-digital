'use client';
import { useClinicDemo } from './ClinicDemoContext';
import { MenuItem } from '@/lib/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';

function AnimatedServiceCard({ 
  item, 
  isSelected, 
  formatPrice, 
  openBookingModal,
  getServiceImage,
  idx
}: any) {
  const delay = (idx % 4) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  return (
    <div
      ref={ref}
      onClick={() => openBookingModal(item, true)} // Custom flag to just select, wait I'll handle click below
      className={`group relative flex items-center justify-between rounded-[20px] bg-white p-3.5 border transition-all duration-700 ease-out transform cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${
        isSelected
          ? `border-brand-primary ring-2 ring-brand-primary/20 bg-brand-light shadow-md`
          : 'border-slate-100/80 hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      {/* Left Details */}
      <div className="flex-1 pr-4 min-w-0">
        {item.tag && (
          <span className={`inline-block text-[9px] font-black uppercase tracking-widest text-brand-primary bg-slate-50 px-2 py-0.5 rounded-md mb-1 border border-slate-100`}>
            {item.tag}
          </span>
        )}
        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 mb-0.5">
          {item.name}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
          {item.desc}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className={`text-[13px] font-black text-slate-900`}>
            {formatPrice(item.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openBookingModal(item, false); // false means open modal directly
            }}
            className={`flex h-7 px-3 items-center justify-center gap-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold shadow-sm transition-transform active:scale-95 ml-auto`}
          >
            <span>Pilih</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="relative h-24 w-24 shrink-0 rounded-[16px] overflow-hidden border border-slate-100 bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getServiceImage(item, idx)}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
}

export function ClinicServiceList() {
  const { client, searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedService,
    setIsScheduleModalOpen,
    serviceTerminology } = useClinicDemo();

  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal(0.1);

  // Price formatter helper to prevent double "Rp"
  const formatPrice = (price?: string) => {
    if (!price) return '';
    const cleaned = price.trim();
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned;
    }
    return `Rp ${cleaned}`;
  };

  // Service images map fallback
  const getServiceImage = (item: MenuItem, idx: number) => {
    if (item.imageUrl) return item.imageUrl;
    const fallbackImages = [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=300&auto=format&fit=crop&q=80',
    ];
    return fallbackImages[idx % fallbackImages.length];
  };

  // Filtered menu logic
  const filteredMenu = client.menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openBookingModal = (service: MenuItem, justSelect: boolean) => {
    setSelectedService(service);
    if (!justSelect) {
      setIsScheduleModalOpen(true);
    }
  };

  return (
    <section id="layanan" className="bg-slate-50/50 selection:bg-slate-100 py-16 sm:py-24 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header: Clean & Minimal */}
        <div 
          ref={headerRef}
          className={`mb-10 text-center transition-all duration-700 transform ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none mb-4">
            Pilih <span className="text-brand-primary">Layanan</span>
          </h2>
          <p className="text-slate-500 font-medium">Temukan layanan yang paling sesuai dengan kebutuhan Anda hari ini.</p>
        </div>

        {/* Search & Filter Top Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          {/* Clean Search Bar */}
          <div className="w-full md:w-[300px] flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3.5 shadow-sm border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
            <span className="text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-bold"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500 font-bold hover:bg-slate-200">
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex-1 w-full flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {client.categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? `bg-slate-900 text-white shadow-md`
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Cards (Animated Grid) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item, idx) => (
              <AnimatedServiceCard 
                key={item.id}
                item={item}
                isSelected={useClinicDemo().selectedService?.id === item.id}
                
                formatPrice={formatPrice}
                openBookingModal={openBookingModal}
                getServiceImage={getServiceImage}
                idx={idx}
              />
            ))
          ) : (
            <div className="col-span-full p-16 text-center flex flex-col items-center bg-white rounded-[32px] border border-dashed border-slate-200">
              <span className="text-4xl mb-4 opacity-50">🔍</span>
              <p className="text-base font-bold text-slate-700">Tidak ada layanan.</p>
              <p className="text-sm text-slate-400 mt-2">Coba gunakan kata kunci lain.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
