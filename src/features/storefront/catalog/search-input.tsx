'use client'

import type { ProductCatalogSearchInputProps } from './types'

import { cn } from 'cn'
import { SearchIcon, XIcon } from 'lucide-react'

import { useProductCatalog } from './context'

export function ProductCatalogSearchInput({
  value: controlledValue,
  onChange: controlledOnChange,
  placeholder = 'Cari produk...',
  showIcon = true,
  clearable = true,
  className,
  id = 'catalog-search-input',
  ...props
}: ProductCatalogSearchInputProps) {
  const { searchQuery, setSearchQuery } = useProductCatalog()

  const value = controlledValue !== undefined ? controlledValue : searchQuery
  const onChange = controlledOnChange !== undefined ? controlledOnChange : setSearchQuery

  const handleClear = () => {
    onChange('')
  }

  return (
    <div
      className={cn('relative flex w-full max-w-sm items-center', className)}
      data-slot="catalog-search"
    >
      {showIcon && (
        <SearchIcon
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute left-3 size-4"
          data-icon="inline-start"
        />
      )}

      <input
        aria-label={placeholder}
        id={id}
        placeholder={placeholder}
        role="searchbox"
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          showIcon ? 'pl-9' : 'pl-3',
          clearable && value ? 'pr-9' : 'pr-3',
        )}
        {...props}
      />

      {clearable && Boolean(value) && (
        <button
          aria-label="Hapus pencarian"
          className="text-muted-foreground hover:text-foreground absolute right-2.5 flex size-5 items-center justify-center rounded-full transition-colors"
          type="button"
          onClick={handleClear}
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}
