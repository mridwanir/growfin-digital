'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function EditorialFooter() {
  const { client } = useRetailDemo()

  return (
    <footer className="border-t border-[#2A2A2A] bg-[#121212] px-6 py-20 text-white md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 border-b border-[#2A2A2A] pb-16 md:grid-cols-4 md:gap-8">
        <div className="flex flex-col items-start space-y-6 md:col-span-1">
          <div className="font-serif-custom text-3xl font-bold tracking-widest uppercase">
            {client.name || 'ATELIER'}
          </div>
          <p className="text-sm leading-relaxed tracking-wide text-[#8E8E8E]">
            {client.tagline ||
              'Elegansi abadi dalam setiap jahitan. Temukan gaya sejatimu bersama koleksi eksklusif kami.'}
          </p>
        </div>

        <div>
          <h4 className="font-serif-custom mb-6 text-xl italic">Contact</h4>
          <ul className="space-y-4 text-sm tracking-wider text-[#8E8E8E]">
            <li>T. {client.phone || '-'}</li>
            <li>WA. {client.waNumber || '-'}</li>
            <li className="leading-relaxed">{client.address || 'Address not available'}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-custom mb-6 text-xl italic">Hours</h4>
          <ul className="space-y-4 text-sm tracking-wider text-[#8E8E8E]">
            <li>{client.hours || 'Open Daily'}</li>
            <li>
              {client.openTime || '10:00'} - {client.closeTime || '22:00'}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-custom mb-6 text-xl italic">Social</h4>
          <div className="flex flex-col space-y-4 text-sm tracking-widest text-[#8E8E8E] uppercase">
            {client.socialMedia?.instagram?.active && (
              <a
                href={client.socialMedia.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="w-fit transition-colors hover:text-white"
              >
                Instagram
              </a>
            )}
            {client.socialMedia?.tiktok?.active && (
              <a
                href={client.socialMedia.tiktok.url}
                target="_blank"
                rel="noreferrer"
                className="w-fit transition-colors hover:text-white"
              >
                TikTok
              </a>
            )}
            {client.socialMedia?.facebook?.active && (
              <a
                href={client.socialMedia.facebook.url}
                target="_blank"
                rel="noreferrer"
                className="w-fit transition-colors hover:text-white"
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

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 pt-8 md:flex-row">
        <div className="flex space-x-8 text-xs tracking-widest text-[#8E8E8E] uppercase">
          <a href="#" className="transition-colors hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Terms of Service
          </a>
        </div>
        <p className="text-xs tracking-widest text-[#8E8E8E] uppercase">
          &copy; {new Date().getFullYear()} {client.name || 'ATELIER STUDIO'}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
