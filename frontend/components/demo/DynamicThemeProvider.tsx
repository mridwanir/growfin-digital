'use client';

import { ReactNode } from 'react';
import { generateThemePalette } from '@/lib/color-utils';

interface DynamicThemeProviderProps {
  children: ReactNode;
  themeColor?: string; // Hex color
}

export function DynamicThemeProvider({ children, themeColor = '#6366f1' }: DynamicThemeProviderProps) {
  // Generate the color palette
  const palette = generateThemePalette(themeColor);

  // Define CSS variables to inject
  const style = {
    '--brand-primary': palette.primary,
    '--brand-hover': palette.hover,
    '--brand-light': palette.light,
    '--brand-dark': palette.dark,
  } as React.CSSProperties;

  return (
    <div style={style} className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-primary/30">
      {children}
    </div>
  );
}
