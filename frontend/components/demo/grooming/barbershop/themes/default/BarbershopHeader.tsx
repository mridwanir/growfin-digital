import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BarbershopHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  // Name handling: just take the first word as the logo or the full name
  const logoName = client.name.split(' ')[0].toUpperCase();

  return (
    <nav className="fixed w-full z-40 bg-vintage-900/90 backdrop-blur-md border-b border-vintage-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-display text-2xl font-bold tracking-widest text-brand-primary uppercase">
              {logoName}.
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center font-display text-sm tracking-widest uppercase">
            <a href="#lookbook" className="text-paper/70 hover:text-brand-primary transition-colors">Lookbook</a>
            <a href="#reviews" className="text-paper/70 hover:text-brand-primary transition-colors">Reviews</a>
            <a href="#treatments" className="text-paper/70 hover:text-brand-primary transition-colors">Services</a>
            <a href="#barbers" className="text-paper/70 hover:text-brand-primary transition-colors">Barbers</a>
            <button 
              onClick={() => setIsBookingModalOpen(true)} 
              className="px-6 py-2.5 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-vintage-900 transition-colors font-bold uppercase"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
