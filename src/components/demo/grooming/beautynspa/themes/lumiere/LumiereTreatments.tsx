import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LumiereTreatments() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()

  const treatments =
    client.menu && client.menu.length > 0
      ? client.menu
      : [
          {
            id: '1',
            name: 'Signature Hair Spa',
            price: '250000',
            duration: 60,
            desc: 'Perawatan kulit kepala dengan pijatan relaksasi menggunakan serum premium untuk rambut rontok dan lepek.',
          },
          {
            id: '2',
            name: 'Balayage & Color',
            price: '850000',
            duration: 180,
            desc: 'Pewarnaan rambut artistik tanpa merusak folikel. Termasuk vitamin perlindungan warna.',
          },
          {
            id: '3',
            name: 'Premium Nail Art',
            price: '300000',
            duration: 90,
            desc: 'Manicure, pedicure, dan nail art desain kustom dengan gel polish tahan lama berkualitas tinggi.',
          },
        ]

  const formatIDR = (priceStr: string | number) => {
    const price =
      typeof priceStr === 'string' ? parseInt(priceStr.replace(/[^0-9]/g, '')) : priceStr
    if (isNaN(price)) return priceStr
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section id="treatments" className="bg-[#faf7f5] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif-lumiere mb-4 text-4xl text-[#4a3c37]">Menu Perawatan</h2>
          <p className="font-light text-[#5c4d47]">
            Pilih layanan yang Anda butuhkan, kami sediakan waktu khusus untuk Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((service: any, idx: number) => (
            <div
              key={idx}
              className="group flex flex-col justify-between border border-[#eeded4] bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-serif-lumiere text-2xl text-[#4a3c37]">{service.name}</h3>
                  {service.duration && (
                    <span className="flex items-center gap-1 bg-[#f5ebe6] px-2 py-1 text-xs text-[#5c4d47]">
                      ⏱ {service.duration} Menit
                    </span>
                  )}
                </div>
                <p className="mb-4 line-clamp-3 text-sm text-[#5c4d47]">{service.desc}</p>
                <p className="mb-4 font-medium text-[#4a3c37]">{formatIDR(service.price)}</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="border-brand-primary group-hover:bg-brand-primary mt-4 w-full border py-3 text-[#4a3c37] transition-colors group-hover:text-white"
              >
                Reservasi
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
