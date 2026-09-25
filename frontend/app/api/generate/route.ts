import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Generate a URL-friendly slug from the business name
function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const uniqueId = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${uniqueId}`;
}

// Normalize phone number to consistent 628... format
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  }
  return digits;
}

// Map Google Places primaryType ke Kategori kita
function mapPrimaryTypeToCategory(primaryType: string, fallbackCategory: string): string {
  const type = primaryType.toLowerCase();

  const fnb = ['restaurant', 'cafe', 'coffee_shop', 'bakery', 'bar', 'fast_food_restaurant', 'meal_takeaway', 'ice_cream_shop'];
  const grooming = ['beauty_salon', 'barber_shop', 'spa', 'hair_care', 'massage_spa', 'nail_salon'];
  const clinic = ['medical_clinic', 'dentist', 'doctor', 'hospital', 'veterinary_care', 'pharmacy'];
  const retail = ['pet_store', 'florist', 'clothing_store', 'electronics_store', 'supermarket', 'convenience_store', 'hardware_store', 'store'];

  if (fnb.includes(type)) return 'Cafe'; // atau Resto
  if (grooming.includes(type)) return 'Salon / Barbershop';
  if (clinic.includes(type)) return 'Klinik';
  if (retail.includes(type)) return 'Retail';

  return fallbackCategory;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, phone, city, mapsUrl, force } = body;

    // Validate required fields
    if (!name || !category || !phone || !city || !mapsUrl) {
      return NextResponse.json(
        { error: 'All fields (name, category, phone, city, mapsUrl) are required.' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    // 1. Check if this phone number already generated a template
    const { data: existingData, error: findError } = await supabase
      .from('business_demos')
      .select('slug')
      .eq('phone', normalizedPhone)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: 'Failed to verify existing records.' }, { status: 500 });
    }

    if (existingData) {
      return NextResponse.json({ success: true, slug: existingData.slug, isExisting: true });
    }

    // 2. Validasi ke Google Places API (New)
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
      return NextResponse.json({ error: 'Google Maps API Key not configured.' }, { status: 500 });
    }

    // Unfurl Maps URL to extract coordinates or use it as fallback
    let finalUrl = mapsUrl;
    try {
      const urlRes = await fetch(mapsUrl, { redirect: 'follow' });
      finalUrl = urlRes.url;
    } catch (e) {
      console.error("URL Resolve error:", e);
    }

    // Extract coordinates and Place Name from URL if possible
    let lat = null;
    let lng = null;
    let urlPlaceName = null;

    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || finalUrl.match(/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/);
    if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lng = parseFloat(coordMatch[2]);
    }

    const placeMatch = finalUrl.match(/\/place\/([^\/]+)\//);
    if (placeMatch) {
      urlPlaceName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    }

    // Jika URL adalah link valid ke sebuah bisnis (bukan sekadar dropped pin jalanan), kita sudah tahu nama aslinya
    if (urlPlaceName && !force) {
      const inputName = name.toLowerCase();
      const realNameLower = urlPlaceName.toLowerCase();

      const ignoreWords = ['kopi', 'warung', 'toko', 'klinik', 'cafe', 'salon', 'apotek'];
      const inputWords = inputName.split(' ').filter((w: string) => w.length > 2 && !ignoreWords.includes(w));

      let hasMeaningfulMatch = false;
      if (inputWords.length === 0) {
        hasMeaningfulMatch = realNameLower.includes(inputName);
      } else {
        hasMeaningfulMatch = inputWords.some((w: string) => realNameLower.includes(w));
      }

      if (!hasMeaningfulMatch && !realNameLower.includes(inputName) && !inputName.includes(realNameLower)) {
        return NextResponse.json({
          needsConfirmation: true,
          realName: urlPlaceName
        });
      }
    }

    const searchQuery = urlPlaceName ? urlPlaceName : (lat && lng ? name : `${name} ${city}`);

    const placesUrl = "https://places.googleapis.com/v1/places:searchText";
    const placesHeaders = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": googleApiKey,
      "X-Goog-FieldMask": "places.displayName,places.primaryType,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri,places.reviews"
    };

    const placesPayload: any = {
      textQuery: searchQuery,
      languageCode: "id"
    };

    if (lat && lng) {
      // Gunakan locationBias, searchText tidak support circle di locationRestriction
      placesPayload.locationBias = {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 100.0 // 100 meters
        }
      };
    }

    const placesRes = await fetch(placesUrl, {
      method: 'POST',
      headers: placesHeaders,
      body: JSON.stringify(placesPayload)
    });

    const placesData = await placesRes.json();
    let places = placesData.places || [];

    // Jika pencarian menghasilkan bisnis yang namanya melenceng jauh (Fuzzy Match dari Google), kita validasi.
    if (places.length > 0 && !force) {
      const originalPlaceName = places[0].displayName?.text || "";
      const firstMatchName = originalPlaceName.toLowerCase();
      const inputName = name.toLowerCase();

      // Hitung kata yang cocok (abaikan kata generik seperti kopi, warung, toko, klinik)
      const ignoreWords = ['kopi', 'warung', 'toko', 'klinik', 'cafe', 'salon', 'apotek'];
      const inputWords = inputName.split(' ').filter((w: string) => w.length > 2 && !ignoreWords.includes(w));

      let hasMeaningfulMatch = false;
      if (inputWords.length === 0) {
        // Jika input hanya berisi kata generik (misal: "Kopi"), kita cek apakah input ada di nama hasil
        hasMeaningfulMatch = firstMatchName.includes(inputName);
      } else {
        hasMeaningfulMatch = inputWords.some((w: string) => firstMatchName.includes(w));
      }

      if (!hasMeaningfulMatch && !firstMatchName.includes(inputName) && !inputName.includes(firstMatchName)) {
        // Nama terlalu melenceng (Google mengembalikan rekomendasi acak atau nama aslinya beda)
        if (lat && lng) {
          // Jika URL valid (ada titik), mungkin mereka salah input nama. Minta konfirmasi!
          return NextResponse.json({
            needsConfirmation: true,
            realName: originalPlaceName
          });
        } else {
          // Jika tidak ada URL dan nama melenceng jauh, tolak langsung.
          places = [];
        }
      }
    }

    // Jika tidak ditemukan di Google Maps, tolak registrasi
    if (places.length === 0) {
      return NextResponse.json(
        { error: 'Bisnis tidak ditemukan di Google Maps. Pastikan URL Maps valid atau Nama sesuai dengan yang terdaftar.' },
        { status: 404 }
      );
    }

    // Ambil hasil teratas
    const place = places[0];
    const realName = place.displayName?.text || name;
    const realAddress = place.formattedAddress || city;
    const rating = place.rating || 4.5;
    const reviewCount = place.userRatingCount || 0;
    const primaryType = place.primaryType || 'store';

    // (Fitur ekstraksi foto Google Maps ditiadakan, sistem akan skip url gambar bisnis)

    // Override kategori jika terjadi mis-match
    const adjustedCategory = mapPrimaryTypeToCategory(primaryType, category);

    // 4. Proses Ulasan (Maksimal 3 ulasan teratas)
    let reviewsText = "";
    if (place.reviews && place.reviews.length > 0) {
      reviewsText = "Data Ulasan Asli dari Pelanggan:\n";
      place.reviews.slice(0, 3).forEach((rev: any, idx: number) => {
        const author = rev.authorAttribution?.displayName || "Anonim";
        const rtg = rev.rating || 5;
        const text = rev.text?.text || "";
        const time = rev.relativePublishTimeDescription || "";
        reviewsText += `${idx + 1}. [${rtg}⭐] ${author} (${time}): "${text}"\n`;
      });
    }

    // (photosText ditiadakan)

    // 5. Generate JSON menggunakan Gemini AI
    const prompt = `
      Kamu adalah sistem AI pembuat struktur data UI cerdas.
      Buatkan data JSON (Metadata) untuk dirender di website katalog bisnis.
      
      Detail Bisnis:
      - Nama: ${realName}
      - Kategori Spesifik (Maps): ${primaryType}
      - Kategori Umum (Frontend): ${adjustedCategory}
      - Rating: ${rating} (${reviewCount} ulasan)
      - Telepon/WA: ${normalizedPhone}
      - Alamat: ${realAddress}
      
      ${reviewsText}

      
      Panduan Konten:
      1. Buatkan "tagline" yang menarik & profesional dalam bahasa Indonesia. WAJIB sangat singkat (Maksimal 6-8 kata, atau sekitar 50 karakter) agar tidak merusak estetika UI.
      2. Buatkan "hours" (Jam Operasional) berupa teks, misal: "Senin - Minggu: 09:00 - 22:00". Sebagai field terpisah di root JSON, buat juga "openTime" (misal "09:00") dan "closeTime" (misal "22:00").
      3. Tentukan "themeColor" hex code yang cocok dengan industri ${adjustedCategory}.
      4. Buatkan "fbType" (DINE_IN / QUICK_SERVICE / PRE_ORDER) khusus jika ini F&B. Jika bukan, kosongkan.
      5. Isi array "categories" minimal dengan ["Semua", "Kategori A", "Kategori B"].
      6. Buatkan array "menu" atau "products" berisi 4-5 layanan/produk utama dengan harga yang logis untuk di Indonesia.
         Format item: { "id": 1, "name": "...", "desc": "...", "price": "Rp ...", "category": "Kategori A", "duration": 45 }
      7. Jika bisnis ini Klinik/Salon/Jasa, buat object "doctor" { name, role, sampleChat: { user, doctor, recommendationTitle, recommendationDesc } }. 
         Jika ini Kafe/Retail, buat profil Admin Reservasi.
      8. Salin ulasan pelanggan ke property "reviews": [{ authorName, rating, text, time }].
      
      WAJIB kembalikan RAW JSON yang valid, tanpa awalan \`\`\`json.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const generatedText = result.response.text();
    let metadata;
    try {
      metadata = JSON.parse(generatedText);
      // Ensure the metadata overrides the basic fields with the correct ones
      metadata.rating = rating;
      metadata.reviewCount = reviewCount;
      metadata.address = realAddress;
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', e);
      return NextResponse.json({ error: 'AI Gagal memproses data. Coba lagi.' }, { status: 500 });
    }

    const slug = generateSlug(realName);

    // 6. Simpan ke Supabase beserta metadata
    const { data, error } = await supabase
      .from('business_demos')
      .insert([
        {
          slug,
          name: realName,
          category: adjustedCategory,
          phone: normalizedPhone,
          city,
          maps_url: mapsUrl,
          metadata: metadata,
          scraping_status: 'completed'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: 'Gagal menyimpan demo ke database.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug: data.slug, isExisting: false });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
