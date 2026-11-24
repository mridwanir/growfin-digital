'use client'

import type { FulfillmentInput } from '@/lib/storefront/whatsapp'

import {
  ArrowLeft,
  Check,
  CheckCheck,
  ExternalLink,
  MessageCircle,
  Minus,
  Percent,
  Phone,
  Plus,
  Receipt,
  RotateCcw,
  SlidersHorizontal,
  Store,
  Video,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/storefront/currency'
import { buildOrderSummary } from '@/lib/storefront/whatsapp'
import { cn } from '@/lib/utils'

export interface WhatsAppSimulatorProps {
  className?: string
}

interface ModifierOption {
  id: string
  name: string
  price: number
  selected: boolean
}

interface SimulatorCartItem {
  id: string
  productId: string
  name: string
  basePrice: number
  quantity: number
  modifiers: ModifierOption[]
}

const INITIAL_ITEMS: SimulatorCartItem[] = [
  {
    id: 'item-1',
    name: 'Es Kopi Susu Aren',
    basePrice: 18000,
    productId: 'prod-es-kopi-aren',
    quantity: 1,
    modifiers: [
      {
        id: 'extraShot',
        name: 'Extra Espresso Shot',
        price: 4000,
        selected: false,
      },
      {
        id: 'oatMilk',
        name: 'Susu Oat',
        price: 6000,
        selected: false,
      },
    ],
  },
  {
    id: 'item-2',
    name: 'Croissant Cokelat Mentega',
    basePrice: 24000,
    productId: 'prod-croissant-cokelat',
    quantity: 1,
    modifiers: [
      {
        id: 'warmed',
        name: 'Hangatkan Croissant',
        price: 0,
        selected: true,
      },
      {
        id: 'extraButter',
        name: 'Mentega Tambahan',
        price: 5000,
        selected: false,
      },
    ],
  },
]

export function WhatsAppSimulator({ className }: WhatsAppSimulatorProps) {
  const [items, setItems] = useState<SimulatorCartItem[]>(INITIAL_ITEMS)
  const [customerName, setCustomerName] = useState('Budi Santoso')
  const [fulfillmentMode, setFulfillmentMode] = useState<'TAKEAWAY' | 'DINE_IN'>('TAKEAWAY')
  const [activeView, setActiveView] = useState<'cart' | 'chat'>('cart')
  const [copied, setCopied] = useState(false)

  const tenantName = 'Kopi Sudut Senja'
  const tenantPhone = '081234567890'

  function updateQuantity(itemId: string, delta: number) {
    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id !== itemId) return item
        const nextQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: nextQty }
      }),
    )
  }

  function toggleModifier(itemId: string, modifierId: string) {
    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id !== itemId) return item
        const updatedModifiers = item.modifiers.map(mod => {
          if (mod.id !== modifierId) return mod
          return { ...mod, selected: !mod.selected }
        })
        return { ...item, modifiers: updatedModifiers }
      }),
    )
  }

  function resetSimulator() {
    setItems(INITIAL_ITEMS)
    setCustomerName('Budi Santoso')
    setFulfillmentMode('TAKEAWAY')
    setActiveView('cart')
  }

  // Calculate item subtotals
  const itemsWithSubtotals = items.map(item => {
    const modifierSum = item.modifiers.filter(m => m.selected).reduce((sum, m) => sum + m.price, 0)
    const unitPrice = item.basePrice + modifierSum
    const subtotal = unitPrice * item.quantity
    return {
      ...item,
      subtotal,
      unitPrice,
    }
  })

  const orderTotal = itemsWithSubtotals.reduce((sum, item) => sum + item.subtotal, 0)
  const marketplaceCommission20 = Math.round(orderTotal * 0.2)

  // Build structured WhatsApp summary payload
  const cartSummaryInput = itemsWithSubtotals.map(item => ({
    id: item.id,
    name: item.name,
    productId: item.productId,
    quantity: item.quantity,
    subtotal: item.subtotal,
    selectedAddons: item.modifiers
      .filter(m => m.selected)
      .map(m => (m.price > 0 ? `${m.name} (+${formatCurrency(m.price)})` : m.name)),
  }))

  const fulfillment: FulfillmentInput =
    fulfillmentMode === 'DINE_IN'
      ? {
          customerName: customerName.trim() || 'Pelanggan',
          mode: 'DINE_IN',
          tableNumber: 'Meja 04',
        }
      : {
          customerName: customerName.trim() || 'Pelanggan',
          mode: 'TAKEAWAY',
          pickupPreferences: 'Ambil langsung',
        }

  const baseSummary = buildOrderSummary({
    cartItems: cartSummaryInput,
    fulfillment,
    tenant: {
      name: tenantName,
      phone: tenantPhone,
    },
  })
  const fullWhatsAppMessage = [
    baseSummary.message,
    '',
    '*Instruksi Pembayaran:*',
    'Transfer BCA 8735019284 a.n. Kopi Sudut Senja atau scan QRIS di meja kasir.',
  ].join('\n')

  function handleCopy() {
    navigator.clipboard?.writeText(fullWhatsAppMessage)
    setCopied(true)
    setTimeout(setCopied, 2000, false)
  }

  return (
    <section
      aria-label="Simulator Pemesanan WhatsApp"
      data-testid="whatsapp-simulator-section"
      id="order-flow"
      className={cn(
        'bg-background text-foreground border-border/50 relative flex min-h-screen w-full flex-col justify-center overflow-hidden border-t py-16 lg:py-24',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex max-w-3xl flex-col items-start">
          <Badge
            className="border-primary/30 text-primary bg-primary/5 mb-4 gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider uppercase"
            variant="outline"
          >
            <MessageCircle className="size-3.5" /> Mesin pesanan WhatsApp
          </Badge>
          <h2 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Pesanan langsung ke WhatsApp tanpa potongan komisi
          </h2>
          <p
            className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg"
            data-testid="zero-commission-explanation"
          >
            MeracikWeb mengirimkan data keranjang belanja pelanggan langsung ke kontak WhatsApp toko
            dalam format pesan terstruktur. Anda menerima pesanan dengan 0% komisi transaksi, tanpa
            potongan 20% sampai 30% dari agregator makanan. Data pelanggan dan seluruh nominal
            transaksi menjadi milik toko Anda sepenuhnya.
          </p>
        </div>

        {/* 3-Step WhatsApp Order Flow Walkthrough */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" data-testid="order-walkthrough">
          {/* Step 1 */}
          <div className="bg-card border-border/70 rounded-xl border p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold">
                1
              </span>
              <h3 className="text-foreground text-sm font-semibold">Pilih Menu &amp; Varian</h3>
            </div>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Pelanggan memilih menu, varian rasa, tingkat gula, dan opsi layanan langsung dari
              katalog online toko.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border-border/70 rounded-xl border p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold">
                2
              </span>
              <h3 className="text-foreground text-sm font-semibold">Masuk ke Keranjang Otomatis</h3>
            </div>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Semua pilihan dan pengubah harga terakumulasi secara instan dalam format Rupiah tanpa
              salah hitung.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border-border/70 rounded-xl border p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold">
                3
              </span>
              <h3 className="text-foreground text-sm font-semibold">
                Pesanan Terkirim ke WhatsApp Merchant
              </h3>
            </div>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Format pesan pesanan terstruktur dikirimkan langsung ke WhatsApp penjual dengan komisi
              0%.
            </p>
          </div>
        </div>

        {/* Dual Column Layout: Features & Calculator (Left) + Interactive Simulator (Right) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Value Pillars and Savings Comparison */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Value Pillar 1 */}
            <div className="bg-card border-border/70 rounded-xl border p-5 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Percent className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground font-sans text-base font-semibold">
                    0% komisi transaksi
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-normal">
                    Seluruh nominal pembayaran masuk langsung ke rekening bank atau dompet digital
                    toko Anda tanpa potongan sepeser pun.
                  </p>
                </div>
              </div>
            </div>

            {/* Value Pillar 2 */}
            <div className="bg-card border-border/70 rounded-xl border p-5 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Receipt className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground font-sans text-base font-semibold">
                    Format pesan terstruktur
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-normal">
                    Nama produk, variasi modifier, jumlah pesanan, dan alamat pemesan tersusun rapi
                    secara otomatis tanpa risiko salah catat.
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Comparison Card */}
            <div className="bg-card border-border/80 rounded-xl border p-6">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Perbandingan komisi pesanan saat ini
                </span>
                <span className="text-primary font-mono text-xs font-medium">Simulasi riil</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Komisi agregator (20%):</span>
                  <span className="text-destructive font-mono font-medium tabular-nums">
                    -{formatCurrency(marketplaceCommission20)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Komisi MeracikWeb (0%):</span>
                  <span className="text-primary font-mono font-semibold tabular-nums">Rp 0</span>
                </div>
                <div className="border-border/60 flex items-center justify-between border-t pt-3">
                  <span className="text-foreground text-sm font-medium">
                    Keuntungan bersih yang disimpan:
                  </span>
                  <span className="text-primary font-mono text-base font-bold tabular-nums">
                    +{formatCurrency(marketplaceCommission20)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive WhatsApp Dispatch Simulator */}
          <div className="lg:col-span-7">
            <div className="bg-card border-border/80 overflow-hidden rounded-2xl border shadow-xs">
              {/* Simulator Top Nav Header */}
              <div className="border-border/60 bg-muted/30 flex items-center justify-between border-b px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <Store className="size-4" />
                  </div>
                  <span className="text-foreground text-sm font-semibold">{tenantName}</span>
                </div>

                {/* View Switcher Tabs */}
                <div className="bg-muted/70 border-border/40 flex items-center gap-1 rounded-lg border p-0.5 text-xs">
                  <button
                    data-testid="tab-view-cart"
                    type="button"
                    onClick={() => setActiveView('cart')}
                    className={cn(
                      'rounded-md px-3 py-1.5 font-medium transition-colors',
                      activeView === 'cart'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Keranjang belanja
                  </button>
                  <button
                    data-testid="tab-view-chat"
                    type="button"
                    onClick={() => setActiveView('chat')}
                    className={cn(
                      'rounded-md px-3 py-1.5 font-medium transition-colors',
                      activeView === 'chat'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Pratinjau WhatsApp
                  </button>
                  <button
                    aria-label="Kembalikan nilai awal simulator"
                    className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                    title="Kembalikan nilai awal"
                    type="button"
                    onClick={resetSimulator}
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* View 1: Interactive Cart View */}
              {activeView === 'cart' ? (
                <div className="flex flex-col gap-6 p-5 sm:p-6" data-testid="cart-view-container">
                  {/* Cart Line Items */}
                  <div className="flex flex-col gap-4">
                    {itemsWithSubtotals.map(item => (
                      <div
                        key={item.id}
                        className="bg-background border-border/60 flex flex-col gap-3 rounded-xl border p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-foreground font-sans text-sm font-semibold">
                              {item.name}
                            </h4>
                            <span className="text-muted-foreground font-mono text-xs tabular-nums">
                              {formatCurrency(item.basePrice)}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="border-border bg-muted/20 flex items-center gap-2 rounded-lg border p-1">
                            <button
                              aria-label={`Kurangi jumlah ${item.name}`}
                              className="text-foreground hover:bg-muted flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40"
                              data-testid={`btn-decrement-${item.id}`}
                              disabled={item.quantity <= 1}
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span
                              className="text-foreground min-w-[20px] px-1.5 text-center font-mono text-xs font-semibold tabular-nums"
                              data-testid={`quantity-${item.id}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              aria-label={`Tambah jumlah ${item.name}`}
                              className="text-foreground hover:bg-muted flex size-7 items-center justify-center rounded transition-colors"
                              data-testid={`btn-increment-${item.id}`}
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Modifiers List */}
                        <div className="border-border/40 flex flex-wrap gap-2 border-t pt-2">
                          {item.modifiers.map(modifier => (
                            <button
                              key={modifier.id}
                              data-testid={`modifier-${item.id}-${modifier.id}`}
                              type="button"
                              onClick={() => toggleModifier(item.id, modifier.id)}
                              className={cn(
                                'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-all',
                                modifier.selected
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-border/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                              )}
                            >
                              <span>{modifier.name}</span>
                              {modifier.price > 0 && (
                                <span className="font-mono text-[11px] tabular-nums opacity-80">
                                  +{formatCurrency(modifier.price)}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Item Subtotal Line */}
                        <div className="flex justify-end pt-1">
                          <span className="text-muted-foreground mr-2 text-xs">Subtotal:</span>
                          <span
                            className="text-foreground font-mono text-xs font-semibold tabular-nums"
                            data-testid={`item-subtotal-${item.id}`}
                          >
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information and Fulfillment Method */}
                  <div className="border-border/60 grid grid-cols-1 gap-4 border-t pt-2 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-medium" htmlFor="customer-name-input">
                        Nama pemesan
                      </Label>
                      <Input
                        className="h-9 text-xs"
                        id="customer-name-input"
                        placeholder="Nama pelanggan"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-medium">Metode pengambilan</Label>
                      <div className="border-border bg-muted/20 flex h-9 items-center gap-1 rounded-md border p-1">
                        <button
                          type="button"
                          onClick={() => setFulfillmentMode('TAKEAWAY')}
                          className={cn(
                            'flex-1 rounded py-1 text-xs font-medium transition-colors',
                            fulfillmentMode === 'TAKEAWAY'
                              ? 'bg-background text-foreground shadow-xs'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          Bungkus
                        </button>
                        <button
                          type="button"
                          onClick={() => setFulfillmentMode('DINE_IN')}
                          className={cn(
                            'flex-1 rounded py-1 text-xs font-medium transition-colors',
                            fulfillmentMode === 'DINE_IN'
                              ? 'bg-background text-foreground shadow-xs'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          Makan di tempat
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total and Dispatch Action */}
                  <div className="bg-muted/30 border-border/70 flex flex-col gap-4 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-sm font-semibold">Total pesanan:</span>
                      <span
                        className="text-foreground font-mono text-lg font-bold tabular-nums"
                        data-testid="cart-order-total"
                      >
                        {formatCurrency(orderTotal)}
                      </span>
                    </div>

                    <Button
                      className="min-h-[44px] w-full gap-2 text-sm font-semibold"
                      data-testid="btn-dispatch-whatsapp"
                      type="button"
                      onClick={() => setActiveView('chat')}
                    >
                      <MessageCircle className="size-4" />
                      Kirim Pesanan via WhatsApp
                    </Button>
                  </div>
                </div>
              ) : (
                /* View 2: Realistic WhatsApp Chat Simulation */
                <div
                  className="bg-muted/40 flex flex-col transition-colors"
                  data-testid="chat-view-container"
                >
                  {/* WhatsApp Contact Header */}
                  <div className="bg-card border-border/80 text-card-foreground flex items-center justify-between border-b px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <button
                        aria-label="Kembali ke keranjang belanja"
                        className="rounded-full p-1 transition-colors hover:bg-white/10"
                        data-testid="btn-edit-order"
                        title="Kembali ke keranjang"
                        type="button"
                        onClick={() => setActiveView('cart')}
                      >
                        <ArrowLeft className="size-5" />
                      </button>
                      <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-xs font-bold tracking-wider">
                        KS
                      </div>
                      <div>
                        <div className="text-foreground text-sm leading-tight font-semibold">
                          {tenantName}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                          <span className="bg-primary inline-block size-1.5 rounded-full" />
                          Online
                        </div>
                      </div>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-3">
                      <Video className="size-4 opacity-80" />
                      <Phone className="size-4 opacity-80" />
                    </div>
                  </div>

                  {/* WhatsApp Chat Canvas */}
                  <div className="flex min-h-[360px] flex-col justify-end gap-3 p-4 sm:p-6">
                    {/* Timestamp Center Pill */}
                    <div className="flex justify-center">
                      <span className="bg-background/80 text-muted-foreground rounded px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase shadow-2xs">
                        Hari ini
                      </span>
                    </div>

                    {/* Chat Message Bubble */}
                    <div
                      className="bg-card text-card-foreground border-primary/30 relative flex max-w-[94%] flex-col gap-2 self-end rounded-2xl rounded-tr-xs border p-3.5 shadow-xs sm:max-w-[85%]"
                      data-testid="whatsapp-chat-bubble"
                    >
                      {/* Preformatted Structured Message Text */}
                      <pre
                        className="font-sans text-xs leading-relaxed tracking-normal whitespace-pre-wrap sm:text-sm"
                        data-testid="whatsapp-message-text"
                      >
                        {fullWhatsAppMessage}
                      </pre>

                      {/* Bubble Timestamp and Read Receipts */}
                      <div className="text-muted-foreground flex items-center justify-end gap-1 pt-1 text-[10px]">
                        <span data-testid="whatsapp-timestamp">10:42</span>
                        <CheckCheck
                          className="text-primary size-3.5"
                          data-testid="whatsapp-read-receipt"
                        />
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Simulation Action Footer */}
                  <div className="bg-background border-border/60 flex flex-wrap items-center justify-between gap-3 border-t p-3 sm:p-4">
                    <button
                      className="text-muted-foreground hover:text-foreground hover:bg-muted flex min-h-[44px] items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors"
                      type="button"
                      onClick={() => setActiveView('cart')}
                    >
                      <SlidersHorizontal className="size-3.5" />
                      Ubah pesanan
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        className="border-border hover:bg-muted flex min-h-[44px] items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors"
                        type="button"
                        onClick={handleCopy}
                      >
                        {copied ? <Check className="size-3.5" /> : null}
                        {copied ? 'Tersalin' : 'Salin format pesan'}
                      </button>

                      <a
                        className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
                        data-testid="btn-open-wa"
                        href={baseSummary.waUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Buka di WhatsApp
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
