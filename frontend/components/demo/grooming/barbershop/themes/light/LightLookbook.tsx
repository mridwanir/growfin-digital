import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LightLookbook() {
  const { client } = useGroomingDemo();
  const images = client.instagramFeed || [
    '/image/grooming/barber/1.jpg',
    '/image/grooming/barber/2.jpg',
    '/image/grooming/barber/3.jpg'
  ];

  const lookbookItems = [
    { title: 'Ash Blonde Balayage', author: 'By Valerie', img: images[0] },
    { title: 'Volume Blowout', author: 'By Jessica', img: images[1 % images.length] },
    { title: 'Glass Hair Keratin', author: 'By Nadia', img: images[2 % images.length] },
  ];

  return (
    <section id="lookbook" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-charcoal-900 mb-4">Galeri Gaya</h2>
          <p className="text-charcoal-800 font-light text-sm tracking-wide">Transformasi rambut sempurna untuk setiap kepribadian.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbookItems.map((item, idx) => (
            <div key={idx} className="group relative overflow-hidden h-[450px] rounded-lg">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div>
                  <h3 className="text-white font-serif text-2xl mb-1">{item.title}</h3>
                  <p className="text-blush-100 text-sm font-light">{item.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
