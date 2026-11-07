import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()
  const nameParts = client.name.split(' ')
  const mainName = nameParts[0]
  const subName = nameParts.slice(1).join(' ')

  return (
    <header className="bg-nude-50/80 border-nude-200/60 fixed top-0 left-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a
          href="#"
          className="text-charcoal font-serif text-2xl font-semibold tracking-widest uppercase md:text-3xl"
        >
          {mainName}{' '}
          {subName && (
            <span className="text-brand-primary text-xl font-normal tracking-normal lowercase italic">
              {subName}
            </span>
          )}
        </a>

        <nav className="hidden items-center space-x-8 text-sm font-medium tracking-wide md:flex">
          <a href="#services" className="hover:text-brand-primary transition">
            Services & Duration
          </a>
          <a href="#artists" className="hover:text-brand-primary transition">
            Nail Artists
          </a>
          <a href="#lookbook" className="hover:text-brand-primary transition">
            Lookbook
          </a>
          <a href="#reviews" className="hover:text-brand-primary transition">
            Vibe & Reviews
          </a>
        </nav>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="bg-brand-primary rounded-full px-6 py-2.5 text-xs font-semibold tracking-widest text-white uppercase shadow-sm transition-all duration-300 hover:opacity-90 hover:shadow-md"
        >
          Book Appointment
        </button>
      </div>
    </header>
  )
}
