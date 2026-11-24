'use client'

import {
  Check,
  CheckCircle2,
  Coffee,
  Info,
  Layers,
  MapPin,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/storefront/currency'
import { cn } from '@/lib/utils'

export interface ArchetypeSwitcherProps {
  className?: string
}

type CupSize = 'regular' | 'large' | 'liter'
type SugarLevel = 'normal' | 'less' | 'none'
type IceLevel = 'normal' | 'less' | 'none'
type FulfillmentMode = 'dinein' | 'takeaway'
type RetailSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'
type RetailColor = 'indigo' | 'marun' | 'emerald'

const FNB_BASE_PRICE = 18000
const RETAIL_BASE_PRICE = 245000

const RETAIL_SIZES: readonly RetailSize[] = ['S', 'M', 'L', 'XL', 'XXL'] as const
const RETAIL_COLOR_KEYS: readonly RetailColor[] = ['indigo', 'marun', 'emerald'] as const

function isArchetypeTab(val: string): val is 'fnb' | 'retail' {
  return val === 'fnb' || val === 'retail'
}
interface CupOption {
  id: CupSize
  label: string
  volume: string
  modifier: number
  description: string
}

const CUP_OPTIONS: CupOption[] = [
  {
    id: 'regular',
    description: 'Ukuran standar saji per cangkir',
    label: 'Regular',
    modifier: 0,
    volume: '250ml',
  },
  {
    id: 'large',
    description: 'Porsi lebih besar untuk kepuasan ekstra',
    label: 'Large',
    modifier: 4000,
    volume: '350ml',
  },
  {
    id: 'liter',
    description: 'Kemasan botol berbagi bersama rekan',
    label: 'Botol 1 Liter',
    modifier: 55000,
    volume: '1000ml',
  },
]

const SUGAR_OPTIONS: { id: SugarLevel; label: string; subtext: string }[] = [
  { id: 'normal', label: 'Normal (100%)', subtext: 'Manis standar resep' },
  { id: 'less', label: '50% Less Sugar', subtext: 'Manis separuh resep' },
  { id: 'none', label: 'Tanpa Gula', subtext: 'Kopi hitam murni' },
]

const ICE_OPTIONS: { id: IceLevel; label: string; subtext: string }[] = [
  { id: 'normal', label: 'Normal Es', subtext: 'Dingin optimal' },
  { id: 'less', label: 'Sedikit Es', subtext: 'Rasa kopi lebih pekat' },
  { id: 'none', label: 'Tanpa Es (No Ice)', subtext: 'Suhu ruang atau hangat' },
]

interface RetailStockInfo {
  count: number
  status: string
  isLow: boolean
}

const RETAIL_STOCK_MAP: Record<RetailSize, RetailStockInfo> = {
  L: { count: 12, isLow: false, status: 'Stok Tersedia (12 pcs)' },
  M: { count: 14, isLow: false, status: 'Stok Tersedia (14 pcs)' },
  S: { count: 8, isLow: false, status: 'Stok Tersedia (8 pcs)' },
  XL: { count: 2, isLow: true, status: 'Sisa 2 pcs (Stok Menipis)' },
  XXL: { count: 4, isLow: false, status: 'Stok Tersedia (4 pcs)' },
}

const RETAIL_COLORS: Record<RetailColor, { name: string; desc: string; hex: string }> = {
  emerald: {
    name: 'Hijau Zamrud',
    desc: 'Warna dedaunan anggun dan elegan',
    hex: '#065f46',
  },
  indigo: {
    name: 'Biru Indigo',
    desc: 'Warna celup tradisional alami',
    hex: '#1e3a8a',
  },
  marun: {
    name: 'Marun Terracotta',
    desc: 'Warna hangat aksen klasik nusantara',
    hex: '#991b1b',
  },
}

export function ArchetypeSwitcher({ className }: ArchetypeSwitcherProps) {
  const [activeTab, setActiveTab] = useState<'fnb' | 'retail'>('fnb')

  // F&B Interactive State
  const [fnbCupSize, setFnbCupSize] = useState<CupSize>('regular')
  const [fnbSugar, setFnbSugar] = useState<SugarLevel>('normal')
  const [fnbIce, setFnbIce] = useState<IceLevel>('normal')
  const [fnbFulfillment, setFnbFulfillment] = useState<FulfillmentMode>('dinein')

  // Retail Interactive State
  const [retailSize, setRetailSize] = useState<RetailSize>('M')
  const [retailColor, setRetailColor] = useState<RetailColor>('indigo')
  const [retailFulfillment, setRetailFulfillment] = useState<'delivery' | 'pickup'>('delivery')
  const [fnbAdded, setFnbAdded] = useState(false)
  const [retailAdded, setRetailAdded] = useState(false)

  function handleAddFnbToCart() {
    setFnbAdded(true)
    setTimeout(setFnbAdded, 2000, false)
  }

  function handleAddRetailToCart() {
    setRetailAdded(true)
    setTimeout(setRetailAdded, 2000, false)
  }

  // Calculations
  const selectedCup = CUP_OPTIONS.find(opt => opt.id === fnbCupSize) ?? CUP_OPTIONS[0]
  const fnbCalculatedTotal = FNB_BASE_PRICE + selectedCup.modifier

  const currentStockInfo = RETAIL_STOCK_MAP[retailSize]
  const currentColorInfo = RETAIL_COLORS[retailColor]
  return (
    <section
      aria-label="Pilihan Model Bisnis"
      data-testid="archetype-switcher-section"
      id="archetypes"
      className={cn(
        'bg-background text-foreground relative flex min-h-screen flex-col justify-center overflow-hidden py-8 lg:h-screen lg:max-h-screen lg:py-3.5',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="border-primary/20 bg-primary/5 text-primary mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
            <Layers className="size-3.5" />
            <span>Arsitektur Multi-Model</span>
          </div>

          <h2 className="font-display text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Dua Model Bisnis UMKM dalam Satu Platform
          </h2>

          <p
            className="mx-auto mt-3 max-w-2xl font-sans text-sm text-zinc-700 sm:text-base dark:text-zinc-300"
            data-testid="archetype-value-prop"
          >
            Pilih model bisnis Anda. MeracikWeb menyediakan alur pesanan kuliner F&B dengan varian
            rasa dan pengubah harga, serta katalog toko retail dengan panduan ukuran, warna, dan
            status stok otomatis.
          </p>
        </div>

        {/* Segmented Tab Control */}
        <Tabs
          className="mt-4 sm:mt-5 lg:mt-3 w-full"
          value={activeTab}
          onValueChange={val => {
            if (isArchetypeTab(val)) {
              setActiveTab(val)
            }
          }}
        >
          <div className="flex justify-center">
            <TabsList className="border-border/60 bg-muted/70 h-12 min-h-[44px] rounded-xl border p-1 shadow-xs">
              <TabsTrigger
                className="data-active:border-border/40 data-active:bg-background data-active:text-primary min-h-[44px] rounded-lg px-6 text-sm font-semibold transition-all data-active:shadow-sm"
                value="fnb"
              >
                <UtensilsCrossed className="mr-2 size-4" />
                <span>Kuliner & F&B</span>
              </TabsTrigger>
              <TabsTrigger
                className="data-active:border-border/40 data-active:bg-background data-active:text-primary min-h-[44px] rounded-lg px-6 text-sm font-semibold transition-all data-active:shadow-sm"
                value="retail"
              >
                <ShoppingBag className="mr-2 size-4" />
                <span>Toko Retail</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* F&B Archetype Panel */}
          <TabsContent className="mt-4 sm:mt-5 lg:mt-3 outline-none" data-testid="fnb-archetype-view" value="fnb">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              {/* Left Column: Model Explanation & Interactive Modifiers */}
              <div className="space-y-4 lg:space-y-2.5 lg:col-span-7">
                <div className="space-y-2">
                  <div className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                    <Coffee className="size-3.5" />
                    <span>Preset Kafe & Restoran</span>
                  </div>
                  <h3 className="text-foreground font-sans text-lg font-bold tracking-tight sm:text-xl">
                    Logika Pengubah Harga dan Preferensi Rasa
                  </h3>
                  <p className="font-sans text-sm text-zinc-700 sm:text-base dark:text-zinc-300">
                    Menu kuliner membutuhkan fleksibilitas ukuran porsi serta catatan kustomisasi
                    bebas biaya. MeracikWeb menghitung total harga pesanan secara otomatis tanpa
                    kesalahan perhitungan kasir.
                  </p>
                </div>

                {/* Interactive Modifiers Box */}
                <div
                  className="border-border bg-card rounded-2xl border p-4 shadow-xs sm:p-5 lg:p-3.5"
                  data-ui="archetype-modifiers"
                >
                  <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
                    <span className="text-foreground text-xs font-semibold tracking-wide uppercase">
                      Uji Interaktif: Varian Ukuran Gelas
                    </span>
                    <span className="text-muted-foreground text-xs">Pilih ukuran di bawah</span>
                  </div>

                  {/* Cup Size Options */}
                  <div
                    aria-label="Pilihan Ukuran Gelas"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    role="radiogroup"
                  >
                    {CUP_OPTIONS.map(opt => {
                      const isSelected = fnbCupSize === opt.id
                      const testId = `fnb-cup-${opt.id}`
                      return (
                        <button
                          key={opt.id}
                          aria-checked={isSelected}
                          data-testid={testId}
                          role="radio"
                          type="button"
                          onClick={() => setFnbCupSize(opt.id)}
                          className={cn(
                            'group flex min-h-[44px] flex-col justify-between rounded-lg border p-3 text-left transition-all',
                            isSelected
                              ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
                              : 'border-border bg-background hover:border-border/80 hover:bg-muted/30',
                          )}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="text-foreground font-sans text-sm font-semibold">
                              {opt.label}
                            </span>
                            {isSelected && <Check className="text-primary size-4" />}
                          </div>
                          <span className="text-muted-foreground mt-1 text-xs">{opt.volume}</span>
                          <span className="text-primary mt-2 font-mono text-xs font-semibold tabular-nums">
                            {opt.modifier > 0 ? `+${formatCurrency(opt.modifier)}` : '+Rp 0'}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Sugar & Ice Levels Grid */}
                  <div className="mt-3.5 grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
                    {/* Sugar Level */}
                    <div>
                      <label className="text-foreground mb-2 block text-xs font-semibold">
                        Tingkat Kemanisan (Sugar Level)
                      </label>
                      <div
                        aria-label="Tingkat Kemanisan"
                        className="flex flex-col gap-2"
                        role="radiogroup"
                      >
                        {SUGAR_OPTIONS.map(opt => {
                          const isSelected = fnbSugar === opt.id
                          const testId = `fnb-sugar-${opt.id}`
                          return (
                            <button
                              key={opt.id}
                              aria-checked={isSelected}
                              data-testid={testId}
                              role="radio"
                              type="button"
                              onClick={() => setFnbSugar(opt.id)}
                              className={cn(
                                'flex min-h-[44px] items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary font-semibold'
                                  : 'border-border bg-background hover:bg-muted/30 hover:text-foreground text-zinc-600 dark:text-zinc-400',
                              )}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="text-primary size-3.5" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Ice Level */}
                    <div>
                      <label className="text-foreground mb-2 block text-xs font-semibold">
                        Takaran Es (Ice Level)
                      </label>
                      <div
                        aria-label="Takaran Es"
                        className="flex flex-col gap-2"
                        role="radiogroup"
                      >
                        {ICE_OPTIONS.map(opt => {
                          const isSelected = fnbIce === opt.id
                          const testId = `fnb-ice-${opt.id}`
                          return (
                            <button
                              key={opt.id}
                              aria-checked={isSelected}
                              data-testid={testId}
                              role="radio"
                              type="button"
                              onClick={() => setFnbIce(opt.id)}
                              className={cn(
                                'flex min-h-[44px] items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary font-semibold'
                                  : 'border-border bg-background hover:bg-muted/30 hover:text-foreground text-zinc-600 dark:text-zinc-400',
                              )}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="text-primary size-3.5" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Fulfillment Mode */}
                  <div className="border-border/60 mt-3.5 border-t pt-3">
                    <label className="text-foreground mb-2 block text-xs font-semibold">
                      Mode Layanan Pelanggan (Fulfillment Mode)
                    </label>
                    <div
                      aria-label="Mode Layanan"
                      className="grid grid-cols-2 gap-3"
                      role="radiogroup"
                    >
                      <button
                        aria-checked={fnbFulfillment === 'dinein'}
                        data-testid="fnb-fulfillment-dinein"
                        role="radio"
                        type="button"
                        onClick={() => setFnbFulfillment('dinein')}
                        className={cn(
                          'flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                          fnbFulfillment === 'dinein'
                            ? 'border-primary bg-primary/5 text-primary font-semibold'
                            : 'border-border bg-background hover:text-foreground text-zinc-600 dark:text-zinc-400',
                        )}
                      >
                        <UtensilsCrossed className="size-3.5" />
                        <span>Makan di Tempat</span>
                      </button>
                      <button
                        aria-checked={fnbFulfillment === 'takeaway'}
                        data-testid="fnb-fulfillment-takeaway"
                        role="radio"
                        type="button"
                        onClick={() => setFnbFulfillment('takeaway')}
                        className={cn(
                          'flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                          fnbFulfillment === 'takeaway'
                            ? 'border-primary bg-primary/5 text-primary font-semibold'
                            : 'border-border bg-background hover:text-foreground text-zinc-600 dark:text-zinc-400',
                        )}
                      >
                        <ShoppingBag className="size-3.5" />
                        <span>Bawa Pulang (Takeaway)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feature Value Badges */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="border-border bg-card flex items-start gap-2.5 rounded-xl border p-3 shadow-xs">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="text-foreground text-xs font-semibold">
                        Pengubah Harga Otomatis
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                        Tambahan biaya varian terhitung instan.
                      </p>
                    </div>
                  </div>
                  <div className="border-border bg-card flex items-start gap-2.5 rounded-xl border p-3 shadow-xs">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="text-foreground text-xs font-semibold">Catatan Dapur Rapi</p>
                      <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                        Instruksi rasa langsung masuk ke pesanan.
                      </p>
                    </div>
                  </div>
                  <div className="border-border bg-card flex items-start gap-2.5 rounded-xl border p-3 shadow-xs">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="text-foreground text-xs font-semibold">Bebas Biaya Komisi</p>
                      <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                        Omzet utuh 100% milik pemilik kafe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Storefront Mobile Mockup */}
              <div className="flex justify-center lg:col-span-5" data-ui="archetype-showcase">
                <div className="border-border/80 bg-card w-full max-w-[340px] rounded-3xl border-2 p-3 sm:p-3.5 shadow-xl">
                  {/* Phone Mockup Top Bar */}
                  <div className="border-border/60 text-muted-foreground mb-3 flex items-center justify-between border-b pb-2 text-xs">
                    <span className="font-mono font-semibold">09:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-primary size-2 rounded-full" />
                      <span className="text-[10px] font-medium tracking-tight">4G</span>
                    </div>
                  </div>

                  {/* Merchant Store Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div
                        className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        data-testid="fnb-preset-badge"
                      >
                        <Coffee className="size-3" />
                        <span>Kopi Sudut Senja</span>
                      </div>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        Buka • 08:00 - 22:00 WIB
                      </p>
                    </div>
                    <Badge className="text-[10px]" variant="outline">
                      {fnbFulfillment === 'dinein' ? 'Makan di Tempat' : 'Bawa Pulang'}
                    </Badge>
                  </div>

                  {/* Product Card Container */}
                  <div className="bg-card overflow-hidden rounded-2xl">
                    {/* Visual Banner */}
                    {/* Authentic Visual Banner */}
                    <div
                      className="bg-muted relative h-28 sm:h-32 lg:h-28 w-full overflow-hidden"
                      data-ui="fnb-visual"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- Authentic lifestyle photography of Indonesian coffee shop */}
                      <img
                        alt="Suasana kedai kopi Kopi Sudut Senja"
                        className="size-full object-cover transition-transform hover:scale-102"
                        src="/images/marketing/fnb-coffee.jpg"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <Badge className="bg-background/90 text-foreground border-border/80 text-[10px] font-medium backdrop-blur-xs">
                          Kedai Kopi Lokal
                        </Badge>
                      </div>
                    </div>
                    {/* Product Details */}
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className="text-foreground font-sans text-base font-bold"
                            data-testid="fnb-product-name"
                          >
                            Es Kopi Susu Aren
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            Espresso ganda, susu segar, dan gula aren organik khas lokal.
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Price Display */}
                      <div className="border-border/50 mt-2 flex items-baseline justify-between border-t pt-1.5">
                        <span className="text-muted-foreground text-xs">Harga Total:</span>
                        <span
                          className="text-foreground font-mono text-lg font-extrabold tabular-nums"
                          data-testid="fnb-calculated-price"
                        >
                          {formatCurrency(fnbCalculatedTotal)}
                        </span>
                      </div>

                      {/* Selected Options Summary */}
                      <div className="border-border/70 bg-muted/30 mt-2 rounded-xl border p-2">
                        <div className="text-foreground flex items-center gap-1 text-[11px] font-semibold">
                          <Info className="text-primary size-3" />
                          <span>Rincian Varian Terpilih:</span>
                        </div>
                        <p
                          className="text-muted-foreground mt-1 text-[11px]"
                          data-testid="fnb-order-summary"
                        >
                          {fnbFulfillment === 'takeaway' ? 'Bawa Pulang' : 'Makan di Tempat'} •
                          Ukuran {selectedCup.label} ({selectedCup.volume}) • Gula{' '}
                          {SUGAR_OPTIONS.find(s => s.id === fnbSugar)?.label} • Es{' '}
                          {ICE_OPTIONS.find(i => i.id === fnbIce)?.label}
                        </p>
                      </div>

                      {/* Add to Cart Simulation Button */}
                      <Button
                        className="mt-2.5 sm:mt-3 flex h-11 min-h-[44px] w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold shadow-xs"
                        type="button"
                        onClick={handleAddFnbToCart}
                      >
                        {fnbAdded ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Ditambahkan ke Keranjang</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="size-3.5" />
                            <span>Tambah ke Keranjang • {formatCurrency(fnbCalculatedTotal)}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Retail Archetype Panel */}
          <TabsContent
            className="mt-4 sm:mt-5 lg:mt-3 outline-none"
            data-testid="retail-archetype-view"
            value="retail"
          >
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              {/* Left Column: Model Explanation & Sizing/Color Matrix */}
              <div className="space-y-4 lg:space-y-2.5 lg:col-span-7">
                <div className="space-y-2">
                  <div className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                    <ShoppingBag className="size-3.5" />
                    <span>Preset Toko & Butik Fashion</span>
                  </div>
                  <h3 className="text-foreground font-sans text-lg font-bold tracking-tight sm:text-xl">
                    Manajemen Ukuran, Warna, dan Status Ketersediaan Stok
                  </h3>
                  <p className="font-sans text-sm text-zinc-700 sm:text-base dark:text-zinc-300">
                    Produk retail memerlukan inventaris per kombinasi ukuran dan corak warna.
                    MeracikWeb menyajikan peringatan sisa stok secara langsung sehingga pelanggan
                    mengetahui ketersediaan barang sebelum checkout.
                  </p>
                </div>

                {/* Interactive Retail Matrix Box */}
                <div className="border-border bg-card rounded-2xl border p-4 shadow-xs sm:p-5 lg:p-3.5">
                  {/* Sizing Section */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-foreground text-xs font-semibold tracking-wide uppercase">
                        Pilihan Ukuran Pakaian
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Terpilih:{' '}
                        <strong
                          className="text-foreground font-semibold"
                          data-testid="retail-selected-size"
                        >
                          {retailSize}
                        </strong>
                      </span>
                    </div>

                    <div
                      aria-label="Pilihan Ukuran Pakaian"
                      className="grid grid-cols-5 gap-2 sm:gap-3"
                      role="radiogroup"
                    >
                      {RETAIL_SIZES.map(size => {
                        const isSelected = retailSize === size
                        const stock = RETAIL_STOCK_MAP[size]
                        return (
                          <button
                            key={size}
                            aria-checked={isSelected}
                            data-testid={`retail-size-${size}`}
                            role="radio"
                            type="button"
                            onClick={() => setRetailSize(size)}
                            className={cn(
                              'flex min-h-[44px] flex-col items-center justify-center rounded-lg border p-2 text-center transition-all',
                              isSelected
                                ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
                                : 'border-border bg-background hover:bg-muted/30',
                            )}
                          >
                            <span className="text-foreground font-sans text-sm font-bold">
                              {size}
                            </span>
                            <span
                              className={cn(
                                'text-[10px] font-medium tabular-nums',
                                stock.isLow
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {stock.count} pcs
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Color Swatches Section */}
                  <div className="border-border/60 mt-3.5 border-t pt-3">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-foreground text-xs font-semibold tracking-wide uppercase">
                        Pilihan Warna Produk
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Warna:{' '}
                        <strong
                          className="text-foreground font-semibold"
                          data-testid="retail-selected-color"
                        >
                          {currentColorInfo.name}
                        </strong>
                      </span>
                    </div>

                    <div
                      aria-label="Pilihan Warna Produk"
                      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                      role="radiogroup"
                    >
                      {RETAIL_COLOR_KEYS.map(colorKey => {
                        const isSelected = retailColor === colorKey
                        const cInfo = RETAIL_COLORS[colorKey]
                        return (
                          <button
                            key={colorKey}
                            aria-checked={isSelected}
                            data-testid={`retail-color-${colorKey}`}
                            role="radio"
                            type="button"
                            onClick={() => setRetailColor(colorKey)}
                            className={cn(
                              'flex min-h-[44px] items-center gap-3 rounded-lg border p-2.5 text-left transition-all',
                              isSelected
                                ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
                                : 'border-border bg-background hover:bg-muted/30',
                            )}
                          >
                            <span
                              className="size-5 shrink-0 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: cInfo.hex }}
                            />
                            <div className="overflow-hidden">
                              <p className="text-foreground truncate text-xs font-semibold">
                                {cInfo.name}
                              </p>
                              <p className="text-muted-foreground truncate text-[10px]">
                                {cInfo.desc}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Delivery / Pickup Fulfillment */}
                  <div className="border-border/60 mt-3.5 border-t pt-3">
                    <label className="text-foreground mb-2 block text-xs font-semibold">
                      Opsi Pengiriman Produk Retail
                    </label>
                    <div
                      aria-label="Opsi Pengiriman Produk Retail"
                      className="grid grid-cols-2 gap-3"
                      role="radiogroup"
                    >
                      <button
                        aria-checked={retailFulfillment === 'delivery'}
                        role="radio"
                        type="button"
                        onClick={() => setRetailFulfillment('delivery')}
                        className={cn(
                          'flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                          retailFulfillment === 'delivery'
                            ? 'border-primary bg-primary/5 text-primary font-semibold'
                            : 'border-border bg-background hover:text-foreground text-zinc-600 dark:text-zinc-400',
                        )}
                      >
                        <Truck className="size-3.5" />
                        <span>Kirim Ekspedisi (JNE/SiCepat)</span>
                      </button>
                      <button
                        aria-checked={retailFulfillment === 'pickup'}
                        role="radio"
                        type="button"
                        onClick={() => setRetailFulfillment('pickup')}
                        className={cn(
                          'flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                          retailFulfillment === 'pickup'
                            ? 'border-primary bg-primary/5 text-primary font-semibold'
                            : 'border-border bg-background hover:text-foreground text-zinc-600 dark:text-zinc-400',
                        )}
                      >
                        <MapPin className="size-3.5" />
                        <span>Ambil di Butik</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Retail Value Badges */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="border-border bg-card/60 flex items-start gap-2.5 rounded-xl border p-3">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="text-foreground text-xs font-semibold">Manajemen Varian SKU</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Kombinasi ukuran dan corak terstruktur rapi.
                      </p>
                    </div>
                  </div>
                  <div className="border-border bg-card/60 flex items-start gap-2.5 rounded-xl border p-3">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="text-foreground text-xs font-semibold">Status Stok Akurat</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Peringatan sisa barang mencegah pesanan berlebih.
                      </p>
                    </div>
                  </div>
                  <div className="border-border bg-card/60 flex items-start gap-2.5 rounded-xl border p-3">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="text-foreground text-xs font-semibold">Integrasi Kurir Lokal</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Format pengiriman langsung tercantum di pesanan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Storefront Retail Mockup */}
              <div className="flex justify-center lg:col-span-5" data-ui="retail-showcase">
                <div className="border-border/80 bg-card w-full max-w-[340px] rounded-3xl border-2 p-3 sm:p-3.5 shadow-xl">
                  {/* Phone Mockup Top Bar */}
                  <div className="border-border/60 text-muted-foreground mb-3 flex items-center justify-between border-b pb-2 text-xs">
                    <span className="font-mono font-semibold">09:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-primary size-2 rounded-full" />
                      <span className="text-[10px] font-medium tracking-tight">4G</span>
                    </div>
                  </div>

                  {/* Merchant Store Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div
                        className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        data-testid="retail-preset-badge"
                      >
                        <ShoppingBag className="size-3" />
                        <span>Tenun Nusantara</span>
                      </div>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        Butik Kain & Busana Tradisional
                      </p>
                    </div>
                    <Badge className="text-[10px]" variant="outline">
                      SKU: TN-IKAT-042
                    </Badge>
                  </div>

                  {/* Product Card Container */}
                  <div className="bg-card overflow-hidden rounded-2xl">
                    {/* Visual Banner */}
                    {/* Authentic Visual Banner */}
                    <div
                      className="bg-muted relative h-28 sm:h-32 lg:h-28 w-full overflow-hidden"
                      data-ui="retail-visual"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- Authentic lifestyle photography of Indonesian textile craft */}
                      <img
                        alt="Kain tenun Jepara Tenun Nusantara"
                        className="size-full object-cover transition-transform hover:scale-102"
                        src="/images/marketing/retail-textile.jpg"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <Badge className="bg-background/90 text-foreground border-border/80 text-[10px] font-medium backdrop-blur-xs">
                          Kerajinan Tenun
                        </Badge>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className="text-foreground font-sans text-base font-bold"
                            data-testid="retail-product-name"
                          >
                            Kemeja Tenun Ikat Jepara
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            Kain tenun ATBM asli Jepara dengan pewarna alami dan potongan modern.
                          </p>
                        </div>
                      </div>

                      {/* Retail Price Display */}
                      <div className="border-border/50 mt-2 flex items-baseline justify-between border-t pt-1.5">
                        <span className="text-muted-foreground text-xs">Harga Satuan:</span>
                        <span className="text-foreground font-mono text-lg font-extrabold tabular-nums">
                          {formatCurrency(RETAIL_BASE_PRICE)}
                        </span>
                      </div>

                      {/* Dynamic Stock Indicator Badge */}
                      <div className="mt-2">
                        <div
                          data-testid="retail-stock-indicator"
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold',
                            currentStockInfo.isLow
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'border-primary/20 bg-primary/10 text-primary',
                          )}
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full',
                              currentStockInfo.isLow ? 'bg-amber-500' : 'bg-primary',
                            )}
                          />
                          <span>{currentStockInfo.status}</span>
                        </div>
                      </div>

                      {/* Selected Attribute Pills */}
                      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-[11px]">
                        <span className="border-border bg-muted/30 rounded-md border px-2 py-0.5 font-medium">
                          Ukuran: <strong className="text-foreground">{retailSize}</strong>
                        </span>
                        <span className="border-border bg-muted/30 rounded-md border px-2 py-0.5 font-medium">
                          Warna:{' '}
                          <strong className="text-foreground">{currentColorInfo.name}</strong>
                        </span>
                      </div>

                      {/* Add to Cart Simulation Button */}
                      <Button
                        className="mt-2.5 sm:mt-3 flex h-11 min-h-[44px] w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold shadow-xs"
                        type="button"
                        onClick={handleAddRetailToCart}
                      >
                        {retailAdded ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Pesanan Disiapkan!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="size-3.5" />
                            <span>Beli Sekarang • {formatCurrency(RETAIL_BASE_PRICE)}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
