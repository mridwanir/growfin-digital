
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function DayspaFooter() {
  const { client } = useGroomingDemo();

  return (
    <footer className="bg-[#2B2623] text-white/70 py-16 px-6 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <span className="font-serif-dayspa text-2xl tracking-[0.2em] font-medium uppercase text-white">
            {client.name || 'Lumina'}
          </span>
          <p className="leading-relaxed">Suaka relaksasi estetik untuk merevitalisasi pikiran, tubuh, dan jiwa melalui sentuhan penuh kesadaran.</p>
        </div>
        <div>
          <h5 className="text-white font-medium uppercase tracking-wider mb-3">Lokasi Sanctuary</h5>
          <p className="leading-relaxed">{client.address}</p>
        </div>
        <div>
          <h5 className="text-white font-medium uppercase tracking-wider mb-3">Jam Operasional</h5>
          <p className="leading-relaxed">{client.metadata?.hours || 'Setiap Hari: 09.00 - 21.00 WIB'}</p>
        </div>
        <div>
          <h5 className="text-white font-medium uppercase tracking-wider mb-3">Kontak Reservasi</h5>
          <p className="leading-relaxed">WhatsApp: {client.metadata?.contact || '+62 812-3456-7890'}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-white/40">
        &copy; {new Date().getFullYear()} {client.name}. Crafted for peace and aesthetic living.
      </div>
    </footer>
  );
}
