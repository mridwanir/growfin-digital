import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaTreatments() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo()

  const services = client.menu?.length
    ? client.menu
    : [
        {
          name: 'Lumière Signature Russian Manicure',
          desc: 'Pembersihan kutikula elektrik secara higienis, pembentukan kuku rapi, scrub organik, dan pijat tangan dengan essential oil.',
          price: 'IDR 249.000',
          duration: 60,
          category: 'Manicure Care',
        },
        {
          name: 'Custom Japanese Gel Artistry',
          desc: 'Lukisan kuku estetik hand-painted, chrome mirror, efek 3D resin, cat eye magnetik, atau gradasi ombre natural.',
          price: 'IDR 385.000',
          duration: 90,
          category: 'Art & Gel',
        },
        {
          name: 'Soft Gel Tips & Apres Sculpting',
          desc: 'Sambung kuku ringan, tidak merusak dasar kuku asli, presisi alami dan ketahanan hingga 5-6 minggu.',
          price: 'IDR 450.000',
          duration: 120,
          category: 'Extension',
        },
        {
          name: 'Rose Petal Foot Spa & Pedicure',
          desc: 'Rendam kaki kelopak mawar & garam himalaya, pengikisan tumit kasar, masker hidrasi, dan pijat relaksasi mendalam.',
          price: 'IDR 310.000',
          duration: 75,
          category: 'Pedicure & Spa',
        },
        {
          name: 'Bridal Elegance Atelier',
          desc: 'Dirancang khusus pengantin: French ombré, taburan Swarovski asli, hand collagen glove, dan free touch-up kit.',
          price: 'IDR 620.000',
          duration: 135,
          category: 'Special Occasion',
        },
        {
          name: 'Non-Damaging Gel Removal & Keratin',
          desc: 'Pelepasan gel tanpa kikis berlebihan dilengkapi treatment infus keratin untuk mengembalikan ketebalan kuku rapuh.',
          price: 'IDR 120.000',
          duration: 40,
          category: 'Safe Care',
        },
      ]

  const handleBook = (treatmentName: string) => {
    setSelectedTreatment(treatmentName)
    setIsBookingModalOpen(true)
  }

  return (
    <section id="services" className="bg-nude-100/70 border-nude-200/70 border-y py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-brand-primary mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
            Care Crafted For You
          </p>
          <h2 className="text-charcoal font-serif text-3xl sm:text-5xl">
            Menu Layanan & Estimasi Waktu
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Setiap treatment dirancang presisi tanpa terburu-buru demi hasil sempurna dan relaksasi
            maksimal.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any, idx: number) => (
            <div
              key={idx}
              className="border-nude-200/60 group flex flex-col justify-between rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <div className="text-brand-primary mb-3 flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
                  <span>{service.category || 'Treatment'}</span>
                  <span className="bg-brand-light inline-flex items-center gap-1.5 rounded-full px-3 py-1">
                    ⏱ {service.duration || 60} Menit
                  </span>
                </div>
                <h3 className="text-charcoal group-hover:text-brand-primary font-serif text-2xl transition">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  {service.desc || service.description}
                </p>
              </div>
              <div className="border-nude-100 mt-8 flex items-center justify-between border-t pt-6">
                <div>
                  <span className="block text-xs text-neutral-400">Mulai dari</span>
                  <span className="text-charcoal font-serif text-xl font-semibold">
                    {service.price}
                  </span>
                </div>
                <button
                  onClick={() => handleBook(service.name)}
                  className="bg-brand-light text-brand-primary hover:bg-brand-primary rounded-full p-3.5 transition hover:text-white"
                >
                  ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
