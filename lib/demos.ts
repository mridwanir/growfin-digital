export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: string;
  tag?: string;
  category?: string;
  imageUrl?: string;
}

export interface DoctorInfo {
  name: string;
  role: string;
  avatarEmoji?: string;
  avatarUrl?: string;
  sampleChat?: {
    user: string;
    doctor: string;
    recommendationTitle: string;
    recommendationDesc: string;
  };
}

export interface BusinessDemo {
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  phone: string;
  address: string;
  googleMapsUrl: string;
  hours: string;
  waNumber: string; // format internasional tanpa tanda +, contoh: 628123456789
  tagline: string;
  iconEmoji: string;
  doctor: DoctorInfo;
  categories: string[];
  menu: MenuItem[];
}

export const DEMO_DATA: Record<string, BusinessDemo> = {
  "arde-dental-clinic-rata-partner": {
    "name": "ARDE Dental Clinic - RATA Partner",
    "category": "Klinik Gigi",
    "city": "Ciomas Bogor",
    "rating": 4.9,
    "reviewCount": 122,
    "phone": "+62 811-1109-944",
    "address": "Jl. Salak No.6, RT.05/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=6227114840070281124&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628111109944",
    "tagline": "Senyum sehat dan percaya diri dengan perawatan gigi terbaik.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Drg. Sarah Wijaya",
      "role": "Dokter Gigi Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Gigi saya terasa ngilu akhir-akhir ini, terutama saat minum dingin. Apa yang harus saya lakukan?",
        "doctor": "Berdasarkan gejala yang Anda alami, kemungkinan besar ada sensitivitas gigi atau karies awal. Saya sarankan Anda untuk segera melakukan pemeriksaan agar kami bisa mengetahui penyebab pastinya dan memberikan penanganan yang tepat.",
        "recommendationTitle": "Pemeriksaan Gigi dan Konsultasi",
        "recommendationDesc": "Pemeriksaan menyeluruh untuk mendiagnosis penyebab ngilu dan sensitivitas, dilanjutkan dengan rencana perawatan yang dipersonalisasi."
      }
    },
    "categories": [
      "Klinik Gigi",
      "Dokter Gigi",
      "Perawatan Gigi",
      "Tambal Gigi",
      "Pembersihan Karang Gigi",
      "Orthodontics"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pembersihan Karang Gigi",
        "desc": "Prosedur membersihkan karang dan plak dari permukaan gigi untuk menjaga kesehatan gusi.",
        "price": "Rp 250.000",
        "tag": "Populer",
        "category": "Perawatan Preventif"
      },
      {
        "id": 2,
        "name": "Tambal Gigi Komposit",
        "desc": "Penambalan gigi berlubang menggunakan bahan komposit sewarna gigi untuk estetika optimal.",
        "price": "Mulai dari Rp 350.000",
        "category": "Restorasi Gigi"
      },
      {
        "id": 3,
        "name": "Cabut Gigi",
        "desc": "Prosedur pencabutan gigi yang sudah rusak parah atau tidak dapat diselamatkan.",
        "price": "Mulai dari Rp 200.000",
        "category": "Bedah Minor"
      },
      {
        "id": 4,
        "name": "Whitening Gigi (Bleaching)",
        "desc": "Perawatan untuk mencerahkan warna gigi secara signifikan dan aman.",
        "price": "Mulai dari Rp 2.000.000",
        "tag": "Estetika",
        "category": "Estetika Gigi"
      }
    ]
  },


  "dr-erlin-spa-dokter-anak-rskia-sawojajar": {
    "name": "dr. Erlin, SpA (Dokter anak RSKIA Sawojajar)",
    "category": "Klinik Anak",
    "city": "Ciomas Bogor",
    "rating": 5.0,
    "reviewCount": 127,
    "phone": "+62 877-7832-4371",
    "address": "Jl. Sawojajar No.9, RT.01/RW.04, Pabaton, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16121, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=6458399768149915422&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6287778324371",
    "tagline": "Klinik Spesialis Anak Terbaik untuk Kesehatan Buah Hati Anda",
    "iconEmoji": "👶",
    "doctor": {
      "name": "dr. Erlin, Sp.A",
      "role": "Dokter Spesialis Anak",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo dokter, anak saya demam tinggi dan batuk sudah 3 hari, apakah perlu segera diperiksa?",
        "doctor": "Selamat pagi. Untuk demam tinggi dan batuk 3 hari pada anak, sebaiknya segera diperiksakan untuk mengetahui penyebabnya dan mendapatkan penanganan yang tepat. Mohon datang ke klinik untuk pemeriksaan lebih lanjut.",
        "recommendationTitle": "Pemeriksaan dan Penanganan Cepat",
        "recommendationDesc": "Segera periksakan anak Anda ke dokter untuk diagnosis dan penanganan demam serta batuk yang tepat, terutama jika demam tinggi sudah berlangsung beberapa hari."
      }
    },
    "categories": [
      "Klinik Anak",
      "Dokter Spesialis",
      "Kesehatan Anak"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Anak",
        "desc": "Pemeriksaan umum dan konsultasi kesehatan anak dengan dokter spesialis anak.",
        "price": "Rp 150.000",
        "category": "Pelayanan Utama"
      },
      {
        "id": 2,
        "name": "Vaksinasi Anak Lengkap",
        "desc": "Layanan vaksinasi dasar dan lanjutan sesuai jadwal imunisasi anak.",
        "price": "Mulai Rp 200.000",
        "tag": "Terlaris",
        "category": "Vaksinasi"
      },
      {
        "id": 3,
        "name": "Nebulizer untuk Anak",
        "desc": "Terapi uap untuk mengatasi gangguan pernapasan seperti asma dan batuk berdahak.",
        "price": "Rp 75.000",
        "category": "Terapi"
      },
      {
        "id": 4,
        "name": "Cek Tumbuh Kembang Anak",
        "desc": "Evaluasi rutin tumbuh kembang anak dari usia bayi hingga remaja.",
        "price": "Rp 120.000",
        "category": "Pelayanan Utama"
      }
    ]
  },


  "pratama-prima-clinic-24-hours": {
    "name": "Pratama Prima Clinic (24 hours)",
    "category": "Klinik Umum",
    "city": "Ciomas Bogor",
    "rating": 4.6,
    "reviewCount": 49,
    "phone": "+62 812-1401-5849",
    "address": "Jl. Pahlawan No.112, RT.01/RW.18, Bondongan, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=2144623239690196615&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Buka 24 jam",
    "waNumber": "6281214015849",
    "tagline": "Kesehatan Anda Prioritas Kami, Siap Melayani 24 Jam Non-stop",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dr. Amelia Wijaya",
      "role": "Dokter Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://example.com/amelia-wijaya-avatar.png",
      "sampleChat": {
        "user": "Saya merasa demam dan batuk sejak kemarin malam, apakah saya perlu datang ke klinik?",
        "doctor": "Tentu, dengan gejala demam dan batuk, sebaiknya Anda segera diperiksa. Kami buka 24 jam, jadi Anda bisa datang kapan saja.",
        "recommendationTitle": "Segera Kunjungi Klinik untuk Pemeriksaan",
        "recommendationDesc": "Gejala demam dan batuk memerlukan evaluasi medis untuk memastikan diagnosis dan penanganan yang tepat. Klinik Pratama Prima siap melayani Anda kapan saja untuk penanganan cepat."
      }
    },
    "categories": [
      "Klinik 24 Jam",
      "Klinik Umum",
      "Pelayanan Kesehatan",
      "Dokter Umum"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan dan saran medis umum untuk berbagai keluhan kesehatan.",
        "price": "Mulai dari Rp 75.000",
        "category": "Pelayanan Dasar"
      },
      {
        "id": 2,
        "name": "Penanganan Gawat Darurat Ringan",
        "desc": "Penanganan awal untuk kasus darurat non-kritis seperti luka kecil, demam tinggi, atau reaksi alergi ringan.",
        "price": "Sesuai Tindakan",
        "tag": "24 Jam",
        "category": "Gawat Darurat"
      },
      {
        "id": 3,
        "name": "Pemberian Injeksi/Obat",
        "desc": "Layanan pemberian injeksi atau obat-obatan sesuai dengan resep dan anjuran dokter.",
        "price": "Mulai dari Rp 50.000",
        "category": "Tindakan Medis"
      },
      {
        "id": 4,
        "name": "Pemeriksaan Gula Darah & Tekanan Darah",
        "desc": "Pemeriksaan cepat untuk mengukur kadar gula darah dan tekanan darah.",
        "price": "Mulai dari Rp 30.000",
        "category": "Pemeriksaan Penunjang"
      },
      {
        "id": 5,
        "name": "Perawatan Luka",
        "desc": "Pembersihan dan perawatan luka ringan hingga sedang.",
        "price": "Mulai dari Rp 60.000",
        "category": "Tindakan Medis"
      }
    ]
  },


  "griya-assunnah-bogormetode-biomekanik-terapi-anak-berkebutuhankhusus-syarafkejepitlambung-gerd-bekam-ikhwan-akhwat": {
    "name": "Griya ASSUNNAH BOGOR(metode Biomekanik, terapi anak Berkebutuhankhusus,, syarafkejepit.lambung gerd ).bekam ikhwan akhwat",
    "category": "Klinik Terapi & Bekam",
    "city": "Ciomas Bogor",
    "rating": 5.0,
    "reviewCount": 28,
    "phone": "",
    "address": "Jl. Danau Matana Gg. Tegal Mangga No.33, RT.02/RW.03, Tegallega, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16129, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=3227171454528650565&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281234567890",
    "tagline": "Pusat Terapi Biomekanik, Anak Berkebutuhan Khusus, Syaraf Kejepit, Lambung Gerd, dan Bekam Profesional",
    "iconEmoji": "🩺",
    "doctor": {
      "name": "Dr. Adam",
      "role": "Terapis Biomekanik & Akupunturis",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya mengalami sakit pinggang dan syaraf kejepit, apakah bisa dibantu di sini?",
        "doctor": "Tentu, kami memiliki metode Biomekanik dan terapi khusus untuk syaraf kejepit. Kami akan melakukan evaluasi menyeluruh untuk menentukan penanganan terbaik.",
        "recommendationTitle": "Terapi Syaraf Kejepit",
        "recommendationDesc": "Penanganan komprehensif untuk meredakan nyeri dan memulihkan fungsi syaraf kejepit dengan metode biomekanik dan terapi fisik."
      }
    },
    "categories": [
      "Terapi Biomekanik",
      "Terapi Anak Berkebutuhan Khusus",
      "Terapi Syaraf Kejepit",
      "Bekam",
      "Terapi Lambung Gerd"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Terapi Biomekanik",
        "desc": "Terapi khusus untuk mengatasi masalah gerak dan postur tubuh.",
        "price": "Mulai dari Rp 150.000",
        "category": "Terapi"
      },
      {
        "id": 2,
        "name": "Terapi Anak Berkebutuhan Khusus",
        "desc": "Program terapi individual untuk anak-anak dengan kebutuhan khusus.",
        "price": "Mulai dari Rp 200.000",
        "category": "Terapi Anak"
      },
      {
        "id": 3,
        "name": "Terapi Syaraf Kejepit",
        "desc": "Penanganan efektif untuk meredakan nyeri dan memulihkan syaraf kejepit.",
        "price": "Mulai dari Rp 180.000",
        "category": "Terapi"
      },
      {
        "id": 4,
        "name": "Terapi Lambung Gerd",
        "desc": "Terapi alami untuk membantu mengatasi masalah lambung dan GERD.",
        "price": "Mulai dari Rp 150.000",
        "category": "Terapi"
      },
      {
        "id": 5,
        "name": "Bekam Ikhwan",
        "desc": "Layanan bekam higienis khusus untuk pria.",
        "price": "Mulai dari Rp 100.000",
        "category": "Bekam"
      },
      {
        "id": 6,
        "name": "Bekam Akhwat",
        "desc": "Layanan bekam higienis khusus untuk wanita.",
        "price": "Mulai dari Rp 100.000",
        "category": "Bekam"
      }
    ]
  },


  "rumah-keisya": {
    "name": "RUMAH KEISYA",
    "category": "Klinik Umum",
    "city": "Bogor",
    "rating": 4.5,
    "reviewCount": 561,
    "phone": "",
    "address": "9QXJ+GP5, RT.04/RW.04, Pasirkuda, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16119, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=8425839679768306770&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281234567890",
    "tagline": "Klinik kesehatan terpercaya di Bogor untuk keluarga Anda.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dr. Dian Paramitha",
      "role": "Dokter Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dokter, saya merasa demam dan batuk sudah 3 hari, apakah ini flu biasa?",
        "doctor": "Berdasarkan gejala yang Anda sebutkan, kemungkinan besar ini adalah flu biasa. Namun, saya sarankan untuk datang langsung agar bisa dilakukan pemeriksaan lebih lanjut untuk memastikan kondisi Anda.",
        "recommendationTitle": "Saran dari Dokter",
        "recommendationDesc": "Untuk meredakan demam dan batuk, Anda bisa mengonsumsi paracetamol dan banyak istirahat. Hindari kontak dekat dengan orang lain dan gunakan masker. Jika gejala tidak membaik dalam 5 hari atau memburuk, segera periksa ke klinik."
      }
    },
    "categories": [
      "Klinik Umum",
      "Pelayanan Kesehatan",
      "Pemeriksaan Medis",
      "Imunisasi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan Umum",
        "desc": "Konsultasi dan pemeriksaan fisik oleh dokter umum.",
        "price": "Rp 50.000",
        "category": "Layanan Medis"
      },
      {
        "id": 2,
        "name": "Konsultasi Dokter",
        "desc": "Sesi konsultasi mendalam mengenai keluhan kesehatan.",
        "price": "Rp 75.000",
        "category": "Layanan Medis"
      },
      {
        "id": 3,
        "name": "Vaksinasi Dewasa",
        "desc": "Layanan vaksinasi untuk orang dewasa.",
        "price": "Mulai Rp 150.000",
        "tag": "Tersedia",
        "category": "Layanan Medis"
      },
      {
        "id": 4,
        "name": "Perawatan Luka",
        "desc": "Perawatan dan pembersihan luka ringan hingga sedang.",
        "price": "Mulai Rp 60.000",
        "category": "Layanan Medis"
      }
    ]
  },


  "okky-orthodontics-dokter-gigi-spesialis-ortodontikawat-gigi": {
    "name": "Okky Orthodontics",
    "category": "Klinik Gigi Spesialis Ortodonti",
    "city": "Kota Bogor",
    "rating": 5.0,
    "reviewCount": 143,
    "phone": "+62 813-2726-6161",
    "address": "Jl. Cimanggu Barata No.72, RT.07/RW.09, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=6795704172132673996&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281327266161",
    "tagline": "Klinik gigi spesialis ortodonti terkemuka untuk senyum sempurna Anda.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Dr. Okky",
      "role": "Spesialis Ortodonti",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, gigi saya berantakan dan ingin pakai kawat gigi, apakah bisa?",
        "doctor": "Tentu, kami dapat membantu. Untuk kasus gigi berantakan, pemasangan kawat gigi adalah solusi yang efektif. Saya sarankan Anda datang untuk konsultasi awal agar bisa dilakukan pemeriksaan menyeluruh dan menentukan rencana perawatan terbaik.",
        "recommendationTitle": "Rekomendasi Perawatan Ortodonti",
        "recommendationDesc": "Berdasarkan keluhan Anda tentang gigi berantakan, Dr. Okky Orthodontics merekomendasikan konsultasi awal untuk pemeriksaan dan penentuan jenis kawat gigi yang paling sesuai dengan kondisi Anda. Berbagai pilihan tersedia, mulai dari kawat gigi metal konvensional hingga aligner transparan."
      }
    },
    "categories": [
      "Ortodonti",
      "Kawat Gigi",
      "Klinik Gigi",
      "Dokter Gigi Spesialis"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Ortodonti",
        "desc": "Pemeriksaan awal dan diagnosa untuk menentukan rencana perawatan ortodonti yang tepat.",
        "price": "Mulai dari Rp 150.000",
        "category": "Layanan Utama"
      },
      {
        "id": 2,
        "name": "Pemasangan Kawat Gigi Metal",
        "desc": "Pemasangan behel metal konvensional untuk merapikan gigi.",
        "price": "Mulai dari Rp 6.000.000",
        "tag": "Populer",
        "category": "Perawatan Kawat Gigi"
      },
      {
        "id": 3,
        "name": "Pemasangan Kawat Gigi Keramik",
        "desc": "Pemasangan behel keramik estetis, warna menyerupai gigi.",
        "price": "Mulai dari Rp 8.000.000",
        "tag": "Estetis",
        "category": "Perawatan Kawat Gigi"
      },
      {
        "id": 4,
        "name": "Pemasangan Kawat Gigi Self-Ligating",
        "desc": "Behel dengan mekanisme 'self-ligating' untuk perawatan lebih cepat dan nyaman.",
        "price": "Mulai dari Rp 10.000.000",
        "category": "Perawatan Kawat Gigi"
      },
      {
        "id": 5,
        "name": "Perawatan Aligner Transparan (Invisalign)",
        "desc": "Perawatan merapikan gigi menggunakan aligner bening yang nyaman dan tidak terlihat.",
        "price": "Mulai dari Rp 25.000.000",
        "tag": "Premium",
        "category": "Perawatan Kawat Gigi"
      },
      {
        "id": 6,
        "name": "Retainer",
        "desc": "Alat penahan gigi pasca perawatan ortodonti agar gigi tetap rapi.",
        "price": "Mulai dari Rp 1.500.000",
        "category": "Layanan Tambahan"
      },
      {
        "id": 7,
        "name": "Kontrol Ortodonti",
        "desc": "Pemeriksaan rutin dan penyesuaian kawat gigi selama masa perawatan.",
        "price": "Mulai dari Rp 200.000",
        "category": "Layanan Utama"
      }
    ]
  },


  "praktek-dokter-spesialis-kulit-dan-kelamin-dr-melly-maya-sari-spkk": {
    "name": "Praktek Dokter Spesialis Kulit dan Kelamin Dr. Melly Maya Sari Sp.KK",
    "category": "Klinik Spesialis Kulit dan Kelamin",
    "city": "Ciomas Bogor",
    "rating": 4.8,
    "reviewCount": 132,
    "phone": "+62 878-8032-0040",
    "address": "Jl. Raya Semplak No.142, RT.01/RW.09, Cilendek Bar., Kec. Bogor Bar., Kota Bogor, Jawa Barat 16112, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=13230559544715480734&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6287880320040",
    "tagline": "Pakar Kulit dan Kelamin Terpercaya untuk Anda",
    "iconEmoji": "🌸",
    "doctor": {
      "name": "Dr. Melly Maya Sari Sp.KK",
      "role": "Dokter Spesialis Kulit dan Kelamin",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, kulit saya kusam dan sering berjerawat. Apa yang harus saya lakukan?",
        "doctor": "Halo! Berdasarkan keluhan Anda, kemungkinan ini disebabkan oleh beberapa faktor. Saya sarankan Anda datang untuk konsultasi langsung agar saya bisa melakukan pemeriksaan lebih lanjut dan memberikan penanganan yang tepat, seperti rekomendasi skincare atau tindakan medis.",
        "recommendationTitle": "Perawatan Kulit Kusam dan Berjerawat",
        "recommendationDesc": "Kami merekomendasikan pemeriksaan kulit secara menyeluruh untuk menentukan penyebab pasti kulit kusam dan jerawat. Berdasarkan hasil pemeriksaan, kami dapat meresepkan produk perawatan kulit yang sesuai, terapi topikal, atau prosedur lain seperti peeling atau laser untuk hasil optimal. Penting juga untuk menjaga kebersihan kulit dan pola makan sehat."
      }
    },
    "categories": [
      "Klinik Kulit",
      "Spesialis Kulit dan Kelamin",
      "Dermatologi",
      "Kesehatan Kulit",
      "Kecantikan Kulit"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Spesialis Kulit",
        "desc": "Pemeriksaan dan saran medis oleh Dr. Melly Maya Sari Sp.KK untuk berbagai masalah kulit dan kelamin.",
        "price": "Rp 250.000",
        "category": "Konsultasi"
      },
      {
        "id": 2,
        "name": "Facial Acne Treatment",
        "desc": "Perawatan wajah khusus untuk mengurangi jerawat aktif, komedo, dan membantu mencegah timbulnya jerawat baru.",
        "price": "Rp 350.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Chemical Peeling",
        "desc": "Prosedur pengelupasan kulit menggunakan larutan kimia untuk mengangkat sel kulit mati, mencerahkan, dan meremajakan kulit.",
        "price": "Mulai dari Rp 500.000",
        "category": "Tindakan Medis"
      },
      {
        "id": 4,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan menggunakan teknologi laser untuk mengatasi masalah pigmentasi, kerutan halus, bekas jerawat, dan memperbaiki tekstur kulit.",
        "price": "Sesuai Tindakan",
        "category": "Tindakan Medis"
      },
      {
        "id": 5,
        "name": "Mikrodermabrasi",
        "desc": "Prosedur eksfoliasi non-invasif untuk mengangkat sel kulit mati, merangsang produksi kolagen, dan menjadikan kulit lebih halus.",
        "price": "Rp 400.000",
        "category": "Perawatan Wajah"
      }
    ]
  },


  "dr-adisetya-w-spthtbkl-dokter-spesialis-telinga-hidung-tenggorok": {
    "name": "Dr. Adisetya W Sp.THT-BKL (Dokter Spesialis Telinga Hidung & Tenggorok)",
    "category": "Dokter Spesialis THT",
    "city": "Ciomas Bogor",
    "rating": 4.9,
    "reviewCount": 171,
    "phone": "+62 852-8250-1970",
    "address": "Jl. DR. Sumeru No.84, RT.01/RW.03, Menteng, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16111, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=10054019494049353279&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285282501970",
    "tagline": "Pakar THT terkemuka di Bogor untuk kesehatan telinga, hidung, dan tenggorok Anda.",
    "iconEmoji": "👂👃🗣️",
    "doctor": {
      "name": "Dr. Adisetya W",
      "role": "Dokter Spesialis THT-BKL",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, saya sering merasa telinga berdenging dan kadang pusing. Kira-kira kenapa ya?",
        "doctor": "Berdasarkan gejala yang Anda alami, telinga berdenging atau tinnitus bisa disebabkan oleh beberapa faktor seperti paparan suara keras, infeksi, atau masalah pada sistem pendengaran. Saya sarankan untuk melakukan pemeriksaan otoskopi dan audiometri agar bisa menegakkan diagnosis yang tepat.",
        "recommendationTitle": "Pemeriksaan Telinga & Pendengaran",
        "recommendationDesc": "Jadwalkan pemeriksaan otoskopi dan audiometri untuk mendiagnosis penyebab telinga berdenging dan pusing Anda."
      }
    },
    "categories": [
      "THT",
      "Otorhinolaryngology",
      "Klinik",
      "Dokter Spesialis",
      "Bogor"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Spesialis THT",
        "desc": "Pemeriksaan dan konsultasi menyeluruh mengenai masalah telinga, hidung, dan tenggorok.",
        "price": "Rp 250.000",
        "category": "Pemeriksaan & Konsultasi"
      },
      {
        "id": 2,
        "name": "Audiometri (Tes Pendengaran)",
        "desc": "Evaluasi fungsi pendengaran untuk mendeteksi gangguan atau penurunan pendengaran.",
        "price": "Rp 350.000",
        "tag": "Populer",
        "category": "Tes Diagnostik"
      },
      {
        "id": 3,
        "name": "Ekstraksi Serumen (Pembersihan Kotoran Telinga)",
        "desc": "Prosedur aman untuk membersihkan kotoran telinga yang menumpuk.",
        "price": "Rp 200.000",
        "category": "Tindakan Medis"
      },
      {
        "id": 4,
        "name": "Endoskopi THT",
        "desc": "Pemeriksaan visual dengan endoskop untuk melihat kondisi rongga hidung, sinus, dan tenggorokan secara detail.",
        "price": "Rp 400.000",
        "category": "Tes Diagnostik"
      },
      {
        "id": 5,
        "name": "Vakum Sinusitis",
        "desc": "Prosedur untuk membersihkan lendir dan peradangan pada sinus.",
        "price": "Rp 300.000",
        "category": "Tindakan Medis"
      }
    ]
  },


  "klinik-seruni-dokter-umum-dokter-gigi": {
    "name": "Klinik Seruni - Dokter Umum & Dokter Gigi",
    "category": "Klinik Kesehatan",
    "city": "Bandung LWPJ",
    "rating": 4.8,
    "reviewCount": 1293,
    "phone": "+62 22 20560808",
    "address": "Jl. Muara Takus Raya No.S-1, Melong, Kec. Cimahi Sel., Kota Cimahi, Jawa Barat 40534, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=7017509166515816427&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "622220560808",
    "tagline": "Solusi Lengkap Kesehatan Anda dan Keluarga",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "dr. Budi Santoso",
      "role": "Dokter Umum",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya merasa demam dan batuk sejak kemarin.",
        "doctor": "Baik, mari kita periksa gejala Anda. Apakah ada nyeri tenggorokan atau sesak napas?",
        "recommendationTitle": "Diagnosis Awal: Infeksi Saluran Pernapasan Atas",
        "recommendationDesc": "Berdasarkan gejala Anda, kemungkinan Anda mengalami infeksi saluran pernapasan atas. Disarankan untuk istirahat cukup, minum air putih yang banyak, dan mengonsumsi obat penurun panas jika demam. Jika gejala memburuk, segera kunjungi klinik."
      }
    },
    "categories": [
      "Klinik Umum",
      "Dokter Gigi",
      "Kesehatan Keluarga",
      "Vaksinasi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan dan konsultasi untuk berbagai keluhan kesehatan umum.",
        "price": "Rp 75.000",
        "category": "Layanan Umum"
      },
      {
        "id": 2,
        "name": "Cabut Gigi",
        "desc": "Prosedur pencabutan gigi yang bermasalah dengan anestesi lokal.",
        "price": "Mulai Rp 150.000",
        "category": "Layanan Gigi"
      },
      {
        "id": 3,
        "name": "Pembersihan Karang Gigi (Scaling)",
        "desc": "Menghilangkan plak dan karang gigi untuk kesehatan mulut optimal.",
        "price": "Mulai Rp 200.000",
        "category": "Layanan Gigi"
      },
      {
        "id": 4,
        "name": "Vaksin Flu",
        "desc": "Imunisasi untuk mencegah infeksi virus influenza musiman.",
        "price": "Rp 180.000",
        "tag": "Populer",
        "category": "Vaksinasi"
      },
      {
        "id": 5,
        "name": "Injeksi Vitamin",
        "desc": "Pemberian vitamin melalui injeksi untuk meningkatkan daya tahan tubuh.",
        "price": "Rp 120.000",
        "category": "Layanan Umum"
      }
    ]
  },


  "vorta-beauty-clinic-bandung-(vorta-beauty-clinic-bandung)-klinik-kecantikan-di-bandung": {
    "name": "Vorta Beauty Clinic - Bandung (Vorta Beauty Clinic - Bandung) | Klinik Kecantikan di Bandung",
    "category": "Klinik Kecantikan",
    "city": "Bandung",
    "rating": 5,
    "reviewCount": 4028,
    "phone": "+62 811-8883-318",
    "address": "Jl. Sunda No.51, Kb. Pisang, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40112, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=4922439691917039727&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628118883318",
    "tagline": "Raih Kilau Kulit Impianmu, Pancarkan Pesona Alami dari Vorta Beauty Clinic.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "dr. Amelia Putri, Sp.KK",
      "role": "Dokter Spesialis Kulit & Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, wajah saya akhir-akhir ini sering berjerawat dan kusam, padahal sudah pakai berbagai skincare. Apa solusinya ya?",
        "doctor": "Halo! Jerawat dan kulit kusam memang sering jadi keluhan. Untuk penanganan yang tepat, perlu pemeriksaan langsung kondisi kulit Anda. Kami punya beberapa treatment yang efektif seperti Chemical Peeling atau Laser Acne. Saya sarankan Anda untuk reservasi konsultasi terlebih dahulu agar bisa kami berikan rekomendasi terbaik. Bagaimana, apakah Anda berkenan?",
        "recommendationTitle": "Paket Glowing & Acne Clear",
        "recommendationDesc": "Kombinasi perawatan facial, chemical peeling, dan serum khusus untuk mengatasi jerawat dan mencerahkan kulit."
      }
    },
    "categories": [
      "Semua",
      "Facial & Peeling",
      "Laser & Rejuvenation",
      "Injectable Treatment",
      "Body Contouring"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Glow & Hydra",
        "desc": "Perawatan wajah dasar untuk membersihkan pori-pori, melembapkan, dan mencerahkan kulit.",
        "price": "Rp 275.000",
        "tag": "Populer",
        "category": "Facial & Peeling"
      },
      {
        "id": 2,
        "name": "Chemical Peeling Acne Solution",
        "desc": "Pengelupasan kulit kimiawi untuk mengurangi jerawat, menyamarkan bekas luka, dan memperbaiki tekstur kulit.",
        "price": "Mulai Rp 550.000",
        "tag": "Best Seller",
        "category": "Facial & Peeling"
      },
      {
        "id": 3,
        "name": "Laser Rejuvenation Vorta Signature",
        "desc": "Teknologi laser untuk merangsang kolagen, mengurangi kerutan halus, dan mencerahkan warna kulit.",
        "price": "Mulai Rp 1.200.000",
        "tag": "Rekomendasi",
        "category": "Laser & Rejuvenation"
      },
      {
        "id": 4,
        "name": "Meso Glow Infusion",
        "desc": "Injeksi serum khusus yang mengandung vitamin dan antioksidan untuk menutrisi kulit dari dalam, memberikan efek glowing dan sehat.",
        "price": "Mulai Rp 800.000",
        "tag": "Terlaris",
        "category": "Injectable Treatment"
      }
    ]
  },


  "ratu-sehat": {
    "name": "Ratu Sehat",
    "category": "Klinik Estetika & Kecantikan",
    "city": "Bandung",
    "rating": 4.5,
    "reviewCount": 95,
    "phone": "+62 851-9879-6515",
    "address": "Jl. Moch. Ramdan No.23, Ciateul, Kec. Regol, Kota Bandung, Jawa Barat 40252, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=8016910836523586722&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285198796515",
    "tagline": "Pancarkan Pesonamu, Raih Kesehatan Optimal.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "dr. Karina Dewi, Sp.KK",
      "role": "Dokter Spesialis Kulit & Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, wajah saya sering kusam dan pori-pori besar, kira-kira perawatan apa yang cocok ya?",
        "doctor": "Selamat siang. Untuk kulit kusam dan pori-pori besar, ada beberapa pilihan perawatan yang efektif. Kami sarankan Anda datang untuk konsultasi langsung agar bisa kami periksa kondisi kulitnya secara detail dan merekomendasikan treatment terbaik. Apakah Anda ingin membuat janji temu?",
        "recommendationTitle": "Paket Brightening Glow",
        "recommendationDesc": "Perawatan untuk mencerahkan kulit kusam dan menyamarkan pori-pori."
      }
    },
    "categories": [
      "Semua",
      "Perawatan Wajah",
      "Perawatan Laser",
      "Injeksi Estetika"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Detoks & Brightening",
        "desc": "Perawatan wajah lengkap untuk membersihkan, detoksifikasi, dan mencerahkan kulit.",
        "price": "Rp 350.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Laser Rejuvenation",
        "desc": "Teknologi laser untuk mengurangi flek hitam, merangsang kolagen, dan meremajakan kulit.",
        "price": "Mulai Rp 850.000",
        "tag": "Best Seller",
        "category": "Perawatan Laser"
      },
      {
        "id": 3,
        "name": "Filler & Botox Treatment",
        "desc": "Injeksi filler untuk mengisi volume dan botox untuk mengurangi kerutan halus.",
        "price": "Mulai Rp 2.500.000",
        "category": "Injeksi Estetika"
      },
      {
        "id": 4,
        "name": "Chemical Peeling",
        "desc": "Prosedur eksfoliasi untuk mengangkat sel kulit mati dan memperbaiki tekstur kulit.",
        "price": "Rp 500.000",
        "category": "Perawatan Wajah"
      }
    ]
  },


  "casadienta-dental-clinic-wastukencana": {
    "name": "Casadienta Dental Clinic Wastukencana",
    "category": "Gigi (Dental)",
    "city": "Bandung",
    "rating": 4.9,
    "reviewCount": 1750,
    "phone": "+62 896-5226-1415",
    "address": "Jl. Wastukencana No.5, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=17220566870835770883&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6289652261415",
    "tagline": "Senyum Sehat Anda, Prioritas Kami. Rasakan Pengalaman Perawatan Gigi Terbaik.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "drg. Amelia Putri, Sp.Ort",
      "role": "Dokter Gigi Spesialis Ortodonsia",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, gigi depan saya agak maju dan berantakan, kira-kira bisa diperbaiki pakai apa ya?",
        "doctor": "Halo, tentu bisa Bu/Pak. Untuk kasus gigi yang maju dan berantakan, kami memiliki beberapa pilihan perawatan seperti kawat gigi atau aligner transparan. Agar hasilnya optimal dan sesuai dengan kondisi Anda, sangat disarankan untuk melakukan konsultasi dan pemeriksaan langsung dengan dokter spesialis ortodonsia kami. Bagaimana, apakah Anda berkenan untuk reservasi jadwal konsultasi?",
        "recommendationTitle": "Konsultasi & Pemeriksaan Ortodonsia",
        "recommendationDesc": "Evaluasi menyeluruh kondisi gigi dan rahang untuk menentukan perawatan kawat gigi atau aligner yang tepat."
      }
    },
    "categories": [
      "Semua",
      "Perawatan Umum",
      "Estetika Gigi",
      "Kawat Gigi",
      "Bedah Mulut"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pembersihan Karang Gigi (Scaling)",
        "desc": "Perawatan rutin untuk membersihkan plak dan karang gigi yang menumpuk, menjaga kesehatan gusi dan mencegah bau mulut.",
        "price": "Mulai Rp 250.000",
        "tag": "Populer",
        "category": "Perawatan Umum"
      },
      {
        "id": 2,
        "name": "Tambal Gigi Estetis (Composite)",
        "desc": "Perbaikan gigi berlubang atau rusak dengan bahan komposit sewarna gigi, mengembalikan fungsi dan estetika gigi secara alami.",
        "price": "Mulai Rp 450.000",
        "tag": "Best Seller",
        "category": "Perawatan Umum"
      },
      {
        "id": 3,
        "name": "Bleaching Gigi (Dental Whitening)",
        "desc": "Prosedur pencerahan warna gigi untuk mendapatkan senyum yang lebih cerah dan mempesona dalam satu kunjungan.",
        "price": "Mulai Rp 2.500.000",
        "tag": "Estetika",
        "category": "Estetika Gigi"
      },
      {
        "id": 4,
        "name": "Pemasangan Kawat Gigi Konvensional",
        "desc": "Perawatan untuk merapikan susunan gigi dan memperbaiki gigitan menggunakan kawat gigi metal atau keramik.",
        "price": "Mulai Rp 7.000.000",
        "category": "Kawat Gigi"
      }
    ]
  },


  "oriskin": {
    "name": "Oriskin",
    "category": "Klinik Estetika & Kulit",
    "city": "Bandung",
    "rating": 4.9,
    "reviewCount": 2801,
    "phone": "+62 851-7980-4242",
    "address": "Jl. Cihampelas No.42, Tamansari, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40116, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=801017474755135157&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285179804242",
    "tagline": "Oriskin: Merawat Kecantikan Alami, Membangkitkan Percaya Diri Sejati.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Sarah Wijaya, Sp.KK",
      "role": "Dokter Spesialis Kulit & Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, wajah saya sering berjerawat dan banyak bekas flek hitam. Kira-kira perawatan apa yang cocok ya?",
        "doctor": "Halo, senang Anda menghubungi Oriskin. Keluhan jerawat dan flek hitam memang sering terjadi. Untuk menentukan perawatan yang paling efektif, saya sarankan untuk melakukan konsultasi langsung agar bisa diperiksa kondisi kulit Anda secara mendalam. Setelah itu, kami bisa merekomendasikan solusi terbaik, mungkin dengan kombinasi chemical peeling atau laser untuk flek. Apakah Anda ingin menjadwalkan konsultasi?",
        "recommendationTitle": "Paket Glowing & Anti-Acne",
        "recommendationDesc": "Perawatan komprehensif untuk mengatasi jerawat aktif, flek hitam, dan mencerahkan kulit."
      }
    },
    "categories": [
      "Semua",
      "Perawatan Wajah",
      "Perawatan Tubuh",
      "Injeksi & Filler",
      "Laser Treatment"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Detox & Brightening",
        "desc": "Pembersihan mendalam untuk mengangkat komedo, sel kulit mati, dan mencerahkan wajah kusam.",
        "price": "Rp 350.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Laser Rejuvenation (Flek & Scar)",
        "desc": "Terapi laser canggih untuk mengurangi flek hitam, noda bekas jerawat, dan meremajakan kulit.",
        "price": "Mulai Rp 850.000",
        "tag": "Best Seller",
        "category": "Laser Treatment"
      },
      {
        "id": 3,
        "name": "Botox Anti-Kerut",
        "desc": "Injeksi Botox profesional untuk menyamarkan garis halus dan kerutan pada area wajah tertentu.",
        "price": "Mulai Rp 2.500.000",
        "category": "Injeksi & Filler"
      },
      {
        "id": 4,
        "name": "Microdermabrasi Diamond",
        "desc": "Eksfoliasi kulit menggunakan ujung berlian untuk mengangkat sel kulit mati, menghasilkan kulit lebih halus dan cerah.",
        "price": "Rp 600.000",
        "tag": "Rekomendasi",
        "category": "Perawatan Wajah"
      }
    ]
  },


  "pusat-akademik-inovasi-teknologi-dan-riset-kesehatan-universitas-padjadjaran-(pamitran-up)-medical-education-development-and-innovation-center-universitas-padjadjaran-(medic-up)": {
    "name": "Pusat Akademik, Inovasi, Teknologi, dan Riset Kesehatan Universitas Padjadjaran (PAMITRAN UP) Medical Education, Development, and Innovation Center Universitas Padjadjaran (MEDIC UP)",
    "category": "Medis Umum",
    "city": "Bandung",
    "rating": 4.6,
    "reviewCount": 95,
    "phone": "+62 821-1661-1339",
    "address": "Jl. Prof. Eyckman No.38, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=1039060403064657552&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6282116611339",
    "tagline": "Pusat Unggulan Inovasi dan Pelayanan Kesehatan Terintegrasi untuk Kesejahteraan Anda.",
    "iconEmoji": "🩺",
    "doctor": {
      "name": "Dr. Budi Santoso, Sp.PD-KEMD, FINASIM",
      "role": "Kepala Layanan Medis & Riset",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, saya sering merasa lemas, pusing, dan kadang mual. Kira-kira kenapa ya?",
        "doctor": "Selamat siang, Bapak/Ibu. Gejala yang Anda rasakan bisa disebabkan oleh beberapa faktor. Untuk penegakan diagnosis yang tepat, saya sarankan untuk datang langsung ke klinik agar bisa dilakukan pemeriksaan fisik dan mungkin beberapa tes penunjang. Silakan reservasi waktu kunjungan Anda.",
        "recommendationTitle": "Paket Pemeriksaan Kesehatan Komprehensif",
        "recommendationDesc": "Pemeriksaan menyeluruh untuk deteksi dini berbagai kondisi kesehatan dan konsultasi dengan dokter spesialis."
      }
    },
    "categories": [
      "Semua",
      "Pemeriksaan Umum",
      "Konsultasi Spesialis",
      "Vaksinasi",
      "Tes Laboratorium"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan Kesehatan Rutin (General Check-up)",
        "desc": "Pemeriksaan fisik dasar, tekanan darah, gula darah, dan kolesterol untuk memantau kesehatan Anda.",
        "price": "Rp 250.000",
        "tag": "Populer",
        "category": "Pemeriksaan Umum"
      },
      {
        "id": 2,
        "name": "Konsultasi Dokter Spesialis",
        "desc": "Konsultasi mendalam dengan Dokter Spesialis Penyakit Dalam untuk berbagai keluhan medis dan penanganan lanjut.",
        "price": "Mulai Rp 350.000",
        "tag": "Rekomendasi",
        "category": "Konsultasi Spesialis"
      },
      {
        "id": 3,
        "name": "Vaksinasi Influenza Tahunan",
        "desc": "Layanan vaksinasi untuk perlindungan optimal dari virus influenza musiman.",
        "price": "Rp 400.000",
        "category": "Vaksinasi"
      },
      {
        "id": 4,
        "name": "Paket Skrining Diabetes",
        "desc": "Pemeriksaan gula darah puasa, gula darah 2 jam post prandial, dan HbA1c untuk deteksi dini diabetes dan pemantauan.",
        "price": "Mulai Rp 750.000",
        "category": "Tes Laboratorium"
      }
    ]
  },


  // 1. KLINIK UTAMA DOKTER KITA (Rating 4.8 | 861 Ulasan)
  "klinik-utama-dokter-kita": {
    name: "Klinik Utama Dokter Kita",
    category: "Klinik Pratama & Layanan Dokter Keluarga",
    city: "Bandung",
    rating: 4.8,
    reviewCount: 861,
    phone: "+62 823-1555-9991",
    waNumber: "6282315559991",
    address: "Jl. Parakan Saat Ruko Melrose Residence No.3, Antapani Tengah, Kec. Antapani, Kota Bandung, Jawa Barat 40291",
    googleMapsUrl: "https://maps.google.com/?cid=13135322468534614009",
    hours: "Senin - Sabtu: 07:30 - 21:00",
    tagline: "Layanan Dokter Umum, Gigi & Laboratorium Ramah Keluarga",
    iconEmoji: "🩺",
    doctor: {
      name: "dr. Farhan Malik",
      role: "Dokter Penanggung Jawab Klinik",
      avatarEmoji: "👨‍⚕️",
      avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
      sampleChat: {
        user: "Dok, mau daftar pemeriksaan kesehatan dan cek lab darah lengkap bisa?",
        doctor: "Bisa langsung Kak! Kami jadwalkan di pagi hari saat puasa agar hasil lab akurat ya.",
        recommendationTitle: "Medical Check-Up Gold",
        recommendationDesc: "Pemeriksaan fisik dokter + cek kolesterol, gula darah, asam urat."
      }
    },
    categories: ["Semua", "Dokter Umum", "Poli Gigi", "Cek Lab"],
    menu: [
      { id: 1, name: "Konsultasi Dokter Umum & Resep Obat", desc: "Pemeriksaan keluhan medis dasar, tensi, dan peresepan.", price: "Rp 85.000", tag: "Lengkap", category: "Dokter Umum" },
      { id: 2, name: "Pembersihan Karang Gigi & Poles", desc: "Perawatan karang gigi di Poli Gigi Dokter Kita.", price: "Rp 200.000", category: "Poli Gigi" },
      { id: 3, name: "Paket Cek Darah Lengkap + Kolesterol", desc: "Pemeriksaan profil lipid, gula darah puasa, dan asam urat.", price: "Rp 175.000", tag: "Paling Laris", category: "Cek Lab" }
    ]
  },

  // 2. VORTA BEAUTY CLINIC BANDUNG (Rating 5.0 | 4018 Ulasan)
  "vorta-beauty-clinic---bandung-(vorta-beauty-clinic---bandung)-|-klinik-kecantikan-di-bandung": {
    name: "Vorta Beauty Clinic Bandung",
    category: "Klinik Kecantikan & Aesthetic Surgery",
    city: "Bandung",
    rating: 5.0,
    reviewCount: 4018,
    phone: "+62 811-8883-318",
    waNumber: "628118883318",
    address: "Jl. Sunda No.51, Kb. Pisang, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40112",
    googleMapsUrl: "https://maps.google.com/?cid=4922439691917039727",
    hours: "Setiap Hari: 10:00 - 20:00",
    tagline: "Kecantikan Eksklusif dengan Teknologi Estetika Mutakhir",
    iconEmoji: "✨",
    doctor: {
      name: "dr. Jessica Vorta",
      role: "Head Doctor of Aesthetic Medicine",
      avatarEmoji: "👩‍⚕️",
      avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      sampleChat: {
        user: "Dok, treatment apa yang paling ampuh untuk pori-pori besar dan scar bopeng?",
        doctor: "Halo Dear! Kami punya Signature Morpheus8 & Pico Laser Fractional yang sangat efektif meregenerasi kulit.",
        recommendationTitle: "Signature Skin Remodeling Morpheus8",
        recommendationDesc: "Microneedling RF untuk merapatkan pori & mengencangkan kulit."
      }
    },
    categories: ["Semua", "Skin Glowing", "Laser Scar", "Face Lift"],
    menu: [
      { id: 1, name: "Vorta Signature Diamond Glow Facial", desc: "Eksfoliasi berlian mikro + infus peptide pengencang wajah.", price: "Rp 550.000", tag: "Signature", category: "Skin Glowing" },
      { id: 2, name: "Fractional Pico Laser Scar & Pores", desc: "Membangun jaringan kulit baru untuk bekas jerawat bopeng.", price: "Rp 1.500.000", tag: "Best Result", category: "Laser Scar" },
      { id: 3, name: "HIFU Full Face Ultra Lift", desc: "Pengencangan kulit kendur tanpa jarum & tanpa operasi.", price: "Rp 2.200.000", category: "Face Lift" }
    ]
  },

  // 3. NAAVAGREEN NATURAL SKINCARE (Rating 4.8 | 1302 Ulasan)
  "naavagreen-natural-skincare-bandung": {
    name: "Naavagreen Natural Skincare Bandung",
    category: "Klinik Kecantikan Bahan Alami",
    city: "Bandung",
    rating: 4.8,
    reviewCount: 1302,
    phone: "+62 22 73514794",
    waNumber: "622273514794",
    address: "Jl. Gatot Subroto No.241, Cibangkong, Kec. Batununggal, Kota Bandung, Jawa Barat 40263",
    googleMapsUrl: "https://maps.google.com/?cid=13377355125438182663",
    hours: "Setiap Hari: 09:00 - 18:30",
    tagline: "Perawatan Kulit Wajah Sehat dengan Ekstrak Bahan Natural",
    iconEmoji: "🌿",
    doctor: {
      name: "dr. Ratna Kartika",
      role: "Dokter Konsultan Estetika Medis",
      avatarEmoji: "👩‍⚕️",
      avatarUrl: "https://images.unsplash.com/photo-1594824813504-22b31a38ef2f?w=400&auto=format&fit=crop&q=80",
      sampleChat: {
        user: "Dok, mau konsultasi untuk kulit kering kusam dan komedoan.",
        doctor: "Bisa mengambil Facial Botanical Natural + Serum Vitamin C untuk melembapkan kulit seketika.",
        recommendationTitle: "Natural Botanical Facial",
        recommendationDesc: "Facial komedo ramah kulit sensitif dengan masker ekstrak buah."
      }
    },
    categories: ["Semua", "Natural Facial", "Skin Peeling", "Brightening"],
    menu: [
      { id: 1, name: "Natural Facial & Masker Botanical", desc: "Ekstraksi komedo, massage wajah, dan masker ekstrak teh hijau.", price: "Rp 120.000", tag: "Paling Terjangkau", category: "Natural Facial" },
      { id: 2, name: "Bio Light Therapy Anti-Acne", desc: "Penyinaran blue light untuk mematikan bakteri penyebab jerawat.", price: "Rp 180.000", tag: "Favorit", category: "Skin Peeling" },
      { id: 3, name: "Red Glycolic Peeling Glowing", desc: "Eksfoliasi alami untuk mengangkat sel kulit mati dan mencerahkan.", price: "Rp 160.000", category: "Brightening" }
    ]
  },

  // 4. KLINIK UTAMA BANDUNG DENTAL CENTER (Rating 4.7 | 748 Ulasan)
  "klinik-utama-bandung-dental-center": {
    name: "Klinik Utama Bandung Dental Center",
    category: "Pusat Perawatan & Bedah Mulut Dokter Gigi",
    city: "Bandung",
    rating: 4.7,
    reviewCount: 748,
    phone: "+62 813-2009-6077",
    waNumber: "6281320096077",
    address: "Jl. Sunda No.27d, Kb. Pisang, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40112",
    googleMapsUrl: "https://maps.google.com/?cid=11579122523233840132",
    hours: "Senin - Sabtu: 08:00 - 20:00",
    tagline: "Klinik Rujukan Gigi Terlengkap di Pusat Kota Bandung",
    iconEmoji: "🦷",
    doctor: {
      name: "drg. Rizky Sp.BM",
      role: "Spesialis Bedah Mulut & Dental Implant",
      avatarEmoji: "👨‍⚕️",
      avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
      sampleChat: {
        user: "Dok, gigi bungsu saya miring dan sakit sampai ke kepala.",
        doctor: "Itu impaksi gigi bungsu. Kami sarankan foto panoramik & tindakan odontektomi dengan anestesi nyaman.",
        recommendationTitle: "Odontektomi Bedah Gigi Bungsu",
        recommendationDesc: "Pengambilan gigi geraham bungsu impaksi oleh spesialis bedah mulut."
      }
    },
    categories: ["Semua", "Bedah Mulut", "Implan Gigi", "Pencegahan"],
    menu: [
      { id: 1, name: "Operasi Gigi Bungsu (Odontektomi)", desc: "Pencabutan gigi bungsu impaksi dengan pemulihan cepat.", price: "Mulai Rp 1.800.000", tag: "Spesialis", category: "Bedah Mulut" },
      { id: 2, name: "Dental Implant Titanium Premium", desc: "Solusi permanen menggantikan gigi yang ompong seperti gigi asli.", price: "Mulai Rp 12.000.000", tag: "Eksklusif", category: "Implan Gigi" },
      { id: 3, name: "Scaling Ultrasonik & Polishing", desc: "Pembersihan karang gigi rutin berkala.", price: "Rp 275.000", category: "Pencegahan" }
    ]
  }
};

DEMO_DATA["vorta-beauty-clinic-bandung"] = DEMO_DATA["vorta-beauty-clinic---bandung-(vorta-beauty-clinic---bandung)-|-klinik-kecantikan-di-bandung"];

export const demosData = DEMO_DATA;
