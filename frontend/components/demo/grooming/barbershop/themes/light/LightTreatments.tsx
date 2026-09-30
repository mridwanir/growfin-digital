import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LightTreatments() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo();
  
  const services = client.menu?.length ? client.menu : [
    {
      name: "Signature Balayage",
      desc: "Teknik pewarnaan dimensi bebas tanpa foil, menciptakan gradasi warna natural bak ciuman matahari. Termasuk Olaplex treatment & Toner.",
      price: "Rp 850.000",
      duration: 180
    },
    {
      name: "Keratin Smoothing",
      desc: "Ucapkan selamat tinggal pada rambut mengembang (frizz). Perawatan protein yang menutrisi hingga ke korteks, menjadikan rambut lurus, lembut, dan mudah diatur.",
      price: "Rp 650.000",
      duration: 150
    },
    {
      name: "Luxury Wash & Blowout",
      desc: "Cuci rambut relaksasi dengan pijatan kepala, dilanjutkan styling blowout bervolume ala selebriti menggunakan produk perlindungan panas premium.",
      price: "Rp 150.000",
      duration: 60
    }
  ];

  const handleBook = (treatmentName: string) => {
    setSelectedTreatment(treatmentName);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="treatments" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-charcoal-900 mb-4">Layanan Eksklusif</h2>
          <p className="text-charcoal-800 font-light text-sm">Pilih treatment untuk memanjakan diri Anda hari ini.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any, idx: number) => (
            <div key={idx} className="bg-blush-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between border border-blush-100">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-2xl text-charcoal-900">{service.name}</h3>
                  <span className="text-xs bg-white text-brand-primary px-3 py-1.5 rounded-full font-medium shadow-sm">
                    ⏱ {service.duration || 60} Min
                  </span>
                </div>
                <p className="text-sm text-charcoal-800 mb-6 font-light leading-relaxed">{service.desc || service.description}</p>
                <div className="font-sans-light font-semibold text-brand-primary mb-4 text-lg">
                  {service.price}
                </div>
              </div>
              <button 
                onClick={() => handleBook(service.name)} 
                className="w-full mt-4 py-3 bg-white text-brand-primary border border-brand-primary/30 rounded-full group-hover:bg-brand-primary group-hover:text-white transition-colors text-sm font-medium"
              >
                Reservasi Seat
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
