const fs = require('fs');
const path = require('path');
const dir = 'd:/Project/Growfin Digital/frontend/components/demo/grooming/beautynspa/themes/dayspa';

// DayspaReviews.tsx
fs.writeFileSync(path.join(dir, 'DayspaReviews.tsx'), `
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { Star } from 'lucide-react';

export function DayspaReviews() {
  const { client } = useGroomingDemo();

  return (
    <section id="reviews" className="py-24 bg-[#F3ECE2]/30 border-t border-[#F3ECE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs tracking-[0.25em] text-brand-primary font-semibold uppercase">Ulasan Pengunjung</span>
          <h2 className="font-serif-dayspa text-4xl sm:text-5xl font-normal text-[#2B2623]">Ketenangan yang Mereka Rasakan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(client.reviews || client.metadata?.reviews)?.slice(0, 3).map((review: any, idx: number) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-[#F3ECE2] relative shadow-sm">
              <div className="flex text-amber-500 mb-4 gap-1">
                {Array.from({ length: review.rating || 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-current text-amber-500" />
                ))}
              </div>
              <p className="text-sm text-[#2B2623]/80 italic leading-relaxed mb-6 font-light">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F3ECE2] flex items-center justify-center font-serif-dayspa font-semibold text-brand-primary">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2B2623]">{review.authorName}</h4>
                  <span className="text-[11px] text-[#2B2623]/50">{review.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`);

// DayspaBanner.tsx
fs.writeFileSync(path.join(dir, 'DayspaBanner.tsx'), `
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function DayspaBanner() {
  const { setIsBookingModalOpen } = useGroomingDemo();

  return (
    <section className="py-20 px-6 bg-brand-primary text-white text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="font-serif-dayspa text-3xl sm:text-5xl font-light">Berikan Raga Anda Istirahat yang Pantas</h2>
        <p className="text-white/80 text-sm sm:text-base font-light">
          Slot harian kami batasi secara ketat untuk menjamin ketenangan privat dan sterilisasi ruangan optimal untuk setiap tamu.
        </p>
        <div className="pt-2">
          <button onClick={() => setIsBookingModalOpen(true)} className="px-8 py-4 bg-white text-[#2B2623] hover:bg-[#2B2623] hover:text-white rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300">
            Jadwalkan Waktu Relaksasi
          </button>
        </div>
      </div>
    </section>
  );
}
`);

// DayspaFooter.tsx
fs.writeFileSync(path.join(dir, 'DayspaFooter.tsx'), `
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function DayspaFooter() {
  const { client } = useGroomingDemo();

  return (
    <footer className="bg-[#2B2623] text-white/70 py-16 px-6 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <span className="font-serif-dayspa text-2xl tracking-[0.2em] font-medium uppercase text-white">
            {client.name || 'Lumina'}
          </span>
          <p className="leading-relaxed">Suaka relaksasi estetik untuk merevitalisasi pikiran, tubuh, dan jiwa melalui sentuhan penuh kesadaran.</p>
        </div>
        <div>
          <h5 className="text-white font-medium uppercase tracking-wider mb-3">Lokasi Sanctuary</h5>
          <p className="leading-relaxed">{client.address}</p>
        </div>
        <div>
          <h5 className="text-white font-medium uppercase tracking-wider mb-3">Jam Operasional</h5>
          <p className="leading-relaxed">{client.metadata?.hours || 'Setiap Hari: 09.00 - 21.00 WIB'}</p>
        </div>
        <div>
          <h5 className="text-white font-medium uppercase tracking-wider mb-3">Kontak Reservasi</h5>
          <p className="leading-relaxed">WhatsApp: {client.metadata?.contact || '+62 812-3456-7890'}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-white/40">
        &copy; {new Date().getFullYear()} {client.name}. Crafted for peace and aesthetic living.
      </div>
    </footer>
  );
}
`);
console.log('Done script 3');
