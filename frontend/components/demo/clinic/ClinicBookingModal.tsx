'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { MessageCircle } from 'lucide-react';

export function ClinicBookingModal() {
  const { 
    client, 
    isBookingModalOpen, 
    setIsBookingModalOpen,
    bookingState,
    updateBookingField
  } = useClinicDemo();

  if (!isBookingModalOpen) return null;

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault();

    let message = `Halo Admin ${client.name}, saya ingin mengajukan jadwal temu:\n\n`;
    message += `• *Layanan/Praktisi*: ${bookingState.selectedService?.name || 'Konsultasi Umum'}\n`;
    
    let sessionText = 'Sesi Pagi';
    if (bookingState.preferredSession === 'AFTERNOON') sessionText = 'Sesi Siang';
    if (bookingState.preferredSession === 'EVENING') sessionText = 'Sesi Sore/Malam';

    const dateStr = bookingState.preferredDate ? new Date(bookingState.preferredDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Belum Ditentukan';
    
    message += `• *Tanggal*: ${dateStr}\n`;
    message += `• *Shift Waktu*: ${sessionText}\n`;
    
    if (bookingState.complaint) {
      message += `• *Keluhan/Kebutuhan*: ${bookingState.complaint}\n`;
    }
    
    message += `\nMohon konfirmasinya. Terima kasih.`;

    const waUrl = `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setIsBookingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsBookingModalOpen(false)}
      />

      {/* Modal panel */}
      <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100 z-10 w-full animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold leading-6 text-gray-900 flex items-center gap-2">
            Form Reservasi Jadwal
          </h3>
          <button 
            type="button" 
            onClick={() => setIsBookingModalOpen(false)}
            className="text-gray-400 hover:text-red-500 transition focus:outline-none"
          >
            <span className="text-xl font-bold">✕</span>
          </button>
        </div>
        
        {/* Form Body */}
        <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-5">
            Silakan isi detail di bawah ini. Anda akan diarahkan ke WhatsApp untuk konfirmasi jadwal dengan resepsionis kami.
          </p>
          
          <form onSubmit={handleSendWA} className="space-y-4">
            
            {/* Pilih Layanan/Spesialis */}
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">Pilih Praktisi / Layanan <span className="text-red-500">*</span></label>
              <select 
                required 
                value={bookingState.selectedService?.id || ''}
                onChange={(e) => {
                  const s = client.menu.find(m => m.id === e.target.value);
                  if (s) updateBookingField('selectedService', s);
                }}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 bg-white outline-none"
              >
                <option value="" disabled>-- Pilih Layanan/Ahli --</option>
                {client.menu.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">Tanggal <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  required 
                  min={new Date().toISOString().split('T')[0]} 
                  value={bookingState.preferredDate || ''}
                  onChange={(e) => updateBookingField('preferredDate', e.target.value)}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 outline-none"
                />
              </div>
              {/* Time Shift */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">Shift Waktu <span className="text-red-500">*</span></label>
                <select 
                  required 
                  value={bookingState.preferredSession || ''}
                  onChange={(e) => updateBookingField('preferredSession', e.target.value as any)}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 bg-white outline-none"
                >
                  <option value="" disabled>Pilih Jam</option>
                  <option value="MORNING">Pagi (08:00 - 11:00)</option>
                  <option value="AFTERNOON">Siang (13:00 - 15:00)</option>
                  <option value="EVENING">Sore/Malam (15:00 - 18:00)</option>
                </select>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">Detail Keluhan / Kebutuhan <span className="text-red-500">*</span></label>
              <textarea 
                rows={3} 
                required 
                placeholder="Jelaskan secara singkat keluhan atau layanan yang Anda butuhkan..." 
                value={bookingState.complaint || ''}
                onChange={(e) => updateBookingField('complaint', e.target.value)}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 outline-none"
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-end gap-x-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setIsBookingModalOpen(false)}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-red-600 px-3 py-2 transition"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Lanjut ke WhatsApp
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
