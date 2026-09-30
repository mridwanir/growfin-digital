import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  const nameParts = client.name.split(' ');
  const mainName = nameParts[0];
  const subName = nameParts.slice(1).join(' ');

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-nude-50/80 backdrop-blur-md border-b border-nude-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="text-2xl md:text-3xl font-serif tracking-widest uppercase font-semibold text-charcoal">
          {mainName} {subName && <span className="text-brand-primary italic text-xl font-normal lowercase tracking-normal">{subName}</span>}
        </a>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
          <a href="#services" className="hover:text-brand-primary transition">Services & Duration</a>
          <a href="#artists" className="hover:text-brand-primary transition">Nail Artists</a>
          <a href="#lookbook" className="hover:text-brand-primary transition">Lookbook</a>
          <a href="#reviews" className="hover:text-brand-primary transition">Vibe & Reviews</a>
        </nav>

        <button 
          onClick={() => setIsBookingModalOpen(true)} 
          className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-brand-primary text-white hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Book Appointment
        </button>
      </div>
    </header>
  );
}
