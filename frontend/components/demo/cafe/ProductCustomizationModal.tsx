import { useState, useEffect } from 'react';
import { useCafeDemo } from './CafeDemoContext';

export function ProductCustomizationModal() {
  const { isCustomizationModalOpen, 
    setIsCustomizationModalOpen, 
    selectedProductForCustomization: product,
    addToCart } = useCafeDemo();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      setSelectedAddons([]);
      const initialVariants: Record<string, string> = {};
      if (product.variants) {
        product.variants.forEach(v => {
          initialVariants[v.name] = v.options[0]; // default to first option
        });
      }
      setSelectedVariants(initialVariants);
    }
  }, [product]);

  if (!isCustomizationModalOpen || !product) return null;

  const getBasePriceNumber = (priceStr: string) => {
    return parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
  };

  const calculateTotal = () => {
    let base = getBasePriceNumber(product.price);
    
    // add variant extra prices
    Object.values(selectedVariants).forEach(opt => {
      const match = opt.match(/\(\+Rp\s*([\d.]+)\)/);
      if (match) {
        base += parseInt(match[1].replace(/\D/g, ''), 10);
      }
    });

    // add addons prices
    if (product.addons) {
      product.addons.forEach(addon => {
        if (selectedAddons.includes(addon.name)) {
          base += addon.price;
        }
      });
    }

    return base * quantity;
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      selectedVariants,
      selectedAddons,
      notes,
      totalPrice: calculateTotal()
    });
    setIsCustomizationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Image */}
        <div className="relative h-48 bg-slate-100 shrink-0">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-dark opacity-50`} />
          )}
          <button 
            onClick={() => setIsCustomizationModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-5 overflow-y-auto flex-1">
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{product.name}</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">{product.desc}</p>
          <div className="text-xl font-black text-slate-900 mb-6">{product.price}</div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-5 mb-6">
              {product.variants.map(variant => (
                <div key={variant.name}>
                  <p className="font-bold text-slate-900 mb-2">{variant.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(opt => {
                      const isSelected = selectedVariants[variant.name] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            isSelected 
                              ? `bg-brand-primary text-white border-transparent shadow-md`
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Addons */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-3 mb-6">
              <p className="font-bold text-slate-900 mb-1">Opsi Tambahan</p>
              {product.addons.map(addon => {
                const isSelected = selectedAddons.includes(addon.name);
                return (
                  <label key={addon.name} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? `border-2 text-brand-primary bg-slate-50` : 'border-slate-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedAddons(prev => [...prev, addon.name]);
                          else setSelectedAddons(prev => prev.filter(a => a !== addon.name));
                        }}
                        className={`w-5 h-5 rounded text-amber-600 focus:ring-amber-500`}
                      />
                      <span className="font-bold text-slate-700 text-sm">{addon.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-500">+Rp {addon.price.toLocaleString('id-ID')}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <p className="font-bold text-slate-900 mb-2">Catatan Tambahan (Opsional)</p>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Jangan pakai daun bawang, minta pedas..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
              rows={2}
            />
          </div>
          
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1 shrink-0">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-black text-xl text-slate-600 bg-white rounded-lg shadow-sm hover:text-slate-900">-</button>
            <span className="w-4 text-center font-black">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center font-black text-xl text-slate-600 bg-white rounded-lg shadow-sm hover:text-slate-900">+</button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-between px-5 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-md bg-brand-primary hover:bg-brand-hover`}
          >
            <span>Tambah</span>
            <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
