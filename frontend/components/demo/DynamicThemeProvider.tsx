'use client';

import { ReactNode } from 'react';
import { generateThemePalette } from '@/lib/color-utils';

interface DynamicThemeProviderProps {
  children: ReactNode;
  themeColor?: string; // Hex color
  vibe?: 'minimalist' | 'playful' | 'luxury';
}

export function DynamicThemeProvider({ children, themeColor = '#6366f1', vibe = 'minimalist' }: DynamicThemeProviderProps) {
  console.log("DynamicThemeProvider initialized with themeColor:", themeColor, "and vibe:", vibe);
  // Generate the color palette
  const palette = generateThemePalette(themeColor);

  // Determine structural aesthetics based on vibe
  let radius = '0.5rem'; // Default minimalist
  if (vibe === 'playful') {
    radius = '9999px'; // Fully rounded
  } else if (vibe === 'luxury') {
    radius = '0.25rem'; // Sharp
  }

  // Define CSS variables to inject
  const style = {
    '--brand-primary': palette.primary,
    '--brand-hover': palette.hover,
    '--brand-light': palette.light,
    '--brand-dark': palette.dark,
    '--brand-radius': radius,
  } as React.CSSProperties;

  // For luxury vibe, we might force dark mode or give a very dark background
  const containerClass = vibe === 'luxury' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';

  return (
    <div style={style} className={`min-h-screen ${containerClass} font-sans selection:bg-brand-primary/30`}>
      {children}
    </div>
  );
}
