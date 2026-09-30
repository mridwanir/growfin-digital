import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BarbershopBarbers() {
  const { client } = useGroomingDemo();
  const images = client.instagramFeed || [
    '/image/grooming/barber/4.jpg',
    '/image/grooming/barber/5.jpg',
    '/image/grooming/barber/6.jpg'
  ];

  const barbers = client.practitioners?.length ? client.practitioners.map((p, i) => ({
    name: p.name,
    title: p.role,
    img: p.avatarUrl || images[i % images.length]
  })) : [
    { name: "ALEX", title: "MASTER BARBER", img: images[0] },
    { name: "RAKA", title: "FADE & TEXTURE SPECIALIST", img: images[1 % images.length] },
    { name: "DONI", title: "SENIOR HAIR THERAPIST", img: images[2 % images.length] },
  ];

  return (
    <section id="barbers" className="py-24 bg-vintage-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl text-white mb-4 uppercase">The Craftsmen</h2>
          <p className="text-paper/60 font-serif italic">Seniman di balik setiap mahakarya.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
          {barbers.map((barber, idx) => (
            <div key={idx}>
              <img 
                src={barber.img} 
                alt={barber.name} 
                className="w-56 h-56 rounded-none object-cover mx-auto mb-6 grayscale hover:grayscale-0 transition-all duration-500 border-4 border-vintage-700 hover:border-brand-primary"
              />
              <h3 className="font-display text-2xl text-white uppercase">{barber.name}</h3>
              <p className="text-brand-primary text-sm font-display tracking-widest mt-2 uppercase">{barber.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
