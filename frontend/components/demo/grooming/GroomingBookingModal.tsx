'use client';

import { useGroomingDemo } from './GroomingDemoContext';
import { FormEvent } from 'react';
import { MessageCircle } from 'lucide-react';

export function GroomingBookingModal() {
  const { 
    client, 
    isBookingModalOpen, 
    setIsBookingModalOpen,
    bookingState,
    updateBookingField,
    selectedServices,
  } = useGroomingDemo();

  if (!isBookingModalOpen) return null;

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();

    const date = bookingState.preferredDate;
    const time = (document.getElementById('booking-time') as HTMLInputElement)?.value;
    
    // Fallback names for service/stylist if not using contexts
    const serviceName = selectedServices.length > 0 
      ? selectedServices.map(s => s.name).join(', ') 
      : (document.getElementById('service-select') as HTMLSelectElement)?.value || 'Konsultasi Layanan';
      
    const stylistName = bookingState.preferredPractitioner 
      ? bookingState.preferredPractitioner.name 
      : (document.getElementById('stylist-select') as HTMLSelectElement)?.value || 'Siapa Saja';

    const message = `Halo Admin ${client.name},\n\nSaya ingin melakukan reservasi dengan rincian berikut:\n\n` + 
                    `Layanan: ${serviceName}\n` +
                    `Stylist/Kapster: ${stylistName}\n` +
                    `Tanggal: ${date || 'Belum dipilih'}\n` +
                    `Jam: ${time || 'Belum dipilih'}\n\n` +
                    `Apakah slot tersebut masih tersedia? Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${client.waNumber}?text=${encodedMessage}`;

    window.open(waLink, '_blank');
    setIsBookingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 transition-opacity duration-300 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setIsBookingModalOpen(false)}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-[90%] max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden scale-100 transition-transform duration-300">
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif font-bold text-stone-900">Reservasi Jadwal</h3>
            <button 
              onClick={() => setIsBookingModalOpen(false)} 
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
            >
              ✕
            </button>
          </div>

          <form id="booking-form" onSubmit={handleBooking}>
            
            {/* Select Treatment */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Treatment</label>
              <div className="relative">
                <select 
                  id="service-select"
                  className="w-full appearance-none border border-stone-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition text-gray-700"
                  defaultValue={selectedServices.length > 0 ? selectedServices[0].name : ""}
                >
                  <option value="">-- Silakan Pilih Layanan --</option>
                  {client.menu.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                  <option value="Konsultasi">Paket Lainnya (Konsultasi)</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
              </div>
            </div>

            {/* Select Stylist */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Stylist / Kapster Favorit</label>
              <div className="relative">
                <select 
                  id="stylist-select"
                  className="w-full appearance-none border border-stone-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition text-gray-700"
                  defaultValue={bookingState.preferredPractitioner ? bookingState.preferredPractitioner.name : ""}
                >
                  <option value="">-- Pilih Stylist (Opsional/Bebas) --</option>
                  {client.practitioners?.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.role})</option>
                  ))}
                  <option value="Siapa Saja">Siapa Saja (Tersedia)</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
              </div>
            </div>

            {/* Select Date & Time */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                <input 
                  type="date" 
                  id="booking-date" 
                  value={bookingState.preferredDate || ''}
                  onChange={e => updateBookingField('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition text-gray-700" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jam</label>
                <input 
                  type="time" 
                  id="booking-time" 
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition text-gray-700" 
                  required 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-medium hover:bg-[#20bd5a] flex justify-center items-center gap-2 transition-colors shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" /> Konfirmasi via WhatsApp
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Anda akan diarahkan ke WhatsApp kasir untuk mengamankan slot.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
