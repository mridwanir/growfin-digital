import { useFnbDemo } from '../../../core/FnbDemoContext';
import { MessageCircle, CalendarCheck } from 'lucide-react';

export function ArtisanContact() {
  const { client } = useFnbDemo();

  const handleWaClick = (msg: string) => {
    window.open(`https://wa.me/${client.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="contact" className="bg-brand-light/30 border-y border-brand-primary/20 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src="/image/fnb/restaurant/restaurant (6).jpg" alt="Admin Reservasi" className="w-20 h-20 rounded-full object-cover border-4 border-brand-light" />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold mb-1">
                Online & Siap Membantu
              </div>
              <h3 className="text-lg font-bold text-stone-900">{client.metadata?.admin?.name || 'Admin Reservasi'}</h3>
              <p className="text-xs text-stone-500">{client.metadata?.admin?.role || 'Concierge & Guest Relations'}</p>
              <p className="text-xs text-stone-600 mt-2 italic">"{client.metadata?.admin?.sampleChat?.recommendationDesc || 'Butuh meja romantis, VIP Room, atau catering event?'}"</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleWaClick(`Halo Admin ${client.name}, saya mau tanya ketersediaan meja hari ini.`)}
              className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              Tanya Admin via WA
            </button>
            <button 
              onClick={() => handleWaClick(`Halo Admin ${client.name}, saya ingin melakukan reservasi meja.`)}
              className="px-5 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <CalendarCheck className="w-4 h-4 text-stone-600" />
              Booking Form
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
