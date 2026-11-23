'use client'

import type { ReactNode } from 'react'

import type { SaveStatus, StorefrontEditorContextValue, ViewportMode } from './context'
import type {
  MeracikPreviewUpdateMessage,
  MeracikPreviewUpdatePayload,
} from '@/components/storefront/preview-protocol'
import type {
  StorefrontConfig,
  StorefrontSection,
  StorefrontTheme,
  Tenant,
} from '@/db/schema/tenants'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { MERACIK_PREVIEW_UPDATE } from '@/components/storefront/preview-protocol'

import { StorefrontEditorContext } from './context'

export interface StorefrontEditorRootProps {
  children: ReactNode
  className?: string
  initialConfig: StorefrontConfig
  onDraftChange?: (draft: StorefrontConfig) => void
  tenant: Tenant
}

export function StorefrontEditorRoot({
  children,
  className,
  initialConfig,
  onDraftChange,
  tenant,
}: StorefrontEditorRootProps) {
  const [draft, setDraft] = useState<StorefrontConfig>(() => {
    const sortedSections = [...(initialConfig.sections ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    )
    return {
      ...initialConfig,
      sections: sortedSections,
    }
  })

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(() => {
    const initialSections = initialConfig.sections ?? []
    return initialSections[0]?.id ?? null
  })

  const [activeViewport, setActiveViewport] = useState<ViewportMode>('mobile')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [isPending, _startTransition] = useTransition()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const isInitialMount = useRef(true)

  const dispatchPreviewUpdate = useCallback(
    (payload?: MeracikPreviewUpdatePayload) => {
      const targetWindow = iframeRef.current?.contentWindow
      if (!targetWindow) return

      const updatePayload: MeracikPreviewUpdatePayload = payload ?? {
        sections: draft.sections,
        theme: draft.theme,
      }

      const message: MeracikPreviewUpdateMessage = {
        type: MERACIK_PREVIEW_UPDATE,
        payload: updatePayload,
      }

      try {
        targetWindow.postMessage(message, '*')
      } catch {
        // Fallback for unexpected iframe messaging errors
      }
    },
    [draft.sections, draft.theme],
  )

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    dispatchPreviewUpdate()
    onDraftChange?.(draft)
  }, [draft, dispatchPreviewUpdate, onDraftChange])

  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setDraft(prev => {
      const sections = [...prev.sections]
      const currentIndex = sections.findIndex(s => s.id === sectionId)
      if (currentIndex === -1) return prev

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (targetIndex < 0 || targetIndex >= sections.length) return prev

      const currentSection = sections[currentIndex]
      const targetSection = sections[targetIndex]
      if (!currentSection || !targetSection) return prev

      sections[currentIndex] = targetSection
      sections[targetIndex] = currentSection

      const normalizedSections = sections.map((section, idx) => ({
        ...section,
        sortOrder: idx + 1,
      }))

      return {
        ...prev,
        sections: normalizedSections,
        updatedAt: new Date(),
      }
    })
  }, [])

  const reorderSections = useCallback((newSections: StorefrontSection[]) => {
    const normalized = newSections.map((section, idx) => ({
      ...section,
      sortOrder: idx + 1,
    }))
    setDraft(prev => ({
      ...prev,
      sections: normalized,
      updatedAt: new Date(),
    }))
  }, [])

  const toggleSectionVisibility = useCallback((sectionId: string, isVisible?: boolean) => {
    setDraft(prev => {
      const updated = prev.sections.map(section => {
        if (section.id !== sectionId) return section
        return {
          ...section,
          isVisible: isVisible !== undefined ? isVisible : !section.isVisible,
        }
      })
      return {
        ...prev,
        sections: updated,
        updatedAt: new Date(),
      }
    })
  }, [])

  const updateSectionContent = useCallback(
    <T extends Record<string, unknown> = Record<string, unknown>>(
      sectionId: string,
      contentUpdate: Partial<T> | ((prev: T) => T),
    ) => {
      setDraft(prev => {
        const updated = prev.sections.map(section => {
          if (section.id !== sectionId) return section
          const prevContent = (section.content ?? {}) as T
          const nextContent =
            typeof contentUpdate === 'function'
              ? contentUpdate(prevContent)
              : { ...prevContent, ...contentUpdate }

          return {
            ...section,
            content: nextContent,
          }
        })
        return {
          ...prev,
          sections: updated,
          updatedAt: new Date(),
        }
      })
    },
    [],
  )

  const updateTheme = useCallback((themeUpdate: Partial<StorefrontTheme>) => {
    setDraft(prev => ({
      ...prev,
      updatedAt: new Date(),
      theme: {
        ...prev.theme,
        ...themeUpdate,
      },
    }))
  }, [])

  const contextValue: StorefrontEditorContextValue = useMemo(
    () => ({
      activeViewport,
      dispatchPreviewUpdate,
      draft,
      iframeRef,
      isPending,
      moveSection,
      reorderSections,
      saveStatus,
      sections: draft.sections,
      selectedSectionId,
      setActiveViewport,
      setSaveStatus,
      setSelectedSectionId,
      tenant,
      theme: draft.theme,
      toggleSectionVisibility,
      updateSectionContent,
      updateTheme,
    }),
    [
      activeViewport,
      dispatchPreviewUpdate,
      draft,
      isPending,
      moveSection,
      reorderSections,
      saveStatus,
      selectedSectionId,
      tenant,
      toggleSectionVisibility,
      updateSectionContent,
      updateTheme,
    ],
  )

  return (
    <StorefrontEditorContext.Provider value={contextValue}>
      <div className={className} data-slot="storefront-editor-root">
        {children}
      </div>
    </StorefrontEditorContext.Provider>
  )
}
