'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../core/GroceriesContext';
import { useState, useEffect } from 'react';

export function GroceriesProductModal() {
  const { isProductModalOpen, setIsProductModalOpen, selectedProduct, addToCart } = useGroceriesDemo();
  
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      const variants = selectedProduct.variants || ['Original'];
      const sizes = ['Standard']; // Or extract from addons/sizes if available
      
      setSelectedVariant(variants[0]);
      setSelectedSize(sizes[0]);
      setQuantity(1);
      setActiveImage(selectedProduct.imageUrl || getGroceryPlaceholderImage(selectedProduct.id));
    }
  }, [selectedProduct]);

  if (!isProductModalOpen || !selectedProduct) return null;

  const price = Number(selectedProduct.price.toString().replace(/[^0-9]/g, '')) || 0;
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleAddToCart = () => {
    addToCart({
      id: selectedProduct.id.toString(),
      product: selectedProduct,
      quantity,
      selectedVariant,
      selectedSize,
      totalPrice: price * quantity
    });
    setIsProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 my-8">
          
          {/* Close Button */}
          <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-zinc-100 text-zinc-600 flex items-center justify-center border border-zinc-200 transition cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Modal: Multi-Image Gallery */}
            <div className="p-6 bg-zinc-50 border-r border-zinc-100 flex flex-col justify-between">
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-200 mb-4">
                  <img src={activeImage || selectedProduct.imageUrl || getGroceryPlaceholderImage(selectedProduct.id)} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                {/* Simulated multiple images using the same image for demo */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[var(--theme-color)] transition flex-shrink-0">
                    <img src={selectedProduct.imageUrl || getGroceryPlaceholderImage(selectedProduct.id)} className="w-full h-full object-cover" />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48Zm-16,0H48V208H208V48Z"></path></svg>
                <span>Kualitas terjamin & dikemas standar higienis.</span>
              </div>
            </div>

            {/* Modal: Spesifikasi Detail & Opsi SKU */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[var(--theme-color)] tracking-wider">{selectedProduct.category}</span>
                <h3 className="text-2xl font-extrabold text-zinc-900 mt-1">{selectedProduct.name}</h3>
                <p className="text-2xl font-black text-[var(--theme-color)] mt-2">{formatIDR(price)}</p>
                
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Deskripsi Produk</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed max-h-24 overflow-y-auto pr-1">
                    {selectedProduct.desc || 'Deskripsi lengkap spesifikasi, komposisi, dan detail penyimpanan.'}
                  </p>
                </div>

                {/* SKU Selector: Varian / Rasa */}
                <div className="mt-5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-2">Pilihan Varian</label>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProduct.variants?.length ? selectedProduct.variants : ['Original']).map((v: string) => (
                      <button 
                        key={v}
                        onClick={() => setSelectedVariant(v)} 
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${selectedVariant === v ? 'border-[var(--theme-color)] bg-emerald-50 text-[var(--theme-color)] ring-1 ring-[var(--theme-color)]' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qty Selector */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 uppercase tracking-wide">Kuantitas</span>
                  <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold">-</button>
                    <span className="w-10 text-center text-sm font-semibold text-zinc-800">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold">+</button>
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="mt-8 pt-4 border-t border-zinc-100">
                <button onClick={handleAddToCart} className="w-full py-3.5 px-6 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-white font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
                  <span>Tambahkan ke Keranjang - {formatIDR(price * quantity)}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
