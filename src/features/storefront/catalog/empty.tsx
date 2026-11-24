'use client'

import type { ProductCatalogEmptyProps } from './types'

import { cn } from 'cn'
import { PackageOpenIcon, RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

import { useOptionalProductCatalog } from './context'

export function ProductCatalogEmpty({
  title = 'Produk Tidak Ditemukan',
  description = 'Tidak ada produk yang sesuai dengan filter atau kata kunci pencarian Anda.',
  actionLabel = 'Reset Filter',
  onReset: explicitOnReset,
  showReset = true,
  icon,
  className,
  ...props
}: ProductCatalogEmptyProps) {
  const context = useOptionalProductCatalog()
  const contextIsEmpty = context ? context.isEmpty : true
  const contextReset = context?.resetFilters
  // Only render when empty
  if (!contextIsEmpty) {
    return null
  }

  const handleReset = explicitOnReset ?? contextReset

  return (
    <Empty className={cn('border-muted py-12', className)} data-slot="catalog-empty" {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon ?? <PackageOpenIcon className="text-muted-foreground size-5" />}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      {showReset && handleReset && (
        <EmptyContent>
          <Button
            className="cursor-pointer"
            size="sm"
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcwIcon className="size-3.5" data-icon="inline-start" />
            <span>{actionLabel}</span>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
