import { useFnbDemo } from '../../core/FnbDemoContext';
import { MessageCircle, CalendarCheck, Camera, Share2, Mail, MapPin, Clock, Phone, Navigation, UtensilsCrossed } from 'lucide-react';

export function ArtisanContact() {
  const { client, isOpenNow } = useFnbDemo();

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
          </div>
        </div>

        {/* Dynamic Footer Information */}
        <div className="mt-16 border-t border-stone-200 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start border-b border-stone-200 pb-16 text-stone-600">

            {/* Brand & Socials */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-brand-primary shadow-sm">
                  <UtensilsCrossed className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">{client.name}</h2>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mt-1">{client.category}</p>
                </div>
              </div>
              <p className="text-stone-500 font-medium leading-relaxed text-sm">
                {client.tagline}
              </p>
              <div className="flex gap-3 pt-2">
                {client.socialMedia?.instagram?.active && (
                  <a href={client.socialMedia.instagram.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors group/soc border border-stone-200">
                    <Camera size={18} className="text-stone-400 group-hover/soc:text-white transition-colors" />
                  </a>
                )}
                {client.socialMedia?.tiktok?.active && (
                  <a href={client.socialMedia.tiktok.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors group/soc border border-stone-200">
                    <Share2 size={18} className="text-stone-400 group-hover/soc:text-white transition-colors" />
                  </a>
                )}
                {client.socialMedia?.facebook?.active && (
                  <a href={client.socialMedia.facebook.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors group/soc border border-stone-200">
                    <MessageCircle size={18} className="text-stone-400 group-hover/soc:text-white transition-colors" />
                  </a>
                )}
              </div>
            </div>

            {/* Contact & Hours */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Informasi</h3>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-primary shrink-0" />
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium">{client.hours}</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isOpenNow ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                    {isOpenNow ? 'Buka' : 'Tutup'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                <p className="text-sm font-medium">{client.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                <p className="text-sm font-medium">{client.userEmail || `hello@${client.name.toLowerCase().replace(/\s+/g, '')}.com`}</p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Lokasi</h3>
              <div className="flex items-start gap-3 mb-6">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium leading-relaxed">{client.address}</p>
                </div>
              </div>
              <a
                href={client.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all bg-stone-900 hover:bg-brand-primary text-white shadow-sm hover:shadow-md w-full sm:w-auto text-sm"
              >
                <Navigation className="w-4 h-4" /> Buka Google Maps
              </a>
            </div>

          </div>

          <div className="pt-8 text-sm font-medium text-stone-400 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p>© {new Date().getFullYear()} {client.name}. All rights reserved.</p>
            <p>Powered by Growfin Digital</p>
          </div>
        </div>
      </div>
    </section>
  );
}
