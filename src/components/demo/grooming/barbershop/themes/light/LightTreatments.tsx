import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LightTreatments() {
  const { client, setIsBookingModalOpen, setSelectedTreatment } = useGroomingDemo()

  const services = client.menu?.length
    ? client.menu
    : [
        {
          name: 'Signature Balayage',
          desc: 'Teknik pewarnaan dimensi bebas tanpa foil, menciptakan gradasi warna natural bak ciuman matahari. Termasuk Olaplex treatment & Toner.',
          price: 'Rp 850.000',
          duration: 180,
        },
        {
          name: 'Keratin Smoothing',
          desc: 'Ucapkan selamat tinggal pada rambut mengembang (frizz). Perawatan protein yang menutrisi hingga ke korteks, menjadikan rambut lurus, lembut, dan mudah diatur.',
          price: 'Rp 650.000',
          duration: 150,
        },
        {
          name: 'Luxury Wash & Blowout',
          desc: 'Cuci rambut relaksasi dengan pijatan kepala, dilanjutkan styling blowout bervolume ala selebriti menggunakan produk perlindungan panas premium.',
          price: 'Rp 150.000',
          duration: 60,
        },
      ]

  const handleBook = (treatmentName: string) => {
    setSelectedTreatment(treatmentName)
    setIsBookingModalOpen(true)
  }

  return (
    <section id="treatments" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-charcoal-900 mb-4 font-serif text-4xl">Layanan Eksklusif</h2>
          <p className="text-charcoal-800 text-sm font-light">
            Pilih treatment untuk memanjakan diri Anda hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any, idx: number) => (
            <div
              key={idx}
              className="bg-blush-50 group border-blush-100 flex flex-col justify-between rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg"
            >
              <div>
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-charcoal-900 font-serif text-2xl">{service.name}</h3>
                  <span className="text-brand-primary rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm">
                    ⏱ {service.duration || 60} Min
                  </span>
                </div>
                <p className="text-charcoal-800 mb-6 text-sm leading-relaxed font-light">
                  {service.desc || service.description}
                </p>
                <div className="font-sans-light text-brand-primary mb-4 text-lg font-semibold">
                  {service.price}
                </div>
              </div>
              <button
                onClick={() => handleBook(service.name)}
                className="text-brand-primary border-brand-primary/30 group-hover:bg-brand-primary mt-4 w-full rounded-full border bg-white py-3 text-sm font-medium transition-colors group-hover:text-white"
              >
                Reservasi Seat
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
