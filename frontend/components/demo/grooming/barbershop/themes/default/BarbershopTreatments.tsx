import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BarbershopTreatments() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo();
  
  const services = client.menu?.length ? client.menu : [
    {
      name: "The Ironwood Cut",
      desc: "Konsultasi gaya, pencucian rambut, potongan presisi, penataan dengan pomade premium, dan pijat bahu singkat.",
      price: "Rp 85.000",
      duration: 45
    },
    {
      name: "Royal Hot Towel Shave",
      desc: "Ritual cukur kumis/jenggot tradisional dengan straight razor, uap handuk hangat, dan aplikasi aftershave balm penyejuk.",
      price: "Rp 65.000",
      duration: 30
    },
    {
      name: "Gentleman's Hair Spa",
      desc: "Perawatan kulit kepala khusus pria dengan scrub eksfoliasi, pijat akupresur relaksasi mendalam, dan vitamin rambut.",
      price: "Rp 120.000",
      duration: 60
    }
  ];

  const handleBook = (treatmentName: string) => {
    setSelectedTreatment(treatmentName);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="treatments" className="py-24 bg-vintage-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl text-white mb-4 uppercase">Layanan & Ritual</h2>
          <p className="text-paper/60 font-serif italic">Silakan pilih ritual grooming Anda hari ini.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, idx: number) => (
            <div key={idx} className="bg-vintage-900 border border-vintage-700 p-8 hover:border-brand-primary transition-colors group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-2xl text-white uppercase">{service.name}</h3>
                  <span className="text-xs bg-vintage-700 text-brand-primary px-3 py-1 font-display tracking-widest">
                    ⏱ {service.duration || 45} MIN
                  </span>
                </div>
                <p className="text-paper/70 mb-6 font-serif text-sm">{service.desc || service.description}</p>
                <div className="font-display text-lg text-brand-primary mb-4">{service.price}</div>
              </div>
              <button 
                onClick={() => handleBook(service.name)} 
                className="w-full mt-4 py-3 border border-brand-primary text-brand-primary font-display font-bold group-hover:bg-brand-primary group-hover:text-vintage-900 transition-colors tracking-widest uppercase"
              >
                RESERVASI
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
