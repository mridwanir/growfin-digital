import { useScrollReveal } from '@/hooks/useScrollReveal';

export function CafeGallery() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-stone-50">
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
          <img src="/image/cafe/chad-montano-MqT0asuoIcU-unsplash.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Coffee pouring" />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cafe/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Cozy seating" />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cafe/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Delicious pizza" />
        </div>
        <div className="col-span-2 md:col-span-1 md:row-span-2 rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cafe/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Latte art" />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cafe/haydn-golden-EVoICOUotkg-unsplash.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Pasta dish" />
        </div>
      </div>
    </section>
  );
}
