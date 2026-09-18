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
  "bidan-mariyah-q-agustina-strkebbdn": {
    "name": "Bidan Mariyah Q. Agustina, S.Tr.Keb,Bdn",
    "category": "Klinik Kebidanan",
    "city": "Ciomas Bogor",
    "rating": 4.9,
    "reviewCount": 15,
    "phone": "",
    "address": "zam zam tirta, Jl. Sukamaju Ciapus Kreteg, Pagelaran, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=8320420347943182149&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin-Sabtu: 08.00 - 20.00, Minggu: Tutup",
    "waNumber": "6281234567890",
    "tagline": "Melayani dengan hati, bunda dan buah hati sehat.",
    "iconEmoji": "🤰",
    "doctor": {
      "name": "Bidan Mariyah Q. Agustina",
      "role": "Bidan",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya ingin konsultasi mengenai kehamilan saya yang sudah masuk trimester ketiga, Bidan.",
        "doctor": "Tentu, mari kita diskusikan. Apakah ada keluhan khusus atau pertanyaan yang ingin Anda sampaikan?",
        "recommendationTitle": "Jadwal Kontrol Kehamilan Rutin",
        "recommendationDesc": "Penting untuk melakukan kontrol rutin setiap 2 minggu pada trimester ketiga untuk memantau kesehatan ibu dan janin."
      }
    },
    "categories": [
      "Kebidanan",
      "Kesehatan Ibu dan Anak",
      "Persalinan"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Kehamilan",
        "desc": "Pemeriksaan dan saran komprehensif selama masa kehamilan.",
        "price": "Rp 50.000",
        "category": "Layanan Kebidanan"
      },
      {
        "id": 2,
        "name": "Pemeriksaan Pasca Melahirkan",
        "desc": "Evaluasi kesehatan ibu dan bayi setelah proses persalinan.",
        "price": "Rp 75.000",
        "category": "Layanan Kebidanan"
      },
      {
        "id": 3,
        "name": "Imunisasi Bayi",
        "desc": "Pemberian vaksinasi dasar untuk perlindungan kesehatan bayi.",
        "price": "Harga menyesuaikan",
        "tag": "Tersedia",
        "category": "Kesehatan Anak"
      }
    ]
  },


  "bidan-milna-corviana": {
    "name": "Bidan Milna Corviana",
    "category": "Klinik Kebidanan",
    "city": "Ciomas Bogor",
    "rating": 4.7,
    "reviewCount": 125,
    "phone": "",
    "address": "Padasuka, Ciomas, Bogor Regency, West Java 16610, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=4354824378859681372&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281234567890",
    "tagline": "Pelayanan Kebidanan Profesional dan Terpercaya",
    "iconEmoji": "🤰",
    "doctor": {
      "name": "Milna Corviana",
      "role": "Bidan",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "",
      "sampleChat": {
        "user": "Halo Bidan, saya mau tanya jadwal konsultasi untuk kehamilan pertama saya.",
        "doctor": "Tentu, selamat datang. Untuk konsultasi kehamilan pertama, kami sarankan pada hari Senin-Jumat pukul 09.00-16.00. Apakah Anda sudah memiliki riwayat kesehatan yang perlu kami ketahui?",
        "recommendationTitle": "Jadwal Konsultasi Kehamilan",
        "recommendationDesc": "Kami menyediakan layanan konsultasi kehamilan pertama dengan bidan berpengalaman. Dapatkan informasi lengkap tentang kesehatan ibu dan bayi serta persiapan persalinan."
      }
    },
    "categories": [
      "Kebidanan",
      "Kesehatan Ibu dan Anak",
      "Persalinan"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Kehamilan",
        "desc": "Pemeriksaan rutin dan saran kesehatan selama masa kehamilan.",
        "price": "Rp 75.000",
        "tag": "Populer",
        "category": "Layanan Kebidanan"
      },
      {
        "id": 2,
        "name": "Pemeriksaan USG",
        "desc": "Pemeriksaan ultrasonografi untuk memantau perkembangan janin.",
        "price": "Rp 150.000",
        "category": "Layanan Kebidanan"
      },
      {
        "id": 3,
        "name": "Kelas Prenatal",
        "desc": "Sesi edukasi untuk persiapan persalinan dan perawatan bayi baru lahir.",
        "price": "Rp 200.000",
        "tag": "Paket",
        "category": "Edukasi"
      },
      {
        "id": 4,
        "name": "Imunisasi Anak",
        "desc": "Layanan imunisasi dasar dan lanjutan untuk bayi dan balita.",
        "price": "Mulai Rp 80.000",
        "category": "Layanan Kesehatan Anak"
      },
      {
        "id": 5,
        "name": "Persalinan Normal",
        "desc": "Pendampingan dan fasilitas persalinan normal dengan bidan berpengalaman.",
        "price": "Mulai Rp 1.500.000",
        "tag": "Unggulan",
        "category": "Layanan Kebidanan"
      }
    ]
  },


  "qdental-care-praktek-drg-iik-yani-hidayati-mm": {
    "name": "Q-Dental Care. Praktek Drg IIK YANI HIDAYATI, MM",
    "category": "Klinik Gigi",
    "city": "Ciomas Bogor",
    "rating": 4.5,
    "reviewCount": 73,
    "phone": "+62 812-9935-864",
    "address": "Jalan Garuda Raya Jl. Komp. Villa Ciomas Indah No.5 Blok H1, RW.6, Ciomas Rahayu, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=15654726269016391184&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628129935864",
    "tagline": "Senyum sehat dan cerah Anda adalah prioritas kami.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Drg. IIK YANI HIDAYATI, MM",
      "role": "Dokter Gigi Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo dok, gigi saya terasa ngilu saat minum dingin.",
        "doctor": "Selamat siang. Ngilu pada gigi saat minum dingin bisa jadi indikasi sensitivitas gigi atau masalah lain. Sebaiknya segera periksakan gigi Anda agar bisa dilakukan penanganan yang tepat.",
        "recommendationTitle": "Pemeriksaan Gigi dan Penanganan Sensitivitas",
        "recommendationDesc": "Kunjungi klinik kami untuk pemeriksaan menyeluruh. Dokter akan mendiagnosis penyebab ngilu dan memberikan perawatan yang sesuai, seperti aplikasi fluoride atau penambalan jika diperlukan."
      }
    },
    "categories": [
      "Klinik Gigi",
      "Dokter Gigi",
      "Perawatan Gigi",
      "Tambal Gigi",
      "Pembersihan Karang Gigi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan dan Konsultasi Gigi",
        "desc": "Pemeriksaan kondisi gigi dan mulut secara menyeluruh serta konsultasi dengan dokter gigi.",
        "price": "Rp 50.000",
        "category": "Layanan Umum"
      },
      {
        "id": 2,
        "name": "Scaling (Pembersihan Karang Gigi)",
        "desc": "Prosedur pembersihan karang gigi dan plak untuk menjaga kesehatan gusi dan gigi.",
        "price": "Rp 250.000 - Rp 400.000",
        "category": "Layanan Umum"
      },
      {
        "id": 3,
        "name": "Penambalan Gigi Komposit",
        "desc": "Penambalan gigi berlubang menggunakan bahan komposit sewarna gigi.",
        "price": "Rp 300.000 - Rp 600.000",
        "category": "Restorasi Gigi"
      },
      {
        "id": 4,
        "name": "Pencabutan Gigi (Sederhana)",
        "desc": "Pencabutan gigi yang rusak atau bermasalah tanpa komplikasi.",
        "price": "Rp 200.000 - Rp 450.000",
        "category": "Bedah Minor"
      },
      {
        "id": 5,
        "name": "Bleaching (Pemutihan Gigi)",
        "desc": "Prosedur estetika untuk mencerahkan warna gigi Anda.",
        "price": "Rp 1.500.000 - Rp 3.000.000",
        "category": "Estetika Gigi"
      }
    ]
  },


  "rumah-keisya": {
    "name": "RUMAH KEISYA",
    "category": "Klinik Kecantikan",
    "city": "Ciomas Bogor",
    "rating": 4.5,
    "reviewCount": 553,
    "phone": "Tidak tersedia",
    "address": "9QXJ+GP5, RT.04/RW.04, Pasirkuda, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16119, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=8425839679768306770&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281234567890",
    "tagline": "Pusat kecantikan terpercaya untuk kulit sehat dan cerah Anda.",
    "iconEmoji": "\"\b",
    "doctor": {
      "name": "dr. Anya Wijaya",
      "role": "Dokter Kecantikan",
      "avatarEmoji": "👩\t\n",
      "avatarUrl": "https://example.com/anya.png",
      "sampleChat": {
        "user": "Dokter, kulit saya sering kusam dan muncul jerawat kecil. Apa rekomendasi perawatan yang cocok untuk saya?",
        "doctor": "Tentu, untuk masalah kulit kusam dan jerawat kecil, kami memiliki beberapa pilihan perawatan. Untuk langkah awal, saya sarankan konsultasi mendalam untuk mengetahui jenis kulit dan penyebabnya.",
        "recommendationTitle": "Rekomendasi Perawatan Kulit Kusam dan Jerawat",
        "recommendationDesc": "Kami merekomendasikan facial detox dan serum pencerah yang diformulasikan khusus untuk kulit Anda. Lanjutkan dengan penggunaan skincare rutin yang tepat."
      }
    },
    "categories": [
      "Klinik Kecantikan",
      "Perawatan Kulit",
      "Spa",
      "Facial"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Basic",
        "desc": "Pembersihan mendalam untuk mengangkat kotoran dan sel kulit mati.",
        "price": "Rp 99.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Acne Treatment",
        "desc": "Perawatan khusus untuk mengatasi jerawat dan mengurangi bekasnya.",
        "price": "Rp 150.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Brightening Infusion",
        "desc": "Infus vitamin untuk mencerahkan kulit dari dalam.",
        "price": "Rp 250.000",
        "category": "Perawatan Tubuh"
      }
    ]
  },


  "dr-adisetya-w-spthtbkl-dokter-spesialis-telinga-hidung-tenggorok": {
    "name": "Dr. Adisetya W Sp.THT-BKL (Dokter Spesialis Telinga Hidung & Tenggorok)",
    "category": "Klinik THT",
    "city": "Ciomas Bogor",
    "rating": 4.9,
    "reviewCount": 171,
    "phone": "+62 852-8250-1970",
    "address": "Jl. DR. Sumeru No.84, RT.01/RW.03, Menteng, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16111, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=10054019494049353279&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMuYjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285282501970",
    "tagline": "Spesialis Telinga, Hidung, dan Tenggorok terbaik di Bogor.",
    "iconEmoji": "👂",
    "doctor": {
      "name": "Dr. Adisetya W",
      "role": "Spesialis THT-BKL",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo dokter, saya sering merasa telinga berdengung akhir-akhir ini. Apakah ini normal?",
        "doctor": "Halo, tentu. Telinga berdengung atau tinnitus bisa disebabkan oleh beberapa faktor. Saya akan bantu periksa lebih lanjut. Kapan waktu yang tepat untuk Anda berkonsultasi?",
        "recommendationTitle": "Jadwalkan Konsultasi THT",
        "recommendationDesc": "Dapatkan penanganan terbaik untuk masalah telinga, hidung, dan tenggorokan Anda dengan Dr. Adisetya W."
      }
    },
    "categories": [
      "Klinik THT",
      "Dokter Spesialis THT",
      "Praktek Dokter"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Spesialis THT",
        "desc": "Pemeriksaan dan konsultasi menyeluruh dengan dokter spesialis THT.",
        "price": "Rp 250.000",
        "category": "Layanan Utama"
      },
      {
        "id": 2,
        "name": "Pemeriksaan Audiometri",
        "desc": "Tes pendengaran untuk mendeteksi gangguan atau penurunan fungsi pendengaran.",
        "price": "Rp 300.000",
        "tag": "Populer",
        "category": "Pemeriksaan Diagnostik"
      },
      {
        "id": 3,
        "name": "Endoskopi THT",
        "desc": "Pemeriksaan detail saluran telinga, hidung, dan tenggorokan menggunakan endoskop.",
        "price": "Rp 450.000",
        "category": "Pemeriksaan Diagnostik"
      },
      {
        "id": 4,
        "name": "Irigasi Telinga",
        "desc": "Prosedur pembersihan kotoran telinga yang menumpuk secara aman dan efektif.",
        "price": "Rp 150.000",
        "category": "Prosedur Minor"
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
