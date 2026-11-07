'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function DarkFooter() {
  const { client } = useRetailDemo()
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-16 text-sm text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-slate-900 pb-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold text-white uppercase">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-extrabold text-slate-950"
                style={{ backgroundColor: 'var(--theme-color)' }}
              >
                {client.name.substring(0, 1)}
              </span>
              {client.name}
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {client.tagline || 'Pusat komponen PC, rakitan custom, dan periferal gaming terbaik.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest text-white uppercase">
              Kontak & Alamat
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>WA: {client.waNumber || '-'}</li>
              <li>{client.address || 'Alamat belum tersedia'}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest text-white uppercase">
              Operasional
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>{client.hours || 'Senin - Minggu'}</li>
              <li>
                {client.openTime || '09:00'} - {client.closeTime || '21:00'} WIB
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest text-white uppercase">
              Sosial Media
            </h4>
            <div className="flex flex-col gap-3 text-xs">
              {client.socialMedia?.instagram?.active && (
                <a
                  href={client.socialMedia.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Instagram
                </a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a
                  href={client.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  TikTok
                </a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a
                  href={client.socialMedia.facebook.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Facebook
                </a>
              )}
              {(!client.socialMedia ||
                (!client.socialMedia.instagram?.active &&
                  !client.socialMedia.tiktok?.active &&
                  !client.socialMedia.facebook?.active)) && <span>-</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {client.name}. Garansi Resmi & Packing Aman.
          </p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-white">
              Syarat & Ketentuan
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Klaim Garansi
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
