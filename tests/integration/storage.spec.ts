import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST as deleteRouteHandler } from '@/app/api/storage/delete/route'
import { POST as uploadRouteHandler } from '@/app/api/storage/upload/route'
import { auth } from '@/lib/auth/server'

describe('Storage API Seam (/api/storage)', () => {
  const mockUser = {
    id: 'user_merchant_123',
    name: 'Merchant User',
    createdAt: new Date(),
    email: 'merchant@growfin.my.id',
    emailVerified: true,
    updatedAt: new Date(),
  }

  const mockSession = {
    user: mockUser,
    session: {
      id: 'sess_123',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
      token: 'token_123',
      updatedAt: new Date(),
      userId: mockUser.id,
    },
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('POST /api/storage/upload', () => {
    it('returns 401 Unauthorized when user is not authenticated', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: null,
        error: null,
      } as any)

      const formData = new FormData()
      formData.append(
        'file',
        new File([new Uint8Array([137, 80, 78, 71])], 'logo.png', { type: 'image/png' }),
      )

      const request = new NextRequest('http://localhost:3000/api/storage/upload', {
        body: formData,
        method: 'POST',
      })

      const response = await uploadRouteHandler(request)
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('returns 400 Bad Request when no file is provided', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const formData = new FormData()
      const request = new NextRequest('http://localhost:3000/api/storage/upload', {
        body: formData,
        method: 'POST',
      })

      const response = await uploadRouteHandler(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/file.*required/i)
    })

    it('returns 400 Bad Request when file is not an image', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const formData = new FormData()
      formData.append(
        'file',
        new File(['plain text data'], 'malicious.txt', { type: 'text/plain' }),
      )

      const request = new NextRequest('http://localhost:3000/api/storage/upload', {
        body: formData,
        method: 'POST',
      })

      const response = await uploadRouteHandler(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/invalid.*type|image/i)
    })

    it('returns 400 Bad Request when file exceeds size limit (e.g. > 5MB)', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const largeBuffer = new Uint8Array(6 * 1024 * 1024)
      const formData = new FormData()
      formData.append('file', new File([largeBuffer], 'giant.jpg', { type: 'image/jpeg' }))

      const request = new NextRequest('http://localhost:3000/api/storage/upload', {
        body: formData,
        method: 'POST',
      })

      const response = await uploadRouteHandler(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/size|exceed/i)
    })

    it('uploads valid image to S3 bucket and returns url, key, and publicId', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const sendSpy = vi.spyOn(S3Client.prototype, 'send').mockResolvedValueOnce({} as any)

      const fileBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
      const formData = new FormData()
      formData.append('file', new File([fileBytes], 'hero-banner.png', { type: 'image/png' }))
      formData.append('folder', 'hero')

      const request = new NextRequest('http://localhost:3000/api/storage/upload', {
        body: formData,
        method: 'POST',
      })

      const response = await uploadRouteHandler(request)
      expect(response.status).toBe(201)
      const data = await response.json()

      expect(data.key).toMatch(/^uploads\/hero\/[a-f0-9-]+\.png$/)
      expect(data.publicId).toBe(data.key)
      expect(data.url).toContain(data.key)
      expect(data.contentType).toBe('image/png')

      expect(sendSpy).toHaveBeenCalledTimes(1)
      const s3Command = sendSpy.mock.calls[0][0]
      expect(s3Command).toBeInstanceOf(PutObjectCommand)
      expect((s3Command as PutObjectCommand).input.Key).toBe(data.key)
      expect((s3Command as PutObjectCommand).input.ContentType).toBe('image/png')
      expect((s3Command as PutObjectCommand).input.CacheControl).toContain('public')
    })

    it('returns 500 when S3 upload fails', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      vi.spyOn(S3Client.prototype, 'send').mockRejectedValueOnce(
        new Error('S3 connection timed out'),
      )

      const formData = new FormData()
      formData.append(
        'file',
        new File([new Uint8Array([137, 80, 78, 71])], 'logo.png', { type: 'image/png' }),
      )

      const request = new NextRequest('http://localhost:3000/api/storage/upload', {
        body: formData,
        method: 'POST',
      })

      const response = await uploadRouteHandler(request)
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toMatch(/failed to upload/i)
    })
  })

  describe('POST /api/storage/delete', () => {
    it('returns 401 Unauthorized when user is not authenticated', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: null,
        error: null,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/storage/delete', {
        body: JSON.stringify({ key: 'uploads/hero/test.png' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const response = await deleteRouteHandler(request)
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('returns 400 Bad Request when key or public_id is missing', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/storage/delete', {
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const response = await deleteRouteHandler(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/key.*required/i)
    })

    it('returns 400 Bad Request when key contains path traversal characters', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const request = new NextRequest('http://localhost:3000/api/storage/delete', {
        body: JSON.stringify({ key: '../system/secret.key' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const response = await deleteRouteHandler(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/invalid.*key/i)
    })

    it('deletes object from S3 bucket and returns success with deleted key', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const sendSpy = vi.spyOn(S3Client.prototype, 'send').mockResolvedValueOnce({} as any)

      const targetKey = 'uploads/products/sample-123.jpg'
      const request = new NextRequest('http://localhost:3000/api/storage/delete', {
        body: JSON.stringify({ key: targetKey }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const response = await deleteRouteHandler(request)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual({
        key: targetKey,
        success: true,
      })

      expect(sendSpy).toHaveBeenCalledTimes(1)
      const s3Command = sendSpy.mock.calls[0][0]
      expect(s3Command).toBeInstanceOf(DeleteObjectCommand)
      expect((s3Command as DeleteObjectCommand).input.Key).toBe(targetKey)
    })

    it('accepts legacy public_id or storageKey payload fields', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      const sendSpy = vi.spyOn(S3Client.prototype, 'send').mockResolvedValueOnce({} as any)

      const targetKey = 'uploads/logos/logo-abc.png'
      const request = new NextRequest('http://localhost:3000/api/storage/delete', {
        body: JSON.stringify({ public_id: targetKey }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const response = await deleteRouteHandler(request)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual({
        key: targetKey,
        success: true,
      })
      expect((sendSpy.mock.calls[0][0] as DeleteObjectCommand).input.Key).toBe(targetKey)
    })

    it('returns 500 when S3 deletion fails', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValueOnce({
        data: mockSession,
        error: null,
      } as any)

      vi.spyOn(S3Client.prototype, 'send').mockRejectedValueOnce(new Error('S3 access denied'))

      const request = new NextRequest('http://localhost:3000/api/storage/delete', {
        body: JSON.stringify({ key: 'uploads/products/bad.png' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const response = await deleteRouteHandler(request)
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toMatch(/failed to delete/i)
    })
  })

  describe('end-to-end S3 object lifecycle', () => {
    it('uploads a test image file, confirms S3 object persistence, and verifies clean deletion from storage', async () => {
      vi.spyOn(auth, 'getSession').mockResolvedValue({
        data: mockSession,
        error: null,
      } as any)

      const storageBucket = new Map<string, { body: Buffer; contentType: string }>()

      vi.spyOn(S3Client.prototype, 'send').mockImplementation(async (command: any) => {
        if (command instanceof PutObjectCommand) {
          storageBucket.set(command.input.Key!, {
            body: command.input.Body as Buffer,
            contentType: command.input.ContentType!,
          })
          return {} as any
        }
        if (command instanceof DeleteObjectCommand) {
          storageBucket.delete(command.input.Key!)
          return {} as any
        }
        return {} as any
      })

      const testImageBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      const uploadFormData = new FormData()
      uploadFormData.append(
        'file',
        new File([testImageBytes], 'product-photo.png', { type: 'image/png' }),
      )
      uploadFormData.append('folder', 'products')

      const uploadRequest = new NextRequest('http://localhost:3000/api/storage/upload', {
        body: uploadFormData,
        method: 'POST',
      })

      const uploadResponse = await uploadRouteHandler(uploadRequest)
      expect(uploadResponse.status).toBe(201)
      const uploadResult = await uploadResponse.json()

      expect(uploadResult.key).toBeDefined()
      expect(storageBucket.has(uploadResult.key)).toBe(true)
      const persisted = storageBucket.get(uploadResult.key)!
      expect(persisted.contentType).toBe('image/png')
      expect(Buffer.from(testImageBytes).equals(persisted.body)).toBe(true)

      const deleteRequest = new NextRequest('http://localhost:3000/api/storage/delete', {
        body: JSON.stringify({ key: uploadResult.key }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const deleteResponse = await deleteRouteHandler(deleteRequest)
      expect(deleteResponse.status).toBe(200)
      const deleteResult = await deleteResponse.json()
      expect(deleteResult).toEqual({ key: uploadResult.key, success: true })

      expect(storageBucket.has(uploadResult.key)).toBe(false)
    })
  })
})
