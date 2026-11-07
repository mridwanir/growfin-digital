import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LumiereFooter() {
  const { client } = useGroomingDemo()

  return (
    <footer className="bg-black/80 py-12 text-[#f5ebe6]">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif-lumiere mb-4 text-3xl">{client.name || 'Lumière.'}</h2>
        <p className="mb-8 text-sm font-light text-[#eeded4]">Elegansi dalam setiap sentuhan.</p>
        <p className="text-xs text-[#eeded4]/60">
          © {new Date().getFullYear()} {client.name || 'Lumière Beauty & Spa'}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
