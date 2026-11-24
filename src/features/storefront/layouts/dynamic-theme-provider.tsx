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
    '--brand-dark': palette.dark,
    '--brand-hover': palette.hover,
    '--brand-light': palette.light,
    '--brand-primary': palette.primary,
    ...explicitStyle,
  } as CSSProperties

  return (
    <Component className={cn('min-h-screen font-sans', className)} style={themeStyle}>
      {children}
    </Component>
  )
}
