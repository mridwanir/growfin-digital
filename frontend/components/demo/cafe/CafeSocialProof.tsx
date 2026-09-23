import { useCafeDemo } from './CafeDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function CafeSocialProof() {
  const { client } = useCafeDemo();
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal(0.1);

  if (!client.instagramFeed && (!client.reviews || client.reviews.length === 0)) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 transform ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900">Suasana <span className="text-brand-primary">Tempat Kami</span></h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Kami mengundang Anda untuk merasakan pengalaman terbaik bersama orang-orang tercinta.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Instagram Feed Simulation */}
          {client.instagramFeed && client.instagramFeed.length > 0 && (
            <div className="w-full lg:w-2/3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {client.instagramFeed.slice(0, 4).map((url, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 relative group cursor-pointer shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Instagram Feed" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl font-bold">♥</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-slate-400">
                <span className="text-slate-800">📸 Instagram</span>
                <span className="text-slate-300">•</span>
                <a href="#" className={`hover:text-brand-primary transition-colors`}>@{(client.name.replace(/\s/g, '').toLowerCase())}_official</a>
              </div>
            </div>
          )}

          {/* Review Card */}
          {client.reviews && client.reviews.length > 0 && (
            <div className="w-full lg:w-1/3 space-y-4">
              {client.reviews.slice(0, 1).map((r, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-slate-50">
                    ✨
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(r.rating) ? 'text-amber-400' : 'text-slate-200'}>⭐</span>
                    ))}
                  </div>
                  <p className="text-slate-700 italic font-medium mb-4 leading-relaxed">&quot;{r.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-500 uppercase">
                      {r.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{r.authorName}</p>
                      <p className="text-xs text-slate-400 mt-1">{r.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">{client.rating.toFixed(1)}</p>
                  <p className="text-xs font-bold text-slate-500">Dari {client.reviewCount}+ ulasan Google</p>
                </div>
                <a href={client.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold text-brand-primary hover:underline`}>
                  Baca semua ↗
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
