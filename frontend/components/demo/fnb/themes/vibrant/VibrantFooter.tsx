import { useFnbDemo } from '../../core/FnbDemoContext';
import { Camera, Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Share2, ShieldCheck } from 'lucide-react';

export function VibrantFooter() {
  const { client, isOpenNow } = useFnbDemo();
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'B';

  return (
    <footer id="contact" className="bg-stone-900 text-stone-400 py-16 sm:py-24 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start border-b border-stone-800 pb-16">
          
          {/* Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm font-extrabold text-xl">
                {brandInitial}
              </span>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">{client.name}</h2>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mt-1">{client.category || 'Bubble Tea & Juice'}</p>
              </div>
            </div>
            <p className="text-stone-400 font-medium leading-relaxed text-sm">
              {client.tagline || 'Dibuat dari daun teh pegunungan pilihan, 100% susu murni, dan potongan buah segar tanpa pengawet.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Higienis & Halal
            </div>
            <div className="flex gap-3 pt-2">
              {client.socialMedia?.instagram?.active && (
                <a href={client.socialMedia.instagram.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors group/soc">
                  <Camera size={18} className="text-stone-400 group-hover/soc:text-white transition-colors" />
                </a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a href={client.socialMedia.tiktok.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors group/soc">
                  <Share2 size={18} className="text-stone-400 group-hover/soc:text-white transition-colors" />
                </a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a href={client.socialMedia.facebook.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors group/soc">
                  <MessageCircle size={18} className="text-stone-400 group-hover/soc:text-white transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white mb-4">Informasi</h3>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-primary shrink-0" />
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">{client.hours}</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isOpenNow ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
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
            <h3 className="text-lg font-bold text-white mb-4">Lokasi</h3>
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all bg-stone-800 hover:bg-brand-primary text-white shadow-sm hover:shadow-lg w-full sm:w-auto text-sm"
            >
              <Navigation className="w-4 h-4" /> Buka Google Maps
            </a>
          </div>

        </div>

        <div className="pt-8 text-sm font-medium text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} {client.name}. All rights reserved.</p>
          <p>Powered by Growfin Digital</p>
        </div>
      </div>
    </footer>
  );
}
