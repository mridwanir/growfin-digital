import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BarbershopFooter() {
  const { client } = useGroomingDemo()
  const logoName = client.name.split(' ')[0].toUpperCase()

  return (
    <footer className="bg-vintage-900 border-vintage-700 border-t py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-brand-primary mb-4 text-3xl tracking-widest uppercase">
          {logoName}.
        </h2>
        <p className="text-paper/60 mb-8 font-serif text-sm italic">
          Forging confidence through classic grooming.
        </p>
        <p className="text-paper/40 font-display text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} {client.name.toUpperCase()}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
