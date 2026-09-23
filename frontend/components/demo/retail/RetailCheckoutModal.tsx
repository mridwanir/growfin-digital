'use client';

import { useState } from 'react';
import { useRetailDemo, FulfillmentMode } from './RetailDemoContext';

export function RetailCheckoutModal() {
  const { 
    client, 
    cart, 
    cartTotal, 
    isCartModalOpen, 
    setIsCartModalOpen, 
    updateCartItemQuantity, 
    fulfillmentMode, 
    setFulfillmentMode,
    deliveryAddress,
    setDeliveryAddress
  } = useRetailDemo();

  const [customerName, setCustomerName] = useState('');

  if (!isCartModalOpen) return null;

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  const getFulfillmentText = (mode: FulfillmentMode) => {
    switch (mode) {
      case 'PICKUP': return 'Ambil di Toko / Datang Langsung';
      case 'DELIVERY': return 'Pengiriman Instan / Kurir Lokal';
      case 'HOME_SERVICE': return 'Layanan Antar-Jemput / Home Service';
    }
  };

  const handleSendWA = () => {
    let message = `Halo ${client.name}, saya ingin order:\n\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}* (x${item.quantity})\n`;
      
      const variantEntries = Object.entries(item.selectedVariants);
      if (variantEntries.length > 0) {
        message += `   Varian: ${variantEntries.map(([k,v]) => `${k}: ${v}`).join(', ')}\n`;
      }
      if (item.selectedAddons.length > 0) {
        message += `   Tambahan: ${item.selectedAddons.join(', ')}\n`;
      }
      if (item.notes) {
        message += `   Catatan: _"${item.notes}"_\n`;
      }
    });

    message += `\n*Metode*: ${getFulfillmentText(fulfillmentMode)}`;
    if (fulfillmentMode !== 'PICKUP' && deliveryAddress) {
      message += `\n*Alamat*: ${deliveryAddress}`;
    }
    if (customerName) {
      message += `\n*Nama Pemesan*: ${customerName}`;
    }

    message += `\n\nMohon info ketersediaan dan total pembayarannya. Terima kasih!`;

    const waUrl = `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartModalOpen(false)}
      />
      
      <div className="relative w-full max-w-lg bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-slate-900">Keranjang Belanja</h2>
          <button 
            onClick={() => setIsCartModalOpen(false)}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl mb-4 block">🛒</span>
              <p className="font-bold text-slate-500 mb-2">Keranjang masih kosong</p>
              <button 
                onClick={() => setIsCartModalOpen(false)}
                className="text-brand-primary font-bold text-sm"
              >
                Kembali Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Order Items */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 leading-tight mb-1 truncate">{item.product.name}</h3>
                      <p className="text-brand-primary font-bold text-sm mb-2">{formatRupiah(item.totalPrice / item.quantity)}</p>
                      
                      <div className="text-xs text-slate-500 space-y-0.5 mb-3">
                        {Object.entries(item.selectedVariants).map(([k,v]) => (
                          <p key={k}><span className="font-medium text-slate-600">{k}:</span> {v}</p>
                        ))}
                        {item.selectedAddons.length > 0 && (
                          <p><span className="font-medium text-slate-600">Tambahan:</span> {item.selectedAddons.join(', ')}</p>
                        )}
                        {item.notes && (
                          <p className="italic">"{item.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1 inline-flex">
                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center font-bold text-slate-600 hover:text-brand-primary">-</button>
                        <span className="font-black text-sm text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center font-bold text-slate-600 hover:text-brand-primary">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fulfillment Switcher */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3">Metode Pengiriman / Layanan</h3>
                <div className="grid grid-cols-1 gap-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${fulfillmentMode === 'PICKUP' ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="fulfillment" checked={fulfillmentMode === 'PICKUP'} onChange={() => setFulfillmentMode('PICKUP')} className="accent-brand-primary w-4 h-4" />
                    <div>
                      <span className="block font-bold text-sm text-slate-900">Ambil di Toko / Walk-in</span>
                      <span className="block text-xs text-slate-500">Datang langsung ke lokasi kami</span>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${fulfillmentMode === 'DELIVERY' ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="fulfillment" checked={fulfillmentMode === 'DELIVERY'} onChange={() => setFulfillmentMode('DELIVERY')} className="accent-brand-primary w-4 h-4" />
                    <div>
                      <span className="block font-bold text-sm text-slate-900">Pengiriman Instan (Delivery)</span>
                      <span className="block text-xs text-slate-500">Dikirim via kurir lokal/ojol</span>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${fulfillmentMode === 'HOME_SERVICE' ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="fulfillment" checked={fulfillmentMode === 'HOME_SERVICE'} onChange={() => setFulfillmentMode('HOME_SERVICE')} className="accent-brand-primary w-4 h-4" />
                    <div>
                      <span className="block font-bold text-sm text-slate-900">Home Service (Panggilan)</span>
                      <span className="block text-xs text-slate-500">Tim kami datang ke lokasi Anda</span>
                    </div>
                  </label>
                </div>

                {fulfillmentMode !== 'PICKUP' && (
                  <div className="mt-4 animate-in fade-in zoom-in-95 duration-200">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Lengkap / Patokan</label>
                    <textarea 
                      placeholder="Masukkan alamat lengkap..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary min-h-[80px]"
                    />
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                 <label className="block text-sm font-bold text-slate-700 mb-1">Nama Pemesan</label>
                 <input 
                    type="text"
                    placeholder="Nama Anda"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                 />
              </div>

            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500">Subtotal Estimasi</span>
              <span className="text-lg font-black text-slate-900">{formatRupiah(cartTotal)}</span>
            </div>
            <button 
              onClick={handleSendWA}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/25 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Order via WhatsApp</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">Pembayaran dan ongkir dikonfirmasi via WA</p>
          </div>
        )}

      </div>
    </div>
  );
}
