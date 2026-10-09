'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function TechFooter() {
  const { client } = useRetailDemo();
  return (
    <footer className="bg-white border-t border-zinc-200 py-16 text-zinc-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-200">
          
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-zinc-950 font-bold uppercase tracking-tight">
              <span className="w-6 h-6 rounded bg-zinc-950 text-white flex items-center justify-center font-bold text-[11px]">{client.name.substring(0,1)}</span>
              {client.name}
            </div>
            <p className="text-xs leading-relaxed">{client.tagline || 'Menghadirkan lini perangkat keras minimalis dengan material aluminium anodized.'}</p>
          </div>

          <div>
            <h4 className="text-zinc-950 font-bold mb-4 uppercase tracking-wider text-[11px]">Hubungi Kami</h4>
            <ul className="space-y-3 text-xs">
              <li>WA: {client.waNumber || '-'}</li>
              <li>{client.address || 'Alamat belum tersedia'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-950 font-bold mb-4 uppercase tracking-wider text-[11px]">Jam Operasional</h4>
            <ul className="space-y-3 text-xs">
              <li>{client.hours || 'Senin - Minggu'}</li>
              <li>{client.openTime || '09:00'} - {client.closeTime || '21:00'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-950 font-bold mb-4 uppercase tracking-wider text-[11px]">Sosial Media</h4>
            <div className="flex flex-col gap-3 text-xs">
              {client.socialMedia?.instagram?.active && (
                <a href={client.socialMedia.instagram.url} target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors">Instagram</a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a href={client.socialMedia.tiktok.url} target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors">TikTok</a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a href={client.socialMedia.facebook.url} target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors">Facebook</a>
              )}
              {(!client.socialMedia || (!client.socialMedia.instagram?.active && !client.socialMedia.tiktok?.active && !client.socialMedia.facebook?.active)) && (
                <span>-</span>
              )}
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} {client.name}. Desain Minimalis & Jaminan Garansi Resmi.</p>
          <div className="flex gap-6">
            <a href="#faq" className="hover:text-zinc-900 transition-colors">Pusat Bantuan</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
