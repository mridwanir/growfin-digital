'use client';

import { useState } from 'react';
import { useGroomingDemo } from './GroomingDemoContext';

export function GroomingBookingModal() {
  const { 
    client, 
    isBookingModalOpen, 
    setIsBookingModalOpen,
    bookingState,
    updateBookingField,
    selectedServices,
    totalEstimatedDuration,
    totalEstimatedPrice
  } = useGroomingDemo();

  const [step, setStep] = useState(1);

  if (!isBookingModalOpen) return null;

  const handleSendWA = () => {
    let message = `Halo Admin ${client.name}, saya ingin konfirmasi jadwal reservasi:\n\n`;
    message += `*Data Pemesan:*\n`;
    message += `• Nama: ${bookingState.customerName || 'Tamu'}\n\n`;
    
    message += `*Detail Layanan:*\n`;
    if (selectedServices.length > 0) {
      selectedServices.forEach(s => {
        message += `• ${s.name} (±${s.duration || 30} mnt)\n`;
      });
    } else {
      message += `• Konsultasi Langsung\n`;
    }
    
    if (bookingState.referenceLookbook) {
      message += `• Referensi Gaya: ${bookingState.referenceLookbook.name}\n`;
    }

    message += `\n*Jadwal & Preferensi:*\n`;
    const dateStr = bookingState.preferredDate ? new Date(bookingState.preferredDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Belum Ditentukan';
    
    let sessionText = 'Sesi Pagi (10.00 - 12.00)';
    if (bookingState.preferredSession === 'AFTERNOON') sessionText = 'Sesi Siang (13.00 - 17.00)';
    if (bookingState.preferredSession === 'EVENING') sessionText = 'Sesi Malam (18.00 - 21.00)';
    
    message += `• Waktu: ${dateStr}, ${sessionText}\n`;
    message += `• Kapster/Terapis: ${bookingState.preferredPractitioner ? bookingState.preferredPractitioner.name : 'Bebas / Siapa Saja'}\n\n`;
    
    message += `*Estimasi:* Rp ${totalEstimatedPrice.toLocaleString('id-ID')} (±${totalEstimatedDuration} Menit)\n\n`;
    message += `Mohon konfirmasi ketersediaan slot waktu tersebut. Terima kasih!`;

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
            <h2 className="text-xl font-black text-slate-900 leading-tight">Konfirmasi Reservasi</h2>
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
                <h3 className="font-bold text-slate-900 mb-3">1. Jadwal Kedatangan</h3>
                <input 
                  type="date"
                  value={bookingState.preferredDate}
                  onChange={(e) => updateBookingField('preferredDate', e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-700 font-bold focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">Sesi Waktu</h3>
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
                        <span className="block text-xs text-slate-500">10.00 - 12.00</span>
                      </div>
                    </div>
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
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">Jam Sibuk</span>
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
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Waktu Favorit</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">2. Preferensi Ahli / Kapster</h3>
                <p className="text-xs text-slate-500 mb-4">Pilih terapis atau kapster langganan Anda, atau biarkan sistem memilihkan yang tersedia.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateBookingField('preferredPractitioner', null)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      bookingState.preferredPractitioner === null 
                      ? 'border-brand-primary bg-brand-light/50 ring-4 ring-brand-primary/10' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">⏳</div>
                    <div>
                      <span className="block font-bold text-sm text-slate-900">Bebas</span>
                      <span className="block text-[10px] text-slate-500">Siapa saja yang siap</span>
                    </div>
                  </button>
                  
                  {client.practitioners?.map(prac => (
                    <button
                      key={prac.id}
                      onClick={() => updateBookingField('preferredPractitioner', prac)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        bookingState.preferredPractitioner?.id === prac.id 
                        ? 'border-brand-primary bg-brand-light/50 ring-4 ring-brand-primary/10' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-xl">
                        {prac.avatarEmoji || '🧑‍⚕️'}
                      </div>
                      <div>
                        <span className="block font-bold text-sm text-slate-900">{prac.name}</span>
                        <span className="block text-[10px] text-slate-500">{prac.role}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">3. Konfirmasi Data</h3>
                <p className="text-xs text-slate-500 mb-6">Masukkan nama Anda untuk menyelesaikan reservasi.</p>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nama Pemesan</label>
                  <input 
                    type="text"
                    placeholder="Masukkan nama Anda..."
                    value={bookingState.customerName}
                    onChange={(e) => updateBookingField('customerName', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Summary Box */}
                <div className="bg-slate-900 rounded-2xl p-5 text-white">
                  <h4 className="font-bold text-sm mb-4 border-b border-slate-700 pb-3">Ringkasan Reservasi</h4>
                  
                  <div className="space-y-3 text-sm">
                    {selectedServices.length > 0 ? (
                      selectedServices.map(s => (
                        <div key={s.id} className="flex justify-between items-start">
                          <span className="text-slate-300">{s.name}</span>
                          <span className="font-bold">{s.price}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 italic">Belum ada layanan yang dipilih</div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">Total Estimasi</p>
                      <p className="text-xs text-slate-500">Durasi: ±{totalEstimatedDuration} mnt</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl text-brand-primary">Rp {totalEstimatedPrice.toLocaleString('id-ID')}</p>
                    </div>
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
              disabled={step === 1 && !bookingState.preferredDate}
              className="flex-1 py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white font-black shadow-lg shadow-brand-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjutkan
            </button>
          ) : (
            <button 
              onClick={handleSendWA}
              disabled={!bookingState.customerName}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Konfirmasi via WA</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
