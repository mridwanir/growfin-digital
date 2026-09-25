export interface MockData {
  tagline: string;
  hours: string;
  features: { id: number; title: string; description: string; icon: string }[];
  products: { id: number; name: string; desc: string; price: string; category: string; imageUrl?: string; tag?: string; variants?: { name: string; options: string[] }[]; addons?: { name: string; price: number }[]; duration?: number; }[];
  reviews: { authorName: string; rating: number; text: string; time: string }[];
  heroImage: string;
  fbType?: 'DINE_IN' | 'QUICK_SERVICE' | 'PRE_ORDER';
  openTime?: string;
  closeTime?: string;
  instagramFeed?: string[];
  themeColor?: string;
  categories?: string[];
  practitioners?: any[];
  lookbook?: any[];
}

export function getMockData(category: string): MockData {
  const normalizedCat = category.toLowerCase();

  if (normalizedCat === 'cafe' || normalizedCat === 'coffee shop') {
    return {
      tagline: 'Tempat nyaman untuk menikmati kopi spesialti dan momen berharga bersama teman.',
      hours: 'Setiap Hari: 08:00 - 22:00',
      heroImage: '/image/cafe/mitch-Da1F2k3BFeU-unsplash.jpg',
      features: [
        { id: 1, title: 'Biji Kopi Pilihan', description: 'Kopi 100% Arabica dari petani lokal terbaik.', icon: '☕' },
        { id: 2, title: 'Free WiFi Ngebut', description: 'Cocok untuk WFC (Work From Cafe) seharian.', icon: '📶' },
        { id: 3, title: 'Pastry Fresh Oven', description: 'Aneka roti dan kue yang dipanggang segar setiap hari.', icon: '🥐' },
      ],
      products: [
        { 
          id: 1, name: 'Es Kopi Susu Aren', desc: 'Signature espresso dengan gula aren asli dan susu krimi.', price: 'Rp 25.000', category: 'Signature', imageUrl: '/image/cafe/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
          variants: [{ name: 'Ukuran', options: ['Regular', 'Large (+Rp 5.000)'] }, { name: 'Jenis Susu', options: ['Susu Sapi (Full Cream)', 'Oatmilk (+Rp 8.000)'] }]
        },
        { 
          id: 2, name: 'Caramel Macchiato', desc: 'Espresso dengan sirup caramel dan vanilla foam.', price: 'Rp 35.000', category: 'Espresso Based', imageUrl: '/image/cafe/haydn-golden-EVoICOUotkg-unsplash.jpg',
          variants: [{ name: 'Suhu', options: ['Hot', 'Ice'] }, { name: 'Ukuran', options: ['Regular', 'Large (+Rp 5.000)'] }]
        },
        { id: 3, name: 'Almond Butter Croissant', desc: 'Croissant renyah dengan isian almond butter premium.', price: 'Rp 30.000', category: 'Pastry', imageUrl: '/image/cafe/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg' },
        { 
          id: 4, name: 'Truffle French Fries', desc: 'Kentang goreng renyah dengan aroma truffle oil.', price: 'Rp 28.000', category: 'Snacks', imageUrl: '/image/cafe/chad-montano-MqT0asuoIcU-unsplash.jpg',
          addons: [{ name: 'Extra Cheese Sauce', price: 6000 }, { name: 'Extra Truffle Oil', price: 8000 }]
        },
      ],
      reviews: [
        { authorName: 'Reza Pahlevi', rating: 5, text: 'Tempatnya cozy banget buat nugas, kopinya juga pas rasanya!', time: '1 minggu lalu' },
        { authorName: 'Siti Aminah', rating: 4, text: 'Croissant-nya juara, flaky banget. Pelayanan juga ramah.', time: '3 minggu lalu' },
      ],
      fbType: 'DINE_IN',
      openTime: '08:00',
      closeTime: '22:00',
      instagramFeed: [
        '/image/cafe/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
        '/image/cafe/mahesa-tyo-X0HP9m0euz0-unsplash.jpg',
        '/image/cafe/queensland-australia-7WVpQhFGUqQ-unsplash.jpg',
        '/image/cafe/mitch-Da1F2k3BFeU-unsplash.jpg'
      ],
      themeColor: '#8b5a2b' // Amber/Brown for Coffee Shop
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
        { id: 1, name: 'Konsultasi Dokter Umum', desc: 'Pemeriksaan kesehatan menyeluruh oleh dokter umum.', price: 'Mulai Rp 100.000', category: 'Layanan Utama', imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80' },
        { id: 2, name: 'Pemeriksaan Lab Dasar', desc: 'Cek gula darah, kolesterol, dan asam urat.', price: 'Rp 150.000', category: 'Laboratorium', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80' },
        { id: 3, name: 'Medical Check-Up', desc: 'Paket pemeriksaan kesehatan lengkap tahunan.', price: 'Rp 750.000', category: 'Paket', imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80' },
      ],
      reviews: [
        { authorName: 'Budi Santoso', rating: 5, text: 'Dokternya ramah dan penjelasannya sangat detail. Fasilitas klinik bersih.', time: '2 hari lalu' },
        { authorName: 'Linda W', rating: 5, text: 'Proses pendaftaran cepat, tidak perlu antri lama. Harga pengobatan juga masuk akal.', time: '1 bulan lalu' },
      ],
      practitioners: [
        { id: 'p1', name: 'dr. Andi Permana, Sp.PD', role: 'Dokter Spesialis Penyakit Dalam', licenseNumber: 'SIP: 445/123/SIP/2022', schedule: 'Senin - Rabu (16.00 - 20.00)' },
        { id: 'p2', name: 'drg. Sarah Wijaya', role: 'Dokter Gigi Umum', licenseNumber: 'SIP: 445/456/SIP/2021', schedule: 'Setiap Hari (09.00 - 15.00)' },
      ],
      themeColor: '#2563eb' // Blue for Clinic
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
        { id: 1, name: 'Premium Haircut', desc: 'Potong rambut, cuci, pijat ringan, dan styling.', price: 'Rp 60.000', category: 'Haircut', imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80', duration: 45 },
        { id: 2, name: 'Hair Coloring', desc: 'Pewarnaan rambut dengan produk bebas amonia.', price: 'Rp 250.000', category: 'Treatment', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80', duration: 90 },
        { id: 3, name: 'Shaving & Trim', desc: 'Cukur kumis dan jenggot dengan handuk hangat.', price: 'Rp 35.000', category: 'Grooming', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80', duration: 30 },
      ],
      reviews: [
        { authorName: 'Dimas Arya', rating: 5, text: 'Langganan sejak buka. Hasil potongan rapi, mantap!', time: '1 hari lalu' },
        { authorName: 'Andi M', rating: 4, text: 'Tempatnya bersih, tapi kalau weekend antri panjang.', time: '2 minggu lalu' },
      ],
      practitioners: [
        { id: 't1', name: 'Bimo', role: 'Top Barber' },
        { id: 't2', name: 'Dian', role: 'Colorist Specialist' }
      ],
      lookbook: [
        { id: 'l1', name: 'French Crop Fade', imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80', desc: 'Gaya rambut pendek rapi dengan fade gradasi halus di sisi.' },
        { id: 'l2', name: 'Classic Pompadour', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80', desc: 'Rambut bervolume di bagian atas, cocok untuk acara formal.' },
        { id: 'l3', name: 'Ash Grey Color', imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&q=80', desc: 'Warna abu-abu elegan dengan teknik bleaching yang aman.' }
      ],
      themeColor: '#0f172a' // Slate/Dark for Barbershop
    };
  }

  if (normalizedCat.includes('roti') || normalizedCat.includes('kue') || normalizedCat.includes('bakery')) {
    return {
      tagline: 'Roti hangat dan kue lezat yang dipanggang segar setiap hari untuk menyempurnakan momen Anda.',
      hours: 'Setiap Hari: 07:00 - 21:00',
      heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
      features: [
        { id: 1, title: 'Fresh from Oven', description: 'Dipanggang setiap pagi hari.', icon: '🍞' },
        { id: 2, title: 'Bahan Premium', description: 'Menggunakan mentega asli dan tanpa pengawet.', icon: '🧈' },
      ],
      products: [
        { id: 1, name: 'Sourdough Artisan Bread', desc: 'Roti klasik eropa dengan pinggiran renyah dan tekstur kenyal di dalam.', price: 'Rp 45.000', category: 'Artisan Bread', imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bfcbc?w=400&q=80', tag: 'Bestseller' },
        { id: 2, name: 'Strawberry Shortcake', desc: 'Sponge cake vanilla lembut dengan krim segar dan potongan stroberi asli.', price: 'Rp 35.000', category: 'Cake & Pastry', imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80' },
        { id: 3, name: 'Butter Croissant', desc: 'Croissant renyah berlapis dengan aroma mentega premium yang menggoda.', price: 'Rp 22.000', category: 'Cake & Pastry', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88f4?w=400&q=80' },
        { id: 4, name: 'Chocolate Fudge Brownie', desc: 'Brownie padat nan legit dengan lelehan cokelat Belgia murni.', price: 'Rp 28.000', category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', tag: 'New' },
      ],
      reviews: [
        { authorName: 'Andina Putri', rating: 5, text: 'Rotinya lembut banget dan wanginya semerbak! Selalu langganan beli croissant di sini.', time: '1 hari lalu' },
      ],
      fbType: 'PRE_ORDER',
      openTime: '07:00',
      closeTime: '21:00',
      instagramFeed: [
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
        'https://images.unsplash.com/photo-1621236378699-8597faa6aa1b?w=400&q=80',
        'https://images.unsplash.com/photo-1557008075-7f2c5efa4cb4?w=400&q=80'
      ],
      themeColor: '#f43f5e' // Rose/Pink for Bakery
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
      { 
        id: 1, name: 'Premium Leather Wallet', desc: 'Dompet kulit asli dengan desain minimalis elegan.', price: 'Rp 250.000', category: 'Aksesoris', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80', tag: 'Bestseller',
        variants: [{ name: 'Warna', options: ['Hitam', 'Cokelat Tua', 'Tan'] }]
      },
      { 
        id: 2, name: 'Signature Denim Jacket', desc: 'Jaket denim berkualitas tinggi dengan potongan reguler fit.', price: 'Rp 450.000', category: 'Pakaian', imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80',
        variants: [{ name: 'Ukuran', options: ['S', 'M', 'L', 'XL'] }]
      },
      { 
        id: 3, name: 'Minimalist Wristwatch', desc: 'Jam tangan analog dengan strap kulit sintetis dan desain klasik.', price: 'Rp 350.000', category: 'Aksesoris', imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80', tag: 'New',
        addons: [{ name: 'Box Kado Premium', price: 25000 }]
      },
      { id: 4, name: 'Classic White Sneakers', desc: 'Sepatu kets putih serbaguna untuk gaya kasual sehari-hari.', price: 'Rp 550.000', category: 'Sepatu', imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80' },
    ],
    categories: ['Semua', 'Aksesoris', 'Pakaian', 'Sepatu'],
    reviews: [
      { authorName: 'Pelanggan Setia', rating: 5, text: 'Layanan yang sangat memuaskan, sangat direkomendasikan!', time: 'Baru saja' },
    ],
    themeColor: '#6366f1' // Indigo for generic
  };
}
