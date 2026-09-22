import os
import re
import json
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from supabase import create_client, Client

load_dotenv()

# ==========================================
# KONFIGURASI API & ENVIRONMENT
# ==========================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# Konfigurasi Supabase (Bisa dari backend env atau frontend .env.local)
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("⚠️ Peringatan: Konfigurasi Supabase tidak ditemukan!")

client = genai.Client(api_key=GEMINI_API_KEY)


def send_telegram_msg(text: str):
    """Kirim pesan notifikasi ke Telegram (Markdown)"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "Markdown"
    }
    try:
        requests.post(url, json=payload, timeout=10)
    except Exception as e:
        print(f"⚠️ Gagal kirim notifikasi Telegram: {e}")


def search_local_businesses(lat: float, lng: float, radius_meters: int = 3000):
    """
    Cari berbagai jenis bisnis B2C/B2B lokal via Google Places API (New)
    Fokus pada Sektor Bervolume Transaksi Cepat: F&B, Personal Care, Retail, Leisure
    """
    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": (
            "places.displayName,places.primaryType,places.rating,"
            "places.userRatingCount,places.formattedAddress,places.websiteUri,"
            "places.internationalPhoneNumber,places.googleMapsUri,places.reviews"
        )
    }
    payload = {
        "includedTypes": [
            # 1. F&B
            "restaurant", "cafe", "coffee_shop", "bakery", "bar",
            # 2. Personal Care & Grooming
            "beauty_salon", "barber_shop", "spa", "hair_care",
            # 3. Daily Consumer Retail
            "pet_store", "veterinary_care", "florist", "pharmacy",
            # 4. Activity & Leisure
            "gym", "car_wash", "sports_club"
        ],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(radius_meters)
            }
        }
    }

    try:
        res = requests.post(url, headers=headers, json=payload, timeout=15)
        if res.status_code == 200:
            return res.json().get("places", [])
        else:
            print(f"❌ Error Places API ({res.status_code}): {res.text}")
            return []
    except Exception as e:
        print(f"⚠️ Request Places API gagal: {e}")
        return []


def check_website_status(website: str) -> str:
    """Mengklasifikasikan status website: 'HOT_LEAD', 'POTENTIAL', atau 'BIASA'"""
    if not website or "google.com" in website or "instagram.com" in website or "linktr.ee" in website or "tiktok.com" in website:
        return "HOT_LEAD"
    
    url = website if website.startswith("http") else "http://" + website
    try:
        res = requests.get(url, timeout=5)
        if res.status_code >= 400:
            return "POTENTIAL"
        return "BIASA"
    except Exception:
        return "POTENTIAL"


def generate_demo_data_ai(name: str, rating: float, reviews: int, phone: str, address: str, maps_url: str, slug: str, reviews_data: list = None) -> dict:
    """
    Menyusun struktur data BusinessDemo (Metadata JSONB) yang generik menggunakan Gemini
    Bisa mengakomodasi F&B, Salon, Retail, hingga Klinik
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
    1. Identifikasi jenis bisnis ini secara cerdas (contoh: Kafe, Restoran, Salon, Apotek, Pet Shop, dll).
    2. Buatkan tagline yang menarik.
    3. Buatkan jam operasional yang logis.
    4. Buatkan 3-4 katalog/menu/layanan utama beserta estimasi harganya.
    5. Jika jenis bisnis ini melibatkan konsultan/staf ahli (Klinik, Salon, Gym), isi objek "doctor" (mewakili profil staf/admin). 
       Jika ini Kafe/Restoran, isi dengan profil Manager/Admin Reservasi.
    6. Salin data ulasan asli ke properti 'reviews'.

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
        {{ "id": 1, "name": "Nama Produk/Layanan 1", "desc": "Deskripsi", "price": "Rp 50.000", "category": "Kategori 1", "imageUrl": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80" }},
        {{ "id": 2, "name": "Nama Produk/Layanan 2", "desc": "Deskripsi", "price": "Rp 75.000", "category": "Kategori 2", "imageUrl": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80" }}
      ],
      "menu": [
        {{ "id": 1, "name": "Sama seperti isi products di atas", "desc": "...", "price": "...", "category": "..." }}
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
        return json.loads(response.text.strip())
    except Exception as e:
        print(f"⚠️ Error Gemini API (Demo JSON): {e}")
        return None


def run_pipeline(lat: float, lng: float, radius: int = 3000):
    print(f"🏢 [1/3] Memindai bisnis lokal bervolume tinggi dalam radius {radius}m...")
    places = search_local_businesses(lat, lng, radius)
    print(f"📍 Ditemukan {len(places)} bisnis.")

    leads_data = []
    hot_leads_count = 0

    for p in places:
        name = p.get("displayName", {}).get("text", "Unknown")
        rating = p.get("rating", 0)
        reviews = p.get("userRatingCount", 0)
        address = p.get("formattedAddress", "-")
        website = p.get("websiteUri", "")
        phone = p.get("internationalPhoneNumber", "-")
        maps_link = p.get("googleMapsUri", "")
        reviews_data = p.get("reviews", [])
        primary_type = p.get("primaryType", "bisnis")
        
        # Buat slug bersih untuk URL demo
        slug = (
            name.lower()
            .replace(" ", "-")
            .replace("'", "")
            .replace("&", "dan")
            .replace(".", "")
            .replace(",", "")
            .replace("|", "")
            .replace("---", "-")
            .replace("--", "-")
        )

        is_high_reputation = rating >= 4.5 and reviews >= 10
        web_status = check_website_status(website)

        if web_status == "HOT_LEAD":
            lead_status = "🔥 HOT LEAD (Belum Punya Website)"
        elif web_status == "POTENTIAL":
            lead_status = "⚠️ POTENTIAL (Website Down/Mati)"
        else:
            lead_status = "✅ BIASA (Website Normal)"

        if web_status in ["HOT_LEAD", "POTENTIAL"] and is_high_reputation:
            print(f"✨ Memproses Lead Potensial: {name} ({rating}⭐ - {reviews} ulasan) - Tipe: {primary_type}")

            # 1. Cek apakah slug sudah ada di database
            if supabase:
                try:
                    res = supabase.table("business_demos").select("slug").eq("slug", slug).execute()
                    if len(res.data) > 0:
                        print(f"ℹ️ Lead {name} ({slug}) sudah ada di database. Lewati...")
                        continue
                except Exception as e:
                    print(f"⚠️ Gagal cek Supabase: {e}")

            hot_leads_count += 1

            # 2. Generate data demo (Metadata JSON) untuk web Next.js via AI
            demo_json = generate_demo_data_ai(name, rating, reviews, phone, address, maps_link, slug, reviews_data)
            
            # 3. Masukkan ke Database Supabase
            if demo_json and supabase:
                city = address.split(",")[-2].strip() if "," in address else "Kota"
                # Formatting nomor telp
                clean_phone = re.sub(r'[^0-9]', '', phone) if phone else "628123456789"
                if clean_phone.startswith('0'):
                    clean_phone = '62' + clean_phone[1:]
                
                try:
                    supabase.table("business_demos").insert({
                        "slug": slug,
                        "name": name,
                        "category": primary_type.replace("_", " ").title(),
                        "phone": clean_phone,
                        "city": city,
                        "maps_url": maps_link,
                        "metadata": demo_json
                    }).execute()
                    print(f"✅ Berhasil menyimpan {name} ke database Supabase!")
                except Exception as e:
                    print(f"❌ Gagal insert ke database: {e}")

            # 4. Notifikasi Real-time ke Telegram
            tele_msg = (
                f"🚀 *LEAD BISNIS BARU TERSIMPAN!*\n\n"
                f"🏷️ *{name}*\n"
                f"🏢 Kategori: {primary_type.replace('_', ' ').title()}\n"
                f"⭐ Rating: {rating} ({reviews} ulasan)\n"
                f"📍 Alamat: {address}\n"
                f"📞 Kontak: `{phone}`\n"
                f"🔗 Demo Otomatis: `https://growfin.my.id/demo/{slug}`\n"
                f"🗺️ Maps: [Buka Google Maps]({maps_link})\n"
            )
            send_telegram_msg(tele_msg)

        leads_data.append({
            "Nama Bisnis": name,
            "Kategori Status": lead_status,
            "Tipe Utama": primary_type,
            "Rating": rating,
            "Jumlah Ulasan": reviews,
            "No Telepon": phone,
            "Website Eksisting": website if website else "TIDAK ADA",
            "Alamat": address,
            "Slug Demo": slug,
            "Link Google Maps": maps_link
        })

    # [2/3] Export Hasil ke Excel
    df = pd.DataFrame(leads_data)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"leads_business_{timestamp}.xlsx"
    df.to_excel(filename, index=False)
    print(f"📊 [2/3] Rekapitulasi tersimpan di file: {filename}")

    # Notifikasi ringkasan
    send_telegram_msg(
        f"✅ *Scan Ekosistem Bisnis Selesai!*\n"
        f"📊 Total Fasilitas Terpindai: {len(places)}\n"
        f"🔥 Hot Leads Disimpan: {hot_leads_count}\n"
        f"📁 File Excel: `{filename}`"
    )
    print("🚀 [3/3] Pipeline selesai! Database telah ter-update otomatis tanpa build ulang.")


if __name__ == "__main__":
    # Contoh Koordinat: Sekitar Buahbatu / Rancasari Bandung
    LATITUDE = -6.948970398923055
    LONGITUDE = 107.62174563842646
    RADIUS_M = 5000  # Radius 5 km

    run_pipeline(LATITUDE, LONGITUDE, RADIUS_M)