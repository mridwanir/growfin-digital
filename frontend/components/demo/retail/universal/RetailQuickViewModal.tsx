'use client';

import { useState, useEffect } from 'react';
import { useRetailDemo, getRetailPlaceholderImage } from '../core/RetailDemoContext';
import { VariantOption } from '@/lib/types';
import { 
  calculateItemPrice, 
  normalizeVariantOption, 
  buildCartItemHash,
  hasValidDiscount,
  getDiscountPercentage,
  parseNumericPrice,
  getProductGalleryImages,
  getValidSpecifications,
} from '@/lib/catalog';

export function RetailQuickViewModal() {
  const { 
    isCustomizationModalOpen, 
    setIsCustomizationModalOpen, 
    selectedProductForCustomization,
    addToCart,
    setIsCartModalOpen
  } = useRetailDemo();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string | VariantOption>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
    } else if (diff < -50) {
      setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
    setTouchStartX(null);
  };
  // Reset state when modal opens with a new product
  useEffect(() => {
    if (isCustomizationModalOpen && selectedProductForCustomization) {
      setQuantity(1);
      setNotes('');
      setSelectedAddons([]);
      setActiveImageIndex(0);
      
      const initialVariants: Record<string, string | VariantOption> = {};
      selectedProductForCustomization.variants?.forEach((v) => {
        if (v.options && v.options.length > 0) {
          initialVariants[v.name] = v.options[0]; // Select first option by default
        }
      });
      setSelectedVariants(initialVariants);
    }
  }, [isCustomizationModalOpen, selectedProductForCustomization]);

  if (!isCustomizationModalOpen || !selectedProductForCustomization) return null;

  const product = selectedProductForCustomization;
  const galleryImages = getProductGalleryImages(product, getRetailPlaceholderImage(product.id));
  const currentImage = galleryImages[activeImageIndex] || galleryImages[0] || getRetailPlaceholderImage(product.id);
  const hasDiscount = hasValidDiscount(product.price, product.originalPrice);
  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice);
  const origPriceNum = parseNumericPrice(product.originalPrice);
  const validSpecs = getValidSpecifications(product.specifications);
  const calculateTotal = () => {
    const activeAddons = (product.addons || []).filter(addon => selectedAddons.includes(addon.name));
    const unitPrice = calculateItemPrice(
      product.price,
      Object.values(selectedVariants),
      activeAddons
    );
    return unitPrice * quantity;
  };

  const handleAddToCart = () => {
    const hash = buildCartItemHash(product.id, selectedVariants, selectedAddons);
    addToCart({
      id: hash,
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
        
        {/* Header Image / Multi-Photo Carousel */}
        <div 
          className="relative h-56 sm:h-72 shrink-0 bg-slate-100 select-none"
          onTouchStart={galleryImages.length > 1 ? handleTouchStart : undefined}
          onTouchEnd={galleryImages.length > 1 ? handleTouchEnd : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={currentImage} 
            alt={`${product.name} - foto ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Carousel Controls (only when > 1 image) */}
          {galleryImages.length > 1 && (
            <>
              <button 
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer z-10"
                aria-label="Foto sebelumnya"
              >
                ‹
              </button>
              <button 
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer z-10"
                aria-label="Foto berikutnya"
              >
                ›
              </button>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}

          <button 
            type="button"
            onClick={() => setIsCustomizationModalOpen(false)}
            className="absolute top-4 right-4 h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            ✕
          </button>
        </div>

        {/* Thumbnail Selectors (rendered only if > 1 image) */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 px-5 sm:px-6 pt-3 pb-1 overflow-x-auto bg-white border-b border-slate-100 shrink-0">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === activeImageIndex
                    ? 'border-brand-primary ring-2 ring-brand-primary/20 scale-105'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{product.name}</h2>
            {hasDiscount ? (
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="text-brand-primary font-black text-2xl">{product.price}</span>
                {origPriceNum !== undefined && (
                  <span className="text-slate-400 line-through text-base font-semibold">
                    {formatRupiah(origPriceNum)}
                  </span>
                )}
                <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  Hemat {discountPercentage}%
                </span>
              </div>
            ) : (
              <p className="text-brand-primary font-black text-xl mb-3">{product.price}</p>
            )}
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{product.desc}</p>
          </div>

          {/* Specifications Table (omitted cleanly if empty) */}
          {validSpecs.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 mb-2.5 text-sm uppercase tracking-wider">Spesifikasi Produk</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-sm">
                {validSpecs.map((spec, idx) => (
                  <div key={idx} className="flex px-4 py-2.5 odd:bg-slate-50/70 even:bg-white text-xs sm:text-sm">
                    <span className="w-1/3 font-semibold text-slate-500 shrink-0 pr-3">{spec.label}</span>
                    <span className="w-2/3 font-medium text-slate-900 break-words">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map((variant) => (
                <div key={variant.name}>
                  <h3 className="font-bold text-slate-900 mb-2">{variant.name} <span className="text-rose-500">*</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => {
                      const normalizedOpt = normalizeVariantOption(opt);
                      const currentSelected = selectedVariants[variant.name];
                      const normalizedSelected = currentSelected ? normalizeVariantOption(currentSelected) : null;
                      const isSelected = normalizedSelected?.label === normalizedOpt.label;

                      return (
                        <button
                          key={normalizedOpt.label}
                          type="button"
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border flex items-center gap-1.5 ${
                            isSelected 
                            ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-light text-brand-primary' 
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>{normalizedOpt.label}</span>
                          {normalizedOpt.priceModifier > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                              isSelected ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-100 text-slate-500'
                            }`}>
                              +Rp {normalizedOpt.priceModifier.toLocaleString('id-ID')}
                            </span>
                          )}
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
            <div>
               <h3 className="font-bold text-slate-900 mb-2">Tambahan Opsional</h3>
               <div className="space-y-2">
                 {product.addons.map((addon) => {
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
                           else setSelectedAddons(selectedAddons.filter((a) => a !== addon.name));
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
