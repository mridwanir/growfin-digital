'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function DarkFooter() {
  const { client } = useRetailDemo();
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-900">
          
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg uppercase">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-950 font-extrabold text-[11px]" style={{ backgroundColor: 'var(--theme-color)' }}>
                {client.name.substring(0,1)}
              </span>
              {client.name}
            </div>
            <p className="text-xs leading-relaxed text-slate-400">{client.tagline || 'Pusat komponen PC, rakitan custom, dan periferal gaming terbaik.'}</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px]">Kontak & Alamat</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>WA: {client.waNumber || '-'}</li>
              <li>{client.address || 'Alamat belum tersedia'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px]">Operasional</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>{client.hours || 'Senin - Minggu'}</li>
              <li>{client.openTime || '09:00'} - {client.closeTime || '21:00'} WIB</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px]">Sosial Media</h4>
            <div className="flex flex-col gap-3 text-xs">
              {client.socialMedia?.instagram?.active && (
                <a href={client.socialMedia.instagram.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a href={client.socialMedia.tiktok.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok</a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a href={client.socialMedia.facebook.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>
              )}
              {(!client.socialMedia || (!client.socialMedia.instagram?.active && !client.socialMedia.tiktok?.active && !client.socialMedia.facebook?.active)) && (
                <span>-</span>
              )}
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {client.name}. Garansi Resmi & Packing Aman.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Klaim Garansi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
