import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function DayspaFooter() {
  const { client } = useGroomingDemo()

  return (
    <footer className="border-t border-white/10 bg-[#2B2623] px-6 py-16 text-xs text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <span className="font-serif-dayspa text-2xl font-medium tracking-[0.2em] text-white uppercase">
            {client.name || 'Lumina'}
          </span>
          <p className="leading-relaxed">
            Suaka relaksasi estetik untuk merevitalisasi pikiran, tubuh, dan jiwa melalui sentuhan
            penuh kesadaran.
          </p>
        </div>
        <div>
          <h5 className="mb-3 font-medium tracking-wider text-white uppercase">Lokasi Sanctuary</h5>
          <p className="leading-relaxed">{client.address}</p>
        </div>
        <div>
          <h5 className="mb-3 font-medium tracking-wider text-white uppercase">Jam Operasional</h5>
          <p className="leading-relaxed">{client.hours || 'Setiap Hari: 09.00 - 21.00 WIB'}</p>
        </div>
        <div>
          <h5 className="mb-3 font-medium tracking-wider text-white uppercase">Kontak Reservasi</h5>
          <p className="leading-relaxed">
            WhatsApp: {client.phone || client.waNumber || '+62 812-3456-7890'}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-white/40">
        &copy; {new Date().getFullYear()} {client.name}. Crafted for peace and aesthetic living.
      </div>
    </footer>
  )
}
