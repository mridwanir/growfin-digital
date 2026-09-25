# 🚀 Growfin Digital - Master Platform Blueprint & Architecture (v2.0)

**Dokumen Status:** Aktif (Core Reference & Developer Guidelines)
**Tujuan Dokumen:** Menjadi panduan utama (*Single Source of Truth*) bagi tim pengembang, manajer produk, dan pemangku kepentingan. Dokumen ini merangkum visi, arsitektur, kontrak data, dan mekanisme sistem untuk memastikan proyek tetap terukur (*scalable*) dan konsisten terlepas dari pergantian tim di masa depan.

---

## 1. Visi Produk & Strategi Bisnis (Product-Led Growth)

**Growfin Digital** adalah platform *Software House* dan *SaaS* yang dirancang untuk mendigitalisasi UMKM Indonesia secara instan.

* **Core Value:** Kecepatan dan keterjangkauan. Platform ini bertindak sebagai **"Mesin Akuisisi Mandiri"**.
* **Strategi:** *Land and Expand*. Memberikan "Aha! moment" instan kepada pengguna tanpa perlu mendaftar terlebih dahulu, lalu mengonversi mereka menjadi pengguna berbayar (mulai dari Rp 299k) untuk mempublikasikan website mereka.

---

## 2. Arsitektur Sistem Utama (Monorepo)

Proyek ini berjalan dalam satu ekosistem *monorepo* yang terbagi menjadi dua pilar eksekusi yang saling berbagi *database* yang sama:

1. **Frontend App (`/frontend`) - SaaS & Rendering Engine**
* **Tech Stack:** Next.js (App Router), React, TailwindCSS, shadcn/ui.
* **Fungsi:** Menangani *landing page*, alur pembuatan organik, Dashboard User (editor konten), dan mesin *rendering* komponen dinamis yang membaca JSON dari *database*.


2. **Outreach & Automation Backend (`/outreach_crew`) - Growth Engine**
* **Tech Stack:** Python, CrewAI, Gemini 2.5 Flash, Pydantic.
* **Fungsi:** Mesin pencari *leads* massal via Google Places API dan pembuat website otomatis untuk strategi *outbound marketing* (WA Blast).


3. **Database & Auth (Supabase)**
* Pusat penyimpanan data (PostgreSQL), manajemen *metadata JSONB*, dan autentikasi pengguna.



---

## 3. Kontrak Data & Strategi Database (Single Table Architecture)

Platform menggunakan **Single Table Strategy** untuk mengelola seluruh siklus hidup website (*draft, claimed, locked, published*) tanpa memindahkan data antar tabel.

**Tabel Utama: `public.business_demos**`

* **Identitas Utama:** `id` (UUID), `slug` (Unique).
* **Data Mentah:** `name`, `category`, `phone`, `city`, `maps_url`.
* **Data Tampilan (Agnostik):** `metadata` (Tipe `JSONB`). Berisi struktur data murni hasil racikan AI (jam buka, warna tema, daftar menu, ulasan, profil admin/dokter). **Data ini tidak memuat kode HTML/CSS.**
* **State & Ownership (Manajemen Siklus):**
* `user_id` (UUID - *Foreign key* ke `auth.users`, bernilai `NULL` jika belum diklaim).
* `expires_at` (Timestamptz - Batas waktu kedaluwarsa desain).
* `status` (Text - Nilai: `draft`, `published`, `locked`).
* `layout_id` (Text - Penentu variasi tata letak UI di frontend).



---

## 4. Alur Pembuatan Web (Dual Generation Flows)

Terdapat dua jalur berbeda bagaimana sebuah *slug* dan *metadata JSON* bisa tercipta di dalam tabel `business_demos`:

* **Jalur 1: Organik (User Inisiatif via Next.js)**
User mengunjungi *landing page* -> Mengisi form bisnis -> API Route Next.js (`/app/api/generate/route.ts`) menarik data Places & mengirim prompt ke Gemini -> Data tersimpan di Supabase -> Frontend menyimpan `slug` di *Cookies/Local Storage* sebagai tanda terima -> User melihat *Live Preview*.
* **Jalur 2: Outreach (Sistem Internal via Python)**
Python Script memindai area via Maps -> CrewAI memproses data menjadi JSON -> Data disuntikkan langsung ke Supabase -> Sistem mengirimkan URL *Live Preview* (`growfin.my.id/demo/[slug]`) melalui pesan WhatsApp ke pemilik bisnis.

