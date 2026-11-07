import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LightFooter() {
  const { client } = useGroomingDemo()
  const logoName = client.name.split(' ')[0]

  return (
    <footer className="bg-charcoal-900 py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 font-serif text-3xl">
          {logoName}
          <span className="text-brand-primary">.</span>
        </h2>
        <p className="mx-auto mb-8 max-w-md text-sm font-light text-white/70">
          Mendefinisikan ulang kecantikan melalui karya seni tata rambut.
        </p>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} {client.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
