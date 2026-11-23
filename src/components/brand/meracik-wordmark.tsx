import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const wordmarkVariants = cva(
  'font-plus-jakarta inline-flex items-baseline font-extrabold tracking-tight select-none',
  {
    defaultVariants: {
      size: 'md',
    },
    variants: {
      size: {
        lg: 'text-2xl',
        md: 'text-xl',
        sm: 'text-base',
        xl: 'text-3xl',
      },
    },
  },
)

export interface MeracikWordmarkProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof wordmarkVariants> {}

export function MeracikWordmark({ className, size, ...props }: MeracikWordmarkProps) {
  return (
    <span
      aria-label="MeracikWeb"
      className={cn(wordmarkVariants({ size }), className)}
      role="img"
      {...props}
    >
      <span className="text-foreground">Meracik</span>
      <span className="text-primary italic">Web</span>
    </span>
  )
}
