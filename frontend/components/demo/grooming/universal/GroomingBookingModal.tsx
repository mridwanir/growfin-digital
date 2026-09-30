'use client';

import { useGroomingDemo } from '../core/GroomingDemoContext';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function GroomingBookingModal() {
  const { client, isBookingModalOpen, setIsBookingModalOpen, selectedTreatment, selectedStylist } = useGroomingDemo();
  
  const [treatment, setTreatment] = useState('');
  const [stylist, setStylist] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  // Sesuai sub-kategori, tentukan sebutan Kapster/Stylist/Terapis
  const categoryStr = client.category.toLowerCase();
  const isBarber = categoryStr.includes('barber') || categoryStr.includes('pangkas');
  const isNail = categoryStr.includes('nail') || categoryStr.includes('manicure');
  const roleName = isBarber ? 'Kapster / Barber' : (isNail ? 'Nail Artist' : 'Stylist / Terapis');

  useEffect(() => {
    if (selectedTreatment) setTreatment(selectedTreatment);
    if (selectedStylist) setStylist(selectedStylist);
  }, [selectedTreatment, selectedStylist, isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const text = `Halo Kasir ${client.name} ✨,\n\n`
               + `Saya ingin mengamankan slot reservasi kursi berikut:\n`
               + `• *Layanan*: ${treatment}\n`
               + `• *${roleName}*: ${stylist}\n`
               + `• *Tanggal*: ${date}\n`
               + `• *Jam*: ${time}\n`
               + `• *Catatan*: ${note || '-'}\n\n`
               + `Mohon konfirmasi ketersediaan slot kursi ini. Terima kasih!`;
    
    const waNumber = client.phone.replace(/^0/, '62');
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(waUrl, '_blank');
    setIsBookingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setIsBookingModalOpen(false)}></div>
      
      {/* Menggunakan bg-white sebagai default, namun border diwarnai dengan brand-primary */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-brand-primary/20 p-6 sm:p-8 transform transition-transform max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-200 text-[#242120] font-sans">
        <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-5 right-5 text-neutral-400 hover:text-brand-primary transition text-lg">
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-brand-primary font-semibold">Reservasi Kursi</span>
          <h3 className="text-2xl font-serif mt-1">Konfirmasi Jadwal</h3>
          <p className="text-xs text-neutral-500 mt-1">Pilih detail treatment & terapis, lalu kami hubungkan langsung ke WhatsApp kasir untuk konfirmasi nomor antrean.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1">Pilihan Treatment</label>
            <select 
              required 
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50 text-sm"
            >
              <option value="" disabled>Pilih Layanan Treatment</option>
              {client.menu?.length ? (
                client.menu.map(m => (
                  <option key={m.id} value={m.name}>{m.name} ({m.duration || 60} Menit)</option>
                ))
              ) : (
                <option value="Basic Service">Basic Service (60 Menit)</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1">Pilihan {roleName}</label>
            <select 
              required
              value={stylist}
              onChange={(e) => setStylist(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50 text-sm"
            >
              <option value="" disabled>Pilih Artist Favorit</option>
              {client.practitioners?.length ? (
                client.practitioners.map(p => (
                  <option key={p.id} value={p.name}>{p.name} ({p.role})</option>
                ))
              ) : (
                <option value="Stylist Terbaik">Stylist Terbaik (Professional)</option>
              )}
              <option value="Siapa saja yang tersedia">Siapa saja yang tersedia (First Available)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1">Tanggal</label>
              <input 
                type="date" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50 text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1">Jam Slot</label>
              <input 
                type="time" 
                required 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50 text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1">Catatan Khusus (Opsional)</label>
            <input 
              type="text" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Misal: request potong pendek / warna soft" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50 text-sm"
            />
          </div>

          <button type="submit" className="w-full mt-4 py-4 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold text-xs tracking-widest uppercase transition flex items-center justify-center gap-2 shadow-lg">
            Amankan Slot via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
