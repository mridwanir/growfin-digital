import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function NailspaFooter() {
  const { client } = useGroomingDemo();

  return (
    <footer className="bg-white border-t border-nude-200 py-12 px-6 text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-lg font-serif text-charcoal uppercase tracking-widest font-semibold">{client.name}</p>
          <p className="mt-1">{client.address || "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan"}</p>
          {client.metadata?.hours && (
            <p className="mt-1 font-medium text-brand-primary">{client.metadata.hours}</p>
          )}
        </div>
        <p>© {new Date().getFullYear()} {client.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
