import { useFnbDemo } from '../../../core/FnbDemoContext';

export function AlternatifGallery() {
  const { client } = useFnbDemo();

  const fallbackImages = [
    '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
    '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
    '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
    '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
    '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg'
  ];

  const images = client.lookbook && client.lookbook.length > 0 
    ? client.lookbook.map(l => l.imageUrl) 
    : fallbackImages;

  return (
    <section id="gallery-section" className="py-20 bg-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                <div className="max-w-xl">
                    <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">Momen & Ruang</h2>
                    <p className="text-stone-500">Dirancang untuk kenyamanan, mengabadikan setiap momen kebersamaan Anda bersama kami.</p>
                </div>
            </div>
            
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {images.map((img, i) => (
                  <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden group">
                      <img src={img} alt="Gallery" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
            </div>
        </div>
    </section>
  );
}
