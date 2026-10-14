###  Jawaban Singkat

Package `qrcode` saat ini digunakan untuk **Shortcut Akses URL Tenant (Kartu Identitas Digital Bisnis / Smart ID Card)**, **BUKAN untuk Table Order restoran fisik**.

QR Code yang di-generate tidak membawa parameter nomor meja (seperti `?table=12`), melainkan murni meng-encode URL publik website tenant:
```ts
const websiteUrl = `https://${cleanDomain}/${business.slug}`; // Contoh: https://growfin.my.id/kopisenja
```

---

### 1. Di Mana Fitur Ini Berada?

Fitur ini diimplementasikan secara terpusat pada satu komponen:
* **Komponen**: [frontend/components/dashboard/ShareWebsiteModal.tsx](file:///d:/Project/Growfin%20Digital/frontend/components/dashboard/ShareWebsiteModal.tsx)
* **Pemicu (Trigger)**: Tombol **"Bagikan Web"** (`ShareWebsiteButton`) yang tampil di setiap baris daftar website pada [Dashboard Client (frontend/app/dashboard/page.tsx)](file:///d:/Project/Growfin%20Digital/frontend/app/dashboard/page.tsx#L132).

---

### 2. Cara Kerja Teknis

1. **Generasi QR Code On-the-Fly** (baris 43–57):
   Saat modal dibuka, `QRCode.toDataURL` membuat *Data URL* (Base64) dengan tingkat koreksi kesalahan tinggi (*High Error Correction* `H`):
   ```ts
   QRCode.toDataURL(websiteUrl, {
     width: 400,
     margin: 1,
     color: { dark: '#0f172a', light: '#ffffff' },
     errorCorrectionLevel: 'H'
   });
   ```
2. **Dynamic Canvas Rendering (Retina HD 800 × 1140 px)** (baris 62–217):
   Sistem tidak hanya menampilkan kode QR polos, melainkan menggabungkannya ke dalam canvas HTML5 berbentuk **Kartu Identitas Bisnis Premium (Lanyard Style)** yang memuat:
   * Aksen lubang tali ID Card (*Lanyard Slot*) di bagian atas.
   * Badge verifikasi hijau: `✓ ID BISNIS RESMI`.
   * Avatar lingkaran gradien dengan inisial nama bisnis.
   * Nama Bisnis, Kategori, dan Kota.
   * Kotak QR Code di tengah dengan teks panduan: *"Pindai untuk melihat katalog & layanan"*.
   * Pill box URL domain website tenant + branding Growfin.

---

### 3. Output & Kegunaan bagi Pemilik Bisnis

Dari modal ini, klien UMKM memiliki 3 opsi pemanfaatan:

1. **Unduh Gambar Kartu (`.PNG`)**: 
   Mengunduh kartu vertikal resolusi tinggi siap cetak untuk dipajang di akrilik meja kasir, etalase toko, atau ditempel pada kemasan produk.
2. **Bagikan Langsung via Web Share API (`handleNativeShare`)**:
   Mengirimkan file gambar kartu secara langsung ke WhatsApp Story, Instagram, atau chat pelanggan lengkap dengan teks ajakan berkunjung.
3. **Salin Cepat URL**:
   Menyalin alamat URL pendek tenant langsung ke clipboard.

---

### Kesimpulan untuk Pengembangan Table Order di Masa Depan
Jika di kemudian hari ingin mengembangkan fitur **Table Order Restoran Fisik**, fondasi `qrcode` ini sudah sangat siap. Anda cukup memodifikasi URL target dengan menambahkan parameter meja (misal: `https://growfin.my.id/[slug]?table=[nomor_meja]`), lalu menyediakan generator batch (cetak QR Meja 1 sampai 20) di dashboard FnB.