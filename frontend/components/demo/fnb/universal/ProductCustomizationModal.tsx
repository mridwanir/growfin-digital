import { useState, useEffect } from 'react';
import { useFnbDemo } from '../core/FnbDemoContext';
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

const CAFE_MENU_IMAGES = [
  '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/fnb/mahesa-tyo-X0HP9m0euz0-unsplash.jpg'
];

export function ProductCustomizationModal() {
  const { isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    selectedProductForCustomization: product,
    addToCart } = useFnbDemo();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string | VariantOption>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      setSelectedAddons([]);
      setActiveImageIndex(0);
      if (product.variants) {
        product.variants.forEach(v => {
          if (v.options && v.options.length > 0) {
            initialVariants[v.name] = v.options[0]; // default to first option
          }
        });
      }
      setSelectedVariants(initialVariants);
    }
  }, [product]);

  if (!isCustomizationModalOpen || !product) return null;

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
      product,
      quantity,
      selectedVariants,
      selectedAddons,
      notes,
      totalPrice: calculateTotal()
    });
    setIsCustomizationModalOpen(false);
  };

  const menuImageUrl = product.imageUrl || CAFE_MENU_IMAGES[(product.id || 0) % CAFE_MENU_IMAGES.length];
  const galleryImages = getProductGalleryImages(product, menuImageUrl);
  const currentImage = galleryImages[activeImageIndex] || galleryImages[0] || menuImageUrl;
  const hasDiscount = hasValidDiscount(product.price, product.originalPrice);
  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice);
  const origPriceNum = parseNumericPrice(product.originalPrice);
  const validSpecs = getValidSpecifications(product.specifications);
  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header Image / Multi-Photo Carousel */}
        <div className="relative h-48 sm:h-56 bg-slate-100 shrink-0 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImage} alt={`${product.name} - foto ${activeImageIndex + 1}`} className="w-full h-full object-cover transition-all duration-300" />
          
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

              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}

          <button
            onClick={() => setIsCustomizationModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors z-10"
          >
            ✕
          </button>
        </div>

        {/* Thumbnail Selectors (rendered only if > 1 image) */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 px-5 pt-3 pb-1 overflow-x-auto bg-white border-b border-slate-100 shrink-0">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
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

        {/* Content Scrollable */}
        <div className="p-5 overflow-y-auto flex-1">
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{product.name}</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">{product.desc}</p>
          {hasDiscount ? (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xl font-black text-slate-900">{product.price}</span>
              {origPriceNum !== undefined && (
                <span className="text-slate-400 line-through text-sm font-semibold">
                  {formatRupiah(origPriceNum)}
                </span>
              )}
              <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
                Hemat {discountPercentage}%
              </span>
            </div>
          ) : (
            <div className="text-xl font-black text-slate-900 mb-4">{product.price}</div>
          )}

          {/* Specifications Table (omitted cleanly if empty) */}
          {validSpecs.length > 0 && (
            <div className="mb-6">
              <p className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">Spesifikasi</p>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-sm">
                {validSpecs.map((spec, idx) => (
                  <div key={idx} className="flex px-4 py-2 odd:bg-slate-50/70 even:bg-white text-xs sm:text-sm">
                    <span className="w-1/3 font-semibold text-slate-500 shrink-0 pr-2">{spec.label}</span>
                    <span className="w-2/3 font-medium text-slate-900 break-words">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-5 mb-6">
              {product.variants.map(variant => (
                <div key={variant.name}>
                  <p className="font-bold text-slate-900 mb-2">{variant.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(opt => {
                      const normalizedOpt = normalizeVariantOption(opt);
                      const currentSelected = selectedVariants[variant.name];
                      const normalizedSelected = currentSelected ? normalizeVariantOption(currentSelected) : null;
                      const isSelected = normalizedSelected?.label === normalizedOpt.label;

                      return (
                        <button
                          key={normalizedOpt.label}
                          type="button"
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border flex items-center gap-1.5 ${isSelected
                            ? `bg-brand-primary text-white border-transparent shadow-md`
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                          <span>{normalizedOpt.label}</span>
                          {normalizedOpt.priceModifier > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
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
