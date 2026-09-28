# Growfin Digital - Frontend Architecture & User Journey

Dokumentasi ini dibuat untuk memandu developer memahami alur utama (Golden Path) pada sisi frontend aplikasi Growfin Digital, sebuah platform AI Website Builder (SAAS).

---

## 🚀 Alur Pengguna (Core User Journey)

Keseluruhan aplikasi ini dirancang untuk mengubah *leads* (calon pelanggan) menjadi pelanggan berbayar dalam 1 sesi mulus tanpa hambatan. Berikut adalah 5 tahapan utamanya:

### 1. Landing Page & Form Input (`/`)
- **Lokasi:** `app/page.tsx` & komponen di `components/main-landing/`
- **Proses:** User mengunjungi halaman utama dan mengisi formulir modal cerdas (Nama Bisnis, Kategori, Nomor WhatsApp, Kota, URL Google Maps).
- **Aksi:** Saat tombol submit ditekan, data dikirim ke endpoint `/api/generate`.

### 2. AI Generation & Templating (`/api/generate`)
- **Lokasi:** `app/api/generate/route.ts`
- **Proses:** Backend menyimpan data ke tabel `business_demos` (status: `draft`), lalu menggunakan Google Gemini AI untuk men-generate struktur copy/teks website (JSON metadata).
- **Routing Cerdas:** Sistem menentukan *Layout ID* berdasarkan kategori (misalnya F&B menjadi `fnb-restaurant-modern-default`).
- **Aksi:** Setelah proses selesai, user di-redirect secara otomatis ke `/demo/[slug]`.

### 3. Preview & Live Editor (`/demo/[slug]`)
- **Lokasi:** `app/demo/[slug]/page.tsx`, `components/demo/editor/LiveEditorDrawer.tsx`, dan `DemoEditorWrapper.tsx`.
- **Proses:**
  - Halaman demo merender komponen tema yang spesifik berdasarkan Kategori & Sub-Kategori (misal: `CafeRouter`, `RestaurantRouter`, `BeautyNSpaRouter`).
  - **Live Editor Drawer:** Owner (Pemilik) disajikan dengan *Floating Toolbar* di bagian bawah layar. Mereka dapat membuka *drawer* untuk mengganti Tema (Layout Switcher), mengedit Informasi Dasar, Jam Buka/Tutup, hingga Manajemen Menu & Foto.
  - Setiap kali user menyimpan perubahan di editor, form akan memanggil `/api/demo/save` (memotong aturan RLS Supabase menggunakan Service Role) dan merefresh halaman secara instan (Live Reload).

### 4. Auth & Checkout Payment (`CheckoutModal.tsx`)
- **Lokasi:** `components/demo/checkout/CheckoutModal.tsx`, `/api/checkout`, `/api/checkout/verify`
- **Proses:** Saat user menekan tombol **🚀 Publish Web** di Toolbar, alur berikut terjadi:
  1. **Autentikasi (Step 1):** User diminta membuat akun atau login. Terhubung langsung dengan `supabase.auth`.
  2. **Pemilihan Paket & Pembayaran (Step 2):** User memilih paket berlangganan (Basic, Pro, Enterprise). Harga dikirim ke `/api/checkout`.
  3. **Midtrans Snap:** Backend memanggil API Midtrans untuk menerbitkan Token QRIS/CC. Pop-up Snap muncul di layar tanpa berpindah halaman.
  4. **Verifikasi:** Jika sukses, webhook/callback internal (`/api/checkout/verify`) mengubah status web menjadi `published` dan menautkan `user_id` milik user ke baris bisnis tersebut.
  5. **Aksi:** User di-redirect ke Dashboard.

### 5. Dashboard CMS Kelola Website (`/dashboard`)
- **Lokasi:** `app/dashboard/`, `app/dashboard/settings`, dan `components/dashboard/`
- **Proses:**
  - **Auth Guard:** Di dalam `app/dashboard/layout.tsx`, terdapat pengecekan sesi SSR menggunakan `@supabase/ssr`. User tanpa sesi aktif dilarang masuk.
  - **Overview (`page.tsx`):** Menampilkan statistik dan daftar seluruh website yang diiklankan/dimiliki oleh user (filter by `user_id`).
  - **CMS / Settings (`settings/page.tsx`):** Formulir lengkap bagi user untuk terus memperbarui isi konten website mereka selamanya (mirip dengan Live Editor, namun antarmuka dashboard statis).

---

## 📁 Struktur Folder Penting (Routing)

Aplikasi ini menggunakan **Next.js App Router**.

```text
frontend/
├── app/
│   ├── api/                 # Backend Endpoint (Generate AI, Midtrans Checkout, Save Demo)
│   ├── dashboard/           # Area terproteksi khusus user yang sudah bayar/login
│   ├── demo/[slug]/         # Halaman pratinjau website yang di-generate
│   ├── login/               # Pintu masuk (Login Page) ke Dashboard
│   └── page.tsx             # Halaman Landing Page Utama (Pemasaran & Form Input)
├── components/
│   ├── dashboard/           # Sidebar & Komponen pembentuk Dashboard
│   ├── demo/                # Core Logic untuk Demo (Kategori Bisnis, Theming, Live Editor)
│   │   ├── checkout/        # CheckoutModal (Midtrans + Supabase Auth)
│   │   ├── editor/          # LiveEditorDrawer, Toolbar, DemoEditorWrapper
│   │   ├── fnb/             # Komponen tema khusus Food & Beverage (Cafe, Resto)
│   │   ├── grooming/        # Komponen tema khusus Barbershop & Salon
│   │   └── retail/          # Komponen tema khusus Retail (Pakaian, dll)
│   └── main-landing/        # Komponen penyusun halaman depan (Hero, Header, Pricing)
├── utils/
│   └── supabase/            # Konfigurasi Supabase Client & SSR (Cookies)
└── lib/                     # Utilitas tambahan (Context, Supabase V2 JS)
```

## 🎨 Arsitektur Theming (Desain Fleksibel)
Templating pada aplikasi ini dipecah berdasarkan `Kategori -> Sub-Kategori -> Tema Layout`.
Sebagai contoh, pada *F&B - Cafe*:
- Terdapat `CafeRouter.tsx` yang membaca `themeVariant`.
- Jika `themeVariant` adalah `modern-default`, sistem akan me-render komponen `<CafeHero>`, `<CafeMenu>`, dll.
- Jika `themeVariant` adalah `premium-dark`, sistem me-render kumpulan komponen khusus tema gelap.

Pemisahan ini membuat *codebase* tetap bersih dan memudahkan developer UI/UX untuk sekadar menambah varian komponen baru di masa depan tanpa merusak logika utama (Plug & Play).

---
*Dokumentasi ini ditulis sebagai fondasi untuk estafet pengembangan di masa mendatang.*
