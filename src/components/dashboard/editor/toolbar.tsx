'use client'

import type { KeyboardEvent } from 'react'

import type { ViewportMode } from './context'

import { cn } from 'cn'
import { AlertCircle, Check, Loader2, Monitor, Smartphone, Tablet } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { useStorefrontEditor } from './context'

export interface StorefrontEditorToolbarProps {
  className?: string
}

const VIEWPORT_OPTIONS: Array<{
  ariaLabel: string
  icon: typeof Smartphone
  label: string
  mode: ViewportMode
}> = [
  {
    ariaLabel: 'Mobile (375px)',
    icon: Smartphone,
    label: 'Mobile',
    mode: 'mobile',
  },
  {
    ariaLabel: 'Tablet (768px)',
    icon: Tablet,
    label: 'Tablet',
    mode: 'tablet',
  },
  {
    ariaLabel: 'Desktop (100%)',
    icon: Monitor,
    label: 'Desktop',
    mode: 'desktop',
  },
]

export function StorefrontEditorToolbar({ className }: StorefrontEditorToolbarProps) {
  const {
    activeViewport,
    isPending,
    isPublishing,
    publishDraft,
    publishError,
    publishNotification,
    saveStatus,
    setActiveViewport,
  } = useStorefrontEditor()

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const modes: ViewportMode[] = ['mobile', 'tablet', 'desktop']
    const currentIndex = modes.indexOf(activeViewport)
    let targetIndex = -1

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      targetIndex = (currentIndex + 1) % modes.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      targetIndex = (currentIndex - 1 + modes.length) % modes.length
    }

    if (targetIndex >= 0) {
      const nextMode = modes[targetIndex]
      if (nextMode) {
        setActiveViewport(nextMode)
        const buttons = event.currentTarget.querySelectorAll('button')
        buttons[targetIndex]?.focus()
      }
    }
  }

  return (
    <header
      aria-label="Storefront editor toolbar"
      data-slot="storefront-editor-toolbar"
      className={cn(
        'bg-background flex h-14 shrink-0 items-center justify-between border-b px-4',
        className,
      )}
    >
      <ToggleGroup
        aria-label="Device viewport"
        className="bg-muted/40 rounded-lg border p-1"
        orientation="horizontal"
        size="sm"
        value={[activeViewport]}
        onKeyDown={handleViewportKeyDown}
        onValueChange={val => {
          const next = val[val.length - 1] as ViewportMode | undefined
          if (next) {
            setActiveViewport(next)
          }
        }}
      >
        {VIEWPORT_OPTIONS.map(({ ariaLabel, icon: Icon, label, mode }) => (
          <ToggleGroupItem
            key={mode}
            aria-label={ariaLabel}
            className="data-pressed:bg-background data-pressed:text-foreground h-7 gap-1.5 px-2.5 text-xs font-medium data-pressed:shadow-xs"
            value={mode}
          >
            <Icon className="size-3.5" />
            <span>{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex items-center gap-3">
        {publishNotification && (
          <div
            aria-live="polite"
            className="bg-card animate-in fade-in flex items-center gap-1.5 rounded-md border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-600 shadow-xs dark:text-emerald-400"
            data-slot="publish-toast"
            role="status"
          >
            <Check className="size-3.5 text-emerald-500" />
            <span>{publishNotification}</span>
          </div>
        )}
        {publishError && (
          <div
            className="text-destructive flex items-center gap-1.5 text-xs font-medium"
            role="alert"
          >
            <AlertCircle className="size-3.5" />
            <span>{publishError}</span>
          </div>
        )}

        {saveStatus === 'saving' && (
          <Badge
            className="gap-1 text-xs font-normal"
            data-testid="save-status-saving"
            variant="secondary"
          >
            <Loader2 className="size-3 animate-spin" />
            <span>Saving...</span>
          </Badge>
        )}
        {saveStatus === 'saved' && (
          <Badge
            className="text-muted-foreground gap-1 text-xs font-normal"
            data-testid="save-status-saved"
            variant="outline"
          >
            <Check className="size-3 text-emerald-500" />
            <span>Saved</span>
          </Badge>
        )}
        {saveStatus === 'error' && (
          <Badge
            className="gap-1 text-xs font-normal"
            data-testid="save-status-error"
            variant="destructive"
          >
            <AlertCircle className="size-3" />
            <span>Save error</span>
          </Badge>
        )}
        {saveStatus === 'idle' && (
          <Badge
            className="text-muted-foreground gap-1 text-xs font-normal"
            data-testid="save-status-idle"
            variant="outline"
          >
            <span>Saved</span>
          </Badge>
        )}
        <Button
          disabled={isPending || isPublishing || saveStatus === 'saving'}
          size="sm"
          type="button"
          variant="default"
          onClick={() => publishDraft()}
        >
          {isPublishing ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            'Publish'
          )}
        </Button>
      </div>
    </header>
  )
}
