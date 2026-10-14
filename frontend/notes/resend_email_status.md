### 1. Fitur yang SUDAH Menggunakan Resend Saat Ini

Hingga saat ini, **hanya ada 1 fitur** di aplikasi yang aktif menggunakan Resend, yaitu:

#### 📧 Notifikasi Otomatis: *"Website Bisnis Anda Sudah Siap"* (Post-Generation Lead)
* **File Lokasi**: [frontend/app/api/generate/route.ts (baris 413–437)](file:///d:/Project/Growfin%20Digital/frontend/app/api/generate/route.ts#L413-L437)
* **Inisialisasi**: Baris 5 & 9:
  ```ts
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  ```
* **Alur Teknis**:
  1. Pengguna atau admin menginput data prospek di formulir landing page (`name`, `category`, `phone`, `email`, `city`, `mapsUrl`).
  2. Sistem melakukan *scraping* data Google Maps dan memicu **Google Gemini AI** untuk menghasilkan JSON layout & copy website.
  3. Data demo disimpan ke tabel `business_demos` di Supabase.
  4. Begitu demo berhasil dibuat, sistem langsung memicu pengiriman email secara asinkron:
     ```ts
     await resend.emails.send({
       from: 'Growfin <hello@growfin.my.id>',
       to: email,
       subject: 'Website Bisnis Anda Sudah Siap',
       html: `... previewUrl: https://growfin.my.id/demo/${slug} ...`
     });
     ```
  5. Pengiriman ini dibungkus dalam blok `try/catch` *non-blocking* (jika email gagal dikirim atau API key belum tervalidasi di Resend, proses pembuatan demo di web tetap berjalan sukses).

---

### 2. Status Fitur-Fitur Lain yang Ditanyakan

| Fitur yang Ditanyakan | Status di Kode Saat Ini | Penjelasan Teknis |
| :--- | :---: | :--- |
| **Email Invoice Midtrans** | ❌ **Belum Ada** | Di endpoint [app/api/checkout/verify/route.ts](file:///d:/Project/Growfin%20Digital/frontend/app/api/checkout/verify/route.ts), setelah status pembayaran Midtrans dinyatakan `paid` dan demo diubah ke `published`, **sama sekali tidak ada panggilan `resend.emails.send`**. Pengiriman invoice resmi dari aplikasi kita saat ini belum diimplementasikan. |
| **Notifikasi FOMO Sebelum Expired** | ❌ **Belum Ada** | Field `fomo_expires_at` (default 3 hari) di tabel `business_demos` saat ini **hanya diperiksa secara pasif di frontend** saat halaman demo dikunjungi (via `LockedScreen` di [app/demo/[slug]/page.tsx](file:///d:/Project/Growfin%20Digital/frontend/app/demo/%5Bslug%5D/page.tsx#L70)). Belum ada background cron job yang memantau sisa waktu untuk mengirimkan email *warning/reminder* via Resend. |
| **OTP / Konfirmasi Supabase Auth** | ❌ **Bukan via Resend SDK** | Alur autentikasi di [CheckoutModal.tsx](file:///d:/Project/Growfin%20Digital/frontend/components/demo/checkout/CheckoutModal.tsx#L79) dan [app/login/page.tsx](file:///d:/Project/Growfin%20Digital/frontend/app/login/page.tsx#L25) menggunakan `supabase.auth.signUp()` dan `signInWithPassword()`. Email bawaan Supabase Auth dikirim langsung oleh server SMTP Supabase, bukan melalui panggilan SDK Resend di Next.js. |

---

### 3. Rekomendasi Fitur Tambahan Menggunakan Resend

Karena kredensial dan package `resend` sudah terpasang, package ini sangat potensial untuk segera dimanfaatkan pada titik-titik krusial berikut:

1. **Email Kuitansi & Faktur Midtrans**: Panggil `resend.emails.send()` di dalam [app/api/checkout/verify/route.ts](file:///d:/Project/Growfin%20Digital/frontend/app/api/checkout/verify/route.ts) begitu status transaksi berubah menjadi `paid`, lengkap dengan detail paket (`package_tier`) dan panduan klaim dashboard.
2. **Cron Reminder FOMO**: Buat endpoint cron (misal: `/api/cron/fomo-reminders`) yang mencari record dengan `status = 'draft'` dan `fomo_expires_at <= now() + 24 hours` untuk mengirimkan email pengingat urgensi diskon sebelum link terkunci.
3. **Magic Link / Password Reset Kustom**: Menggantikan template email default Supabase Auth dengan template bermerek Growfin yang dikirim langsung melalui Resend.