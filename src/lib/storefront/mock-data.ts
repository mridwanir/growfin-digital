export interface ThemeOption {
  id: string
  label: string
  archetype: 'fnb' | 'retail'
  description: string
  color: string
}

export const AVAILABLE_THEMES: ThemeOption[] = [
  // F&B Themes (7)
  {
    id: 'fnb-theme-classic',
    archetype: 'fnb',
    color: '#d97706',
    description: 'Bistro hangat, serif klasik, card rounded-lg',
    label: 'Classic',
  },
  {
    id: 'fnb-theme-modern',
    archetype: 'fnb',
    color: '#059669',
    description: 'Clean sans-serif, elevated cards, category pills',
    label: 'Modern',
  },
  {
    id: 'fnb-theme-premium',
    archetype: 'fnb',
    color: '#b45309',
    description: 'Luxury serif, sharp borders, ghost category bar',
    label: 'Premium',
  },
  {
    id: 'fnb-theme-artisan',
    archetype: 'fnb',
    color: '#78350f',
    description: 'Warm cafe vibe, masonry gallery, elevated cards',
    label: 'Artisan',
  },
  {
    id: 'fnb-theme-elegant',
    archetype: 'fnb',
    color: '#4338ca',
    description: 'Fine dining typography, 4-column catalog grid',
    label: 'Elegant',
  },
  {
    id: 'fnb-theme-bold',
    archetype: 'fnb',
    color: '#dc2626',
    description: 'High-contrast branding, bold hero, sharp borders',
    label: 'Bold',
  },
  {
    id: 'fnb-theme-vibrant',
    archetype: 'fnb',
    color: '#ea580c',
    description: 'Energetic full-rounded cards, cheerful styling',
    label: 'Vibrant',
  },

  // Retail Themes (6)
  {
    id: 'retail-theme-urban',
    archetype: 'retail',
    color: '#09090b',
    description: 'Streetwear aesthetic, split hero, rounded-lg cards',
    label: 'Urban',
  },
  {
    id: 'retail-theme-editorial',
    archetype: 'retail',
    color: '#18181b',
    description: 'High-fashion boutique, serif typography, sharp cards',
    label: 'Editorial',
  },
  {
    id: 'retail-theme-tech',
    archetype: 'retail',
    color: '#2563eb',
    description: 'Gadget minimalist, compact cards, ghost tabs',
    label: 'Tech',
  },
  {
    id: 'retail-theme-dark',
    archetype: 'retail',
    color: '#030712',
    description: 'Midnight theme, dark tokens, elevated cards',
    label: 'Dark',
  },
  {
    id: 'retail-theme-fresh',
    archetype: 'retail',
    color: '#16a34a',
    description: 'Clean organic market, full-rounded cards, pills bar',
    label: 'Fresh',
  },
  {
    id: 'retail-theme-artisan',
    archetype: 'retail',
    color: '#854d0e',
    description: 'Handcrafted goods, warm serif typography',
    label: 'Retail Artisan',
  },
]
