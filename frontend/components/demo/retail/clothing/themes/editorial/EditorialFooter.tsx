'use client';

import { useClothingDemo } from '../../core/ClothingContext';

export function EditorialFooter() {
  const { client } = useClothingDemo();
  
  return (
    <footer className="bg-[#F5F5F5] py-16 px-6 md:px-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-serif-custom font-bold text-2xl tracking-widest text-[#121212] uppercase">{client.name || 'ATELIER'}</div>
          <div className="flex space-x-6 text-sm uppercase tracking-widest text-[#8E8E8E]">
              <a href="#" className="hover:text-[#121212] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#121212] transition-colors">Journal</a>
              <a href="#" className="hover:text-[#121212] transition-colors">Contact</a>
          </div>
          <p className="text-xs text-[#8E8E8E] tracking-wider">&copy; {new Date().getFullYear()} {client.name || 'ATELIER STUDIO'}. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
