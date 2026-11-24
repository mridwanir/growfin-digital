import type { StorefrontSection, StorefrontTheme } from '@/db/schema/storefront'

export const MERACIK_PREVIEW_UPDATE = 'MERACIK_PREVIEW_UPDATE' as const

export interface MeracikPreviewUpdatePayload {
  sections?: StorefrontSection[]
  theme?: StorefrontTheme
}

export interface MeracikPreviewUpdateMessage {
  payload?: MeracikPreviewUpdatePayload
  type: typeof MERACIK_PREVIEW_UPDATE
}
