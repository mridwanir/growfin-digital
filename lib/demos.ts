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

export const demosData: Record<string, BusinessDemo> = {
  'smile-atelier': {
    name: 'Smile Atelier',
    category: 'Klinik Gigi & Estetika',
    city: 'Jakarta Selatan',
    rating: 4.9,
    reviewCount: 1265,
    phone: '+62 812 3456 789',
    address: 'Jl. Senopati No. 22, Jakarta Selatan',
    googleMapsUrl: 'https://maps.google.com/?q=Jl.+Senopati+No.+22+Jakarta+Selatan',
    hours: 'Open · 09.00 AM - 09.00 PM',
    waNumber: '628123456789',
    tagline: 'Klinik gigi modern dengan layanan estetika mulut, whitening, dan perawatan senyum premium untuk hasil natural.',
    iconEmoji: '🦷',
    doctor: {
      name: 'drg. Sarah Mitchell',
      role: 'Spesialis Estetika Gigi & Veneer',
      avatarEmoji: '👩‍⚕️',
      sampleChat: {
        user: 'Halo Dok, gigi saya ada yang agak kuning dan kurang rapi. Treatment apa yang cocok?',
        doctor: 'Halo! Kami merekomendasikan Laser Teeth Whitening atau konsultasi Veneer Estetik untuk senyum lebih cerah.',
        recommendationTitle: 'Laser Whitening & Veneer',
        recommendationDesc: 'Reservasi konsultasi estetik gigi hari ini.',
      },
    },
    categories: ['Semua', 'Pemeriksaan', 'Scaling', 'Whitening', 'Estetika'],
    menu: [
      {
        id: 1,
        name: 'Consultation & Check-Up',
        desc: 'Evaluasi gigi dan mulut dengan dokter spesialis, termasuk foto intraoral dan rekomendasi treatment.',
        price: '150.000',
        tag: 'Popular',
        category: 'Pemeriksaan',
      },
      {
        id: 2,
        name: 'Scaling & Polishing',
        desc: 'Pembersihan karang dan noda untuk menjaga kesehatan gusi serta tampilan gigi lebih cerah.',
        price: '320.000',
        tag: 'Basic Care',
        category: 'Scaling',
      },
      {
        id: 3,
        name: 'Laser Teeth Whitening',
        desc: 'Perawatan pemutih gigi dengan teknologi laser modern untuk hasil maksimal dalam satu sesi.',
        price: '1.200.000',
        tag: 'Best Seller',
        category: 'Whitening',
      },
      {
        id: 4,
        name: 'Veneer Estetik',
        desc: 'Solusi estetik untuk gigi patah, renggang, atau warna tidak merata dengan bahan porcelain tahan lama.',
        price: '2.500.000',
        tag: 'Premium',
        category: 'Estetika',
      },
      {
        id: 5,
        name: 'Facial Glow & Contour',
        desc: 'Perawatan pendukung estetik senyum & wajah untuk tampilan segar dan alami.',
        price: '1.600.000',
        tag: 'Glow',
        category: 'Estetika',
      },
    ],
  },
  'aura-dental': {
    name: 'Aura Dental Clinic',
    category: 'Klinik Gigi Family Care',
    city: 'Bandung',
    rating: 4.8,
    reviewCount: 842,
    phone: '+62 819 8765 432',
    address: 'Jl. Cihampelas No. 18, Bandung',
    googleMapsUrl: 'https://maps.google.com/?q=Jl.+Cihampelas+No.+18+Bandung',
    hours: 'Open · 08.30 AM - 08.30 PM',
    waNumber: '628198765432',
    tagline: 'Perawatan gigi keluarga dengan teknologi modern, pelayanan ramah, dan ramah anak untuk semua usia.',
    iconEmoji: '🪥',
    doctor: {
      name: 'drg. Amanda Putri',
      role: 'Dokter Gigi Keluarga & Konservasi',
      avatarEmoji: '👩‍⚕️',
      sampleChat: {
        user: 'Halo Dok, gigi anak saya terasa ngilu saat minum dingin. Perlunya tindakan apa ya?',
        doctor: 'Sebaiknya dilakukan pemeriksaan awal & perawatan pelindung gigi (Children Dental Care) agar infeksi tidak berlanjut.',
        recommendationTitle: 'Children Dental Check-Up',
        recommendationDesc: 'Jadwalkan pemeriksaan ramah anak di klinik kami.',
      },
    },
    categories: ['Semua', 'Rutin', 'Anak-Anak', 'Pemutih', 'Perawatan Akar'],
    menu: [
      {
        id: 1,
        name: 'Dental Check-Up Keluarga',
        desc: 'Pemeriksaan rutin dan edukasi kesehatan mulut untuk pencegahan masalah gigi sejak dini.',
        price: '120.000',
        tag: 'Routine',
        category: 'Rutin',
      },
      {
        id: 2,
        name: 'Children Dental Care',
        desc: 'Perawatan khusus anak agar pemeriksaan nyaman, bebas rasa takut, dan edukatif.',
        price: '180.000',
        tag: 'Family',
        category: 'Anak-Anak',
      },
      {
        id: 3,
        name: 'Whitening Booster',
        desc: 'Pemutih gigi instan aman untuk gusi sensitif dengan hasil lebih cerah.',
        price: '900.000',
        tag: 'Top Pick',
        category: 'Pemutih',
      },
      {
        id: 4,
        name: 'Root Canal Treatment',
        desc: 'Perawatan saluran akar untuk menyelamatkan gigi berlubang dalam tanpa perlu dicabut.',
        price: '1.800.000',
        tag: 'Medical',
        category: 'Perawatan Akar',
      },
      {
        id: 5,
        name: 'Skin Booster Facial',
        desc: 'Perawatan wajah pelengkap untuk menjaga kulit tetap segar, sehat, dan lembap.',
        price: '1.100.000',
        tag: 'Beauty',
        category: 'Rutin',
      },
    ],
  },
  'luna-beauty-clinic': {
    name: 'Luna Beauty Clinic',
    category: 'Klinik Kecantikan & Slimming',
    city: 'Surabaya',
    rating: 4.9,
    reviewCount: 980,
    phone: '+62 815 5678 901',
    address: 'Jl. Darmo Permai No. 7, Surabaya',
    googleMapsUrl: 'https://maps.google.com/?q=Jl.+Darmo+Permai+No.+7+Surabaya',
    hours: 'Open · 10.00 AM - 09.00 PM',
    waNumber: '628155678901',
    tagline: 'Perawatan kecantikan terpadu untuk kulit wajah, anti-aging, dan kontur tubuh dengan medis tepercaya.',
    iconEmoji: '✨',
    doctor: {
      name: 'dr. Elena Rostova',
      role: 'Aesthetic & Skin Specialist',
      avatarEmoji: '👩‍⚕️',
      sampleChat: {
        user: 'Dok, kulit wajah saya terasa kusam dan kering akhir-akhir ini. Ada saran treatment?',
        doctor: 'Perawatan Hydra Facial Glowing sangat disarankan untuk mengangkat sel kulit mati dan menghidrasi kulit instant.',
        recommendationTitle: 'Hydra Facial Glowing',
        recommendationDesc: 'Dapatkan kulit tampak lebih cerah & glowing.',
      },
    },
    categories: ['Semua', 'Facial & Glow', 'Anti-Aging', 'Slimming', 'Laser'],
    menu: [
      {
        id: 1,
        name: 'Personalized Beauty Plan',
        desc: 'Konsultasi mendalam & analisa tipe kulit untuk menyusun paket perawatan yang paling tepat.',
        price: '200.000',
        tag: 'Personalized',
        category: 'Facial & Glow',
      },
      {
        id: 2,
        name: 'Hydra Facial Glowing',
        desc: 'Perawatan wajah intensif untuk membersihkan komedo, menghidrasi, dan menutrisi kulit secara mendalam.',
        price: '650.000',
        tag: 'Glow',
        category: 'Facial & Glow',
      },
      {
        id: 3,
        name: 'Intensive Skin Booster',
        desc: 'Serum anti-aging nutrisi tinggi untuk meremajakan kulit dan mengembalikan elastisitas.',
        price: '950.000',
        tag: 'Premium',
        category: 'Anti-Aging',
      },
      {
        id: 4,
        name: 'Targeted Body Slimming',
        desc: 'Program penghancur lemak dan pengencangan tubuh medis tanpa rasa sakit.',
        price: '1.400.000',
        tag: 'Best Seller',
        category: 'Slimming',
      },
      {
        id: 5,
        name: 'Laser Hair Removal',
        desc: 'Teknologi laser aman untuk menghilangkan rambut halus secara permanen dan menghaluskan kulit.',
        price: '1.050.000',
        tag: 'Popular',
        category: 'Laser',
      },
    ],
  },
  'medika-care': {
    name: 'Medika Care Clinic',
    category: 'Klinik Pratama & Pelayanan Umum',
    city: 'Tangerang',
    rating: 4.9,
    reviewCount: 530,
    phone: '+62 813 9988 7766',
    address: 'Jl. Boulevard Raya No. 45, Tangerang',
    googleMapsUrl: 'https://maps.google.com/?q=Jl.+Boulevard+Raya+No.+45+Tangerang',
    hours: 'Open · 08.00 AM - 09.00 PM',
    waNumber: '6281399887766',
    tagline: 'Layanan medis umum, laboratorium, vaksinasi, dan pemeriksaan kesehatan terpadu dengan dokter profesional.',
    iconEmoji: '🩺',
    doctor: {
      name: 'dr. Rizky Kurniawan',
      role: 'Dokter Umum & Medis Preventif',
      avatarEmoji: '👨‍⚕️',
      sampleChat: {
        user: 'Dok, saya mau reservasi jadwal Medical Check-Up rutin bulan ini, apakah perlu puasa sebelumnya?',
        doctor: 'Halo! Ya, disarankan puasa 8-10 jam sebelum pengambilan sampel darah untuk hasil lab yang presisi.',
        recommendationTitle: 'Medical Check-Up Package',
        recommendationDesc: 'Pemeriksaan kesehatan menyeluruh untuk Anda & keluarga.',
      },
    },
    categories: ['Semua', 'Konsultasi', 'Check-Up', 'Laboratorium', 'Vaksinasi'],
    menu: [
      {
        id: 1,
        name: 'Konsultasi Dokter Umum',
        desc: 'Pemeriksaan fisik awal, diagnosa kesehatan, dan resep medis dokter terpercaya.',
        price: '100.000',
        tag: 'General',
        category: 'Konsultasi',
      },
      {
        id: 2,
        name: 'Medical Check-Up Lengkap',
        desc: 'Paket pemeriksaan kesehatan menyeluruh mencakup tensi, EKG, gula darah, dan kolesterol.',
        price: '750.000',
        tag: 'Comprehensive',
        category: 'Check-Up',
      },
      {
        id: 3,
        name: 'Tes Darah & Lab Lengkap',
        desc: 'Pemeriksaan sampel darah laboratorium untuk deteksi dini fungsi organ dan Imunitas.',
        price: '350.000',
        tag: 'Lab Test',
        category: 'Laboratorium',
      },
      {
        id: 4,
        name: 'Suntik Vitamin C & Immune Booster',
        desc: 'Injeksi nutrisi tinggi untuk meningkatkan stamina dan daya tahan tubuh.',
        price: '250.000',
        tag: 'Booster',
        category: 'Vaksinasi',
      },
      {
        id: 5,
        name: 'Vaksinasi Influenza & Imunitas',
        desc: 'Pemberian vaksin pelindung dari infeksi saluran pernapasan dan flu musiman.',
        price: '380.000',
        tag: 'Preventive',
        category: 'Vaksinasi',
      },
    ],
  },
};