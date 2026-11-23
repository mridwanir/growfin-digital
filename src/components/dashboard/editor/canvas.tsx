/* oxlint-disable react/iframe-missing-sandbox -- preview iframe requires scripts and same-origin messaging */
'use client'

import { cn } from 'cn'

import { useStorefrontEditor } from './context'

export interface StorefrontEditorCanvasProps {
  className?: string
}

export function StorefrontEditorCanvas({ className }: StorefrontEditorCanvasProps) {
  const { activeViewport, dispatchPreviewUpdate, iframeRef, tenant } = useStorefrontEditor()

  const viewportWidthClass = {
    desktop: 'w-full max-w-full',
    mobile: 'w-[375px] max-w-[375px]',
    tablet: 'w-[768px] max-w-[768px]',
  }[activeViewport]

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
        className={cn(
          'bg-background relative flex h-[780px] flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 ease-in-out',
          viewportWidthClass,
        )}
      >
        <div className="bg-muted/50 text-muted-foreground flex h-7 items-center justify-between border-b px-3 text-[11px] select-none">
          <span className="truncate">/preview/{tenant.slug}</span>
          <span className="capitalize">{activeViewport} view</span>
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
