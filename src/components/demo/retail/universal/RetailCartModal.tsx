'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

import { formatVariantOptionDisplay } from '@/lib/catalog'

import {
  useRetailDemo,
  type FulfillmentMode,
  getRetailPlaceholderImage,
} from '../core/RetailDemoContext'

export function RetailCartModal() {
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
    setDeliveryAddress,
  } = useRetailDemo()

  const [customerName, setCustomerName] = useState('')

  if (!isCartModalOpen) return null

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  const getFulfillmentText = (mode: FulfillmentMode) => {
    switch (mode) {
      case 'PICKUP':
        return 'Ambil di Toko / Datang Langsung'
      case 'DELIVERY':
        return 'Pengiriman Instan / Kurir Lokal'
      case 'HOME_SERVICE':
        return 'Layanan Antar-Jemput / Home Service'
    }
  }

  const handleSendWA = () => {
    let message = `Halo ${client.name}, saya ingin order:\n\n`

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}* (x${item.quantity})\n`

      const variantEntries = Object.entries(item.selectedVariants || {})
      if (variantEntries.length > 0) {
        const variantsText = variantEntries
          .map(([k, v]) => formatVariantOptionDisplay(k, v))
          .join(', ')
        message += `   Varian: ${variantsText}\n`
      }
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        message += `   Tambahan: ${item.selectedAddons.join(', ')}\n`
      }
      if (item.notes) {
        message += `   Catatan: _"${item.notes}"_\n`
      }
    })

    message += `\n*Metode*: ${getFulfillmentText(fulfillmentMode)}`
    if (fulfillmentMode !== 'PICKUP' && deliveryAddress) {
      message += `\n*Alamat*: ${deliveryAddress}`
    }
    if (customerName) {
      message += `\n*Nama Pemesan*: ${customerName}`
    }

    message += `\n\nMohon info ketersediaan dan total pembayarannya. Terima kasih!`

    const waUrl = `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartModalOpen(false)}
      />

      <div className="animate-in slide-in-from-bottom-10 sm:zoom-in-95 relative flex max-h-[90vh] w-full max-w-lg transform flex-col overflow-hidden rounded-t-3xl bg-slate-50 shadow-2xl transition-all duration-300 sm:rounded-3xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-xl font-black text-slate-900">Keranjang Belanja</h2>
          <button
            onClick={() => setIsCartModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="py-10 text-center">
              <p className="mt-4 mb-2 font-bold text-slate-500">Keranjang masih kosong</p>
              <button
                onClick={() => setIsCartModalOpen(false)}
                className="text-brand-primary text-sm font-bold"
              >
                Kembali Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.imageUrl || getRetailPlaceholderImage(item.product.id)}
                      alt={item.product.name}
                      className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 truncate leading-tight font-bold text-slate-900">
                        {item.product.name}
                      </h3>
                      <p className="text-brand-primary mb-2 text-sm font-bold">
                        {formatRupiah(item.totalPrice / item.quantity)}
                      </p>

                      <div className="mb-3 space-y-0.5 text-xs text-slate-500">
                        {Object.entries(item.selectedVariants || {}).map(([k, v]) => (
                          <p key={k}>{formatVariantOptionDisplay(k, v)}</p>
                        ))}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p>
                            <span className="font-medium text-slate-600">Tambahan:</span>{' '}
                            {item.selectedAddons.join(', ')}
                          </p>
                        )}
                        {item.notes && <p className="italic">"{item.notes}"</p>}
                      </div>

                      <div className="flex inline-flex items-center gap-3 rounded-full bg-slate-50 p-1">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="hover:text-brand-primary flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-slate-600 shadow"
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-sm font-black text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="hover:text-brand-primary flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-slate-600 shadow"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fulfillment Switcher */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <h3 className="mb-3 font-bold text-slate-900">Metode Pengiriman / Layanan</h3>
                <div className="grid grid-cols-1 gap-2">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${fulfillmentMode === 'PICKUP' ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={fulfillmentMode === 'PICKUP'}
                      onChange={() => setFulfillmentMode('PICKUP')}
                      className="accent-brand-primary h-4 w-4"
                    />
                    <div>
                      <span className="block text-sm font-bold text-slate-900">
                        Ambil di Toko / Walk-in
                      </span>
                      <span className="block text-xs text-slate-500">
                        Datang langsung ke lokasi kami
                      </span>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${fulfillmentMode === 'DELIVERY' ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={fulfillmentMode === 'DELIVERY'}
                      onChange={() => setFulfillmentMode('DELIVERY')}
                      className="accent-brand-primary h-4 w-4"
                    />
                    <div>
                      <span className="block text-sm font-bold text-slate-900">
                        Pengiriman Instan (Delivery)
                      </span>
                      <span className="block text-xs text-slate-500">
                        Dikirim via kurir lokal/ojol
                      </span>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${fulfillmentMode === 'HOME_SERVICE' ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={fulfillmentMode === 'HOME_SERVICE'}
                      onChange={() => setFulfillmentMode('HOME_SERVICE')}
                      className="accent-brand-primary h-4 w-4"
                    />
                    <div>
                      <span className="block text-sm font-bold text-slate-900">
                        Home Service (Panggilan)
                      </span>
                      <span className="block text-xs text-slate-500">
                        Tim kami datang ke lokasi Anda
                      </span>
                    </div>
                  </label>
                </div>

                {fulfillmentMode !== 'PICKUP' && (
                  <div className="animate-in fade-in zoom-in-95 mt-4 duration-200">
                    <label className="mb-1 block text-sm font-bold text-slate-700">
                      Alamat Lengkap / Patokan
                    </label>
                    <textarea
                      placeholder="Masukkan alamat lengkap..."
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="focus:border-brand-primary focus:ring-brand-primary min-h-[80px] w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-1 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <label className="mb-1 block text-sm font-bold text-slate-700">Nama Pemesan</label>
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="focus:border-brand-primary focus:ring-brand-primary w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-1 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 bg-white p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Subtotal Estimasi</span>
              <span className="text-lg font-black text-slate-900">{formatRupiah(cartTotal)}</span>
            </div>
            <button
              onClick={handleSendWA}
              data-track="whatsapp"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 font-black text-white shadow-lg shadow-emerald-500/25 transition-transform hover:bg-emerald-600 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Order via WhatsApp</span>
            </button>
            <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
              Pembayaran dan ongkir dikonfirmasi via WA
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
