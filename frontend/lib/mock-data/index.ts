export interface MockData {
  tagline: string;
  hours: string;
  features: { id: number; title: string; description: string; icon: string }[];
  products: { id: number; name: string; desc: string; price: string; category: string }[];
  reviews: { authorName: string; rating: number; text: string; time: string }[];
  heroImage: string;
}

export function getMockData(category: string): MockData {
  const normalizedCat = category.toLowerCase();

  if (normalizedCat === 'cafe' || normalizedCat === 'coffee shop') {
    return {
      tagline: 'Tempat nyaman untuk menikmati kopi spesialti dan momen berharga bersama teman.',
      hours: 'Setiap Hari: 08:00 - 22:00',
      heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
      features: [
        { id: 1, title: 'Biji Kopi Pilihan', description: 'Kopi 100% Arabica dari petani lokal terbaik.', icon: '☕' },
        { id: 2, title: 'Free WiFi Ngebut', description: 'Cocok untuk WFC (Work From Cafe) seharian.', icon: '📶' },
        { id: 3, title: 'Pastry Fresh Oven', description: 'Aneka roti dan kue yang dipanggang segar setiap hari.', icon: '🥐' },
      ],
      products: [
        { id: 1, name: 'Es Kopi Susu Aren', desc: 'Signature espresso dengan gula aren asli dan susu krimi.', price: 'Rp 25.000', category: 'Signature' },
        { id: 2, name: 'Caramel Macchiato', desc: 'Espresso dengan sirup caramel dan vanilla foam.', price: 'Rp 35.000', category: 'Espresso Based' },
        { id: 3, name: 'Almond Butter Croissant', desc: 'Croissant renyah dengan isian almond butter premium.', price: 'Rp 30.000', category: 'Pastry' },
        { id: 4, name: 'Truffle French Fries', desc: 'Kentang goreng renyah dengan aroma truffle oil.', price: 'Rp 28.000', category: 'Snacks' },
      ],
      reviews: [
        { authorName: 'Reza Pahlevi', rating: 5, text: 'Tempatnya cozy banget buat nugas, kopinya juga pas rasanya!', time: '1 minggu lalu' },
        { authorName: 'Siti Aminah', rating: 4, text: 'Croissant-nya juara, flaky banget. Pelayanan juga ramah.', time: '3 minggu lalu' },
      ]
    };
  }

  if (normalizedCat === 'klinik' || normalizedCat === 'kesehatan') {
    return {
      tagline: 'Layanan kesehatan modern, profesional, dan terpercaya untuk Anda dan keluarga.',
      hours: 'Senin - Sabtu: 09:00 - 20:00',
      heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      features: [
        { id: 1, title: 'Dokter Profesional', description: 'Ditangani oleh dokter spesialis dan umum berpengalaman.', icon: '👨‍⚕️' },
        { id: 2, title: 'Alat Medis Modern', description: 'Fasilitas dan peralatan medis dengan standar terkini.', icon: '🔬' },
        { id: 3, title: 'Farmasi Lengkap', description: 'Apotek terintegrasi dengan obat-obatan berlisensi BPOM.', icon: '💊' },
      ],
      products: [
        { id: 1, name: 'Konsultasi Dokter Umum', desc: 'Pemeriksaan kesehatan menyeluruh oleh dokter umum.', price: 'Mulai Rp 100.000', category: 'Layanan Utama' },
        { id: 2, name: 'Pemeriksaan Lab Dasar', desc: 'Cek gula darah, kolesterol, dan asam urat.', price: 'Rp 150.000', category: 'Laboratorium' },
        { id: 3, name: 'Medical Check-Up', desc: 'Paket pemeriksaan kesehatan lengkap tahunan.', price: 'Rp 750.000', category: 'Paket' },
      ],
      reviews: [
        { authorName: 'Budi Santoso', rating: 5, text: 'Dokternya ramah dan penjelasannya sangat detail. Fasilitas klinik bersih.', time: '2 hari lalu' },
        { authorName: 'Linda W', rating: 5, text: 'Proses pendaftaran cepat, tidak perlu antri lama. Harga pengobatan juga masuk akal.', time: '1 bulan lalu' },
      ]
    };
  }

  if (normalizedCat === 'salon' || normalizedCat === 'barbershop') {
    return {
      tagline: 'Tampil lebih percaya diri dengan potongan rambut dan perawatan terbaik dari ahlinya.',
      hours: 'Setiap Hari: 10:00 - 21:00',
      heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
      features: [
        { id: 1, title: 'Stylist Berpengalaman', description: 'Gaya potongan terkini oleh kapster profesional.', icon: '✂️' },
        { id: 2, title: 'Produk Premium', description: 'Menggunakan pomade, hair tonic, dan produk rambut berkualitas.', icon: '🧴' },
        { id: 3, title: 'Suasana Nyaman', description: 'Ruangan full AC dengan kursi pijat santai.', icon: '🛋️' },
      ],
      products: [
        { id: 1, name: 'Premium Haircut', desc: 'Potong rambut, cuci, pijat ringan, dan styling.', price: 'Rp 60.000', category: 'Haircut' },
        { id: 2, name: 'Hair Coloring', desc: 'Pewarnaan rambut dengan produk bebas amonia.', price: 'Rp 250.000', category: 'Treatment' },
        { id: 3, name: 'Shaving & Trim', desc: 'Cukur kumis dan jenggot dengan handuk hangat.', price: 'Rp 35.000', category: 'Grooming' },
      ],
      reviews: [
        { authorName: 'Dimas Arya', rating: 5, text: 'Langganan sejak buka. Hasil potongan rapi, mantap!', time: '1 hari lalu' },
        { authorName: 'Andi M', rating: 4, text: 'Tempatnya bersih, tapi kalau weekend antri panjang.', time: '2 minggu lalu' },
      ]
    };
  }

  // Default fallback (Generic Business)
  return {
    tagline: 'Melayani Anda dengan sepenuh hati melalui produk dan layanan terbaik kami.',
    hours: 'Senin - Jumat: 09:00 - 17:00',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    features: [
      { id: 1, title: 'Kualitas Terjamin', description: 'Kami mengutamakan kualitas dalam setiap layanan kami.', icon: '⭐' },
      { id: 2, title: 'Pelayanan Cepat', description: 'Respon cepat dan tepat untuk kepuasan pelanggan.', icon: '⚡' },
    ],
    products: [
      { id: 1, name: 'Layanan / Produk 1', desc: 'Deskripsi produk utama.', price: 'Hubungi Kami', category: 'Layanan Utama' },
      { id: 2, name: 'Layanan / Produk 2', desc: 'Deskripsi produk pendukung.', price: 'Hubungi Kami', category: 'Layanan Pendukung' },
    ],
    reviews: [
      { authorName: 'Pelanggan Setia', rating: 5, text: 'Layanan yang sangat memuaskan, sangat direkomendasikan!', time: 'Baru saja' },
    ]
  };
}
