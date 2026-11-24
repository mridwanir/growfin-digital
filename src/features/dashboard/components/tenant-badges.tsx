import type { ReactElement } from 'react'

export interface TenantStatusBadgeProps {
  status: string | null | undefined
}

export function TenantStatusBadge({ status }: TenantStatusBadgeProps): ReactElement {
  switch (status) {
    case 'published':
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Aktif (Live)
        </span>
      )
    case 'locked':
      return (
        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          Terkunci (Expired)
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          Draft
        </span>
      )
  }
}

export interface TenantTierBadgeProps {
  tier: string | null | undefined
}

export function TenantTierBadge({ tier }: TenantTierBadgeProps): ReactElement {
  switch (tier) {
    case 'pro':
      return (
        <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">
          PRO
        </span>
      )
    case 'instant':
      return (
        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
          INSTANT
        </span>
      )
    default:
      return (
        <span className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium">
          FREE DEMO
        </span>
      )
  }
}
