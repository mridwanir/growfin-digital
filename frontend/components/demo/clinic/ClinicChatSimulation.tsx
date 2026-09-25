'use client';
import { useClinicDemo } from './ClinicDemoContext';
import { MenuItem } from '@/lib/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ClinicChatSimulation() {
  const { client, selectedService,
    setSelectedService,
    chatMessage,
    setChatMessage,
    chatHistory,
    isDoctorTyping,
    handleSendMessage,
    setIsScheduleModalOpen,
    serviceTerminology } = useClinicDemo();

  const { ref, isVisible } = useScrollReveal(0.1);

  // Price formatter helper
  const formatPrice = (price?: string) => {
    if (!price) return '';
    const cleaned = price.trim();
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned;
    }
    return `Rp ${cleaned}`;
  };

  const openBookingModal = () => {
    setIsScheduleModalOpen(true);
  };

  return (
    <section id="konsultasi" className="bg-white py-16 sm:py-24 border-b border-slate-100 scroll-mt-16">
      <div 
        ref={ref}
        className={`max-w-6xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        
        {/* Left Side: Context & Explanations */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Consultation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Punya <span className="text-brand-primary">Pertanyaan?</span><br />
            Tanya Langsung Ahlinya.
          </h2>
          <p className="text-base text-slate-500 font-medium leading-relaxed max-w-lg">
            Kami menyediakan layanan konsultasi virtual responsif. Pilih layanan, sampaikan keluhan Anda, dan {serviceTerminology.staffTitle} kami akan memberikan rekomendasi terbaik.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 mt-2">Pengalaman</span>
              <span className="text-sm font-bold text-slate-800">8+ Tahun</span>
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 mt-2">Rating</span>
              <span className="text-sm font-bold text-amber-500">{client.rating} / 5.0</span>
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 mt-2">Respon WA</span>
              <span className={`text-sm font-bold text-brand-primary`}>&lt; 5 Menit</span>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Interface Mockup */}
        <div className="flex-1 w-full max-w-md lg:max-w-sm bg-[#F8FAFC] rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-200/60 flex flex-col h-[600px] overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-xl text-white shadow-sm overflow-hidden`}>
              {client.doctor?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={client.doctor.avatarUrl} alt={client.doctor.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-lg">{client.doctor?.name?.[0] || 'D'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900">{client.doctor?.name || serviceTerminology.staffTitle}</h3>
              </div>
              <p className={`text-[10px] text-brand-primary font-bold mt-0.5`}>{client.doctor?.role || serviceTerminology.staffTitle}</p>
            </div>
          </div>

          {/* Service Picker inside Chat */}
          <div className="bg-white/60 px-4 py-3 border-b border-slate-100">
            <label className={`block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5`}>
              Topik Konsultasi:
            </label>
            <div className="relative">
              <select
                value={selectedService?.id || ''}
                onChange={(e) => {
                  const found = client.menu.find((m: MenuItem) => m.id === Number(e.target.value));
                  if (found) setSelectedService(found);
                }}
                className="w-full appearance-none rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none shadow-sm pr-8 cursor-pointer"
              >
                {client.menu.map((item: MenuItem) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm transition-all ${
                    isUser
                      ? `ml-auto rounded-tr-none bg-brand-primary text-white`
                      : 'mr-auto rounded-tl-none bg-white text-slate-700 border border-slate-100'
                  }`}
                >
                  {!isUser && (
                    <p className={`font-bold text-brand-primary mb-1 text-[11px]`}>{client.doctor?.name}</p>
                  )}
                  <p className="leading-relaxed whitespace-pre-line font-medium">{msg.text}</p>
                  <span className={`block text-[9px] text-right mt-1.5 font-bold ${isUser ? 'text-white/70' : 'text-slate-400'}`}>
                    {msg.time} {isUser && '✓✓'}
                  </span>
                </div>
              );
            })}

            {isDoctorTyping && (
              <div className="mr-auto max-w-[70%] rounded-2xl rounded-tl-none bg-white p-3 text-xs border border-slate-100 shadow-sm flex items-center gap-2">
                <span className={`font-bold text-brand-primary text-[10px]`}>{client.doctor?.name}</span>
                <div className="flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full bg-brand-primary animate-bounce`} />
                  <span className={`h-1.5 w-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:0.2s]`} />
                  <span className={`h-1.5 w-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:0.4s]`} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 border border-slate-200 focus-within:border-slate-400 transition-colors">
              <input
                type="text"
                placeholder="Ketik keluhan Anda..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full border-none bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim()}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white text-xs shadow-sm disabled:opacity-40 transition-all`}
              >
                ➔
              </button>
            </form>
            
            <button
              onClick={() => openBookingModal()}
              className={`w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[11px] font-bold rounded-full shadow-md transition-all`}
            >
              <span>Lanjutkan Booking Jadwal Via WA</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
