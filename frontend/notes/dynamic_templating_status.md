# Status Implementasi: Full Dynamic Templating & Promo Bar
> Analisis per Oktober 2026 | Berdasarkan `lib/types.ts`, `LiveEditorDrawer.tsx`, dan seluruh Layout component

---

## TL;DR Verdict

| Fitur | Data Contract | Rendering Engine | Editor UI (Client) |
|---|---|---|---|
| `sectionOrder` (pengurutan halaman) | ✅ Terdefinisi | ✅ **Sebagian besar layout** | ✅ **Fungsional** (↑↓ button) — tapi **hanya FnB** |
| `marketing.usps` (keunggulan toko) | ✅ Terdefinisi | ✅ Semua tema Retail | ✅ **Fungsional** (3 input aktif) |
| `marketing.promoLabel` | ✅ Terdefinisi | ✅ Semua tema Retail | ❌ `ComingSoonField` (disabled) |
| `marketing.discountPercentage` | ✅ Terdefinisi | ✅ Semua tema Retail | ❌ `ComingSoonField` (disabled) |
| `marketing.flashSaleEnd` | ✅ Terdefinisi | ✅ Semua tema Retail | ❌ `ComingSoonField` (disabled) |
| `uiLabels.buyButtonText` | ✅ Terdefinisi | ✅ Semua tema Retail | ❌ `ComingSoonField` (disabled) |
| `uiLabels.viewAllButtonText` | ✅ Terdefinisi | ❌ Tidak ada render | ❌ Tidak ada input |
| `uiLabels.lookbookButtonText` | ✅ Terdefinisi | ✅ Retail: Fresh, Tech, Artisan, Dark | ❌ `ComingSoonField` (disabled) |

---

## 1. `sectionOrder` — Section Ordering

### Status Rendering Engine: ✅ Sebagian Besar Berjalan

Implementasi sudah ada di mayoritas Layout component menggunakan pola `array.map(sectionId => switch(sectionId))`:

| Template | Implementasi `sectionOrder` | Section yang Bisa Diurutkan |
|---|---|---|
| FnB: Classic, Modern, Premium | ✅ `order.map()` dengan fallback array | `hero`, `menu`, `gallery`, `reviews` |
| FnB: Artisan, Elegant | ✅ `client.sectionOrder?.map()` — **wajib ada, tanpa hardcode fallback** | `hero`, `menu`, `gallery`, `reviews` |
| Retail: Urban, Editorial, Tech, Dark, Fresh, Artisan | ✅ `order.map()` dengan fallback | `hero`, `lookbook`, `katalog`, `testimoni` |
| Grooming (Barbershop, Beauty, Nailspa) | ❌ **Tidak ada** | — |
| Service (Klinik, dsb.) | ❌ **Tidak ada** | — |

> [!WARNING]
> FnB tema **Artisan** dan **Elegant** menggunakan `client.sectionOrder?.map()` **tanpa fallback**. Jika `sectionOrder` adalah `null/undefined` (data lama), halaman akan render **kosong** (blank). Tema lain aman karena ada `|| [default_array]`.

### Status Editor UI: ✅ Fungsional — Tapi Hanya untuk FnB

