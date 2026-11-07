import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

import { GET as getAdminApi } from '@/app/api/admin/route'
import { GET as getDashboardApi } from '@/app/api/dashboard/route'
import { auth } from '@/lib/auth/server'
import { env } from '@/lib/env'

describe('Route Protection & Authorization Seam', () => {
  describe('/api/dashboard', () => {
    it('returns 401 Unauthorized for unauthenticated requests', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const request = new NextRequest('http://localhost:3000/api/dashboard')
      const response = await getDashboardApi(request)

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('returns 200 and session data for authenticated merchants', async () => {
      const mockSession = {
        session: {
          id: 'sess_123',
          createdAt: new Date(),
          expiresAt: new Date(),
          token: 'token_123',
          updatedAt: new Date(),
          userId: 'merchant_123',
        },
        user: {
          id: 'merchant_123',
          name: 'Merchant Test',
          createdAt: new Date(),
          email: 'merchant@growfin.my.id',
          emailVerified: true,
          updatedAt: new Date(),
        },
      }

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      })

      const request = new NextRequest('http://localhost:3000/api/dashboard')
      const response = await getDashboardApi(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.user.email).toBe('merchant@growfin.my.id')
    })
  })

  describe('/api/admin', () => {
    it('returns 401 Unauthorized for unauthenticated requests', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const request = new NextRequest('http://localhost:3000/api/admin')
      const response = await getAdminApi(request)

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('returns 403 Forbidden for authenticated non-admin users', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        error: null,
        data: {
          session: {
            id: 'sess_123',
            createdAt: new Date(),
            expiresAt: new Date(),
            token: 'tok_123',
            updatedAt: new Date(),
            userId: 'merchant_123',
          },
          user: {
            id: 'merchant_123',
            name: 'Merchant',
            createdAt: new Date(),
            email: 'notanadmin@growfin.my.id',
            emailVerified: true,
            updatedAt: new Date(),
          },
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin')
      const response = await getAdminApi(request)

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data).toEqual({ error: 'Forbidden: Admin access required' })
    })

    it('returns 200 and admin overview for authorized super admin', async () => {
      const adminEmail = env.ADMIN_EMAILS.split(',')[0].trim()

      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        error: null,
        data: {
          session: {
            id: 'sess_admin',
            createdAt: new Date(),
            expiresAt: new Date(),
            token: 'tok_admin',
            updatedAt: new Date(),
            userId: 'admin_123',
          },
          user: {
            id: 'admin_123',
            name: 'Super Admin',
            createdAt: new Date(),
            email: adminEmail,
            emailVerified: true,
            updatedAt: new Date(),
          },
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin')
      const response = await getAdminApi(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.admin).toBe(true)
      expect(data.user.email).toBe(adminEmail)
    })
  })
})
