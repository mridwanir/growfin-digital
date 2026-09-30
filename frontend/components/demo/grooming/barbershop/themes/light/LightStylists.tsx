import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LightStylists() {
  const { client } = useGroomingDemo();
  const images = client.instagramFeed || [
    '/image/grooming/barber/4.jpg',
    '/image/grooming/barber/5.jpg',
    '/image/grooming/barber/6.jpg'
  ];

  const stylists = client.practitioners?.length ? client.practitioners.map((p, i) => ({
    name: p.name,
    title: p.role,
    img: p.avatarUrl || images[i % images.length]
  })) : [
    { name: "Valerie", title: "Master Colorist", img: images[0] },
    { name: "Jessica", title: "Styling & Blowout Director", img: images[1 % images.length] },
    { name: "Nadia", title: "Keratin & Texture Expert", img: images[2 % images.length] },
  ];

  return (
    <section id="stylists" className="py-24 bg-blush-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-charcoal-900 mb-4">Meet The Artists</h2>
          <p className="text-charcoal-800 font-light text-sm">Penata rambut terbaik, siap merawat mahkota Anda.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
          {stylists.map((stylist, idx) => (
            <div key={idx} className="group">
              <div className="relative w-56 h-56 mx-auto mb-6">
                <img 
                  src={stylist.img} 
                  alt={stylist.name} 
                  className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white group-hover:border-brand-primary transition-colors duration-300"
                />
              </div>
              <h3 className="font-serif text-2xl text-charcoal-900">{stylist.name}</h3>
              <p className="text-brand-primary text-xs font-semibold tracking-wider uppercase mt-2">{stylist.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
