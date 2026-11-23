'use client'

import type { SectionType, StorefrontSection } from '@/db/schema/tenants'

import { cn } from 'cn'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

import { useStorefrontEditor } from './context'

const SECTION_LABELS: Record<SectionType, string> = {
  catalog: 'Catalog',
  footer: 'Footer',
  gallery: 'Gallery',
  hero: 'Hero',
  operating_hours: 'Operating hours',
  reviews: 'Reviews',
}

export interface StorefrontEditorSidebarProps {
  className?: string
}

export function StorefrontEditorSidebar({ className }: StorefrontEditorSidebarProps) {
  const {
    moveSection,
    sections,
    selectedSectionId,
    setSelectedSectionId,
    toggleSectionVisibility,
  } = useStorefrontEditor()

  return (
    <aside
      aria-label="Storefront sections"
      className={cn('bg-background flex w-64 shrink-0 flex-col border-r', className)}
      data-slot="storefront-editor-sidebar"
    >
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Sections</h2>
        <p className="text-muted-foreground text-xs">
          Reorder sections or toggle their visibility.
        </p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {sections.map((section: StorefrontSection, index: number) => {
          const label = SECTION_LABELS[section.type] ?? section.type
          const isSelected = selectedSectionId === section.id
          const isFirst = index === 0
          const isLast = index === sections.length - 1

          return (
            <div
              key={section.id}
              data-selected={isSelected}
              className={cn(
                'flex items-center justify-between gap-1 rounded-lg border p-2 transition-colors',
                isSelected
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border/60 hover:bg-muted/40',
                !section.isVisible && 'opacity-60',
              )}
            >
              <button
                className="flex flex-1 items-center gap-2 text-left text-sm font-medium focus-visible:outline-hidden"
                type="button"
                onClick={() => setSelectedSectionId(section.id)}
              >
                <span>{label}</span>
              </button>

              <div className="flex items-center gap-0.5">
                <Button
                  aria-label={`Move ${label} up`}
                  disabled={isFirst}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                  onClick={() => moveSection(section.id, 'up')}
                >
                  <ChevronUp className="size-3.5" />
                </Button>

                <Button
                  aria-label={`Move ${label} down`}
                  disabled={isLast}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                  onClick={() => moveSection(section.id, 'down')}
                >
                  <ChevronDown className="size-3.5" />
                </Button>

                <div className="ml-1 flex items-center">
                  <Switch
                    aria-label={`Toggle ${label} visibility`}
                    checked={section.isVisible}
                    size="sm"
                    onCheckedChange={checked => toggleSectionVisibility(section.id, checked)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
