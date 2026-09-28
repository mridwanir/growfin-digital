import { useBeautynspaDemo } from '../../core/BeautynspaContext';

export function LumiereTreatments() {
  const { client, setIsBookingModalOpen } = useBeautynspaDemo();

  const treatments = (client.menu && client.menu.length > 0) ? client.menu : [
    { id: '1', name: 'Signature Hair Spa', price: '250000', duration: 60, desc: 'Perawatan kulit kepala dengan pijatan relaksasi menggunakan serum premium untuk rambut rontok dan lepek.' },
    { id: '2', name: 'Balayage & Color', price: '850000', duration: 180, desc: 'Pewarnaan rambut artistik tanpa merusak folikel. Termasuk vitamin perlindungan warna.' },
    { id: '3', name: 'Premium Nail Art', price: '300000', duration: 90, desc: 'Manicure, pedicure, dan nail art desain kustom dengan gel polish tahan lama berkualitas tinggi.' },
  ];

  const formatIDR = (priceStr: string | number) => {
    const price = typeof priceStr === 'string' ? parseInt(priceStr.replace(/[^0-9]/g, '')) : priceStr;
    if (isNaN(price)) return priceStr;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <section id="treatments" className="py-24 bg-[#faf7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="font-serif-lumiere text-4xl text-[#4a3c37] mb-4">Menu Perawatan</h2>
                <p className="text-[#5c4d47] font-light">Pilih layanan yang Anda butuhkan, kami sediakan waktu khusus untuk Anda.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {treatments.map((service: any, idx: number) => (
                  <div key={idx} className="bg-white border border-[#eeded4] p-6 hover:shadow-md transition-shadow group flex flex-col justify-between">
                      <div>
                          <div className="flex justify-between items-start mb-2">
                              <h3 className="font-serif-lumiere text-2xl text-[#4a3c37]">{service.name}</h3>
                              {service.duration && (
                                <span className="text-xs bg-[#f5ebe6] text-[#5c4d47] px-2 py-1 flex items-center gap-1">
                                    ⏱ {service.duration} Menit
                                </span>
                              )}
                          </div>
                          <p className="text-sm text-[#5c4d47] mb-4 line-clamp-3">{service.desc}</p>
                          <p className="font-medium text-[#4a3c37] mb-4">{formatIDR(service.price)}</p>
                      </div>
                      <button onClick={() => setIsBookingModalOpen(true)} className="w-full mt-4 py-3 border border-[#4a3c37] text-[#4a3c37] group-hover:bg-[#4a3c37] group-hover:text-white transition-colors">
                          Reservasi
                      </button>
                  </div>
                ))}
            </div>
        </div>
    </section>
  );
}
