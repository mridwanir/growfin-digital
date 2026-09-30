import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LumiereFooter() {
  const { client } = useGroomingDemo();

  return (
    <footer className="bg-black/80 text-[#f5ebe6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif-lumiere text-3xl mb-4">{client.name || 'Lumière.'}</h2>
        <p className="text-sm text-[#eeded4] font-light mb-8">Elegansi dalam setiap sentuhan.</p>
        <p className="text-xs text-[#eeded4]/60">© {new Date().getFullYear()} {client.name || 'Lumière Beauty & Spa'}. All rights reserved.</p>
      </div>
    </footer>
  );
}
