import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaTreatments() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo();
  
  const services = client.menu?.length ? client.menu : [
    {
      name: "Lumière Signature Russian Manicure",
      desc: "Pembersihan kutikula elektrik secara higienis, pembentukan kuku rapi, scrub organik, dan pijat tangan dengan essential oil.",
      price: "IDR 249.000",
      duration: 60,
      category: "Manicure Care"
    },
    {
      name: "Custom Japanese Gel Artistry",
      desc: "Lukisan kuku estetik hand-painted, chrome mirror, efek 3D resin, cat eye magnetik, atau gradasi ombre natural.",
      price: "IDR 385.000",
      duration: 90,
      category: "Art & Gel"
    },
    {
      name: "Soft Gel Tips & Apres Sculpting",
      desc: "Sambung kuku ringan, tidak merusak dasar kuku asli, presisi alami dan ketahanan hingga 5-6 minggu.",
      price: "IDR 450.000",
      duration: 120,
      category: "Extension"
    },
    {
      name: "Rose Petal Foot Spa & Pedicure",
      desc: "Rendam kaki kelopak mawar & garam himalaya, pengikisan tumit kasar, masker hidrasi, dan pijat relaksasi mendalam.",
      price: "IDR 310.000",
      duration: 75,
      category: "Pedicure & Spa"
    },
    {
      name: "Bridal Elegance Atelier",
      desc: "Dirancang khusus pengantin: French ombré, taburan Swarovski asli, hand collagen glove, dan free touch-up kit.",
      price: "IDR 620.000",
      duration: 135,
      category: "Special Occasion"
    },
    {
      name: "Non-Damaging Gel Removal & Keratin",
      desc: "Pelepasan gel tanpa kikis berlebihan dilengkapi treatment infus keratin untuk mengembalikan ketebalan kuku rapuh.",
      price: "IDR 120.000",
      duration: 40,
      category: "Safe Care"
    }
  ];

  const handleBook = (treatmentName: string) => {
    setSelectedTreatment(treatmentName);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="services" className="py-24 bg-nude-100/70 border-y border-nude-200/70">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-primary font-semibold mb-3">Care Crafted For You</p>
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal">Menu Layanan & Estimasi Waktu</h2>
          <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
            Setiap treatment dirancang presisi tanpa terburu-buru demi hasil sempurna dan relaksasi maksimal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any, idx: number) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-nude-200/60 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-brand-primary tracking-wider uppercase mb-3">
                  <span>{service.category || 'Treatment'}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light">
                    ⏱ {service.duration || 60} Menit
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-charcoal group-hover:text-brand-primary transition">{service.name}</h3>
                <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                  {service.desc || service.description}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-nude-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Mulai dari</span>
                  <span className="text-xl font-serif font-semibold text-charcoal">{service.price}</span>
                </div>
                <button onClick={() => handleBook(service.name)} className="p-3.5 rounded-full bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white transition">
                  ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
