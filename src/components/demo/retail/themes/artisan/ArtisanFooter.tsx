'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function ArtisanFooter() {
  const { client } = useRetailDemo()
  return (
    <footer className="mt-0 border-t border-zinc-200 bg-[#FBF9F5] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-zinc-200 pb-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 uppercase">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-[var(--theme-color)] text-sm font-bold text-amber-200">
                {client.name.substring(0, 1)}
              </span>
              {client.name}
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              {client.tagline ||
                'Pusat bahan makanan segar dari kebun langsung ke meja makan Anda.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-widest text-zinc-900 uppercase">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li>WA: {client.waNumber || '-'}</li>
              <li>{client.address || 'Alamat belum tersedia'}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-widest text-zinc-900 uppercase">
              Jam Operasional
            </h4>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li>{client.hours || 'Senin - Minggu'}</li>
              <li>
                {client.openTime || '09:00'} - {client.closeTime || '21:00'} WIB
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-widest text-zinc-900 uppercase">
              Sosial Media
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              {client.socialMedia?.instagram?.active && (
                <a
                  href={client.socialMedia.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-600 transition-colors hover:text-[var(--theme-color)]"
                >
                  Instagram
                </a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a
                  href={client.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-600 transition-colors hover:text-[var(--theme-color)]"
                >
                  TikTok
                </a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a
                  href={client.socialMedia.facebook.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-600 transition-colors hover:text-[var(--theme-color)]"
                >
                  Facebook
                </a>
              )}
              {(!client.socialMedia ||
                (!client.socialMedia.instagram?.active &&
                  !client.socialMedia.tiktok?.active &&
                  !client.socialMedia.facebook?.active)) && (
                <span className="text-zinc-500">-</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs font-medium text-zinc-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {client.name}. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            <a href="#faq" className="transition-colors hover:text-zinc-800">
              Bantuan Layanan
            </a>
            <a href="#" className="transition-colors hover:text-zinc-800">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
