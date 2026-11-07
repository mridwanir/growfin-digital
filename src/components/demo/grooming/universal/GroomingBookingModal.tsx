'use client'

import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useGroomingDemo } from '../core/GroomingDemoContext'

export function GroomingBookingModal() {
  const { client, isBookingModalOpen, setIsBookingModalOpen, selectedTreatment, selectedStylist } =
    useGroomingDemo()

  const [treatment, setTreatment] = useState('')
  const [stylist, setStylist] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')

  // Sesuai sub-kategori, tentukan sebutan Kapster/Stylist/Terapis
  const categoryStr = client.category.toLowerCase()
  const isBarber = categoryStr.includes('barber') || categoryStr.includes('pangkas')
  const isNail = categoryStr.includes('nail') || categoryStr.includes('manicure')
  const roleName = isBarber ? 'Kapster / Barber' : isNail ? 'Nail Artist' : 'Stylist / Terapis'

  useEffect(() => {
    if (selectedTreatment) setTreatment(selectedTreatment)
    if (selectedStylist) setStylist(selectedStylist)
  }, [selectedTreatment, selectedStylist, isBookingModalOpen])

  if (!isBookingModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const text =
      `Halo Kasir ${client.name} ✨,\n\n` +
      `Saya ingin mengamankan slot reservasi kursi berikut:\n` +
      `• *Layanan*: ${treatment}\n` +
      `• *${roleName}*: ${stylist}\n` +
      `• *Tanggal*: ${date}\n` +
      `• *Jam*: ${time}\n` +
      `• *Catatan*: ${note || '-'}\n\n` +
      `Mohon konfirmasi ketersediaan slot kursi ini. Terima kasih!`

    const waNumber = client.phone.replace(/^0/, '62')
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`

    window.open(waUrl, '_blank')
    setIsBookingModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setIsBookingModalOpen(false)}></div>

      {/* Menggunakan bg-white sebagai default, namun border diwarnai dengan brand-primary */}
      <div className="border-brand-primary/20 animate-in zoom-in-95 relative z-10 max-h-[90vh] w-full max-w-lg transform overflow-y-auto rounded-3xl border-4 bg-white p-6 font-sans text-[#242120] shadow-2xl transition-transform duration-200 sm:p-8">
        <button
          onClick={() => setIsBookingModalOpen(false)}
          className="hover:text-brand-primary absolute top-5 right-5 text-lg text-neutral-400 transition"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <span className="text-brand-primary text-xs font-semibold tracking-widest uppercase">
            Reservasi Kursi
          </span>
          <h3 className="mt-1 font-serif text-2xl">Konfirmasi Jadwal</h3>
          <p className="mt-1 text-xs text-neutral-500">
            Pilih detail treatment & terapis, lalu kami hubungkan langsung ke WhatsApp kasir untuk
            konfirmasi nomor antrean.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-600 uppercase">
              Pilihan Treatment
            </label>
            <select
              required
              value={treatment}
              onChange={e => setTreatment(e.target.value)}
              className="focus:border-brand-primary focus:ring-brand-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-1 focus:outline-none"
            >
              <option value="" disabled>
                Pilih Layanan Treatment
              </option>
              {client.menu?.length ? (
                client.menu.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.duration || 60} Menit)
                  </option>
                ))
              ) : (
                <option value="Basic Service">Basic Service (60 Menit)</option>
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-600 uppercase">
              Pilihan {roleName}
            </label>
            <select
              required
              value={stylist}
              onChange={e => setStylist(e.target.value)}
              className="focus:border-brand-primary focus:ring-brand-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-1 focus:outline-none"
            >
              <option value="" disabled>
                Pilih Artist Favorit
              </option>
              {client.practitioners?.length ? (
                client.practitioners.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.role})
                  </option>
                ))
              ) : (
                <option value="Stylist Terbaik">Stylist Terbaik (Professional)</option>
              )}
              <option value="Siapa saja yang tersedia">
                Siapa saja yang tersedia (First Available)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="focus:border-brand-primary focus:ring-brand-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-1 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                Jam Slot
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="focus:border-brand-primary focus:ring-brand-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-1 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-600 uppercase">
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Misal: request potong pendek / warna soft"
              className="focus:border-brand-primary focus:ring-brand-primary w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-1 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            data-track="whatsapp"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#00A884] py-4 text-xs font-semibold tracking-widest text-white uppercase shadow-lg transition hover:bg-[#008f6f]"
          >
            Amankan Slot via WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}
