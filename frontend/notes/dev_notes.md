# Catatan Pengembangan F&B Mendatang

## 1. Fitur Pengiriman Khusus (Khususnya Tema Bakery)
Saat ini fitur ini telah diarsipkan dari tema `Bakery Default` untuk standarisasi awal, namun harus dipertimbangkan untuk dikembangkan menjadi komponen dinamis yang bisa diisi oleh user melalui Live Editor.

**Komponen yang Dihapus/Disimpan:**
- Judul Layanan: "Kurir Khusus Kue / Mobil", "Free Thermal Bag", "Garansi Tiba Sempurna", "Same-Day & Slot Terjadwal".
- Deskripsi/Catatan Kecil terkait logistik dan keamanan pengiriman.

## 2. Fitur Penerapan Promosi (Promo Bar / Top Ticker Bar)
Di masa depan, tambahkan kapabilitas bagi *merchant* untuk mengatur banner promosi dinamis (sebelumnya sempat ada sebagai purwarupa statis "TOP TICKER BAR" di template Retail Artisan).
- *Promo Bar Header* / *Top Ticker Bar* (Misal: "Promo Weekend: Free Ongkir Instant...", "Panen Subuh: Pengiriman kurir cold-storage langsung dari kebun").
- Ticker ini bisa dikonfigurasi bergerak dinamis (*marquee*) atau statis di atas *header* utama.
- Pengaturan teks promosi khusus, USP unik (misal: "Garansi Kesegaran 100%"), kode kupon, minimal transaksi, dan syarat & ketentuan yang melekat.

Fitur ini idealnya diletakkan di tab khusus (misal: tab "Promo/Marketing") pada Live Editor agar semua tema memiliki kapabilitas menampilkan banner promo di bagian atas header secara *plug-and-play*.

## 3. Pengembangan Lanjutan Fitur Halaman Detail Produk & Keranjang Ala Marketplace
Untuk masa mendatang, tingkatkan fungsionalitas `RetailQuickViewModal` dan `RetailCartModal` agar menjadi universal untuk berbagai kategori produk (Tech, Fashion, Grocery) dengan standarisasi yang mengakomodasi:
- **Galeri Multi-Gambar (*Image Carousel*):** Menampilkan sistem *swipe/thumbnail* jika sebuah produk memiliki banyak gambar (memanfaatkan `product.imageGallery`).
- **Sistem Harga & Diskon Spesifik Produk:** Menampilkan harga diskon dan persentase hemat spesifik per item (berbeda dari diskon toko secara umum).
- **Varian Berpengaruh pada Harga (*Price Modifier*):** Menangani kasus di mana pilihan varian tertentu (seperti Storage 256GB atau Ukuran XXL) menambah harga dasar (contoh: `priceModifier: +50000`). Harga pada tombol CTA harus merespon secara dinamis.
- **Spesifikasi Detail Dinamis:** Menyediakan tabel/daftar *key-value pairs* spesifikasi produk (contoh: `Berat: 500g`, `Material: Katun`) menggantikan paragraf deskripsi yang statis.
- **Indikator Stok & Limit Pembelian:** Menambahkan sisa stok (contoh: "Sisa 3!") dan kapabilitas batas maksimal pembelian (*Max Order*).
- **Pemenuhan Pesanan Dinamis (*Fulfillment*):** Membatasi atau mengaktifkan opsi *Delivery* / *Pickup* / *Home Service* secara universal membaca konfigurasi bisnis di database (saat ini *hardcode* di dalam `RetailCartModal`).
