'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  ScanLine, 
  Sparkles 
} from 'lucide-react';

export interface BusinessShareData {
  id: string;
  name: string;
  slug: string;
  category: string;
  city?: string;
  package_tier?: string;
}

interface ShareWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessShareData;
}

export function ShareWebsiteModal({ isOpen, onClose, business }: ShareWebsiteModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'growfin.my.id';
  const cleanDomain = rootDomain.replace(/^https?:\/\//, '').split(':')[0];
  const websiteUrl = `https://${cleanDomain}/${business.slug}`;
  const displayDomain = `${cleanDomain}/${business.slug}`;

  // Generate QR Code saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(websiteUrl, {
        width: 400,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Gagal generate QR Code:', err));
    }
  }, [isOpen, websiteUrl]);

  if (!isOpen) return null;

  // Fungsi membuat canvas resolusi tinggi untuk ID Card (Retina HD 800x1140 px)
  const createCardCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 1140;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // 1. Background Luar
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // 2. Badan Kartu Utama
    const cardX = 40;
    const cardY = 40;
    const cardW = 720;
    const cardH = 1060;
    const cardRadius = 36;

    // Fungsi pembantu rounded rectangle
    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // Bayangan halus kartu
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = '#ffffff';
    drawRoundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.fill();
    ctx.restore();

    // Garis tepi kartu
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#e2e8f0';
    drawRoundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.stroke();

    // 3. Aksen Lanyard Slot (Lubang Tali ID Card)
    ctx.fillStyle = '#e2e8f0';
    drawRoundRect(350, 70, 100, 14, 7);
    ctx.fill();

    // 4. Header Badge "ID BISNIS RESMI"
    ctx.fillStyle = '#ecfdf5';
    drawRoundRect(270, 115, 260, 38, 19);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#a7f3d0';
    ctx.stroke();

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓ ID BISNIS RESMI', 400, 134);

    // 5. Avatar / Inisial Bisnis
    const avatarGradient = ctx.createLinearGradient(350, 175, 450, 275);
    avatarGradient.addColorStop(0, '#00b894');
    avatarGradient.addColorStop(1, '#0984e3');

    ctx.save();
    ctx.beginPath();
    ctx.arc(400, 225, 48, 0, Math.PI * 2);
    ctx.fillStyle = avatarGradient;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();

    const initial = (business.name || 'G').charAt(0).toUpperCase();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initial, 400, 226);

    // 6. Nama Bisnis
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px sans-serif';
    let displayName = business.name || 'Website Bisnis';
    if (displayName.length > 28) {
      displayName = displayName.substring(0, 26) + '...';
    }
    ctx.fillText(displayName, 400, 310);

    // 7. Kategori & Kota
    ctx.fillStyle = '#64748b';
    ctx.font = '600 16px sans-serif';
    const subInfo = `${business.category || 'Bisnis UMKM'}${business.city ? ` • ${business.city}` : ''}`;
    ctx.fillText(subInfo, 400, 345);

    // 8. Box QR Code Kontainer
    const qrBoxX = 160;
    const qrBoxY = 385;
    const qrBoxW = 480;
    const qrBoxH = 500;
    ctx.fillStyle = '#f8fafc';
    drawRoundRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, 24);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    // Gambar QR Code jika sudah ada
    if (qrDataUrl) {
      await new Promise<void>((resolve) => {
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 225, 415, 350, 350);
          resolve();
        };
        qrImg.src = qrDataUrl;
      });
    }

    // Panduan Scan di bawah QR
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Pindai untuk melihat katalog & layanan', 400, 805);

    // Pill Domain URL
    ctx.fillStyle = '#ffffff';
    drawRoundRect(220, 828, 360, 36, 12);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(displayDomain, 400, 846);

    // 9. Footer Kartu
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px sans-serif';
    ctx.fillText('Growfin Digital • Platform Digitalisasi UMKM Indonesia', 400, 1020);

    return canvas;
  };

  // Unduh Gambar PNG
  const handleDownload = async () => {
    try {
      setIsGeneratingImage(true);
      const canvas = await createCardCanvas();
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `kartu-bisnis-${business.slug}.png`;
      link.href = imageUri;
      link.click();
    } catch (err) {
      console.error('Gagal mengunduh kartu:', err);
      alert('Maaf, terjadi kendala saat mengunduh gambar kartu.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Bagikan ke Aplikasi (Langsung render gambar + caption untuk WhatsApp / medsos)
  const handleNativeShare = async () => {
    try {
      setIsGeneratingImage(true);
      const canvas = await createCardCanvas();

      // Buat file Blob dari canvas
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );

      const shareTitle = `Website Resmi ${business.name}`;
      const shareText = `Halo! Kunjungi website resmi *${business.name}* di:\n${websiteUrl}\n\nTemukan katalog produk, layanan, dan informasi lengkap kami di sini!`;

      if (blob && navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'id-card.png', { type: 'image/png' })] })) {
        const file = new File([blob], `kartu-bisnis-${business.slug}.png`, { type: 'image/png' });
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file]
        });
      } else if (navigator.share) {
        // Fallback share teks & URL jika browser belum dukung share file gambar langsung
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: websiteUrl
        });
      } else {
        // Fallback jika Web Share API tidak tersedia di browser (misal desktop):
        // 1. Download gambar kartu otomatis
        const imageUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `kartu-bisnis-${business.slug}.png`;
        link.href = imageUri;
        link.click();

        // 2. Buka WhatsApp dengan caption
        const waText = encodeURIComponent(`${shareText}\n\n(Gambar kartu digital telah tersimpan di perangkat Anda)`);
        window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Gagal membagikan:', err);
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Salin Tautan
  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="text-left mb-6 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald/10 text-emerald mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kartu Identitas Digital Bisnis</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Bagikan Website Anda
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Siap dibagikan ke status WhatsApp, media sosial, atau dicetak sebagai kartu fisik di meja kasir.
          </p>
        </div>

        {/* Live Preview ID Card (Desain Light Theme Premium) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-6 flex justify-center">
          <div className="relative bg-white border border-slate-200/80 rounded-2xl shadow-lg p-5 max-w-[320px] w-full text-center overflow-hidden">
            
            {/* Lubang Lanyard ID Card */}
            <div className="w-14 h-2.5 bg-slate-200 rounded-full mx-auto mb-3" />

            {/* Badge Verifikasi */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald/10 text-emerald border border-emerald/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ID BISNIS RESMI</span>
            </div>

            {/* Avatar Inisial Bisnis */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald to-blue-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md border-2 border-white mb-2">
              {(business.name || 'G').charAt(0).toUpperCase()}
            </div>

            {/* Nama & Kategori Bisnis */}
            <h4 className="font-extrabold text-slate-900 text-lg leading-tight truncate px-1">
              {business.name}
            </h4>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
              {business.category} {business.city ? `• ${business.city}` : ''}
            </p>

            {/* Kotak QR Code */}
            <div className="mt-4 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt={`QR Code ${business.name}`} 
                  className="w-40 h-40 object-contain rounded-lg shadow-xs bg-white p-1"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-xs text-slate-400 bg-slate-100 rounded-lg">
                  Membuat QR...
                </div>
              )}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <ScanLine className="w-3.5 h-3.5 text-emerald" />
                <span>Pindai untuk Buka Website</span>
              </div>
            </div>

            {/* URL Display dengan Tombol Salin Kecil di Kanan */}
            <div className="mt-3 py-1.5 px-3 bg-slate-100 hover:bg-slate-200/70 rounded-xl flex items-center justify-between gap-2 border border-slate-200/80 transition-colors">
              <span className="text-xs font-mono font-bold text-slate-800 truncate text-left select-all">
                {displayDomain}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1 rounded-md hover:bg-white text-slate-500 hover:text-emerald transition-all shrink-0 flex items-center gap-1 active:scale-95"
                title="Salin Tautan Website"
              >
                {isCopied ? (
                  <>
                    <span className="text-[10px] font-bold text-emerald">Disalin!</span>
                    <Check className="w-3.5 h-3.5 text-emerald" />
                  </>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Footer Kartu */}
            <p className="mt-3 text-[10px] text-slate-400 font-medium">
              Growfin Digital • Digitalisasi UMKM
            </p>
          </div>
        </div>

        {/* Kontrol Aksi Berbagi */}
        <div className="space-y-2.5">
          {/* Tombol Utama: Bagikan Website (Render Gambar + Caption ke Aplikasi) */}
          <button
            onClick={handleNativeShare}
            disabled={isGeneratingImage || !qrDataUrl}
            className="w-full py-4 px-5 bg-emerald hover:bg-emerald-light text-white font-extrabold rounded-2xl shadow-[0_10px_20px_rgba(0,184,148,0.2)] hover:shadow-[0_15px_25px_rgba(0,184,148,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 text-base disabled:opacity-50"
          >
            <Share2 className="w-5 h-5" />
            <span>
              {isGeneratingImage ? 'Menyiapkan Gambar & Caption...' : 'Bagikan Website'}
            </span>
          </button>

          {/* Opsi Tambahan: Unduh Gambar (PNG) */}
          <button
            onClick={handleDownload}
            disabled={isGeneratingImage || !qrDataUrl}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 text-xs active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh Gambar Kartu (PNG)</span>
          </button>
        </div>

        {/* Hidden Canvas untuk Rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

// Tombol Pemicu yang disematkan pada baris kartu bisnis di Dashboard
export function ShareWebsiteButton({ business }: { business: BusinessShareData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-[#00b894]/40 bg-[#00b894]/10 text-[#00b894] hover:bg-[#00b894]/20 hover:border-[#00b894] font-bold rounded-lg transition-all text-sm flex items-center gap-2 active:scale-95"
        title="Bagikan kartu bisnis digital dengan QR Code"
      >
        <Share2 className="w-4 h-4" />
        <span>Bagikan Web</span>
      </button>

      <ShareWebsiteModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        business={business} 
      />
    </>
  );
}
