'use client';

import { useState, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/demos';

interface ClinicDemoClientProps {
  client: BusinessDemo;
}

export function ClinicDemoClient({ client }: ClinicDemoClientProps) {
  // Welcome Screen state (First time visitors only)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  useEffect(() => {
    const storageKey = `growfin_welcome_${client.name.replace(/\s+/g, '_')}`;
    const hasVisited = localStorage.getItem(storageKey);
    if (!hasVisited) {
      setShowWelcomeScreen(true);
    }
  }, [client.name]);

  const handleDismissWelcome = (targetTab: 'service' | 'hero' = 'service') => {
    const storageKey = `growfin_welcome_${client.name.replace(/\s+/g, '_')}`;
    localStorage.setItem(storageKey, 'true');
    setActiveScreen(targetTab);
    setShowWelcomeScreen(false);
  };

  // Screen tab state: 'service' | 'hero' | 'consultation' | 'profile'
  const [activeScreen, setActiveScreen] = useState<'service' | 'hero' | 'consultation' | 'profile'>('service');

  // Interactive search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedService, setSelectedService] = useState<MenuItem | null>(client.menu[0] || null);

  // Custom chat input simulation in Screen 3
  const [chatMessage, setChatMessage] = useState('');

  // Modal Schedule State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Jumat');
  const [selectedTime, setSelectedTime] = useState('15:00');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'pagi' | 'sore'>('sore');

  const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const morningTimes = ['08:30', '09:00', '10:00', '11:00'];
  const afternoonTimes = ['13:30', '14:00', '15:00', '16:30', '17:00', '19:00'];

  // Interactive Chat State for Screen 3
  interface ChatMessageItem {
    id: string;
    sender: 'user' | 'doctor';
    text: string;
    time: string;
  }

  const [chatHistory, setChatHistory] = useState<ChatMessageItem[]>([
    {
      id: '1',
      sender: 'user',
      text: client.doctor.sampleChat?.user || 'Halo Dok, saya ingin konsultasi mengenai jadwal treatment untuk minggu ini.',
      time: '09:40 AM',
    },
    {
      id: '2',
      sender: 'doctor',
      text: client.doctor.sampleChat?.doctor || 'Halo! Tentu, kami siap memberikan konsultasi dan jadwal terbaik untuk Anda.',
      time: '09:41 AM',
    },
  ]);

  const [isDoctorTyping, setIsDoctorTyping] = useState(false);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgText = chatMessage.trim();

    const newMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      time: currentTime,
    };

    setChatHistory((prev) => [...prev, newMsg]);
    setChatMessage('');
    setIsDoctorTyping(true);

    setTimeout(() => {
      const treatmentName = selectedService ? selectedService.name : 'layanan medis kami';
      const doctorReply: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        text: `Terima kasih atas pertanyaannya! Untuk konsultasi & perawatan *${treatmentName}*, kami sarankan untuk reservasi jadwal kunjungan agar dapat diperiksa secara optimal.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, doctorReply]);
      setIsDoctorTyping(false);
    }, 1200);
  };

  // Price formatter helper to prevent double "Rp" (e.g. "Rp Rp 120.000")
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

  // Construct dynamic WhatsApp action URL with Schedule format:
  // "Halo, saya ingin booking [Scaling Gigi] untuk hari [Jumat, 15:00]."
  const getWaBookingUrl = () => {
    const treatmentText = selectedService ? selectedService.name : 'Treatment Medis';
    const message = `Halo, saya ingin booking ${treatmentText} untuk hari ${selectedDay}, ${selectedTime}.`;
    return `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
  };

  const openBookingModal = (service?: MenuItem) => {
    if (service) {
      setSelectedService(service);
    }
    setIsScheduleModalOpen(true);
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

        {/* WELCOME ONBOARDING SCREEN (First-time Visitors Only) */}
        {showWelcomeScreen && (
          <div className="absolute inset-0 z-[120] bg-gradient-to-b from-blue-50 via-sky-50 to-blue-100 flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-300">
            {/* Top Header: Logo & Brand Name */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl shadow-md shadow-blue-500/30">
                  {client.iconEmoji || '🦷'}
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  {client.name.split(' ')[0] || 'Denta'}
                </span>
              </div>
              <button
                onClick={() => handleDismissWelcome('service')}
                className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[11px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200/80 shadow-xs"
              >
                Skip ➔
              </button>
            </div>

            {/* Main Headlines */}
            <div className="mt-4 space-y-2 text-center">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Beautiful Smile<br />
                <span className="text-blue-600">Confident You</span>
              </h1>
              <p className="text-xs text-slate-600 font-medium px-4 max-w-xs mx-auto leading-relaxed">
                {client.tagline || 'Expert dental & medical care for a healthier, brighter smile'}
              </p>
            </div>

            {/* Center 3D Visual Illustration */}
            <div className="relative my-4 flex flex-col items-center justify-center">
              <div className="absolute h-56 w-56 rounded-full bg-blue-400/20 blur-2xl -z-10" />

              <div className="relative h-60 w-full max-w-[260px] rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-gradient-to-b from-blue-400/10 to-blue-600/20 flex flex-col items-center justify-center group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80"
                  alt="3D Clinic Visual"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute bottom-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-lg flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-black shadow-sm">
                    ✓
                  </span>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-900 leading-none">Layanan Terpercaya</p>
                    <p className="text-[9px] font-semibold text-blue-600 mt-0.5">Dokter Spesialis Medis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5 pb-4 text-center">
              <button
                onClick={() => handleDismissWelcome('service')}
                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base font-extrabold rounded-full shadow-lg shadow-blue-600/30 active:scale-98 transition-all group"
              >
                <span>Get Started</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 text-sm font-black group-hover:translate-x-1 transition-transform shadow-sm">
                  →
                </span>
              </button>

              <button
                onClick={() => handleDismissWelcome('service')}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5 w-full py-1"
              >
                <span>Explore Services</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

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
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${isActive
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
                      className={`group relative flex items-center justify-between rounded-3xl bg-white p-3.5 shadow-sm border transition-all cursor-pointer ${isSelected
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
                            {formatPrice(item.price)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openBookingModal(item);
                            }}
                            className="flex h-7 px-2.5 items-center justify-center gap-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-sm shadow-blue-500/30 transition-transform active:scale-95"
                          >
                            <span>Booking</span>
                            <span>→</span>
                          </button>
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

            {/* Credibility & Clickable Address Card */}
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 space-y-2.5">
              <a
                href={client.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 p-2 -mx-2 rounded-xl hover:bg-blue-50/70 transition-colors cursor-pointer"
              >
                <span className="text-lg text-blue-600 group-hover:scale-110 transition-transform">📍</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Lokasi Klinik
                    </p>
                    <span className="text-[10px] font-extrabold text-blue-600 group-hover:underline flex items-center gap-0.5">
                      Buka Peta ↗
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5 group-hover:text-blue-700">
                    {client.address}
                  </p>
                </div>
              </a>
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
              <button
                onClick={() => openBookingModal()}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Pilih Jadwal & Konsultasi</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: "Consultation & Interactive Doctor Chat" */}
        {activeScreen === 'consultation' && (
          <div className="flex-1 flex flex-col overflow-y-auto px-5 pt-5 pb-24 bg-[#F8FAFC]">
            {/* Doctor Profile Header */}
            <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-100">
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

            {/* Service Selection Picker before Chat */}
            <div className="mb-4 rounded-2xl bg-white p-3 shadow-xs border border-slate-100">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1.5">
                🩺 Pilih Layanan / Treatment Konsultasi:
              </label>
              <div className="relative">
                <select
                  value={selectedService?.id || ''}
                  onChange={(e) => {
                    const found = client.menu.find((m) => m.id === Number(e.target.value));
                    if (found) setSelectedService(found);
                  }}
                  className="w-full appearance-none rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none shadow-xs pr-8 cursor-pointer"
                >
                  {client.menu.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {formatPrice(item.price)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Live Chat History */}
            <div className="mb-4 space-y-3 flex-1 overflow-y-auto">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                💬 Live Chat Konsultasi Dokter
              </p>

              {chatHistory.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-xs transition-all ${isUser
                        ? 'ml-auto rounded-tr-none bg-blue-600 text-white shadow-blue-600/15'
                        : 'mr-auto rounded-tl-none bg-white text-slate-700 border border-slate-100 shadow-sm'
                      }`}
                  >
                    {!isUser && (
                      <p className="font-bold text-blue-600 mb-1 text-[11px]">{client.doctor.name}</p>
                    )}
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[9px] text-right mt-1 font-medium ${isUser ? 'text-blue-200' : 'text-slate-400'
                        }`}
                    >
                      {msg.time} {isUser && '✓✓'}
                    </span>
                  </div>
                );
              })}

              {/* Typing Indicator Animation */}
              {isDoctorTyping && (
                <div className="mr-auto max-w-[80%] rounded-2xl rounded-tl-none bg-white p-3 text-xs text-slate-500 border border-slate-100 shadow-xs flex items-center gap-2">
                  <span className="font-bold text-blue-600 text-[11px]">{client.doctor.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Field & Booking Action */}
            <div className="mt-auto space-y-2">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm border border-slate-200 focus-within:border-blue-500 transition-all">
                <span className="text-slate-400 text-sm">💬</span>
                <input
                  type="text"
                  placeholder="Ketik pesan konsultasi Anda..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full border-none bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/30 disabled:opacity-40 transition-all"
                >
                  ➔
                </button>
              </form>

              <button
                onClick={() => openBookingModal()}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-600/25 transition-all"
              >
                <span>Pilih Jadwal & Kirim via WA 💬</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: "Profil Bisnis Google Maps Style" */}
        {activeScreen === 'profile' && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-24 bg-[#F8FAFC]">
            {/* Google Maps Style Cover Image Banner */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80"
                alt="Google Maps Profile Banner"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-slate-900 shadow-sm">
                    <span className="text-red-500">📍</span> Google Business Profile
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                    ✓ Verified
                  </span>
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400">
                    <span>⭐ {client.rating.toFixed(1)}</span>
                    <span className="text-slate-300">({client.reviewCount}+ Google Reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content Container */}
            <div className="px-5 pt-4 space-y-4">
              {/* Business Title & Category */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white text-2xl shadow-md shadow-blue-500/25">
                    {client.iconEmoji || '🏥'}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 leading-snug">
                      {client.name}
                    </h2>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{client.category}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {client.tagline}
                    </p>
                  </div>
                </div>

                {/* Google Maps Style Quick Action Buttons Grid */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <a
                    href={client.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                  >
                    <span className="text-base">🗺️</span>
                    <span className="text-[10px] font-extrabold">Rute</span>
                  </a>
                  <a
                    href={`tel:${client.phone}`}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    <span className="text-base">📞</span>
                    <span className="text-[10px] font-extrabold">Telepon</span>
                  </a>
                  <button
                    onClick={() => openBookingModal()}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  >
                    <span className="text-base">📅</span>
                    <span className="text-[10px] font-extrabold">Booking</span>
                  </button>
                  <a
                    href={getWaBookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  >
                    <span className="text-base">💬</span>
                    <span className="text-[10px] font-extrabold">Chat WA</span>
                  </a>
                </div>
              </div>

              {/* Information Cards List */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-base text-blue-600 mt-0.5">📍</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Alamat Lengkap
                    </p>
                    <p className="font-semibold text-slate-800 leading-snug mt-0.5">
                      {client.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <span className="text-base text-blue-600 mt-0.5">🕒</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Jam Operasional
                    </p>
                    <p className="font-semibold text-slate-800 mt-0.5">{client.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <span className="text-base text-blue-600 mt-0.5">📞</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Telepon / Kontak
                    </p>
                    <p className="font-semibold text-slate-800 mt-0.5">{client.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <span className="text-base text-blue-600 mt-0.5">🏢</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Kota & Wilayah Layanan
                    </p>
                    <p className="font-semibold text-slate-800 mt-0.5">{client.city}, Indonesia</p>
                  </div>
                </div>
              </div>

              {/* Google Reviews Highlights */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-slate-900">Ulasan Pengunjung Google</p>
                  <span className="text-[10px] font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ⭐ {client.rating} / 5.0
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Rina S.</span>
                      <span className="text-[10px] text-amber-500">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      &quot;Pelayanan ramah, dokternya penjelasannya sangat detail dan tempatnya sangat bersih dan nyaman.&quot;
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Budi K.</span>
                      <span className="text-[10px] text-amber-500">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      &quot;Booking via WhatsApp sangat gampang dan tidak perlu antre lama di lokasi.&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* External Google Maps Link CTA */}
              <a
                href={client.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold rounded-2xl shadow-md transition-all"
              >
                <span>Buka di Google Maps 🗺️</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        )}

        {/* MODAL / SHEET: Pilih Jadwal Kunjungan */}
        {isScheduleModalOpen && (
          <div className="absolute inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200">
            <div className="w-full rounded-t-[32px] bg-white p-5 shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300 max-h-[90%] overflow-y-auto">
              {/* Modal Handle & Header */}
              <div className="flex flex-col items-center mb-3">
                <div className="h-1.5 w-12 rounded-full bg-slate-200 mb-3" />
                <div className="flex w-full items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">Pilih Jadwal Kunjungan</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      Silakan tentukan layanan & waktu kunjungan
                    </p>
                  </div>
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Section 1: Pilih Layanan / Treatment */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  🩺 1. Pilih Layanan / Treatment
                </label>
                <div className="relative">
                  <select
                    value={selectedService?.id || ''}
                    onChange={(e) => {
                      const found = client.menu.find((m) => m.id === Number(e.target.value));
                      if (found) setSelectedService(found);
                    }}
                    className="w-full appearance-none rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none shadow-xs pr-9 cursor-pointer"
                  >
                    {client.menu.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} — {formatPrice(item.price)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Section 2: Pilih Hari */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  📅 2. Pilih Hari
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {daysList.map((day) => {
                    const isSelected = selectedDay === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all border ${isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Pilih Jam (Pagi / Sore) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    ⏰ 3. Pilih Jam
                  </label>
                  {/* Tab Pagi / Sore */}
                  <div className="flex rounded-full bg-slate-100 p-0.5 text-[11px] font-bold">
                    <button
                      onClick={() => {
                        setSelectedTimePeriod('pagi');
                        if (!morningTimes.includes(selectedTime)) setSelectedTime('09:00');
                      }}
                      className={`px-3 py-1 rounded-full transition-all ${selectedTimePeriod === 'pagi'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      🌅 Pagi
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTimePeriod('sore');
                        if (!afternoonTimes.includes(selectedTime)) setSelectedTime('15:00');
                      }}
                      className={`px-3 py-1 rounded-full transition-all ${selectedTimePeriod === 'sore'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      🌇 Sore
                    </button>
                  </div>
                </div>

                {/* Time Chips */}
                <div className="flex flex-wrap gap-2">
                  {(selectedTimePeriod === 'pagi' ? morningTimes : afternoonTimes).map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3.5 rounded-2xl text-xs font-bold transition-all border ${isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Box */}
              <div className="mb-5 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  💬 Format Pesan WhatsApp:
                </p>
                <p className="text-xs font-medium text-slate-800 leading-relaxed italic bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  &quot;Halo, saya ingin booking <span className="font-bold text-emerald-700">[{selectedService?.name || 'Treatment Medis'}]</span> untuk hari <span className="font-bold text-emerald-700">[{selectedDay}, {selectedTime}]</span>.&quot;
                </p>
              </div>

              {/* Action Button */}
              <a
                href={getWaBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Lanjutkan ke WhatsApp 💬</span>
                <span>→</span>
              </a>
            </div>
          </div>
        )}

        {/* BOTTOM FIXED NAVIGATION TAB BAR (Sleek Smartphone Tabs) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 flex items-center justify-between z-50">
          {[
            { id: 'service', label: 'Service', icon: '📋' },
            { id: 'hero', label: 'Onboarding', icon: '✨' },
            { id: 'consultation', label: 'Consultation', icon: '💬' },
            { id: 'profile', label: 'Profil G-Maps', icon: '📍' },
          ].map((tab) => {
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveScreen(tab.id as typeof activeScreen)}
                className={`flex-1 flex flex-col items-center gap-0.5 transition-all ${isActive ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span
                  className={`text-[10px] ${isActive ? 'font-black text-blue-600' : 'font-semibold text-slate-500'
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
