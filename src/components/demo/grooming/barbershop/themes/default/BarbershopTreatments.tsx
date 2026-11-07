import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BarbershopTreatments() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo()

  const services = client.menu?.length
    ? client.menu
    : [
        {
          name: 'The Ironwood Cut',
          desc: 'Konsultasi gaya, pencucian rambut, potongan presisi, penataan dengan pomade premium, dan pijat bahu singkat.',
          price: 'Rp 85.000',
          duration: 45,
        },
        {
          name: 'Royal Hot Towel Shave',
          desc: 'Ritual cukur kumis/jenggot tradisional dengan straight razor, uap handuk hangat, dan aplikasi aftershave balm penyejuk.',
          price: 'Rp 65.000',
          duration: 30,
        },
        {
          name: "Gentleman's Hair Spa",
          desc: 'Perawatan kulit kepala khusus pria dengan scrub eksfoliasi, pijat akupresur relaksasi mendalam, dan vitamin rambut.',
          price: 'Rp 120.000',
          duration: 60,
        },
      ]

  const handleBook = (treatmentName: string) => {
    setSelectedTreatment(treatmentName)
    setIsBookingModalOpen(true)
  }

  return (
    <section id="treatments" className="bg-vintage-800 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-display mb-4 text-4xl text-white uppercase">Layanan & Ritual</h2>
          <p className="text-paper/60 font-serif italic">
            Silakan pilih ritual grooming Anda hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any, idx: number) => (
            <div
              key={idx}
              className="bg-vintage-900 border-vintage-700 hover:border-brand-primary group flex flex-col justify-between border p-8 transition-colors"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-display text-2xl text-white uppercase">{service.name}</h3>
                  <span className="bg-vintage-700 text-brand-primary font-display px-3 py-1 text-xs tracking-widest">
                    ⏱ {service.duration || 45} MIN
                  </span>
                </div>
                <p className="text-paper/70 mb-6 font-serif text-sm">
                  {service.desc || service.description}
                </p>
                <div className="font-display text-brand-primary mb-4 text-lg">{service.price}</div>
              </div>
              <button
                onClick={() => handleBook(service.name)}
                className="border-brand-primary text-brand-primary font-display group-hover:bg-brand-primary group-hover:text-vintage-900 mt-4 w-full border py-3 font-bold tracking-widest uppercase transition-colors"
              >
                RESERVASI
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
