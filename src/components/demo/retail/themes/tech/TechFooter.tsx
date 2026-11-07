'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function TechFooter() {
  const { client } = useRetailDemo()
  return (
    <footer className="border-t border-zinc-200 bg-white py-16 text-sm text-zinc-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-zinc-200 pb-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 font-bold tracking-tight text-zinc-950 uppercase">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-950 text-[11px] font-bold text-white">
                {client.name.substring(0, 1)}
              </span>
              {client.name}
            </div>
            <p className="text-xs leading-relaxed">
              {client.tagline ||
                'Menghadirkan lini perangkat keras minimalis dengan material aluminium anodized.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-wider text-zinc-950 uppercase">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 text-xs">
              <li>WA: {client.waNumber || '-'}</li>
              <li>{client.address || 'Alamat belum tersedia'}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-wider text-zinc-950 uppercase">
              Jam Operasional
            </h4>
            <ul className="space-y-3 text-xs">
              <li>{client.hours || 'Senin - Minggu'}</li>
              <li>
                {client.openTime || '09:00'} - {client.closeTime || '21:00'}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-wider text-zinc-950 uppercase">
              Sosial Media
            </h4>
            <div className="flex flex-col gap-3 text-xs">
              {client.socialMedia?.instagram?.active && (
                <a
                  href={client.socialMedia.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-zinc-900"
                >
                  Instagram
                </a>
              )}
              {client.socialMedia?.tiktok?.active && (
                <a
                  href={client.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-zinc-900"
                >
                  TikTok
                </a>
              )}
              {client.socialMedia?.facebook?.active && (
                <a
                  href={client.socialMedia.facebook.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-zinc-900"
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

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-zinc-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {client.name}. Desain Minimalis & Jaminan Garansi Resmi.
          </p>
          <div className="flex gap-6">
            <a href="#faq" className="transition-colors hover:text-zinc-900">
              Pusat Bantuan
            </a>
            <a href="#" className="transition-colors hover:text-zinc-900">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
