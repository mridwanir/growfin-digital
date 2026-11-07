import { redirect } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'

import { isAdminEmail, parseAdminEmails, requireAdminSession } from '@/lib/auth/admin'
import { auth } from '@/lib/auth/server'
import { env } from '@/lib/env'

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

describe('Admin Authorization Guard', () => {
  describe('parseAdminEmails', () => {
    it('parses comma-separated emails and normalizes whitespace and casing', () => {
      const parsed = parseAdminEmails(' Admin@growfin.my.id, super@example.com ,Dev@Growfin.com ')
      expect(parsed).toEqual(['admin@growfin.my.id', 'super@example.com', 'dev@growfin.com'])
    })

    it('returns empty array for empty or whitespace-only strings', () => {
      expect(parseAdminEmails('')).toEqual([])
      expect(parseAdminEmails('   ')).toEqual([])
    })
  })

  describe('isAdminEmail', () => {
    it('returns true when user email matches an authorized admin email', () => {
      expect(isAdminEmail('admin@growfin.my.id', 'admin@growfin.my.id, other@growfin.com')).toBe(
        true,
      )
      expect(isAdminEmail('ADMIN@growfin.my.id', 'admin@growfin.my.id')).toBe(true)
      expect(isAdminEmail(' other@growfin.com ', 'admin@growfin.my.id, other@growfin.com')).toBe(
        true,
      )
    })

    it('returns false for unauthorized emails', () => {
      expect(isAdminEmail('merchant@example.com', 'admin@growfin.my.id')).toBe(false)
      expect(isAdminEmail('hacker@admin@growfin.my.id', 'admin@growfin.my.id')).toBe(false)
      expect(isAdminEmail('', 'admin@growfin.my.id')).toBe(false)
      expect(isAdminEmail(null, 'admin@growfin.my.id')).toBe(false)
      expect(isAdminEmail(undefined, 'admin@growfin.my.id')).toBe(false)
    })
  })
  describe('requireAdminSession', () => {
    it('redirects to /login if user is unauthenticated', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: null,
        error: null,
      })

      vi.mocked(redirect).mockClear()
      await expect(requireAdminSession()).rejects.toThrow('NEXT_REDIRECT:/login')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects to /dashboard if user email is not an authorized admin', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        error: null,
        data: {
          session: {
            id: 'sess_1',
            createdAt: new Date(),
            expiresAt: new Date(),
            token: 'tok_1',
            updatedAt: new Date(),
            userId: 'user_1',
          },
          user: {
            id: 'user_1',
            name: 'Merchant',
            createdAt: new Date(),
            email: 'regular_merchant@example.com',
            emailVerified: true,
            updatedAt: new Date(),
          },
        },
      })

      vi.mocked(redirect).mockClear()
      await expect(requireAdminSession()).rejects.toThrow('NEXT_REDIRECT:/dashboard')
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('returns the session if user email is an authorized admin', async () => {
      const adminEmail = env.ADMIN_EMAILS.split(',')[0].trim()
      const mockSession = {
        session: {
          id: 'sess_admin_1',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'tok_admin_1',
          updatedAt: new Date(),
          userId: 'admin_user_1',
        },
        user: {
          id: 'admin_user_1',
          name: 'Super Admin',
          createdAt: new Date(),
          email: adminEmail,
          emailVerified: true,
          updatedAt: new Date(),
        },
      }

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      })

      const result = await requireAdminSession()
      expect(result).toEqual(mockSession)
    })
  })
})
