import { useFnbDemo } from '../../../core/FnbDemoContext';
import { MapPin, Clock, Phone, Navigation, Coffee, Mail, Camera, MessageCircle, Share2 } from 'lucide-react';

export function PremiumFooter() {
  const { client, isOpenNow } = useFnbDemo();
  
  return (
    <footer id="kontak" className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start border-b border-slate-900 pb-16">
          
          {/* Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-none border border-slate-800 bg-slate-900 text-brand-primary">
                <Coffee className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-widest uppercase font-heading">{client.name}</h2>
                <div className="w-8 h-0.5 bg-brand-primary mt-1"></div>
              </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              {client.tagline}
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-none bg-slate-900 flex items-center justify-center hover:bg-brand-primary hover:text-slate-950 transition-colors border border-slate-800 hover:border-brand-primary"><Camera size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-none bg-slate-900 flex items-center justify-center hover:bg-brand-primary hover:text-slate-950 transition-colors border border-slate-800 hover:border-brand-primary"><MessageCircle size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-none bg-slate-900 flex items-center justify-center hover:bg-brand-primary hover:text-slate-950 transition-colors border border-slate-800 hover:border-brand-primary"><Share2 size={18} /></a>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest font-heading">Information</h3>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-600 shrink-0" />
              <div className="flex items-center gap-3">
                <p className="text-sm">{client.hours}</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${isOpenNow ? 'text-emerald-500 border-emerald-500/30' : 'text-slate-500 border-slate-700'}`}>
                  {isOpenNow ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-600 shrink-0" />
              <p className="text-sm">{client.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-600 shrink-0" />
              <p className="text-sm">hello@{client.name.toLowerCase().replace(/\s+/g, '')}.com</p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest font-heading">Location</h3>
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm leading-relaxed">{client.address}</p>
              </div>
            </div>
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-none font-bold transition-all bg-brand-primary text-slate-950 hover:brightness-110 w-full sm:w-auto text-sm uppercase tracking-wider"
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </a>
          </div>

        </div>

        <div className="pt-8 text-xs font-medium text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {client.name}.</p>
          <p className="text-brand-primary">Powered by Growfin</p>
        </div>
      </div>
    </footer>
  )
}
