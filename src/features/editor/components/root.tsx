'use client'

import type { ReactNode } from 'react'

import type { SaveStatus, StorefrontEditorContextValue, ViewportMode } from './context'
import type { Tenant } from '@/db/schema/auth'
import type { StorefrontConfig, StorefrontSection, StorefrontTheme } from '@/db/schema/storefront'
import type {
  MeracikPreviewUpdateMessage,
  MeracikPreviewUpdatePayload,
  Serializable,
} from '@/features/storefront'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { MERACIK_PREVIEW_UPDATE } from '@/features/storefront'

import { publishStorefrontDraftAction, saveStorefrontDraftAction } from '../actions'
import { StorefrontEditorContext } from './context'

export interface StorefrontEditorRootProps {
  children: ReactNode
  className?: string
  initialConfig: StorefrontConfig | Serializable<StorefrontConfig>
  onDraftChange?: (draft: StorefrontConfig) => void
  tenant: Tenant | Serializable<Tenant>
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
      updatedAt:
        initialConfig.updatedAt instanceof Date
          ? initialConfig.updatedAt
          : new Date(initialConfig.updatedAt ?? 0),
    }
  })

  const normalizedTenant = useMemo(
    () =>
      ({
        ...tenant,
        createdAt:
          tenant.createdAt instanceof Date ? tenant.createdAt : new Date(tenant.createdAt ?? 0),
        domainActiveUntil:
          tenant.domainActiveUntil instanceof Date
            ? tenant.domainActiveUntil
            : tenant.domainActiveUntil
              ? new Date(tenant.domainActiveUntil)
              : null,
        siteActiveUntil:
          tenant.siteActiveUntil instanceof Date
            ? tenant.siteActiveUntil
            : tenant.siteActiveUntil
              ? new Date(tenant.siteActiveUntil)
              : null,
        updatedAt:
          tenant.updatedAt instanceof Date ? tenant.updatedAt : new Date(tenant.updatedAt ?? 0),
      }) as Tenant,
    [tenant],
  )

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(() => {
    const initialSections = initialConfig.sections ?? []
    return initialSections[0]?.id ?? null
  })

  const [activeViewport, setActiveViewport] = useState<ViewportMode>('mobile')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [isPending, startTransition] = useTransition()
  const [isPublishing, startPublishTransition] = useTransition()
  const [publishNotification, setPublishNotification] = useState<string | null>(null)
  const [publishError, setPublishError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const isInitialMount = useRef(true)
  const saveTimeoutRef = useRef<number | null>(null)
  const draftRef = useRef(draft)
  draftRef.current = draft

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

      const targetOrigin =
        typeof window !== 'undefined' &&
        window.location?.origin &&
        window.location.origin !== 'null'
          ? window.location.origin
          : '*'

      try {
        targetWindow.postMessage(message, targetOrigin)
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

    clearTimeout(saveTimeoutRef.current ?? undefined)

    saveTimeoutRef.current = window.setTimeout(() => {
      saveTimeoutRef.current = null
      setSaveStatus('saving')
      startTransition(async () => {
        try {
          const res = await saveStorefrontDraftAction({
            sections: draft.sections,
            theme: draft.theme,
          })
          if (res.success) {
            setSaveStatus('saved')
          } else {
            setSaveStatus('error')
          }
        } catch {
          setSaveStatus('error')
        }
      })
    }, 800)

    return () => {
      clearTimeout(saveTimeoutRef.current ?? undefined)
      saveTimeoutRef.current = null
    }
  }, [draft, dispatchPreviewUpdate, onDraftChange, tenant.id])

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

  const publishDraft = useCallback(async () => {
    setPublishNotification(null)
    setPublishError(null)

    startPublishTransition(async () => {
      try {
        if (saveTimeoutRef.current !== null) {
          clearTimeout(saveTimeoutRef.current)
          saveTimeoutRef.current = null
        }

        const saveRes = await saveStorefrontDraftAction({
          sections: draftRef.current.sections,
          theme: draftRef.current.theme,
        })
        if (!saveRes.success) {
          setSaveStatus('error')
          setPublishError(saveRes.error || 'Failed to save draft before publishing')
          return
        }
        setSaveStatus('saved')
        const res = await publishStorefrontDraftAction()
        if (res.success) {
          setPublishNotification('Storefront published successfully')
        } else {
          setPublishError(res.error || 'Failed to publish storefront')
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to publish storefront'
        setPublishError(msg)
      }
    })
  }, [])

  const contextValue: StorefrontEditorContextValue = useMemo(
    () => ({
      activeViewport,
      dispatchPreviewUpdate,
      draft,
      iframeRef,
      isPending,
      isPublishing,
      moveSection,
      publishDraft,
      publishError,
      publishNotification,
      reorderSections,
      saveStatus,
      sections: draft.sections,
      selectedSectionId,
      setActiveViewport,
      setPublishNotification,
      setSaveStatus,
      setSelectedSectionId,
      tenant: normalizedTenant,
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
      isPublishing,
      moveSection,
      publishDraft,
      publishError,
      publishNotification,
      reorderSections,
      saveStatus,
      selectedSectionId,
      normalizedTenant,
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
