import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import crypto from 'node:crypto'

import { env } from '@/lib/env'

export const s3Client = new S3Client({
  endpoint: env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true, // Required: Neon Object Storage uses path-style addressing
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export const DEFAULT_BUCKET = env.AWS_BUCKET_NAME || 'growfin-media'

/**
 * Resolves the public CDN/HTTP URL for an object stored in Neon Object Storage.
 */
export function getStoragePublicUrl(key: string, bucket = DEFAULT_BUCKET): string {
  const cleanEndpoint = env.AWS_ENDPOINT_URL_S3.replace(/\/+$/, '')
  const cleanKey = key.replace(/^\/+/, '')
  return `${cleanEndpoint}/${bucket}/${cleanKey}`
}

/**
 * Generates an isolated, collision-free object key for an upload.
 */
export function generateStorageKey(originalFilename: string, folder = 'media'): string {
  const cleanFolder = folder.replace(/[^\w-]/g, '').toLowerCase() || 'media'
  const extMatch = originalFilename.match(/\.([a-z0-9]+)$/i)
  const rawExt = extMatch ? extMatch[1].toLowerCase() : 'png'
  const safeExt = /^[a-z0-9]+$/.test(rawExt) ? rawExt : 'png'
  const id = crypto.randomUUID()
  return `uploads/${cleanFolder}/${id}.${safeExt}`
}

export interface UploadAssetParams {
  body: Uint8Array | Buffer
  bucket?: string
  cacheControl?: string
  contentType: string
  key: string
}

/**
 * Uploads a binary buffer to S3-compatible Neon Object Storage.
 */
export async function uploadToStorage({
  body,
  bucket = DEFAULT_BUCKET,
  cacheControl = 'public, max-age=31536000, immutable',
  contentType,
  key,
}: UploadAssetParams) {
  const command = new PutObjectCommand({
    Body: body,
    Bucket: bucket,
    CacheControl: cacheControl,
    ContentType: contentType,
    Key: key,
  })

  await s3Client.send(command)

  return {
    key,
    bucket,
    contentType,
    url: getStoragePublicUrl(key, bucket),
  }
}

/**
 * Deletes an object by key from Neon Object Storage.
 */
export async function deleteFromStorage(key: string, bucket = DEFAULT_BUCKET) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  await s3Client.send(command)

  return {
    key,
    bucket,
    success: true,
  }
}
