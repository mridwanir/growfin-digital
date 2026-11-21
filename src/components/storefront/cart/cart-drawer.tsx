'use client'

import { cn } from 'cn'
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, XIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { trackEvent } from '@/lib/analytics'

import {
  formatCurrency,
  useCartActions,
  useCartItems,
  useCartStoreApi,
  useCartTotal,
} from '@/lib/storefront/cart'
import { buildOrderSummary, FulfillmentSchema } from '@/lib/storefront/whatsapp'

export interface StorefrontCartDrawerProps {
  initialAddress?: string
  initialCustomerName?: string
  initialErrors?: Record<string, string>
  initialFulfillmentMode?: string
  initialPickupPreferences?: string
  onOpenChange: (open: boolean) => void
  initialTableNumber?: string
  open: boolean
  tenant: {
    name: string
    fulfillmentModes?: ReadonlyArray<'DELIVERY' | 'DINE_IN' | 'PICKUP' | 'TAKEAWAY'>
    phone?: string | null
    waNumber?: string | null
  }
}

export function StorefrontCartDrawer(props: StorefrontCartDrawerProps) {
  const {
    initialAddress,
    initialCustomerName,
    initialErrors,
    initialFulfillmentMode,
    initialPickupPreferences,
    initialTableNumber,
    onOpenChange,
    open,
    tenant,
  } = props

  const items = useCartItems()
  const total = useCartTotal()
  const store = useCartStoreApi()
  const { removeItem, updateQuantity } = useCartActions()

  const availableModes = useMemo(() => {
    if (tenant.fulfillmentModes && tenant.fulfillmentModes.length > 0) {
      return tenant.fulfillmentModes
    }
    return ['DINE_IN', 'TAKEAWAY', 'PICKUP', 'DELIVERY'] as const
  }, [tenant.fulfillmentModes])

  const [fulfillmentMode, setFulfillmentMode] = useState<string>(
    () => initialFulfillmentMode ?? availableModes[0] ?? 'DINE_IN',
  )
  const [customerName, setCustomerName] = useState(() => initialCustomerName ?? '')
  const [tableNumber, setTableNumber] = useState(() => initialTableNumber ?? '')
  const [pickupPreferences, setPickupPreferences] = useState(() => initialPickupPreferences ?? '')
  const [address, setAddress] = useState(() => initialAddress ?? '')
  const [errors, setErrors] = useState<Record<string, string>>(() => initialErrors ?? {})
  useEffect(() => {
    if (open) {
      trackEvent('checkout_start')
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleIncrement = (itemKey: string, fallbackQty: number) => {
    const currentItem = store
      .getState()
      .items.find(i => (i.hash && i.hash === itemKey) || i.id === itemKey)
    const currentQty = currentItem?.quantity ?? fallbackQty
    updateQuantity(itemKey, currentQty + 1)
  }

  const handleDecrement = (itemKey: string, fallbackQty: number) => {
    const currentItem = store
      .getState()
      .items.find(i => (i.hash && i.hash === itemKey) || i.id === itemKey)
    const currentQty = currentItem?.quantity ?? fallbackQty
    updateQuantity(itemKey, currentQty - 1)
  }

  const handleCheckout = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()

    let fulfillmentPayload: unknown
    switch (fulfillmentMode) {
      case 'DINE_IN':
        fulfillmentPayload = { customerName, mode: 'DINE_IN', tableNumber }
        break
      case 'TAKEAWAY':
        fulfillmentPayload = {
          customerName,
          mode: 'TAKEAWAY',
          ...(pickupPreferences.trim() ? { pickupPreferences: pickupPreferences.trim() } : {}),
        }
        break
      case 'PICKUP':
        fulfillmentPayload = {
          customerName,
          mode: 'PICKUP',
          ...(pickupPreferences.trim() ? { pickupPreferences: pickupPreferences.trim() } : {}),
        }
        break
      case 'DELIVERY':
        fulfillmentPayload = { address, customerName, mode: 'DELIVERY' }
        break
      default:
        fulfillmentPayload = { customerName, mode: fulfillmentMode }
    }

    const parseResult = FulfillmentSchema.safeParse(fulfillmentPayload)
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parseResult.error.issues) {
        const field = issue.path[0] as string
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    const { waUrl } = buildOrderSummary({
      cartItems: items,
      fulfillment: parseResult.data,
      tenant,
    })
    trackEvent('checkout_complete', {
      fulfillmentMode: parseResult.data.mode,
      itemCount: items.length,
      total,
    })

    if (typeof window !== 'undefined' && window.open) {
      window.open(waUrl, '_blank')
    }
  }

  const drawerElement = (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      data-slot="cart-drawer"
      role="dialog"
    >
      <div
        className="bg-card text-card-foreground relative flex size-full max-w-md flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="text-primary size-5" />
            <h2 className="text-foreground text-lg font-bold">Keranjang Belanja</h2>
          </div>
          <button
            aria-label="Tutup keranjang belanja"
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors"
            data-slot="cart-close-button"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Empty state or item list */}
        {items.length === 0 ? (
          <div
            className="flex flex-1 flex-col items-center justify-center p-8 text-center"
            data-slot="cart-empty-state"
          >
            <div className="bg-muted/60 text-muted-foreground mb-4 flex size-20 items-center justify-center rounded-full">
              <ShoppingBagIcon className="size-10 opacity-60" />
            </div>
            <h3 className="text-foreground text-lg font-bold">Keranjang Belanja Kosong</h3>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
              Belum ada produk di keranjang Anda. Jelajahi menu dan tambahkan item favorit Anda!
            </p>
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-xs transition-colors"
              data-slot="cart-empty-close"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <>
            {/* Line items list */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map(item => {
                const itemKey = item.hash || item.id
                return (
                  <div
                    key={itemKey}
                    className="border-border bg-background flex flex-col gap-2 rounded-xl border p-3.5 shadow-2xs"
                    data-slot="cart-item-row"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-foreground text-sm leading-snug font-semibold">
                        {item.name}
                      </div>
                      <button
                        aria-label="Hapus item"
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        data-slot="cart-item-remove"
                        type="button"
                        onClick={() => removeItem(itemKey)}
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>

                    {/* Variants */}
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-muted-foreground space-y-0.5 text-xs">
                        {Object.entries(item.selectedVariants).map(([varName, optLabel]) => (
                          <div key={varName}>{`${varName}: ${optLabel}`}</div>
                        ))}
                      </div>
                    )}

                    {/* Addons */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="text-muted-foreground text-xs">
                        {item.selectedAddons.map(addon => (
                          <div key={addon}>{addon}</div>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="text-muted-foreground/80 text-xs italic">{item.notes}</div>
                    )}

                    {/* Quantity controls and subtotal */}
                    <div className="border-border/50 flex items-center justify-between border-t pt-2">
                      <div
                        className="flex items-center gap-2"
                        data-slot="cart-item-quantity-stepper"
                      >
                        <button
                          aria-label="Kurangi kuantitas"
                          className="border-border bg-background text-foreground hover:bg-muted flex size-7 items-center justify-center rounded-md border"
                          data-slot="cart-item-decrement"
                          type="button"
                          onClick={() => handleDecrement(itemKey, item.quantity)}
                        >
                          <MinusIcon className="size-3" />
                        </button>
                        <span className="text-foreground w-6 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Tambah kuantitas"
                          className="border-border bg-background text-foreground hover:bg-muted flex size-7 items-center justify-center rounded-md border"
                          data-slot="cart-item-increment"
                          type="button"
                          onClick={() => handleIncrement(itemKey, item.quantity)}
                        >
                          <PlusIcon className="size-3" />
                        </button>
                      </div>
                      <div className="text-foreground text-sm font-bold">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Fulfillment form section */}
            <div className="border-border bg-muted/20 space-y-3 border-t p-4">
              {/* Fulfillment mode selector */}
              <div className="space-y-1.5" data-slot="cart-fulfillment-mode-selector">
                <label className="text-foreground text-xs font-semibold">Metode Pemesanan</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableModes.map(mode => {
                    const isSelected = fulfillmentMode === mode
                    const modeLabel =
                      mode === 'DINE_IN'
                        ? 'Dine In'
                        : mode === 'TAKEAWAY'
                          ? 'Takeaway'
                          : mode === 'PICKUP'
                            ? 'Pickup'
                            : 'Delivery'
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setFulfillmentMode(mode)
                          setErrors({})
                        }}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-center text-xs font-medium transition-colors',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground font-semibold'
                            : 'border-border bg-background text-foreground hover:bg-muted',
                        )}
                      >
                        {modeLabel}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Customer Name input */}
              <div className="space-y-1">
                <label
                  className="text-foreground text-xs font-semibold"
                  htmlFor="cart-customer-name"
                >
                  Nama Pemesan <span className="text-destructive">*</span>
                </label>
                <input
                  id="cart-customer-name"
                  placeholder="Nama Anda"
                  type="text"
                  value={customerName}
                  onChange={e => {
                    setCustomerName(e.target.value)
                    if (errors.customerName) {
                      setErrors(prev => {
                        const next = { ...prev }
                        delete next.customerName
                        return next
                      })
                    }
                  }}
                  className={cn(
                    'bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none',
                    errors.customerName ? 'border-destructive' : 'border-border',
                  )}
                />
                {errors.customerName && (
                  <p className="text-destructive text-xs">{errors.customerName}</p>
                )}
              </div>

              {/* Table number for DINE_IN */}
              {fulfillmentMode === 'DINE_IN' && (
                <div className="space-y-1">
                  <label
                    className="text-foreground text-xs font-semibold"
                    htmlFor="cart-table-number"
                  >
                    Nomor Meja <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="cart-table-number"
                    placeholder="Contoh: Meja 12"
                    type="text"
                    value={tableNumber}
                    onChange={e => {
                      setTableNumber(e.target.value)
                      if (errors.tableNumber) {
                        setErrors(prev => {
                          const next = { ...prev }
                          delete next.tableNumber
                          return next
                        })
                      }
                    }}
                    className={cn(
                      'bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none',
                      errors.tableNumber ? 'border-destructive' : 'border-border',
                    )}
                  />
                  {errors.tableNumber && (
                    <p className="text-destructive text-xs">{errors.tableNumber}</p>
                  )}
                </div>
              )}
              {/* Pickup Preferences for TAKEAWAY and PICKUP */}
              {(fulfillmentMode === 'TAKEAWAY' || fulfillmentMode === 'PICKUP') && (
                <div className="space-y-1">
                  <label
                    className="text-foreground text-xs font-semibold"
                    htmlFor="cart-pickup-preferences"
                  >
                    Preferensi Pengambilan <span className="text-muted-foreground font-normal">(opsional)</span>
                  </label>
                  <input
                    className="bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary border-border w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    id="cart-pickup-preferences"
                    placeholder="Contoh: Diambil jam 14.00, tanpa sedotan"
                    type="text"
                    value={pickupPreferences}
                    onChange={e => setPickupPreferences(e.target.value)}
                  />
                </div>
              )}


              {/* Address for DELIVERY */}
              {fulfillmentMode === 'DELIVERY' && (
                <div className="space-y-1">
                  <label
                    className="text-foreground text-xs font-semibold"
                    htmlFor="cart-delivery-address"
                  >
                    Alamat Pengiriman <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="cart-delivery-address"
                    placeholder="Alamat pengiriman lengkap"
                    rows={2}
                    value={address}
                    onChange={e => {
                      setAddress(e.target.value)
                      if (errors.address) {
                        setErrors(prev => {
                          const next = { ...prev }
                          delete next.address
                          return next
                        })
                      }
                    }}
                    className={cn(
                      'bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none',
                      errors.address ? 'border-destructive' : 'border-border',
                    )}
                  />
                  {errors.address && <p className="text-destructive text-xs">{errors.address}</p>}
                </div>
              )}
            </div>

            {/* Total and checkout button */}
            <div className="border-border bg-background space-y-3 border-t p-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-foreground font-semibold">Total Pesanan</span>
                <span className="text-foreground text-lg font-bold" data-slot="cart-subtotal">
                  {formatCurrency(total)}
                </span>
              </div>
              <button
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl px-4 py-3 font-semibold shadow-xs transition-colors"
                data-slot="cart-checkout-button"
                type="button"
                onClick={handleCheckout}
              >
                Pesan via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return drawerElement
}
