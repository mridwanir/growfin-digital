'use client';

import { ShoppingBag } from 'lucide-react';
import { useClothingDemo } from '../../core/ClothingContext';

export function EditorialNavbar() {
  const { client, isCartModalOpen, setIsCartModalOpen, cartItemCount } = useClothingDemo();

  return (
    <nav className="fixed w-full z-40 bg-[#F5F5F5]/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      <div className="px-6 md:px-12 h-20 flex justify-between items-center">
          <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium text-[#2A2A2A]">
              <a href="#lookbook" className="hover:text-[#8C907E] transition-colors">Lookbook</a>
              <a href="#shop" className="hover:text-[#8C907E] transition-colors">Shop</a>
          </div>
          
          <div 
              className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
              <span className="font-serif-custom font-bold text-3xl tracking-widest text-[#121212] uppercase">
                {client.name || 'ATELIER'}
              </span>
          </div>

          <div className="flex items-center space-x-6">
              <button onClick={() => setIsCartModalOpen(!isCartModalOpen)} className="relative group flex items-center gap-2">
                  <span className="text-sm uppercase tracking-widest font-medium hidden md:block group-hover:text-[#8C907E] transition-colors">Cart</span>
                  <div className="relative">
                      <ShoppingBag className="w-6 h-6 text-[#2A2A2A] group-hover:text-[#8C907E] transition-colors" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#121212] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                            {cartItemCount}
                        </span>
                      )}
                  </div>
              </button>
          </div>
      </div>
    </nav>
  );
}
