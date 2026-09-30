'use client';

import { useGroceriesDemo, getGroceryPlaceholderImage } from '../core/GroceriesContext';
import { useState } from 'react';

export function GroceriesCartDrawer() {
  const { client, isCartDrawerOpen, setIsCartDrawerOpen, cart, cartTotal, updateCartItemQuantity, clearCart } = useGroceriesDemo();
  
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
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
    msg += `📞 HP: ${encodeURIComponent(custPhone)}%0A`;
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartDrawerOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Cart Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--theme-color)]" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
              <h2 className="text-lg font-extrabold text-zinc-900">Keranjang Belanja</h2>
            </div>
            <button onClick={() => setIsCartDrawerOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
            </button>
          </div>

          {/* Cart Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {cart.length === 0 ? (
              <div className="h-full min-h-[16rem] flex flex-col items-center justify-center text-center text-zinc-400">
                <svg className="w-12 h-12 mb-2 text-zinc-300" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
                <p className="text-sm font-semibold text-zinc-600">Tas belanja Anda masih kosong</p>
                <p className="text-xs text-zinc-400 mt-1">Pilih produk favorit Anda dari katalog etalase.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={`${item.id}-${item.selectedVariant}`} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <img src={item.product.imageUrl || getGroceryPlaceholderImage(item.product.id)} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-zinc-500 block">{item.selectedVariant}</span>
                    <span className="text-xs font-black text-[var(--theme-color)] mt-1 block">{formatIDR(item.totalPrice / item.quantity)}</span>
                  </div>
                  <div className="flex items-center border border-zinc-200 bg-white rounded-lg overflow-hidden">
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-bold text-xs">-</button>
                    <span className="w-7 text-center text-xs font-bold text-zinc-800">{item.quantity}</span>
                    <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-bold text-xs">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Logistics Checkout Form Section */}
          <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-zinc-600">
              <span>Total Tagihan:</span>
              <span className="text-xl font-black text-[var(--theme-color)]">{formatIDR(cartTotal)}</span>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase">Informasi Logistik & Pengiriman</label>
              
              <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Nama Penerima" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]" />
              
              <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="No. WhatsApp / HP" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]" />

              <textarea rows={2} value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Alamat Lengkap (No Rumah, Blok, Patokan)" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]"></textarea>

              <input type="text" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Catatan Tambahan" className="w-full px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]" />
            </div>

            <button onClick={processWhatsAppCheckout} className="w-full mt-3 py-3 px-4 rounded-xl bg-[var(--theme-color)] hover:brightness-110 text-white font-bold flex items-center justify-center gap-2 transition shadow-md shadow-[var(--theme-color)]/20 cursor-pointer text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23-7.7,11.55a8,8,0,0,0-.82,8.69,56.55,56.55,0,0,0,24,24,8,8,0,0,0,8.69-.82l11.55-7.7,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-1.08L48,213l9.83-29.49a8,8,0,0,0-1.08-6.54A88,88,0,1,1,128,216Z"></path></svg>
              <span>Checkout ke WhatsApp Admin</span>
            </button>
            <p className="text-[10px] text-center text-zinc-400">Ringkasan order dan format invoice akan disusun otomatis.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
