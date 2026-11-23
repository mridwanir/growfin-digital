'use client'

import { cn } from 'cn'
import { Check, Loader2, Monitor, Smartphone, Tablet } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useStorefrontEditor } from './context'

export interface StorefrontEditorToolbarProps {
  className?: string
}

export function StorefrontEditorToolbar({ className }: StorefrontEditorToolbarProps) {
  const { activeViewport, isPending, saveStatus, setActiveViewport } = useStorefrontEditor()

  return (
    <header
      aria-label="Storefront editor toolbar"
      data-slot="storefront-editor-toolbar"
      className={cn(
        'bg-background flex h-14 shrink-0 items-center justify-between border-b px-4',
        className,
      )}
    >
      <div className="bg-muted/30 flex items-center gap-1.5 rounded-lg border p-0.5">
        <Button
          aria-label="Mobile (375px)"
          className="h-7 gap-1.5 px-2.5 text-xs"
          size="sm"
          type="button"
          variant={activeViewport === 'mobile' ? 'secondary' : 'ghost'}
          onClick={() => setActiveViewport('mobile')}
        >
          <Smartphone className="size-3.5" />
          <span>Mobile</span>
        </Button>

        <Button
          aria-label="Tablet (768px)"
          className="h-7 gap-1.5 px-2.5 text-xs"
          size="sm"
          type="button"
          variant={activeViewport === 'tablet' ? 'secondary' : 'ghost'}
          onClick={() => setActiveViewport('tablet')}
        >
          <Tablet className="size-3.5" />
          <span>Tablet</span>
        </Button>

        <Button
          aria-label="Desktop (100%)"
          className="h-7 gap-1.5 px-2.5 text-xs"
          size="sm"
          type="button"
          variant={activeViewport === 'desktop' ? 'secondary' : 'ghost'}
          onClick={() => setActiveViewport('desktop')}
        >
          <Monitor className="size-3.5" />
          <span>Desktop</span>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {saveStatus === 'saving' && (
          <Badge className="gap-1 text-xs font-normal" variant="secondary">
            <Loader2 className="size-3 animate-spin" />
            <span>Saving...</span>
          </Badge>
        )}
        {saveStatus === 'saved' && (
          <Badge className="text-muted-foreground gap-1 text-xs font-normal" variant="outline">
            <Check className="size-3 text-emerald-500" />
            <span>Saved</span>
          </Badge>
        )}
        {saveStatus === 'error' && (
          <Badge className="gap-1 text-xs font-normal" variant="destructive">
            <span>Save error</span>
          </Badge>
        )}
        {saveStatus === 'idle' && (
          <Badge className="text-muted-foreground gap-1 text-xs font-normal" variant="outline">
            <span>Saved</span>
          </Badge>
        )}

        <Button
          disabled={isPending || saveStatus === 'saving'}
          size="sm"
          type="button"
          variant="default"
        >
          Publish
        </Button>
      </div>
    </header>
  )
}
