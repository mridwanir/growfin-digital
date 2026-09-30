import { useFnbDemo } from '../../../core/FnbDemoContext';
import { ShieldCheck } from 'lucide-react';

export function BubbleteaFooter() {
  const { client } = useFnbDemo();
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'B';

  return (
    <footer className="bg-stone-900 text-stone-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-base">
            {brandInitial}
          </div>
          <span className="text-white font-bold tracking-tight uppercase">{client.name} INDONESIA</span>
        </div>
        <p className="text-stone-500 text-xs text-center md:text-left">
          &copy; {new Date().getFullYear()} {client.name}. Dibuat dengan cinta untuk para penikmat kesegaran sejati.
        </p>
        <div className="flex gap-4">
          <span className="inline-flex items-center gap-1 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Higienis &amp; Halal
          </span>
        </div>
      </div>
    </footer>
  );
}
