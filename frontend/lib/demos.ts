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

export interface ReviewInfo {
  authorName: string;
  rating: number;
  text: string;
  time?: string;
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
  reviews?: ReviewInfo[];
}

export const DEMO_DATA: Record<string, BusinessDemo> = {
  "pdhb-drh-galuh-indro-d-dkk": {
    "name": "PDHB DRH. GALUH INDRO D., DKK",
    "category": "Klinik Hewan",
    "city": "ciomas bogor",
    "rating": 4.6,
    "reviewCount": 203,
    "phone": "+62 817-4121-554",
    "address": "Jl. Re. Abdullah No.3, RT.02/RW.01, Pasirmulya, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16118, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=260363542067160756&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628174121554",
    "tagline": "Kesehatan Hewan Kesayangan Anda Prioritas Kami",
    "iconEmoji": "🐾",
    "doctor": {
      "name": "Drh. Galuh Indro D.",
      "role": "Dokter Hewan Senior",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, kucing saya lemas dan tidak mau makan. Kira-kira kenapa ya?",
        "doctor": "Halo, baiknya segera dibawa ke klinik untuk pemeriksaan lebih lanjut. Gejala tersebut bisa disebabkan oleh beberapa faktor. Kami akan bantu periksa untuk diagnosa dan penanganan yang tepat.",
        "recommendationTitle": "Pemeriksaan Kesehatan Hewan",
        "recommendationDesc": "Untuk diagnosis akurat dan penanganan cepat pada hewan kesayangan yang menunjukkan gejala sakit atau perubahan perilaku."
      }
    },
    "categories": [
      "Veteriner",
      "Klinik Hewan",
      "Perawatan Hewan",
      "Kesehatan Hewan"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Hewan",
        "desc": "Pemeriksaan umum dan saran kesehatan hewan oleh dokter hewan berpengalaman.",
        "price": "Rp 75.000",
        "tag": "Layanan Utama",
        "category": "Konsultasi"
      },
      {
        "id": 2,
        "name": "Vaksinasi Kucing",
        "desc": "Program vaksinasi lengkap untuk kucing (F3/F4) untuk melindungi dari berbagai penyakit.",
        "price": "Rp 150.000",
        "tag": "Perlindungan",
        "category": "Vaksinasi"
      },
      {
        "id": 3,
        "name": "Vaksinasi Anjing",
        "desc": "Program vaksinasi lengkap untuk anjing (DHPPi, Rabies) untuk menjaga kekebalan tubuh.",
        "price": "Rp 200.000",
        "tag": "Perlindungan",
        "category": "Vaksinasi"
      },
      {
        "id": 4,
        "name": "Sterilisasi Kucing",
        "desc": "Prosedur bedah aman untuk sterilisasi kucing jantan atau betina, termasuk pasca-operasi.",
        "price": "Rp 600.000",
        "tag": "Kesehatan Reproduksi",
        "category": "Bedah"
      },
      {
        "id": 5,
        "name": "Grooming Hewan",
        "desc": "Perawatan lengkap meliputi mandi, potong kuku, bersihkan telinga, dan perawatan bulu.",
        "price": "Rp 120.000",
        "category": "Perawatan"
      },
      {
        "id": 6,
        "name": "Rawat Inap",
        "desc": "Fasilitas rawat inap yang nyaman dengan pengawasan medis 24 jam untuk hewan sakit atau pasca-operasi.",
        "price": "Mulai Rp 100.000/hari",
        "category": "Layanan Tambahan"
      }
    ]
  },


  "klinik-dokter-riyadhi": {
    "name": "Klinik Dokter Riyadhi",
    "category": "Klinik Umum",
    "city": "ciomas bogor",
    "rating": 4.9,
    "reviewCount": 107,
    "phone": "+62 895-4183-07958",
    "address": "Jl. Nurkim, RT.01/RW.13, Kota Batu, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=9905917719201751516&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu, 08:00 - 21:00",
    "waNumber": "62895418307958",
    "tagline": "Pelayanan Kesehatan Profesional dan Terpercaya",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dokter Riyadhi",
      "role": "Dokter Umum",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, saya merasa demam dan batuk sudah 3 hari, apakah ini gejala flu biasa?",
        "doctor": "Halo, berdasarkan gejala yang Anda alami, kemungkinan besar Anda terserang flu biasa. Namun, untuk diagnosis yang lebih akurat, disarankan untuk datang ke klinik agar dapat diperiksa lebih lanjut.",
        "recommendationTitle": "Pemeriksaan dan Konsultasi Langsung",
        "recommendationDesc": "Untuk mendapatkan diagnosis pasti dan penanganan yang tepat, segera kunjungi klinik kami. Dokter akan melakukan pemeriksaan fisik dan mungkin beberapa tes jika diperlukan untuk memastikan kondisi kesehatan Anda."
      }
    },
    "categories": [
      "Klinik Umum",
      "Dokter Keluarga",
      "Pelayanan Kesehatan Primer"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan dan konsultasi dengan dokter umum",
        "price": "Rp 75.000",
        "category": "Pelayanan Medis"
      },
      {
        "id": 2,
        "name": "Pemeriksaan Gula Darah",
        "desc": "Cek kadar gula darah sewaktu",
        "price": "Rp 30.000",
        "tag": "Populer",
        "category": "Pemeriksaan"
      },
      {
        "id": 3,
        "name": "Injeksi Vitamin C",
        "desc": "Suntik vitamin C untuk menjaga daya tahan tubuh",
        "price": "Rp 100.000",
        "category": "Terapi"
      },
      {
        "id": 4,
        "name": "Tindakan Luka Minor",
        "desc": "Pembersihan dan penanganan luka kecil",
        "price": "Mulai Rp 50.000",
        "category": "Tindakan Medis"
      }
    ]
  },


  "qdental-care-praktek-drg-iik-yani-hidayati-mm": {
    "name": "Q-Dental Care. Praktek Drg IIK YANI HIDAYATI, MM",
    "category": "Dental Clinic",
    "city": "ciomas bogor",
    "rating": 4.5,
    "reviewCount": 73,
    "phone": "+62 812-9935-864",
    "address": "Jalan Garuda Raya Jl. Komp. Villa Ciomas Indah No.5 Blok H1, RW.6, Ciomas Rahayu, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=15654726269016391184&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628129935864",
    "tagline": "Senyum Sehat, Senyum Percaya Diri.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Drg IIK YANI HIDAYATI, MM",
      "role": "Dentist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Gusi saya bengkak dan sakit, dok. Kira-kira kenapa ya?",
        "doctor": "Halo, mohon maaf atas ketidaknyamanannya. Mari kita jadwalkan pemeriksaan agar saya bisa mengetahui penyebab pastinya dan memberikan penanganan yang tepat. Apakah ada demam atau gejala lain?",
        "recommendationTitle": "Konsultasi Masalah Gusi",
        "recommendationDesc": "Pemeriksaan menyeluruh untuk keluhan gusi bengkak dan sakit, serta rekomendasi perawatan."
      }
    },
    "categories": [
      "Klinik Gigi",
      "Dokter Gigi",
      "Perawatan Gigi",
      "Orthodontic"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pembersihan Karang Gigi (Scaling)",
        "desc": "Prosedur untuk menghilangkan plak dan karang gigi yang menempel pada permukaan gigi.",
        "price": "Mulai dari Rp 250.000",
        "tag": "Populer",
        "category": "Perawatan Dasar"
      },
      {
        "id": 2,
        "name": "Penambalan Gigi",
        "desc": "Mengatasi gigi berlubang atau retak dengan bahan tambal sewarna gigi (komposit).",
        "price": "Mulai dari Rp 300.000",
        "category": "Restorasi"
      },
      {
        "id": 3,
        "name": "Pencabutan Gigi",
        "desc": "Prosedur pencabutan gigi yang sudah tidak dapat dipertahankan lagi atau gigi bungsu.",
        "price": "Mulai dari Rp 200.000",
        "category": "Bedah Minor"
      },
      {
        "id": 4,
        "name": "Perawatan Saluran Akar",
        "desc": "Penanganan untuk gigi dengan infeksi pada bagian pulpa agar gigi tidak perlu dicabut.",
        "price": "Mulai dari Rp 800.000",
        "category": "Perawatan Lanjutan"
      },
      {
        "id": 5,
        "name": "Bleaching Gigi (Pemutihan)",
        "desc": "Prosedur kosmetik untuk mencerahkan warna gigi secara signifikan.",
        "price": "Mulai dari Rp 1.500.000",
        "tag": "Estetika",
        "category": "Perawatan Estetika"
      }
    ]
  },


  "dr-erlin-spa-dokter-anak-rskia-sawojajar": {
    "name": "dr. Erlin, SpA (Dokter anak RSKIA Sawojajar)",
    "category": "Klinik Anak",
    "city": "ciomas bogor",
    "rating": 5.0,
    "reviewCount": 127,
    "phone": "+62 877-7832-4371",
    "address": "Jl. Sawojajar No.9, Pabaton, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16121, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=6458399768149915422&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin-Jumat: 08.00-17.00, Sabtu: 08.00-14.00, Minggu: Tutup",
    "waNumber": "6287778324371",
    "tagline": "Klinik anak terpercaya dengan pelayanan terbaik untuk kesehatan buah hati Anda.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "dr. Erlin, SpA",
      "role": "Dokter Spesialis Anak",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Anak saya demam tinggi dan batuk pilek, apakah perlu dibawa ke klinik?",
        "doctor": "Halo, Ibu/Bapak. Untuk demam tinggi pada anak, sebaiknya segera dibawa ke klinik agar bisa diperiksa langsung. Sementara ini, berikan paracetamol sesuai dosis dan pastikan anak cukup minum. Kami siap membantu di klinik.",
        "recommendationTitle": "Cek Kesehatan Anak Segera",
        "recommendationDesc": "Jika anak mengalami demam tinggi disertai batuk pilek, sangat disarankan untuk segera melakukan pemeriksaan medis. Dokter akan memberikan diagnosa dan penanganan yang tepat."
      }
    },
    "categories": [
      "Klinik Anak",
      "Dokter Spesialis Anak",
      "Kesehatan Anak",
      "Imunisasi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Spesialis Anak",
        "desc": "Pemeriksaan dan konsultasi menyeluruh dengan Dokter Spesialis Anak.",
        "price": "Rp 150.000",
        "category": "Layanan Utama"
      },
      {
        "id": 2,
        "name": "Imunisasi Rutin Anak",
        "desc": "Program imunisasi lengkap sesuai jadwal rekomendasi IDAI.",
        "price": "Mulai Rp 200.000",
        "category": "Layanan Utama"
      },
      {
        "id": 3,
        "name": "Pemeriksaan Tumbuh Kembang",
        "desc": "Evaluasi dan pemantauan tumbuh kembang anak.",
        "price": "Rp 120.000",
        "category": "Layanan Tambahan"
      },
      {
        "id": 4,
        "name": "Nebulizer untuk Anak",
        "desc": "Tindakan nebulizer untuk mengatasi masalah pernapasan pada anak.",
        "price": "Rp 80.000",
        "category": "Tindakan Medis"
      }
    ]
  },


  "rumah-keisya": {
    "name": "RUMAH KEISYA",
    "category": "Klinik Kecantikan",
    "city": "ciomas bogor",
    "rating": 4.5,
    "reviewCount": 553,
    "phone": "",
    "address": "9QXJ+GP5, RT.04/RW.04, Pasirkuda, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16119, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=8425839679768306770&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281234567890",
    "tagline": "Pusat Perawatan Estetika dan Kesehatan",
    "iconEmoji": "💅",
    "doctor": {
      "name": "Dr. Aisyah",
      "role": "Dokter Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya ingin konsultasi mengenai perawatan wajah untuk kulit sensitif.",
        "doctor": "Tentu, dengan senang hati. Kami memiliki beberapa opsi perawatan yang dirancang khusus untuk kulit sensitif. Bisa ceritakan lebih lanjut tentang kondisi kulit Anda?",
        "recommendationTitle": "Rekomendasi Perawatan Kulit Sensitif",
        "recommendationDesc": "Kami merekomendasikan facial hydrating khusus, serum probiotik, dan krim pelembap tanpa pewangi untuk menenangkan dan memperkuat barrier kulit Anda."
      }
    },
    "categories": [
      "Perawatan Kulit",
      "Kecantikan Wajah",
      "Perawatan Rambut",
      "Klinik Umum"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Basic Facial",
        "desc": "Pembersihan wajah mendalam untuk kulit sehat",
        "price": "Rp 150.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Acne Treatment",
        "desc": "Perawatan khusus untuk kulit berjerawat dan sensitif",
        "price": "Rp 250.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Consultation & Skincare",
        "desc": "Konsultasi dengan dokter dan rekomendasi produk",
        "price": "Rp 100.000",
        "category": "Konsultasi"
      },
      {
        "id": 4,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan laser untuk peremajaan kulit",
        "price": "Rp 750.000",
        "category": "Perawatan Khusus"
      }
    ]
  },


  "dr-adisetya-w-spthtbkl-dokter-spesialis-telinga-hidung-tenggorok": {
    "name": "Dr. Adisetya W Sp.THT-BKL (Dokter Spesialis Telinga Hidung & Tenggorok)",
    "category": "Klinik THT",
    "city": "Bogor",
    "rating": 4.9,
    "reviewCount": 171,
    "phone": "+62 852-8250-1970",
    "address": "Jl. DR. Sumeru No.84, RT.01/RW.03, Menteng, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16111, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=10054019494049353279&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285282501970",
    "tagline": "Pakar THT terkemuka di Bogor, siap melayani kesehatan telinga, hidung, dan tenggorok Anda dengan profesionalisme dan empati.",
    "iconEmoji": "👂👃",
    "doctor": {
      "name": "Dr. Adisetya W Sp.THT-BKL",
      "role": "Dokter Spesialis Telinga Hidung & Tenggorok",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, saya sering merasa telinga berdengung dan sedikit nyeri. Apa yang harus saya lakukan?",
        "doctor": "Halo, baik. Berdasarkan keluhan Anda, ada beberapa kemungkinan penyebab. Untuk diagnosis yang lebih akurat, saya sarankan Anda datang untuk pemeriksaan langsung agar bisa dilihat kondisi telinga Anda. Apakah Anda bisa datang besok?",
        "recommendationTitle": "Pemeriksaan Telinga Komprehensif",
        "recommendationDesc": "Pemeriksaan fisik telinga menggunakan otoskop dan mungkin tes audiometri untuk mengevaluasi pendengaran dan mencari penyebab dengungan atau nyeri."
      }
    },
    "categories": [
      "THT",
      "Spesialis THT",
      "Klinik THT",
      "Dokter THT"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Spesialis THT",
        "desc": "Diskusi mendalam mengenai keluhan telinga, hidung, atau tenggorok dengan dokter spesialis.",
        "price": "Rp 150.000",
        "category": "Layanan Utama"
      },
      {
        "id": 2,
        "name": "Pembersihan Serumen (Kotoran Telinga)",
        "desc": "Prosedur aman dan nyaman untuk membersihkan kotoran telinga yang menumpuk.",
        "price": "Rp 100.000",
        "category": "Perawatan Umum"
      },
      {
        "id": 3,
        "name": "Pemeriksaan Audiometri",
        "desc": "Tes untuk mengukur kemampuan pendengaran dan mendeteksi gangguan pendengaran.",
        "price": "Rp 200.000",
        "category": "Pemeriksaan Diagnostik"
      },
      {
        "id": 4,
        "name": "Endoskopi Hidung/Tenggorok",
        "desc": "Pemeriksaan visual saluran hidung atau tenggorok menggunakan endoskop untuk diagnosis lebih akurat.",
        "price": "Rp 250.000",
        "category": "Pemeriksaan Diagnostik"
      },
      {
        "id": 5,
        "name": "Terapi Vertigo",
        "desc": "Penanganan khusus untuk keluhan pusing berputar atau vertigo.",
        "price": "Rp 180.000",
        "category": "Layanan Spesialis"
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
