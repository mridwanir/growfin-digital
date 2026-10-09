'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function EditorialFooter() {
  const { client } = useRetailDemo();
  
  return (
    <footer className="bg-[#121212] text-white py-20 px-6 md:px-12 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 pb-16 border-b border-[#2A2A2A]">
        
        <div className="md:col-span-1 flex flex-col items-start space-y-6">
          <div className="font-serif-custom font-bold text-3xl tracking-widest uppercase">{client.name || 'ATELIER'}</div>
          <p className="text-sm text-[#8E8E8E] leading-relaxed tracking-wide">
            {client.tagline || 'Elegansi abadi dalam setiap jahitan. Temukan gaya sejatimu bersama koleksi eksklusif kami.'}
          </p>
        </div>

        <div>
          <h4 className="font-serif-custom italic text-xl mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-[#8E8E8E] tracking-wider">
            <li>T. {client.phone || '-'}</li>
            <li>WA. {client.waNumber || '-'}</li>
            <li className="leading-relaxed">{client.address || 'Address not available'}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-custom italic text-xl mb-6">Hours</h4>
          <ul className="space-y-4 text-sm text-[#8E8E8E] tracking-wider">
            <li>{client.hours || 'Open Daily'}</li>
            <li>{client.openTime || '10:00'} - {client.closeTime || '22:00'}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-custom italic text-xl mb-6">Social</h4>
          <div className="flex flex-col space-y-4 text-sm uppercase tracking-widest text-[#8E8E8E]">
            {client.socialMedia?.instagram?.active && (
              <a href={client.socialMedia.instagram.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors w-fit">Instagram</a>
            )}
            {client.socialMedia?.tiktok?.active && (
              <a href={client.socialMedia.tiktok.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors w-fit">TikTok</a>
            )}
            {client.socialMedia?.facebook?.active && (
              <a href={client.socialMedia.facebook.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors w-fit">Facebook</a>
            )}
            {(!client.socialMedia || (!client.socialMedia.instagram?.active && !client.socialMedia.tiktok?.active && !client.socialMedia.facebook?.active)) && (
              <span>-</span>
            )}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex space-x-8 text-xs uppercase tracking-widest text-[#8E8E8E]">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
        <p className="text-xs text-[#8E8E8E] tracking-widest uppercase">&copy; {new Date().getFullYear()} {client.name || 'ATELIER STUDIO'}. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
