'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicFooter() {
  const { client } = useElectronicDemo();
  return (
    <footer className="bg-white border-t border-zinc-200 py-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-950 font-bold uppercase">
          <span className="w-6 h-6 rounded bg-zinc-950 text-white flex items-center justify-center font-bold text-[11px]">{client.name.substring(0,1)}</span>
          {client.name}
        </div>
        <p>© {new Date().getFullYear()} {client.name}. Desain Minimalis & Jaminan Garansi Resmi 24 Bulan.</p>
        <div className="flex gap-6 text-zinc-500">
          <a href="#" className="hover:text-zinc-950">Pusat Bantuan</a>
          <a href="#" className="hover:text-zinc-950">Kebijakan Privasi</a>
          <a href="#" className="hover:text-zinc-950">Tracking Resi</a>
        </div>
      </div>
    </footer>
  );
}
