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
