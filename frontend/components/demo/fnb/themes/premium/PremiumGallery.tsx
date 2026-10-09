import { useFnbDemo } from '../../core/FnbDemoContext';

export function PremiumGallery() {
  const { client } = useFnbDemo();
  const images = client.lookbook && client.lookbook.length > 0 
    ? client.lookbook.map(l => l.imageUrl)
    : [
        '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
        '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
        '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
        '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg'
      ];

  return (
    <section id="gallery" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16 transition-all duration-1000">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{client.galleryTitle || 'The Atmosphere'}</h2>
                <p className="text-slate-400 max-w-xl mx-auto">{client.galleryDescription || 'A glimpse into our meticulously designed space, where modern elegance meets cozy warmth.'}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
                <div className="col-span-2 row-span-2 relative overflow-hidden group">
                    <img src={images[0]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="col-span-1 row-span-1 relative overflow-hidden group">
                    <img src={images[1]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="col-span-1 row-span-2 relative overflow-hidden group">
                    <img src={images[2]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="col-span-1 row-span-1 relative overflow-hidden group">
                    <img src={images[3]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
            </div>
        </div>
    </section>
  );
}
