import type { ComponentType } from 'react'

import type { StorefrontLayoutProps } from './types'

import { ArtisanLayout as FnbArtisanLayout } from './fnb/artisan'
import { BoldLayout } from './fnb/bold'
import { ClassicLayout } from './fnb/classic'
import { ElegantLayout } from './fnb/elegant'
import { ModernLayout } from './fnb/modern'
import { PremiumLayout } from './fnb/premium'
import { VibrantLayout } from './fnb/vibrant'
import { RetailArtisanLayout } from './retail/artisan'
import { DarkLayout } from './retail/dark'
import { EditorialLayout } from './retail/editorial'
import { FreshLayout } from './retail/fresh'
import { TechLayout } from './retail/tech'
import { UrbanLayout } from './retail/urban'

// ---------------------------------------------------------------------------
// Layout Exports
// ---------------------------------------------------------------------------

// 7 F&B Layouts
export {
  FnbArtisanLayout as ArtisanLayout,
  BoldLayout,
  ClassicLayout,
  ElegantLayout,
  ModernLayout,
  PremiumLayout,
  VibrantLayout,
}

// 6 Retail Layouts
export { DarkLayout, EditorialLayout, FreshLayout, RetailArtisanLayout, TechLayout, UrbanLayout }

// Base & Types
export type { StorefrontLayoutProps } from './types'

// ---------------------------------------------------------------------------
// Layout Registry & Resolver Map
// ---------------------------------------------------------------------------

export const THEME_LAYOUTS: Record<string, ComponentType<StorefrontLayoutProps>> = {
  // F&B layouts
  artisan: FnbArtisanLayout,
  bold: BoldLayout,
  classic: ClassicLayout,
  elegant: ElegantLayout,
  'fnb-theme-artisan': FnbArtisanLayout,
  'fnb-theme-bold': BoldLayout,
  'fnb-theme-classic': ClassicLayout,
  'fnb-theme-elegant': ElegantLayout,
  'fnb-theme-modern': ModernLayout,
  'fnb-theme-premium': PremiumLayout,
  'fnb-theme-vibrant': VibrantLayout,
  modern: ModernLayout,
  'modern-default': ClassicLayout,
  premium: PremiumLayout,
  vibrant: VibrantLayout,

  // Retail layouts
  dark: DarkLayout,
  editorial: EditorialLayout,
  fresh: FreshLayout,
  'retail-artisan': RetailArtisanLayout,
  'retail-theme-artisan': RetailArtisanLayout,
  'retail-theme-dark': DarkLayout,
  'retail-theme-editorial': EditorialLayout,
  'retail-theme-fresh': FreshLayout,
  'retail-theme-tech': TechLayout,
  'retail-theme-urban': UrbanLayout,
  tech: TechLayout,
  urban: UrbanLayout,
}

export function getStorefrontLayout(
  layoutId?: string | null,
  archetype?: 'fnb' | 'retail',
): ComponentType<StorefrontLayoutProps> {
  if (layoutId && THEME_LAYOUTS[layoutId]) {
    return THEME_LAYOUTS[layoutId]
  }

  if (archetype === 'retail') {
    return UrbanLayout
  }

  return ClassicLayout
}
