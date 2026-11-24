'use client'

import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Package,
  ShoppingBag,
  Sliders,
  Store,
  Wifi,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/storefront/currency'
import { cn } from '@/lib/utils'

export interface HeroEditorSimulatorProps {
  className?: string
}

export function HeroEditorSimulator({ className }: HeroEditorSimulatorProps) {
  const [storeName, setStoreName] = useState('Kopi Sudut Senja')
  const [productName, setProductName] = useState('Es Kopi Susu Aren')
  const [price, setPrice] = useState<number>(18000)
  const [variantOption, setVariantOption] = useState('Ukuran Regular (350ml)')
  const categoryName = 'Minuman Kopi'
  const [mobileSimulatorTab, setMobileSimulatorTab] = useState<'admin' | 'buyer'>('admin')

  const domainSlug = storeName
    ? storeName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'kopisudutsenja'
  const domainPreview = `${domainSlug || 'kopisudutsenja'}.growfin.my.id`

  return (
    <div
      data-testid="app-frame"
      data-ui="storefront-editor"
      id="editor-simulator"
      className={cn(
        'border-border bg-card w-full max-w-5xl rounded-xl border shadow-2xl transition-all motion-reduce:transition-none',
        className,
      )}
    >
      {/* Frame Top Bar */}
      <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="bg-destructive/80 size-3 rounded-full" />
          <span className="size-3 rounded-full bg-amber-500/80" />
          <span className="bg-primary/80 size-3 rounded-full" />
          <span className="text-muted-foreground ml-2 hidden text-xs font-medium sm:inline">
            MeracikWeb Studio &mdash; Storefront Editor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className="border-primary/20 bg-primary/10 text-primary gap-1 text-[11px] font-medium"
            variant="outline"
          >
            <span className="bg-primary size-1.5 animate-pulse rounded-full motion-reduce:animate-none" />
            <span>Simulasi Real-time</span>
          </Badge>
        </div>
      </div>

      {/* Mobile Viewport Toggle Bar (<640px) */}
      <div
        aria-label="Mode Simulasi"
        className="border-border bg-muted/40 flex items-center justify-center border-b p-2 sm:hidden"
        role="tablist"
      >
        <div className="border-border bg-muted inline-flex rounded-lg border p-1">
          <button
            aria-selected={mobileSimulatorTab === 'admin'}
            role="tab"
            type="button"
            onClick={() => setMobileSimulatorTab('admin')}
            className={cn(
              'focus-visible:ring-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-4 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none',
              mobileSimulatorTab === 'admin'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Mode Admin
          </button>
          <button
            aria-selected={mobileSimulatorTab === 'buyer'}
            role="tab"
            type="button"
            onClick={() => setMobileSimulatorTab('buyer')}
            className={cn(
              'focus-visible:ring-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-4 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden motion-reduce:transition-none',
              mobileSimulatorTab === 'buyer'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Mode Pembeli
          </button>
        </div>
      </div>

      {/* Dual-Pane Workspace */}
      <div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {/* Left Pane: Storefront Editor Form Inputs */}
        <div
          data-testid="editor-pane"
          className={cn(
            'bg-card flex flex-col justify-between p-3.5 sm:p-4 lg:col-span-6',
            mobileSimulatorTab !== 'admin' && 'hidden sm:flex',
          )}
        >
          <div className="space-y-3">
            <div className="border-border/60 flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="text-primary size-4" />
                <h3 className="text-foreground text-sm font-semibold">Editor Katalog Toko</h3>
              </div>
              <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="text-primary size-3.5" />
                Tersimpan lokal
              </span>
            </div>

            {/* Input: Store / Tenant Name */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-medium" htmlFor="store-name-input">
                Nama Toko
              </Label>
              <div className="relative">
                <Store className="text-muted-foreground absolute top-3.5 left-3 size-4" />
                <Input
                  className="h-11 min-h-[44px] pl-9 text-sm"
                  id="store-name-input"
                  placeholder="Contoh: Kopi Sudut Senja"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                />
              </div>
            </div>

            {/* Input: Product Name */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-medium" htmlFor="product-name-input">
                Nama Produk
              </Label>
              <div className="relative">
                <Package className="text-muted-foreground absolute top-3.5 left-3 size-4" />
                <Input
                  className="h-11 min-h-[44px] pl-9 text-sm"
                  id="product-name-input"
                  placeholder="Contoh: Es Kopi Susu Aren"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                />
              </div>
            </div>

            {/* Input: Price */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-medium" htmlFor="product-price-input">
                Harga (IDR)
              </Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-3.5 left-3 font-mono text-xs font-semibold">
                  Rp
                </span>
                <Input
                  className="h-11 min-h-[44px] pl-9 font-mono text-sm tabular-nums"
                  id="product-price-input"
                  placeholder="18000"
                  type="number"
                  value={price || ''}
                  onChange={e => setPrice(Number.parseInt(e.target.value || '0', 10))}
                />
              </div>
            </div>

            {/* Input: Variant Option */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-medium" htmlFor="variant-option-input">
                Varian Produk
              </Label>
              <Input
                className="h-11 min-h-[44px] text-sm"
                id="variant-option-input"
                placeholder="Contoh: Ukuran Regular (350ml)"
                value={variantOption}
                onChange={e => setVariantOption(e.target.value)}
              />
            </div>
          </div>

          {/* Informative hint footer */}
          <div className="border-border/80 bg-muted/30 mt-2 rounded-lg border p-2 text-[11px] text-zinc-600 dark:text-zinc-400">
            <p>
              Ketik nama produk, harga, atau varian di atas untuk melihat sinkronisasi instan ke
              tampilan website pembeli di panel kanan.
            </p>
          </div>
        </div>

        {/* Right Pane: Live Mobile Customer Storefront Preview */}
        <div
          data-testid="mobile-preview"
          className={cn(
            'bg-muted/20 flex items-center justify-center p-2.5 sm:p-4 lg:col-span-6',
            mobileSimulatorTab !== 'buyer' && 'hidden sm:flex',
          )}
        >
          {/* Phone Mockup Frame */}
          <div className="border-foreground/20 bg-background w-full max-w-[310px] rounded-[2rem] border-4 shadow-xl">
            {/* Mobile Device Status Bar */}
            <div className="border-border/40 text-muted-foreground flex items-center justify-between border-b px-5 py-2 text-[10px] font-medium">
              <span>09:41</span>
              <div className="bg-foreground/10 h-3 w-16 rounded-full" />
              <div className="flex items-center gap-1">
                <Wifi className="size-3" />
                <span>5G</span>
              </div>
            </div>

            {/* Mobile Browser Bar */}
            <div className="border-border/50 bg-muted/40 text-muted-foreground flex items-center justify-between border-b px-3 py-1.5 text-[10px]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="bg-primary size-1.5 rounded-full" />
                <span className="truncate font-mono">{domainPreview}</span>
              </div>
              <ExternalLink className="text-muted-foreground size-2.5 shrink-0" />
            </div>

            {/* Mobile Storefront Body */}
            <div className="space-y-3 p-3.5">
              {/* Storefront Header */}
              <div className="border-border/60 flex items-center gap-2.5 border-b pb-2.5">
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full text-xs font-bold">
                  {storeName ? storeName.charAt(0).toUpperCase() : 'T'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className="text-foreground truncate text-xs font-bold"
                    data-testid="preview-store-name"
                  >
                    {storeName || 'Nama Toko'}
                  </h4>
                  <p className="text-muted-foreground flex items-center gap-1 text-[10px]">
                    <Clock className="text-primary size-2.5" />
                    <span>Buka • Pesan Cepat</span>
                  </p>
                </div>
              </div>

              {/* Category Pill */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 font-medium">
                  {categoryName}
                </span>
                <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                  Menu Populer
                </span>
              </div>

              {/* Customer Product Card */}
              <div className="border-border bg-card space-y-2 rounded-xl border p-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <h5
                      className="text-foreground line-clamp-2 text-xs leading-tight font-semibold"
                      data-testid="preview-product-name"
                    >
                      {productName || 'Nama Produk'}
                    </h5>
                    <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <span>Varian:</span>
                      <span
                        className="text-foreground bg-secondary rounded px-1.5 py-0.5 font-medium"
                        data-testid="preview-variant-option"
                      >
                        {variantOption || 'Standar'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <ShoppingBag className="size-5" />
                  </div>
                </div>

                <div className="border-border/40 flex items-center justify-between border-t pt-1">
                  <span
                    className="text-primary font-mono text-xs font-bold tabular-nums"
                    data-testid="preview-product-price"
                  >
                    {formatCurrency(price)}
                  </span>
                  <div className="bg-primary text-primary-foreground inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[10px] font-semibold">
                    <MessageCircle className="size-2.5" />
                    <span>Pesan</span>
                  </div>
                </div>
              </div>

              {/* Mobile Storefront WhatsApp Order Bar */}
              <div className="border-primary/20 bg-primary/10 flex items-center justify-between rounded-lg border p-2 text-[11px]">
                <div className="text-primary flex items-center gap-1.5 font-medium">
                  <MessageCircle className="size-3.5" />
                  <span>Order via WA</span>
                </div>
                <span className="text-foreground font-mono text-[10px] font-bold">
                  {formatCurrency(price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
