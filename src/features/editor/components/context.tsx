'use client'

import type { RefObject } from 'react'

import type {
  StorefrontConfig,
  StorefrontSection,
  StorefrontTheme,
  Tenant,
} from '@/db/schema/tenants'
import type { MeracikPreviewUpdatePayload } from '@/features/storefront'

import { createContext, use } from 'react'

export type ViewportMode = 'mobile' | 'tablet' | 'desktop'
export type SaveStatus = 'idle' | 'saved' | 'saving' | 'error'

export interface StorefrontEditorContextValue {
  activeViewport: ViewportMode
  dispatchPreviewUpdate: (payload?: MeracikPreviewUpdatePayload) => void
  draft: StorefrontConfig
  iframeRef: RefObject<HTMLIFrameElement | null>
  isPending: boolean
  isPublishing: boolean
  moveSection: (sectionId: string, direction: 'up' | 'down') => void
  publishDraft: () => Promise<void>
  publishError: string | null
  publishNotification: string | null
  reorderSections: (newSections: StorefrontSection[]) => void
  saveStatus: SaveStatus
  sections: StorefrontSection[]
  selectedSectionId: string | null
  setActiveViewport: (viewport: ViewportMode) => void
  setSaveStatus: (status: SaveStatus) => void
  setPublishNotification: (notification: string | null) => void
  setSelectedSectionId: (id: string | null) => void
  tenant: Tenant
  theme: StorefrontTheme
  toggleSectionVisibility: (sectionId: string, isVisible?: boolean) => void
  updateSectionContent: <T extends Record<string, unknown> = Record<string, unknown>>(
    sectionId: string,
    content: Partial<T> | ((prev: T) => T),
  ) => void
  updateTheme: (theme: Partial<StorefrontTheme>) => void
}

export const StorefrontEditorContext = createContext<StorefrontEditorContextValue | null>(null)

export function useStorefrontEditor(): StorefrontEditorContextValue {
  const context = use(StorefrontEditorContext)
  if (!context) {
    throw new Error('useStorefrontEditor must be used within a StorefrontEditor.Root')
  }
  return context
}
