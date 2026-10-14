

## Cara Kerja Sistem Tracking Analytics

Arsitekturnya sederhana dan terdiri dari **3 lapisan**, tapi dengan beberapa celah penting.

---

### Lapisan 1 — Pengumpulan Data: `GlobalClickTracker.tsx`

[`GlobalClickTracker.tsx`](file:///d:/Project/Growfin%20Digital/frontend/components/demo/GlobalClickTracker.tsx) adalah satu-satunya komponen tracker yang ada. Cara kerjanya:

```
Mount di halaman → generate visitor_id → pasang event listener global
                                              ↓
                              document.addEventListener('click', ...)
                                              ↓
                         Apakah target adalah <a> atau <button>?
                                    ↙              ↘
                                  Ya               Tidak → abaikan
                                   ↓
                    Apakah href mengandung wa.me / whatsapp.com
                    ATAU teks mengandung "whatsapp" / "pesan via wa"?
                                    ↓
                             POST /api/analytics/track
                             { event_type: 'whatsapp_click' }
```

Selain click, tracker juga langsung menembak `page_view` saat pertama mount (di `useEffect`).

**Visitor ID**: Dibuat dengan `'vis_' + Math.random().toString(36)` dan disimpan di `sessionStorage`. Artinya ID **reset setiap kali browser ditutup** — bukan persistent unique visitor.

---

### Lapisan 2 — Penyimpanan: `POST /api/analytics/track`

[`/api/analytics/track/route.ts`](file:///d:/Project/Growfin%20Digital/frontend/app/api/analytics/track/route.ts) hanya melakukan satu hal — INSERT ke tabel `analytics_events`:

```typescript
// Payload yang diterima:
{ business_id, event_type, visitor_id }

// Yang disimpan ke DB:
{ business_id, event_type, visitor_id: visitor_id || 'anonymous', created_at: auto }
```

Menggunakan **service role key** (bypass RLS) — artinya tidak perlu user login untuk mencatat event. Ini **fire-and-forget** dari sisi client (`fetch(...).catch(...)`).

---

### Lapisan 3 — Konsumsi: Dashboard User

Hanya ada **satu** tempat yang membaca `analytics_events` — [`/dashboard/page.tsx`](file:///d:/Project/Growfin%20Digital/frontend/app/dashboard/page.tsx):

```typescript
// Query yang dijalankan:
.from('analytics_events')
.select('business_id, event_type')
.in('business_id', businessIds)
.eq('event_type', 'whatsapp_click')  // ← hanya filter WA click

// Output yang ditampilkan di UI:
- Total semua WA click (kartu "Total Prospek")
- WA click per bisnis (angka kecil di tiap business card)
```

`page_view` **direkam ke DB tapi tidak pernah ditampilkan di UI manapun**.

---

### Gap & Masalah Kritis

| Masalah | Detail |
|---|---|
| **Tracker hanya aktif di `/site/[slug]`** | [`GlobalClickTracker` hanya di-mount di `app/site/[slug]/page.tsx`](file:///d:/Project/Growfin%20Digital/frontend/app/site/%5Bslug%5D/page.tsx#L130). Halaman `/demo/[slug]` (preview untuk owner) **tidak ditracking sama sekali** — ini baik untuk akurasi data, tapi perlu dikonfirmasi apakah disengaja. |
| **`window.open()` tidak tertangkap tracker** | Beberapa komponen membuka WA via `window.open(waUrl, '_blank')` langsung tanpa melalui `<a>` tag — misalnya `RetailCartModal`, `GroomingBookingModal`, `ServiceBookingModal`, `ArtisanContact`. Tracker yang mengandalkan `closest('a, button')` **tidak bisa mendeteksi ini** karena tidak ada elemen anchor yang diklik. Klik dari modal-modal ini **tidak ter-record**. |
| **Visitor ID tidak persistent** | `sessionStorage` reset saat tab ditutup — tidak bisa tracking unique visitor antar sesi / hari. |
| **`page_view` mubazir** | Direkam ke DB tapi tidak dikonsumsi di UI manapun. Kolom `visitor_id` di DB juga tidak pernah diquery. |
| **Tidak ada deduplication** | Satu klik bisa trigger multiple events jika event bubbling. Tidak ada throttle atau debounce. |
| **Vercel Analytics terpisah** | `@vercel/analytics` dipasang di root layout — ini tracking terpisah milik Vercel (page view, dsb.) yang **tidak terhubung ke tabel `analytics_events`** sama sekali. Dua sistem berjalan paralel tanpa integrasi. |