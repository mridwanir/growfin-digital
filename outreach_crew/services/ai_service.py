import re
import json
from typing import Optional
from google import genai
from config.settings import GEMINI_API_KEY
from core.models import BusinessDemo

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_clinic_pitch(name: str, rating: float, reviews: int, address: str, slug: str) -> str:
    prompt = f"""
    Kamu adalah seorang calon pasien yang sedang mencari klinik di Google Maps dan ingin bertanya via WhatsApp.
    Tulis pesan WhatsApp yang natural, santai, namun tetap sopan kepada admin klinik:
    - Nama Klinik: {name}
    - Rating: {rating} ({reviews} ulasan)
    - Link Referensi (Demo): https://growfin.my.id/demo/{slug}

    Instruksi Khusus (PENTING - STRATEGI TROJAN HORSE):
    1. PERSONA PASIEN: 
       - Kamu murni calon pasien, BUKAN agensi atau konsultan. 
       - Sapa admin dengan santai (misal: "Halo min", "Siang admin [Nama Klinik]", atau "Permisi").
    
    2. ALUR PESAN (Make Sense & Manipulatif Halus):
       - Buka dengan bilang kamu lihat klinik ini di Google Maps dan tertarik karena ratingnya bagus ({rating}⭐).
       - Sampaikan keluhan (pain point): Kamu bingung/kesulitan mencari tahu rincian harga perawatan, jadwal dokter, atau katalog layanannya karena tidak ada link website di Maps/profil mereka.
       - Masukkan link: Tanya apakah mereka punya daftar layanan yang mudah dibaca seperti contoh link ini: https://growfin.my.id/demo/{slug}
       - Contoh gaya bahasa kalimat terakhir: "Saya nyari info harganya susah, apa klinik ini ada semacam katalog online yang rapi kayak gini ya min: [Link] biar saya gampang milihnya?"

    3. TONE & FORMAT:
       - Sangat singkat! Maksimal 3 kalimat pendek (40-60 kata).
       - Gunakan gaya chat WhatsApp asli orang Indonesia (boleh sedikit santai/singkatan wajar seperti "kalo", "yg", "buat").
       - DILARANG KERAS berjualan, menawarkan jasa, atau menggunakan kata-kata teknis seperti "simulasi reservasi" atau "referensi digital".
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"⚠️ Error Gemini Pitch: {e}")
        return f"Halo admin {name}, saya mau tanya jadwal dan harga perawatan ada? Soalnya saya cari di Google Maps gak ada website/katalognya. Apa ada katalog online kayak gini min biar gampang bacanya: https://growfin.my.id/demo/{slug}"

def generate_demo_data_ai(name: str, rating: float, reviews: int, phone: str, address: str, maps_url: str, slug: str, city: str = "Bandung") -> Optional[BusinessDemo]:
    clean_phone = re.sub(r'[^0-9]', '', phone)
    if clean_phone.startswith('0'):
        clean_phone = '62' + clean_phone[1:]
    elif not clean_phone:
        clean_phone = "6281234567890"

    prompt = f"""
    Buatkan struktur data JSON valid untuk klinik berikut sesuai skema:
    - Nama: {name}
    - Rating: {rating} ({reviews} ulasan)
    - Telepon: {phone}
    - WA Number: {clean_phone}
    - Alamat: {address}
    - Maps URL: {maps_url}
    - Kota: {city}
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": BusinessDemo
            }
        )
        raw_json = json.loads(response.text.strip())
        return BusinessDemo.model_validate(raw_json)
    except Exception as e:
        print(f"⚠️ Gagal validasi Pydantic / Gemini: {e}")
        return None