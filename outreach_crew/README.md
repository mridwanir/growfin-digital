# 🏥 Growfin Outreach & Lead Automation Engine

## 📌 Ringkasan Proyek

**Growfin Outreach Engine** adalah sistem otomasi pencarian prospek bisnis lokal (*B2B Local Lead Generation*) yang berfokus pada niche **Klinik Kesehatan, Dokter Gigi, dan Estetika**. Sistem ini bekerja secara *end-to-end* dengan alur kerja sebagai berikut:

1. **Discovery:** Memindai data fasilitas kesehatan melalui Google Places API (New) berdasarkan koordinat & radius target.
2. **Filter & Audit:** Memfilter prospek bernilai tinggi (*Hot Leads*), yaitu klinik dengan reputasi tinggi (Rating $\ge$ 4.5, Ulasan $\ge$ 10) yang belum memiliki website mandiri resmi.
3. **AI Content Generation:** Menghasilkan struktur data katalog demo (`BusinessDemo`) dan draf pesan WhatsApp outreach personal menggunakan Google Gemini AI.
4. **Auto-Inject:** Melakukan *auto-inject* data demo baru ke dalam file `lib/demos.ts` pada repositori frontend Next.js (`Growfin Digital`).
5. **Auto-Deploy:** Memicu *auto-commit* dan *auto-push* ke GitHub untuk auto-deployment (Vercel/Hosting) sehingga link demo langsung aktif secara *real-time*.
6. **Reporting & Notifikasi:** Mengirimkan notifikasi instan ke Telegram dan merekapitulasi seluruh prospek ke file Excel terstruktur di folder `Leads/`.

---

## 🏗️ Struktur & Pembagian Modul

Proyek ini menggunakan arsitektur modular berbasis *Separation of Concerns*:

```text
outreach_crew/
├── config/
│   └── settings.py          # Konfigurasi terpusat: API Keys, path repositori web, threshold filter
├── core/
│   ├── models.py            # Validasi skema data Pydantic (BusinessDemo, DoctorInfo, MenuItem)
│   └── pipeline.py          # Orkestrator alur kerja utama (Discovery -> AI -> Inject -> Git -> Notif)
├── services/
│   ├── maps_service.py      # HTTP client Google Places API (New)
│   ├── ai_service.py        # Integrasi Gemini AI (Structured JSON generation & WA pitch copywriting)
│   ├── injector_service.py  # Reader & writer file TypeScript (demos.ts) dengan pencegahan duplikasi slug
│   ├── git_service.py       # Subprocess Git CLI untuk auto-commit & auto-push ke repo Next.js
│   ├── telegram_service.py  # Client pengiriman notifikasi real-time via Telegram Bot API
│   └── storage_service.py   # Ekspor data leads ke Excel dengan penamaan terstruktur di folder Leads/
├── main.py                  # CLI interaktif untuk input nama kota, koordinat titik, dan radius
└── Leads/                   # Direktori penyimpanan rekapitulasi data prospek (.xlsx)
```

---

## 🔄 Alur Data (*Data Flow*)

Berikut adalah tahapan pemrosesan data secara berurutan dalam sistem:

1. **CLI Trigger (`main.py`)**
   - Menerima input interaktif: Nama Kota, Koordinat (`Lat`, `Lng`), dan Radius Scan.

2. **Scan (`maps_service.py`)**
   - Mengambil *raw data* bisnis lokal dari Google Places API (New).

3. **Audit & Filter (`pipeline.py`)**
   - Mengevaluasi prospek berdasarkan kriteria:
     $$	ext{Rating} \ge 4.5 \quad \land \quad 	ext{Reviews} \ge 10 \quad \land \quad 	ext{Website} =  arnothing \implies 	extbf{HOT LEAD}$$

4. **AI Generation (`ai_service.py`)**
   - Gemini menyusun draf pesan WhatsApp yang santai, persuasif, dan personal.
   - Gemini menghasilkan objek JSON terstruktur (data profil dokter dan katalog tindakan) yang tervalidasi skema Pydantic.

5. **Auto-Inject (`injector_service.py`)**
   - Menyisipkan data demo baru ke array `DEMO_DATA` pada path repositori `D:\Project\Growfin Digital\lib\demos.ts`.

6. **Auto-Deploy (`git_service.py`)**
   - Menjalankan `git add`, `git commit`, dan `git push` pada proyek Next.js untuk memicu *live build* & *deployment* instan di Vercel.

7. **Reporting (`storage_service.py` & `telegram_service.py`)**
   - Menyimpan seluruh prospek ke dalam file `Leads/leads_klinik_[kota]_[lat]_[lng]_[timestamp].xlsx`.
   - Mengirimkan rekap, draf *pitch*, dan link demo yang sudah *live* ke grup Telegram tim *outreach*.