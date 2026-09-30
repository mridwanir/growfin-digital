'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkFooter() {
  const { client } = useElectronicDemo();
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-lg uppercase">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-950 font-extrabold text-[11px]" style={{ backgroundColor: 'var(--theme-color)' }}>
            {client.name.substring(0,1)}
          </span>
          {client.name}
        </div>
        <p>© {new Date().getFullYear()} {client.name}. Seluruh Hak Cipta Dilindungi. Garansi Resmi & Packing Aman.</p>
        <div className="flex gap-4 text-slate-400">
          <a href="#" className="hover:text-white transition-colors" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>Syarat & Ketentuan</a>
          <a href="#" className="hover:text-white transition-colors" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>Kebijakan Privasi</a>
          <a href="#" className="hover:text-white transition-colors" style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}>Klaim Garansi</a>
        </div>
      </div>
    </footer>
  );
}
