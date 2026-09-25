'use client';

import { useGroomingDemo } from './GroomingDemoContext';
import { MenuItem } from '@/lib/types';

export function GroomingServiceMenu() {
  const {
    client,
    toggleServiceSelection,
    setIsBookingModalOpen
  } = useGroomingDemo();

  const handleSelectService = (service: MenuItem) => {
    toggleServiceSelection(service);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="layanan" className="py-24 bg-stone-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Treatment Catalog</h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">Pilihan layanan komprehensif yang dirancang khusus untuk kenyamanan dan transformasi penampilan Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {client.menu.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              onSelect={() => handleSelectService(service)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, onSelect }: { service: MenuItem, index: number, onSelect: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-xl hover:border-stone-200 transition-all duration-300 group flex flex-col h-full">
      <h3 className="text-xl font-serif font-semibold mb-2">{service.name}</h3>
      <p className="text-gray-500 mb-6 text-sm leading-relaxed flex-1">{service.desc}</p>
      <div className="flex justify-between items-center mb-6 pt-4 border-t border-stone-100">
        <span className="flex items-center text-sm text-stone-400 font-medium">
          {service.duration || 45} Menit
        </span>
        <span className="font-semibold text-lg text-stone-900">{service.price}</span>
      </div>
      <button
        onClick={onSelect}
        className="w-full py-3 rounded-xl border border-stone-900 text-stone-900 font-medium hover:bg-stone-900 hover:text-white transition-all duration-300"
      >
        Pilih Layanan
      </button>
    </div>
  );
}
