export type ThemeKey = 'medical-blue' | 'rose-aesthetic' | 'emerald-health' | 'luxury-dark';

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  icon: string;
  categoryHint: string;
  primaryBg: string;
  primaryHoverBg: string;
  textAccent: string;
  lightBg: string;
  borderColor: string;
  ringColor: string;
  badgeStyle: string;
  shadowGlow: string;
  gradientHeader: string;
  cardActiveBorder: string;
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  'medical-blue': {
    key: 'medical-blue',
    name: 'Medical Blue',
    icon: '🟦',
    categoryHint: 'Gigi & Umum',
    primaryBg: 'bg-blue-600',
    primaryHoverBg: 'hover:bg-blue-700',
    textAccent: 'text-blue-600',
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    ringColor: 'ring-blue-500/20',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    shadowGlow: 'shadow-blue-500/25',
    gradientHeader: 'from-blue-600 to-indigo-600',
    cardActiveBorder: 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20',
  },
  'rose-aesthetic': {
    key: 'rose-aesthetic',
    name: 'Rose Aesthetic',
    icon: '🌸',
    categoryHint: 'Skincare & Kecantikan',
    primaryBg: 'bg-rose-500',
    primaryHoverBg: 'hover:bg-rose-600',
    textAccent: 'text-rose-500',
    lightBg: 'bg-rose-50',
    borderColor: 'border-rose-200',
    ringColor: 'ring-rose-500/20',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    shadowGlow: 'shadow-rose-500/25',
    gradientHeader: 'from-rose-500 to-pink-600',
    cardActiveBorder: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20',
  },
  'emerald-health': {
    key: 'emerald-health',
    name: 'Emerald Health',
    icon: '🌿',
    categoryHint: 'Herbal & Holistic',
    primaryBg: 'bg-emerald-600',
    primaryHoverBg: 'hover:bg-emerald-700',
    textAccent: 'text-emerald-600',
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    ringColor: 'ring-emerald-500/20',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    shadowGlow: 'shadow-emerald-500/25',
    gradientHeader: 'from-emerald-600 to-teal-600',
    cardActiveBorder: 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20',
  },
  'luxury-dark': {
    key: 'luxury-dark',
    name: 'Luxury Dark',
    icon: '🌙',
    categoryHint: 'Bedah & Estetika Premium',
    primaryBg: 'bg-amber-500',
    primaryHoverBg: 'hover:bg-amber-600',
    textAccent: 'text-amber-500',
    lightBg: 'bg-amber-950/30',
    borderColor: 'border-amber-500/30',
    ringColor: 'ring-amber-500/20',
    badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    shadowGlow: 'shadow-amber-500/25',
    gradientHeader: 'from-amber-600 to-slate-950',
    cardActiveBorder: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/20',
  },
};

export const getDefaultTheme = (categoryName: string): ThemeKey => {
  const cat = categoryName.toLowerCase();
  if (cat.includes('kecantikan') || cat.includes('aesthetic') || cat.includes('skincare')) {
    return 'rose-aesthetic';
  }
  if (cat.includes('herbal') || cat.includes('natural') || cat.includes('holistic')) {
    return 'emerald-health';
  }
  return 'medical-blue';
};
