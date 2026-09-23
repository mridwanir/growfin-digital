'use client';

import { useState } from 'react';
import { useClinicDemo, BookingState } from './ClinicDemoContext';
import { MenuItem } from '@/lib/types';

export function ClinicBookingModal() {
  const { 
    client, 
    isBookingModalOpen, 
    setIsBookingModalOpen,
    bookingState,
    updateBookingField
  } = useClinicDemo();

  const [step, setStep] = useState(1);

  if (!isBookingModalOpen) return null;

  const handleSendWA = () => {
    let message = `Halo Admin ${client.name}, saya ingin mengajukan jadwal temu:\n\n`;
    message += `• *Nama*: ${bookingState.patientName || 'Tamu'}\n`;
    message += `• *Status*: ${bookingState.patientStatus === 'NEW' ? 'Pasien/Klien Baru' : 'Kunjungan Ulang'}\n`;
    message += `• *Layanan*: ${bookingState.selectedService?.name || 'Konsultasi Umum'}\n`;
    if (bookingState.complaint) {
      message += `• *Keluhan/Kebutuhan*: ${bookingState.complaint}\n`;
    }
    
    let sessionText = 'Sesi Pagi';
    if (bookingState.preferredSession === 'AFTERNOON') sessionText = 'Sesi Siang';
    if (bookingState.preferredSession === 'EVENING') sessionText = 'Sesi Malam';

    const dateStr = bookingState.preferredDate ? new Date(bookingState.preferredDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Belum Ditentukan';
    
    message += `• *Rencana Waktu*: ${dateStr} (${sessionText})\n\n`;
    message += `Mohon konfirmasi ketersediaan jadwal dan syarat yang perlu disiapkan. Terima kasih!`;

    const waUrl = `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsBookingModalOpen(false)}
      />
      
      <div className="relative w-full max-w-lg bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Jadwalkan Konsultasi</h2>
            <p className="text-xs font-bold text-slate-400 mt-1">Langkah {step} dari 3</p>
          </div>
          <button 
            onClick={() => setIsBookingModalOpen(false)}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 flex">
          <div className="h-full bg-brand-primary transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">1. Status Kunjungan Anda</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateBookingField('patientStatus', 'NEW')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      bookingState.patientStatus === 'NEW' 
                      ? 'border-brand-primary bg-brand-light/50 ring-4 ring-brand-primary/10' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="block text-2xl mb-2">👋</span>
                    <span className="block font-bold text-sm text-slate-900 mb-1">Klien Baru</span>
                    <span className="block text-xs text-slate-500">Belum pernah terdaftar</span>
                  </button>
                  <button
                    onClick={() => updateBookingField('patientStatus', 'RETURNING')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      bookingState.patientStatus === 'RETURNING' 
                      ? 'border-brand-primary bg-brand-light/50 ring-4 ring-brand-primary/10' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="block text-2xl mb-2">🔄</span>
                    <span className="block font-bold text-sm text-slate-900 mb-1">Kunjungan Ulang</span>
                    <span className="block text-xs text-slate-500">Sudah terdaftar / kontrol</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">Layanan yang Dibutuhkan</h3>
                <div className="space-y-2">
                  {client.menu.map(service => (
                    <label key={service.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${bookingState.selectedService?.id === service.id ? 'border-brand-primary bg-brand-light/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                      <input 
                        type="radio" 
                        name="service" 
                        className="mt-1 accent-brand-primary"
                        checked={bookingState.selectedService?.id === service.id}
                        onChange={() => updateBookingField('selectedService', service)}
                      />
                      <div>
                        <span className="block font-bold text-slate-900">{service.name}</span>
                        <span className="block text-xs text-slate-500 mt-1">{service.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">2. Pilih Waktu Konsultasi</h3>
                <input 
                  type="date"
                  value={bookingState.preferredDate}
                  onChange={(e) => updateBookingField('preferredDate', e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-700 font-bold focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">Sesi / Jam Kedatangan</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => updateBookingField('preferredSession', 'MORNING')}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      bookingState.preferredSession === 'MORNING' 
                      ? 'border-brand-primary bg-brand-light/50 ring-4 ring-brand-primary/10' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌅</span>
                      <div className="text-left">
                        <span className="block font-bold text-sm text-slate-900">Pagi</span>
                        <span className="block text-xs text-slate-500">09.00 - 12.00</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Tersedia</span>
                  </button>
                  <button
                    onClick={() => updateBookingField('preferredSession', 'AFTERNOON')}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      bookingState.preferredSession === 'AFTERNOON' 
                      ? 'border-brand-primary bg-brand-light/50 ring-4 ring-brand-primary/10' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">☀️</span>
                      <div className="text-left">
                        <span className="block font-bold text-sm text-slate-900">Siang / Sore</span>
                        <span className="block text-xs text-slate-500">13.00 - 17.00</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">Terbatas</span>
                  </button>
                  <button
                    onClick={() => updateBookingField('preferredSession', 'EVENING')}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      bookingState.preferredSession === 'EVENING' 
                      ? 'border-brand-primary bg-brand-light/50 ring-4 ring-brand-primary/10' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌙</span>
                      <div className="text-left">
                        <span className="block font-bold text-sm text-slate-900">Malam</span>
                        <span className="block text-xs text-slate-500">18.00 - 21.00</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Tersedia</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">3. Data Diri & Keluhan</h3>
                <p className="text-xs text-slate-500 mb-4">Membantu kami mempersiapkan solusi terbaik untuk Anda.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <input 
                      type="text"
                      placeholder="Masukkan nama Anda..."
                      value={bookingState.patientName}
                      onChange={(e) => updateBookingField('patientName', e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Keluhan / Catatan / Pertanyaan</label>
                    <textarea 
                      placeholder="Ceritakan secara singkat keluhan yang Anda rasakan atau kebutuhan Anda..."
                      value={bookingState.complaint}
                      onChange={(e) => updateBookingField('complaint', e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all bg-white min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between gap-4 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          {step > 1 ? (
            <button 
              onClick={handlePrev}
              className="px-6 py-3.5 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
            >
              Kembali
            </button>
          ) : (
            <div className="w-24 shrink-0"></div> // Spacer
          )}

          {step < 3 ? (
            <button 
              onClick={handleNext}
              disabled={step === 1 && !bookingState.selectedService}
              className="flex-1 py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white font-black shadow-lg shadow-brand-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjutkan
            </button>
          ) : (
            <button 
              onClick={handleSendWA}
              disabled={!bookingState.patientName || !bookingState.preferredDate}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Kirim Booking via WA</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
