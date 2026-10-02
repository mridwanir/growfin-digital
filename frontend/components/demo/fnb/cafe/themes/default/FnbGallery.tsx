import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useFnbDemo } from '../../../core/FnbDemoContext';

export function FnbGallery() {
  const { client } = useFnbDemo();
  const { ref, isVisible } = useScrollReveal(0.1);

  const fallbackImages = [
    "/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg",
    "/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg",
    "/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg",
    "/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg",
    "/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg"
  ];

  const images = client.lookbook && client.lookbook.length > 0
    ? client.lookbook.map(l => l.imageUrl)
    : fallbackImages;

  // Ensure we always have 5 images to fit the CSS grid, padding with fallbacks if needed
  const displayImages = [...images];
  while (displayImages.length < 5) {
    displayImages.push(fallbackImages[displayImages.length % fallbackImages.length]);
  }

  return (
    <section id="gallery" className="py-16 px-4 max-w-7xl mx-auto bg-stone-50">
      <div
        ref={ref}
        className={`text-center mb-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Suasana & Rasa</h2>
        <p className="text-stone-500">Intip kenyamanan ruang dan sajian estetis kami</p>
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px] transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImages[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Cafe gallery 1" />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImages[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Cafe gallery 2" />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImages[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Cafe gallery 3" />
        </div>
        <div className="col-span-2 md:col-span-1 md:row-span-2 rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImages[3]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Cafe gallery 4" />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImages[4]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Cafe gallery 5" />
        </div>
      </div>
    </section>
  );
}