---

## 5. Manajemen Siklus Hidup Website (User Journey)

Sistem menggunakan psikologi *FOMO (Fear Of Missing Out)* dan *IKEA Effect* melalui siklus berikut:

1. **Fase Yatim Piatu (Unclaimed):**
Desain baru selesai di-*generate* (baik organik maupun outreach). `user_id` bernilai `NULL`. Batas kedaluwarsa (`expires_at`) otomatis diset **NOW() + 3 Hari**.
2. **Fase Klaim & Registrasi:**
* User organik mengklik "Simpan Desain" (membaca `slug` dari *Cookies*).
* User outreach mengklik "Simpan Desain" (membaca `slug` dari URL).
* Setelah *Login/Register*, sistem melakukan `UPDATE` pada *row* tersebut: mengisi `user_id` pengguna dan memperpanjang `expires_at` menjadi **NOW() + 7 Hari**.


3. **Fase Modifikasi (Dashboard):**
User dapat mengubah isi `metadata` (seperti harga menu atau foto) menggunakan **Form-Based Editor** yang intuitif.
4. **Fase Kadaluwarsa (Locked):**
Jika melewati 7 hari user belum membayar, desain **TIDAK DIHAPUS**. Kolom `status` berubah menjadi `locked`. User masih bisa melihat *thumbnail* di dashboard tetapi tidak bisa mengedit atau mempublikasikan sampai melakukan pembayaran.
5. **Fase Publikasi (Paid/Published):**
User membayar 1 lisensi. `status` berubah menjadi `published`, dan website siap diakses publik dengan domain kustom atau subdomain permanen.

---

## 6. Decoupling UI & Fitur Multi-Layout

Untuk memfasilitasi kebutuhan desain yang berbeda per industri tanpa merusak skalabilitas, platform menerapkan prinsip **Decoupling** secara ketat:

* **Metadata JSON Bersifat Absolut:** AI hanya bertugas menghasilkan struktur konten (Teks, Harga, URL Gambar).
* **Komponen UI Bertugas Membaca:** *Frontend* menggunakan `layout_id` (misal: `clinic-modern`, `clinic-classic`) untuk menentukan komponen *wrapper* mana yang akan dipanggil.
* **Eksekusi Multi-Layout:** Komponen `<ClinicLayoutModern data="{metadata}"/>` dan `<ClinicLayoutClassic data="{metadata}"/>` akan mengonsumsi *payload* JSON yang sama persis, namun merendernya dalam visual yang berbeda.

---

## 7. Aturan Emas Pengembangan (Developer Golden Rules)

Bagi pengembang mana pun yang menyentuh *codebase* ini, wajib mematuhi aturan berikut:

1. **Dilarang Memindahkan Data (No Table Hopping):** Jangan pernah membuat alur di mana data dipindah dari "Tabel Temporary" ke "Tabel Permanen". Gunakan satu tabel `business_demos` dan manipulasi melalui operasi `UPDATE` pada kolom `user_id` dan `status`.
2. **Pertahankan Kemurnian JSON (No Inline Styling):** Jangan pernah meminta AI (di Next.js maupun Python) untuk menyisipkan *tag* HTML, kelas Tailwind, atau *inline CSS* ke dalam *output* JSON. JSON murni berisi *raw data*.
3. **Gunakan Form-Based Editor, Bukan Drag-and-Drop:** Mengingat target pasar adalah UMKM, antarmuka pengeditan di Dashboard harus berupa formulir input sederhana di satu sisi, dan *Live Preview* di sisi lainnya. Hindari kompleksitas *website builder* konvensional.
4. **Isolasi Status Edit (Draft vs Published):** Saat user mengedit di Dashboard setelah web dipublikasi, simpan perubahan tersebut di *state* sementara (atau kolom `draft_metadata`) agar tidak langsung merusak versi *live* sebelum mereka menekan tombol "Simpan/Publikasi Ulang".