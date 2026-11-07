export type ThemeKey = 'medical-blue' | 'rose-aesthetic' | 'emerald-health' | 'luxury-dark'

export interface ThemeConfig {
  key: ThemeKey
  name: string
  icon: string
  categoryHint: string
  primaryBg: string
  primaryHoverBg: string
  textAccent: string
  lightBg: string
  borderColor: string
  ringColor: string
  badgeStyle: string
  shadowGlow: string
  gradientHeader: string
  cardActiveBorder: string
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  'emerald-health': {
    key: 'emerald-health',
    name: 'Emerald Health',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderColor: 'border-emerald-200',
    cardActiveBorder: 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20',
    categoryHint: 'Herbal & Holistic',
    gradientHeader: 'from-emerald-600 to-teal-600',
    icon: '🌿',
    lightBg: 'bg-emerald-50',
    primaryBg: 'bg-emerald-600',
    primaryHoverBg: 'hover:bg-emerald-700',
    ringColor: 'ring-emerald-500/20',
    shadowGlow: 'shadow-emerald-500/25',
    textAccent: 'text-emerald-600',
  },
  'luxury-dark': {
    key: 'luxury-dark',
    name: 'Luxury Dark',
    badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30',
    cardActiveBorder: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/20',
    categoryHint: 'Bedah & Estetika Premium',
    gradientHeader: 'from-amber-600 to-slate-950',
    icon: '🌙',
    lightBg: 'bg-amber-950/30',
    primaryBg: 'bg-amber-500',
    primaryHoverBg: 'hover:bg-amber-600',
    ringColor: 'ring-amber-500/20',
    shadowGlow: 'shadow-amber-500/25',
    textAccent: 'text-amber-500',
  },
  'medical-blue': {
    key: 'medical-blue',
    name: 'Medical Blue',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    borderColor: 'border-blue-200',
    cardActiveBorder: 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20',
    categoryHint: 'Gigi & Umum',
    gradientHeader: 'from-blue-600 to-indigo-600',
    icon: '🟦',
    lightBg: 'bg-blue-50',
    primaryBg: 'bg-blue-600',
    primaryHoverBg: 'hover:bg-blue-700',
    ringColor: 'ring-blue-500/20',
    shadowGlow: 'shadow-blue-500/25',
    textAccent: 'text-blue-600',
  },
  'rose-aesthetic': {
    key: 'rose-aesthetic',
    name: 'Rose Aesthetic',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    borderColor: 'border-rose-200',
    cardActiveBorder: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20',
    categoryHint: 'Skincare & Kecantikan',
    gradientHeader: 'from-rose-500 to-pink-600',
    icon: '🌸',
    lightBg: 'bg-rose-50',
    primaryBg: 'bg-rose-500',
    primaryHoverBg: 'hover:bg-rose-600',
    ringColor: 'ring-rose-500/20',
    shadowGlow: 'shadow-rose-500/25',
    textAccent: 'text-rose-500',
  },
}

export const getDefaultTheme = (categoryName: string): ThemeKey => {
  const cat = categoryName.toLowerCase()
  if (cat.includes('kecantikan') || cat.includes('aesthetic') || cat.includes('skincare')) {
    return 'rose-aesthetic'
  }
  if (cat.includes('herbal') || cat.includes('natural') || cat.includes('holistic')) {
    return 'emerald-health'
  }
  return 'medical-blue'
}
