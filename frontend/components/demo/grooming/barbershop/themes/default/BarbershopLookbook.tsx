import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BarbershopLookbook() {
  const { client } = useGroomingDemo();
  // Use images from metadata or fallback to placeholders
  const images = client.instagramFeed || [
    '/image/grooming/barber/1.jpg',
    '/image/grooming/barber/2.jpg',
    '/image/grooming/barber/3.jpg'
  ];

  const lookbookItems = [
    { title: 'CLASSIC POMPADOUR', img: images[0] },
    { title: 'EXECUTIVE FADE', img: images[1 % images.length] },
    { title: 'HOT TOWEL BEARD SHAVE', img: images[2 % images.length] },
  ];

  return (
    <section id="lookbook" className="py-24 bg-vintage-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl text-white mb-4 uppercase">Galeri Karya</h2>
          <p className="text-paper/60 font-serif italic">Presisi dalam setiap tarikan mesin dan gunting.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbookItems.map((item, idx) => (
            <div key={idx} className="group relative overflow-hidden h-[400px]">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-vintage-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border-4 border-transparent group-hover:border-brand-primary/50">
                <span className="text-brand-primary font-display text-2xl tracking-wide text-center px-4 uppercase">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
