'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useState } from 'react';

export function ClinicSocialProof() {
  const { client } = useClinicDemo();
  const [openAccordion, setOpenAccordion] = useState<string | null>('access');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section id="info" className="mt-20 scroll-mt-24 space-y-12">
      
      {/* Accessibility & Operations Accordion */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-6">
          Informasi <span className="text-brand-primary">Fasilitas</span>
        </h2>
        
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
          
          <div className="border-b border-slate-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('access')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">♿</div>
                <span className="font-bold text-slate-800 text-lg">Aksesibilitas & Parkir</span>
              </div>
              <span className={`text-slate-400 transition-transform ${openAccordion === 'access' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'access' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-500 font-medium pl-14">
                Tersedia ramp kursi roda dari area parkir hingga ruang periksa. Kami menyediakan area *drop-off* khusus pasien darurat/lansia tepat di depan lobi utama.
              </p>
            </div>
          </div>

          <div className="border-b border-slate-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('insurance')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">🏥</div>
                <span className="font-bold text-slate-800 text-lg">Asuransi & Metode Bayar</span>
              </div>
              <span className={`text-slate-400 transition-transform ${openAccordion === 'insurance' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'insurance' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-500 font-medium pl-14">
                Kami menerima pembayaran Debit/Kredit, QRIS, Transfer Bank, dan perlindungan asuransi rekanan. Silakan konfirmasi polis asuransi Anda kepada admin pendaftaran.
              </p>
            </div>
          </div>

          <div className="border-b border-slate-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('privacy')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">🔒</div>
                <span className="font-bold text-slate-800 text-lg">Kerahasiaan Data (NDA)</span>
              </div>
              <span className={`text-slate-400 transition-transform ${openAccordion === 'privacy' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'privacy' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-500 font-medium pl-14">
                Segala bentuk rekam medis maupun dokumen identitas klien disimpan dengan standar enkripsi dan privasi tinggi sesuai hukum yang berlaku.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Trust & Reviews */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center h-full">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center text-4xl mb-4">
            ⭐
          </div>
          <h3 className="text-5xl font-black text-slate-900 mb-2">{client.rating.toFixed(1)}</h3>
          <p className="text-slate-500 font-bold mb-6">Dari {client.reviewCount}+ Pasien/Klien Kami</p>
          <a 
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors w-full sm:w-auto flex justify-center items-center gap-2"
          >
            Lihat Ulasan di Google Maps ↗
          </a>
        </div>
        
        <div className="flex flex-col gap-4">
          {client.reviews?.slice(0, 2).map((review, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800">{review.authorName}</span>
                <span className="text-amber-400 text-sm">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">"{review.text}"</p>
              <p className="text-slate-400 text-xs font-medium mt-3">{review.time}</p>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
