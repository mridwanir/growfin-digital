'use client';

import { useRetailDemo } from './RetailDemoContext';
import { useState } from 'react';

export function RetailFAQ() {
  const { client } = useRetailDemo();
  const [openAccordion, setOpenAccordion] = useState<string | null>('delivery');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 -mx-4 sm:mx-0 px-4 sm:px-6 lg:px-8 sm:rounded-[40px] mt-8 mb-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">FAQ & Info Layanan</h2>
          <p className="text-gray-500">Pertanyaan yang sering diajukan mengenai layanan {client.name}.</p>
        </div>
        
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          
          <div className="border-b border-gray-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('delivery')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">🛵</div>
                <span className="font-bold text-gray-800 text-lg">Area & Ketentuan Pengiriman</span>
              </div>
              <span className={`text-gray-400 transition-transform ${openAccordion === 'delivery' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'delivery' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-gray-500 font-medium pl-14">
                Kami melayani pengiriman instan untuk wilayah sekitar toko. Pesanan jarak jauh dapat menggunakan opsi kurir reguler (JNE/JNT/Sicepat) sesuai kesepakatan.
              </p>
            </div>
          </div>

          <div className="border-b border-gray-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('payment')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">💳</div>
                <span className="font-bold text-gray-800 text-lg">Metode Pembayaran</span>
              </div>
              <span className={`text-gray-400 transition-transform ${openAccordion === 'payment' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'payment' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-gray-500 font-medium pl-14">
                Pembayaran dapat dilakukan dengan aman melalui Transfer Bank (BCA, Mandiri, BNI), QRIS, atau E-Wallet (Gopay, OVO).
              </p>
            </div>
          </div>

          <div className="border-b border-gray-100 last:border-0">
            <button 
              onClick={() => toggleAccordion('return')}
              className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">🔄</div>
                <span className="font-bold text-gray-800 text-lg">Kebijakan Retur / Penukaran</span>
              </div>
              <span className={`text-gray-400 transition-transform ${openAccordion === 'return' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'return' ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-gray-500 font-medium pl-14">
                Penukaran ukuran atau produk yang cacat dapat dilakukan maksimal 2x24 jam setelah barang diterima, dengan syarat tag belum dilepas dan menyertakan video unboxing.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
