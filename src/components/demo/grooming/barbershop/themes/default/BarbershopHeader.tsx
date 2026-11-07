import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BarbershopHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()
  // Name handling: just take the first word as the logo or the full name
  const logoName = client.name.split(' ')[0].toUpperCase()

  return (
    <nav className="bg-vintage-900/90 border-vintage-700 fixed z-40 w-full border-b backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <span className="font-display text-brand-primary text-2xl font-bold tracking-widest uppercase">
              {logoName}.
            </span>
          </div>
          <div className="font-display hidden items-center space-x-8 text-sm tracking-widest uppercase md:flex">
            <a
              href="#lookbook"
              className="text-paper/70 hover:text-brand-primary transition-colors"
            >
              Lookbook
            </a>
            <a href="#reviews" className="text-paper/70 hover:text-brand-primary transition-colors">
              Reviews
            </a>
            <a
              href="#treatments"
              className="text-paper/70 hover:text-brand-primary transition-colors"
            >
              Services
            </a>
            <a href="#barbers" className="text-paper/70 hover:text-brand-primary transition-colors">
              Barbers
            </a>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-vintage-900 border px-6 py-2.5 font-bold uppercase transition-colors"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
