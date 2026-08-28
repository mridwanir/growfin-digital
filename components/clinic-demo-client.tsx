'use client';

import { useState } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/demos';

interface ClinicDemoClientProps {
  client: BusinessDemo;
}

export function ClinicDemoClient({ client }: ClinicDemoClientProps) {
  // Screen tab state: 'service' | 'hero' | 'consultation'
  const [activeScreen, setActiveScreen] = useState<'service' | 'hero' | 'consultation'>('service');
  
  // Interactive search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedService, setSelectedService] = useState<MenuItem | null>(client.menu[0] || null);

  // Custom chat input simulation in Screen 3
  const [chatMessage, setChatMessage] = useState('');

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

  // Construct dynamic WhatsApp action URL
  const getWaUrl = (customText?: string) => {
    const treatmentText = selectedService ? selectedService.name : 'Treatment Medis';
    const message =
      customText ||
      `Halo ${client.name}, saya berminat reservasi treatment *${treatmentText}*. Apakah jadwal konsultasi masih tersedia?`;
    return `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Smartphone Outer Canvas Container */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[840px] sm:max-h-[920px] bg-white sm:rounded-[40px] shadow-2xl sm:shadow-slate-300/60 overflow-hidden flex flex-col relative border border-slate-200/80">
        
        {/* Smartphone Top Bar / Status Notch Simulation (Desktop Only) */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-semibold text-slate-500 bg-white border-b border-slate-100">
          <span>9:41</span>
          <div className="h-4 w-20 bg-slate-900 rounded-full" />
          <div className="flex items-center gap-1.5 text-xs">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* SCREEN 1: "Choose a Service" (Katalog & Filter Layanan) */}
        {activeScreen === 'service' && (
          <div className="flex-1 flex flex-col overflow-y-auto px-5 pt-4 pb-24 bg-[#F8FAFC]">
            {/* Header: Logo, Clinic Name, Rating, Notification */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-md shadow-blue-500/25">
                  {client.iconEmoji || '🩺'}
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                    {client.name}
                  </h1>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 mt-0.5">
                    <span className="text-amber-500">⭐ {client.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({client.reviewCount}+ ulasan)</span>
                  </div>
                </div>
              </div>
              <button
                aria-label="Notification bell"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50"
              >
                🔔
              </button>
            </div>

            {/* Title Section */}
            <div className="mb-4">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                Choose <br />
                <span className="text-blue-600">a Service</span>
              </h2>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex items-center gap-2.5 rounded-full bg-white px-4 py-3 shadow-sm border border-slate-200/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="text-slate-400 text-base">🔍</span>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400">
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Chips (Horizontal Scrollable) */}
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {client.categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Service Cards (Horizontal Banner Style) */}
            <div className="space-y-3.5">
              {filteredMenu.length > 0 ? (
                filteredMenu.map((item, idx) => {
                  const isSelected = selectedService?.id === item.id;
                  const itemImg = getServiceImage(item, idx);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedService(item)}
                      className={`group relative flex items-center justify-between rounded-3xl bg-white p-3.5 shadow-sm border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-md'
                          : 'border-slate-100 hover:border-blue-200 hover:shadow-md'
                      }`}
                    >
                      {/* Left Details */}
                      <div className="flex-1 pr-3 min-w-0">
                        {item.tag && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1 border border-blue-100">
                            {item.tag}
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-black text-blue-600">
                            Rp {item.price}
                          </span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
                            →
                          </span>
                        </div>
                      </div>

                      {/* Right Image with Curved Clipping */}
                      <div className="relative h-22 w-22 shrink-0 rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={itemImg}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                  Tidak ada layanan yang ditemukan untuk pencarian ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 2: "Hero Landing / Onboarding" (Branding & Trust) */}
        {activeScreen === 'hero' && (
          <div className="flex-1 flex flex-col overflow-y-auto px-5 pt-6 pb-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/30">
                  {client.iconEmoji || '🦷'}
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    {client.category}
                  </p>
                  <h1 className="text-base font-black text-slate-900">{client.name}</h1>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-200">
                Open
              </span>
            </div>

            {/* 3D / Medical Clean Visual Banner */}
            <div className="relative mb-6 overflow-hidden rounded-3xl bg-slate-900 shadow-lg group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&auto=format&fit=crop&q=80"
                alt="Clinic Showcase"
                className="h-52 w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-4 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full w-max border border-amber-400/20">
                  <span>⭐ {client.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span className="text-slate-200">{client.reviewCount}+ Google Reviews</span>
                </div>
              </div>
            </div>

            {/* Headline & Credibility */}
            <div className="mb-6 space-y-2">
              <h2 className="text-3xl font-black leading-tight text-slate-900">
                Beautiful Smile,<br />
                <span className="text-blue-600">Confident You</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {client.tagline}
              </p>
            </div>

            {/* Credibility & Address Card */}
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="text-lg text-blue-600">📍</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lokasi Klinik
                  </p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {client.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                <span className="text-lg text-blue-600">🕒</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Jam Operasional
                  </p>
                  <p className="text-xs font-semibold text-slate-800">{client.hours}</p>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="mt-auto pt-2">
              <a
                href={getWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Konsultasi Sekarang</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
                  →
                </span>
              </a>
            </div>
          </div>
        )}

        {/* SCREEN 3: "Consultation & Direct WhatsApp Lead" (Simulasi Interaksi Dokter) */}
        {activeScreen === 'consultation' && (
          <div className="flex-1 flex flex-col overflow-y-auto px-5 pt-5 pb-24 bg-[#F8FAFC]">
            {/* Doctor Profile Header */}
            <div className="mb-5 rounded-3xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl text-white shadow-md shadow-blue-500/25 overflow-hidden">
                  {client.doctor.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={client.doctor.avatarUrl}
                      alt={client.doctor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{client.doctor.avatarEmoji || '👩‍⚕️'}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{client.doctor.name}</h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 font-semibold">{client.doctor.role}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{client.name}</p>
                </div>
              </div>

              {/* Quick Action Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="rounded-xl bg-slate-50 p-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Pengalaman</span>
                  <span className="text-xs font-extrabold text-slate-800">8+ Tahun</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Rating</span>
                  <span className="text-xs font-extrabold text-amber-500">⭐ {client.rating}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Respon WA</span>
                  <span className="text-xs font-extrabold text-blue-600">&lt; 5 Menit</span>
                </div>
              </div>
            </div>

            {/* Simulated Chat Preview */}
            <div className="mb-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                💬 Live Chat Preview
              </p>

              {/* Patient Bubble */}
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-blue-600 p-3.5 text-xs text-white shadow-md shadow-blue-600/15">
                <p className="leading-relaxed">
                  {client.doctor.sampleChat?.user ||
                    'Halo Dok, saya ingin konsultasi mengenai jadwal treatment untuk minggu ini.'}
                </p>
                <span className="block text-[9px] text-blue-200 text-right mt-1 font-medium">
                  09:40 AM ✓✓
                </span>
              </div>

              {/* Doctor Bubble */}
              <div className="max-w-[88%] rounded-2xl rounded-tl-none bg-white p-3.5 text-xs text-slate-700 shadow-sm border border-slate-100">
                <p className="font-bold text-blue-600 mb-1">{client.doctor.name}</p>
                <p className="leading-relaxed">
                  {client.doctor.sampleChat?.doctor ||
                    'Halo! Tentu, kami siap memberikan konsultasi dan jadwal terbaik untuk Anda.'}
                </p>
                <span className="block text-[9px] text-slate-400 text-right mt-1 font-medium">
                  09:41 AM
                </span>
              </div>

              {/* Active Selected Treatment Card Indicator */}
              {selectedService && (
                <div className="rounded-2xl bg-blue-50 p-3 border border-blue-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Treatment Dipilih:</p>
                    <p className="text-xs font-bold text-slate-900">{selectedService.name}</p>
                    <p className="text-[11px] font-extrabold text-blue-600">Rp {selectedService.price}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-white px-2.5 py-1 rounded-full shadow-sm">
                    Terpilih ✓
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Input Field & Quick Trigger */}
            <div className="mt-auto space-y-2">
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm border border-slate-200">
                <span className="text-slate-400 text-sm">💬</span>
                <input
                  type="text"
                  placeholder="Ketik pesan konsultasi Anda..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full border-none bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <a
                href={getWaUrl(chatMessage ? chatMessage : undefined)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-600/25 transition-all"
              >
                <span>Kirim via WhatsApp 💬</span>
                <span>➔</span>
              </a>
            </div>
          </div>
        )}

        {/* BOTTOM FIXED NAVIGATION TAB BAR (Sleek Smartphone Tabs) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 flex items-center justify-between z-50">
          {[
            { id: 'service', label: 'Choose Service', icon: '📋' },
            { id: 'hero', label: 'Onboarding', icon: '✨' },
            { id: 'consultation', label: 'Consultation', icon: '💬' },
          ].map((tab) => {
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveScreen(tab.id as typeof activeScreen)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span
                  className={`text-[10px] ${
                    isActive ? 'font-black text-blue-600' : 'font-semibold text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span className="h-1 w-4 rounded-full bg-blue-600 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
