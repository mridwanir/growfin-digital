import { useState } from 'react';
import { useCafeDemo } from './CafeDemoContext';
import { Trash2 } from 'lucide-react';

export function CheckoutModal() {
  const { client, 
    isCartModalOpen, 
    setIsCartModalOpen, 
    cart, 
    updateCartItemQuantity, 
    removeFromCart, 
    cartTotal } = useCafeDemo();

  // Contextual Form State
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState(''); // DINE_IN
  const [orderType, setOrderType] = useState<'TAKEAWAY' | 'DELIVERY'>('TAKEAWAY'); // QUICK_SERVICE
  const [address, setAddress] = useState(''); // QUICK_SERVICE (DELIVERY)
  const [pickupDate, setPickupDate] = useState(''); // PRE_ORDER
  const [greetingText, setGreetingText] = useState(''); // PRE_ORDER

  if (!isCartModalOpen) return null;

  const generateWhatsAppUrl = () => {
    let message = `Halo ${client.name}, saya ingin memesan:\n\n`;
    
    // Items
    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.product.name}* (x${item.quantity})\n`;
      
      const variantEntries = Object.entries(item.selectedVariants);
      if (variantEntries.length > 0) {
        message += `   Variasi: ${variantEntries.map(([k,v]) => `${k}: ${v}`).join(', ')}\n`;
      }
      
      if (item.selectedAddons.length > 0) {
        message += `   Tambahan: ${item.selectedAddons.join(', ')}\n`;
      }
      
      if (item.notes) {
        message += `   Catatan: _${item.notes}_\n`;
      }
      
      message += `   Harga: Rp ${item.totalPrice.toLocaleString('id-ID')}\n\n`;
    });

    message += `*Total: Rp ${cartTotal.toLocaleString('id-ID')}*\n\n`;
    message += `*Data Pemesan:*\n- Nama: ${customerName || '-'}\n`;

    // Contextual Data
    if (client.fbType === 'DINE_IN') {
      message += `- Tipe: Makan di Tempat\n`;
      message += `- No. Meja: ${tableNumber || 'Belum pilih'}\n`;
    } else if (client.fbType === 'QUICK_SERVICE') {
      message += `- Tipe: ${orderType === 'TAKEAWAY' ? 'Bungkus / Ambil Sendiri' : 'Kirim (Delivery)'}\n`;
      if (orderType === 'DELIVERY') {
        message += `- Alamat: ${address || '-'}\n`;
      }
    } else if (client.fbType === 'PRE_ORDER') {
      message += `- Tipe: Pre-Order\n`;
      message += `- Tanggal Pengambilan: ${pickupDate || '-'}\n`;
      if (greetingText) {
        message += `- Teks Ucapan Tambahan: "${greetingText}"\n`;
      }
    }

    return `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900">Pesanan Anda</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">Keranjang Belanja</p>
          </div>
          <button 
            onClick={() => setIsCartModalOpen(false)}
            className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* Empty State */}
          {cart.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-sm font-bold text-slate-900">Keranjang masih kosong</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 relative group">
                    <button onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-rose-100 text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {item.product.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{item.product.name}</h4>
                      
                      <div className="text-[10px] text-slate-500 mb-2 space-y-0.5">
                        {Object.entries(item.selectedVariants).map(([k,v]) => (
                          <div key={k}><span className="font-bold">{k}:</span> {v}</div>
                        ))}
                        {item.selectedAddons.length > 0 && (
                          <div><span className="font-bold">Tambahan:</span> {item.selectedAddons.join(', ')}</div>
                        )}
                        {item.notes && (
                          <div className="italic">"{item.notes}"</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">Rp {item.totalPrice.toLocaleString('id-ID')}</span>
                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-0.5">
                          <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-white rounded flex items-center justify-center font-black shadow-sm text-slate-600">-</button>
                          <span className="w-4 text-center text-xs font-black">{item.quantity}</span>
                          <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-white rounded flex items-center justify-center font-black shadow-sm text-slate-600">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Form Contextual */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 border-b border-slate-100 pb-2">Detail Pemesan</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Pemesan</label>
                  <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" placeholder="Contoh: Budi" />
                </div>

                {client.fbType === 'DINE_IN' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nomor Meja (Opsional)</label>
                    <input type="text" value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" placeholder="Contoh: Meja 12" />
                  </div>
                )}

                {client.fbType === 'QUICK_SERVICE' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Metode Pesanan</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setOrderType('TAKEAWAY')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${orderType === 'TAKEAWAY' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Bungkus / Ambil</button>
                        <button onClick={() => setOrderType('DELIVERY')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${orderType === 'DELIVERY' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Delivery</button>
                      </div>
                    </div>
                    {orderType === 'DELIVERY' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Alamat Pengiriman</label>
                        <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" placeholder="Detail alamat lengkap..." />
                      </div>
                    )}
                  </>
                )}

                {client.fbType === 'PRE_ORDER' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal & Waktu Pengambilan</label>
                      <input type="datetime-local" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Teks Ucapan di Kue/Kartu (Opsional)</label>
                      <textarea value={greetingText} onChange={e => setGreetingText(e.target.value)} rows={2} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" placeholder="Contoh: Happy Birthday Ayah!" />
                    </div>
                  </>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-500">Total Harga</span>
              <span className="font-black text-slate-900 text-lg">Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <a 
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsCartModalOpen(false)}
              className={`w-full py-3.5 rounded-xl text-center font-bold text-white transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-hover`}
            >
              Kirim Pesanan ke WhatsApp ➔
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
