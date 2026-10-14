###  Rangkuman Eksekutif (TL;DR)

* **Subdomain Dinamis (`slug.growfin.my.id`)**:  **SUDAH STABIL & SIAP**.
  Arsitektur middleware dan query database sudah sepenuhnya bekerja. Cukup memasang *Wildcard DNS* (`*.growfin.my.id`) di penyedia hosting, seluruh subdomain otomatis me-resolve ke tenant masing-masing.
* **Custom Domain Klien (`www.klinikgigi.com`)**: ⚠️ **BELUM SIAP OTOMATIS DI PRODUCTION**.
  Meskipun kode internal Next.js sudah memiliki logika *rewrite*, sistem ini **baru berstatus *logical draft*** dan belum bisa me-resolve custom domain secara otomatis di production karena terbentur **3 blocker teknis** (Infrastruktur SSL, bug normalisasi `www`, dan ketiadaan API/UI provisioning).

---

### 1. Bagaimana Cara Kerja Middleware Saat Ini?

Di [frontend/middleware.ts (baris 34–47)](file:///d:/Project/Growfin%20Digital/frontend/middleware.ts#L34-L47):

```ts
// 1. Handle Subdomains & Custom Domains (e.g. kopisenja.growfin.my.id or www.kopisenja.com)
if (
  hostname !== 'localhost' &&
  hostname !== rootDomain &&
  hostname !== `www.${rootDomain}`
) {
  let currentHost = hostname;
  if (hostname.endsWith(`.${rootDomain}`)) {
    currentHost = hostname.replace(`.${rootDomain}`, ''); // 'kopisenja'
  }
  
  // Rewrite ke /site/[currentHost]
  return NextResponse.rewrite(new URL(`/site/${currentHost}${path === '/' ? '' : path}`, req.url));
}
```

Kemudian, di [frontend/app/site/[slug]/page.tsx (baris 27 & 46)](file:///d:/Project/Growfin%20Digital/frontend/app/site/%5Bslug%5D/page.tsx#L46):
```ts
const { data: dbData } = await supabase
  .from('business_demos')
  .select('*')
  .or(`slug.eq.${slug},custom_domain.eq.${slug}`)
  .eq('status', 'published')
  .single();
```

---

### 2. Mengapa Subdomain Dinamis Sudah Stabil?

1. **Routing Otomatis**: Jika request datang dari `kopisenja.growfin.my.id`, middleware memotong `.growfin.my.id` sehingga `currentHost` menjadi `kopisenja`. Request di-rewrite ke `/site/kopisenja`, lalu Supabase mencocokkan kolom `slug = 'kopisenja'`.
2. **Infrastruktur DNS Tunggal**: Anda hanya perlu menambahkan 1 *record* DNS di Cloudflare/Vercel:
   * **Type**: `CNAME` | **Name**: `*` | **Target**: `cname.vercel-dns.com` (atau domain server Anda).
   Sertifikat SSL Wildcard langsung mencakup semua subdomain tanpa intervensi manual.

---

### 3. Mengapa Custom Domain Belum Siap Otomatis di Production?

Ada 3 kendala utama yang membuat custom domain klien belum bisa langsung hidup di production:

#### A. Blocker Infrastruktur: Handshake SSL & Hostname Verification (Vercel / Cloudflare)
* Jika klien mengarahkan CNAME `www.klinikgigi.com` ke server Vercel Anda, **Vercel akan me-reject koneksi dengan status `404: Deployment Not Found` atau SSL Error**.
* Vercel (maupun Cloudflare) tidak akan melayani traffic dari domain luar kecuali domain tersebut telah didaftarkan ke proyek via **Vercel Domains API** (`POST /v1/projects/:id/domains`) atau **Cloudflare for SaaS (Custom Hostnames)**.
* **Kondisi kode saat ini**: Belum ada integrasi backend sama sekali ke Vercel API / Cloudflare for SaaS untuk mendaftarkan dan memverifikasi sertifikat SSL domain klien.

#### B. Bug Normalisasi `www` vs Apex Domain di Middleware
Perhatikan baris 37–42 di [middleware.ts](file:///d:/Project/Growfin%20Digital/frontend/middleware.ts#L40-L43):
* Middleware hanya menghapus `www.` untuk root domain (`growfin.my.id`).
* Jika di database kolom `custom_domain` diisi `klinikgigi.com`, namun pengunjung mengetik `www.klinikgigi.com`, middleware akan mengoper `currentHost = 'www.klinikgigi.com'`.
* Query Supabase: `.or('slug.eq.www.klinikgigi.com,custom_domain.eq.www.klinikgigi.com')` → **Hasilnya NULL (404 Not Found)** karena perbedaan prefix `www.`.
* *Solusi yang dibutuhkan*: Middleware harus membersihkan prefix `www.` dari custom domain sebelum dioper ke `/site/[slug]`.

#### C. Ketiadaan UI dan Flow Manajemen Domain di Dashboard
* Di form pengaturan dashboard klien ([SettingsForm.tsx](file:///d:/Project/Growfin%20Digital/frontend/app/dashboard/settings/SettingsForm.tsx)), **tidak ada input field untuk `custom_domain`**.
* Kolom `custom_domain` di database saat ini hanya bisa diisi manual oleh developer langsung melalui Supabase Table Editor.
* Tidak ada panduan otomatis bagi klien mengenai instruksi DNS (ke mana CNAME harus diarahkan dan bagaimana status verifikasi SSL-nya).

---

### Roadmap untuk Menjadikan Custom Domain Production-Ready

Jika Anda ingin mengaktifkan fitur Custom Domain secara mandiri:
1. **Fix Middleware**: Tambahkan `currentHost = currentHost.replace(/^www\./, '');` agar baik versi `www` maupun non-`www` mengarah ke record yang sama.
2. **Integrasi Vercel Domains API / Cloudflare for SaaS**:
   * Buat API endpoint `/api/domains/add` yang memanggil Vercel API untuk mendaftarkan custom domain dan mengembalikan status verifikasi DNS TXT/CNAME.
3. **Tambahkan Tab "Domain & URL" di Dashboard**:
   * Berikan antarmuka di mana klien paket *Pro/Enterprise* bisa memasukkan nama domain mereka dan melihat status: `DNS Pending`, `SSL Issuing`, atau `Active`.