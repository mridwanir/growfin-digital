import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LightHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  const logoName = client.name.split(' ')[0];

  return (
    <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-blush-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-serif text-3xl font-semibold tracking-wide text-charcoal-900">
              {logoName}<span className="text-brand-primary">.</span>
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center text-sm font-medium tracking-wide">
            <a href="#lookbook" className="text-charcoal-800 hover:text-brand-primary transition-colors">Lookbook</a>
            <a href="#reviews" className="text-charcoal-800 hover:text-brand-primary transition-colors">Testimoni</a>
            <a href="#treatments" className="text-charcoal-800 hover:text-brand-primary transition-colors">Services</a>
            <a href="#stylists" className="text-charcoal-800 hover:text-brand-primary transition-colors">Stylists</a>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="px-6 py-2.5 bg-brand-primary text-white rounded-full hover:opacity-90 transition-colors shadow-md"
            >
              Book a Chair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
