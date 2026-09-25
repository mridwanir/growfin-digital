'use client';

import { useState, useEffect } from 'react';
import { useRetailDemo } from './RetailDemoContext';
import { getRetailImageUrl } from './RetailProductList';

export function RetailProductModal() {
  const { 
    isCustomizationModalOpen, 
    setIsCustomizationModalOpen, 
    selectedProductForCustomization,
    addToCart,
    setIsCartModalOpen
  } = useRetailDemo();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Reset state when modal opens with a new product
  useEffect(() => {
    if (isCustomizationModalOpen && selectedProductForCustomization) {
      setQuantity(1);
      setNotes('');
      setSelectedAddons([]);
      
      const initialVariants: Record<string, string> = {};
      selectedProductForCustomization.variants?.forEach(v => {
        if (v.options.length > 0) {
          initialVariants[v.name] = v.options[0]; // Select first option by default
        }
      });
      setSelectedVariants(initialVariants);
    }
  }, [isCustomizationModalOpen, selectedProductForCustomization]);

  if (!isCustomizationModalOpen || !selectedProductForCustomization) return null;

  const product = selectedProductForCustomization;

  const getBasePrice = () => {
    const p = product.price?.replace(/\D/g, '');
    return p ? parseInt(p) : 0;
  };

  const calculateTotal = () => {
    let total = getBasePrice();
    // Addons
    selectedAddons.forEach(addonName => {
      const addonObj = product.addons?.find(a => a.name === addonName);
      if (addonObj) total += addonObj.price;
    });
    // Variants could have price modifiers (simplified here as just string options, but you could parse "(+Rp 5.000)")
    Object.values(selectedVariants).forEach(opt => {
      const match = opt.match(/\(\+Rp\s*([\d.]+)\)/);
      if (match) {
        total += parseInt(match[1].replace(/\./g, ''));
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      product: product,
      quantity,
      selectedVariants,
      selectedAddons,
      notes,
      totalPrice: calculateTotal()
    });
    setIsCustomizationModalOpen(false);
    setIsCartModalOpen(true);
  };

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCustomizationModalOpen(false)}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header Image */}
        <div className="relative h-48 sm:h-64 shrink-0 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={getRetailImageUrl(product.id)} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => setIsCustomizationModalOpen(false)}
            className="absolute top-4 right-4 h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur text-white rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{product.name}</h2>
            <p className="text-brand-primary font-black text-xl mb-3">{product.price}</p>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{product.desc}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map(variant => (
                <div key={variant.name}>
                  <h3 className="font-bold text-slate-900 mb-2">{variant.name} <span className="text-rose-500">*</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          selectedVariants[variant.name] === opt 
                          ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-light text-brand-primary' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Addons */}
          {product.addons && product.addons.length > 0 && (
            <div>
               <h3 className="font-bold text-slate-900 mb-2">Tambahan Opsional</h3>
               <div className="space-y-2">
                 {product.addons.map(addon => {
                   const isSelected = selectedAddons.includes(addon.name);
                   return (
                     <label key={addon.name} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                       <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-brand-primary border-brand-primary' : 'border-slate-300'}`}>
                           {isSelected && <span className="text-white text-xs">✓</span>}
                         </div>
                         <span className="font-medium text-slate-700 text-sm">{addon.name}</span>
                       </div>
                       <span className="text-slate-500 text-sm font-medium">+ {formatRupiah(addon.price)}</span>
                       <input 
                         type="checkbox" 
                         className="hidden"
                         checked={isSelected}
                         onChange={(e) => {
                           if (e.target.checked) setSelectedAddons([...selectedAddons, addon.name]);
                           else setSelectedAddons(selectedAddons.filter(a => a !== addon.name));
                         }}
                       />
                     </label>
                   )
                 })}
               </div>
            </div>
          )}

          {/* Special Request */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Catatan Khusus</h3>
            <textarea 
              placeholder="Contoh: Tolong tulis di kartu ucapan 'Selamat Wisuda Sarah!' atau 'Mobil warna merah'"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary min-h-[80px]"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <span className="font-bold text-slate-900">Jumlah</span>
            <div className="flex items-center gap-4 bg-slate-100 rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 hover:text-brand-primary"
              >
                -
              </button>
              <span className="font-black text-slate-900 w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 hover:text-brand-primary"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100">
          <button 
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white font-black shadow-lg shadow-brand-primary/25 transition-transform active:scale-[0.98] flex items-center justify-between px-6"
          >
            <span>Tambah ke Keranjang</span>
            <span>{formatRupiah(calculateTotal())}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
