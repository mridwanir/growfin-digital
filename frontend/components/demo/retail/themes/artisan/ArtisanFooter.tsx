'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function ArtisanFooter() {
  const { client } = useRetailDemo();
  return (
    <footer className="border-t border-zinc-200 bg-[#FBF9F5] pt-16 pb-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-200">
          
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-tight text-xl">
              <span className="w-8 h-8 rounded bg-[var(--theme-color)] text-amber-200 flex items-center justify-center font-bold text-sm">
                {client.name.substring(0,1)}
              </span>
              {client.name}
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">{client.tagline || 'Pusat bahan makanan segar dari kebun langsung ke meja makan Anda.'}</p>
          </div>

          <div>
            <h4 className="text-zinc-900 font-bold mb-4 uppercase tracking-widest text-xs">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li>WA: {client.waNumber || '-'}</li>
              <li>{client.address || 'Alamat belum tersedia'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-900 font-bold mb-4 uppercase tracking-widest text-xs">Jam Operasional</h4>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li>{client.hours || 'Senin - Minggu'}</li>
              <li>{client.openTime || '09:00'} - {client.closeTime || '21:00'} WIB</li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-900 font-bold mb-4 uppercase tracking-widest text-xs">Sosial Media</h4>
            <div className="flex flex-col gap-3 text-sm">
              {client.socialMedia?.instagram?.active && (
                <a href={client.socialMedia.instagram.url} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-[var(--theme-color)] transition-colors">Instagram</a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a href={client.socialMedia.tiktok.url} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-[var(--theme-color)] transition-colors">TikTok</a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a href={client.socialMedia.facebook.url} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-[var(--theme-color)] transition-colors">Facebook</a>
              )}
              {(!client.socialMedia || (!client.socialMedia.instagram?.active && !client.socialMedia.tiktok?.active && !client.socialMedia.facebook?.active)) && (
                <span className="text-zinc-500">-</span>
              )}
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} {client.name}. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <a href="#faq" className="hover:text-zinc-800 transition-colors">Bantuan Layanan</a>
            <a href="#" className="hover:text-zinc-800 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