Di [`LiveEditorDrawer.tsx`](file:///d:/Project/Growfin%20Digital/frontend/components/demo/editor/LiveEditorDrawer.tsx#L500-L544), UI pengurutan section **sudah berfungsi penuh** dengan tombol ↑↓ yang men-trigger `handleChange('sectionOrder', newOrder)`.

**Gap penting:** UI ini ada di tab **"Banner Utama (hero)"** — lokasinya tidak intuitif. Lebih logis kalau ada di tab "Tampilan" atau tab tersendiri "Tata Letak".

**Gap kritis:** Drawer hanya me-render label section untuk FnB (`'hero'`, `'gallery'`, `'reviews'`, `'menu'`). Tidak ada logika berbeda untuk Retail (`'lookbook'`, `'katalog'`, `'testimoni'`), sehingga **user Retail yang membuka pengaturan ini akan melihat label yang tidak relevan** (meski secara teknis `handleChange` tetap menyimpan data dengan benar).

---

## 2. `marketing` — Promo Bar & Fitur Marketing

### Status Rendering Engine: ✅ Berjalan di Retail, ❌ Tidak ada di FnB/Grooming/Service

**Semua 6 tema Retail** (`Urban`, `Editorial`, `Tech`, `Dark`, `Fresh`, `Artisan`) sudah membaca dan merender:
- `promoLabel` → ditampilkan sebagai badge/label di hero section (hanya muncul jika ada nilainya)
- `discountPercentage` → badge diskon di sudut produk unggulan
- `flashSaleEnd` → dibaca untuk countdown timer (implementasi countdown bervariasi per tema)
- `usps` → array keunggulan toko, ditampilkan di hero section

Pola yang konsisten digunakan di semua Retail Hero:
```typescript
const spotlightLabel = client.marketing?.promoLabel || 'Fallback Label';
const flashSaleEnd = client.marketing?.flashSaleEnd;
// Conditional render: {client.marketing?.promoLabel && (<Badge>)}
```

### Status Editor UI: ⚠️ Sebagian Fungsional, Sebagian Dikunci

| Sub-field | Editor UI Status |
|---|---|
| `marketing.usps` | ✅ **Aktif** — 3 input pair (title + desc) di tab "Trust Center" (sosial), langsung terhubung ke `handleChange('marketing', {...})` |
| `marketing.promoLabel` | ❌ **`ComingSoonField`** — input disabled, tooltip "lagi disiapin tim dev" |
| `marketing.discountPercentage` | ❌ **`ComingSoonField`** — input disabled |
| `marketing.flashSaleEnd` | ❌ **Tidak ada input sama sekali** di editor |

> [!IMPORTANT]
> Sub-field yang paling **bernilai bisnis** (`promoLabel`, `discountPercentage`, `flashSaleEnd`) justru yang **belum bisa diubah user dari editor**. Satu-satunya cara mengisi nilai ini saat ini adalah lewat Supabase Table Editor secara manual (edit kolom `metadata` JSONB).

---

## 3. `uiLabels` — Custom Button Text

### Status Rendering Engine: ✅ Sebagian Retail

Dibaca di beberapa Hero component Retail:
- `buyButtonText` → teks tombol utama CTA
- `lookbookButtonText` → teks tombol galeri/lookbook

`viewAllButtonText` **tidak dirender di manapun** — field ada di type tapi belum ada komponen yang mengonsumsinya.

### Status Editor UI: ❌ Semua `ComingSoonField`

Di tab **"Tampilan" → "Kata-kata di Tombol (Call to Action)"** terdapat 3 field yang kesemuanya menggunakan `ComingSoonField`:
- `"Tombol Beli / Pesan"` → mapped ke `uiLabels.buyButtonText` (berdasarkan label)
- `"Tombol Lihat Semua"` → mapped ke `uiLabels.viewAllButtonText`
- `"Label Diskon/Promo"` → mapped ke `marketing.promoLabel`

Semuanya **disabled** — input ditampilkan ke user tapi tidak bisa diinteraksi.

---

## 4. Peta Kesenjangan (Gap Map)

```
TERSEDIA DI TIPE (types.ts)
│
├── sectionOrder
│   ├── Rendering: ✅ FnB (5/7 tema aman, 2/7 berisiko blank) + Retail (6/6)
│   ├── Editor UI: ✅ Ada UI fungsional
│   └── Gap: UI ada di lokasi tidak intuitif; label section tidak menyesuaikan template type
│
├── marketing.usps
│   ├── Rendering: ✅ Retail (6/6 tema)
│   ├── Editor UI: ✅ Fungsional
│   └── Gap: FnB/Service/Grooming tidak merender field ini
│
├── marketing.promoLabel
│   ├── Rendering: ✅ Retail (6/6 tema, conditional)
│   ├── Editor UI: ❌ ComingSoonField (UI ada tapi disabled)
│   └── Action needed: Aktifkan input, sambungkan ke handleChange('marketing', {...})
│
├── marketing.discountPercentage
│   ├── Rendering: ✅ Retail (4/6 tema, conditional)
│   ├── Editor UI: ❌ ComingSoonField
│   └── Action needed: Input number + connect ke handleChange
│
├── marketing.flashSaleEnd
│   ├── Rendering: ✅ Retail (dibaca, beberapa tema buat countdown)
│   ├── Editor UI: ❌ Tidak ada input sama sekali
│   └── Action needed: DateTime input baru
│
└── uiLabels (buyButtonText, lookbookButtonText)
    ├── Rendering: ✅ Retail sebagian
    ├── Editor UI: ❌ ComingSoonField
    └── Action needed: Aktifkan 2-3 input text
```

---

## 5. Rekomendasi Teknis

> [!TIP]
> Semua yang dibutuhkan untuk menyelesaikan fitur ini sudah ada — tidak perlu membuat komponen baru dari nol. Cukup **mengganti `ComingSoonField` dengan input aktif** dan menghubungkannya ke `handleChange`.

**Effort terkecil, impact terbesar:**

1. **Fix ArtisanLayout & ElegantLayout FnB** — tambahkan fallback `|| ['hero', 'menu', 'gallery', 'reviews']` untuk mencegah blank page pada data lama.

2. **Aktifkan `promoLabel` + `discountPercentage`** di tab "Desain":
   ```tsx
   // Ganti ComingSoonField dengan:
   <input
     type="text"
     value={client.marketing?.promoLabel || ''}
     onChange={(e) => handleChange('marketing', { ...client.marketing, promoLabel: e.target.value })}
   />
   ```

3. **Aktifkan `buyButtonText`** — field ini punya impact tinggi (semua Retail tema membacanya).

4. **Tambah `flashSaleEnd` input** — `<input type="datetime-local" />`, dihubungkan ke `marketing.flashSaleEnd`.

5. **Perbaiki sectionOrder UI** — buat label section aware terhadap `templateType` prop yang sudah dipass ke drawer.
