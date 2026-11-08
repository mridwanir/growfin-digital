export interface UploadAssetResult {
  contentType: string
  key: string
  publicId: string
  size: number
  url: string
}

/**
 * Uploads a file to Neon Object Storage via the authenticated /api/storage/upload endpoint.
 */
export async function uploadStorageAsset(file: File, folder = 'media'): Promise<UploadAssetResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await fetch('/api/storage/upload', {
    body: formData,
    method: 'POST',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to upload media asset')
  }

  return response.json()
}

/**
 * Deletes an asset by key or publicId from Neon Object Storage via /api/storage/delete.
 */
export async function deleteStorageAsset(key: string): Promise<boolean> {
  if (!key) return false

  try {
    const response = await fetch('/api/storage/delete', {
      body: JSON.stringify({ key }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    return response.ok
  } catch (error) {
    console.error('Failed to delete storage asset:', error)
    return false
  }
}
