'use client'

import { MessageCircle } from 'lucide-react'

import { useServiceDemo } from './ServiceDemoContext'

export function ServiceBookingModal() {
  const { client, isBookingModalOpen, setIsBookingModalOpen, bookingState, updateBookingField } =
    useServiceDemo()

  if (!isBookingModalOpen) return null

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault()

    let message = `Halo Admin ${client.name}, saya ingin mengajukan jadwal temu:\n\n`
    message += `• *Layanan/Praktisi*: ${bookingState.selectedService?.name || 'Konsultasi Umum'}\n`

    let sessionText = 'Sesi Pagi'
    if (bookingState.preferredSession === 'AFTERNOON') sessionText = 'Sesi Siang'
    if (bookingState.preferredSession === 'EVENING') sessionText = 'Sesi Sore/Malam'

    const dateStr = bookingState.preferredDate
      ? new Date(bookingState.preferredDate).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Belum Ditentukan'

    message += `• *Tanggal*: ${dateStr}\n`
    message += `• *Shift Waktu*: ${sessionText}\n`

    if (bookingState.complaint) {
      message += `• *Keluhan/Kebutuhan*: ${bookingState.complaint}\n`
    }

    message += `\nMohon konfirmasinya. Terima kasih.`

    const waUrl = `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
    setIsBookingModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsBookingModalOpen(false)}
      />

      {/* Modal panel */}
      <div className="animate-in zoom-in-95 relative z-10 w-full transform overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-2xl transition-all duration-200 sm:my-8 sm:w-full sm:max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg leading-6 font-bold text-gray-900">
            Form Reservasi Jadwal
          </h3>
          <button
            type="button"
            onClick={() => setIsBookingModalOpen(false)}
            className="text-gray-400 transition hover:text-red-500 focus:outline-none"
          >
            <span className="text-xl font-bold">✕</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <p className="mb-5 text-sm text-gray-500">
            Silakan isi detail di bawah ini. Anda akan diarahkan ke WhatsApp untuk konfirmasi jadwal
            dengan resepsionis kami.
          </p>

          <form onSubmit={handleSendWA} className="space-y-4">
            {/* Pilih Layanan/Spesialis */}
            <div>
              <label className="mb-1 block text-sm leading-6 font-medium text-gray-900">
                Pilih Praktisi / Layanan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={bookingState.selectedService?.id || ''}
                onChange={e => {
                  const s = client.menu.find(m => m.id === e.target.value)
                  if (s) updateBookingField('selectedService', s)
                }}
                className="focus:ring-brand-primary block w-full rounded-lg border-0 bg-white px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              >
                <option value="" disabled>
                  -- Pilih Layanan/Ahli --
                </option>
                {client.menu.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Date Picker */}
              <div>
                <label className="mb-1 block text-sm leading-6 font-medium text-gray-900">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingState.preferredDate || ''}
                  onChange={e => updateBookingField('preferredDate', e.target.value)}
                  className="focus:ring-brand-primary block w-full rounded-lg border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
              </div>
              {/* Time Shift */}
              <div>
                <label className="mb-1 block text-sm leading-6 font-medium text-gray-900">
                  Shift Waktu <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={bookingState.preferredSession || ''}
                  onChange={e => updateBookingField('preferredSession', e.target.value as any)}
                  className="focus:ring-brand-primary block w-full rounded-lg border-0 bg-white px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>
                    Pilih Jam
                  </option>
                  <option value="MORNING">Pagi (08:00 - 11:00)</option>
                  <option value="AFTERNOON">Siang (13:00 - 15:00)</option>
                  <option value="EVENING">Sore/Malam (15:00 - 18:00)</option>
                </select>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="mb-1 block text-sm leading-6 font-medium text-gray-900">
                Detail Keluhan / Kebutuhan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Jelaskan secara singkat keluhan atau layanan yang Anda butuhkan..."
                value={bookingState.complaint || ''}
                onChange={e => updateBookingField('complaint', e.target.value)}
                className="focus:ring-brand-primary block w-full rounded-lg border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-end gap-x-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="px-3 py-2 text-sm leading-6 font-semibold text-gray-900 transition hover:text-red-600"
              >
                Batal
              </button>
              <button
                type="submit"
                data-track="whatsapp"
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <MessageCircle className="h-5 w-5" /> Lanjut ke WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
