'use client';

import { useRetailDemo } from './RetailDemoContext';
import { useState } from 'react';

export function RetailSocialProof() {
  const { client } = useRetailDemo();
  const [openAccordion, setOpenAccordion] = useState<string | null>('delivery');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section id="info" className="mt-20 scroll-mt-24 space-y-12">
      
      {/* Operational & Fulfillment Accordion */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-6">
          Info <span className="text-brand-primary">Layanan</span>
        </h2>
        
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
          
          <div className="border-b border-slate-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('delivery')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">🛵</div>
                <span className="font-bold text-slate-800 text-lg">Area & Ketentuan Pengiriman</span>
              </div>
              <span className={`text-slate-400 transition-transform ${openAccordion === 'delivery' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'delivery' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-500 font-medium pl-14">
                Kami melayani pengiriman instan untuk radius maksimal 15km dari lokasi toko. Pesanan di luar radius dapat menggunakan kurir reguler atau opsi Ambil Sendiri (Walk-in).
              </p>
            </div>
          </div>

          <div className="border-b border-slate-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('payment')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">💳</div>
                <span className="font-bold text-slate-800 text-lg">Metode Pembayaran</span>
              </div>
              <span className={`text-slate-400 transition-transform ${openAccordion === 'payment' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'payment' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-500 font-medium pl-14">
                Pembayaran dapat dilakukan melalui Transfer Bank (BCA, Mandiri, BNI), QRIS, atau Cash/Debit khusus untuk pengambilan langsung di toko.
              </p>
            </div>
          </div>

          <div className="border-b border-slate-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('access')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">🅿️</div>
                <span className="font-bold text-slate-800 text-lg">Panduan Parkir & Akses</span>
              </div>
              <span className={`text-slate-400 transition-transform ${openAccordion === 'access' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'access' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-500 font-medium pl-14">
                Tersedia area parkir mobil dan motor yang luas tepat di depan toko. Patokan lokasi: Berada 50m di sebelah SPBU utama.
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
          <p className="text-slate-500 font-bold mb-6">Dari {client.reviewCount}+ Ulasan Google</p>
          <a 
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors w-full sm:w-auto flex justify-center items-center gap-2"
          >
            Lihat Semua Ulasan di Maps ↗
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
