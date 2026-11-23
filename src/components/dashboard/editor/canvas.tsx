/* oxlint-disable react/iframe-missing-sandbox -- preview iframe requires scripts and same-origin messaging */
'use client'

import type { ViewportMode } from './context'

import { cn } from 'cn'

import { useStorefrontEditor } from './context'

interface ViewportConfiguration {
  containerClass: string
  label: string
}

const VIEWPORT_CONFIG: Record<ViewportMode, ViewportConfiguration> = {
  desktop: {
    containerClass: 'w-full max-w-full h-full',
    label: 'Desktop (100%)',
  },
  mobile: {
    containerClass: 'w-full max-w-[375px] h-[780px] max-h-full',
    label: 'Mobile (375px)',
  },
  tablet: {
    containerClass: 'w-full max-w-[768px] h-[780px] max-h-full',
    label: 'Tablet (768px)',
  },
}
export interface StorefrontEditorCanvasProps {
  className?: string
}

export function StorefrontEditorCanvas({ className }: StorefrontEditorCanvasProps) {
  const { activeViewport, dispatchPreviewUpdate, iframeRef, tenant } = useStorefrontEditor()
  const currentViewport = VIEWPORT_CONFIG[activeViewport]

  return (
    <main
      aria-label="Storefront preview canvas"
      data-slot="storefront-editor-canvas"
      className={cn(
        'bg-muted/30 flex flex-1 items-center justify-center overflow-auto p-4 md:p-6',
        className,
      )}
    >
      <div
        data-testid="canvas-device-frame"
        data-viewport={activeViewport}
        className={cn(
          'bg-background relative m-auto flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 ease-in-out',
          currentViewport.containerClass,
        )}
      >
        <div className="bg-muted/50 text-muted-foreground flex h-7 shrink-0 items-center justify-between border-b px-3 text-[11px] select-none">
          <span className="truncate font-mono">/preview/{tenant.slug}</span>
          <span className="font-medium" data-testid="canvas-viewport-label">
            {currentViewport.label}
          </span>
        </div>
        <iframe
          ref={iframeRef}
          className="bg-background size-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          src={`/preview/${tenant.slug}`}
          title="Storefront Preview"
          onLoad={() => dispatchPreviewUpdate()}
        />
      </div>
    </main>
  )
}
