'use client'

import { Loader2, UploadCloud, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { uploadStorageAsset } from '@/lib/storage/client'

export interface MediaUploaderProps {
  currentImageUrl?: string
  folder?: string
  label?: string
  maxSizeMb?: number
  onUploadSuccess: (url: string, key: string) => void
}

export function MediaUploader({
  currentImageUrl,
  folder = 'media',
  label = 'Upload Gambar',
  maxSizeMb = 5,
  onUploadSuccess,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMb}MB`)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diperbolehkan')
      return
    }

    setError('')
    setIsUploading(true)

    try {
      const result = await uploadStorageAsset(file, folder)
      onUploadSuccess(result.url, result.key)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengupload gambar'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-foreground block text-sm font-medium">{label}</label>

      {currentImageUrl ? (
        <div className="relative inline-block">
          <div className="border-border relative size-36 overflow-hidden rounded-lg border">
            <Image
              fill
              alt="Media Preview"
              className="object-cover"
              sizes="144px"
              src={currentImageUrl}
            />
          </div>
          <button
            aria-label="Hapus gambar"
            className="bg-destructive hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1 text-white shadow-sm transition-colors"
            type="button"
            onClick={() => onUploadSuccess('', '')}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label className="border-border hover:border-primary/50 flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="text-primary size-8 animate-spin" />
            ) : (
              <UploadCloud className="text-muted-foreground size-8" />
            )}
            <p className="text-muted-foreground mt-2 text-xs">
              {isUploading ? (
                'Mengupload...'
              ) : (
                <>
                  <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                </>
              )}
            </p>
            <p className="text-muted-foreground/75 text-[10px]">
              PNG, JPG, WebP (maks. {maxSizeMb}MB)
            </p>
          </div>
          <input
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            type="file"
            onChange={handleFileChange}
          />
        </label>
      )}

      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  )
}
