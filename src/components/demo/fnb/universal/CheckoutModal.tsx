import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { formatVariantOptionDisplay } from '@/lib/catalog'

import { useFnbDemo } from '../core/FnbDemoContext'

const CAFE_MENU_IMAGES = [
  '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/fnb/mahesa-tyo-X0HP9m0euz0-unsplash.jpg',
]

export function CheckoutModal() {
  const {
    client,
    isCartModalOpen,
    setIsCartModalOpen,
    cart,
    updateCartItemQuantity,
    removeFromCart,
    cartTotal,
  } = useFnbDemo()

  // Contextual Form State
  const [customerName, setCustomerName] = useState('')
  const [tableNumber, setTableNumber] = useState('') // DINE_IN
  const [orderType, setOrderType] = useState<'TAKEAWAY' | 'DELIVERY'>('TAKEAWAY') // QUICK_SERVICE
  const [address, setAddress] = useState('') // QUICK_SERVICE (DELIVERY)
  const [pickupDate, setPickupDate] = useState('') // PRE_ORDER
  const [greetingText, setGreetingText] = useState('') // PRE_ORDER

  if (!isCartModalOpen) return null

  const getMenuImageUrl = (id: number | string) => {
    return CAFE_MENU_IMAGES[(Number(id) || 0) % CAFE_MENU_IMAGES.length]
  }

  const generateWhatsAppUrl = () => {
    let message = `Halo ${client.name}, saya ingin memesan:\n\n`

    // Items
    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.product.name}* (x${item.quantity})\n`

      const variantEntries = Object.entries(item.selectedVariants || {})
      if (variantEntries.length > 0) {
        const variantsText = variantEntries
          .map(([k, v]) => formatVariantOptionDisplay(k, v))
          .join(', ')
        message += `   Variasi: ${variantsText}\n`
      }

      if (item.selectedAddons.length > 0) {
        message += `   Tambahan: ${item.selectedAddons.join(', ')}\n`
      }

      if (item.notes) {
        message += `   Catatan: _${item.notes}_\n`
      }

      message += `   Harga: Rp ${item.totalPrice.toLocaleString('id-ID')}\n\n`
    })

    message += `*Total: Rp ${cartTotal.toLocaleString('id-ID')}*\n\n`
    message += `*Data Pemesan:*\n- Nama: ${customerName || '-'}\n`

    // Contextual Data
    if (client.fbType === 'DINE_IN') {
      message += `- Tipe: Makan di Tempat\n`
      message += `- No. Meja: ${tableNumber || 'Belum pilih'}\n`
    } else if (client.fbType === 'QUICK_SERVICE') {
      message += `- Tipe: ${orderType === 'TAKEAWAY' ? 'Bungkus / Ambil Sendiri' : 'Kirim (Delivery)'}\n`
      if (orderType === 'DELIVERY') {
        message += `- Alamat: ${address || '-'}\n`
      }
    } else if (client.fbType === 'PRE_ORDER') {
      message += `- Tipe: Pre-Order\n`
      message += `- Tanggal Pengambilan: ${pickupDate || '-'}\n`
      if (greetingText) {
        message += `- Teks Ucapan Tambahan: "${greetingText}"\n`
      }
    }

    return `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-slate-50 shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white p-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Pesanan Anda</h2>
            <p className="mt-0.5 text-xs font-bold text-slate-400">Keranjang Belanja</p>
          </div>
          <button
            onClick={() => setIsCartModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 transition-colors hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* Empty State */}
          {cart.length === 0 ? (
            <div className="py-10 text-center opacity-50">
              <div className="mb-4 text-5xl">🛒</div>
              <p className="text-sm font-bold text-slate-900">Keranjang masih kosong</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="group relative flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMenuImageUrl(item.product.id)}
                      alt={item.product.name}
                      className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="mb-1 text-sm font-bold text-slate-900">{item.product.name}</h4>

                      <div className="mb-2 space-y-0.5 text-[10px] text-slate-500">
                        {Object.entries(item.selectedVariants || {}).map(([k, v]) => (
                          <div key={k}>{formatVariantOptionDisplay(k, v)}</div>
                        ))}
                        {item.selectedAddons.length > 0 && (
                          <div>
                            <span className="font-bold">Tambahan:</span>{' '}
                            {item.selectedAddons.join(', ')}
                          </div>
                        )}
                        {item.notes && <div className="italic">"{item.notes}"</div>}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">
                          Rp {item.totalPrice.toLocaleString('id-ID')}
                        </span>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-0.5">
                          <button
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded bg-white font-black text-slate-600 shadow-sm"
                          >
                            -
                          </button>
                          <span className="w-4 text-center text-xs font-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded bg-white font-black text-slate-600 shadow-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Form Contextual */}
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="border-b border-slate-100 pb-2 font-black text-slate-900">
                  Detail Pemesan
                </h3>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">
                    Nama Pemesan
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="Contoh: Budi"
                  />
                </div>

                {client.fbType === 'DINE_IN' && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500">
                      Nomor Meja (Opsional)
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-amber-400 focus:outline-none"
                      placeholder="Contoh: Meja 12"
                    />
                  </div>
                )}

                {client.fbType === 'QUICK_SERVICE' && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Metode Pesanan
                      </label>
                      <div className="flex rounded-xl bg-slate-100 p-1">
                        <button
                          onClick={() => setOrderType('TAKEAWAY')}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${orderType === 'TAKEAWAY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Bungkus / Ambil
                        </button>
                        <button
                          onClick={() => setOrderType('DELIVERY')}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${orderType === 'DELIVERY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Delivery
                        </button>
                      </div>
                    </div>
                    {orderType === 'DELIVERY' && (
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-500">
                          Alamat Pengiriman
                        </label>
                        <textarea
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-amber-400 focus:outline-none"
                          placeholder="Detail alamat lengkap..."
                        />
                      </div>
                    )}
                  </>
                )}

                {client.fbType === 'PRE_ORDER' && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Tanggal & Waktu Pengambilan
                      </label>
                      <input
                        type="datetime-local"
                        value={pickupDate}
                        onChange={e => setPickupDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Teks Ucapan di Kue/Kartu (Opsional)
                      </label>
                      <textarea
                        value={greetingText}
                        onChange={e => setGreetingText(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-amber-400 focus:outline-none"
                        placeholder="Contoh: Happy Birthday Ayah!"
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="relative z-10 flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-500">Total Harga</span>
              <span className="text-lg font-black text-slate-900">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp"
              onClick={() => setIsCartModalOpen(false)}
              className={`bg-brand-primary hover:bg-brand-hover flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-center font-bold text-white shadow-md transition-transform active:scale-95`}
            >
              Kirim Pesanan ke WhatsApp ➔
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
