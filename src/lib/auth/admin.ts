import { redirect } from 'next/navigation'
import { cache } from 'react'

import { auth } from '@/lib/auth/server'
import { env } from '@/lib/env'

/**
 * Parses a comma-separated list of admin emails into normalized lowercase trimmed strings.
 */
export function parseAdminEmails(adminEmailsConfig?: string): string[] {
  const raw = adminEmailsConfig ?? env.ADMIN_EMAILS
  if (!raw) return []

  return raw
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Checks whether the given email is in the configured admin emails list.
 */
export function isAdminEmail(
  email: string | null | undefined,
  adminEmailsConfig?: string,
): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  if (!normalized) return false

  const adminList = parseAdminEmails(adminEmailsConfig)
  return adminList.includes(normalized)
}

/**
 * Server guard for admin pages/actions. Verifies that the current user is signed in and has an
 * admin email. If unauthenticated, redirects to `/login`. If authenticated but not admin, redirects
 * to `/dashboard`.
 */
export const requireAdminSession = cache(async () => {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    redirect('/login')
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/dashboard')
  }

  return session
})
