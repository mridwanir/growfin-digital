'use client'

import {
  ChevronDownIcon,
  ChevronUpIcon,
  CoffeeIcon,
  PaletteIcon,
  ShoppingBagIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { AVAILABLE_THEMES } from '@/lib/storefront/mock-data'

interface ThemePreviewBarProps {
  currentThemeId: string
}

export function ThemePreviewBar({ currentThemeId }: ThemePreviewBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const activeTheme = AVAILABLE_THEMES.find(t => t.id === currentThemeId) || AVAILABLE_THEMES[0]

  const fnbThemes = AVAILABLE_THEMES.filter(t => t.archetype === 'fnb')
  const retailThemes = AVAILABLE_THEMES.filter(t => t.archetype === 'retail')

  return (
    <aside
      aria-label="Theme Preview Switcher"
      className="border-border/80 bg-background/95 sticky top-0 z-50 w-full border-b shadow-xs backdrop-blur-md transition-all duration-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Active Theme Indicator */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-xs">
              <PaletteIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-foreground truncate text-xs font-semibold tracking-tight">
                  Storefront Theme Preview
                </span>
                <span
                  style={{ backgroundColor: `${activeTheme.color}20`, color: activeTheme.color }}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                >
                  <span
                    style={{ backgroundColor: activeTheme.color }}
                    className="size-1.5 animate-pulse rounded-full"
                  />
                  {activeTheme.label} ({activeTheme.archetype.toUpperCase()})
                </span>
              </div>
              <p className="text-muted-foreground hidden truncate text-[11px] sm:block">
                {activeTheme.description}
              </p>
            </div>
          </div>

          {/* Actions & Collapse Toggle */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="border-border text-foreground hover:bg-muted/80 inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors"
            >
              {isCollapsed ? (
                <>
                  <span>Pilih Tema</span>
                  <ChevronDownIcon className="size-3.5" />
                </>
              ) : (
                <>
                  <span>Sembunyikan</span>
                  <ChevronUpIcon className="size-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Theme Picker */}
        {!isCollapsed && (
          <div className="border-border/60 animate-in fade-in-50 mt-3 space-y-2.5 border-t pt-3 duration-150">
            {/* F&B Themes */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground mr-1 inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase">
                <CoffeeIcon className="size-3 text-amber-600" />
                F&B (7):
              </span>
              {fnbThemes.map(theme => {
                const isActive = theme.id === activeTheme.id
                return (
                  <Link
                    key={theme.id}
                    href={`/preview?theme=${theme.id}`}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-foreground text-background ring-primary/20 scale-[1.02] shadow-xs ring-2'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: theme.color }}
                      className="size-2 shrink-0 rounded-full"
                    />
                    {theme.label}
                  </Link>
                )
              })}
            </div>

            {/* Retail Themes */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground mr-1 inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase">
                <ShoppingBagIcon className="size-3 text-blue-600" />
                Retail (6):
              </span>
              {retailThemes.map(theme => {
                const isActive = theme.id === activeTheme.id
                return (
                  <Link
                    key={theme.id}
                    href={`/preview?theme=${theme.id}`}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-foreground text-background ring-primary/20 scale-[1.02] shadow-xs ring-2'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: theme.color }}
                      className="size-2 shrink-0 rounded-full"
                    />
                    {theme.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
