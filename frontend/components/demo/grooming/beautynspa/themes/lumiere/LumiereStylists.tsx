import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LumiereStylists() {
  const { client } = useGroomingDemo();

  const stylists = (client.practitioners && client.practitioners.length > 0) ? client.practitioners : [
    { id: '1', name: 'Sarah', role: 'Creative Color Director', photoUrl: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=400&q=80' },
    { id: '2', name: 'Elena', role: 'Nail Artist Expert', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    { id: '3', name: 'Dina', role: 'Senior Hair Therapist', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <section id="stylists" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif-lumiere text-4xl text-[#4a3c37] mb-4">The Artisans</h2>
          <p className="text-[#5c4d47] font-light">Para ahli di balik mahakarya kecantikan Anda.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
          {stylists.slice(0, 3).map((stylist: any, idx: number) => (
            <div key={idx}>
              <img src={stylist.photoUrl || `/image/grooming/beautynspa/adam-winger-WDmvpGs2060-unsplash.jpg`} alt={stylist.name} className="w-48 h-48 rounded-full object-cover mx-auto mb-6 shadow-lg grayscale hover:grayscale-0 transition-all duration-500"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=400&q=80" }} />
              <h3 className="font-serif-lumiere text-2xl text-[#4a3c37]">{stylist.name}</h3>
              <p className="text-brand-primary text-sm font-medium tracking-wide uppercase mt-1">{stylist.role || 'Professional'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
