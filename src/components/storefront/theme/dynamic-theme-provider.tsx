import type { CSSProperties, ReactNode } from 'react'

import { cn } from 'cn'

import { generateThemePalette } from '@/lib/color-utils'

export interface DynamicThemeProviderProps {
  children: ReactNode
  themeColor?: string
  className?: string
  style?: CSSProperties
  as?: 'div' | 'main' | 'section'
}

export function DynamicThemeProvider({
  children,
  themeColor = '#6366f1',
  className,
  style: explicitStyle,
  as: Component = 'div',
}: DynamicThemeProviderProps) {
  const palette = generateThemePalette(themeColor)

  const themeStyle = {
    '--brand-primary': palette.primary,
    '--brand-hover': palette.hover,
    '--brand-light': palette.light,
    '--brand-dark': palette.dark,
    ...explicitStyle,
  } as CSSProperties

  return (
    <Component
      style={themeStyle}
      className={cn('selection:bg-brand-primary/30 min-h-screen font-sans', className)}
    >
      {children}
    </Component>
  )
}
