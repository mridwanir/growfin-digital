from typing import Optional
from google import genai
import re
import json
from config.settings import GEMINI_API_KEY
from core.models import BusinessDemo

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_demo_data_ai(name: str, rating: float, reviews: int, phone: str, address: str, maps_url: str, slug: str, city: str = "Bandung", reviews_data: list = None) -> Optional[dict]:
    """
    Menyusun struktur data JSON (Metadata JSONB) yang generik menggunakan Gemini
    Bisa mengakomodasi F&B, Salon, Retail, Leisure, dll.
    """
    clean_phone = re.sub(r'[^0-9]', '', phone)
    if clean_phone.startswith('0'):
        clean_phone = '62' + clean_phone[1:]
    elif not clean_phone:
        clean_phone = "6281234567890"

    reviews_text = ""
    if reviews_data:
        reviews_text = "- Data Ulasan Asli dari Google Maps:\n"
        for i, rev in enumerate(reviews_data[:5]):
            author = rev.get("authorAttribution", {}).get("displayName", "Anonim")
            rtg = rev.get("rating", 5)
            text = rev.get("text", {}).get("text", "").replace("\n", " ")
            time_str = rev.get("relativePublishTimeDescription", "")
            reviews_text += f"  {i+1}. [{rtg}⭐] {author} ({time_str}): {text}\n"

    prompt = f"""
    Kamu adalah sistem AI pembuat katalog cerdas untuk berbagai sektor bisnis lokal.
    Buatkan struktur data JSON (Metadata) untuk dirender di website demo bisnis berikut:
    - Nama Bisnis: {name}
    - Rating: {rating} ({reviews} ulasan)
    - Telepon: {phone}
    - WA Number: {clean_phone}
    - Alamat: {address}
    - Slug: {slug}
    {reviews_text}

    Panduan Konten:
    1. Identifikasi jenis bisnis ini secara cerdas (contoh: Kafe, Restoran, Salon, Apotek, Pet Shop, Gym, Car Wash, dll).
    2. Buatkan tagline yang menarik.
    3. Buatkan jam operasional yang logis.
    4. Buatkan 3-4 katalog/menu/layanan utama beserta estimasi harganya.
    5. Jika jenis bisnis ini melibatkan konsultan/staf ahli (Salon, Gym), isi objek "doctor" (mewakili profil staf/admin/trainer). 
       Jika ini Kafe/Restoran atau Retail, isi dengan profil Manager/Admin Customer Service.
    6. Salin data ulasan asli ke properti 'reviews'.
    7. Berikan heroImage yang relevan dari URL unspash.

    Wajib return RAW JSON valid yang sesuai dengan skema berikut (tanpa markdown blok):
    {{
      "rating": {rating},
      "reviewCount": {reviews},
      "hours": "Senin - Minggu: 09:00 - 22:00",
      "tagline": "Tagline bisnis yang menarik",
      "iconEmoji": "✨",
      "heroImage": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
      "categories": ["Semua", "Kategori 1", "Kategori 2"],
      "products": [
        {{ "id": 1, "name": "Nama Produk/Layanan 1", "desc": "Deskripsi", "price": "Rp 50.000", "category": "Kategori 1", "imageUrl": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80" }}
      ],
      "menu": [
        {{ "id": 1, "name": "Sama persis seperti isi array products di atas", "desc": "...", "price": "...", "category": "..." }}
      ],
      "doctor": {{
        "name": "Admin / Staf Profesional",
        "role": "Customer Service",
        "avatarEmoji": "👨‍💼",
        "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
        "sampleChat": {{
          "user": "Halo, saya mau bertanya / reservasi.",
          "doctor": "Tentu, silakan beritahu detail pesanan/kunjungan Anda.",
          "recommendationTitle": "Rekomendasi Terbaik",
          "recommendationDesc": "Coba layanan/produk unggulan kami hari ini."
        }}
      }},
      "reviews": [
        {{ "authorName": "Reviewer 1", "rating": 5, "text": "Komentar...", "time": "1 bulan lalu" }}
      ]
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        # Parse JSON and return it as dictionary
        return json.loads(response.text.strip())
    except Exception as e:
        print(f"⚠️ Error Gemini API (Demo JSON): {e}")
        return None