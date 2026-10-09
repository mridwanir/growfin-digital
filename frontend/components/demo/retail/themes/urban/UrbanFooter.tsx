'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function UrbanFooter() {
  const { client } = useRetailDemo();

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 relative z-10 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter text-white uppercase">{client.name}</h3>
            <p className="text-sm leading-relaxed">{client.tagline || 'Solusi fashion modern dengan kualitas premium untuk gaya hidup masa kini.'}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li>WhatsApp: {client.waNumber || '-'}</li>
              <li>{client.address || 'Alamat belum tersedia'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Jam Operasional</h4>
            <ul className="space-y-3 text-sm">
              <li>{client.hours || 'Senin - Minggu'}</li>
              <li>{client.openTime || '09:00'} - {client.closeTime || '21:00'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Sosial Media</h4>
            <div className="flex gap-4">
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

        <div className="pt-8 text-center text-xs">
          &copy; {new Date().getFullYear()} {client.name}. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}
