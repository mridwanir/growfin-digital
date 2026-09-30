'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../../core/GroceriesContext';
import { useState } from 'react';

export function ArtisanCartDrawer() {
  const { client, isCartDrawerOpen, setIsCartDrawerOpen, cart, cartTotal, updateCartItemQuantity, clearCart } = useGroceriesDemo();
  
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custNotes, setCustNotes] = useState('');

  if (!isCartDrawerOpen) return null;

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const processWhatsAppCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang belanja Anda masih kosong!");
      return;
    }
    if (!custName || !custAddress) {
      alert("Harap isi Nama Penerima dan Alamat Lengkap untuk logistik pengiriman.");
      return;
    }

    let msg = `*HALO ${client.name.toUpperCase()} - ORDER BARU*%0A`;
    msg += `============================%0A`;
    msg += `*DETAIL PENERIMA & LOGISTIK:*%0A`;
    msg += `👤 Nama: ${encodeURIComponent(custName)}%0A`;
    msg += `📍 Alamat: ${encodeURIComponent(custAddress)}%0A`;
    if (custNotes) msg += `📝 Catatan: ${encodeURIComponent(custNotes)}%0A`;
    msg += `============================%0A`;
    msg += `*RINGKASAN PESANAN:*%0A`;
    
    cart.forEach(item => {
      msg += `- ${item.product.name} (${item.selectedVariant}) x${item.quantity} = ${formatIDR(item.totalPrice)}%0A`;
    });
    
    msg += `============================%0A`;
    msg += `*TOTAL: ${formatIDR(cartTotal)}*%0A`;
    msg += `%0AMohon info ketersediaan stok & total ongkos kirim. Terima kasih!`;

    window.open(`https://wa.me/${client.waNumber}?text=${msg}`, '_blank');
    clearCart();
    setIsCartDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartDrawerOpen(false)}></div>
      
      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Cart Top Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--theme-color)] text-amber-300 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <h2 className="text-base font-bold text-zinc-900">Keranjang Belanja</h2>
            </div>
            <button onClick={() => setIsCartDrawerOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-700 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-400 text-center space-y-2">
                <svg className="w-12 h-12 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path><path d="M12 16v1a2 2 0 0 1-2 2H6m-2-5v-1"></path><path d="m22 2-2 2-2-2-2 2-2-2"></path></svg>
                <p className="text-sm font-medium">Keranjang masih kosong</p>
                <button onClick={() => setIsCartDrawerOpen(false)} className="text-xs text-[var(--theme-color)] font-bold underline cursor-pointer">Mulai Eksplorasi Pangan</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={`${item.id}-${item.selectedVariant}`} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200">
                  <img src={item.product.imageUrl || getGroceryPlaceholderImage(item.product.id)} className="w-14 h-16 rounded-xl object-cover border border-zinc-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-zinc-400">{item.selectedVariant}</p>
                    <p className="text-xs font-bold text-[var(--theme-color)] mt-1">{formatIDR(item.totalPrice / item.quantity)}</p>
                  </div>
                  <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 p-1">
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-5 h-5 rounded bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer">-</button>
                    <span className="w-6 text-center text-xs font-bold text-zinc-800">{item.quantity}</span>
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-5 h-5 rounded bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout & Logistics Section */}
          <div className="p-6 border-t border-zinc-200 bg-[#FBF9F5] space-y-4">
            
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider block">Informasi Pengiriman</span>
              <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Nama Penerima" className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:ring-1 focus:ring-[var(--theme-color)] focus:outline-none" />
              <textarea rows={2} value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Alamat Rinci & Nomor Rumah" className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:ring-1 focus:ring-[var(--theme-color)] focus:outline-none"></textarea>
              <input type="text" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Catatan Kurir (misal: Titip pos satpam)" className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:ring-1 focus:ring-[var(--theme-color)] focus:outline-none" />
            </div>

            {/* Total Calculation Summary */}
            <div className="pt-2 border-t border-zinc-200 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal Produk</span>
                <span>{formatIDR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Kurir Cold-Pack</span>
                <span className="text-emerald-700 font-semibold">Termasuk (Gratis)</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Akhir</span>
                <span className="text-[var(--theme-color)]">{formatIDR(cartTotal)}</span>
              </div>
            </div>

            {/* Conversion Button: WhatsApp Checkout */}
            <button onClick={processWhatsAppCheckout} className="w-full py-3.5 px-4 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-amber-200 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[var(--theme-color)]/30 transition flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Kirim Order ke WhatsApp Toko
            </button>
            
            <p className="text-[10px] text-center text-zinc-400">Order akan diproses oleh tim panen kami seketika chat terkirim.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
