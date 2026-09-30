'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../../core/GroceriesContext';
import { useState, useEffect } from 'react';

export function ArtisanProductModal() {
  const { isProductModalOpen, setIsProductModalOpen, selectedProduct, addToCart } = useGroceriesDemo();
  
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      const variants = selectedProduct.variants || ['Pack 250 Gram'];
      setSelectedVariant(variants[0]);
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
      selectedSize: 'Standard',
      totalPrice: price * quantity
    });
    setIsProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative">
        
        {/* Close button */}
        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="grid md:grid-cols-12 gap-8 p-6 sm:p-10">
          
          {/* Left: Image Gallery (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <img src={activeImage || selectedProduct.imageUrl || getGroceryPlaceholderImage(selectedProduct.id)} alt="Detail Produk" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square rounded-xl overflow-hidden border border-zinc-200 cursor-pointer hover:opacity-80">
                <img src={selectedProduct.imageUrl || getGroceryPlaceholderImage(selectedProduct.id)} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right: Information & SKU (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[var(--theme-color)] bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">{selectedProduct.category}</span>
                  <span className="text-[11px] text-zinc-400">SKU: <strong className="text-zinc-700">AP-{selectedProduct.id}</strong></span>
                </div>
                <h3 className="text-2xl font-serif-display font-bold text-zinc-900">{selectedProduct.name}</h3>
                <p className="text-2xl font-extrabold text-[var(--theme-color)] mt-2">{formatIDR(price)}</p>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-600 leading-relaxed max-h-24 overflow-y-auto">{selectedProduct.desc || "Deskripsi produk belum tersedia."}</p>

              {/* Specification List */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/70">
                <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">Spesifikasi Kualitas:</h5>
                <ul className="space-y-1.5 text-xs text-zinc-600">
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Standar: Grade A Export Quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Kondisi: Segar dipetik subuh hari</span>
                  </li>
                </ul>
              </div>

              {/* SKU Variants Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">Pilih Porsi / Ukuran Kemasan:</label>
                <div className="flex flex-wrap gap-2">
                  {(selectedProduct.variants?.length ? selectedProduct.variants : ['Pack 250 Gram']).map((v: string) => (
                    <button 
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedVariant === v 
                          ? 'border-[var(--theme-color)] bg-[var(--theme-color)] text-amber-200 shadow-xs' 
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty Counter */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold text-zinc-700 uppercase">Jumlah:</span>
                <div className="inline-flex items-center border border-zinc-200 rounded-xl bg-white p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-200 cursor-pointer">-</button>
                  <span className="w-10 text-center font-bold text-xs text-zinc-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-200 cursor-pointer">+</button>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-6 mt-6 border-t border-zinc-100">
              <button onClick={handleAddToCart} className="w-full py-3.5 px-6 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-amber-200 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-[var(--theme-color)]/20 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> Masukkan ke Keranjang - {formatIDR(price * quantity)}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
