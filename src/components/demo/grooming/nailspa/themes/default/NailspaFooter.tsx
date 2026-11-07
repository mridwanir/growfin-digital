import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaFooter() {
  const { client } = useGroomingDemo()

  return (
    <footer className="border-nude-200 border-t bg-white px-6 py-12 text-xs text-neutral-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-charcoal font-serif text-lg font-semibold tracking-widest uppercase">
            {client.name}
          </p>
          <p className="mt-1">
            {client.address || 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan'}
          </p>
          {client.hours && <p className="text-brand-primary mt-1 font-medium">{client.hours}</p>}
        </div>
        <p>
          © {new Date().getFullYear()} {client.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
