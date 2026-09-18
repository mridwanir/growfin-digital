import os
import re
import json
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
from google import genai
import subprocess

load_dotenv()

# ==========================================
# KONFIGURASI API & ENVIRONMENT
# ==========================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# Path ke file demos.ts di proyek Next.js Growfin Digital
DEMOS_TS_PATH = r"D:\Project\Growfin Digital\lib\demos.ts"

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


def search_health_clinics(lat: float, lng: float, radius_meters: int = 3000):
    """
    Cari klinik spesialis (Gigi, Estetika/Kulit, Fisioterapi) via Google Places API (New)
    """
    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": (
            "places.displayName,places.primaryType,places.rating,"
            "places.userRatingCount,places.formattedAddress,places.websiteUri,"
            "places.internationalPhoneNumber,places.googleMapsUri"
        )
    }
    payload = {
        # Kategori medis/kesehatan bernilai transaksi tinggi
        "includedTypes": [
            "dental_clinic",
            "skin_care_clinic",
            "physiotherapist",
            "doctor"
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


def generate_clinic_pitch(name: str, rating: float, reviews: int, address: str, slug: str) -> str:
    """
    Copywriter AI: Menyusun draf pesan WhatsApp outreach personal yang ringkas & alami
    """
    prompt = f"""
    Kamu adalah copywriter profesional B2B direct response spesialis klinik lokal.
    Buatkan pesan WhatsApp outreach pendek, ramah, dan manusiawi untuk penanggung jawab/owner klinik berikut:
    - Nama Klinik: {name}
    - Rating Google Maps: {rating} ({reviews} ulasan)
    - Alamat: {address}
    - Link Draf Simulasi: https://growfin.my.id/demo/{slug}

    Aturan:
    1. Sapaan sopan & hangat (Halo Dokter / Tim Manajemen {name}, salam kenal saya Ridwan dari Growfin).
    2. Puji rating {rating}⭐ dan {reviews}+ ulasannya di Google Maps.
    3. Notice halus bahwa di Maps belum ada link untuk pasien lihat daftar tindakan dan jadwal dokter secara cepat.
    4. Beri link demo https://growfin.my.id/demo/{slug} sebagai draf preview yang iseng dibuatkan.
    5. CTA santai / no pressure (sekadar sharing draf referensi).
    6. Maksimal 3 paragraf pendek, mudah dibaca di layar HP, hindari kata-kata jualan klise.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"⚠️ Error Gemini API (Pitch): {e}")
        return f"Halo Tim {name}, izin sharing draf simulasi reservasi klinik: https://growfin.my.id/demo/{slug}"


def generate_demo_data_ai(name: str, rating: float, reviews: int, phone: str, address: str, maps_url: str, slug: str) -> dict:
    """
    Menyusun struktur data BusinessDemo lengkap dalam format JSON valid menggunakan Gemini
    """
    clean_phone = re.sub(r'[^0-9]', '', phone)
    if clean_phone.startswith('0'):
        clean_phone = '62' + clean_phone[1:]
    elif not clean_phone:
        clean_phone = "6281234567890"

    prompt = f"""
    Kamu adalah sistem pembuat konten profil klinik kesehatan, gigi, & estetika.
    Buatkan struktur data JSON yang valid dan realistis untuk dimasukkan ke website demo berdasarkan data klinik berikut:
    - Nama Klinik: {name}
    - Rating: {rating} ({reviews} ulasan)
    - Telepon: {phone}
    - WA Number: {clean_phone}
    - Alamat: {address}
    - Maps URL: {maps_url}
    - Slug: {slug}

    Panduan Konten:
    1. Tentukan apakah klinik ini fokus ke Gigi (Dental), Estetika/Kulit (Skin/Beauty), atau Medis Umum.
    2. Buatkan 1 profil dokter penanggung jawab realistis (nama dokter, gelar, foto unspash tenaga medis, dan simulasi chat pasien-dokter).
    3. Buatkan 3-4 menu tindakan/layanan populer beserta estimasi harga dalam format 'Rp xxx.xxx' atau 'Mulai Rp xxx.xxx'.
    4. Buatkan tagline yang elegan dan relevan.

    Wajib return RAW JSON valid yang sesuai dengan skema TypeScript berikut (tanpa blok markdown lainnya):
    {{
      "name": "{name}",
      "category": "Kategori Spesifik Klinik",
      "city": "Bandung",
      "rating": {rating},
      "reviewCount": {reviews},
      "phone": "{phone}",
      "address": "{address}",
      "googleMapsUrl": "{maps_url}",
      "hours": "Senin - Sabtu: 09:00 - 20:00",
      "waNumber": "{clean_phone}",
      "tagline": "Tagline klinik yang menarik",
      "iconEmoji": "🦷 atau ✨ atau 🩺",
      "doctor": {{
        "name": "Nama Dokter Lengkap dengan Gelar",
        "role": "Spesialisasi Dokter",
        "avatarEmoji": "👩‍⚕️",
        "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
        "sampleChat": {{
          "user": "Pertanyaan keluhan pasien yang sering ditanyakan",
          "doctor": "Jawaban dokter yang ramah, jelas, dan mengarahkan untuk reservasi",
          "recommendationTitle": "Nama Paket Rekomendasi Tindakan",
          "recommendationDesc": "Deskripsi singkat tindakan medis"
        }}
      }},
      "categories": ["Semua", "Kategori Layanan 1", "Kategori Layanan 2", "Kategori Layanan 3"],
      "menu": [
        {{ "id": 1, "name": "Nama Layanan 1", "desc": "Deskripsi tindakan", "price": "Rp 250.000", "tag": "Populer", "category": "Kategori Layanan 1" }},
        {{ "id": 2, "name": "Nama Layanan 2", "desc": "Deskripsi tindakan", "price": "Rp 750.000", "tag": "Best Seller", "category": "Kategori Layanan 2" }},
        {{ "id": 3, "name": "Nama Layanan 3", "desc": "Deskripsi tindakan", "price": "Mulai Rp 1.500.000", "category": "Kategori Layanan 3" }}
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


def append_to_demos_ts(slug: str, data_dict: dict, file_path: str = DEMOS_TS_PATH) -> bool:
    """
    Menyuntikkan entri klinik baru ke dalam objek DEMO_DATA pada file demos.ts
    """
    if not os.path.exists(file_path):
        print(f"⚠️ File tidak ditemukan di path: {file_path}")
        return False

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Cek jika slug sudah ada agar tidak duplikat
        if f'"{slug}":' in content or f"'{slug}':" in content:
            print(f"ℹ️ Data untuk slug '{slug}' sudah ada di demos.ts. Lewati inject.")
            return True

        # Format objek JSON baru
        formatted_json = json.dumps(data_dict, indent=2, ensure_ascii=False)
        
        # Beri indentasi agar rapi di TypeScript
        indented_lines = ["  " + line for line in formatted_json.splitlines()]
        formatted_entry = f'  "{slug}": ' + "\n".join(indented_lines).lstrip() + ",\n\n"

        target_str = "export const DEMO_DATA: Record<string, BusinessDemo> = {"
        if target_str in content:
            updated_content = content.replace(target_str, f"{target_str}\n{formatted_entry}")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print(f"✅ Berhasil auto-inject slug '{slug}' ke {file_path}")
            return True
        else:
            print(f"⚠️ Marker '{target_str}' tidak ditemukan di {file_path}")
            return False

    except Exception as e:
        print(f"⚠️ Gagal mengupdate demos.ts: {e}")
        return False
import subprocess

PROJECT_WEB_DIR = r"D:\Project\Growfin Digital"

def auto_git_push(commit_message: str = "chore: auto-add new clinic demo data") -> bool:
    """
    Menjalankan git add, commit, dan push secara otomatis di folder Next.js
    """
    try:
        print("🔄 [Git] Memulai proses sinkronisasi git & auto-deploy...")
        
        # 1. Git Add
        subprocess.run(["git", "add", "lib/demos.ts"], cwd=PROJECT_WEB_DIR, check=True)
        
        # Cek apakah ada perubahan yang ter-stage
        status_check = subprocess.run(
            ["git", "diff", "--cached", "--quiet"], 
            cwd=PROJECT_WEB_DIR
        )
        
        # Jika returncode == 0 artinya tidak ada perubahan file yang perlu di-commit
        if status_check.returncode == 0:
            print("ℹ️ [Git] Tidak ada perubahan baru pada demos.ts untuk di-push.")
            return True

        # 2. Git Commit
        subprocess.run(
            ["git", "commit", "-m", commit_message], 
            cwd=PROJECT_WEB_DIR, 
            check=True
        )

        # 3. Git Push (ke branch main / master aktif)
        subprocess.run(["git", "push"], cwd=PROJECT_WEB_DIR, check=True)
        
        print("🚀 [Git] Berhasil push ke GitHub! Auto-deployment Vercel/Hosting sedang berjalan.")
        return True

    except subprocess.CalledProcessError as e:
        print(f"⚠️ [Git] Gagal melakukan operasi git: {e}")
        return False
    except Exception as e:
        print(f"⚠️ [Git] Terjadi error tak terduga: {e}")
        return False

def run_pipeline(lat: float, lng: float, radius: int = 3000):
    print(f"🏥 [1/4] Memindai klinik & layanan kesehatan dalam radius {radius}m...")
    places = search_health_clinics(lat, lng, radius)
    print(f"📍 Ditemukan {len(places)} fasilitas kesehatan.")

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

        # Kriteria Hot Lead Klinik:
        # Rating >= 4.5, ulasan >= 10, dan belum punya web mandiri
        is_no_proper_website = (
            not website 
            or "google.com" in website 
            or "instagram.com" in website
            or "linktr.ee" in website
            or "tiktok.com" in website
        )
        is_high_reputation = rating >= 4.5 and reviews >= 10

        if is_no_proper_website and is_high_reputation:
            lead_status = "🔥 HOT LEAD (Klinik Potensial Tanpa Web Reservasi)"
            hot_leads_count += 1
            print(f"✨ Memproses Hot Lead: {name} ({rating}⭐ - {reviews} ulasan)...")

            # 1. Generate data demo untuk web Next.js via AI
            demo_json = generate_demo_data_ai(name, rating, reviews, phone, address, maps_link, slug)
            
            # 2. Auto-inject langsung ke demos.ts
            if demo_json:
                append_to_demos_ts(slug, demo_json)

            # 3. Generate pitch personal via Gemini
            pitch_text = generate_clinic_pitch(name, rating, reviews, address, slug)

            # 4. Notifikasi Real-time ke Telegram
            tele_msg = (
                f"🏥 *HOT LEAD KLINIK DITEMUKAN!*\n\n"
                f"🏷️ *{name}*\n"
                f"⭐ Rating: {rating} ({reviews} ulasan)\n"
                f"📍 Alamat: {address}\n"
                f"📞 Kontak: `{phone}`\n"
                f"🌐 Web Eksisting: {website if website else 'Tidak Ada'}\n"
                f"🔗 Demo Reservasi: `https://growfin.my.id/demo/{slug}`\n"
                f"🗺️ Maps: [Buka Google Maps]({maps_link})\n\n"
                f"📝 *Draf WhatsApp Outreach:*\n```\n{pitch_text}\n```"
            )
            send_telegram_msg(tele_msg)
        else:
            lead_status = "Biasa / Sudah Ada Web Mandiri"
            pitch_text = "-"

        leads_data.append({
            "Nama Klinik": name,
            "Kategori Status": lead_status,
            "Rating": rating,
            "Jumlah Ulasan": reviews,
            "No Telepon": phone,
            "Website Eksisting": website if website else "TIDAK ADA",
            "Alamat": address,
            "Slug Demo": slug,
            "Draft WhatsApp Outreach": pitch_text,
            "Link Google Maps": maps_link
        })

    # [3/4] Export Hasil ke Excel
    df = pd.DataFrame(leads_data)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"leads_klinik_{timestamp}.xlsx"
    df.to_excel(filename, index=False)
    print(f"📊 [3/4] Rekapitulasi tersimpan di file: {filename}")

    # Notifikasi ringkasan
    send_telegram_msg(
        f"✅ *Audit Lead Klinik Selesai!*\n"
        f"📊 Total Fasilitas Terpindai: {len(places)}\n"
        f"🔥 Hot Leads Klinik: {hot_leads_count}\n"
        f"📁 File Excel: `{filename}`"
    )
    print("🚀 [4/4] Pipeline selesai! Notifikasi ringkasan telah terkirim.")
    # Di dalam fungsi run_pipeline() setelah loop places selesai:

    if hot_leads_count > 0:
        print(f"\n📦 Ditemukan {hot_leads_count} Hot Lead baru. Melakukan auto-deploy...")
        git_success = auto_git_push(f"feat: auto-inject {hot_leads_count} new clinic demo leads")
        if git_success:
            send_telegram_msg("🚀 *Auto Deploy:* Perubahan data `demos.ts` telah di-push ke GitHub & sedang live!")


if __name__ == "__main__":
    # Contoh Koordinat: Sekitar Buahbatu / Rancasari Bandung
     
    LATITUDE = -6.948970398923055
    LONGITUDE = 107.62174563842646
    RADIUS_M = 5000  # Radius 5 km untuk mencakup area sentral klinik

    run_pipeline(LATITUDE, LONGITUDE, RADIUS_M)