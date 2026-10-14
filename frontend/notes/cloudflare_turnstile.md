
### 1. Di Mana Turnstile Diimplementasikan Secara Aktif?

Proteksi Cloudflare Turnstile **hanya diimplementasikan secara aktif pada 1 tempat**:

#### 🛡️ Form Generate Website Organik (Landing Page Utama)
* **Komponen Frontend**: [frontend/components/main-landing/onboarding-modal.tsx (baris 6 & 297–299)](file:///d:/Project/Growfin%20Digital/frontend/components/main-landing/onboarding-modal.tsx#L297-L299)
  * Widget dirender tepat di atas tombol submit *"Buat Website Sekarang"*:
    ```tsx
    <Turnstile 
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
      onSuccess={(token) => setFormData({ ...formData, turnstileToken: token })} 
    />
    ```
  * Terdapat validasi *client-side*: jika `turnstileToken` kosong saat submit, form akan diblokir dengan peringatan `Silakan verifikasi captcha terlebih dahulu`.
* **Verifikasi Server-side (Backend API)**: [frontend/app/api/generate/route.ts (baris 88–112)](file:///d:/Project/Growfin%20Digital/frontend/app/api/generate/route.ts#L88-L112)
  * Endpoint `POST /api/generate` mewajibkan `turnstileToken`.
  * Server memvalidasi token secara langsung ke endpoint Cloudflare:
    ```ts
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileData // berisi secret key & response token
    });
    ```
  * Jika verifikasi gagal, API langsung menghentikan proses (HTTP 400), sehingga **Google Gemini AI dan Google Maps scraper terlindungi dari serangan bot / spam generation**.

---

### 2. Status di Area Lain yang Ditanyakan

| Area Aplikasi | Status Turnstile | Keterangan Teknis |
| :--- | :---: | :--- |
| **Form Generate Organik (Landing Page)** |  **AKTIF** | Diproteksi *end-to-end* (Widget UI + Validasi Server ke Cloudflare API). |
| **Pencarian Template via WA (`mode: find`)** | ❌ **TIDAK AKTIF** | Di modal yang sama pada tab *"Cari Template Anda"* (query ke `/api/find`), input nomor WA tidak diproteksi captcha. |
| **Halaman Login Autentikasi (`/login`)** | ❌ **TIDAK AKTIF** | [app/login/page.tsx](file:///d:/Project/Growfin%20Digital/frontend/app/login/page.tsx) langsung memanggil `supabase.auth.signInWithPassword()` tanpa widget captcha. |
| **Proses Checkout Midtrans** | ❌ **TIDAK AKTIF** | Baik saat registrasi akun baru di [CheckoutModal.tsx](file:///d:/Project/Growfin%20Digital/frontend/components/demo/checkout/CheckoutModal.tsx) maupun saat membuat Snap Token di [app/api/checkout/route.ts](file:///d:/Project/Growfin%20Digital/frontend/app/api/checkout/route.ts), tidak ada verifikasi Turnstile. |

---

### Kesimpulan & Catatan Keamanan
Implementasi Turnstile saat ini **difokuskan secara eksklusif sebagai tameng biaya API (Cost-Protection Firewall)** untuk mencegah bot menghabiskan kuota scraping Google Maps dan token Gemini Flash pada form pembuatan website gratis di halaman depan.