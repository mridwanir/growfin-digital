'use client'

import { Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react'
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
      setError(`Ukuran gambar tidak boleh melebihi ${maxSizeMb} MB`)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WebP, GIF, SVG)')
      return
    }

    setError('')
    setIsUploading(true)

    try {
      const data = await uploadStorageAsset(file, folder)
      onUploadSuccess(data.url, data.key)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah.'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-muted-foreground block text-xs font-bold uppercase">{label}</label>
      )}

      {currentImageUrl ? (
        <div className="border-border bg-card group relative aspect-video w-full overflow-hidden rounded-xl border md:aspect-21/9">
          <Image
            fill
            alt="Preview"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            src={currentImageUrl}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <label className="border-border bg-secondary hover:bg-secondary/80 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors">
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UploadCloud className="size-4" />
              )}
              {isUploading ? 'Mengunggah...' : 'Ganti Gambar'}
              <input
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                type="file"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      ) : (
        <label
          className={`border-border bg-card relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors md:aspect-21/9 ${
            error
              ? 'border-destructive/50 bg-destructive/5'
              : 'hover:border-primary hover:bg-primary/5'
          }`}
        >
          {isUploading ? (
            <div className="text-muted-foreground flex flex-col items-center">
              <Loader2 className="text-primary mb-2 size-8 animate-spin" />
              <p className="text-sm font-bold">Mengunggah...</p>
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center p-6 text-center">
              <ImageIcon className="mb-3 size-10 opacity-50" />
              <p className="text-foreground mb-1 text-sm font-bold">
                Klik atau seret gambar ke sini
              </p>
              <p className="text-xs">Format JPG, PNG, atau WebP. Maks {maxSizeMb}MB.</p>
            </div>
          )}
          <input
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            type="file"
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && (
        <p className="text-destructive flex items-center gap-1 text-xs font-medium">
          <X className="size-3" /> {error}
        </p>
      )}
    </div>
  )
}
