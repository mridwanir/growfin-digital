'use client'
import type { MenuItem } from '@/lib/types'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useServiceDemo } from './ServiceDemoContext'

export function ServiceChatSimulation() {
  const {
    client,
    selectedService,
    setSelectedService,
    chatMessage,
    setChatMessage,
    chatHistory,
    isDoctorTyping,
    handleSendMessage,
    setIsScheduleModalOpen,
    serviceTerminology,
  } = useServiceDemo()

  const { ref, isVisible } = useScrollReveal(0.1)

  // Price formatter helper
  const formatPrice = (price?: string) => {
    if (!price) return ''
    const cleaned = price.trim()
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned
    }
    return `Rp ${cleaned}`
  }

  const openBookingModal = () => {
    setIsScheduleModalOpen(true)
  }

  return (
    <section
      id="konsultasi"
      className="scroll-mt-16 border-b border-slate-100 bg-white py-16 sm:py-24"
    >
      <div
        ref={ref}
        className={`mx-auto flex max-w-6xl transform flex-col items-center gap-12 px-4 transition-all duration-1000 md:px-8 lg:flex-row lg:gap-20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      >
        {/* Left Side: Context & Explanations */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Live Consultation
            </span>
          </div>
          <h2 className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
            Punya <span className="text-brand-primary">Pertanyaan?</span>
            <br />
            Tanya Langsung Ahlinya.
          </h2>
          <p className="max-w-lg text-base leading-relaxed font-medium text-slate-500">
            Kami menyediakan layanan konsultasi virtual responsif. Pilih layanan, sampaikan keluhan
            Anda, dan {serviceTerminology.staffTitle} kami akan memberikan rekomendasi terbaik.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div>
              <span className="mt-2 mb-0.5 block text-[10px] font-black tracking-wider text-slate-400 uppercase">
                Pengalaman
              </span>
              <span className="text-sm font-bold text-slate-800">8+ Tahun</span>
            </div>
            <div>
              <span className="mt-2 mb-0.5 block text-[10px] font-black tracking-wider text-slate-400 uppercase">
                Rating
              </span>
              <span className="text-sm font-bold text-amber-500">{client.rating} / 5.0</span>
            </div>
            <div>
              <span className="mt-2 mb-0.5 block text-[10px] font-black tracking-wider text-slate-400 uppercase">
                Respon WA
              </span>
              <span className={`text-brand-primary text-sm font-bold`}>&lt; 5 Menit</span>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Interface Mockup */}
        <div className="relative flex h-[600px] w-full max-w-md flex-1 flex-col overflow-hidden rounded-[32px] border border-slate-200/60 bg-[#F8FAFC] shadow-2xl shadow-slate-200/50 sm:rounded-[40px] lg:max-w-sm">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-5 py-4">
            <div
              className={`from-brand-primary to-brand-dark relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-xl text-white shadow-sm`}
            >
              {client.doctor?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={client.doctor.avatarUrl}
                  alt={client.doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">{client.doctor?.name?.[0] || 'D'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900">
                  {client.doctor?.name || serviceTerminology.staffTitle}
                </h3>
              </div>
              <p className={`text-brand-primary mt-0.5 text-[10px] font-bold`}>
                {client.doctor?.role || serviceTerminology.staffTitle}
              </p>
            </div>
          </div>

          {/* Service Picker inside Chat */}
          <div className="border-b border-slate-100 bg-white/60 px-4 py-3">
            <label
              className={`mb-1.5 block text-[9px] font-black tracking-widest text-slate-400 uppercase`}
            >
              Topik Konsultasi:
            </label>
            <div className="relative">
              <select
                value={selectedService?.id || ''}
                onChange={e => {
                  const found = client.menu.find((m: MenuItem) => m.id === Number(e.target.value))
                  if (found) setSelectedService(found)
                }}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-bold text-slate-800 shadow-sm focus:outline-none"
              >
                {client.menu.map((item: MenuItem) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[10px] text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {chatHistory.map((msg: any) => {
              const isUser = msg.sender === 'user'
              return (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm transition-all ${
                    isUser
                      ? `bg-brand-primary ml-auto rounded-tr-none text-white`
                      : 'mr-auto rounded-tl-none border border-slate-100 bg-white text-slate-700'
                  }`}
                >
                  {!isUser && (
                    <p className={`text-brand-primary mb-1 text-[11px] font-bold`}>
                      {client.doctor?.name}
                    </p>
                  )}
                  <p className="leading-relaxed font-medium whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`mt-1.5 block text-right text-[9px] font-bold ${isUser ? 'text-white/70' : 'text-slate-400'}`}
                  >
                    {msg.time} {isUser && '✓✓'}
                  </span>
                </div>
              )
            })}

            {isDoctorTyping && (
              <div className="mr-auto flex max-w-[70%] items-center gap-2 rounded-2xl rounded-tl-none border border-slate-100 bg-white p-3 text-xs shadow-sm">
                <span className={`text-brand-primary text-[10px] font-bold`}>
                  {client.doctor?.name}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`bg-brand-primary h-1.5 w-1.5 animate-bounce rounded-full`} />
                  <span
                    className={`bg-brand-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.2s]`}
                  />
                  <span
                    className={`bg-brand-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.4s]`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-3 border-t border-slate-100 bg-white p-4">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-slate-400"
            >
              <input
                type="text"
                placeholder="Ketik keluhan Anda..."
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                className="w-full border-none bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim()}
                className={`bg-brand-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-white shadow-sm transition-all disabled:opacity-40`}
              >
                ➔
              </button>
            </form>

            <button
              onClick={() => openBookingModal()}
              className={`flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3 text-[11px] font-bold text-white shadow-md transition-all hover:bg-emerald-600 active:scale-95`}
            >
              <span>Lanjutkan Booking Jadwal Via WA</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
