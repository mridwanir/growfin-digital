'use client';

import { useState } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  currentImageUrl?: string;
  maxSizeMb?: number;
  label?: string;
}

export function CloudinaryUploader({ 
  onUploadSuccess, 
  currentImageUrl, 
  maxSizeMb = 1,
  label = "Upload Gambar"
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran gambar tidak boleh melebihi ${maxSizeMb} MB`);
      return;
    }
    
    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WebP)');
      return;
    }

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengunggah gambar');
      }

      const data = await response.json();
      
      // Auto-apply basic transformations (auto format, auto quality) for rendering
      // e.g., https://res.cloudinary.com/.../image/upload/v.../xyz.jpg -> https://.../image/upload/f_auto,q_auto/v.../xyz.jpg
      const secureUrl = data.secure_url;
      const optimizedUrl = secureUrl.replace('/upload/', '/upload/f_auto,q_auto/');

      onUploadSuccess(optimizedUrl, data.public_id);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengunggah.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-xs font-bold text-[#8E8EA0] uppercase block">{label}</label>}
      
      {currentImageUrl ? (
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-[#262633] group bg-[#0B0B0E]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImageUrl} alt="Preview" className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer px-4 py-2 bg-[#14141A] border border-[#262633] rounded-lg text-sm font-bold text-white hover:bg-[#262633] transition-colors flex items-center gap-2">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {isUploading ? 'Mengunggah...' : 'Ganti Gambar'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
            </label>
          </div>
        </div>
      ) : (
        <label className={`relative w-full aspect-video md:aspect-[21/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
          error ? 'border-red-500/50 bg-red-500/5' : 'border-[#262633] bg-[#0B0B0E] hover:border-[#00b894] hover:bg-[#00b894]/5'
        }`}>
          {isUploading ? (
            <div className="flex flex-col items-center text-[#8E8EA0]">
              <Loader2 className="w-8 h-8 animate-spin text-[#00b894] mb-2" />
              <p className="text-sm font-bold">Mengunggah...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-[#8E8EA0] p-6 text-center">
              <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm font-bold text-white mb-1">Klik atau seret gambar ke sini</p>
              <p className="text-xs">Format JPG, PNG, atau WebP. Maks {maxSizeMb}MB.</p>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
        </label>
      )}

      {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><X className="w-3 h-3" /> {error}</p>}
    </div>
  );
}
