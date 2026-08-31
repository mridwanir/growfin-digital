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
