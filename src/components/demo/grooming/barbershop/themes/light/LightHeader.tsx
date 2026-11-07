import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LightHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()
  const logoName = client.name.split(' ')[0]

  return (
    <nav className="border-blush-100 fixed z-40 w-full border-b bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <span className="text-charcoal-900 font-serif text-3xl font-semibold tracking-wide">
              {logoName}
              <span className="text-brand-primary">.</span>
            </span>
          </div>
          <div className="hidden items-center space-x-8 text-sm font-medium tracking-wide md:flex">
            <a
              href="#lookbook"
              className="text-charcoal-800 hover:text-brand-primary transition-colors"
            >
              Lookbook
            </a>
            <a
              href="#reviews"
              className="text-charcoal-800 hover:text-brand-primary transition-colors"
            >
              Testimoni
            </a>
            <a
              href="#treatments"
              className="text-charcoal-800 hover:text-brand-primary transition-colors"
            >
              Services
            </a>
            <a
              href="#stylists"
              className="text-charcoal-800 hover:text-brand-primary transition-colors"
            >
              Stylists
            </a>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-brand-primary rounded-full px-6 py-2.5 text-white shadow-md transition-colors hover:opacity-90"
            >
              Book a Chair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
