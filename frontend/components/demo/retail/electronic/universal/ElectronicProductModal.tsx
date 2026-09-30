'use client';

import { useElectronicDemo, getElectronicPlaceholderImage } from '../core/ElectronicContext';
import { useState, useEffect } from 'react';

export function ElectronicProductModal() {
  const { isProductModalOpen, setIsProductModalOpen, selectedProduct, addToCart } = useElectronicDemo();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      const colors = selectedProduct.colors || ["Pure Arctic White", "Graphite Slate", "Sandstone Beige"];
      const variants = selectedProduct.variants || ["Standard Edition", "Travel Case Set"];
      setSelectedColor(colors[0]);
      setSelectedVariant(variants[0]);
      setActiveImage(''); // Will fallback to product image
    }
  }, [selectedProduct]);

  if (!isProductModalOpen || !selectedProduct) return null;

  const colors = selectedProduct.colors || ["Pure Arctic White", "Graphite Slate", "Sandstone Beige"];
  const variants = selectedProduct.variants || ["Standard Edition", "Travel Case Set"];
  const specs = selectedProduct.specs || ["Custom Neodymium Driver", "Active Noise Cancellation 48dB", "Baterai hingga 60 Jam Pemakaian"];

  const price = Number(selectedProduct.price.toString().replace(/[^0-9]/g, '')) || 0;
  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleAddToCart = () => {
    addToCart({
      id: selectedProduct.id.toString(),
      product: selectedProduct,
      quantity: 1,
      selectedColor,
      selectedVariant,
      totalPrice: price
    });
    setIsProductModalOpen(false);
  };

  const currentImage = activeImage || selectedProduct.imageUrl || getElectronicPlaceholderImage(selectedProduct.id);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl my-6">
          
          {/* Close Button */}
          <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto no-scrollbar">
            
            {/* Image Gallery Left */}
            <div className="p-6 sm:p-8 bg-zinc-50 flex flex-col justify-between gap-4 border-b md:border-b-0 md:border-r border-zinc-200">
              <div className="aspect-square rounded-2xl bg-white border border-zinc-200/80 overflow-hidden p-2 flex items-center justify-center">
                <img src={currentImage} alt="Detail Produk" className="w-full h-full object-cover rounded-xl" />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                <button className="aspect-square rounded-xl overflow-hidden border border-zinc-200 focus:border-zinc-950 cursor-pointer hover:opacity-80">
                  <img src={currentImage} className="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            {/* Product Details Right */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{selectedProduct.category || "Acoustics"}</span>
                  <h3 className="text-2xl font-extrabold text-zinc-950 mt-1">{selectedProduct.name}</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-bold text-zinc-950">{formatIDR(price)}</span>
                    <span className="text-xs line-through text-zinc-400">{formatIDR(price * 1.2)}</span>
                  </div>
                </div>

                {/* SKU: Colors */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Pilihan Warna</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c: string) => (
                      <button 
                        key={c}
                        onClick={() => setSelectedColor(c)} 
                        className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${selectedColor === c ? 'text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                        style={selectedColor === c ? { backgroundColor: 'var(--theme-color)', borderColor: 'var(--theme-color)' } : {}}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SKU: Variants */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Varian / Tipe</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v: string) => (
                      <button 
                        key={v}
                        onClick={() => setSelectedVariant(v)} 
                        className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${selectedVariant === v ? 'text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                        style={selectedVariant === v ? { backgroundColor: 'var(--theme-color)', borderColor: 'var(--theme-color)' } : {}}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Spec Sheet */}
                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="text-[11px] font-bold text-zinc-950 uppercase tracking-wider mb-2">Spesifikasi Lengkap</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-500">
                    {specs.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="pt-4 border-t border-zinc-100">
                <button onClick={handleAddToCart} className="w-full py-3.5 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:opacity-90" style={{ backgroundColor: 'var(--theme-color)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Masukkan ke Keranjang
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
