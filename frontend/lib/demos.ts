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
  "praktek-dokter-hankam-dr-urip-sadeli": {
    "name": "Praktek Dokter Hankam dr. Urip Sadeli",
    "category": "Klinik Umum",
    "city": "cisarua",
    "rating": 4.7,
    "reviewCount": 13,
    "phone": "+62 812-8805-7278",
    "address": "Jl. Hankam No.KM. 80, Leuwimalang, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16750, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=16533342061455380162&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJbyRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281288057278",
    "tagline": "Layanan kesehatan prima untuk Anda dan keluarga di Cisarua.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "dr. Urip Sadeli",
      "role": "Dokter Umum",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Anak saya demam tinggi dan batuk sudah 3 hari, apakah perlu segera diperiksa?",
        "doctor": "Tentu, Bu/Pak. Silakan datang ke klinik untuk pemeriksaan lebih lanjut agar dapat diberikan penanganan yang tepat. Jangan tunda jika demamnya tinggi.",
        "recommendationTitle": "Konsultasi Demam & Batuk Anak",
        "recommendationDesc": "Untuk demam tinggi dan batuk pada anak, segera konsultasikan dengan dokter untuk diagnosis dan penanganan yang akurat."
      }
    },
    "categories": [
      "Klinik Umum",
      "Praktek Dokter",
      "Kesehatan Keluarga"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan dan konsultasi dengan dokter umum untuk berbagai keluhan kesehatan.",
        "price": "Mulai dari Rp 50.000",
        "category": "Layanan Dasar"
      }
    ],
    "reviews": [
      {
        "authorName": "Mhmdandri Yansyah",
        "rating": 4,
        "text": "I have been receiving treatment here for 2 years and in a few months, the doctor always has the best medicine. Thank you, doctor.",
        "time": "5 months ago"
      },
      {
        "authorName": "Rana",
        "rating": 5,
        "text": "I've taken my children for treatment twice, and thank God, they've been successful. The medicine is good, the service is excellent, and the doctor is friendly.",
        "time": "a year ago"
      },
      {
        "authorName": "sitiiraida rahmat",
        "rating": 5,
        "text": "Thank God, my child and my mother-in-law are very well treated here. 🥰🤲",
        "time": "8 months ago"
      },
      {
        "authorName": "triyanti ranna",
        "rating": 5,
        "text": "Doctor, I have a problem with acne that flares up on and off. Can I consult here?",
        "time": "a year ago"
      },
      {
        "authorName": "Arul Gunadi",
        "rating": 5,
        "text": "Doctor, can I get treatment for toothache here?",
        "time": "a year ago"
      }
    ]
  },


  "rafsa-therapy-puncak-bogor-khusus-pelayanan-homecare": {
    "name": "Rafsa Therapy Puncak Bogor ( Khusus Pelayanan Homecare )",
    "category": "Klinik Terapi",
    "city": "cisarua",
    "rating": 5.0,
    "reviewCount": 243,
    "phone": "+62 857-1123-5265",
    "address": "Cisarua (Burujul kavling, Cisarua, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16750, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=16308603640028916526&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285711235265",
    "tagline": "Layanan Homecare Terapi Profesional di Puncak Bogor",
    "iconEmoji": "💆‍♀️",
    "doctor": {
      "name": "Dr. Sarah Fitri",
      "role": "Fisioterapis Senior",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya mengalami nyeri punggung bawah setelah beraktivitas berat, apakah ada saran?",
        "doctor": "Tentu, nyeri punggung bawah bisa disebabkan oleh beberapa faktor. Untuk penanganan awal, Anda bisa mencoba kompres hangat, istirahat cukup, dan menghindari posisi yang memperparah nyeri. Jika nyeri berlanjut, kami sarankan untuk melakukan konsultasi lebih lanjut agar bisa diberikan penanganan yang tepat, seperti terapi fisik.",
        "recommendationTitle": "Penanganan Nyeri Punggung Bawah",
        "recommendationDesc": "Nyeri punggung bawah seringkali mereda dengan istirahat dan penanganan mandiri. Namun, jika nyeri persisten atau memburuk, terapi fisik dapat membantu memperkuat otot inti dan meningkatkan fleksibilitas untuk mengurangi ketidaknyamanan."
      }
    },
    "categories": [
      "Terapi Fisik",
      "Homecare",
      "Fisioterapi",
      "Kesehatan"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Homecare Fisioterapi Umum",
        "desc": "Layanan fisioterapi komprehensif di rumah untuk pemulihan pasca cedera, stroke, atau kondisi muskuloskeletal.",
        "price": "Mulai Rp 350.000",
        "category": "Fisioterapi"
      },
      {
        "id": 2,
        "name": "Terapi Nyeri Kronis",
        "desc": "Penanganan khusus untuk nyeri punggung, leher, sendi, dan kondisi nyeri kronis lainnya.",
        "price": "Mulai Rp 400.000",
        "category": "Fisioterapi"
      },
      {
        "id": 3,
        "name": "Rehabilitasi Pasca-Operasi",
        "desc": "Program rehabilitasi yang disesuaikan untuk mempercepat pemulihan setelah operasi.",
        "price": "Mulai Rp 450.000",
        "category": "Rehabilitasi"
      },
      {
        "id": 4,
        "name": "Terapi Geriatri",
        "desc": "Fisioterapi yang berfokus pada peningkatan mobilitas dan kualitas hidup lansia.",
        "price": "Mulai Rp 350.000",
        "category": "Fisioterapi"
      },
      {
        "id": 5,
        "name": "Pijat Terapi Relaksasi",
        "desc": "Pijat khusus untuk relaksasi otot, mengurangi ketegangan, dan meningkatkan sirkulasi.",
        "price": "Mulai Rp 300.000",
        "category": "Terapi"
      }
    ],
    "reviews": [
      {
        "authorName": "Majd Hasan",
        "rating": 5,
        "text": "Its the best ...really it make me so comfortable",
        "time": "3 months ago"
      },
      {
        "authorName": "Popi Leni Kurniawati",
        "rating": 5,
        "text": "Ontime, profesional, fleksibel, good service. Recommended",
        "time": "9 months ago"
      },
      {
        "authorName": "Ali Mohammed",
        "rating": 5,
        "text": "Very skillful, friendly and has helped my shoulder pain alot, very reasonable price",
        "time": "10 months ago"
      },
      {
        "authorName": "Espe",
        "rating": 5,
        "text": "It was a good treatment , looking forward to another treatment later",
        "time": "a year ago"
      },
      {
        "authorName": "Keluarga Matius Ginting",
        "rating": 5,
        "text": "good",
        "time": "6 months ago"
      }
    ]
  },


  "ahli-gigi-cisarua": {
    "name": "Ahli gigi cisarua",
    "category": "Klinik Gigi",
    "city": "cisarua",
    "rating": 4.6,
    "reviewCount": 22,
    "phone": "+62 877-0196-0114",
    "address": "Jl. Raya Puncak - Gadog No.81, Cibeureum, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16750, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=10459684384412478420&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6287701960114",
    "tagline": "Pakar gigi terpercaya untuk senyum sehat Anda di Cisarua.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Drg. Viki",
      "role": "Dokter Gigi Umum",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, gigi saya sakit sekali, seperti ada lubang.",
        "doctor": "Baik, mari kita periksa untuk mengetahui penyebabnya dan rencana perawatan terbaik.",
        "recommendationTitle": "Cek Kesehatan Gigi & Konsultasi",
        "recommendationDesc": "Kami akan melakukan pemeriksaan menyeluruh untuk mendiagnosis masalah gigi Anda dan memberikan solusi terbaik."
      }
    },
    "categories": [
      "Klinik Gigi",
      "Dokter Gigi",
      "Perawatan Gigi",
      "Pembersihan Karang Gigi",
      "Cabut Gigi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pembersihan Karang Gigi",
        "desc": "Membersihkan plak dan karang gigi untuk mencegah masalah gusi dan gigi berlubang.",
        "price": "Mulai dari Rp 150.000",
        "category": "Perawatan Preventif"
      },
      {
        "id": 2,
        "name": "Penambalan Gigi",
        "desc": "Mengisi gigi berlubang untuk mengembalikan fungsi dan estetik gigi.",
        "price": "Mulai dari Rp 200.000",
        "category": "Perawatan Restoratif"
      },
      {
        "id": 3,
        "name": "Pencabutan Gigi",
        "desc": "Prosedur pencabutan gigi yang sudah tidak dapat dipertahankan.",
        "price": "Mulai dari Rp 100.000",
        "category": "Perawatan Bedah Minor"
      },
      {
        "id": 4,
        "name": "Konsultasi Dokter Gigi",
        "desc": "Pemeriksaan umum dan saran ahli untuk kesehatan gigi dan mulut Anda.",
        "price": "Gratis (dengan perawatan)",
        "tag": "Populer",
        "category": "Layanan Konsultasi"
      }
    ],
    "reviews": [
      {
        "authorName": "Tita Andana",
        "rating": 1,
        "text": "Is this still open? Can I make rabbit teeth?",
        "time": "4 months ago"
      },
      {
        "authorName": "Siti hodijah",
        "rating": 4,
        "text": "I want to ask, how much does it cost to clean tartar before going, doc? I'm afraid I won't have enough money when I go there.",
        "time": "a year ago"
      },
      {
        "authorName": "Setia ningsih",
        "rating": 4,
        "text": "Can you clean tartar and pull out teeth that are almost gone?",
        "time": "a year ago"
      },
      {
        "authorName": "Ali Adnan",
        "rating": 5,
        "text": "Thank you, sis, friendly prices, fast installation, and the results are as expected, Viki Dental is a top dental expert.",
        "time": "2 years ago"
      },
      {
        "authorName": "Kosasih K",
        "rating": 5,
        "text": "The place is clean....very good service...thank you",
        "time": "4 years ago"
      }
    ]
  },


  "klinik-seulanga": {
    "name": "Klinik Seulanga",
    "category": "Klinik Gigi",
    "city": "cibinong",
    "rating": 5.0,
    "reviewCount": 28,
    "phone": "+62 851-7989-8303",
    "address": "Jl. HR. Lukman No.34B, Cirimekar, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16917, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=5337856313018979344&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285179898303",
    "tagline": "Klinik Gigi terpercaya dengan layanan BPJS dan dokter yang ramah.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Dr. Rizal",
      "role": "Dokter Gigi Umum",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo dok, saya ingin konsultasi scaling gigi. Apakah bisa menggunakan BPJS?",
        "doctor": "Tentu, silakan datang untuk pemeriksaan awal. Scaling gigi dan penambalan bisa menggunakan BPJS di sini.",
        "recommendationTitle": "Layanan Dokter Rizal",
        "recommendationDesc": "Dr. Rizal dikenal sangat ramah, teliti, dan komunikatif, bahkan bagi pasien BPJS. Banyak ulasan positif tentang keramahannya saat melakukan pencabutan, scaling, dan penambalan gigi."
      }
    },
    "categories": [
      "Klinik Gigi",
      "BPJS",
      "Pencabutan Gigi",
      "Scaling Gigi",
      "Penambalan Gigi",
      "Kesehatan Gigi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan dan Konsultasi Gigi",
        "desc": "Pemeriksaan kondisi gigi dan mulut, serta konsultasi rencana perawatan.",
        "price": "Gratis (dengan BPJS)",
        "category": "Layanan Umum"
      },
      {
        "id": 2,
        "name": "Pencabutan Gigi (BPJS)",
        "desc": "Layanan pencabutan gigi dengan fasilitas BPJS.",
        "price": "Gratis (dengan BPJS)",
        "tag": "Populer",
        "category": "Perawatan Gigi"
      },
      {
        "id": 3,
        "name": "Scaling Gigi (BPJS)",
        "desc": "Pembersihan karang gigi untuk menjaga kebersihan dan kesehatan mulut.",
        "price": "Gratis (dengan BPJS)",
        "tag": "Rekomendasi",
        "category": "Perawatan Gigi"
      },
      {
        "id": 4,
        "name": "Penambalan Gigi (BPJS)",
        "desc": "Penambalan gigi berlubang untuk mengembalikan fungsi dan estetika gigi.",
        "price": "Gratis (dengan BPJS)",
        "category": "Perawatan Gigi"
      }
    ],
    "reviews": [
      {
        "authorName": "Saroni Roni",
        "rating": 5,
        "text": "good",
        "time": "a year ago"
      },
      {
        "authorName": "Muhammad Reza Hakiki",
        "rating": 5,
        "text": "Having a tooth pulled using BPJS here is highly recommended. Dr. Rizal is very kind and friendly even though you use BPJS. The staff are all friendly and informative.",
        "time": "2 months ago"
      },
      {
        "authorName": "Raihanah",
        "rating": 5,
        "text": "The male dentist is really good, I had my tooth pulled in just 5 minutes. Wow, that's really cool even though I'm wearing braces! #raihanahapproved #recommended 😊😊😊",
        "time": "5 months ago"
      },
      {
        "authorName": "Adinda Azzahra",
        "rating": 5,
        "text": "The service is fast, the doctor and staff are also very friendly, even though we use BPJS, we still receive good service, thank you",
        "time": "5 months ago"
      },
      {
        "authorName": "Steven Vin",
        "rating": 5,
        "text": "Scaling and filling teeth here with Dr. Rizal, very kind, thorough, friendly. The fillings are free and covered by BPJS.",
        "time": "a month ago"
      }
    ]
  },


  "ratunaruby-skincare-clinic-cab-cikaret-cibinong": {
    "name": "Ratunaruby Skincare Clinic Cab. Cikaret Cibinong",
    "category": "Skincare Clinic",
    "city": "cibinong",
    "rating": 4.9,
    "reviewCount": 98,
    "phone": "+62 811-9138-448",
    "address": "RUKO NIRWANA ESTATE, Jl. Raya Cikaret No.1 blok B, Pakansari, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16916, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=8564879221001294925&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628119138448",
    "tagline": "Pusat perawatan kulit terbaik untuk tampil percaya diri.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Amelia Putri",
      "role": "Dokter Kecantikan",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, kulit saya terlihat kusam dan kurang glowing. Ada saran treatment?",
        "doctor": "Untuk kulit kusam dan kurang glowing, kami merekomendasikan treatment brightening facial yang dipadukan dengan serum vitamin C. Ini akan membantu mencerahkan dan menyegarkan kulit Anda.",
        "recommendationTitle": "Rekomendasi Perawatan Kulit Kusam dan Kurang Glowing",
        "recommendationDesc": "Brightening facial dan serum vitamin C untuk mencerahkan dan menyegarkan kulit."
      }
    },
    "categories": [
      "Skincare Clinic",
      "Beauty Clinic",
      "Dermatology",
      "Facial Treatment",
      "Acne Treatment"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Basic Facial",
        "desc": "Pembersihan mendalam, eksfoliasi, pijat wajah, masker, dan pelembap.",
        "price": "Rp 150.000",
        "tag": "Terlaris",
        "category": "Facial"
      },
      {
        "id": 2,
        "name": "Acne Treatment",
        "desc": "Perawatan khusus untuk kulit berjerawat, termasuk ekstraksi komedo dan masker anti-jerawat.",
        "price": "Rp 250.000",
        "tag": "Populer",
        "category": "Treatment"
      },
      {
        "id": 3,
        "name": "Brightening Facial",
        "desc": "Facial yang berfokus untuk mencerahkan kulit kusam dan meratakan warna kulit.",
        "price": "Rp 200.000",
        "category": "Facial"
      },
      {
        "id": 4,
        "name": "Serum Vitamin C",
        "desc": "Serum dengan kandungan Vitamin C tinggi untuk antioksidan dan mencerahkan kulit.",
        "price": "Rp 180.000",
        "category": "Produk Skincare"
      }
    ],
    "reviews": [
      {
        "authorName": "Nurbaety Asshobary",
        "rating": 5,
        "text": "Good treatment and most excited,thank you @Ratuna Ruby skincare.",
        "time": "2 years ago"
      },
      {
        "authorName": "Chandra Ayu",
        "rating": 5,
        "text": "Good place for treatment with affordable price✨✨",
        "time": "2 years ago"
      },
      {
        "authorName": "Kayla Ramadhani",
        "rating": 5,
        "text": "The product is really good, it gives a very fast change to the skin, the treatment is also good and there are lots of promotions every day with affordable prices, the nurses and doctors are friendly, fun, and cool♥️",
        "time": "a year ago"
      },
      {
        "authorName": "Harleni putri Putri",
        "rating": 5,
        "text": "Ratunaruby Skincare klinik kecantikan yang sangat sangat bagusss, pelayanan yg sangat ramah dan baik..banyak pilihan untuk treatment dan diberitahukan sesuai dengan keadaan kulit....produk dengan kualitas yg sangat sangat bagusss cocok untuk dipakai remaja maupun ibu ibu dan yg lainyaa",
        "time": "a year ago"
      },
      {
        "authorName": "Kharisma Yunita",
        "rating": 5,
        "text": "The service is great👍🏻 the prices are affordable, the ladies are also nice",
        "time": "6 months ago"
      }
    ]
  },


  "klinik-alya-medika": {
    "name": "Klinik Alya Medika",
    "category": "Klinik Umum",
    "city": "Cibinong",
    "rating": 4.5,
    "reviewCount": 22,
    "phone": "+62 21 29230758",
    "address": "Jl. Lan Bau No.18, Sentul, Kec. Babakan Madang, Kabupaten Bogor, Jawa Barat 16810, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=2778109803736081890&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin-Minggu: 07:00 - 21:00 (Jam bisa bervariasi)",
    "waNumber": "622129230758",
    "tagline": "Pelayanan kesehatan keluarga terpercaya dengan dokter ramah dan fasilitas lengkap.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dr. Ayu Lestari",
      "role": "Dokter Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://example.com/dr_ayu.png",
      "sampleChat": {
        "user": "Dok, saya demam dan batuk sudah 3 hari, apakah perlu datang untuk periksa?",
        "doctor": "Halo, dengan gejala yang Anda alami, sangat disarankan untuk datang agar dokter bisa melakukan pemeriksaan fisik dan menentukan diagnosis serta penanganan yang tepat. Apakah Anda bisa datang hari ini?",
        "recommendationTitle": "Konsultasi Demam & Batuk",
        "recommendationDesc": "Saran untuk datang langsung ke klinik agar dokter dapat melakukan pemeriksaan fisik dan memberikan resep obat yang sesuai."
      }
    },
    "categories": [
      "Klinik Umum",
      "Kesehatan Keluarga",
      "BPJS",
      "Pemeriksaan Medis"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan dan konsultasi dengan dokter umum untuk berbagai keluhan kesehatan.",
        "price": "Mulai Rp 50.000",
        "category": "Layanan Utama"
      },
      {
        "id": 2,
        "name": "Pemeriksaan BPJS",
        "desc": "Layanan pemeriksaan kesehatan bagi peserta BPJS Kesehatan.",
        "price": "Sesuai ketentuan BPJS",
        "tag": "BPJS",
        "category": "Layanan Utama"
      },
      {
        "id": 3,
        "name": "Suntik Vitamin C",
        "desc": "Meningkatkan daya tahan tubuh dan menjaga kesehatan kulit.",
        "price": "Mulai Rp 100.000",
        "category": "Layanan Tambahan"
      },
      {
        "id": 4,
        "name": "Perawatan Luka",
        "desc": "Penanganan dan perawatan untuk berbagai jenis luka.",
        "price": "Mulai Rp 75.000",
        "category": "Layanan Tambahan"
      }
    ],
    "reviews": [
      {
        "authorName": "Sule Sulaeman",
        "rating": 5,
        "text": "Ok",
        "time": "3 years ago"
      },
      {
        "authorName": "Lisna Nalis",
        "rating": 1,
        "text": "Every time I go there, it's always closed... Even though the hours listed are 7:00 AM - 9:00 PM",
        "time": "5 months ago"
      },
      {
        "authorName": "Fukuri",
        "rating": 5,
        "text": "Berobat di sini dari masih SD sekarang udah mau punya anak, pas tau di sini nerima BPJS langsung pindah ke sini faskes nya. Buat minta rujukan sangat dimudahkan sekali apalagi dokter nya yang cewek itu komunikatif banget loh. Saran aja jam buka nya lebih diperjelas lagi dari jam berapa sampai jam berapa biar konsisten gitu soalnya pernah sekali mau berobat ternyata kliniknya tutup, untung nya deket dari rumah jadi ga masalah sih",
        "time": "3 years ago"
      },
      {
        "authorName": "Reyan Sa12",
        "rating": 1,
        "text": "It's bad, it's open from 18.00 until 19.00, the doctors haven't arrived yet, there's only 1 doctor, there's no other doctor",
        "time": "3 years ago"
      },
      {
        "authorName": "Zyolla Al'ryanova Rosfilon",
        "rating": 5,
        "text": "Sis, how much does an ultrasound cost?",
        "time": "3 years ago"
      }
    ]
  },


  "dmelz-clinic": {
    "name": "Dmelz Clinic",
    "category": "Klinik Kecantikan",
    "city": "cibinong",
    "rating": 5.0,
    "reviewCount": 86,
    "phone": "+62 851-2121-0052",
    "address": "Pakansari, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16915, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=13750207201505987231&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285121210052",
    "tagline": "Your trusted partner for healthy, radiant skin, with honest and personalized care.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dr. Melz",
      "role": "Dermatologis",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, kulit saya kusam dan sering berjerawat, saya bingung harus mulai dari mana.",
        "doctor": "Berdasarkan kondisi kulit Anda, kita akan fokus pada menyeimbangkan produksi minyak dan mengatasi peradangan. Saya sarankan Anda memulai dengan pembersih lembut dan serum dengan salicylic acid untuk mengatasi jerawat, serta pelembap non-komedogenik. Mari kita evaluasi setelah beberapa minggu.",
        "recommendationTitle": "Rekomendasi Skincare untuk Kulit Kusam dan Berjerawat",
        "recommendationDesc": "Fokus pada pembersihan lembut, eksfoliasi dengan BHA, dan hidrasi untuk menyeimbangkan kulit. Hindari produk yang terlalu keras dan perhatikan diet."
      }
    },
    "categories": [
      "Klinik Kecantikan",
      "Perawatan Kulit",
      "Dermatologi",
      "Estetika"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Kulit",
        "desc": "Pemeriksaan dan saran personal dari dokter kulit berpengalaman.",
        "price": "Mulai dari Rp 150.000",
        "category": "Layanan Utama"
      },
      {
        "id": 2,
        "name": "Facial Detoksifikasi",
        "desc": "Pembersihan mendalam untuk mengangkat kotoran dan racun dari kulit.",
        "price": "Mulai dari Rp 250.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Chemical Peeling Ringan",
        "desc": "Perawatan untuk mengatasi jerawat, noda hitam, dan meratakan tekstur kulit.",
        "price": "Mulai dari Rp 400.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 4,
        "name": "Microdermabrasi",
        "desc": "Eksfoliasi mekanis untuk kulit lebih halus dan cerah.",
        "price": "Mulai dari Rp 350.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 5,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan laser untuk peremajaan kulit, mengurangi garis halus dan flek.",
        "price": "Mulai dari Rp 750.000",
        "category": "Perawatan Khusus"
      }
    ],
    "reviews": [
      {
        "authorName": "winarti puji08",
        "rating": 5,
        "text": "Friends who've been here before say the doctor is honest and doesn't push things. At first, I thought every clinic said that. But after visiting myself, it turns out it's true. The consultation felt genuine, and the treatment was tailored to my actual skin condition.",
        "time": "2 months ago"
      },
      {
        "authorName": "Nandi Saputra",
        "rating": 5,
        "text": "I came here for the first time because my skin was starting to have issues and I didn't know where to start. The doctor explained my skin condition in detail and gave me sensible recommendations, not ones that would benefit the clinic the most. The prices are affordable and the location is comfortable.",
        "time": "4 months ago"
      },
      {
        "authorName": "Dyan Asri",
        "rating": 5,
        "text": "I brought my mother, who had long wanted to try skincare but was always worried about being forced to buy expensive products. At Dmelz, those concerns were unfounded. The doctor was very patient and her explanations were easy to understand, even for a layperson. My mother felt comfortable.",
        "time": "4 months ago"
      },
      {
        "authorName": "Nurna fisa Ibra",
        "rating": 5,
        "text": "I came here for the first time with many questions and concerns about skin care. The doctor answered all my questions patiently and clearly. Not a single question felt like it was being answered with the intention of selling something. It was a pleasant experience.",
        "time": "2 months ago"
      },
      {
        "authorName": "Kesmi Qmoy",
        "rating": 5,
        "text": "We came here with a friend after a long planning. We both have different skin concerns, and the doctor explained our conditions differently. The results were different, but we were both satisfied. What we liked most was that there was no pressure to upgrade anything.",
        "time": "4 months ago"
      }
    ]
  },


  "natasha-skin-clinic-cibinong": {
    "name": "Natasha Skin Clinic Cibinong",
    "category": "Klinik Kecantikan",
    "city": "Cibinong",
    "rating": 4.9,
    "reviewCount": 495,
    "phone": "+62 811-2988-478",
    "address": "Jl. Cibinong City Center Blk. B No.2 & 3A, Pakansari, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16915, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=10452960079649189971&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628112988478",
    "tagline": "Solusi perawatan kulit terbaik untuk kecantikan alami Anda.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Sarah Wijaya",
      "role": "Dermatologis Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Kulit saya terlihat kusam dan banyak noda hitam, Dok. Ada rekomendasi perawatan?",
        "doctor": "Tentu, setelah pemeriksaan kami akan merekomendasikan perawatan pencerah kulit dan laser untuk noda hitam yang efektif.",
        "recommendationTitle": "Rekomendasi Perawatan Pencerah Kulit & Laser",
        "recommendationDesc": "Untuk mengatasi kulit kusam dan noda hitam, kami sarankan kombinasi perawatan pencerah kulit yang menutrisi serta terapi laser khusus untuk menghilangkan pigmentasi. Ini akan membantu kulit Anda terlihat lebih cerah dan merata."
      }
    },
    "categories": [
      "Klinik Kecantikan",
      "Perawatan Kulit",
      "Dermatologi",
      "Estetika"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Basic Facial",
        "desc": "Perawatan wajah dasar untuk membersihkan, menyegarkan, dan menutrisi kulit.",
        "price": "Rp 250.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Acne Treatment",
        "desc": "Perawatan khusus untuk kulit berjerawat, mengurangi inflamasi dan mencegah timbulnya jerawat baru.",
        "price": "Rp 350.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Brightening Peel",
        "desc": "Chemical peel untuk mencerahkan kulit kusam dan meratakan warna kulit.",
        "price": "Rp 400.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 4,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan laser untuk peremajaan kulit, mengurangi kerutan halus dan memperbaiki tekstur kulit.",
        "price": "Rp 800.000",
        "category": "Perawatan Laser"
      },
      {
        "id": 5,
        "name": "Konsultasi Dokter",
        "desc": "Sesi konsultasi dengan dokter spesialis kulit untuk mendiagnosis dan merencanakan perawatan.",
        "price": "Rp 150.000",
        "category": "Layanan Lain"
      }
    ],
    "reviews": [
      {
        "authorName": "Maria Vencentcia",
        "rating": 5,
        "text": "friendly and good service",
        "time": "2 months ago"
      },
      {
        "authorName": "Lidya Latif",
        "rating": 5,
        "text": "Everything good here, from the cs, doc Natasha the best deh, beautician. Thanks",
        "time": "2 years ago"
      },
      {
        "authorName": "Nisa Fathia Rahma",
        "rating": 5,
        "text": "Clean place, friendly doctor and helpful staffs!",
        "time": "a year ago"
      },
      {
        "authorName": "cahaya rizky",
        "rating": 5,
        "text": "Best clinic for treatment, the staff and doctor very humble. The place comfortable and clean!",
        "time": "a year ago"
      },
      {
        "authorName": "ria trisna",
        "rating": 5,
        "text": "Good service. Recommended for me time n self love :)",
        "time": "a year ago"
      }
    ]
  },


  "dokter-gigi-permata-cibinong": {
    "name": "DOKTER GIGI PERMATA - CIBINONG",
    "category": "Klinik Gigi",
    "city": "Cibinong",
    "rating": 4.8,
    "reviewCount": 550,
    "phone": "+62 812-1111-2194",
    "address": "Cibinong, Ruko Graha, Jl. Raya Bogor No.KM 43 Blok A5, Cirimekar, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16917, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=5216937119224697413&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin-Sabtu: 09.00-20.00, Minggu: Tutup",
    "waNumber": "6281211112194",
    "tagline": "Senyum sehat dan cerah bersama Dokter Gigi Permata.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Dr. Permata Sari",
      "role": "Dokter Gigi Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://example.com/dr_permata.jpg",
      "sampleChat": {
        "user": "Dok, gigi saya terasa ngilu saat minum dingin.",
        "doctor": "Berdasarkan gejala yang Anda rasakan, kemungkinan besar Anda mengalami sensitivitas gigi. Ada beberapa penyebabnya, seperti erosi email gigi atau gusi yang menurun. Untuk penanganan lebih lanjut, sebaiknya Anda datang untuk pemeriksaan.",
        "recommendationTitle": "Sensitivitas Gigi",
        "recommendationDesc": "Rekomendasi kami adalah menggunakan pasta gigi khusus untuk gigi sensitif dan menghindari makanan/minuman terlalu panas atau dingin. Jika rasa ngilu berlanjut, kami sarankan pemeriksaan langsung untuk diagnosis akurat."
      }
    },
    "categories": [
      "Klinik Gigi",
      "Dokter Gigi",
      "Kesehatan Gigi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pembersihan Karang Gigi (Scaling)",
        "desc": "Pembersihan karang gigi untuk menjaga kesehatan gusi dan mencegah peradangan.",
        "price": "Rp 250.000",
        "category": "Perawatan Preventif"
      },
      {
        "id": 2,
        "name": "Penambalan Gigi",
        "desc": "Penambalan gigi berlubang dengan bahan komposit berkualitas.",
        "price": "Mulai Rp 300.000",
        "category": "Restorasi Gigi"
      },
      {
        "id": 3,
        "name": "Pencabutan Gigi",
        "desc": "Pencabutan gigi yang sudah tidak dapat dipertahankan atau gigi bungsu.",
        "price": "Mulai Rp 400.000",
        "category": "Bedah Minor"
      },
      {
        "id": 4,
        "name": "Bleaching Gigi (Pemutihan)",
        "desc": "Prosedur pemutihan gigi untuk mengembalikan warna gigi yang lebih cerah.",
        "price": "Rp 1.500.000",
        "tag": "Populer",
        "category": "Estetika Gigi"
      }
    ],
    "reviews": [
      {
        "authorName": "PUTRI AGIL",
        "rating": 5,
        "text": "good facility, perfect ambience, and profesional hand, best bangett❤️✨",
        "time": "a month ago"
      },
      {
        "authorName": "Jemy Akvianto",
        "rating": 5,
        "text": "time so fast leaving, since 2019, this place is choices one in Bogor district. Quality, Cost very affordable and... friendly doctor and staff also. if you ask know how about the knowledge, the doctor explain very systemic.  recommended place if you want to take care your teeth and mouth. Go Ahead.. thanks you",
        "time": "4 years ago"
      },
      {
        "authorName": "Sofii Amaliaa",
        "rating": 1,
        "text": "Really bad attitude for the doctor and staffs. They overcharge my sister and treat badly on BPJS patient. The staffs are not friendly too. Their rotgen result was soo awful that they put it on plastic drugs and make it even worse!!!!! Dear the owner, please put much work on your buissness.",
        "time": "5 years ago"
      },
      {
        "authorName": "risky mixer",
        "rating": 5,
        "text": "Nice,good n clean",
        "time": "2 months ago"
      },
      {
        "authorName": "Panji Herlambang",
        "rating": 5,
        "text": "Good service, good ambiance",
        "time": "3 months ago"
      }
    ]
  },


  "ratuna-cifos-by-ratunaruby-skincare": {
    "name": "Ratuna Cifos by Ratunaruby Skincare",
    "category": "Klinik Kecantikan",
    "city": "ciawi gadog",
    "rating": 5.0,
    "reviewCount": 22,
    "phone": "+62 811-1908-448",
    "address": "Cifos, Jl. Raya Puncak No.477, Bendungan, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=10242511449623002696&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin-Sabtu: 10.00-19.00",
    "waNumber": "628111908448",
    "tagline": "Solusi perawatan kulit terbaik untuk kecantikan alami Anda.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Ratuna",
      "role": "Pakar Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://example.com/dr_ratuna_avatar.jpg",
      "sampleChat": {
        "user": "Halo Dokter, saya punya kulit sensitif dan mencari perawatan wajah yang lembut. Apa yang bisa Dokter rekomendasikan?",
        "doctor": "Halo! Untuk kulit sensitif, saya sangat merekomendasikan Calming Hydro Facial kami. Perawatan ini menggunakan bahan-bahan alami untuk melembapkan dan menenangkan kulit Anda tanpa iritasi. Kita juga bisa melakukan patch test terlebih dahulu untuk memastikan kecocokan.",
        "recommendationTitle": "Calming Hydro Facial",
        "recommendationDesc": "Perawatan wajah lembut yang dirancang untuk menghidrasi dan menenangkan kulit sensitif, mengurangi kemerahan dan iritasi. Menggunakan bahan-bahan alami dan hipoalergenik."
      }
    },
    "categories": [
      "Perawatan Wajah",
      "Klinik Kulit",
      "Spa Kecantikan",
      "Skincare"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Calming Hydro Facial",
        "desc": "Perawatan wajah yang menenangkan untuk kulit sensitif, melembapkan dan mengurangi kemerahan.",
        "price": "Rp250.000",
        "tag": "Populer",
        "category": "Perawatan Wajah",
        "imageUrl": "https://example.com/calming_hydro_facial.jpg"
      },
      {
        "id": 2,
        "name": "Brightening Laser Treatment",
        "desc": "Perawatan laser untuk mencerahkan kulit dan mengurangi noda hitam.",
        "price": "Rp750.000",
        "category": "Perawatan Wajah",
        "imageUrl": "https://example.com/brightening_laser.jpg"
      },
      {
        "id": 3,
        "name": "Acne Clear Peel",
        "desc": "Peeling khusus untuk mengatasi masalah jerawat dan kulit berminyak.",
        "price": "Rp400.000",
        "category": "Perawatan Wajah",
        "imageUrl": "https://example.com/acne_clear_peel.jpg"
      },
      {
        "id": 4,
        "name": "Konsultasi dengan Pakar Estetika",
        "desc": "Konsultasi mendalam dengan pakar estetika untuk rencana perawatan personal.",
        "price": "Rp100.000",
        "category": "Layanan Umum"
      }
    ],
    "reviews": [
      {
        "authorName": "Ardhita Zulhis Prihandini",
        "rating": 5,
        "text": "Friendly staffs, new building better 👍👍",
        "time": "a year ago"
      },
      {
        "authorName": "Shelly Satriani",
        "rating": 5,
        "text": "Comfortable. Good service. Meticulous and detailed work. First time trying a facial treatment. I was moved by my age, 51. I want to continue here. Hopefully, it's a good fit.",
        "time": "a year ago"
      },
      {
        "authorName": "keanu hasya tv",
        "rating": 5,
        "text": "A comfortable, friendly beauty clinic with affordable prices and lots of promotions. Ample parking.",
        "time": "7 months ago"
      },
      {
        "authorName": "Rizik Aswin",
        "rating": 5,
        "text": "The first time I came here, I was welcomed well by the staff. The service was very good, the place was clean and the prices weren't too expensive. I will definitely come here again.",
        "time": "7 months ago"
      },
      {
        "authorName": "Ai Harmilah",
        "rating": 5,
        "text": "During my treatment at Ratuna, thank God it was good and very satisfying, the results were also very good.",
        "time": "7 months ago"
      }
    ]
  },


  "klinik-gadog-dokter-24-jam": {
    "name": "KLINIK GADOG DOKTER 24 JAM",
    "category": "Klinik Medis",
    "city": "ciawi gadog",
    "rating": 4.6,
    "reviewCount": 13,
    "phone": "+62 812-8828-2820",
    "address": "Jl. Cikopo Sel., RT.05/RW.03, Gadog, Kec. Megamendung, Kabupaten Bogor, Jawa Barat 16770, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=13495378042167180260&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281288282820",
    "tagline": "Pusat Kesehatan Terpercaya untuk Kebutuhan Medis Anda 24 Jam",
    "iconEmoji": "🩺",
    "doctor": {
      "name": "Dr. Budi Santoso",
      "role": "Dokter Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo dokter, saya merasa demam dan batuk sejak kemarin. Apakah saya perlu datang langsung ke klinik?",
        "doctor": "Selamat pagi. Untuk mendapatkan diagnosis dan penanganan yang tepat, sebaiknya Anda segera datang ke klinik agar bisa diperiksa langsung. Kami buka 24 jam.",
        "recommendationTitle": "Kunjungan Langsung untuk Diagnosis Akurat",
        "recommendationDesc": "Direkomendasikan untuk segera mengunjungi klinik agar dokter dapat melakukan pemeriksaan fisik dan menentukan penanganan yang sesuai untuk demam dan batuk Anda."
      }
    },
    "categories": [
      "Klinik Umum",
      "Pelayanan 24 Jam",
      "Dokter Keluarga",
      "Kesehatan Primer"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan Dokter Umum",
        "desc": "Konsultasi dan pemeriksaan oleh dokter umum",
        "price": "Rp 80.000",
        "category": "Pelayanan Dasar"
      },
      {
        "id": 2,
        "name": "Pemberian Vaksin",
        "desc": "Berbagai jenis vaksinasi untuk anak dan dewasa",
        "price": "Mulai Rp 150.000",
        "category": "Vaksinasi"
      },
      {
        "id": 3,
        "name": "Perawatan Luka",
        "desc": "Pembersihan dan penanganan luka ringan hingga sedang",
        "price": "Mulai Rp 75.000",
        "category": "Tindakan Medis"
      },
      {
        "id": 4,
        "name": "Infus Vitamin C",
        "desc": "Pemberian infus vitamin C untuk daya tahan tubuh",
        "price": "Rp 200.000",
        "tag": "Populer",
        "category": "Terapi Suportif"
      },
      {
        "id": 5,
        "name": "Pembersihan Telinga",
        "desc": "Prosedur membersihkan kotoran telinga oleh tenaga medis profesional",
        "price": "Rp 100.000",
        "category": "Perawatan Khusus"
      }
    ],
    "reviews": [
      {
        "authorName": "Muhammad Farid Zaki",
        "rating": 5,
        "text": "There's an internist, sorry, I forgot his name. He took me to the emergency room. Good luck, bro, and your clinic 🙏",
        "time": "5 months ago"
      },
      {
        "authorName": "Fariz Risqiansyah",
        "rating": 5,
        "text": "Sorry, can you check/clean your ears here?",
        "time": "8 months ago"
      },
      {
        "authorName": "Mas Ciawi",
        "rating": 1,
        "text": "the service is lacking",
        "time": "3 months ago"
      },
      {
        "authorName": "Dindaa Oktaa",
        "rating": 4,
        "text": "Can it be used for vitamin infusion?",
        "time": "11 months ago"
      },
      {
        "authorName": "Steve Alkahfi",
        "rating": 5,
        "text": "The clinic is comfortable and clean.... the nurses are friendly",
        "time": "7 years ago"
      }
    ]
  },


  "klinik-pratama-hayati-medika": {
    "name": "Klinik Pratama Hayati Medika",
    "category": "Clinic",
    "city": "ciawi gadog",
    "rating": 5.0,
    "reviewCount": 45,
    "phone": "+62 813-9200-0324",
    "address": "Jl. Raya Sukabumi Jl. Mayjen H.R. Edi Sukma No.10, RT.02/RW.08, Harjasari, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16138, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=322226685061308897&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281392000324",
    "tagline": "Layanan Medis Profesional dan Ramah untuk Keluarga Anda",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "dr. Budi Santoso",
      "role": "General Practitioner",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://example.com/dr_budi.jpg",
      "sampleChat": {
        "user": "Dok, saya demam dan batuk sudah 3 hari, badan pegal-pegal.",
        "doctor": "Baik, mari kita periksa lebih lanjut. Gejala yang Anda rasakan perlu evaluasi untuk menentukan penyebabnya. Apakah ada gejala lain seperti mual atau pusing?",
        "recommendationTitle": "Konsultasi Demam dan Batuk",
        "recommendationDesc": "Dokter akan melakukan pemeriksaan fisik dan mendiskusikan riwayat kesehatan Anda untuk diagnosis yang akurat."
      }
    },
    "categories": [
      "General Practice",
      "Medical Clinic",
      "Family Doctor",
      "Healthcare"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan Umum",
        "desc": "Konsultasi dan pemeriksaan kesehatan dasar oleh dokter umum.",
        "price": "Rp 75.000",
        "category": "Pelayanan Medis"
      },
      {
        "id": 2,
        "name": "Suntik Vitamin C",
        "desc": "Injeksi vitamin C untuk meningkatkan daya tahan tubuh dan vitalitas.",
        "price": "Rp 100.000",
        "category": "Pelayanan Medis"
      },
      {
        "id": 3,
        "name": "Pembersihan Telinga",
        "desc": "Prosedur irigasi telinga untuk membersihkan kotoran telinga yang menumpuk.",
        "price": "Rp 85.000",
        "category": "Pelayanan Medis"
      }
    ],
    "reviews": [
      {
        "authorName": "Fadhel Muhammad",
        "rating": 5,
        "text": "Friendly service, according to procedures, neat and clean premises. Recommended for medical treatment around Ciawi. Excellent service.",
        "time": "a year ago"
      },
      {
        "authorName": "Alfa I. Rabithah",
        "rating": 5,
        "text": "Good service, the doctor was very detailed and thorough in his examination. The clinic was clean and tidy.",
        "time": "a year ago"
      },
      {
        "authorName": "Nabila Lestari",
        "rating": 5,
        "text": "Excellent service, the doctor is very humble, the nurses are also very friendly, the place is comfortable and clean, the service is fast, and the treatment costs are affordable. I highly recommend getting treatment here. Always be successful, Pratama Hayati Medika Clinic.",
        "time": "a year ago"
      },
      {
        "authorName": "Muhamad Anggara Putra",
        "rating": 5,
        "text": "The service is really cool, like BCA Priority. Ear irrigation procedure, awesome!",
        "time": "2 years ago"
      },
      {
        "authorName": "Aulia Oktaviani",
        "rating": 5,
        "text": "The service is good, the staff and doctors are friendly, the place is comfortable, the explanations are detailed, and it's close to home too.",
        "time": "a year ago"
      }
    ]
  },


  "latika-beauty-care-ciawi": {
    "name": "Latika Beauty Care Ciawi",
    "category": "Beauty Clinic",
    "city": "ciawi gadog",
    "rating": 5.0,
    "reviewCount": 230,
    "phone": "+62 812-9511-0302",
    "address": "Seuseupan Jl. Kaum, RT.04/RW.07, Bendungan, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=642762298030020848&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281295110302",
    "tagline": "Your destination for radiant skin and personalized beauty care.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Ayu Lestari",
      "role": "Head Dermatologist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Kulit saya kusam dan sering berjerawat, apa ada perawatan yang cocok?",
        "doctor": "Tentu, kami bisa bantu. Berdasarkan deskripsi Anda, kami merekomendasikan facial detox dan serum pencerah untuk mengatasi kusam dan jerawat.",
        "recommendationTitle": "Facial Detox & Brightening Serum",
        "recommendationDesc": "Perawatan ini membersihkan pori-pori secara mendalam, mengurangi peradangan jerawat, dan mencerahkan kulit kusam."
      }
    },
    "categories": [
      "Skincare",
      "Facial Treatment",
      "Beauty",
      "Dermatology"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Detox",
        "desc": "Deep cleansing facial to remove impurities and toxins, leaving skin fresh.",
        "price": "Rp 150.000",
        "category": "Facial"
      },
      {
        "id": 2,
        "name": "Brightening Facial",
        "desc": "Treatment to lighten dark spots and even out skin tone for a radiant glow.",
        "price": "Rp 180.000",
        "category": "Facial"
      },
      {
        "id": 3,
        "name": "Acne Treatment",
        "desc": "Targeted therapy to reduce acne, inflammation, and prevent future breakouts.",
        "price": "Rp 200.000",
        "category": "Specialized Treatment"
      },
      {
        "id": 4,
        "name": "Microdermabrasion",
        "desc": "Exfoliation technique to improve skin texture, reduce fine lines, and sun damage.",
        "price": "Rp 250.000",
        "tag": "New",
        "category": "Advanced Treatment"
      }
    ],
    "reviews": [
      {
        "authorName": "Desta Zain",
        "rating": 5,
        "text": "I’ve been visiting Latika Ciawi regularly for facial treatments, and I’m always impressed by the quality of service. Kak Alma is an excellent therapist, professional, gentle, and attentive. Each session leaves my skin feeling refreshed and well cared for. Truly one of the best places for facial care.",
        "time": "11 months ago"
      },
      {
        "authorName": "Suci Agustina",
        "rating": 5,
        "text": "first experience treatment disini, verry recommended🤩🫰🫰",
        "time": "2 months ago"
      },
      {
        "authorName": "Ikke Nurjanah",
        "rating": 5,
        "text": "Ok bgttt recommended 🫰🏻",
        "time": "a year ago"
      },
      {
        "authorName": "Hafizh Rahmat",
        "rating": 5,
        "text": "matap",
        "time": "6 months ago"
      },
      {
        "authorName": "Sindy Arianty",
        "rating": 5,
        "text": "The service at Latika was very satisfying. The staff were friendly and helpful. The doctor's explanations were easy to understand. The waiting room, restrooms, treatment rooms, and other areas were comfortable. Thank you.",
        "time": "a month ago"
      }
    ]
  },


  "pratama-prima-clinic-24-hours": {
    "name": "Pratama Prima Clinic (24 hours)",
    "category": "Clinic",
    "city": "Bogor",
    "rating": 4.5,
    "reviewCount": 51,
    "phone": "+62 812-1401-5849",
    "address": "Jl. Pahlawan No.112, RT.01/RW.18, Bondongan, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=2144623239690196615&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "24 hours",
    "waNumber": "6281214015849",
    "tagline": "Your trusted 24-hour healthcare partner for all your medical needs.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dr. Nadia Putri",
      "role": "General Practitioner",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya merasa demam dan batuk sejak kemarin malam, apakah saya perlu datang ke klinik?",
        "doctor": "Halo! Berdasarkan gejala yang Anda alami, sebaiknya Anda segera datang untuk pemeriksaan lebih lanjut. Kami buka 24 jam dan siap membantu Anda.",
        "recommendationTitle": "Pentingnya Pemeriksaan Awal",
        "recommendationDesc": "Demam dan batuk bisa menjadi indikasi awal berbagai kondisi. Pemeriksaan oleh dokter dapat membantu diagnosis yang akurat dan penanganan yang tepat, terutama jika gejala memburuk atau tidak membaik."
      }
    },
    "categories": [
      "Klinik Umum",
      "Layanan Darurat 24 Jam",
      "Pemeriksaan Medis",
      "Vaksinasi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "General Consultation",
        "desc": "Pemeriksaan dan konsultasi menyeluruh dengan dokter umum.",
        "price": "Rp 80.000",
        "category": "Layanan Medis Umum"
      },
      {
        "id": 2,
        "name": "Emergency Care",
        "desc": "Penanganan cepat untuk kondisi medis darurat.",
        "price": "Bervariasi",
        "category": "Layanan Medis Darurat"
      },
      {
        "id": 3,
        "name": "Vaccination Services",
        "desc": "Pilihan vaksinasi untuk anak dan dewasa.",
        "price": "Mulai dari Rp 150.000",
        "category": "Layanan Kesehatan Preventif"
      },
      {
        "id": 4,
        "name": "Basic Laboratory Tests",
        "desc": "Pemeriksaan laboratorium dasar (tes darah, urin, dll.).",
        "price": "Mulai dari Rp 75.000",
        "category": "Layanan Diagnostik"
      }
    ],
    "reviews": [
      {
        "authorName": "Nata Kalana",
        "rating": 5,
        "text": "Very helpful when someone get sick very late night or during holiday when all doctors are closed",
        "time": "2 years ago"
      },
      {
        "authorName": "haiva muzdaliva",
        "rating": 5,
        "text": "fast respon",
        "time": "11 months ago"
      },
      {
        "authorName": "Kendi Ramadhan",
        "rating": 5,
        "text": "Good",
        "time": "9 years ago"
      },
      {
        "authorName": "Yuke Kkey Anggraeni",
        "rating": 5,
        "text": "I always get treatment here. Thank God, it's perfect. The doctors are friendly, the nurses and receptionists are also friendly, and the place is comfortable and clean. Always successful, Pratama Prima Clinic 🙌🏻",
        "time": "11 months ago"
      },
      {
        "authorName": "Meyta Rianoni (Mey)",
        "rating": 5,
        "text": "Friendly doctor The lady was quick to respond There's parking for motorbikes",
        "time": "a year ago"
      }
    ]
  },


  "wijaya-skin-care-bogor": {
    "name": "Wijaya Skin Care BOGOR",
    "category": "Klinik Kecantikan",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 1706,
    "phone": "+62 811-1920-5994",
    "address": "Jalan Sukasari No. 11B Baranangsiang, RT.04/RW.02, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=14103360788149138649&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281119205994",
    "tagline": "Pancarkan Kecantikan Alami Anda dengan Perawatan Kulit Terbaik.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Cantik Wijaya",
      "role": "Dokter Spesialis Kulit",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Kulit saya terlihat kusam dan sering muncul jerawat. Apa yang harus saya lakukan, Dok?",
        "doctor": "Tentu, kami bisa bantu. Berdasarkan keluhan Anda, kami merekomendasikan pemeriksaan kulit untuk menentukan perawatan terbaik, mungkin kombinasi facial detoksifikasi dan serum pencerah. Jangan ragu untuk konsultasi langsung!",
        "recommendationTitle": "Perawatan Kulit Kusam & Berjerawat",
        "recommendationDesc": "Kami sarankan kombinasi Facial Detoksifikasi untuk membersihkan pori-pori dan Serum Pencerah untuk mengurangi kusam. Konsultasikan dengan dokter kami untuk penyesuaian."
      }
    },
    "categories": [
      "Klinik Kecantikan",
      "Perawatan Kulit",
      "Facial",
      "Dermatologi",
      "Laser Treatment"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Acne Treatment",
        "desc": "Perawatan wajah khusus untuk kulit berjerawat, membersihkan pori-pori dan mengurangi inflamasi.",
        "price": "Rp 250.000",
        "category": "Facial"
      },
      {
        "id": 2,
        "name": "Brightening Infusion",
        "desc": "Infus pencerah kulit untuk hasil glowing dan merata.",
        "price": "Rp 400.000",
        "tag": "Populer",
        "category": "Infusion"
      },
      {
        "id": 3,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan laser untuk meremajakan kulit, mengurangi noda hitam dan garis halus.",
        "price": "Mulai dari Rp 750.000",
        "category": "Laser"
      },
      {
        "id": 4,
        "name": "Dermapen Treatment",
        "desc": "Terapi microneedling untuk stimulasi kolagen, perbaikan tekstur kulit dan bekas jerawat.",
        "price": "Rp 600.000",
        "category": "Medical Treatment"
      },
      {
        "id": 5,
        "name": "Chemical Peeling",
        "desc": "Eksfoliasi kimia untuk mengangkat sel kulit mati dan mencerahkan kulit.",
        "price": "Rp 350.000",
        "category": "Facial"
      }
    ],
    "reviews": [
      {
        "authorName": "Delia Luthfiany Dineshcara",
        "rating": 5,
        "text": "The service was excellent! Can’t wait for any treatments here",
        "time": "2 months ago"
      },
      {
        "authorName": "Widalia Pagun",
        "rating": 5,
        "text": "I used to come to Wijaya Platinum Clinic Bogor and another branch in Ciputat, near by my house hehe, and I Swear it, they always offered some good deals package better than others clinic. The place is so comfortable, clean and the music so calm. I took an A dermal infussion, will make me looks more glowing then before✨ Mba Mia is my therapist, she's very nice and polite, and the massage is amazing. I will definetly come back! And this place is very recommended if you concern about your face & skin because WPC has a lots of branch.",
        "time": "2 years ago"
      },
      {
        "authorName": "Dara Ayu Aprilia",
        "rating": 5,
        "text": "I have been a client since 2012. From this type of face 😭😱 to this 🥰☺️ Never changed my interest in another beauty clinic ever since. The doctor as well as the staff (beautician) knows how to deal with my skin condition. Informative, helpful, and satisfying in terms of answering my problems. Langganan satu keluarga juga dari dulu anyway😉. The good thing is, pindah lokasi kemanapun has your data and helps you even more. The face and shoulder massage during the facial is 10++ 🤩 Place: 🌟 🌟 🌟 🌟 🌟 Beautician: 🌟 🌟 🌟 🌟 🌟 Doctor: 🌟 🌟 🌟 🌟 🌟 Service: 🌟 🌟 🌟 🌟 🌟",
        "time": "2 years ago"
      },
      {
        "authorName": "Intan Vania Utami",
        "rating": 5,
        "text": "Recommended place for me time, great services and treatment. Get your skin glowing to boost your mental wellbeing 💕",
        "time": "2 years ago"
      },
      {
        "authorName": "Charisma Bhenia",
        "rating": 5,
        "text": "Been going here since last year only for facial treatmebt, but overall I couldn't recommend this clinic enough for its great service and professional care✨",
        "time": "2 years ago"
      }
    ]
  },


  "aha-beauty-clinic": {
    "name": "Aha Beauty Clinic",
    "category": "Klinik Kecantikan",
    "city": "Bogor",
    "rating": 4.8,
    "reviewCount": 285,
    "phone": "+62 812-8645-8686",
    "address": "Jl. Raya Pajajaran No.70L, RT.06/RW.13, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=12707945880189735559&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281286458686",
    "tagline": "Rona Cantikmu, Kepercayaan Diri Baru!",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Ayu Larasati",
      "role": "Dokter Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://example.com/dr-ayu-avatar.jpg",
      "sampleChat": {
        "user": "Dok, saya punya masalah kulit kusam dan banyak bekas jerawat. Apa ya yang paling cocok untuk saya?",
        "doctor": "Halo! Untuk masalah kulit kusam dan bekas jerawat, kami bisa merekomendasikan beberapa perawatan seperti Chemical Peeling atau Laser Rejuvenation. Tapi, alangkah baiknya jika kita lakukan konsultasi langsung dulu ya, agar saya bisa menganalisa kondisi kulit Anda dan memberikan rekomendasi yang paling tepat.",
        "recommendationTitle": "Konsultasi Kulit Personal",
        "recommendationDesc": "Dapatkan analisa mendalam dan rekomendasi perawatan yang disesuaikan dengan kebutuhan kulit unik Anda dari dokter ahli kami."
      }
    },
    "categories": [
      "Skincare",
      "Facial",
      "Laser Treatment",
      "Anti-Aging",
      "Acne Treatment"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Basic Facial",
        "desc": "Pembersihan mendalam untuk kulit sehat dan cerah.",
        "price": "Rp 150.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Acne Peel Treatment",
        "desc": "Perawatan khusus untuk mengurangi jerawat dan bekasnya.",
        "price": "Rp 350.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Laser Rejuvenation",
        "desc": "Mencerahkan kulit, menyamarkan noda hitam, dan meremajakan kulit.",
        "price": "Rp 750.000",
        "category": "Perawatan Laser"
      }
    ],
    "reviews": [
      {
        "authorName": "Taman Asghari",
        "rating": 2,
        "text": "It was my first time for Facial here the price was expensive but the one who do treatment she was friendly but looks like she doesn’t have experience.",
        "time": "a year ago"
      },
      {
        "authorName": "Akmalia Zahra",
        "rating": 5,
        "text": "Warm hospitality ❤️ Dokternya ramah, baik banget dan bener2 merekomendasikn what we need not only thinking about their profit. Cant wait to try your newest technology cause i always amazed with all treatment here😍",
        "time": "7 years ago"
      },
      {
        "authorName": "Surya Putra",
        "rating": 5,
        "text": "The best👍",
        "time": "8 months ago"
      },
      {
        "authorName": "maulidya agustina",
        "rating": 5,
        "text": "Best clinic in bogor!!",
        "time": "7 months ago"
      },
      {
        "authorName": "Bovit Halim",
        "rating": 5,
        "text": "feel comfort excelent service",
        "time": "7 years ago"
      }
    ]
  },


  "griya-assunnah-bogormetode-biomekanik-terapi-anak-berkebutuhankhusus-syarafkejepitlambung-gerd-bekam-ikhwan-akhwat": {
    "name": "Griya ASSUNNAH BOGOR(metode Biomekanik, terapi anak Berkebutuhankhusus,, syarafkejepit.lambung gerd ).bekam ikhwan akhwat",
    "category": "Klinik Terapi & Bekam",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 29,
    "phone": "",
    "address": "Jl. Danau Matana Gg. Tegal Mangga No.33, RT.02/RW.03, Tegallega, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16129, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=3227171454528650565&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281234567890",
    "tagline": "Pusat Terapi Biomekanik, Bekam, dan Penanganan Syaraf Kejepit",
    "iconEmoji": "🌿",
    "doctor": {
      "name": "Terapis Griya Assunnah",
      "role": "Terapis Biomekanik & Bekam",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo, saya sering sakit kepala dan pusing karena darah tinggi. Apakah ada terapi yang bisa membantu tanpa obat?",
        "doctor": "Tentu, kami memiliki terapi PAZ yang insya Allah dapat membantu mengatasi sakit kepala dan pusing akibat darah tinggi. Terapi ini non-medis dan non-invasif. Banyak pasien kami merasakan perbaikan signifikan. Apakah Anda ingin menjadwalkan konsultasi?",
        "recommendationTitle": "Terapi PAZ untuk Sakit Kepala dan Tekanan Darah Tinggi",
        "recommendationDesc": "Terapi PAZ berfokus pada perbaikan biomekanik tubuh untuk mengurangi keluhan seperti sakit kepala, pusing, dan membantu menstabilkan tekanan darah tanpa penggunaan obat. Metode ini aman dan efektif."
      }
    },
    "categories": [
      "Terapi Biomekanik",
      "Bekam",
      "Terapi Anak Berkebutuhan Khusus",
      "Syaraf Kejepit",
      "Gangguan Lambung/GERD"
    ],
    "menu": [],
    "reviews": [
      {
        "authorName": "Elvira Fahrunisa Budiyanti",
        "rating": 5,
        "text": "Thank God, my headache is gone, Masya Allah, thank you very much, finally I don't have to take medicine anymore, I feel sorry for my kidneys, with PAZ therapy and cupping, thank God my headache is gone and I can do my activities comfortably and well, thank you,,,",
        "time": "2 years ago"
      },
      {
        "authorName": "Arti Sholihat",
        "rating": 5,
        "text": "Thank God, my child couldn't walk. Therapy here made him able to. Masya Allah.",
        "time": "6 months ago"
      },
      {
        "authorName": "Yuyun Yuningsih",
        "rating": 5,
        "text": "With PAZ therapy, my dizziness caused by high blood pressure, thank God, was cured with PAZ therapy... the service is also very satisfying... basically Top Markotop.",
        "time": "4 years ago"
      },
      {
        "authorName": "malva alodia f",
        "rating": 5,
        "text": "My pinched nerve and asthma... were cured with Paz therapy. No medication, no equipment. Highly recommended... very friendly and sociable.",
        "time": "5 years ago"
      },
      {
        "authorName": "Devona Marincha",
        "rating": 5,
        "text": "One of the best cupping services I've ever had. GOOD service. Not stingy with knowledge. 👍🙏🤝🤝🤝 Thanks, uncle. May Allah SWT always make things easy for you.",
        "time": "3 years ago"
      }
    ]
  },


  "adivaa-skin-care-clinic": {
    "name": "Adivaa Skin Care Clinic",
    "category": "Klinik Kecantikan",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 150,
    "phone": "+62 878-7081-7600",
    "address": "Dekat Kampus IPB, Jl. Raya Dramaga No.26, Babakan, Kec. Dramaga, Kabupaten Bogor, Jawa Barat 16680, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=5362478352096519357&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJbyRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6287870817600",
    "tagline": "Klinik Kecantikan Terpercaya untuk Kulit Sehat Berkilau.",
    "iconEmoji": "🌸",
    "doctor": {
      "name": "Dr. Indah Sari",
      "role": "Dokter Estetika",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Kulit saya kusam dan banyak bekas jerawat, dok. Apa rekomendasi treatment yang cocok?",
        "doctor": "Berdasarkan kondisi kulit Anda, saya merekomendasikan kombinasi facial pencerah dan laser Pico untuk mengatasi kusam dan bekas jerawat. Ini akan membantu meratakan warna kulit dan memperbaiki tekstur.",
        "recommendationTitle": "Perawatan Komprehensif untuk Kulit Kusam dan Bekas Jerawat",
        "recommendationDesc": "Kombinasi facial pencerah dan laser Pico adalah solusi efektif untuk revitalisasi kulit. Facial akan membersihkan dan mencerahkan, sementara laser Pico menargetkan pigmentasi dan merangsang kolagen, menghasilkan kulit yang lebih cerah dan halus."
      }
    },
    "categories": [
      "Perawatan Kulit",
      "Klinik Kecantikan",
      "Facial",
      "Laser Treatment",
      "Skin Booster"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Pencerah",
        "desc": "Perawatan wajah untuk mencerahkan kulit kusam dan menyamarkan noda hitam.",
        "price": "Rp 150.000",
        "category": "Facial"
      },
      {
        "id": 2,
        "name": "Facial Jerawat",
        "desc": "Perawatan khusus untuk mengatasi jerawat dan mengurangi peradangan.",
        "price": "Rp 175.000",
        "category": "Facial"
      },
      {
        "id": 3,
        "name": "Microdermabrasi",
        "desc": "Eksfoliasi kulit untuk mengangkat sel kulit mati, membuat kulit lebih halus.",
        "price": "Rp 250.000",
        "category": "Treatment"
      },
      {
        "id": 4,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan laser untuk meremajakan kulit, mengurangi kerutan, dan meratakan warna kulit.",
        "price": "Rp 500.000",
        "category": "Treatment"
      },
      {
        "id": 5,
        "name": "Skin Booster",
        "desc": "Injeksi nutrisi untuk menghidrasi kulit secara mendalam dan meningkatkan elastisitas.",
        "price": "Rp 750.000",
        "category": "Treatment"
      },
      {
        "id": 6,
        "name": "Salmon DNA Treatment",
        "desc": "Perawatan regenerasi kulit dengan ekstrak DNA salmon untuk kulit lebih muda.",
        "price": "Rp 1.200.000",
        "category": "Treatment"
      },
      {
        "id": 7,
        "name": "Damage Facial",
        "desc": "Facial khusus untuk kulit yang rusak dan sensitif, membantu perbaikan dan pemulihan.",
        "price": "Rp 200.000",
        "category": "Facial"
      }
    ],
    "reviews": [
      {
        "authorName": "Nisa Nur Fitriani",
        "rating": 5,
        "text": "Good place..good experience 😍😍🤩",
        "time": "8 years ago"
      },
      {
        "authorName": "bilaa salsa",
        "rating": 5,
        "text": "really good, the service is super duper friendly, it was my first time having a facial and the ladies served me really well and gently, the aftermath was clean especially the blackheads, the ladies cleaned it with care 🥹💓",
        "time": "5 months ago"
      },
      {
        "authorName": "anisah anggraini",
        "rating": 5,
        "text": "The service is friendly, the place is comfortable, the doctor is also good, the treatment is also satisfying",
        "time": "5 months ago"
      },
      {
        "authorName": "Siti ririh Supartiani",
        "rating": 5,
        "text": "The facial and facial consultation were really nice, comfortable, and friendly. Overall, I recommend it to you guys🩷",
        "time": "2 months ago"
      },
      {
        "authorName": "Siti sarah",
        "rating": 5,
        "text": "I'm so happy after the treatment at Pratama Adivaa Clinic hihi auto glow up🥰🫶🏻 anyway I've tried the damage facial and skinbooster and salmon treatments hehehe auto glow up😍 you can check my video review on ig @itssitisarah 🫶🏻✨",
        "time": "a year ago"
      }
    ]
  },


  "new-lna-skin-health-clinic": {
    "name": "New LNA Skin Health Clinic",
    "category": "Beauty Clinic",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 658,
    "phone": "+62 812-8184-2036",
    "address": "Ruko Taman Yasmin Sektor VI No.72, RT.04/RW.09, Curugmekar, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16113, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=6533737436876740920&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281281842036",
    "tagline": "Your journey to healthy, radiant skin starts here.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Silvia",
      "role": "Dermatologist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya ingin kulit wajah yang lebih cerah dan bebas jerawat.",
        "doctor": "Tentu, kami dapat membantu Anda mencapai kulit impian. Setelah konsultasi, saya akan merekomendasikan perawatan yang paling sesuai dengan kondisi kulit Anda.",
        "recommendationTitle": "Perawatan Kulit Wajah Cerah & Bebas Jerawat",
        "recommendationDesc": "Kami menawarkan berbagai perawatan mulai dari facial, chemical peel, hingga laser untuk mengatasi masalah pigmentasi dan jerawat. Jadwalkan konsultasi untuk mendapatkan rencana perawatan personal."
      }
    },
    "categories": [
      "Skin Clinic",
      "Beauty Salon",
      "Dermatologist"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Basic",
        "desc": "Pembersihan wajah dasar untuk menjaga kesehatan kulit.",
        "price": "Rp 150.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Acne Therapy",
        "desc": "Perawatan khusus untuk kulit berjerawat, mengurangi inflamasi dan mencegah breakout.",
        "price": "Rp 250.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan laser untuk meremajakan kulit, mengurangi kerutan halus dan meningkatkan elastisitas.",
        "price": "Rp 700.000",
        "category": "Perawatan Laser"
      },
      {
        "id": 4,
        "name": "Chemical Peel",
        "desc": "Pengelupasan kimiawi untuk mengangkat sel kulit mati dan mencerahkan kulit.",
        "price": "Rp 400.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 5,
        "name": "Brightening Infusion",
        "desc": "Infus vitamin untuk mencerahkan kulit dan meningkatkan imunitas.",
        "price": "Rp 350.000",
        "category": "Perawatan Tubuh"
      }
    ],
    "reviews": [
      {
        "authorName": "Nida Mulyati",
        "rating": 5,
        "text": "Comfortable, clean, friendly place in its. special service for people who use wheelchairs to the 2nd floor. which is definitely the best.? 👍👍👍",
        "time": "3 years ago"
      },
      {
        "authorName": "Elsa",
        "rating": 5,
        "text": "Best beauty clinic and my fav doctor Neng Silvia is here💜💜",
        "time": "3 years ago"
      },
      {
        "authorName": "yudhi bahtiar permana",
        "rating": 5,
        "text": "Service all out,great experience",
        "time": "3 years ago"
      },
      {
        "authorName": "Irma Rosalina",
        "rating": 5,
        "text": "Nice place and good enviroment",
        "time": "3 years ago"
      },
      {
        "authorName": "Maelia",
        "rating": 5,
        "text": "good service 👍🏻 thankyouu",
        "time": "3 years ago"
      }
    ]
  },


  "ratuna-beauty-care": {
    "name": "Ratuna Beauty Care",
    "category": "Klinik Kecantikan",
    "city": "Bogor",
    "rating": 4.8,
    "reviewCount": 281,
    "phone": "+62 812-8556-9794",
    "address": "Ruko Taman Yasmin Sektor VI, RT.04/RW.09, Curugmekar, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16113, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=18082329543050031543&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281285569794",
    "tagline": "Your journey to radiant beauty starts here.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Ratuna",
      "role": "Dermatologist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya ingin tahu perawatan untuk kulit kusam dan berjerawat.",
        "doctor": "Tentu, kami memiliki berbagai perawatan yang bisa membantu. Untuk kulit kusam dan berjerawat, kami merekomendasikan facial detox dan terapi laser. Apakah Anda tertarik untuk melakukan konsultasi gratis?",
        "recommendationTitle": "Rekomendasi Perawatan Kulit",
        "recommendationDesc": "Kami merekomendasikan Facial Detox untuk membersihkan pori-pori secara mendalam dan Terapi Laser untuk mengurangi jerawat dan mencerahkan kulit kusam."
      }
    },
    "categories": [
      "Kecantikan",
      "Perawatan Kulit",
      "Klinik Estetika"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Detoks",
        "desc": "Perawatan wajah untuk membersihkan pori-pori dan menghilangkan kotoran.",
        "price": "Rp 250.000",
        "category": "Facial"
      },
      {
        "id": 2,
        "name": "Terapi Laser",
        "desc": "Perawatan untuk mengurangi jerawat, mencerahkan kulit, dan meratakan warna kulit.",
        "price": "Rp 500.000",
        "category": "Perawatan Khusus"
      },
      {
        "id": 3,
        "name": "Mikrodermabrasi",
        "desc": "Eksfoliasi kulit non-invasif untuk tampilan yang lebih halus dan cerah.",
        "price": "Rp 350.000",
        "category": "Facial"
      }
    ],
    "reviews": [
      {
        "authorName": "Jules",
        "rating": 5,
        "text": "Overall a good experience for a first timer. You could also do a short consultation session before deciding what treatment to take. Staffs are kind and welcoming too.",
        "time": "8 months ago"
      },
      {
        "authorName": "Noer Fiqih",
        "rating": 5,
        "text": "Ka Lisda overall service exelant, Not bad😊",
        "time": "8 months ago"
      },
      {
        "authorName": "Aura Chitra",
        "rating": 5,
        "text": "Great Service!!",
        "time": "8 months ago"
      },
      {
        "authorName": "Koko Puff",
        "rating": 5,
        "text": "Great service and treatments being offered, worth the price",
        "time": "2 years ago"
      },
      {
        "authorName": "Michael Tjia",
        "rating": 5,
        "text": "Good services, Treatment 👍",
        "time": "8 months ago"
      }
    ]
  },


  "klinik-estetika-humayra": {
    "name": "Klinik Estetika Humayra",
    "category": "Klinik Estetika",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 49,
    "phone": "+62 812-8053-1066",
    "address": "Jl. Raya Semplak No.275, RT.003/RW.006, Semplak, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16114, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=5976041472637102890&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281280531066",
    "tagline": "Wujudkan kulit impianmu dengan perawatan terbaik dari Klinik Estetika Humayra.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Lia",
      "role": "Dokter Estetika",
      "avatarEmoji": "👩🏻‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo dr. Lia, saya punya masalah kulit kusam dan banyak bekas jerawat. Perawatan apa yang cocok ya?",
        "doctor": "Halo! Untuk masalah kulit kusam dan bekas jerawat, kami memiliki beberapa perawatan yang sangat efektif. Saya bisa rekomendasikan Facial Glowing untuk mencerahkan, Chemical Peeling untuk regenerasi kulit, atau PRP Treatment yang sangat bagus untuk menghilangkan bekas jerawat. Mari kita jadwalkan konsultasi untuk menentukan perawatan terbaik sesuai kondisi kulit Anda.",
        "recommendationTitle": "Rekomendasi Perawatan Kulit Kusam & Bekas Jerawat",
        "recommendationDesc": "Untuk kulit kusam dan bekas jerawat, disarankan Facial Glowing, Chemical Peeling, atau PRP Treatment. Konsultasi langsung dengan dokter untuk penyesuaian."
      }
    },
    "categories": [
      "Perawatan Wajah",
      "Kecantikan Kulit",
      "Anti-Aging",
      "Laser Treatment",
      "Chemical Peeling",
      "PRP Treatment"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Glowing",
        "desc": "Perawatan wajah untuk mencerahkan dan menyegarkan kulit kusam.",
        "price": "Rp 150.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 2,
        "name": "Chemical Peeling",
        "desc": "Mengangkat sel kulit mati untuk kulit lebih cerah dan bebas noda.",
        "price": "Rp 350.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "PRP Treatment",
        "desc": "Terapi Platelet-Rich Plasma untuk regenerasi kulit dan menghilangkan bekas jerawat.",
        "price": "Rp 750.000",
        "tag": "Rekomendasi",
        "category": "Terapi Kulit"
      },
      {
        "id": 4,
        "name": "Laser Rejuvenation",
        "desc": "Perawatan laser untuk peremajaan kulit, mengurangi kerutan dan flek hitam.",
        "price": "Rp 900.000",
        "category": "Terapi Kulit"
      }
    ],
    "reviews": [
      {
        "authorName": "Astrid Deviana",
        "rating": 5,
        "text": "I was recommended by my mum, the place is very aesthetic and clean, the service is very good and the prices are affordable. So worth it 🥰👍🏼",
        "time": "2 years ago"
      },
      {
        "authorName": "Aditya Kusumastuti",
        "rating": 5,
        "text": "Its a cozy place and nice for any treatment. Very recomended❤",
        "time": "3 years ago"
      },
      {
        "authorName": "resmi widaswara",
        "rating": 5,
        "text": "👍🏻👍🏻",
        "time": "2 years ago"
      },
      {
        "authorName": "Jihan khairina",
        "rating": 5,
        "text": "friendly staff n good experience",
        "time": "in the last week"
      },
      {
        "authorName": "Markas Jangkrik",
        "rating": 5,
        "text": "The treatment here is soooooo comfortable. The doctor is nice, patient, very friendly, and beautiful😍 I came home immediately glowing, I really like the PRP, it's my favorite treatment, all my acne is gone😭❤️ Thank you Doctor Lia🥰",
        "time": "3 years ago"
      }
    ]
  },


  "iwan-mandagidr": {
    "name": "Iwan Mandagi.dr",
    "category": "Klinik Akupunktur dan Umum",
    "city": "dramaga cilendek bubulak",
    "rating": 4.9,
    "reviewCount": 28,
    "phone": "+62 815-9996-231",
    "address": "Jl. RSAU No.3, RT.03/RW.10, Atang Senjaya, Kec. Kemang, Kabupaten Bogor, Jawa Barat 16310, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=7707827871424953546&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628159996231",
    "tagline": "Pusat Akupunktur dan Pelayanan Kesehatan Umum Terbaik di Bogor",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dr. Iwan Mandagi",
      "role": "Dokter Akupunktur & Umum",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, saya sering merasa pegal-pegal di punggung dan leher. Apa ada solusi yang bisa membantu?",
        "doctor": "Tentu, dengan metode akupunktur, kita bisa membantu meredakan pegal-pegal Anda. Akupunktur dapat melancarkan peredaran darah dan mengurangi ketegangan otot. Mari kita jadwalkan konsultasi untuk penanganan lebih lanjut.",
        "recommendationTitle": "Terapi Akupunktur untuk Nyeri Otot",
        "recommendationDesc": "Akupunktur adalah pengobatan tradisional Tiongkok yang melibatkan penempatan jarum tipis pada titik-titik tertentu di tubuh. Ini efektif untuk meredakan nyeri otot, pegal-pegal, dan masalah sendi, serta meningkatkan relaksasi dan kesejahteraan umum."
      }
    },
    "categories": [
      "Akupunktur",
      "Klinik Umum",
      "Kesehatan",
      "Terapi Fisik"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan dan konsultasi kesehatan menyeluruh dengan dokter umum.",
        "price": "Rp 75.000",
        "category": "Layanan Medis"
      },
      {
        "id": 2,
        "name": "Terapi Akupunktur",
        "desc": "Sesi akupunktur untuk berbagai keluhan seperti nyeri otot, stres, dan kelelahan.",
        "price": "Mulai dari Rp 150.000",
        "category": "Terapi Alternatif"
      },
      {
        "id": 3,
        "name": "Cek Gula Darah",
        "desc": "Pengecekan kadar gula darah sewaktu.",
        "price": "Rp 30.000",
        "category": "Pemeriksaan Laboratorium"
      },
      {
        "id": 4,
        "name": "Terapi Bekam",
        "desc": "Pengobatan tradisional bekam untuk mengeluarkan toksin dari tubuh.",
        "price": "Mulai dari Rp 100.000",
        "category": "Terapi Alternatif"
      }
    ],
    "reviews": [
      {
        "authorName": "Shanazqum QunQun",
        "rating": 4,
        "text": "For suggestions, most patients go through the back door and are interrupted. Poor people who have arrived first. Most of them go through the back door. Suggestions: The doctor should be firm, if possible, lock the back door so that patients do not just jump in line through the back door. Cultivate orderly queues. This often happens. .. Saturday Just now, a man and his family jumped in line through the back door while the first woman to arrive was waiting on the front sofa. Finally, they were interrupted.",
        "time": "2 months ago"
      },
      {
        "authorName": "Kaesbe 358",
        "rating": 4,
        "text": "Pelayanan dokter cukup baik, namun sistem antrian masih perlu diperbaiki. Saat datang, pasien terlihat kebingungan karena tidak ada nomor atau daftar antrian yang jelas, hanya mengandalkan saling bertanya siapa yang terakhir. Meskipun terlihat sederhana, akan jauh lebih tertib dan nyaman jika disediakan kartu antrian atau sistem daftar pasien. Semoga ke depannya bisa ditingkatkan agar pelayanan menjadi lebih rapi dan profesional.",
        "time": "3 months ago"
      },
      {
        "authorName": "Muhammad Hafizhuddin",
        "rating": 5,
        "text": "Masya Allah wal hamdulillah, may the doctor always be healthy and live a long life, and may his expertise be very beneficial to many people. Blessed be Allah, doctor.",
        "time": "8 months ago"
      },
      {
        "authorName": "FADLI",
        "rating": 5,
        "text": "Top acupuncture in Bogor City, comfortable and clean, with a cafe. You can enjoy coffee while waiting for your loved ones to receive treatment.",
        "time": "a year ago"
      },
      {
        "authorName": "Nila AlhijazBogor",
        "rating": 5,
        "text": "Thank God, the doctor and assistant were friendly, the waiting room was comfortable, there was a cafe, and the food and drinks were affordable. My dad, who couldn't get up from bed and couldn't walk, can now walk, although not yet normally. It's all by Allah's grace. Thank God. Thank you, Doctor Iwan, stay healthy 🤲😇",
        "time": "a year ago"
      }
    ]
  },


  "klinik-gigi-yasmin-dental-ruko-taman-yasmin-sektor-vi-bogor": {
    "name": "Klinik Gigi Yasmin Dental (Ruko Taman Yasmin sektor VI) Bogor",
    "category": "Klinik Gigi",
    "city": "Bogor",
    "rating": 4.9,
    "reviewCount": 347,
    "phone": "+62 811-184-619",
    "address": "Ruko Taman Yasmin Sektor VI Jl. KH. R. Abdullah Bin Nuh No.200, RT.05/RW.09, Curugmekar, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16113, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=10123188431498050646&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "62811184619",
    "tagline": "Senyum Sehat, Percaya Diri Meningkat bersama Yasmin Dental",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Drg. Funny",
      "role": "Dokter Gigi",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Gigi saya sakit sekali, dok, apakah bisa langsung diperiksa?",
        "doctor": "Tentu, mari kita periksa penyebabnya. Kami akan berusaha membuat Anda nyaman.",
        "recommendationTitle": "Perawatan Gigi Darurat",
        "recommendationDesc": "Kami siap membantu Anda mengatasi sakit gigi segera. Hubungi kami untuk janji temu atau walk-in."
      }
    },
    "categories": [
      "Klinik Gigi",
      "Ortodontik",
      "Pembersihan Gigi",
      "Tambal Gigi",
      "Cabut Gigi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pembersihan Karang Gigi (Scaling)",
        "desc": "Pembersihan plak dan karang gigi untuk menjaga kesehatan mulut Anda.",
        "price": "Mulai dari Rp 300.000",
        "category": "Perawatan Umum"
      },
      {
        "id": 2,
        "name": "Tambal Gigi",
        "desc": "Penanganan gigi berlubang untuk mengembalikan fungsi dan estetika gigi.",
        "price": "Mulai dari Rp 400.000",
        "category": "Restorasi Gigi"
      },
      {
        "id": 3,
        "name": "Cabut Gigi",
        "desc": "Prosedur pencabutan gigi yang rusak atau tidak dapat diselamatkan dengan aman.",
        "price": "Mulai dari Rp 350.000",
        "category": "Bedah Minor"
      },
      {
        "id": 4,
        "name": "Pemasangan Behel (Ortodontik)",
        "desc": "Perawatan untuk merapikan susunan gigi dan memperbaiki gigitan.",
        "price": "Konsultasi Gratis, Paket Mulai dari Rp 8.000.000",
        "tag": "Populer",
        "category": "Ortodontik"
      }
    ],
    "reviews": [
      {
        "authorName": "Elisabeth Venny",
        "rating": 5,
        "text": "Drg. Funny did my braces, Professional, efficient, and friendly, recommended!",
        "time": "2 months ago"
      },
      {
        "authorName": "tatalitha viantono",
        "rating": 5,
        "text": "Good jod drg. Funny👍🏻👍🏻👍🏻",
        "time": "5 months ago"
      },
      {
        "authorName": "Avita Puteri",
        "rating": 5,
        "text": "I went here to drg. Funny for my braces in 2016 and never have the need go to other dentist ever since then, for any of my dental problems. Definitely the best one!",
        "time": "2 years ago"
      },
      {
        "authorName": "Sylvia Nisrina",
        "rating": 5,
        "text": "My go to dentist! Always satidfied with the result. Been going here since i was small and will be going back.",
        "time": "a year ago"
      },
      {
        "authorName": "drinc",
        "rating": 5,
        "text": "good",
        "time": "4 months ago"
      }
    ]
  },


  "ranuderma-bogor-dokter-spesialis-kulit-kelamin-dan-kecantikan-spkkspdve": {
    "name": "Ranuderma Bogor | Dokter Spesialis Kulit, Kelamin dan Kecantikan (Sp.KK/Sp.DVE)",
    "category": "Dermatology Clinic",
    "city": "Bogor",
    "rating": 4.7,
    "reviewCount": 17,
    "phone": "+62 819-2021-402",
    "address": "Ruko Taman Yasmin Sektor VI Jl. KH. R. Abdullah Bin Nuh No.118, RT.04/RW.09, Curugmekar, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16113, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=15900767308230559380&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "628192021402",
    "tagline": "Pakar Perawatan Kulit, Kelamin dan Kecantikan Terpercaya di Bogor",
    "iconEmoji": "💆‍♀️",
    "doctor": {
      "name": "Dr. Spesialis Kulit Ranuderma",
      "role": "Dermatologist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Kulit saya sering berjerawat dan kusam, apakah ada solusi yang tepat?",
        "doctor": "Tentu, kami dapat membantu Anda. Dari gejala yang Anda sampaikan, kemungkinan ada beberapa faktor yang mempengaruhi. Saya sarankan untuk melakukan konsultasi langsung agar bisa diperiksa lebih lanjut dan kami bisa memberikan rekomendasi perawatan yang paling sesuai untuk kondisi kulit Anda.",
        "recommendationTitle": "Konsultasi Kulit dan Perawatan Jerawat",
        "recommendationDesc": "Dapatkan diagnosis akurat dan rencana perawatan personal untuk masalah jerawat dan kulit kusam Anda dari dokter spesialis kulit kami."
      }
    },
    "categories": [
      "Klinik Kulit",
      "Dermatologi",
      "Kecantikan",
      "Perawatan Kulit"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Spesialis Kulit",
        "desc": "Konsultasi komprehensif dengan dokter spesialis kulit untuk menganalisis kondisi kulit dan rekomendasi perawatan.",
        "price": "Mulai dari Rp 200.000",
        "category": "Layanan Utama"
      },
      {
        "id": 2,
        "name": "Facial Acne Treatment",
        "desc": "Perawatan wajah khusus untuk mengatasi jerawat dan komedo, membantu membersihkan pori-pori dan mengurangi peradangan.",
        "price": "Mulai dari Rp 350.000",
        "tag": "Populer",
        "category": "Perawatan Wajah"
      },
      {
        "id": 3,
        "name": "Chemical Peeling",
        "desc": "Prosedur pengelupasan kimia untuk mengangkat sel kulit mati, memperbaiki tekstur kulit, dan mencerahkan wajah.",
        "price": "Mulai dari Rp 500.000",
        "category": "Perawatan Wajah"
      },
      {
        "id": 4,
        "name": "Laser Rejuvenation",
        "desc": "Terapi laser untuk meremajakan kulit, mengurangi kerutan halus, flek hitam, dan meningkatkan elastisitas kulit.",
        "price": "Mulai dari Rp 800.000",
        "tag": "Premium",
        "category": "Perawatan Khusus"
      }
    ],
    "reviews": [
      {
        "authorName": "Gina Astarina",
        "rating": 5,
        "text": "The doctor was good and explained things in detail. The therapist was cute and adorable.",
        "time": "2 months ago"
      },
      {
        "authorName": "zahra tusita",
        "rating": 5,
        "text": "Thank you Ranu derma... the place is very comfortable, the nurses are kind & the doctors are very thorough😍😍",
        "time": "a year ago"
      },
      {
        "authorName": "Sumadi Tigerdepok",
        "rating": 5,
        "text": "It was amazing to visit a beauty clinic, where you're served by a young, experienced, friendly, sociable, and educational dermatologist, along with friendly and kind nurses. The location is strategic, and the clinic's atmosphere is comfortable and spacious, pampering its patients and customers. May it continue to run smoothly, be blessed, and have many regular patients. Continued success, Ranu Derma Bogor Clinic. 💪💪💪",
        "time": "a year ago"
      },
      {
        "authorName": "Fani Siregar",
        "rating": 5,
        "text": "So far, I've been here several times and I'm very satisfied with the service and results. The specialist's explanations are also generous, and the therapists are excellent.",
        "time": "9 months ago"
      },
      {
        "authorName": "susliyanthi gustiani",
        "rating": 5,
        "text": "The place is comfortable, the doctor is not in a rush to examine and consult, the nurses are friendly.",
        "time": "6 months ago"
      }
    ]
  },


  "safubot-yasmin-bogor": {
    "name": "Safubot Yasmin Bogor",
    "category": "Klinik Gigi & Umum",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 498,
    "phone": "+62 812-2247-4564",
    "address": "Ruko Taman Yasmin Sektor VI No.148 Curugmekar Kecamatan Bogor Barat Bogor, RT.04/RW.09, Curugmekar, kota, Yasmin, Jawa Barat 16113, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=12374354514791438340&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281222474564",
    "tagline": "Klinik terpercaya untuk kesehatan Anda.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "dr. Thoriq",
      "role": "Dokter Umum & Gigi",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Halo dok, saya merasa kurang enak badan, batuk dan sedikit demam sejak kemarin.",
        "doctor": "Baik, Bu/Pak. Dari gejala yang Anda sampaikan, kemungkinan ini flu biasa. Untuk diagnosis lebih lanjut, saya sarankan untuk datang ke klinik agar bisa diperiksa langsung.",
        "recommendationTitle": "Pemeriksaan dan Konsultasi Flu",
        "recommendationDesc": "Datang ke klinik untuk pemeriksaan fisik lengkap dan konsultasi dengan dokter terkait gejala flu, batuk, dan demam."
      }
    },
    "categories": [
      "Klinik",
      "Kesehatan",
      "Umum",
      "Gigi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan dan diagnosis kesehatan umum.",
        "price": "Rp 50.000",
        "category": "Layanan Umum"
      },
      {
        "id": 2,
        "name": "Pembersihan Karang Gigi",
        "desc": "Perawatan untuk menghilangkan plak dan karang gigi.",
        "price": "Rp 250.000",
        "category": "Layanan Gigi"
      },
      {
        "id": 3,
        "name": "Suntik Vitamin C",
        "desc": "Injeksi vitamin C untuk meningkatkan daya tahan tubuh.",
        "price": "Rp 150.000",
        "category": "Terapi Vitamin"
      }
    ],
    "reviews": [
      {
        "authorName": "muhammad ayub",
        "rating": 5,
        "text": "excellent service and explanation from the doctor and staff 🙏🏻🙏🏻",
        "time": "a year ago"
      },
      {
        "authorName": "Avita Puteri",
        "rating": 5,
        "text": "Everyone was very helpful ❤️  A friend of mine recommended me this place and I owe her one!",
        "time": "a year ago"
      },
      {
        "authorName": "Dewi Supriyo Putri",
        "rating": 5,
        "text": "Many thanks to Safubot Yasmin Bogor, nice treatment, good service. Thank u to dr. Thoriq",
        "time": "a year ago"
      },
      {
        "authorName": "Said Fahmi",
        "rating": 5,
        "text": "Best !",
        "time": "6 months ago"
      },
      {
        "authorName": "Dina Mardani",
        "rating": 5,
        "text": "Ok",
        "time": "3 months ago"
      }
    ]
  },


  "yolita-dental-care-bogor": {
    "name": "Yolita Dental Care Bogor",
    "category": "Klinik Gigi",
    "city": "Bogor",
    "rating": 4.8,
    "reviewCount": 84,
    "phone": "+62 852-8115-5343",
    "address": "Jl. H. Encep Nawawi Ruko No.18 C, RT.002/RW.011, Bubulak, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16115, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=15827239038313485053&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJbyRACGAQgAA",
    "hours": "",
    "waNumber": "6285281155343",
    "tagline": "Senyum sehat, gigi terawat, percaya diri meningkat.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Dr. Tiana",
      "role": "Dokter Gigi Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "",
      "sampleChat": {
        "user": "Dok, gigi saya ngilu saat makan manis, apakah ini tanda gigi berlubang?",
        "doctor": "Bisa jadi, ada beberapa penyebab gigi ngilu. Sebaiknya segera periksakan ke klinik agar dapat diagnosis yang tepat dan penanganan dini ya.",
        "recommendationTitle": "Periksa Gigi Rutin",
        "recommendationDesc": "Melakukan pemeriksaan gigi rutin setiap 6 bulan sekali dapat membantu mendeteksi masalah gigi sejak dini dan mencegah komplikasi yang lebih serius."
      }
    },
    "categories": [
      "Pemasangan Behel",
      "Pembersihan Karang Gigi",
      "Penambalan Gigi",
      "Pencabutan Gigi",
      "Perawatan Saluran Akar",
      "Pencabutan Gigi Bungsu",
      "Retainer"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Administrasi Kunjungan",
        "desc": "Biaya administrasi per kunjungan.",
        "price": "Rp 10.000",
        "category": "Biaya Lain-lain"
      },
      {
        "id": 2,
        "name": "Rontgen Panoramik",
        "desc": "Pemeriksaan rontgen gigi menyeluruh (dilakukan di luar klinik).",
        "price": "Rp 208.000",
        "category": "Pemeriksaan Penunjang"
      },
      {
        "id": 3,
        "name": "Pemasangan Bracket Belakang",
        "desc": "Biaya tambahan untuk pemasangan bracket di gigi belakang (per gigi).",
        "price": "Rp 100.000",
        "category": "Ortodontik"
      },
      {
        "id": 4,
        "name": "Penambalan Gigi",
        "desc": "Penambalan gigi berlubang (tergantung kondisi lubang).",
        "price": "Rp 150.000 - Rp 500.000",
        "category": "Restorasi Gigi"
      },
      {
        "id": 5,
        "name": "Pencabutan Gigi Bungsu",
        "desc": "Pencabutan gigi bungsu (per gigi).",
        "price": "Rp 1.500.000 - Rp 3.000.000",
        "category": "Pencabutan Gigi"
      },
      {
        "id": 6,
        "name": "Konsultasi Bulanan Behel",
        "desc": "Kontrol dan konsultasi rutin bulanan setelah pemasangan behel.",
        "price": "Rp 200.000",
        "category": "Ortodontik"
      },
      {
        "id": 7,
        "name": "Pelepasan Bracket",
        "desc": "Biaya pelepasan bracket behel (per gigi).",
        "price": "Rp 50.000",
        "category": "Ortodontik"
      },
      {
        "id": 8,
        "name": "Perbaikan Bracket Lepas",
        "desc": "Biaya perbaikan atau penggantian bracket yang lepas (per gigi).",
        "price": "Rp 100.000",
        "category": "Ortodontik"
      },
      {
        "id": 9,
        "name": "Penggantian Kawat Behel",
        "desc": "Penggantian kawat behel setiap 3 bulan (per rahang).",
        "price": "Rp 100.000",
        "category": "Ortodontik"
      },
      {
        "id": 10,
        "name": "Repositioning Gigi",
        "desc": "Biaya reposisi gigi (per gigi).",
        "price": "Rp 50.000",
        "category": "Ortodontik"
      },
      {
        "id": 11,
        "name": "Retainer",
        "desc": "Pemasangan retainer untuk mempertahankan posisi gigi setelah behel.",
        "price": "Rp 650.000 - Rp 1.000.000",
        "tag": "Lifetime",
        "category": "Ortodontik"
      },
      {
        "id": 12,
        "name": "Pencabutan Gigi Permanen",
        "desc": "Pencabutan gigi permanen (bukan gigi bungsu), per gigi.",
        "price": "Rp 300.000 - Rp 500.000",
        "category": "Pencabutan Gigi"
      },
      {
        "id": 13,
        "name": "Pengangkatan Gusi Gigi Bungsu",
        "desc": "Pengangkatan sebagian gusi yang menutupi mahkota gigi bungsu yang belum tumbuh sempurna, per gigi.",
        "price": "Rp 300.000",
        "category": "Bedah Minor"
      }
    ],
    "reviews": [
      {
        "authorName": "Neysa Petrina",
        "rating": 3,
        "text": "I was handled by Dr. Tiana. The braces were neatly installed and painless. The doctor was informative and helpful if you actively asked questions, and her explanations were quite detailed. However, the back brackets often came loose, even though I rarely eat hard foods and had chosen premium braces that (they say) are strong and won't come loose easily. But I ended up wasting more time and money just fixing the brackets. 😮‍💨 For those of you getting braces for the first time (like me), please prepare enough money to take advantage of the promotional price, as there are other unexpected costs involved. - Admin fee of 10,000 Rupiah per visit - Dental X-rays must be taken at another hospital/clinic, as they don't have the equipment (yesterday I was at Karya Bhakti Pratiwi Hospital, where a panoramic X-ray cost 208,000 Rupiah) - Installation of the back brackets (before the wisdom teeth are excluded), so there's an additional fee of 100,000 Rupiah per tooth, totaling 400,000 Rupiah for the upper, lower, right, and left sides. - If there are cavities, they must be filled first, with a price range of around 150,000 Rupiah - 500,000 Rupiah per tooth (depending on the condition of the cavity). - Wisdom tooth extraction costs between 1.5 million Rupiah - 3 million Rupiah per tooth (4 wisdom teeth total) After installation: - Monthly consultations approximately 200,000 Rupiah - Bracket removal 50,000 Rupiah per tooth - Bracket loss 100,000 Rupiah per tooth - Wire replacement every 3 months 100,000 Rupiah per jaw - Repositioning 50,000 Rupiah per tooth After removal: - Retainer 650,000 Rupiah - 1 million Rupiah (lifetime) (I live to keep my teeth from returning to their original state.) Hopefully, this helps those of you saving up for braces 😉 FYI (again), if you have an overbite, it's better to have the teeth extracted first, then get braces. There's no point in delaying the extraction. Your teeth will only move further forward because there's no room for them to move, which can lead to mouth ulcers because the brackets are rubbing against your lips. Initially, I was told to have my four wisdom teeth extracted. Private clinics are incredibly expensive, and if you use BPJS, you have to wait 2-3 months, so I kept postponing until progress stalled. At my fifth checkup, I was informed that the molars (the ones directly after the canines) could be extracted because the doctor said my wisdom teeth were growing straight, so there was no problem. If I had been told from the start, I wouldn't have: 1. Signed up for BPJS Kesehatan so that my wisdom teeth extraction would be covered. I swear, I'd rather set aside my own money for an emergency fund than make monthly payments to BPJS, which offers slow service and suboptimal treatment. 2. I'm not going to get a filling yet, because it turns out the tooth that was filled is the one that can be extracted, which ends up doubling my expenses. If I'd been informed from the start, the progress would have been faster. Now I'm pregnant, so the tooth extraction will have to be postponed until after the birth. 🥲 For permanent tooth extractions (other than wisdom teeth), the cost is around 300,000-500,000 per tooth. If the wisdom teeth haven't fully grown (the gums still partially cover the crown), the gum removal can cost around 300,000 per tooth. So, my advice: if your dental x-rays are fine, don't have your wisdom teeth extracted. Do as much research as possible before getting braces. 🙃",
        "time": "2 years ago"
      },
      {
        "authorName": "Caroline",
        "rating": 2,
        "text": "Bad customer service. I was quite disappointed to have booked an appointment on Monday for Wednesday, but it turned out the doctor was on leave without informing me. I'd even traveled from Jakarta to Bogor because I felt comfortable and trusted the friendly doctor at this dental office.",
        "time": "2 years ago"
      },
      {
        "authorName": "Intan Auga",
        "rating": 5,
        "text": "The service and staff are good and friendly, the doctor is also friendly, I like it here, thank you.",
        "time": "2 months ago"
      },
      {
        "authorName": "Santifebri Yanti",
        "rating": 5,
        "text": "The doctor was very kind, the scaling and impressions were painless and not at all. The price was also affordable and reliable👍🏻👍🏻",
        "time": "3 years ago"
      },
      {
        "authorName": "Deri Wansa",
        "rating": 1,
        "text": "Bad service, my gums are bleeding, the doctor is not skilled yet",
        "time": "4 months ago"
      }
    ]
  },


  "praktek-dokter-spesialis-kulit-dan-kelamin-dr-melly-maya-sari-spkk": {
    "name": "Praktek Dokter Spesialis Kulit dan Kelamin Dr. Melly Maya Sari Sp.KK",
    "category": "Dermatology Clinic",
    "city": "dramaga cilendek bubulak",
    "rating": 4.8,
    "reviewCount": 132,
    "phone": "+62 878-8032-0040",
    "address": "Jl. Raya Semplak No.142, RT.01/RW.09, Cilendek Bar., Kec. Bogor Bar., Kota Bogor, Jawa Barat 16112, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=13230559544715480734&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6287880320040",
    "tagline": "Your trusted partner for healthy skin and comprehensive dermatological care.",
    "iconEmoji": "🩺",
    "doctor": {
      "name": "Dr. Melly Maya Sari Sp.KK",
      "role": "Dermatologist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya punya masalah jerawat yang parah di wajah, apakah ada solusi yang efektif?",
        "doctor": "Tentu, kami dapat membantu Anda. Jerawat adalah masalah umum yang seringkali dapat diobati dengan kombinasi perawatan topikal, obat oral, dan perubahan gaya hidup. Saya akan melakukan pemeriksaan menyeluruh untuk menentukan jenis jerawat Anda dan merancang rencana perawatan yang paling sesuai.",
        "recommendationTitle": "Penanganan Jerawat Komprehensif",
        "recommendationDesc": "Kami menawarkan berbagai solusi untuk jerawat, mulai dari terapi topikal, resep obat oral, hingga prosedur estetika seperti peeling kimia dan laser. Konsultasi awal akan membantu kami memahami kondisi kulit Anda dan merekomendasikan pendekatan terbaik."
      }
    },
    "categories": [
      "Dermatology",
      "Skin Care",
      "Venereology",
      "Clinic",
      "Doctor"
    ],
    "menu": [],
    "reviews": [
      {
        "authorName": "Meidina Ayuningtyas Chandra",
        "rating": 5,
        "text": "ok",
        "time": "a year ago"
      },
      {
        "authorName": "Sugih Harto",
        "rating": 5,
        "text": "Recommended 👍👍👍",
        "time": "5 years ago"
      },
      {
        "authorName": "Afrit Buana",
        "rating": 5,
        "text": "The service was very friendly. The doctor's explanations were also detailed. The first floor is the pharmacy, the second floor is the doctor's practice and waiting room. The pharmacy is open 24 hours. Payments can be made using QR code, bank transfer, cash, and debit cards. Parking is available as it's located in a shophouse. There are food stalls nearby, so you can enjoy some food while waiting.",
        "time": "8 months ago"
      },
      {
        "authorName": "Luckysyah F",
        "rating": 4,
        "text": "On the 2nd floor of the pharmacy, friendly staff, clean place, relatively affordable prices for treatment, detailed explanations from the doctor & skin checks by the doctor",
        "time": "a year ago"
      },
      {
        "authorName": "Riani Septiani",
        "rating": 1,
        "text": "I heard about it from Google reviews and was curious and decided to go. The service was mediocre, and the location was decent. The cream didn't suit my skin; perhaps patients and doctors have different preferences. The prices are quite high compared to other clinics, and it feels like an upsell.",
        "time": "5 months ago"
      }
    ]
  },


  "qdental-clinic-bogor": {
    "name": "Q-DENTAL CLINIC BOGOR",
    "category": "Klinik Gigi",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 71,
    "phone": "+62 877-7565-8258",
    "address": "Jl. H. Achmad Adnawijaya 4B-2 Blk No.D1, RT.004/RW.11, Tegal Gundil, Bogor Utara, Bogor City, West Java 16152, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=9657563301755298642&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6287775658258",
    "tagline": "Senyum Sehat, Hati Senang di Q-DENTAL CLINIC BOGOR",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "drg. Amelia Putri",
      "role": "Dokter Gigi Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, gigi saya terasa ngilu saat minum dingin, kenapa ya?",
        "doctor": "Halo! Itu bisa jadi tanda gigi sensitif atau ada lubang kecil. Saya sarankan Anda datang untuk pemeriksaan agar bisa kami pastikan penyebabnya dan memberikan penanganan yang tepat.",
        "recommendationTitle": "Jadwalkan Konsultasi Gratis!",
        "recommendationDesc": "Dapatkan pemeriksaan awal gratis untuk mengetahui kondisi gigi Anda dan rekomendasi perawatan terbaik dari dokter gigi kami."
      }
    },
    "categories": [
      "Klinik Gigi",
      "Dokter Gigi",
      "Perawatan Gigi",
      "Scaling",
      "Cabut Gigi",
      "Tambal Gigi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Scaling (Pembersihan Karang Gigi)",
        "desc": "Pembersihan karang gigi untuk menjaga kesehatan gusi dan mencegah peradangan.",
        "price": "Mulai dari Rp 250.000",
        "category": "Perawatan Preventif"
      },
      {
        "id": 2,
        "name": "Tambal Gigi",
        "desc": "Penambalan gigi berlubang dengan bahan komposit sewarna gigi untuk mengembalikan fungsi dan estetikanya.",
        "price": "Mulai dari Rp 300.000",
        "category": "Perawatan Restoratif"
      },
      {
        "id": 3,
        "name": "Cabut Gigi",
        "desc": "Prosedur pencabutan gigi yang sudah tidak dapat dipertahankan atau mengganggu kesehatan.",
        "price": "Mulai dari Rp 200.000",
        "category": "Perawatan Bedah Minor"
      },
      {
        "id": 4,
        "name": "Pemutihan Gigi (Whitening)",
        "desc": "Prosedur untuk mencerahkan warna gigi secara aman dan efektif di klinik.",
        "price": "Mulai dari Rp 1.500.000",
        "tag": "Populer",
        "category": "Perawatan Estetik"
      },
      {
        "id": 5,
        "name": "Perawatan Saluran Akar",
        "desc": "Perawatan untuk mengatasi infeksi pada pulpa gigi agar gigi dapat dipertahankan.",
        "price": "Mulai dari Rp 800.000",
        "category": "Perawatan Endodontik"
      }
    ],
    "reviews": [
      {
        "authorName": "Bella Vidya",
        "rating": 5,
        "text": "Comfortable place, informative receptionist, and very communicative also helpful doctors. Had very nice treatments there! Thank u Q-Dental Clinic😍",
        "time": "a year ago"
      },
      {
        "authorName": "Audinna kha",
        "rating": 5,
        "text": "Good experience for first time go to dentist. Thanks Q Dental clinic",
        "time": "a year ago"
      },
      {
        "authorName": "M Wahyu Sanjaya",
        "rating": 5,
        "text": "trims trimss W Q-dental clinic",
        "time": "6 months ago"
      },
      {
        "authorName": "Aura amalia Basmalah",
        "rating": 5,
        "text": "W q-dental clinic bogorr🔥",
        "time": "6 months ago"
      },
      {
        "authorName": "Muhammad Syarif Hidayatullah",
        "rating": 5,
        "text": "q-dental clinic bogor W",
        "time": "6 months ago"
      }
    ]
  },


  "okky-orthodontics-dokter-gigi-spesialis-ortodontikawat-gigi": {
    "name": "Okky Orthodontics",
    "category": "Klinik Gigi",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 144,
    "phone": "+62 813-2726-6161",
    "address": "Jl. Cimanggu Barata No.72, RT.07/RW.09, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=6795704172132673996&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJbyRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281327266161",
    "tagline": "Dokter gigi spesialis ortodonti/kawat gigi",
    "iconEmoji": "🩺",
    "doctor": {
      "name": "Dr. Okky",
      "role": "Dokter Gigi Spesialis Ortodonti",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, gigi saya berantakan, kira-kira bisa diperbaiki pakai behel nggak ya?",
        "doctor": "Tentu, untuk memastikan opsi terbaik, saya perlu melakukan pemeriksaan lebih lanjut. Namun, behel self-ligating seringkali menjadi pilihan yang efektif untuk kasus gigi berantakan. Mari kita jadwalkan konsultasi untuk diskusi lebih detail.",
        "recommendationTitle": "Kawat Gigi Self-Ligating",
        "recommendationDesc": "Teknologi kawat gigi modern yang memberikan kenyamanan lebih dan waktu perawatan yang lebih singkat dibandingkan behel konvensional. Cocok untuk berbagai kasus maloklusi."
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
        "desc": "Pemeriksaan awal dan rencana perawatan kawat gigi.",
        "price": "Rp 150.000",
        "category": "Konsultasi"
      },
      {
        "id": 2,
        "name": "Pemasangan Kawat Gigi Self-Ligating",
        "desc": "Pemasangan behel modern untuk hasil optimal dan kenyamanan.",
        "price": "Mulai dari Rp 10.000.000",
        "category": "Perawatan Utama"
      },
      {
        "id": 3,
        "name": "Retainer (Lepasan/Permanen)",
        "desc": "Alat penahan gigi pasca perawatan ortodonti.",
        "price": "Mulai dari Rp 1.500.000",
        "category": "Pascaperawatan"
      },
      {
        "id": 4,
        "name": "Pencetakan Gigi (Diagnostik)",
        "desc": "Untuk analisis mendalam kondisi gigi sebelum perawatan.",
        "price": "Rp 300.000",
        "category": "Diagnostik"
      }
    ],
    "reviews": [
      {
        "authorName": "Mehdi",
        "rating": 5,
        "text": "Best dentist. Quality dental work. Nothing is rushed and is well explained. Definitely recommend to everyone",
        "time": "2 years ago"
      },
      {
        "authorName": "Eugene Lontoh",
        "rating": 5,
        "text": "My smile went from rough to fairway-perfect. Dr. Okky is the Tiger Woods of teeth!🏌️‍♂️",
        "time": "2 years ago"
      },
      {
        "authorName": "Andi Yasser",
        "rating": 5,
        "text": "The treatment is so nice. Worth to be a patient here !!!",
        "time": "3 years ago"
      },
      {
        "authorName": "Mutia Hafilizara",
        "rating": 5,
        "text": "I was initially nervous about getting my first braces, but my experience at Dr. Okky Orthodonti Bogor put me at ease. During the consultation, Dr. Okky explained my dental condition clearly and suggested self-ligating braces as the most suitable option for my case. His explanation made sense, so I was confident. The installation process was comfortable and quick, the clinic was clean and aesthetically pleasing, and afterward, I was given complete treatment instructions. For a first-time braces patient, this was a very positive experience and made me feel secure. 🦷✨",
        "time": "7 months ago"
      },
      {
        "authorName": "paridah nasution",
        "rating": 5,
        "text": "This was my first time going to the dentist without any recommendations or from ads I often see on Instagram. At first, I just asked Google Maps for orthodontists around Bogor, and Dr. Okky's clinic came up. The first time I saw the aesthetic photos of the room, I immediately fell in love with the concept. I continued reading the reviews, and oh my God, Dr. Okky is that Dr. I continued with a chat consultation. Dr. Okky was really friendly, and he wasn't stingy with his knowledge, even though I consulted via chat, and he responded as quickly and as quickly as possible with very detailed responses. Without further thought, after checking out several orthodontics, I immediately decided to install braces here. Besides the affordable price and being treated directly by an orthodontic specialist, I also became even more confident and trusting of Dr. Okky. I proceeded to book an appointment, negotiating whether I wanted a night shift, and the doctor made it easy for me to arrange a daytime appointment. Thank you, doc. Stay healthy, Dr. Okky 🤗🤗",
        "time": "3 years ago"
      }
    ]
  },


  "oriskin-bogor-yasmin": {
    "name": "Oriskin Bogor Yasmin",
    "category": "Klinik Kecantikan",
    "city": "jambu 2 bogor",
    "rating": 4.9,
    "reviewCount": 1968,
    "phone": "+62 251 8367571",
    "address": "Jl. Sholeh Iskandar No.6G, RT.01/RW.05, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=1599478668778167102&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "622518367571",
    "tagline": "Pusat perawatan kulit dan kecantikan untuk hasil optimal.",
    "iconEmoji": "🌸",
    "doctor": {
      "name": "Dr. Kulit Oriskin",
      "role": "Dermatologis",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Kulitku kusam dan sering berjerawat, Dok. Ada rekomendasi?",
        "doctor": "Tentu, untuk kulit kusam dan berjerawat, kami sarankan perawatan facial detoksifikasi dan serum khusus untuk mencerahkan dan mengurangi jerawat.",
        "recommendationTitle": "Perawatan Detoksifikasi Wajah & Serum Pencerah",
        "recommendationDesc": "Perawatan ini membantu membersihkan pori-pori secara mendalam, mengangkat sel kulit mati, dan menutrisi kulit agar lebih cerah dan bebas jerawat."
      }
    },
    "categories": [
      "Facial",
      "Perawatan Kulit",
      "Kecantikan"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Facial Oxy",
        "desc": "Perawatan wajah menggunakan oksigen murni untuk revitalisasi kulit.",
        "price": "Rp 350.000",
        "category": "Facial"
      },
      {
        "id": 2,
        "name": "Facial Detox",
        "desc": "Membersihkan pori-pori secara mendalam dan mengangkat racun dari kulit.",
        "price": "Rp 400.000",
        "category": "Facial"
      },
      {
        "id": 3,
        "name": "Chemical Peeling",
        "desc": "Mengangkat lapisan kulit mati untuk regenerasi sel kulit baru.",
        "price": "Rp 750.000",
        "category": "Perawatan Khusus"
      }
    ],
    "reviews": [
      {
        "authorName": "Eulis Utami",
        "rating": 5,
        "text": "Had a one-time facial and it felt refreshing and relaxing. My skin looked cleaner, smoother, and more hydrated afterward, with a healthy glow. Thank you, Oriskin!",
        "time": "7 months ago"
      },
      {
        "authorName": "Diana Mandasari",
        "rating": 5,
        "text": "Good service, good treatment 👍🏻👍🏻👍🏻 wajah makin glowing",
        "time": "9 months ago"
      },
      {
        "authorName": "Yulia Kasih",
        "rating": 5,
        "text": "Excellent service, all staff so kind and humble Recommend to try oxy service, over all nice",
        "time": "7 months ago"
      },
      {
        "authorName": "Allysa Zheria Azzahra",
        "rating": 5,
        "text": "Good staff, nice service, very recommended",
        "time": "a month ago"
      },
      {
        "authorName": "Shafana Zanubia",
        "rating": 5,
        "text": "Saya facial oxy. It was very good facial! And friendly staff",
        "time": "9 months ago"
      }
    ]
  },


  "derma-express-bogor": {
    "name": "Derma Express Bogor",
    "category": "Beauty Clinic",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 701,
    "phone": "+62 811-1054-2355",
    "address": "Jl. Bangbarung Raya No.31b, RT.03/RW.07, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=9041098960522029177&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281110542355",
    "tagline": "Your trusted partner for radiant skin",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Finda",
      "role": "Dermatologist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, kulit saya terlihat kusam dan banyak noda hitam. Kira-kira perawatan apa yang cocok ya?",
        "doctor": "Berdasarkan kondisi kulit Anda, saya merekomendasikan treatment Derma Glow untuk mencerahkan dan mengurangi noda hitam, serta rutin menggunakan sunscreen setiap hari. Mari kita jadwalkan konsultasi lebih lanjut untuk diagnosis dan penanganan yang lebih tepat.",
        "recommendationTitle": "Derma Glow Treatment",
        "recommendationDesc": "Treatment Derma Glow membantu mencerahkan kulit kusam, menyamarkan noda hitam, dan meratakan warna kulit."
      }
    },
    "categories": [
      "Skincare",
      "Dermatology",
      "Aesthetic Clinic"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter",
        "desc": "Konsultasi awal dengan dokter spesialis kulit.",
        "price": "Rp 100.000",
        "category": "Services"
      }
    ],
    "reviews": [
      {
        "authorName": "Nabila",
        "rating": 5,
        "text": "I’ve always been a regular with dr. Finda. there was even a time when I noticed some changes and randomly DM’d her on Instagram, and surprisingly she replied right away, no matter the time, even in the middle of the night. her treatment recommendations are always honest and really match what I actually need. for example, when I felt like I needed a facial, she said I didn’t yet. or when I asked whether I should come every two weeks or once a month, she said once a month is enough. that really shows there’s no upselling at all. but the facial here is definitely more painful compared to other clinics. not sure if it’s because they don’t use a comedone softener first or something else. even so, I’ll still keep coming back here every month!",
        "time": "4 months ago"
      },
      {
        "authorName": "Ameera Farhah Fildzah Azzani",
        "rating": 5,
        "text": "The place is very clean, smells nice, and has good amenities given to the customer. The doctor and staff are nice and helpful.",
        "time": "2 years ago"
      },
      {
        "authorName": "Dicephalous 90",
        "rating": 5,
        "text": "I recently visited Derma Express Bogor and had an amazing experience. The staff was knowledgeable, and the service was impeccable. The personalized skincare regimen they recommended has truly transformed my skin. I highly recommend their expertise and quality treatments for anyone seeking effective skincare solutions",
        "time": "2 years ago"
      },
      {
        "authorName": "rachma yulia",
        "rating": 5,
        "text": "Nice facility, very professional and the doctor knows what they are doing. Happy with the service so far :)",
        "time": "2 years ago"
      },
      {
        "authorName": "Najwa Nada Utami",
        "rating": 4,
        "text": "nice place, excelent staff. thank you Dr. Anna , Mrs. Kiki Mareta as cashier for helping🙌🏻",
        "time": "2 years ago"
      }
    ]
  },


  "zap-clinic-bogor": {
    "name": "ZAP Clinic- Bogor",
    "category": "Klinik Kecantikan",
    "city": "Bogor",
    "rating": 5.0,
    "reviewCount": 1868,
    "phone": "+62 251 8368420",
    "address": "Jalan Ahmad Sobana No 48, Jl. Bangbarung Raya No.RT 005/10, RT.02/RW.10, Tegal Gundil, Bogor Utara, Bogor City, West Java 16151, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=3245300283285022055&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin-Jumat: 09.00-19.00, Sabtu-Minggu: 09.00-17.00",
    "waNumber": "622518368420",
    "tagline": "Pusat perawatan kulit dan kecantikan terkemuka di Bogor untuk kulit sehat dan cerahmu.",
    "iconEmoji": "✨",
    "doctor": {
      "name": "Dr. Stephany",
      "role": "Dokter Kecantikan",
      "avatarEmoji": "👩🏻‍⚕️",
      "avatarUrl": "https://example.com/dr_stephany_avatar.jpg",
      "sampleChat": {
        "user": "Hai dokter, kulit saya kusam dan kering, apakah ada rekomendasi perawatan?",
        "doctor": "Tentu, untuk kulit kusam dan kering, kami memiliki beberapa perawatan yang dapat membantu mengembalikan kelembaban dan mencerahkan kulit Anda. Saya merekomendasikan perawatan 'Photo Facial Glow' untuk hasil yang optimal.",
        "recommendationTitle": "Rekomendasi Perawatan Photo Facial Glow",
        "recommendationDesc": "Perawatan ini membantu mencerahkan kulit kusam, mengurangi flek hitam, dan meningkatkan tekstur kulit dengan teknologi laser yang aman dan efektif."
      }
    },
    "categories": [
      "Perawatan Kulit",
      "Hair Removal",
      "Klinik Kecantikan",
      "Laser Wajah",
      "Facial Treatment"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Photo Facial Glow",
        "desc": "Perawatan wajah dengan teknologi laser untuk mencerahkan dan meratakan warna kulit, menghilangkan flek hitam, dan meningkatkan tekstur kulit.",
        "price": "Rp 299.000",
        "tag": "Best Seller",
        "category": "Facial & Laser"
      },
      {
        "id": 2,
        "name": "Underarm Hair Removal",
        "desc": "Perawatan penghilang bulu ketiak secara permanen menggunakan teknologi IPL yang aman dan efektif.",
        "price": "Rp 199.000",
        "category": "Hair Removal"
      },
      {
        "id": 3,
        "name": "Glass Skin Treatment",
        "desc": "Perawatan komprehensif untuk mendapatkan kulit wajah glowing, halus, dan tampak bening seperti kaca.",
        "price": "Rp 399.000",
        "tag": "New",
        "category": "Facial & Laser"
      },
      {
        "id": 4,
        "name": "Body Rejuvenation",
        "desc": "Perawatan untuk meremajakan kulit tubuh, meningkatkan elastisitas dan mencerahkan area tertentu.",
        "price": "Mulai dari Rp 450.000",
        "category": "Body Treatment"
      }
    ],
    "reviews": [
      {
        "authorName": "Anisa Andiani",
        "rating": 5,
        "text": "I had a very good experience with the treatment. The nurse mbak Aulia was professional, gentle, and attentive throughout the session. Dr. Stephany was also very kind, knowledgeable, and explained everything clearly. The receptionist mbak Siti was friendly, helpful, and welcoming. Overall, the service was excellent, and I’m very satisfied with my experience. Highly recommended!",
        "time": "a month ago"
      },
      {
        "authorName": "Zainab",
        "rating": 5,
        "text": "Incredibly satisfied with my hair removal journey! The results exceeded my expectations—smooth skin, zero hassle, and a massive boost in confidence. It's been worth every single session. Big thanks to Doc Ghaida, Aju and all Zap team.",
        "time": "3 months ago"
      },
      {
        "authorName": "Irmanda Amrihi",
        "rating": 5,
        "text": "Very satisfied with the service! As a new customer who never experienced any treatments, Zap provides comfort and informative service 💕 Thanks Ka Aju dan team ✨ Definitely will come back for another treatment",
        "time": "2 months ago"
      },
      {
        "authorName": "Baby G",
        "rating": 5,
        "text": "Great experience. The service was professional and the place was clean and comfortable. Special thanks to Mba Siti for being so friendly, helpful, and attentive. Highly recommended!",
        "time": "3 months ago"
      },
      {
        "authorName": "Susanna Gabriella",
        "rating": 5,
        "text": "Great service at ZAP, everything was smooth and comfortable, and thank you to Kak Aju for being so kind and helpful throughout the process.",
        "time": "3 months ago"
      }
    ]
  },


  "the-bucketlist-indonesia": {
    "name": "The Bucketlist Indonesia",
    "category": "Sports & Recreation Center",
    "city": "jambu 2 bogor",
    "rating": 4.9,
    "reviewCount": 624,
    "phone": "+62 851-5899-1668",
    "address": "Jl. R. H. Moh. Tohir No.1, RT.07/RW.10, Tanah Baru, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16154, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=7175524329799667925&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6285158991668",
    "tagline": "The ultimate destination for basketball, sports culture, and a great hangout spot.",
    "iconEmoji": "🏀",
    "doctor": {
      "name": "Dr. Slam Dunk",
      "role": "Sports Physiotherapist",
      "avatarEmoji": "⛹️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya mengalami nyeri lutut setelah bermain basket. Bisakah Anda membantu?",
        "doctor": "Tentu, nyeri lutut setelah berolahraga adalah keluhan umum. Penting untuk mengevaluasi penyebabnya, apakah itu cedera ligamen, meniskus, atau masalah otot. Kami bisa melakukan pemeriksaan menyeluruh dan merancang program rehabilitasi yang tepat agar Anda bisa kembali bermain dengan aman.",
        "recommendationTitle": "Konsultasi & Fisioterapi Cedera Olahraga",
        "recommendationDesc": "Penanganan komprehensif untuk cedera lutut, pergelangan kaki, bahu, dan lainnya yang berkaitan dengan aktivitas olahraga. Fokus pada pemulihan fungsi dan pencegahan cedera berulang."
      }
    },
    "categories": [
      "Basketball Court",
      "Sports Museum",
      "Cafe",
      "Restaurant",
      "Sports Apparel Store",
      "Recreation Center"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Espresso",
        "desc": "Rich, strong coffee shot.",
        "price": "IDR 25.000",
        "category": "Beverage"
      },
      {
        "id": 2,
        "name": "Cappuccino",
        "desc": "Espresso with steamed milk and a layer of foam.",
        "price": "IDR 35.000",
        "category": "Beverage"
      },
      {
        "id": 3,
        "name": "Chicken Sandwich",
        "desc": "Grilled chicken breast with fresh vegetables on toasted bread.",
        "price": "IDR 55.000",
        "tag": "Best Seller",
        "category": "Food"
      },
      {
        "id": 4,
        "name": "French Fries",
        "desc": "Crispy golden potato fries, served with ketchup.",
        "price": "IDR 30.000",
        "category": "Food"
      },
      {
        "id": 5,
        "name": "Milkshake Chocolate",
        "desc": "Creamy chocolate milkshake topped with whipped cream.",
        "price": "IDR 40.000",
        "category": "Beverage"
      }
    ],
    "reviews": [
      {
        "authorName": "Gloria Stefanie Wiguna",
        "rating": 5,
        "text": "I’ve been here quite often to rent a court, but this was actually my first time checking out the museum area. Don’t expect a huge museum, but if you’re a basketball fan, you’ll enjoy seeing the collection—jerseys, shoes, trophies, and memorabilia from famous players around the world. About an hour is more than enough to walk around, take photos, and enjoy the displays. Ticket prices vary between weekdays and weekends, but if I’m not mistaken, it’s under IDR 100,000 per person. You can always check with their admin to be sure. At least it’s worth visiting once. They also have a store selling shoes and apparel in front of the museum on the 2nd floor, and another one on the ground floor. Don’t forget to check out the restaurant too. For those waiting while their partner or kids are practicing basketball, there are comfortable spots to hang out and wait. 👍",
        "time": "7 months ago"
      },
      {
        "authorName": "Restu Wibowo",
        "rating": 5,
        "text": "Training at The Bucketlist Indonesia is just on another level. The field is spacious and comfortable, the facilities are excellent—it makes every session feel effortless and enjoyable. #DuckRaceBasketball",
        "time": "6 months ago"
      },
      {
        "authorName": "Kong Wen Sheng",
        "rating": 5,
        "text": "This place is amazing!!! This has got to be the greatest NBA collection and SEA basketball pride gallery in the region. Jibran, who works there as guide, is very professional in his work as he shares all the information and background of almost every piece of artifact as we walk. From the local stars to NBA legends, Jibran knows his basketball stuff very well. I’ve totally enjoyed my stay here, from items to interaction, it’s perfect.",
        "time": "2 years ago"
      },
      {
        "authorName": "Frans Xaverius",
        "rating": 5,
        "text": "The best basketball court in the world 🏀",
        "time": "3 months ago"
      },
      {
        "authorName": "Armand G",
        "rating": 5,
        "text": "Located in The Bucket List, an international standard basketball court, The Bucket List Kitchen is the best basketball theme cafe/restaurant in Indonesia, it's a perfect place to hangout with your family and friends. All the foods and drinks in the menu have great taste, the service is excellent too!",
        "time": "5 years ago"
      }
    ]
  },


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
    "tagline": "Pelayanan terbaik untuk kesehatan hewan kesayangan Anda.",
    "iconEmoji": "🐾",
    "doctor": {
      "name": "Drh. Galuh Indro D.",
      "role": "Chief Veterinarian",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Kucing saya terlihat lesu dan tidak mau makan, apakah perlu dibawa ke klinik?",
        "doctor": "Tentu, sepertinya kucing Anda membutuhkan pemeriksaan. Gejala lesu dan tidak nafsu makan bisa jadi tanda beberapa kondisi. Mohon segera bawa kucing Anda ke klinik agar bisa kami periksa dan berikan penanganan yang tepat. Apakah ada gejala lain yang Anda perhatikan?",
        "recommendationTitle": "Pentingnya Pemeriksaan Rutin Hewan Peliharaan",
        "recommendationDesc": "Pemeriksaan rutin sangat penting untuk mendeteksi masalah kesehatan pada hewan peliharaan sejak dini. Perubahan perilaku seperti lesu atau hilangnya nafsu makan bisa menjadi indikator awal penyakit serius. Jangan tunda untuk berkonsultasi dengan dokter hewan."
      }
    },
    "categories": [
      "Klinik Hewan",
      "Dokter Hewan",
      "Grooming Hewan",
      "Perawatan Hewan"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan Umum",
        "desc": "Pemeriksaan kesehatan menyeluruh untuk hewan peliharaan Anda.",
        "price": "Rp 75.000",
        "category": "Layanan Medis"
      },
      {
        "id": 2,
        "name": "Vaksinasi Kucing",
        "desc": "Vaksinasi lengkap untuk melindungi kucing Anda dari berbagai penyakit.",
        "price": "Rp 150.000",
        "tag": "Populer",
        "category": "Vaksinasi"
      },
      {
        "id": 3,
        "name": "Grooming Kucing",
        "desc": "Layanan mandi, potong kuku, dan pembersihan telinga untuk kucing.",
        "price": "Rp 100.000",
        "category": "Perawatan"
      },
      {
        "id": 4,
        "name": "Pemeriksaan Darah",
        "desc": "Analisis darah lengkap untuk deteksi dini masalah kesehatan.",
        "price": "Rp 180.000",
        "category": "Layanan Medis"
      },
      {
        "id": 5,
        "name": "Operasi Sterilisasi Kucing",
        "desc": "Prosedur sterilisasi aman untuk kucing jantan dan betina.",
        "price": "Mulai dari Rp 500.000",
        "tag": "Prioritas",
        "category": "Bedah"
      }
    ],
    "reviews": [
      {
        "authorName": "Raudhia Aulia",
        "rating": 5,
        "text": "very helpful, handled my cats very well even when they were on the verge of critical condition because of panleukopenia virus. they are alive. having so much patience everytime they act up during the grooming session. doctors are very helpful. still one of recommended veterinarian i'd always choose for my cats.",
        "time": "2 years ago"
      },
      {
        "authorName": "Ari Reshya",
        "rating": 5,
        "text": "I always bring my cats here for grooming, as they come out clean and smelling good, also the cost is affordable. There are often discounts for members and non-members. The vet is communicative and explains everything clearly.",
        "time": "3 years ago"
      },
      {
        "authorName": "Minarno Aji Prabowo (Bowo)",
        "rating": 5,
        "text": "Excellent service with hospitable staff. They kept their customers informed even during a procedure. The price was quite affordable compare to its nearby competitors. They even gave assistant during in-house treatment via WhatsApp. Thank you",
        "time": "5 years ago"
      },
      {
        "authorName": "Chandra Hermawan",
        "rating": 5,
        "text": "Comfortable place with great service. More expensive than standard.",
        "time": "7 years ago"
      },
      {
        "authorName": "Fahmi Hidayat",
        "rating": 5,
        "text": "Good service with affordable price",
        "time": "4 years ago"
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
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "62895418307958",
    "tagline": "Your trusted partner for comprehensive health care.",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dokter Titania",
      "role": "Dokter Umum",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Saya merasa demam dan batuk selama beberapa hari, Dok.",
        "doctor": "Baik, mari kita periksa gejala Anda. Apakah ada nyeri tenggorokan atau sesak napas?",
        "recommendationTitle": "Konsultasi Demam & Batuk",
        "recommendationDesc": "Dokter akan melakukan pemeriksaan fisik dan mungkin menyarankan tes lebih lanjut jika diperlukan untuk menentukan diagnosis dan pengobatan terbaik."
      }
    },
    "categories": [
      "Klinik Umum",
      "Kesehatan Keluarga",
      "Poli Umum"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan kesehatan dan konsultasi menyeluruh dengan dokter umum.",
        "price": "Mulai dari Rp 50.000",
        "category": "Layanan Dasar"
      },
      {
        "id": 2,
        "name": "Terapi Sendi Lutut",
        "desc": "Layanan terapi khusus untuk meningkatkan pelumasan dan kesehatan sendi lutut.",
        "price": "Harga dapat bervariasi",
        "tag": "Spesial",
        "category": "Terapi"
      },
      {
        "id": 3,
        "name": "Pemeriksaan Kesehatan Rutin",
        "desc": "Pemeriksaan kesehatan umum untuk memantau kondisi tubuh dan pencegahan penyakit.",
        "price": "Mulai dari Rp 75.000",
        "category": "Layanan Dasar"
      }
    ],
    "reviews": [
      {
        "authorName": "Sely Rhania",
        "rating": 5,
        "text": "The service is good again, the doctor has now changed to Doctor Titania, who is communicative, and the consultation is also comfortable."
      },
      {
        "authorName": "Tasya Arcania",
        "rating": 5,
        "text": "The service is good, the place is clean, the doctor and other staff are very friendly😊"
      },
      {
        "authorName": "SUSILAWATI ES",
        "rating": 5,
        "text": "The first time I got treatment, my brother recommended it because the service was good and it turned out to be really good, in fact it was really good, the second time I registered because I wanted knee joint lubricant therapy on Friday Barakallah for free, the service was really good, the doctor was friendly and handsome according to my mom 🥰, because my mom was the one who got treatment, masyaallah the clinic is blessed, the doctor and all the employees, hopefully it will be more trustworthy and run smoothly, it is highly recommended 🥰 if you have subscribed, this clinic usually shares certain treatments for free every Friday Barakallah, of course with a limited quota, good luck☺"
      },
      {
        "authorName": "Lutfi Abdul Aziz",
        "rating": 5,
        "text": "The place is clean, the service is good and fast, the doctor is also very good, top notch"
      },
      {
        "authorName": "Citra Lestari",
        "rating": 5,
        "text": "The location is strategic, the cost is cheaper, the service is also good, the doctor is friendly and patient in answering my questions, the price is also affordable. Thank you, doc."
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
    "tagline": "Your trusted partner for healthy smiles in Ciomas, Bogor.",
    "iconEmoji": "🦷",
    "doctor": {
      "name": "Drg IIK YANI HIDAYATI, MM",
      "role": "Dentist",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "I have a toothache, what should I do?",
        "doctor": "Hello! I'm sorry to hear that. To determine the cause, I recommend scheduling an appointment so we can examine it. In the meantime, you can try rinsing your mouth with warm salt water.",
        "recommendationTitle": "Schedule a Consultation",
        "recommendationDesc": "Book an appointment with Dr. Iik Yani Hidayati for a thorough examination and personalized treatment plan."
      }
    },
    "categories": [
      "Dental Clinic",
      "General Dentistry",
      "Pediatric Dentistry",
      "Cosmetic Dentistry",
      "Orthodontics"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Pemeriksaan Gigi dan Konsultasi",
        "desc": "Pemeriksaan menyeluruh dan konsultasi dengan dokter gigi.",
        "price": "Rp 100.000",
        "category": "Layanan Umum"
      },
      {
        "id": 2,
        "name": "Scaling Gigi (Pembersihan Karang Gigi)",
        "desc": "Prosedur pembersihan karang gigi untuk menjaga kesehatan mulut.",
        "price": "Rp 250.000",
        "category": "Layanan Umum"
      },
      {
        "id": 3,
        "name": "Penambalan Gigi (Light Curing)",
        "desc": "Perbaikan gigi berlubang dengan bahan komposit sewarna gigi.",
        "price": "Mulai Rp 300.000",
        "category": "Restorasi"
      },
      {
        "id": 4,
        "name": "Pencabutan Gigi",
        "desc": "Prosedur pencabutan gigi yang tidak dapat dipertahankan lagi.",
        "price": "Mulai Rp 200.000",
        "category": "Bedah Mulut"
      },
      {
        "id": 5,
        "name": "Pemasangan Kawat Gigi (Orthodonti)",
        "desc": "Koreksi susunan gigi untuk tampilan dan fungsi yang lebih baik.",
        "price": "Mulai Rp 5.000.000",
        "category": "Ortodonti"
      },
      {
        "id": 6,
        "name": "Bleaching Gigi (Pemutihan Gigi)",
        "desc": "Prosedur untuk mencerahkan warna gigi Anda.",
        "price": "Mulai Rp 1.500.000",
        "category": "Kosmetik"
      }
    ],
    "reviews": [
      {
        "authorName": "Shafa Fadhilah Azzahra",
        "rating": 5,
        "text": "good!",
        "time": "3 years ago"
      },
      {
        "authorName": "rika",
        "rating": 5,
        "text": "good service",
        "time": "3 years ago"
      },
      {
        "authorName": "sarbini as",
        "rating": 5,
        "text": "good service",
        "time": "3 years ago"
      },
      {
        "authorName": "Yulianti Juhendah",
        "rating": 1,
        "text": "I've been a regular customer with Dr. Iik for years, she's very kind and patient, but now I'm disappointed with Dr. Adrian's service... my child was treated by Dr. Adrian. The service was very bad, rude, arrogant, and lacked explanation about the procedures that would be performed on my child. Until my child cried in pain, he was shouted at instead of being coaxed. Hopefully Dr. Iik will be more selective or give advice to his practice. And hopefully Dr. Adrian can use this post as constructive criticism and can be better in the future.",
        "time": "8 months ago"
      },
      {
        "authorName": "Yulia Rahmawati",
        "rating": 1,
        "text": "DISAPPOINTED, you had to fill your teeth back and forth more than 5 times, and within a matter of months the filling fell out, and there was no answer on your WhatsApp for a solution😫",
        "time": "2 months ago"
      }
    ]
  },


  "dr-erlin-spa-dokter-anak-rskia-sawojajar": {
    "name": "dr. Erlin, SpA (Dokter anak RSKIA Sawojajar)",
    "category": "Pediatrician",
    "city": "ciomas bogor",
    "rating": 5.0,
    "reviewCount": 127,
    "phone": "+62 877-7832-4371",
    "address": "Jl. Sawojajar No.9, Pabaton, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16121, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=6458399768149915422&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6287778324371",
    "tagline": "Pakar Kesehatan Anak Terpercaya di Bogor",
    "iconEmoji": "👶",
    "doctor": {
      "name": "dr. Erlin, SpA",
      "role": "Dokter Spesialis Anak",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dokter, anak saya batuk pilek sudah beberapa hari dan demam tinggi, apakah perlu segera dibawa ke klinik?",
        "doctor": "Halo Bu, sebaiknya segera dibawa ke klinik untuk pemeriksaan lebih lanjut ya. Demam tinggi pada anak perlu penanganan cepat untuk memastikan penyebab dan mencegah komplikasi.",
        "recommendationTitle": "Langkah Awal Penanganan Batuk Pilek dan Demam pada Anak",
        "recommendationDesc": "Pastikan anak mendapatkan istirahat yang cukup, berikan cairan yang banyak seperti air putih atau oralit, dan kompres hangat jika demam tinggi. Hindari memberikan obat tanpa resep dokter."
      }
    },
    "categories": [
      "Pediatrics",
      "Child Health",
      "Dokter Anak",
      "Klinik Anak"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Pediatri",
        "desc": "Pemeriksaan kesehatan umum, diagnosis penyakit anak, dan penanganan awal.",
        "price": "Mulai Rp 150.000",
        "category": "Layanan Medis"
      },
      {
        "id": 2,
        "name": "Vaksinasi & Imunisasi",
        "desc": "Pemberian vaksin dan imunisasi lengkap sesuai jadwal rekomendasi IDAI.",
        "price": "Bervariasi",
        "category": "Layanan Medis"
      },
      {
        "id": 3,
        "name": "Konsultasi Tumbuh Kembang",
        "desc": "Evaluasi dan pendampingan tumbuh kembang anak dari usia bayi hingga remaja.",
        "price": "Mulai Rp 175.000",
        "category": "Layanan Medis"
      },
      {
        "id": 4,
        "name": "Pemeriksaan Kesehatan Anak",
        "desc": "Cek kesehatan rutin, skrining, dan pemantauan kondisi anak secara berkala.",
        "price": "Mulai Rp 120.000",
        "category": "Layanan Medis"
      }
    ],
    "reviews": [
      {
        "authorName": "Indri Ratnasari",
        "rating": 5,
        "text": "😍👍🏻",
        "time": "3 years ago"
      },
      {
        "authorName": "Putri Puspita",
        "rating": 5,
        "text": "A sick child while the doctor is on leave is a real headache, I was looking for a child-friendly pediatrician until I found Dr. Erlin on Google, then I saw her Instagram, and it turns out she is really good, really child-friendly, her explanations are calming, no wonder there are so many consultations 😁, thanks doc",
        "time": "3 months ago"
      },
      {
        "authorName": "Hilya Elmirakanaya",
        "rating": 5,
        "text": "Dear beautiful and kind Doctor Erlin, thank you, Doctor. This is the first time I've met a DSA who examines my child's health in such detail. Even without asking, the doctor tells me everything. Stay healthy, Doctor Erlin🥰😇",
        "time": "3 months ago"
      },
      {
        "authorName": "Syifa Khoerotunnisa",
        "rating": 5,
        "text": "In November, Makky had an ear infection. Finally, she Googled a pediatrician in Bogor and found Dr. Erlin, who had 5-star reviews. Thankfully, she recovered immediately after the visit. In early February, Makky had a fever, which was diagnosed as dengue fever, and Dr. Erlin recommended hospitalization. After a week in the hospital, thank God, she recovered. Thank you, Doctor, for always helping Makky recover so well, quickly, quickly, and with such calm. 🤍✨🌻 Always healthy and successful, Doctor 🤍🤍",
        "time": "2 years ago"
      },
      {
        "authorName": "Sasi Siti Nuraeni",
        "rating": 5,
        "text": "Dear Dr. Erlin, thank you for being a pleasant, calming, and friendly pediatrician. My nephew immediately fell in love with the Sawojajar Child and went back there ❤️",
        "time": "7 months ago"
      }
    ]
  },


  "rumah-keisya": {
    "name": "RUMAH KEISYA",
    "category": "Medical Clinic",
    "city": "Ciomas Bogor",
    "rating": 4.5,
    "reviewCount": 553,
    "phone": "",
    "address": "9QXJ+GP5, RT.04/RW.04, Pasirkuda, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16119, Indonesia",
    "googleMapsUrl": "https://maps.google.com/?cid=8425839679768306770&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA",
    "hours": "Senin - Sabtu: 09:00 - 20:00",
    "waNumber": "6281234567890",
    "tagline": "Pusat Kesehatan Keluarga Terpercaya di Bogor",
    "iconEmoji": "🏥",
    "doctor": {
      "name": "Dr. Sarah Wijaya",
      "role": "General Practitioner",
      "avatarEmoji": "👩‍⚕️",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      "sampleChat": {
        "user": "Dok, anak saya demam dan batuk sudah 3 hari.",
        "doctor": "Baik, Bu. Kita perlu periksa lebih lanjut untuk mengetahui penyebabnya. Apakah ada gejala lain seperti pilek atau sakit tenggorokan?",
        "recommendationTitle": "Jadwalkan Konsultasi Umum",
        "recommendationDesc": "Untuk diagnosa dan penanganan lebih lanjut terkait demam dan batuk anak Anda."
      }
    },
    "categories": [
      "Klinik Umum",
      "Kesehatan Anak",
      "Poli Gigi",
      "Vaksinasi"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi Dokter Umum",
        "desc": "Pemeriksaan kesehatan umum dan diagnosa awal.",
        "price": "Rp 100.000",
        "category": "Layanan Umum"
      },
      {
        "id": 2,
        "name": "Imunisasi Anak",
        "desc": "Berbagai jenis imunisasi untuk anak sesuai jadwal.",
        "price": "Mulai dari Rp 250.000",
        "tag": "Populer",
        "category": "Kesehatan Anak"
      },
      {
        "id": 3,
        "name": "Pembersihan Gigi",
        "desc": "Scaling gigi untuk menjaga kebersihan dan kesehatan mulut.",
        "price": "Rp 150.000",
        "category": "Perawatan Gigi"
      }
    ],
    "reviews": [
      {
        "authorName": "Abdullah Gabban",
        "rating": 5,
        "text": "Best klinik in Bogor and Indonesia. Alhamdullah we get great service with Amanah and professionalism. We dont know how to thanks the doctor and staff for thier efforts. Thank you Doktor thank you staff",
        "time": "3 years ago"
      },
      {
        "authorName": "evry",
        "rating": 5,
        "text": "all good 🤗",
        "time": "3 months ago"
      },
      {
        "authorName": "Heny Wardhana",
        "rating": 5,
        "text": "The Best Doctor For My Son",
        "time": "3 years ago"
      },
      {
        "authorName": "Widia Citra",
        "rating": 1,
        "text": "This should be my first and last consultation.",
        "time": "3 years ago"
      },
      {
        "authorName": "Yoga Saputra",
        "rating": 5,
        "text": "good service 👍🏾👍🏾👍🏾",
        "time": "a year ago"
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
    "tagline": "Pakar THT terpercaya dengan pelayanan cepat, presisi, dan profesional di Bogor.",
    "iconEmoji": "👂👃",
    "doctor": {
      "name": "Dr. Adisetya W Sp.THT-BKL",
      "role": "Dokter Spesialis Telinga Hidung & Tenggorok",
      "avatarEmoji": "👨‍⚕️",
      "avatarUrl": "null",
      "sampleChat": {
        "user": "Dok, telinga saya terasa tersumbat dan kadang disertai sakit kepala.",
        "doctor": "Selamat datang, mari kita periksa untuk mengetahui penyebabnya. Berdasarkan gejala Anda, kemungkinan ada penumpukan kotoran atau infeksi. Penanganan cepat sangat penting.",
        "recommendationTitle": "Pembersihan Telinga & Diagnosa Lanjut",
        "recommendationDesc": "Direkomendasikan pembersihan telinga profesional untuk mengatasi penyumbatan dan diagnosa lebih lanjut untuk memastikan tidak ada infeksi serius, diikuti dengan resep obat yang efektif."
      }
    },
    "categories": [
      "THT",
      "Spesialis Telinga Hidung Tenggorok",
      "Klinik Dokter",
      "Pembersihan Telinga",
      "Perawatan Hidung",
      "Perawatan Tenggorok"
    ],
    "menu": [
      {
        "id": 1,
        "name": "Konsultasi & Pemeriksaan THT",
        "desc": "Pemeriksaan menyeluruh telinga, hidung, dan tenggorok oleh Dokter Spesialis THT.",
        "price": "Mulai dari Rp 250.000",
        "category": "Layanan Medis"
      },
      {
        "id": 2,
        "name": "Pembersihan Serumen Telinga",
        "desc": "Prosedur pembersihan kotoran telinga (serumen) yang menumpuk.",
        "price": "Mulai dari Rp 250.000 - Rp 350.000",
        "tag": "Populer",
        "category": "Layanan Medis"
      },
      {
        "id": 3,
        "name": "Obat-obatan Resep",
        "desc": "Obat-obatan yang diresepkan oleh dokter sesuai dengan diagnosa dan kebutuhan pasien.",
        "price": "Bervariasi",
        "category": "Farmasi"
      }
    ],
    "reviews": [
      {
        "authorName": "Fitri Handayani",
        "rating": 5,
        "text": "The doctor is nice and easy to talk to. His actions are also fast and precise, no pain, he is very professional, the prescription is solid, a day is already better, the doctor's consultation fee is 250, for the medicine depends on the complaint, but it seems the doctor recommends a good medicine so it is very effective. For people who say the doctor's fees and the medicine are too expensive, I just want to say hey this is from an independent practice, going to a specialist in an independent practice is definitely expensive, at least prepare 700 for the doctor and medicine. But the service and medicine are very satisfying, the wait is not that long, if you want it cheap, you can use BPJS but go to the hospital and have to queue plus bring referral letters.",
        "time": "5 months ago"
      },
      {
        "authorName": "Firdha Ainnaya",
        "rating": 5,
        "text": "Thank God I found a good and excellent ENT doctor in Bogor. In April, I got my ears cleaned for 250,000 rupiah and was prescribed medicine for around 100,000 rupiah. Then this month, my husband got his ears cleaned for 350,000 rupiah (increased 😭) and was prescribed medicine for 159,000 rupiah. On Saturdays, Doctor Adi practices from 1:30-3:00 PM and 7:00-9:00 PM (for further information, you can WhatsApp the number in the photo, fast response 😊). The location is at Yasa Pharmacy, inside many specialist doctors. The car park is quite spacious, it can fit four cars. Thank you to the doctor and the friendly staff 😄",
        "time": "a year ago"
      },
      {
        "authorName": "Putri Rasthika Widuri",
        "rating": 5,
        "text": "Thank God, I met Dr. Adisetya here, so I didn't have to go to the hospital. After receiving treatment here, my hearing returned to normal, having previously been clouded (covered by dirt) due to an infection and severe headaches. The doctor acted quickly after hearing the patient's complaint. It's best to contact me via WhatsApp first to register. The cost of the consultation and procedure is around 250,000-300,000 Rupiah. This does not include medication that can be purchased at Yasa pharmacies. In my case, the medication alone was quite expensive, 423,000 Rupiah (it varies from person to person). The doctor was very friendly, and didn't rush his explanations. The admin was also friendly and prompt. Payment can only be made in cash or by bank transfer. Thank you, doctor. Stay healthy, doc!",
        "time": "a year ago"
      },
      {
        "authorName": "Katarina Hesty Rombe",
        "rating": 5,
        "text": "The admin is super friendly and very helpful. He's communicative when asked questions via WhatsApp. The doctor was also very friendly during the consultation. The equipment is complete. My hearing was initially blocked due to earwax buildup in my right ear, but after the treatment, my hearing cleared up completely. The procedure cost 300,000 rupiah per visit. The medication cost 96,500 rupiah, which was immediately redeemed at Yasa Pharmacy. Motorcycle parking is 2,000 rupiah. The parking is also very good. Thank you, doctor and admin 🤩",
        "time": "a year ago"
      },
      {
        "authorName": "Unul Rosihan",
        "rating": 5,
        "text": "The doctor was very friendly, and his explanations were detailed. \"Good health, doctor. Yesterday, he seemed so tired that he was out of breath, but he still served the patient well 🫶🏻🙏🏻",
        "time": "a year ago"
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
