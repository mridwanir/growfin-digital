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

export const demosData = DEMO_DATA;
