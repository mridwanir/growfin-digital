import { getGroomingImageUrl } from '../default/GroomingStylistList';
import { useBeautynspaDemo } from '../../core/BeautynspaContext';

export function LumiereLookbook() {
  const { client } = useBeautynspaDemo();

  const lookbooks = (client.lookbook && client.lookbook.length >= 3) ? client.lookbook : [
    { id: '1', name: 'Balayage Elegance', imageUrl: getGroomingImageUrl(0) },
    { id: '2', name: 'Premium Nail Art', imageUrl: getGroomingImageUrl(1) },
    { id: '3', name: 'Relaxing Hair Spa', imageUrl: getGroomingImageUrl(2) }
  ];

  return (
    <section id="lookbook" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="font-serif-lumiere text-4xl text-[#4a3c37] mb-4">The Lookbook</h2>
                <p className="text-[#5c4d47] font-light">Sentuhan ajaib dari para ahli kami. Dari pewarnaan rambut hingga nail art.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lookbooks.slice(0,3).map((lb: any, idx: number) => (
                  <div key={idx} className="group relative overflow-hidden h-96">
                      <img src={lb.imageUrl || `/image/grooming/beautynspa/look${idx+1}.jpg`} alt={lb.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80" }} />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-serif-lumiere text-xl tracking-wide">{lb.name}</span>
                      </div>
                  </div>
                ))}
            </div>
        </div>
    </section>
  );
}
