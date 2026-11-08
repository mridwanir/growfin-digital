import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/server'
import { generateStorageKey, uploadToStorage } from '@/lib/storage/s3'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const ALLOWED_MIME_TYPES: Record<string, true> = {
  'image/gif': true,
  'image/jpeg': true,
  'image/png': true,
  'image/svg+xml': true,
  'image/webp': true,
}

export async function POST(request: NextRequest) {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string' || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Validate image MIME type
    const mimeType = file.type?.toLowerCase() || ''
    if (!ALLOWED_MIME_TYPES[mimeType] && !mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only image files are allowed.' },
        { status: 400 },
      )
    }

    // Validate file size limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed limit of 5MB` },
        { status: 400 },
      )
    }

    const folder = (formData.get('folder') as string) || 'media'
    const fileName = file instanceof File ? file.name : 'upload.png'
    const key = generateStorageKey(fileName, folder)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadToStorage({
      key,
      body: buffer,
      contentType: mimeType || 'image/png',
    })

    return NextResponse.json(
      {
        key: result.key,
        contentType: result.contentType,
        publicId: result.key,
        size: file.size,
        url: result.url,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Storage upload error:', error)
    return NextResponse.json({ error: 'Failed to upload media asset to storage' }, { status: 500 })
  }
}
