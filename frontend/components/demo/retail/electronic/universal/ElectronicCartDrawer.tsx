'use client';

import { useElectronicDemo, getElectronicPlaceholderImage } from '../core/ElectronicContext';
import { useState } from 'react';

export function ElectronicCartDrawer() {
  const { client, isCartDrawerOpen, setIsCartDrawerOpen, cart, cartTotal, updateCartItemQuantity, clearCart } = useElectronicDemo();
  
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custNotes, setCustNotes] = useState('');

  if (!isCartDrawerOpen) return null;

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const processWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    let msg = `*HALO ${client.name.toUpperCase()} - ORDER BARU*%0A`;
    msg += `============================%0A`;
    msg += `*DETAIL PENERIMA & LOGISTIK:*%0A`;
    msg += `👤 Nama: ${encodeURIComponent(custName)}%0A`;
    msg += `📞 HP: ${encodeURIComponent(custPhone)}%0A`;
    msg += `📍 Alamat: ${encodeURIComponent(custAddress)}%0A`;
    if (custNotes) msg += `📝 Catatan: ${encodeURIComponent(custNotes)}%0A`;
    msg += `============================%0A`;
    msg += `*RINGKASAN PESANAN:*%0A`;
    
    cart.forEach(item => {
      msg += `- ${item.product.name} (${item.selectedColor}, ${item.selectedVariant}) x${item.quantity} = ${formatIDR(item.totalPrice)}%0A`;
    });
    
    msg += `============================%0A`;
    msg += `*TOTAL PESANAN: ${formatIDR(cartTotal)}*%0A`;
    msg += `%0AMohon info ketersediaan stok & total ongkos kirim. Terima kasih!`;

    window.open(`https://wa.me/${client.waNumber}?text=${msg}`, '_blank');
    clearCart();
    setIsCartDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity" onClick={() => setIsCartDrawerOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-base font-bold text-zinc-950">Keranjang Belanja</h2>
            </div>
            <button onClick={() => setIsCartDrawerOpen(false)} className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Selected Items List */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Item yang Dipilih</h3>
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-10 text-center">Keranjang Anda masih kosong.</p>
                ) : (
                  cart.map(item => (
                    <div key={`${item.id}-${item.selectedVariant}-${item.selectedColor}`} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                      <img src={item.product.imageUrl || getElectronicPlaceholderImage(item.product.id)} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg shrink-0 border border-zinc-200" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-zinc-950 truncate">{item.product.name}</h4>
                        <p className="text-xs font-semibold text-zinc-800">{formatIDR(item.totalPrice / item.quantity)}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{item.selectedColor} • {item.selectedVariant}</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-lg p-1">
                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 cursor-pointer">-</button>
                        <span className="text-xs font-bold text-zinc-950 px-1">{item.quantity}</span>
                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 cursor-pointer">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Logistic Form */}
            {cart.length > 0 && (
              <div className="pt-6 border-t border-zinc-200">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Informasi Tujuan Pengiriman
                </h3>

                <form id="checkout-form" className="space-y-3" onSubmit={processWhatsAppCheckout}>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Nama Lengkap</label>
                    <input type="text" value={custName} onChange={e => setCustName(e.target.value)} required placeholder="Contoh: Rian Pratama" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Nomor WhatsApp</label>
                    <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} required placeholder="Contoh: 081234567890" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Alamat Pengiriman & Kode Pos</label>
                    <textarea rows={2} value={custAddress} onChange={e => setCustAddress(e.target.value)} required placeholder="Jl. Anggrek No. 12, Kel. Menteng, Jakarta Pusat 10310" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Catatan Tambahan (Opsional)</label>
                    <input type="text" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Tinggalkan di pos sekuriti / hubungi sebelum tiba" className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none" />
                  </div>
                  <button type="submit" id="hidden-submit-btn" className="hidden">Submit</button>
                </form>
              </div>
            )}

          </div>

          {/* Drawer Footer Summary */}
          <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal Produk</span>
                <span className="font-bold text-zinc-900">{formatIDR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Ongkir & Asuransi</span>
                <span className="text-emerald-600 font-semibold">Gratis Hari Ini</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total Pesanan</span>
                <span>{formatIDR(cartTotal)}</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => document.getElementById('hidden-submit-btn')?.click()}
              disabled={cart.length === 0}
              className="w-full py-3.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Checkout via WhatsApp
            </button>
            
            <p className="text-[10px] text-center text-zinc-400">
              Ringkasan data logistik & keranjang akan otomatis diformat ke chat admin WhatsApp resmi.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
